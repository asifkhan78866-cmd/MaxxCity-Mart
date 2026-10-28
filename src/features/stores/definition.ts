import "server-only";
import { z } from "zod";
import { defineForm } from "@/lib/forms/define-form";
import { consent, indianState, mobile, optional, required } from "@/lib/forms/fields";

/** "Open a store in my town" — interest in a future location, not a franchise application. */
export const locationInterestForm = defineForm({
  id: "location-interest",
  label: "New store-location interest",
  table: "location_interest",
  prefix: "LI",
  schema: z.object({
    name: required("your name"),
    phone: mobile,
    city: required("your town or city", 80),
    state: indianState,
    note: optional(1000),
    consent,
  }),
  subject: (d, ref) => `Store interest ${ref} — ${d.city}, ${d.state}`,
  fields: [
    ["name", "Name"],
    ["phone", "Mobile"],
    ["city", "Town / city"],
    ["state", "State"],
    ["note", "Note"],
  ],
});
