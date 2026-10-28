"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { useFormKit } from "./form-context";

/* Accessible form fields. Each reads its error from the surrounding <EnquiryForm>. */

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
