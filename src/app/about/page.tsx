import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { PriceBand } from "@/components/sections/price-band";
import { CategoryGrid } from "@/components/sections/category-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import storefront from "../../../public/images/maxxcity-mart-adilabad-storefront.jpg";

export const metadata = pageMetadata({
  title: "About Us — Fixed-Price Variety Retail",
  description:
    "Learn about MaxxCity Mart, a fixed-price variety retail concept in Adilabad, Telangana built on value, accessibility, trust and community — and the opportunities it creates for local entrepreneurs.",
  path: "/about",
});

const values = [
  { title: "Accessibility", body: "Everyday products at a price point that is easy to understand and easy to plan around." },
  { title: "Value", body: "A considered range chosen for usefulness, so every rupee spent goes further." },
  { title: "Convenience", body: "Many household needs under one roof, in a store that is simple to shop." },
  { title: "Trust", body: "Clear pricing and honest communication with customers and partners." },
  { title: "Entrepreneurship", body: "A model that lets local businesspeople own and run their own MaxxCity Mart." },
  { title: "Community", body: "Stores that serve the neighbourhoods they are part of." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About MaxxCity Mart"
        title="A simpler way to shop for everyday things"
        lead={`${site.name} is a fixed-price variety retail concept. Our promise is in our name — ${site.promise} — and our purpose is in our tagline: ${site.tagline}.`}
      />

      <section aria-labelledby="why-heading">
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="reveal overflow-hidden rounded-2xl">
            <Image
              src={storefront}
              alt="The MaxxCity Mart store frontage in Adilabad with its illuminated sign"
              sizes="(min-width: 1024px) 540px, 100vw"
              placeholder="blur"
              className="aspect-[4/3] w-full object-cover object-top"
            />
          </div>
          <div className="reveal space-y-5 text-lg leading-relaxed text-ink-soft">
            <SectionHeading id="why-heading" eyebrow="Why fixed-price retail" title="Know the price before you pick it up" />
            <p>
              In a fixed-price store, customers don&apos;t need to compare labels or calculate as they go. A single,
              clear price point makes it easier to budget, quicker to decide, and more comfortable to try something
              new.
            </p>
            <p>
              Paired with a broad assortment — kitchenware, cleaning supplies, personal care, toys, stationery,
              clothing and more — one visit can cover a surprising amount of the household list.
            </p>
          </div>
        </Container>
      </section>

      <PriceBand />

      <section aria-labelledby="range-heading">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            id="range-heading"
            eyebrow="The range"
            title="A broad assortment of everyday categories"
            lead="Our range changes with seasons and supply. If you can't find something, you can ask us to source it."
          />
          <div className="mt-10">
            <CategoryGrid />
          </div>
          <Link href="/request-product" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-blue hover:underline underline-offset-4">
            Request a product <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Container>
      </section>

      <section aria-labelledby="values-heading" className="border-t border-line bg-paper">
        <Container className="py-16 sm:py-20">
          <SectionHeading id="values-heading" eyebrow="What we stand for" title="Our values" />
          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="reveal border-t-2 border-brand-green pt-4">
                <dt className="font-display text-xl font-bold text-ink">{v.title}</dt>
                <dd className="mt-2 leading-relaxed text-ink-soft">{v.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="growth-heading">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SectionHeading
            id="growth-heading"
            eyebrow="Looking ahead"
            title="Growing with local entrepreneurs"
            lead="We started in Adilabad. Our long-term ambition is to build MaxxCity Mart into a recognisable retail brand, opening in more towns through franchise partners who know their communities — and working with manufacturers and suppliers who can help us keep the range fresh."
          />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href="/franchise" variant="green" size="lg">
              Franchise opportunities
            </ButtonLink>
            <ButtonLink href="/founder" variant="outline" size="lg">
              Our founder&apos;s vision
            </ButtonLink>
          </div>
        </Container>
      </section>

      <CtaBand placement="about-final" />
    </>
  );
}
