import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/content/faqs";

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer items-start justify-between gap-6 py-5 text-left font-display text-lg font-semibold text-ink hover:text-brand-blue">
            {f.q}
            <ChevronDown aria-hidden className="faq-chevron mt-1 size-5 shrink-0 transition-transform" />
          </summary>
          <div className="pb-6 pr-10 text-base leading-relaxed text-ink-soft">
            <p>{f.a}</p>
            {f.link && (
              <Link
                href={f.link.href}
                className="mt-3 inline-block font-semibold text-brand-blue underline underline-offset-4"
              >
                {f.link.label}
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
