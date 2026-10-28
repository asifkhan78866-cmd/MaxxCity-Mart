import "server-only";
import type { z } from "zod";
import type { FormId } from "@/lib/forms/types";
import { HELP_CHOOSE_BRANCH } from "@/lib/forms/types";
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
  /** Labels for the business notification email, in display order. */
  fields: [key: string, label: string][];
};

const branchName = (slug: unknown) =>
  slug === HELP_CHOOSE_BRANCH ? "Asked us to help choose" : (collectionStores.find((s) => s.slug === slug)?.name ?? String(slug));

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
      ["propertyStatus", "Commercial property"],
      ["investmentReadiness", "Investment readiness"],
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
      ["priceRange", "Expected price range"],
      ["branch", "Collection branch"],
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
      ["businessType", "Business type"],
      ["categories", "Product categories"],
      ["proposal", "Proposed partnership"],
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
      ["topic", "Topic"],
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

export function displayValue(key: string, value: unknown) {
  return key === "branch" ? branchName(value) : value;
}
