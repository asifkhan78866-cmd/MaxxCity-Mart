import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { legalNav } from "@/content/navigation";
import { legalLastUpdated } from "@/content/site";

const legalLinks = [...legalNav, { href: "/legal/product-request-terms", label: "Product request terms" }];

export function LegalPage({ title, path, intro, children }: { title: string; path: string; intro: string; children: ReactNode }) {
  return (
    <>
      <PageHero crumbs={[{ name: title, path }]} eyebrow="Legal" title={title} lead={intro} />
      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_16rem]">
        <article className="prose-copy max-w-3xl">
          <p className="text-sm">Last updated: {legalLastUpdated}</p>
          {children}
        </article>
        <nav aria-label="Legal documents" className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-sm font-semibold text-ink">Legal documents</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={l.href === path ? "page" : undefined}
                  className={l.href === path ? "font-semibold text-brand-blue" : "text-ink-soft hover:text-brand-blue"}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </>
  );
}
