/** Shared between the browser form components and the API route. Keep free of server-only imports. */

export const formIds = [
  "franchise",
  "product-request",
  "manufacturer",
  "retailer",
  "contact",
  "location-interest",
] as const;

export type FormId = (typeof formIds)[number];

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** Limits enforced on the server; the browser uses them for early feedback. */
export const uploadLimits = {
  imageMaxBytes: 4 * 1024 * 1024,
  catalogueMaxBytes: 4 * 1024 * 1024,
  imageTypes: ["image/jpeg", "image/png", "image/webp"],
  catalogueTypes: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
} as const;

export const productPriceRanges = [
  { value: "up-to-99", label: "Up to ₹99" },
  { value: "100-299", label: "₹100 – ₹299" },
  { value: "300-999", label: "₹300 – ₹999" },
  { value: "1000-plus", label: "₹1,000 or more" },
  { value: "not-sure", label: "Not sure" },
] as const;

export const retailerBusinessTypes = [
  { value: "retailer", label: "Retailer" },
  { value: "wholesaler", label: "Wholesaler" },
  { value: "distributor", label: "Distributor" },
  { value: "supplier", label: "Supplier / trader" },
  { value: "other", label: "Other local business" },
] as const;

export const retailerProposals = [
  { value: "distribution", label: "Product distribution" },
  { value: "wholesale", label: "Wholesale supply" },
  { value: "local-sourcing", label: "Local sourcing" },
  { value: "regional", label: "Regional partnership" },
  { value: "other", label: "Something else" },
] as const;

export const contactTopics = [
  { value: "general", label: "General question" },
  { value: "product-request", label: "An existing product request" },
  { value: "franchise", label: "Franchise" },
  { value: "manufacturer", label: "Manufacturing / supply" },
  { value: "retailer", label: "Retail or distribution partnership" },
  { value: "property", label: "Proposing a commercial property" },
  { value: "other", label: "Something else" },
] as const;

export const HELP_CHOOSE_BRANCH = "help-me-choose";
