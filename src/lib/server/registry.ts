import "server-only";
import type { z } from "zod";
import { type FormId, HELP_CHOOSE_BRANCH } from "@/lib/forms/types";
import { contactTopics } from "@/content/contact";
import { productPriceRanges } from "@/content/product-requests";
import { retailerBusinessTypes, retailerProposals } from "@/content/partnerships";
import { franchise } from "@/content/franchise";
import { collectionStores } from "@/content/stores";
import {
  contactSchema,
  franchiseSchema,
  locationInterestSchema,
  manufacturerSchema,
  productRequestSchema,
  retailerSchema,
} from "@/lib/server/schemas";

type FormConfig = {
  label: string;
  table: string;
  prefix: string;
  schema: z.ZodType<Record<string, unknown>>;
  /** Field names that may hold several values (checkbox groups). */
  arrays?: string[];
  file?: { field: string; kind: "image" | "catalogue"; column: string };
  /** Extra rule needing both the parsed data and the presence of a file. */
  check?: (data: Record<string, unknown>, hasFile: boolean) => Record<string, string> | null;
  subject: (data: Record<string, unknown>, reference: string) => string;
  /**
   * Fields for the business notification email, in display order. Option
   * fields list their choices so the email shows what the visitor saw.
   */
  fields: [key: string, label: string, options?: Options][];
};

type Options = readonly { value: string; label: string }[];

const branchOptions: Options = [
  ...collectionStores.map((s) => ({ value: s.slug, label: `${s.name} (${s.locality}, ${s.city})` })),
  { value: HELP_CHOOSE_BRANCH, label: "Asked us to help choose" },
];
const branchName = (slug: unknown) => branchOptions.find((o) => o.value === slug)?.label ?? String(slug);

export const forms: Record<FormId, FormConfig> = {
  franchise: {
    label: "New franchise enquiry",
    table: "franchise_enquiries",
    prefix: "FR",
    schema: franchiseSchema,
    subject: (d, ref) => `Franchise enquiry ${ref} — ${d.city}, ${d.state}`,
    fields: [
      ["fullName", "Name"],
      ["phone", "Mobile"],
      ["email", "Email"],
      ["city", "City"],
      ["state", "State"],
      ["preferredLocation", "Preferred outlet location"],
      ["propertyStatus", "Commercial property", franchise.propertyOptions],
      ["investmentReadiness", "Investment readiness", franchise.investmentReadiness],
      ["experience", "Retail / business experience"],
      ["additionalInfo", "Additional information"],
    ],
  },
  "product-request": {
    label: "New product request",
    table: "product_requests",
    prefix: "PR",
    schema: productRequestSchema,
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
  },
  manufacturer: {
    label: "New manufacturer enquiry",
    table: "manufacturer_enquiries",
    prefix: "MF",
    schema: manufacturerSchema,
    arrays: ["categories"],
    file: { field: "catalogue", kind: "catalogue", column: "catalogue_path" },
    subject: (d, ref) => `Manufacturer enquiry ${ref} — ${d.companyName}`,
    fields: [
      ["companyName", "Company / unit"],
      ["contactPerson", "Contact person"],
      ["phone", "Phone"],
      ["email", "Email"],
      ["location", "Manufacturing location"],
      ["categories", "Categories"],
      ["productDescription", "Products"],
      ["websiteUrl", "Website / catalogue URL"],
      ["moq", "Minimum order quantity"],
      ["capacity", "Production / supply capability"],
      ["additionalInfo", "Additional details"],
    ],
  },
  retailer: {
    label: "New retailer / distributor enquiry",
    table: "retailer_enquiries",
    prefix: "RT",
    schema: retailerSchema,
    subject: (d, ref) => `Retailer enquiry ${ref} — ${d.businessName}`,
    fields: [
      ["businessName", "Business"],
      ["contactPerson", "Contact person"],
      ["phone", "Phone"],
      ["email", "Email"],
      ["location", "Location"],
      ["businessType", "Business type", retailerBusinessTypes],
      ["categories", "Product categories"],
      ["proposal", "Proposed partnership", retailerProposals],
      ["comments", "Comments"],
    ],
  },
  contact: {
    label: "New website enquiry",
    table: "contact_enquiries",
    prefix: "GE",
    schema: contactSchema,
    subject: (d, ref) => `Website enquiry ${ref} — ${d.topic}`,
    fields: [
      ["name", "Name"],
      ["phone", "Mobile"],
      ["email", "Email"],
      ["topic", "Topic", contactTopics],
      ["message", "Message"],
    ],
  },
  "location-interest": {
    label: "New store-location interest",
    table: "location_interest",
    prefix: "LI",
    schema: locationInterestSchema,
    subject: (d, ref) => `Store interest ${ref} — ${d.city}, ${d.state}`,
    fields: [
      ["name", "Name"],
      ["phone", "Mobile"],
      ["city", "Town / city"],
      ["state", "State"],
      ["note", "Note"],
    ],
  },
};

/** The rows for the notification email, with option codes replaced by their labels. */
export function notificationFields(config: FormConfig, data: Record<string, unknown>): [string, unknown][] {
  return config.fields.map(([key, label, options]) => {
    const value = data[key];
    const match = options?.find((o) => o.value === value);
    return [label, match ? match.label : value];
  });
}
