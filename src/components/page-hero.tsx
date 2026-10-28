import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Container, JsonLd } from "@/components/ui/layout";
import { breadcrumbJsonLd } from "@/lib/seo";

type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-soft">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="font-medium text-ink">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="hover:text-brand-blue hover:underline underline-offset-4">
                      {c.name}
                    </Link>
                    <ChevronRight aria-hidden className="size-3.5 text-ink-soft/60" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}

export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  aside,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Actions under the lead. */
  children?: ReactNode;
  /** Optional right-hand column on large screens. */
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-paper">
      <Container className="py-10 sm:py-14 lg:py-16">
        <Breadcrumbs items={crumbs} />
        <div className={`mt-6 grid gap-10 ${aside ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""}`}>
          <div className="page-enter max-w-3xl">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">{eyebrow}</p>
            )}
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance text-ink sm:text-5xl">
              {title}
            </h1>
            {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-ink-soft">{lead}</p>}
            {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
          </div>
          {aside && <div className="page-enter">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
