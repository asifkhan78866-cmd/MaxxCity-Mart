import "server-only";
import type { z } from "zod";
import type { FormId } from "@/lib/forms/types";

export type Options = readonly { value: string; label: string }[];

type FormSchema = z.ZodType<Record<string, unknown>, Record<string, unknown>>;

/**
 * Everything the server needs to know about one enquiry form: how to
 * validate it, where to store it, and how to describe it to the business.
 * The shared pipeline in ./submit.ts does the rest.
 */
export type FormDefinition<S extends FormSchema = FormSchema> = {
  id: FormId;
  /** Heading of the notification email, e.g. "New franchise enquiry". */
  label: string;
  /** Supabase table (see supabase/migrations). */
  table: string;
  /** Reference prefix, e.g. "FR" for FR-261029-K7Q2M. Must be unique per form. */
  prefix: string;
  schema: S;
  /** Fields that may hold several values (checkbox groups). */
  arrays?: (keyof z.output<S> & string)[];
  /** Optional upload: the form field, how to validate it, and the column for its storage path. */
  file?: { field: string; kind: "image" | "catalogue"; column: string };
  /** Rules that need both the parsed data and whether a file was uploaded. Returns field errors, or null. */
  check?(data: z.output<S>, hasFile: boolean): Record<string, string> | null;
  /** Subject line of the notification email. */
  subject(data: z.output<S>, reference: string): string;
  /** Rows of the notification email, in order. Option fields list their choices so labels are shown. */
  fields: [key: keyof z.output<S> & string, label: string, options?: Options][];
};

/** Declares a form with full type-checking of its field names against its schema. */
export const defineForm = <S extends FormSchema>(definition: FormDefinition<S>) => definition;

/** Rows for the notification email, with option codes replaced by the labels the visitor saw. */
export function notificationFields(definition: FormDefinition, data: Record<string, unknown>): [string, unknown][] {
  return definition.fields.map(([key, label, options]) => {
    const value = data[key];
    const match = options?.find((o) => o.value === value);
    return [label, match ? match.label : value];
  });
}
