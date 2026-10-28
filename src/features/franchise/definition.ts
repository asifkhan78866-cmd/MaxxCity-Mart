import "server-only";
import { z } from "zod";
import { franchise } from "@/content/franchise";
import { defineForm } from "@/lib/forms/define-form";
import { consent, indianState, mobile, oneOf, optional, optionalEmail, required } from "@/lib/forms/fields";

export const franchiseForm = defineForm({
  id: "franchise",
  label: "New franchise enquiry",
  table: "franchise_enquiries",
  prefix: "FR",
  schema: z.object({
    fullName: required("your full name"),
    phone: mobile,
    email: optionalEmail,
    city: required("your city", 80),
    state: indianState,
    preferredLocation: required("the area where you would like to open", 200),
    propertyStatus: oneOf(franchise.propertyOptions, "Please tell us about your property."),
    experience: optional(1500),
    investmentReadiness: oneOf(franchise.investmentReadiness, "Please choose the option closest to your situation."),
    additionalInfo: optional(2000),
    consent,
  }),
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
});
