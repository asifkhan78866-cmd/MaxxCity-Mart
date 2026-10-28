import "server-only";
import { z } from "zod";
import { franchise, indianStates, supplierCategories } from "@/content/site";
import { collectionStores } from "@/content/stores";
import {
  HELP_CHOOSE_BRANCH,
  contactTopics,
  productPriceRanges,
  retailerBusinessTypes,
  retailerProposals,
} from "@/lib/forms/types";

/* ---------- Field building blocks ---------- */

const required = (label: string, max = 120, min = 2) =>
  z
    .string({ error: `Please enter ${label}.` })
    .trim()
    .min(min, `Please enter ${label}.`)
    .max(max, `Please keep this under ${max} characters.`);

const optional = (max = 1000) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .optional()
    .transform((v) => v || null);

/** Indian mobile numbers; stored as +91XXXXXXXXXX. */
const mobile = z
  .string({ error: "Please enter your mobile number." })
  .transform((v) => v.replace(/[\s\-().]/g, "").replace(/^(\+91|0091|0)/, "").replace(/^91(?=\d{10}$)/, ""))
  .refine((v) => /^[6-9]\d{9}$/.test(v), "Please enter a valid 10-digit Indian mobile number.")
  .transform((v) => `+91${v}`);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const optionalEmail = z
  .string()
  .trim()
  .max(200)
  .optional()
  .refine((v) => !v || EMAIL.test(v), "Please enter a valid email address.")
  .transform((v) => v || null);
const requiredEmail = z
  .string({ error: "Please enter an email address." })
  .trim()
  .max(200)
  .refine((v) => EMAIL.test(v), "Please enter a valid email address.");

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
  .refine((v) => {
    if (!v) return true;
    try {
      const u = new URL(v);
      return (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes(".");
    } catch {
      return false;
    }
  }, "Please enter a valid web address, e.g. https://example.com/product")
  .transform((v) => v || null);

const oneOf = <T extends readonly { value: string }[]>(options: T, message: string) =>
  z.enum(options.map((o) => o.value) as [string, ...string[]], { error: message });

const state = z.enum(indianStates as unknown as [string, ...string[]], { error: "Please choose a state." });

const consent = z.literal("yes", { error: "Please tick the box to confirm." }).transform(() => true);

/* ---------- Form schemas ---------- */

export const franchiseSchema = z.object({
  fullName: required("your full name"),
  phone: mobile,
  email: optionalEmail,
  city: required("your city", 80),
  state,
  preferredLocation: required("the area where you would like to open", 200),
  propertyStatus: oneOf(franchise.propertyOptions, "Please tell us about your property."),
  experience: optional(1500),
  investmentReadiness: oneOf(franchise.investmentReadiness, "Please choose the option closest to your situation."),
  additionalInfo: optional(2000),
  consent,
});

const branchValues: [string, ...string[]] = [HELP_CHOOSE_BRANCH, ...collectionStores.map((s) => s.slug)];

export const productRequestSchema = z
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
    priceRange: z
      .enum(productPriceRanges.map((o) => o.value) as [string, ...string[]])
      .optional()
      .transform((v) => v ?? null),
    branch: z.enum(branchValues, { error: "Please choose a collection branch, or ask us to help you choose." }),
    preferredCity: optional(80),
    name: required("your name"),
    phone: mobile,
    email: optionalEmail,
    notes: optional(1500),
    consent,
  })
  .superRefine((d, ctx) => {
    if (d.branch === HELP_CHOOSE_BRANCH && !d.preferredCity) {
      ctx.addIssue({ code: "custom", path: ["preferredCity"], message: "Tell us your town or city so we can suggest a branch." });
    }
  });

export const manufacturerSchema = z.object({
  companyName: required("your company or unit name", 160),
  contactPerson: required("a contact person", 120),
  phone: mobile,
  email: requiredEmail,
  location: required("your manufacturing location", 200),
  categories: z
    .array(z.enum(supplierCategories as unknown as [string, ...string[]]))
    .min(1, "Please choose at least one product category."),
  productDescription: required("a short description of your products", 2000, 10),
  websiteUrl: optionalUrl,
  moq: optional(200),
  capacity: optional(500),
  additionalInfo: optional(2000),
  consent,
});

export const retailerSchema = z.object({
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
});

export const contactSchema = z.object({
  name: required("your name"),
  phone: mobile,
  email: optionalEmail,
  topic: oneOf(contactTopics, "Please choose a topic."),
  message: required("your message", 2000, 5),
  consent,
});

export const locationInterestSchema = z.object({
  name: required("your name"),
  phone: mobile,
  city: required("your town or city", 80),
  state,
  note: optional(1000),
  consent,
});
