"use client"; // Error boundaries must be Client Components.

import Link from "next/link";
import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { contact } from "@/content/contact";
import { telHref } from "@/lib/links";

/**
 * Shown when a page fails to render. The header and footer stay in place.
 * Server errors arrive with a generic message and a digest that matches the
 * server log; the message itself is never shown to visitors.
 */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined;
    console.error("[page] Render failed", digest ? `(digest ${digest})` : "", error);
  }, [error]);

  return (
    <Container className="py-20 sm:py-28">
      <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-brand-green-text">Something went wrong</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">This page didn&apos;t load properly</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        Please try again. If it keeps happening, call or WhatsApp us on{" "}
        <a href={telHref()} className="font-semibold text-brand-blue underline underline-offset-4">
          {contact.phoneDisplay}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={() => retry()} className={buttonClasses({ size: "lg" })}>
          Try again
        </button>
        <Link href="/" className={buttonClasses({ variant: "outline", size: "lg" })}>
          Go to the homepage
        </Link>
      </div>
    </Container>
  );
}
