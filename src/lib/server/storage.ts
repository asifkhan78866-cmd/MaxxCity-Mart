import "server-only";
import { randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, appendFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { PreparedFile } from "@/lib/server/files";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "enquiry-uploads";
const SIGNED_URL_SECONDS = 60 * 60 * 24 * 7;

let client: SupabaseClient | null = null;

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

/** "supabase" in production; "local" (JSON files in .data/) only during development. */
export function storageMode(): "supabase" | "local" | "unavailable" {
  if (supabase()) return "supabase";
  if (process.env.NODE_ENV !== "production") return "local";
  return "unavailable";
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

async function persistSupabase({ form, table, prefix, submissionId, data, file }: PersistInput): Promise<PersistResult> {
  const db = supabase()!;

  const existing = await db.from(table).select("reference").eq("submission_id", submissionId).maybeSingle();
  if (existing.data?.reference) return { reference: existing.data.reference, duplicate: true, fileLink: null };

  const reference = makeReference(prefix);
  const row: Record<string, unknown> = { reference, submission_id: submissionId, status: "new" };
  for (const [k, v] of Object.entries(data)) row[snake(k)] = v;

  let uploadedPath: string | null = null;
  if (file) {
    const month = new Date().toISOString().slice(0, 7);
    uploadedPath = `${form}/${month}/${reference}/${randomUUID()}.${file.prepared.extension}`;
    const up = await db.storage.from(BUCKET).upload(uploadedPath, file.prepared.bytes, {
      contentType: file.prepared.contentType,
      upsert: false,
    });
    if (up.error) throw new Error(`Upload failed: ${up.error.message}`);
    row[file.column] = uploadedPath;
    row[`${file.column.replace(/_path$/, "")}_original_name`] = file.prepared.originalName;
  }

  const insert = await db.from(table).insert(row);
  if (insert.error) {
    if (uploadedPath) await db.storage.from(BUCKET).remove([uploadedPath]);
    // A retry of the same submission raced us: return the reference already saved.
    if (insert.error.code === "23505") {
      const again = await db.from(table).select("reference").eq("submission_id", submissionId).maybeSingle();
      if (again.data?.reference) return { reference: again.data.reference, duplicate: true, fileLink: null };
    }
    throw new Error(`Insert into ${table} failed: ${insert.error.message}`);
  }

  let fileLink: string | null = null;
  if (uploadedPath) {
    const signed = await db.storage.from(BUCKET).createSignedUrl(uploadedPath, SIGNED_URL_SECONDS);
    fileLink = signed.data?.signedUrl ?? null;
  }
  return { reference, duplicate: false, fileLink };
}

/* ---------- Development fallback: newline-delimited JSON in .data/ (git-ignored) ---------- */

const LOCAL_DIR = path.join(process.cwd(), ".data");

async function persistLocal({ form, table, prefix, submissionId, data, file }: PersistInput): Promise<PersistResult> {
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
