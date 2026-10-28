import "server-only";
import { z } from "zod";
import { supplierCategories } from "@/content/categories";
import { defineForm } from "@/lib/forms/define-form";
import { consent, mobile, optional, optionalUrl, required, requiredEmail } from "@/lib/forms/fields";

export const manufacturerForm = defineForm({
  id: "manufacturer",
  label: "New manufacturer enquiry",
  table: "manufacturer_enquiries",
  prefix: "MF",
  schema: z.object({
    companyName: required("your company or unit name", 160),
    contactPerson: required("a contact person", 120),
    phone: mobile,
    email: requiredEmail,
    location: required("your manufacturing location", 200),
    categories: z.array(z.enum(supplierCategories)).min(1, "Please choose at least one product category."),
    productDescription: required("a short description of your products", 2000, 10),
    websiteUrl: optionalUrl,
    moq: optional(200),
    capacity: optional(500),
    additionalInfo: optional(2000),
    consent,
  }),
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
});
