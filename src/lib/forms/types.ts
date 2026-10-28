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

export const HELP_CHOOSE_BRANCH = "help-me-choose";
