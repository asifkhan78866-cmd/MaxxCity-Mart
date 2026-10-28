import "server-only";
import { z } from "zod";
import { indianStates } from "@/content/regions";

/**
 * Reusable Zod field schemas for the enquiry forms. Messages are written for
 * visitors: they appear under the field that needs correcting.
 */

export const required = (label: string, max = 120, min = 2) =>
  z
    .string({ error: `Please enter ${label}.` })
    .trim()
    .min(min, `Please enter ${label}.`)
    .max(max, `Please keep this under ${max} characters.`);

export const optional = (max = 1000) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .optional()
    .transform((v) => v || null);

/** Indian mobile numbers in any common format; stored as +91XXXXXXXXXX. */
export const mobile = z
  .string({ error: "Please enter your mobile number." })
  .transform((v) => v.replace(/[\s\-().]/g, "").replace(/^(\+91|0091|0)/, "").replace(/^91(?=\d{10}$)/, ""))
  .refine((v) => /^[6-9]\d{9}$/.test(v), "Please enter a valid 10-digit Indian mobile number.")
  .transform((v) => `+91${v}`);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const optionalEmail = z
  .string()
  .trim()
  .max(200)
  .optional()
  .refine((v) => !v || EMAIL.test(v), "Please enter a valid email address.")
  .transform((v) => v || null);

export const requiredEmail = z
  .string({ error: "Please enter an email address." })
  .trim()
  .max(200)
  .refine((v) => EMAIL.test(v), "Please enter a valid email address.");

/** http(s) links only; "example.com/x" becomes "https://example.com/x". */
export const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
  .refine((v) => {
    if (!v) return true;
    const u = URL.parse(v);
    return u !== null && (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes(".");
  }, "Please enter a valid web address, e.g. https://example.com/product")
  .transform((v) => v || null);

type Options = readonly { value: string }[];

const values = (options: Options) => {
  const list = options.map((o) => o.value);
  if (list.length === 0) throw new Error("An option list must not be empty");
  return list as [string, ...string[]];
};

/** One of the `value`s from a content option list. */
export const oneOf = (options: Options, message: string) => z.enum(values(options), { error: message });

export const optionalOneOf = (options: Options) =>
  z
    .enum(values(options))
    .optional()
    .transform((v) => v ?? null);

export const indianState = z.enum(indianStates, { error: "Please choose a state." });

/** The consent checkbox posts "yes"; stored as true. */
export const consent = z.literal("yes", { error: "Please tick the box to confirm." }).transform(() => true);
