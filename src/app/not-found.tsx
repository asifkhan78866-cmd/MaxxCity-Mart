import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const suggestions = [
  { href: "/request-product", label: "Request a product" },
  { href: "/franchise", label: "Franchise opportunities" },
  { href: "/stores", label: "Find a store" },
  { href: "/contact", label: "Contact us" },
];

export default function NotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-brand-green">Error 404</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">We couldn&apos;t find that page</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        The link may be out of date, or the page may have moved. Try one of these instead:
      </p>
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
        {suggestions.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="font-semibold text-brand-blue underline underline-offset-4">
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
      <ButtonLink href="/" className="mt-10" size="lg">
        Go to the homepage
      </ButtonLink>
    </Container>
  );
}
