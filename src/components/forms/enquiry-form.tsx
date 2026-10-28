"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { contact } from "@/content/contact";
import { type AnalyticsEvent, track } from "@/lib/analytics/track";
import type { FormId, SubmitResult } from "@/lib/forms/types";
import { Confirmation } from "./confirmation";
import { FormCtx } from "./form-context";

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

/**
 * Shell for every enquiry form: client-side checks, submission to
 * /api/forms/{form}, error display, and the confirmation screen.
 */
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
