import "server-only";
import { z } from "zod";
import { retailerBusinessTypes, retailerProposals } from "@/content/partnerships";
import { defineForm } from "@/lib/forms/define-form";
import { consent, mobile, oneOf, optional, optionalEmail, required } from "@/lib/forms/fields";

export const retailerForm = defineForm({
  id: "retailer",
  label: "New retailer / distributor enquiry",
  table: "retailer_enquiries",
  prefix: "RT",
  schema: z.object({
    businessName: required("your business name", 160),
    contactPerson: required("a contact person", 120),
    phone: mobile,
    email: optionalEmail,
    location: required("your business location", 200),
    businessType: oneOf(retailerBusinessTypes, "Please choose your business type."),
    categories: required("the product categories you deal in", 500),
    proposal: oneOf(retailerProposals, "Please choose the kind of partnership you have in mind."),
    comments: optional(2000),
    consent,
  }),
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
});
