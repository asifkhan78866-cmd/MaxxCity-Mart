import "server-only";
import { z } from "zod";
import { productPriceRanges } from "@/content/product-requests";
import { collectionStores } from "@/content/stores";
import { defineForm, type Options } from "@/lib/forms/define-form";
import {
  consent,
  mobile,
  oneOf,
  optional,
  optionalEmail,
  optionalOneOf,
  optionalUrl,
  required,
} from "@/lib/forms/fields";
import { HELP_CHOOSE_BRANCH } from "./constants";

/** Only verified branches that accept collections, plus "help me choose". */
const branchOptions: Options = [
  ...collectionStores.map((s) => ({ value: s.slug, label: `${s.name} (${s.locality}, ${s.city})` })),
  { value: HELP_CHOOSE_BRANCH, label: "Asked us to help choose" },
];
const branchName = (slug: string) => branchOptions.find((o) => o.value === slug)?.label ?? slug;

export const productRequestForm = defineForm({
  id: "product-request",
  label: "New product request",
  table: "product_requests",
  prefix: "PR",
  schema: z
    .object({
      productName: optional(160),
      productUrl: optionalUrl,
      description: optional(1500),
      variant: optional(300),
      quantity: z.coerce
        .number({ error: "Please enter a quantity." })
        .int("Please enter a whole number.")
        .min(1, "Quantity must be at least 1.")
        .max(1000, "For more than 1,000 units, please call us."),
      priceRange: optionalOneOf(productPriceRanges),
      branch: oneOf(branchOptions, "Please choose a collection branch, or ask us to help you choose."),
      preferredCity: optional(80),
      name: required("your name"),
      phone: mobile,
      email: optionalEmail,
      notes: optional(1500),
      consent,
    })
    .superRefine((d, ctx) => {
      if (d.branch === HELP_CHOOSE_BRANCH && !d.preferredCity) {
        ctx.addIssue({
          code: "custom",
          path: ["preferredCity"],
          message: "Tell us your town or city so we can suggest a branch.",
        });
      }
    }),
  file: { field: "image", kind: "image", column: "image_path" },
  check: (d, hasFile) =>
    hasFile || d.productName || d.productUrl || d.description
      ? null
      : { productName: "Add a photo, a product name, a link or a short description so we know what to look for." },
  subject: (d, ref) => `Product request ${ref} — ${branchName(d.branch)}`,
  fields: [
    ["productName", "Product"],
    ["description", "Description"],
    ["productUrl", "Product link"],
    ["variant", "Colour / size / variant"],
    ["quantity", "Quantity"],
    ["priceRange", "Expected price range", productPriceRanges],
    ["branch", "Collection branch", branchOptions],
    ["preferredCity", "Customer's town or city"],
    ["name", "Name"],
    ["phone", "Mobile"],
    ["email", "Email"],
    ["notes", "Notes"],
  ],
});
