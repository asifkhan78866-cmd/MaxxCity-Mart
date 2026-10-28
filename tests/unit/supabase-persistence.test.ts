import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * persistSubmission against an in-memory stand-in for the Supabase client.
 * This checks our handling of Supabase's responses; it is not a substitute
 * for a test against a real Supabase project.
 */

type Row = Record<string, unknown>;
type DbError = { code?: string; message: string };

const fake = vi.hoisted(() => {
  const state = {
    rows: new Map<string, Row[]>(),
    objects: new Map<string, { bytes: Uint8Array; contentType: string }>(),
    lookupError: null as string | null,
    uploadError: null as string | null,
    /** Called before each insert; may return an error to simulate a failure. */
    onInsert: null as ((row: Row, rows: Row[]) => DbError | null) | null,
    signed: [] as { path: string; options?: { download?: boolean } }[],
  };
  const client = {
    from(table: string) {
      const rows = state.rows.get(table) ?? state.rows.set(table, []).get(table)!;
      return {
        select: () => ({
          eq: (column: string, value: unknown) => ({
            maybeSingle: async () =>
              state.lookupError
                ? { data: null, error: { message: state.lookupError } }
                : { data: rows.find((r) => r[column] === value) ?? null, error: null },
          }),
        }),
        insert: async (row: Row) => {
          const injected = state.onInsert?.(row, rows);
          if (injected) return { error: injected };
          if (rows.some((r) => r.reference === row.reference || r.submission_id === row.submission_id)) {
            return { error: { code: "23505", message: "duplicate key value violates unique constraint" } };
          }
          rows.push(row);
          return { error: null };
        },
      };
    },
    storage: {
      from: () => ({
        upload: async (path: string, bytes: Uint8Array, opts: { contentType: string }) => {
          if (state.uploadError) return { error: { message: state.uploadError } };
          state.objects.set(path, { bytes, contentType: opts.contentType });
          return { error: null };
        },
        remove: async (paths: string[]) => {
          paths.forEach((p) => state.objects.delete(p));
          return { error: null };
        },
        createSignedUrl: async (path: string, _seconds: number, options?: { download?: boolean }) => {
          state.signed.push({ path, options });
          return { data: { signedUrl: `https://signed.example/${path}` }, error: null };
        },
      }),
    },
  };
  return { state, client };
});

vi.mock("@supabase/supabase-js", () => ({ createClient: () => fake.client }));

const { persistSubmission, storageMode } = await import("@/lib/storage/submissions");

const photo = { bytes: Buffer.from([1, 2, 3]), contentType: "image/jpeg", extension: "jpg", originalName: "IMG_1.jpg" };
const pdf = { bytes: Buffer.from("%PDF-"), contentType: "application/pdf", extension: "pdf", originalName: "cat.pdf" };

const input = (overrides: Partial<Parameters<typeof persistSubmission>[0]> = {}) => ({
  form: "product-request",
  table: "product_requests",
  prefix: "PR",
  submissionId: crypto.randomUUID(),
  data: { productName: "Lunch box", quantity: 2 },
  ...overrides,
});

beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "https://project.supabase.co");
  vi.stubEnv("SUPABASE_SECRET_KEY", "test-secret");
  fake.state.rows.clear();
  fake.state.objects.clear();
  fake.state.signed.length = 0;
  fake.state.lookupError = null;
  fake.state.uploadError = null;
  fake.state.onInsert = null;
});

describe("persistSubmission with Supabase", () => {
  it("uses Supabase when it is configured", () => {
    expect(storageMode()).toBe("supabase");
  });

  it("inserts a snake_case row with status 'new' and links the private upload", async () => {
    const result = await persistSubmission(input({ file: { column: "image_path", prepared: photo } }));
    const [row] = fake.state.rows.get("product_requests")!;
    expect(row).toMatchObject({ reference: result.reference, status: "new", product_name: "Lunch box", quantity: 2 });
    expect(row?.image_original_name).toBe("IMG_1.jpg");
    expect(fake.state.objects.has(String(row?.image_path))).toBe(true);
    expect(String(row?.image_path)).toMatch(new RegExp(`^product-request/\\d{4}-\\d{2}/${result.reference}/[0-9a-f-]+\\.jpg$`));
    expect(result).toMatchObject({ duplicate: false, fileLink: `https://signed.example/${row?.image_path}` });
    expect(fake.state.signed[0]?.options).toBeUndefined();
  });

  it("makes catalogue PDF links download instead of opening inline", async () => {
    await persistSubmission(
      input({ form: "manufacturer", table: "manufacturer_enquiries", prefix: "MF", file: { column: "catalogue_path", prepared: pdf } }),
    );
    expect(fake.state.signed[0]?.options).toEqual({ download: true });
  });

  it("returns the existing reference for a repeated submission without uploading again", async () => {
    const submissionId = crypto.randomUUID();
    const first = await persistSubmission(input({ submissionId }));
    const again = await persistSubmission(input({ submissionId, file: { column: "image_path", prepared: photo } }));
    expect(again).toEqual({ reference: first.reference, duplicate: true, fileLink: null });
    expect(fake.state.objects.size).toBe(0);
  });

  it("handles a retry that races the first request", async () => {
    const submissionId = crypto.randomUUID();
    fake.state.onInsert = (row, rows) => {
      fake.state.onInsert = null;
      rows.push({ ...row, reference: "PR-261029-FIRST" });
      return { code: "23505", message: "duplicate key value violates unique constraint" };
    };
    const result = await persistSubmission(input({ submissionId, file: { column: "image_path", prepared: photo } }));
    expect(result).toEqual({ reference: "PR-261029-FIRST", duplicate: true, fileLink: null });
    expect(fake.state.objects.size).toBe(0);
  });

  it("picks a new reference if the generated one already exists", async () => {
    let collisions = 1;
    fake.state.onInsert = () => (collisions-- > 0 ? { code: "23505", message: "reference already exists" } : null);
    const result = await persistSubmission(input({ file: { column: "image_path", prepared: photo } }));
    expect(result.duplicate).toBe(false);
    expect(fake.state.rows.get("product_requests")).toHaveLength(1);
    expect(fake.state.objects.size).toBe(1);
  });

  it("removes the upload and reports the error when the insert fails", async () => {
    fake.state.onInsert = () => ({ code: "42501", message: "permission denied for table product_requests" });
    await expect(persistSubmission(input({ file: { column: "image_path", prepared: photo } }))).rejects.toThrow(
      /permission denied/,
    );
    expect(fake.state.objects.size).toBe(0);
  });

  it("stops before uploading when the lookup fails", async () => {
    fake.state.lookupError = 'relation "product_requests" does not exist';
    await expect(persistSubmission(input({ file: { column: "image_path", prepared: photo } }))).rejects.toThrow(
      /does not exist/,
    );
    expect(fake.state.objects.size).toBe(0);
  });

  it("reports upload failures", async () => {
    fake.state.uploadError = "Bucket not found";
    await expect(persistSubmission(input({ file: { column: "image_path", prepared: photo } }))).rejects.toThrow(
      /Bucket not found/,
    );
    expect(fake.state.rows.get("product_requests") ?? []).toHaveLength(0);
  });
});
