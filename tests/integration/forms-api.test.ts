import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

// after() only works inside a Next.js request; collect the deferred tasks instead.
const deferred = vi.hoisted(() => [] as (() => Promise<void> | void)[]);
vi.mock("next/server", () => ({ after: (task: () => Promise<void> | void) => void deferred.push(task) }));

import { POST } from "@/app/api/forms/[form]/route";
import { file, jpegWithExif, validPayloads } from "../support/fixtures";
import { formRequest, routeContext } from "../support/requests";

/**
 * Exercises the real route handler end to end with the development
 * file store (Supabase is not configured in tests).
 */

let dir: string;

beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "mcm-forms-"));
  vi.stubEnv("LOCAL_SUBMISSIONS_DIR", dir);
  vi.stubEnv("SUPABASE_URL", "");
  vi.stubEnv("SUPABASE_SECRET_KEY", "");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
  vi.stubEnv("RESEND_API_KEY", "");
});

afterAll(async () => {
  vi.unstubAllEnvs();
  await rm(dir, { recursive: true, force: true });
});

afterEach(() => {
  vi.stubEnv("NODE_ENV", "test");
});

const send = async (form: string, req: Request) => {
  const res = await POST(req as never, routeContext(form) as never);
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
};

const records = async (table: string) =>
  (await readFile(path.join(dir, `${table}.jsonl`), "utf8"))
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l) as Record<string, unknown>);

describe("successful submissions", () => {
  it.each([
    ["franchise", "franchise_enquiries", /^FR-/],
    ["product-request", "product_requests", /^PR-/],
    ["manufacturer", "manufacturer_enquiries", /^MF-/],
    ["retailer", "retailer_enquiries", /^RT-/],
    ["contact", "contact_enquiries", /^GE-/],
    ["location-interest", "location_interest", /^LI-/],
  ] as const)("%s is saved with a reference", async (form, table, prefix) => {
    const { status, body } = await send(form, await formRequest(form, validPayloads[form]));
    expect(status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.reference).toMatch(prefix);

    const saved = (await records(table)).find((r) => r.reference === body.reference);
    expect(saved?.status).toBe("new");
    expect(saved?.consent).toBe(true);
  });

  it("normalises the phone number before saving", async () => {
    const { body } = await send("contact", await formRequest("contact", { ...validPayloads.contact, phone: "098765 43210" }));
    const saved = (await records("contact_enquiries")).find((r) => r.reference === body.reference);
    expect(saved?.phone).toBe("+919876543210");
  });

  it("saves a product photo with its metadata removed", async () => {
    const photo = file(await jpegWithExif(), "IMG_9.jpg", "image/jpeg");
    const { status, body } = await send(
      "product-request",
      await formRequest("product-request", { ...validPayloads["product-request"], image: photo }),
    );
    expect(status).toBe(201);
    const saved = (await records("product_requests")).find((r) => r.reference === body.reference);
    const stored = path.join(dir, "uploads", String(saved?.image_path));
    expect((await sharp(await readFile(stored)).metadata()).exif).toBeUndefined();
    // The stored path never contains the customer's name or number.
    expect(String(saved?.image_path)).not.toMatch(/Test|9876/);
  });

  it("accepts a photo on its own, without a product name", async () => {
    const { productName: _omit, ...rest } = validPayloads["product-request"];
    const photo = file(await jpegWithExif(), "IMG_2.jpg", "image/jpeg");
    const { status } = await send("product-request", await formRequest("product-request", { ...rest, image: photo }));
    expect(status).toBe(201);
  });
});

describe("notifications", () => {
  it("schedules the business email after the response, once per new submission", async () => {
    deferred.length = 0;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const submissionId = crypto.randomUUID();
    await send("contact", await formRequest("contact", validPayloads.contact, { submissionId }));
    await send("contact", await formRequest("contact", validPayloads.contact, { submissionId }));
    expect(deferred).toHaveLength(1);

    // Email is not configured in tests, and the outcome is logged truthfully.
    await deferred[0]?.();
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/saved; notification not-configured/));
    warn.mockRestore();
  });
});

describe("duplicate protection", () => {
  it("returns the original reference when the same submission is retried", async () => {
    const submissionId = crypto.randomUUID();
    const first = await send("franchise", await formRequest("franchise", validPayloads.franchise, { submissionId }));
    const retry = await send("franchise", await formRequest("franchise", validPayloads.franchise, { submissionId }));
    expect(first.status).toBe(201);
    expect(retry.status).toBe(200);
    expect(retry.body.reference).toBe(first.body.reference);
    expect((await records("franchise_enquiries")).filter((r) => r.submission_id === submissionId)).toHaveLength(1);
  });
});

describe("validation", () => {
  it("returns a message for each invalid field", async () => {
    const { status, body } = await send("franchise", await formRequest("franchise", { fullName: "R", phone: "123" }));
    expect(status).toBe(422);
    expect(Object.keys(body.fieldErrors as object)).toEqual(
      expect.arrayContaining(["fullName", "phone", "city", "state", "preferredLocation", "consent"]),
    );
  });

  it("needs a photo, name, link or description for a product request", async () => {
    const { productName: _omit, ...rest } = validPayloads["product-request"];
    const { status, body } = await send("product-request", await formRequest("product-request", rest));
    expect(status).toBe(422);
    expect(body.fieldErrors).toHaveProperty("productName");
  });

  it("rejects a disguised non-image upload", async () => {
    const fake = file(new TextEncoder().encode("MZ executable"), "photo.jpg", "image/jpeg");
    const { status, body } = await send(
      "product-request",
      await formRequest("product-request", { ...validPayloads["product-request"], image: fake }),
    );
    expect(status).toBe(422);
    expect(body.fieldErrors).toHaveProperty("image");
  });

  it("returns 404 for an unknown form", async () => {
    const { status } = await send("orders", await formRequest("orders", {}));
    expect(status).toBe(404);
  });
});

describe("abuse protection", () => {
  it("rejects a filled honeypot", async () => {
    const req = await formRequest("contact", validPayloads.contact, { hidden: { _website: "http://spam.example" } });
    expect((await send("contact", req)).status).toBe(400);
  });

  it("rejects forms submitted faster than a person could fill them", async () => {
    const req = await formRequest("contact", validPayloads.contact, { startedAt: Date.now() });
    expect((await send("contact", req)).status).toBe(400);
  });

  it("rejects a malformed submission id", async () => {
    const req = await formRequest("contact", validPayloads.contact, { submissionId: "abc" });
    expect((await send("contact", req)).status).toBe(400);
  });

  it("rejects cross-site submissions", async () => {
    const req = await formRequest("contact", validPayloads.contact, { origin: "https://evil.example" });
    expect((await send("contact", req)).status).toBe(403);
  });

  it("accepts a same-site submission arriving through a proxy", async () => {
    const req = await formRequest("contact", validPayloads.contact, { origin: "https://maxxcity.example" });
    req.headers.set("x-forwarded-host", "maxxcity.example");
    expect((await send("contact", req)).status).toBe(201);
  });

  it("requires a declared body size", async () => {
    const req = await formRequest("contact", validPayloads.contact, { omitContentLength: true });
    expect((await send("contact", req)).status).toBe(411);
  });

  it("rejects bodies over the upload limit before reading them", async () => {
    const req = await formRequest("contact", validPayloads.contact);
    req.headers.set("content-length", String(5 * 1024 * 1024));
    expect((await send("contact", req)).status).toBe(413);
  });

  it("rate-limits repeated submissions from one address", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 12; i++) {
      statuses.push((await send("contact", await formRequest("contact", validPayloads.contact, { ip: "203.0.113.9" }))).status);
    }
    expect(statuses.slice(0, 10).every((s) => s === 201)).toBe(true);
    expect(statuses.slice(10)).toEqual([429, 429]);
  });
});

describe("production safety", () => {
  it("refuses submissions in production when Supabase is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const before = await readdir(dir);
    const { status, body } = await send("contact", await formRequest("contact", validPayloads.contact));
    expect(status).toBe(503);
    expect(body.ok).toBe(false);
    expect(String(body.message)).toMatch(/call or WhatsApp us on \+91 91007 70398/);
    expect(await readdir(dir)).toEqual(before);
  });
});
