import { describe, expect, it } from "vitest";
import {
  contactSchema,
  franchiseSchema,
  locationInterestSchema,
  manufacturerSchema,
  productRequestSchema,
  retailerSchema,
} from "@/lib/server/schemas";
import { validPayloads } from "../support/fixtures";

const issues = (result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) =>
  result.error?.issues.map((i) => String(i.path[0])) ?? [];

describe("form schemas accept valid submissions", () => {
  it.each([
    ["franchise", franchiseSchema],
    ["product-request", productRequestSchema],
    ["manufacturer", manufacturerSchema],
    ["retailer", retailerSchema],
    ["contact", contactSchema],
    ["location-interest", locationInterestSchema],
  ] as const)("%s", (form, schema) => {
    const result = schema.safeParse(validPayloads[form]);
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
  });
});

describe("mobile numbers", () => {
  it.each(["9876543210", "+91 98765 43210", "+919876543210", "09876543210", "98765-43210", "0091 9876543210"])(
    "normalises %s to +91XXXXXXXXXX",
    (phone) => {
      const result = contactSchema.safeParse({ ...validPayloads.contact, phone });
      expect(result.success).toBe(true);
      expect(result.data?.phone).toBe("+919876543210");
    },
  );

  it.each(["12345", "5876543210", "98765432101", "abcdefghij", ""])("rejects %s", (phone) => {
    expect(issues(contactSchema.safeParse({ ...validPayloads.contact, phone }))).toContain("phone");
  });
});

describe("validation rules", () => {
  it("requires consent on every form", () => {
    const { consent: _omit, ...withoutConsent } = validPayloads.franchise;
    expect(issues(franchiseSchema.safeParse(withoutConsent))).toContain("consent");
  });

  it("stores consent as a boolean", () => {
    expect(franchiseSchema.parse(validPayloads.franchise).consent).toBe(true);
  });

  it("rejects options that are not offered", () => {
    expect(issues(franchiseSchema.safeParse({ ...validPayloads.franchise, investmentReadiness: "guaranteed" }))).toContain(
      "investmentReadiness",
    );
    expect(issues(franchiseSchema.safeParse({ ...validPayloads.franchise, state: "Atlantis" }))).toContain("state");
  });

  it("only accepts verified collection branches", () => {
    expect(issues(productRequestSchema.safeParse({ ...validPayloads["product-request"], branch: "hyderabad" }))).toContain(
      "branch",
    );
  });

  it("asks for a town when the customer wants help choosing a branch", () => {
    const result = productRequestSchema.safeParse({ ...validPayloads["product-request"], branch: "help-me-choose" });
    expect(issues(result)).toContain("preferredCity");
    expect(
      productRequestSchema.safeParse({ ...validPayloads["product-request"], branch: "help-me-choose", preferredCity: "Nirmal" })
        .success,
    ).toBe(true);
  });

  it("bounds the requested quantity", () => {
    for (const quantity of ["0", "1001", "2.5", "lots"]) {
      expect(issues(productRequestSchema.safeParse({ ...validPayloads["product-request"], quantity }))).toContain("quantity");
    }
  });

  it("adds https:// to product links and rejects non-web links", () => {
    const ok = productRequestSchema.parse({ ...validPayloads["product-request"], productUrl: "example.com/item" });
    expect(ok.productUrl).toBe("https://example.com/item");
    expect(
      issues(productRequestSchema.safeParse({ ...validPayloads["product-request"], productUrl: "javascript:alert(1)" })),
    ).toContain("productUrl");
  });

  it("requires at least one manufacturer category", () => {
    expect(issues(manufacturerSchema.safeParse({ ...validPayloads.manufacturer, categories: [] }))).toContain("categories");
  });

  it("requires a valid email from manufacturers but not from customers", () => {
    expect(issues(manufacturerSchema.safeParse({ ...validPayloads.manufacturer, email: "not-an-email" }))).toContain("email");
    expect(contactSchema.parse(validPayloads.contact).email).toBeNull();
  });

  it("enforces maximum lengths", () => {
    expect(issues(contactSchema.safeParse({ ...validPayloads.contact, message: "x".repeat(2001) }))).toContain("message");
  });
});
