"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Copy, Loader2 } from "lucide-react";
import type { FormId, SubmitResult } from "@/lib/forms/types";
import { contact } from "@/content/contact";
import { type AnalyticsEvent, track } from "@/lib/analytics/track";
import { telHref } from "@/lib/links";

/* ---------- Context shared by the form and its fields ---------- */

type Ctx = {
  errors: Record<string, string>;
  clearError: (name: string) => void;
  setFile: (name: string, file: File | null) => void;
  setFileError: (name: string, message: string | null) => void;
};

const FormCtx = createContext<Ctx | null>(null);

export function useFormKit() {
  const ctx = useContext(FormCtx);
  if (!ctx) throw new Error("Form fields must be used inside <EnquiryForm>");
  return ctx;
}

/* ---------- Client-side checks (the server re-validates everything) ---------- */

type Validatable = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function messageFor(el: Validatable) {
  const v = el.validity;
  if (v.valueMissing) {
    if (el instanceof HTMLInputElement && el.type === "checkbox") return el.dataset.requiredMsg ?? "Please tick this box.";
    return el.dataset.requiredMsg ?? "This field is required.";
  }
  if (v.typeMismatch && el.type === "email") return "Please enter a valid email address.";
  if (v.typeMismatch) return "Please check this value.";
  if (v.patternMismatch) return el.dataset.patternMsg ?? "Please check the format.";
  if (v.tooShort && "minLength" in el) return `Please enter at least ${el.minLength} characters.`;
  if (v.tooLong && "maxLength" in el) return `Please keep this under ${el.maxLength} characters.`;
  if (v.rangeUnderflow || v.rangeOverflow) return el.dataset.rangeMsg ?? "Please enter a value in the allowed range.";
  if (v.stepMismatch || v.badInput) return "Please enter a whole number.";
  return el.validationMessage || "Please check this field.";
}

function focusField(form: HTMLFormElement, name: string) {
  const el =
    (form.querySelector(`[name="${CSS.escape(name)}"]`) as HTMLElement | null) ??
    (form.querySelector(`[data-field="${CSS.escape(name)}"]`) as HTMLElement | null);
  el?.focus();
  el?.scrollIntoView({ block: "center", behavior: "smooth" });
}

/* ---------- The form ---------- */

export function EnquiryForm({
  form,
  event,
  submitLabel,
  confirmation,
  children,
  className = "",
}: {
  form: FormId;
  event: AnalyticsEvent;
  submitLabel: string;
  confirmation: { title: string; nextSteps: ReactNode; links?: { href: string; label: string }[] };
  children: ReactNode;
  className?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const files = useRef<Record<string, File | null>>({});
  const fileErrors = useRef<Record<string, string>>({});
  const submissionId = useRef<string | null>(null);
  const startedAt = useRef(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [banner, setBanner] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const setFile = useCallback((name: string, file: File | null) => {
    files.current[name] = file;
  }, []);

  const setFileError = useCallback((name: string, message: string | null) => {
    if (message) fileErrors.current[name] = message;
    else delete fileErrors.current[name];
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  }, []);

  const showErrors = (found: Record<string, string>, message: string) => {
    setErrors(found);
    setBanner(message);
    setStatus("error");
    const first = Object.keys(found)[0];
    requestAnimationFrame(() => {
      if (first && formRef.current) focusField(formRef.current, first);
      else bannerRef.current?.focus();
    });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const el = e.currentTarget;

    const found: Record<string, string> = { ...fileErrors.current };
    for (const field of Array.from(el.elements)) {
      if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement))
        continue;
      if (!field.name || field.name.startsWith("_") || field.disabled) continue;
      if (!field.checkValidity()) found[field.name] ??= messageFor(field);
    }
    if (Object.keys(found).length) {
      const n = Object.keys(found).length;
      showErrors(found, `Please correct ${n === 1 ? "the highlighted field" : `the ${n} highlighted fields`}.`);
      return;
    }

    setStatus("submitting");
    setBanner(null);
    submissionId.current ??= crypto.randomUUID();

    const fd = new FormData(el);
    fd.set("_submissionId", submissionId.current);
    fd.set("_startedAt", String(startedAt.current));
    for (const [name, file] of Object.entries(files.current)) {
      fd.delete(name);
      if (file) fd.set(name, file, file.name);
    }

    let result: SubmitResult;
    try {
      const res = await fetch(`/api/forms/${form}`, { method: "POST", body: fd });
      result = (await res.json()) as SubmitResult;
    } catch {
      showErrors({}, `We couldn't reach our server. Please check your connection and try again, or call ${contact.phoneDisplay}.`);
      return;
    }

    if (result.ok) {
      track(event);
      setReference(result.reference);
      return;
    }
    showErrors(result.fieldErrors ?? {}, result.message);
  }

  if (reference) {
    return <Confirmation reference={reference} {...confirmation} />;
  }

  return (
    <FormCtx.Provider value={{ errors, clearError, setFile, setFileError }}>
      <form
        ref={formRef}
        noValidate
        onSubmit={onSubmit}
        onInput={(e) => {
          const name = (e.target as HTMLInputElement).name;
          if (name) clearError(name);
        }}
        className={`space-y-6 ${className}`}
        aria-busy={status === "submitting"}
      >
        <div
          ref={bannerRef}
          tabIndex={-1}
          role="alert"
          className={banner ? "flex gap-3 rounded-xl border border-price-red/30 bg-[#fdecec] p-4 text-sm text-[#7a0f14]" : "sr-only"}
        >
          {banner && (
            <>
              <AlertCircle aria-hidden className="size-5 shrink-0" />
              <p>{banner}</p>
            </>
          )}
        </div>

        {children}

        {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Leave this field empty
            <input type="text" name="_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-blue px-7 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue-deep disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {status === "submitting" && <Loader2 aria-hidden className="size-5 animate-spin" />}
          {status === "submitting" ? "Submitting…" : submitLabel}
        </button>
        <p className="sr-only" aria-live="polite">
          {status === "submitting" ? "Submitting your form, please wait." : ""}
        </p>
      </form>
    </FormCtx.Provider>
  );
}

function Confirmation({
  reference,
  title,
  nextSteps,
  links,
}: {
  reference: string;
  title: string;
  nextSteps: ReactNode;
  links?: { href: string; label: string }[];
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  return (
    <div role="status" className="rounded-2xl border border-brand-green/30 bg-brand-green-soft p-6 sm:p-8">
      <CheckCircle2 aria-hidden className="size-10 text-brand-green" />
      <h2 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-2xl font-bold text-ink outline-none sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-ink-soft">Your details have been saved. Please keep your reference number.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-white p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Reference number</p>
          <p className="font-display text-2xl font-bold tracking-wide text-ink">{reference}</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(reference);
              setCopied(true);
            } catch {
              /* clipboard unavailable; the reference is still visible */
            }
          }}
          className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-ink hover:border-brand-blue"
        >
          <Copy aria-hidden className="size-4" /> {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-6 text-ink-soft [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5">{nextSteps}</div>

      <p className="mt-6 text-sm text-ink-soft">
        Need to follow up? Call{" "}
        <a href={telHref()} className="font-semibold text-brand-blue underline underline-offset-4">
          {contact.phoneDisplay}
        </a>{" "}
        and mention your reference.
      </p>
      {links && (
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-semibold text-brand-blue underline underline-offset-4">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Fields ---------- */

const inputBase =
  "block w-full rounded-xl border bg-white px-4 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/15";

function useFieldIds(name: string, hint?: ReactNode) {
  const { errors } = useFormKit();
  const id = useId();
  const error = errors[name];
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return {
    id,
    error,
    hintId,
    errorId,
    describedBy: [hintId, errorId].filter(Boolean).join(" ") || undefined,
    border: error ? "border-price-red" : "border-line hover:border-ink/30",
  };
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
      {children}
      {required ? (
        <span className="text-price-red" aria-hidden>
          {" "}
          *
        </span>
      ) : (
        <span className="font-normal text-ink-soft"> (optional)</span>
      )}
    </label>
  );
}

export function FieldMessage({ id, children, kind }: { id?: string; children: ReactNode; kind: "hint" | "error" }) {
  if (!id) return null;
  return kind === "error" ? (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-price-red">
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  ) : (
    <p id={id} className="mt-1.5 text-sm text-ink-soft">
      {children}
    </p>
  );
}

type TextFieldProps = Omit<ComponentProps<"input">, "name"> & {
  name: string;
  label: string;
  hint?: ReactNode;
  requiredMessage?: string;
  patternMessage?: string;
};

export function TextField({ name, label, hint, required, requiredMessage, patternMessage, className = "", ...rest }: TextFieldProps) {
  const f = useFieldIds(name, hint);
  return (
    <div className={className}>
      <Label htmlFor={f.id} required={required}>
        {label}
      </Label>
      <FieldMessage id={f.hintId} kind="hint">
        {hint}
      </FieldMessage>
      <input
        id={f.id}
        name={name}
        required={required}
        aria-invalid={f.error ? true : undefined}
        aria-describedby={f.describedBy}
        data-required-msg={requiredMessage}
        data-pattern-msg={patternMessage}
        className={`${inputBase} ${f.border} mt-2 min-h-12`}
        {...rest}
      />
      <FieldMessage id={f.errorId} kind="error">
        {f.error}
      </FieldMessage>
    </div>
  );
}

/** Indian mobile number input with the right keyboard and format check. */
export function PhoneField({ name = "phone", label = "Mobile number", className }: { name?: string; label?: string; className?: string }) {
  return (
    <TextField
      name={name}
      label={label}
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      required
      placeholder="10-digit mobile number"
      pattern="(\+?91[\s\-]?|0)?[6-9]\d{4}[\s\-]?\d{5}"
      maxLength={16}
      requiredMessage="Please enter your mobile number."
      patternMessage="Please enter a valid 10-digit Indian mobile number."
      className={className}
    />
  );
}

export function TextArea({
  name,
  label,
  hint,
  required,
  rows = 4,
  maxLength = 2000,
  requiredMessage,
  className = "",
  ...rest
}: Omit<ComponentProps<"textarea">, "name"> & { name: string; label: string; hint?: ReactNode; requiredMessage?: string }) {
  const f = useFieldIds(name, hint);
  return (
    <div className={className}>
      <Label htmlFor={f.id} required={required}>
        {label}
      </Label>
      <FieldMessage id={f.hintId} kind="hint">
        {hint}
      </FieldMessage>
      <textarea
        id={f.id}
        name={name}
        rows={rows}
        required={required}
        maxLength={maxLength}
        aria-invalid={f.error ? true : undefined}
        aria-describedby={f.describedBy}
        data-required-msg={requiredMessage}
        className={`${inputBase} ${f.border} mt-2 py-3`}
        {...rest}
      />
      <FieldMessage id={f.errorId} kind="error">
        {f.error}
      </FieldMessage>
    </div>
  );
}

export function SelectField({
  name,
  label,
  hint,
  required,
  options,
  placeholder = "Select an option",
  requiredMessage,
  className = "",
  ...rest
}: Omit<ComponentProps<"select">, "name"> & {
  name: string;
  label: string;
  hint?: ReactNode;
  options: readonly ({ value: string; label: string } | string)[];
  placeholder?: string;
  requiredMessage?: string;
}) {
  const f = useFieldIds(name, hint);
  return (
    <div className={className}>
      <Label htmlFor={f.id} required={required}>
        {label}
      </Label>
      <FieldMessage id={f.hintId} kind="hint">
        {hint}
      </FieldMessage>
      <select
        id={f.id}
        name={name}
        required={required}
        defaultValue={rest.value === undefined ? "" : undefined}
        aria-invalid={f.error ? true : undefined}
        aria-describedby={f.describedBy}
        data-required-msg={requiredMessage}
        className={`${inputBase} ${f.border} mt-2 min-h-12 appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='20'%20fill='none'%20stroke='%2346524f'%20stroke-width='2'%3E%3Cpath%20d='m5%208%205%205%205-5'/%3E%3C/svg%3E")] bg-[position:right_0.9rem_center] bg-no-repeat pr-10`}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
      <FieldMessage id={f.errorId} kind="error">
        {f.error}
      </FieldMessage>
    </div>
  );
}

export function ChoiceGroup({
  name,
  label,
  hint,
  type = "radio",
  required,
  options,
  columns = 1,
}: {
  name: string;
  label: string;
  hint?: ReactNode;
  type?: "radio" | "checkbox";
  required?: boolean;
  options: readonly ({ value: string; label: string } | string)[];
  columns?: 1 | 2;
}) {
  const f = useFieldIds(name, hint);
  return (
    <fieldset aria-describedby={f.describedBy} data-field={name} tabIndex={-1} className="outline-none">
      <legend className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-price-red" aria-hidden>
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-ink-soft"> (optional)</span>
        )}
      </legend>
      <FieldMessage id={f.hintId} kind="hint">
        {hint}
      </FieldMessage>
      <div className={`mt-3 grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <label
              key={opt.value}
              className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border bg-white px-4 py-3 text-[0.95rem] text-ink transition-colors has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue-soft ${f.error ? "border-price-red" : "border-line hover:border-ink/30"}`}
            >
              <input
                type={type}
                name={name}
                value={opt.value}
                required={type === "radio" ? required : undefined}
                data-required-msg="Please choose an option."
                className="mt-0.5 size-5 shrink-0 accent-brand-blue"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      <FieldMessage id={f.errorId} kind="error">
        {f.error}
      </FieldMessage>
    </fieldset>
  );
}

export function ConsentField({ children, name = "consent" }: { children: ReactNode; name?: string }) {
  const f = useFieldIds(name);
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
        <input
          type="checkbox"
          name={name}
          value="yes"
          required
          aria-invalid={f.error ? true : undefined}
          aria-describedby={f.errorId}
          data-required-msg="Please tick the box to confirm."
          className="mt-0.5 size-5 shrink-0 accent-brand-blue"
        />
        <span>{children}</span>
      </label>
      <FieldMessage id={f.errorId} kind="error">
        {f.error}
      </FieldMessage>
    </div>
  );
}

export function FormSection({ title, children, description }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-7">
      <legend className="sr-only">{title}</legend>
      <div aria-hidden>
        <p className="font-display text-lg font-semibold text-ink">{title}</p>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {children}
    </fieldset>
  );
}
