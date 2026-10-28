import "server-only";
import { randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, appendFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { PreparedFile } from "@/lib/server/files";
import { localStoreEnv, supabaseEnv } from "@/lib/config/env";

const SIGNED_URL_SECONDS = 60 * 60 * 24 * 7;

let cached: { key: string; client: SupabaseClient } | null = null;

function supabase() {
  const env = supabaseEnv();
  if (env.status !== "configured") return null;
  const { url, secretKey, bucket } = env.config;
  if (cached?.key !== `${url}|${secretKey}`) {
    cached = {
      key: `${url}|${secretKey}`,
      client: createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } }),
    };
  }
  return { db: cached.client, bucket };
}

/**
 * Where submissions go: Supabase when configured; JSON files only in local
 * development and tests; otherwise nowhere, and the API refuses submissions.
 * A half-configured Supabase is treated as unavailable everywhere, so a
 * missing key can never silently divert real submissions to local files.
 */
export function storageMode(): "supabase" | "local" | "unavailable" {
  const env = supabaseEnv();
  if (env.status === "configured") return "supabase";
  if (env.status === "incomplete") {
    console.error(`[storage] Supabase is only partly configured; missing ${env.missing.join(", ")}.`);
    return "unavailable";
  }
  return localStoreEnv().allowed ? "local" : "unavailable";
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Human-friendly reference, e.g. FR-261029-K7Q2M. Contains no personal data. */
export function makeReference(prefix: string, now = new Date()) {
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const date = ist.toISOString().slice(2, 10).replace(/-/g, "");
  let code = "";
  for (let i = 0; i < 5; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return `${prefix}-${date}-${code}`;
}

const snake = (key: string) => key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

type PersistInput = {
  form: string;
  table: string;
  prefix: string;
  submissionId: string;
  data: Record<string, unknown>;
  file?: { column: string; prepared: PreparedFile } | null;
};

export type PersistResult = { reference: string; duplicate: boolean; fileLink: string | null };

export async function persistSubmission(input: PersistInput): Promise<PersistResult> {
  const mode = storageMode();
  if (mode === "supabase") return persistSupabase(input);
  if (mode === "local") return persistLocal(input);
  throw new Error("Submission storage is not configured");
}

const UNIQUE_VIOLATION = "23505";
const MAX_REFERENCE_ATTEMPTS = 3;

async function findBySubmission(db: SupabaseClient, table: string, submissionId: string) {
  const { data, error } = await db.from(table).select("reference").eq("submission_id", submissionId).maybeSingle();
  if (error) throw new Error(`Lookup in ${table} failed: ${error.message}`);
  return (data as { reference: string } | null)?.reference ?? null;
}

async function persistSupabase({ form, table, prefix, submissionId, data, file }: PersistInput): Promise<PersistResult> {
  const { db, bucket } = supabase()!;

  const existing = await findBySubmission(db, table, submissionId);
  if (existing) return { reference: existing, duplicate: true, fileLink: null };

  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) fields[snake(k)] = v;

  for (let attempt = 1; attempt <= MAX_REFERENCE_ATTEMPTS; attempt++) {
    const reference = makeReference(prefix);
    const row: Record<string, unknown> = { ...fields, reference, submission_id: submissionId, status: "new" };

    let uploadedPath: string | null = null;
    if (file) {
      const month = new Date().toISOString().slice(0, 7);
      uploadedPath = `${form}/${month}/${reference}/${randomUUID()}.${file.prepared.extension}`;
      const up = await db.storage.from(bucket).upload(uploadedPath, file.prepared.bytes, {
        contentType: file.prepared.contentType,
        upsert: false,
      });
      if (up.error) throw new Error(`Upload failed: ${up.error.message}`);
      row[file.column] = uploadedPath;
      row[`${file.column.replace(/_path$/, "")}_original_name`] = file.prepared.originalName;
    }

    const insert = await db.from(table).insert(row);
    if (!insert.error) {
      return { reference, duplicate: false, fileLink: uploadedPath ? await signedLink(db, bucket, uploadedPath) : null };
    }

    // Never leave an orphaned file behind a failed insert.
    if (uploadedPath) {
      const removed = await db.storage.from(bucket).remove([uploadedPath]);
      if (removed.error) console.error(`[storage] Could not remove orphaned upload ${uploadedPath}: ${removed.error.message}`);
    }
    if (insert.error.code !== UNIQUE_VIOLATION) {
      throw new Error(`Insert into ${table} failed: ${insert.error.message}`);
    }
    // A retry of the same submission raced us: return the reference already saved.
    const raced = await findBySubmission(db, table, submissionId);
    if (raced) return { reference: raced, duplicate: true, fileLink: null };
    // Otherwise the generated reference collided with an existing one; try a new one.
  }
  throw new Error(`Could not allocate a unique reference in ${table}`);
}

/** Private, expiring link for the notification email. PDFs download rather than open in the browser. */
async function signedLink(db: SupabaseClient, bucket: string, filePath: string) {
  const options = filePath.endsWith(".pdf") ? { download: true } : undefined;
  const { data, error } = await db.storage.from(bucket).createSignedUrl(filePath, SIGNED_URL_SECONDS, options);
  if (error) console.error(`[storage] Could not sign ${filePath}: ${error.message}`);
  return data?.signedUrl ?? null;
}

/* ---------- Development fallback: newline-delimited JSON in .data/ (git-ignored) ---------- */

async function persistLocal({ form, table, prefix, submissionId, data, file }: PersistInput): Promise<PersistResult> {
  const LOCAL_DIR = localStoreEnv().dir ?? path.join(process.cwd(), ".data");
  await mkdir(LOCAL_DIR, { recursive: true });
  const logFile = path.join(LOCAL_DIR, `${table}.jsonl`);
  const prior = await readFile(logFile, "utf8").catch(() => "");
  for (const line of prior.split("\n")) {
    if (!line) continue;
    const rec = JSON.parse(line) as { submission_id: string; reference: string };
    if (rec.submission_id === submissionId) return { reference: rec.reference, duplicate: true, fileLink: null };
  }

  const reference = makeReference(prefix);
  const row: Record<string, unknown> = {
    reference,
    submission_id: submissionId,
    status: "new",
    created_at: new Date().toISOString(),
  };
  for (const [k, v] of Object.entries(data)) row[snake(k)] = v;

  if (file) {
    const dir = path.join(LOCAL_DIR, "uploads", form, reference);
    await mkdir(dir, { recursive: true });
    const name = `${randomUUID()}.${file.prepared.extension}`;
    await writeFile(path.join(dir, name), file.prepared.bytes);
    row[file.column] = `${form}/${reference}/${name}`;
  }

  await appendFile(logFile, `${JSON.stringify(row)}\n`);
  return { reference, duplicate: false, fileLink: null };
}
