import { z } from "zod";
import { describe, expect, it } from "vitest";
import { findForm, forms } from "@/lib/forms/registry";
import { formIds } from "@/lib/forms/types";
import { checkDeclaredSize, checkHuman, checkSameOrigin, readSubmissionId } from "@/lib/security/request-guards";

describe("form registry", () => {
  const definitions = Object.values(forms);

  it("has a definition for every form id, under its own id", () => {
    for (const id of formIds) expect(forms[id].id).toBe(id);
  });

  it("gives every form a unique table and reference prefix", () => {
    expect(new Set(definitions.map((d) => d.table)).size).toBe(definitions.length);
    expect(new Set(definitions.map((d) => d.prefix)).size).toBe(definitions.length);
  });

  it("only lists schema fields in notification emails", () => {
    for (const d of definitions) {
      expect(d.schema).toBeInstanceOf(z.ZodObject);
      const shape = (d.schema as unknown as z.ZodObject).shape;
      for (const [key] of d.fields) expect(Object.keys(shape), `${d.id}.${key}`).toContain(key);
    }
  });

  it("rejects unknown form ids", () => {
    expect(findForm("orders")).toBeNull();
    expect(findForm("__proto__")).toBeNull();
    expect(findForm("contact")?.id).toBe("contact");
  });
});

describe("request guards", () => {
  it("allows same-origin and Origin-less requests, rejects other sites", () => {
    expect(checkSameOrigin(new Headers({ origin: "https://a.example", host: "a.example" }))).toBeNull();
    expect(checkSameOrigin(new Headers({ host: "a.example" }))).toBeNull();
    expect(checkSameOrigin(new Headers({ origin: "https://evil.example", host: "a.example" }))?.status).toBe(403);
    expect(checkSameOrigin(new Headers({ origin: "null", host: "a.example" }))?.status).toBe(403);
  });

  it("uses the forwarded host behind a proxy", () => {
    const headers = new Headers({ origin: "https://a.example", host: "internal:3000", "x-forwarded-host": "a.example" });
    expect(checkSameOrigin(headers)).toBeNull();
  });

  it("requires a declared body size within the limit", () => {
    expect(checkDeclaredSize(new Headers())?.status).toBe(411);
    expect(checkDeclaredSize(new Headers({ "content-length": "abc" }))?.status).toBe(413);
    expect(checkDeclaredSize(new Headers({ "content-length": String(5 * 1024 * 1024) }))?.status).toBe(413);
    expect(checkDeclaredSize(new Headers({ "content-length": "1024" }))).toBeNull();
  });

  it("flags honeypot and too-fast submissions", () => {
    const now = Date.UTC(2026, 9, 29);
    const fd = (fields: Record<string, string>) => {
      const f = new FormData();
      Object.entries(fields).forEach(([k, v]) => f.set(k, v));
      return f;
    };
    expect(checkHuman(fd({ _startedAt: String(now - 10_000) }), now)).toBeNull();
    expect(checkHuman(fd({ _startedAt: String(now - 1_000) }), now)?.status).toBe(400);
    expect(checkHuman(fd({ _startedAt: String(now - 10_000), _website: "x" }), now)?.status).toBe(400);
  });

  it("rejects a missing or implausible start time", () => {
    const now = Date.now();
    const fd = (startedAt?: string) => {
      const f = new FormData();
      if (startedAt !== undefined) f.set("_startedAt", startedAt);
      return f;
    };
    expect(checkHuman(fd(), now)?.status).toBe(400);
    expect(checkHuman(fd(""), now)?.status).toBe(400);
    expect(checkHuman(fd("0"), now)?.status).toBe(400);
    expect(checkHuman(fd("1"), now)?.status).toBe(400);
    expect(checkHuman(fd(String(now + 3_600_000)), now)?.status).toBe(400);
    expect(checkHuman(fd("12e11"), now)?.status).toBe(400);
  });

  it("accepts only UUID submission ids", () => {
    const fd = new FormData();
    fd.set("_submissionId", "8d3b7a0e-4f5c-4a8b-9c1d-2e3f4a5b6c7d");
    expect(readSubmissionId(fd)).toBe("8d3b7a0e-4f5c-4a8b-9c1d-2e3f4a5b6c7d");
    fd.set("_submissionId", "1; drop table");
    expect(readSubmissionId(fd)).toBeNull();
  });
});
