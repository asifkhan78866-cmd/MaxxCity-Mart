import { describe, expect, it } from "vitest";
import { makeReference } from "@/lib/storage/references";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";

describe("makeReference", () => {
  it("uses the prefix, the India date and an unambiguous code", () => {
    // 20:00 UTC on 28 Oct is 01:30 on 29 Oct in India.
    const ref = makeReference("PR", new Date("2026-10-28T20:00:00Z"));
    expect(ref).toMatch(/^PR-261029-[A-HJ-NP-Z2-9]{5}$/);
  });

  it("does not repeat across many calls", () => {
    const refs = new Set(Array.from({ length: 2000 }, () => makeReference("FR")));
    expect(refs.size).toBe(2000);
  });
});

describe("rateLimit", () => {
  it("allows up to the limit within the window, then blocks", () => {
    const key = `test:${crypto.randomUUID()}`;
    for (let i = 0; i < 3; i++) expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    const blocked = rateLimit(key, 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after the window", async () => {
    const key = `test:${crypto.randomUUID()}`;
    expect(rateLimit(key, 1, 20).ok).toBe(true);
    expect(rateLimit(key, 1, 20).ok).toBe(false);
    await new Promise((r) => setTimeout(r, 30));
    expect(rateLimit(key, 1, 20).ok).toBe(true);
  });
});

describe("clientIp", () => {
  it("uses the first forwarded address", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))).toBe("1.2.3.4");
    expect(clientIp(new Headers({ "x-real-ip": "5.6.7.8" }))).toBe("5.6.7.8");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
