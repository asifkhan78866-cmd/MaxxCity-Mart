"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Copy } from "lucide-react";
import { contact } from "@/content/contact";
import { telHref } from "@/lib/links";

/** Shown in place of the form once the server has saved the submission. */
export function Confirmation({
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
