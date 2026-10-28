import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Container, Notice } from "@/components/ui/layout";
import { ProductRequestForm } from "@/features/product-requests/product-request-form";
import { productRequestSteps } from "@/content/product-requests";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Product — Send Us a Photo",
  description:
    "Seen something you want? Send MaxxCity Mart a photo or link. We'll review your request and contact you about sourcing, price and collection from a participating branch.",
  path: "/request-product",
});

export default function RequestProductPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Request a Product", path: "/request-product" }]}
        eyebrow="Request a product"
        title="Seen something you want? Send us a picture."
        lead="We'll review your request and contact you about sourcing and collection. No payment is taken online."
      />

      <section aria-labelledby="form-heading" className="bg-paper">
        <Container className="grid gap-8 py-10 sm:py-14 lg:grid-cols-[1.45fr_0.55fr] lg:gap-10">
          <div>
            <h2 id="form-heading" className="sr-only">
              Product request form
            </h2>
            <ProductRequestForm />
          </div>

          <aside aria-label="How it works" className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">How it works</h2>
              <ol className="mt-4 space-y-4">
                {productRequestSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span
                      aria-hidden
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white"
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-semibold text-ink">{s.title}</span>
                      <span className="text-sm leading-relaxed text-ink-soft">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <Notice tone="warm">
              <strong className="block text-ink">Please note</strong>
              A product request is not an order or a guarantee of availability. Price, sourcing, availability and
              collection timing are confirmed by our team after review — and not every product can be sourced, or
              sourced at ₹99.{" "}
              <Link href="/legal/product-request-terms" className="font-semibold text-brand-blue underline underline-offset-4">
                Product request terms
              </Link>
            </Notice>
          </aside>
        </Container>
      </section>
    </>
  );
}
