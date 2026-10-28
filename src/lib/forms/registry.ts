import "server-only";
import { contactForm } from "@/features/contact/definition";
import { franchiseForm } from "@/features/franchise/definition";
import { manufacturerForm } from "@/features/manufacturers/definition";
import { productRequestForm } from "@/features/product-requests/definition";
import { retailerForm } from "@/features/retailers/definition";
import { locationInterestForm } from "@/features/stores/definition";
import type { FormDefinition } from "@/lib/forms/define-form";
import { type FormId, formIds } from "@/lib/forms/types";

/** Every form the API accepts, keyed by the id in /api/forms/[form]. */
export const forms: Record<FormId, FormDefinition> = {
  franchise: franchiseForm,
  "product-request": productRequestForm,
  manufacturer: manufacturerForm,
  retailer: retailerForm,
  contact: contactForm,
  "location-interest": locationInterestForm,
};

export const findForm = (id: string): FormDefinition | null =>
  (formIds as readonly string[]).includes(id) ? forms[id as FormId] : null;
