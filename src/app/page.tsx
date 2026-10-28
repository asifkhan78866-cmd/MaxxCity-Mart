import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Factory, Store as StoreIcon, ImagePlus, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { PriceBand, PriceTag } from "@/components/sections/price-band";
import { CategoryGrid } from "@/components/sections/category-grid";
import { FaqList } from "@/components/sections/faq-list";
import { CtaBand } from "@/components/sections/cta-band";
import { StoreCard } from "@/components/sections/store-card";
import { FounderPortrait } from "@/components/sections/founder-portrait";
import { Steps } from "@/components/sections/steps";
import { homeFaqs } from "@/content/faqs";
import { franchise, franchiseSupport } from "@/content/franchise";
import { site } from "@/content/site";
import { productRequestSteps } from "@/content/product-requests";
import { openStores, shortLocation } from "@/content/stores";
import { allStoresJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import storefront from "../../public/images/storefront/adilabad-opening-day.jpg";

export const metadata = {
  ...pageMetadata({
    title: "MaxxCity Mart — ₹99 Fixed-Price Variety Store in Adilabad",
    description:
      "₹99 fixed-price variety store in Adilabad, Telangana. Request a product, explore FOFO franchise opportunities, or partner with MaxxCity Mart.",
    path: "/",
  }),
  title: { absolute: "MaxxCity Mart — ₹99 Fixed-Price Variety Store in Adilabad" },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <Container className="grid gap-9 pb-14 pt-4 sm:pt-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:pb-20 lg:pt-16">
          <div className="page-enter order-2 lg:order-1">
            <Eyebrow>{site.category} · Adilabad, Telangana</Eyebrow>
            <h1 className="mt-4 font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]">
              Everyday Value.
              <br />
              <span className="text-brand-blue">A Bigger Opportunity.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-soft sm:text-xl">
              Discover a new way to shop, explore franchise opportunities, request products, and build business
              partnerships with MaxxCity Mart.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedLink
                href="/franchise"
                event="franchise_cta_click"
                placement="hero"
                className={buttonClasses({ variant: "green", size: "lg" })}
              >
                Explore Franchise Opportunities
              </TrackedLink>
              <ButtonLink href="/request-product" variant="outline" size="lg">
                <ImagePlus aria-hidden className="size-5" /> Request a Product
              </ButtonLink>
            </div>
            <Link
              href="/partner-with-us"
              className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-blue underline-offset-4 hover:underline"
            >
              Partner With Us <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>

          <div className="page-enter relative order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl bg-paper shadow-[0_30px_60px_-30px_rgba(18,28,31,0.45)]">
              <Image
                src={storefront}
                alt="MaxxCity Mart store on Adilabad Main Road on opening day, with families gathered at the entrance"
                sizes="(min-width: 1024px) 600px, 100vw"
                placeholder="blur"
                preload
                className="aspect-[16/9] w-full object-cover object-[50%_30%] sm:aspect-[16/10] lg:aspect-[4/3]"
              />
            </div>
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-xl bg-white py-2 pl-2 pr-4 shadow-lg sm:left-6">
              <PriceTag className="h-12 text-3xl" />
              <span className="whitespace-nowrap text-sm font-semibold leading-tight text-ink">
                Everyday products
                <br />
                <span className="font-normal text-ink-soft">at one simple price</span>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 1. Concept */}
      <section aria-labelledby="concept-heading" className="border-t border-line">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <SectionHeading
            id="concept-heading"
            eyebrow="The MaxxCity Mart concept"
            title="One simple price. A wide range of everyday things."
          />
          <div className="reveal space-y-6 text-lg leading-relaxed text-ink-soft">
            <p>
              MaxxCity Mart is a fixed-price variety store for the things households use every day — from kitchenware
              and cleaning supplies to personal care, toys and stationery. A clear price point makes shopping quick,
              and a broad assortment means one trip covers more of the list.
            </p>
            <ul className="space-y-3 text-base">
              {[
                "A clear, easy-to-understand price point",
                "A broad assortment across household categories",
                "A welcoming store close to where people live",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-ink">
                  <Check aria-hidden className="mt-1 size-5 shrink-0 text-brand-green" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/about" className="inline-flex items-center gap-1.5 font-semibold text-brand-blue hover:underline underline-offset-4">
              More about MaxxCity Mart <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* 2. ₹99 */}
      <PriceBand />

      {/* 3. Categories */}
      <section aria-labelledby="categories-heading">
        <Container className="py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              id="categories-heading"
              eyebrow="What you'll find"
              title="Categories for every corner of the home"
              lead="Our range changes with the seasons, but these are the aisles you can count on."
            />
          </div>
          <div className="mt-10">
            <CategoryGrid />
          </div>
          <p className="mt-4 text-sm text-ink-soft">Products vary by store and season.</p>
        </Container>
      </section>

      {/* 4. Request a product */}
      <section aria-labelledby="request-heading" className="on-dark bg-ink text-white">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <SectionHeading
              dark
              id="request-heading"
              eyebrow="Request a product"
              title="Seen something you want? Send us a picture."
              lead="We'll review your request and contact you about sourcing and collection from a MaxxCity Mart branch."
            />
            <div className="lg:justify-self-end">
              <ButtonLink href="/request-product" variant="yellow" size="lg">
                <ImagePlus aria-hidden className="size-5" /> Start a product request
              </ButtonLink>
            </div>
          </div>
          <div className="mt-14">
            <Steps steps={productRequestSteps} dark />
          </div>
          <p className="mt-12 max-w-2xl border-l-2 border-price-yellow pl-4 text-sm leading-relaxed text-white/70">
            A product request is not an order or a guarantee of availability. Price, sourcing, availability and
            collection timing are confirmed by our team after review.
          </p>
        </Container>
      </section>

      {/* 5. Franchise */}
      <section aria-labelledby="franchise-heading" className="bg-brand-blue-soft">
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="reveal">
            <Eyebrow>Franchise opportunity · {franchise.model}</Eyebrow>
            <h2 id="franchise-heading" className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
              Bring MaxxCity Mart to your city
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Our franchise model is <strong className="text-ink">{franchise.modelFull}</strong>. You invest in and run
              the outlet; we bring the brand, the sourcing and the know-how to help you set it up — subject to the
              final franchise agreement.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href="/franchise"
                event="franchise_cta_click"
                placement="home-franchise"
                className={buttonClasses({ variant: "primary", size: "lg" })}
              >
                Explore the franchise
              </TrackedLink>
              <TrackedLink
                href="/franchise#apply"
                event="franchise_cta_click"
                placement="home-franchise-apply"
                className={buttonClasses({ variant: "outline", size: "lg" })}
              >
                Apply now
              </TrackedLink>
            </div>
          </div>
          <div className="reveal rounded-2xl bg-white p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-ink">What MaxxCity Mart supports</h3>
            <ul className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {franchiseSupport.slice(0, 6).map((s) => (
                <li key={s.title} className="flex gap-3">
                  <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-green" />
                  <span>
                    <span className="block font-semibold text-ink">{s.title}</span>
                    <span className="text-sm text-ink-soft">{s.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 6. Partnerships */}
      <section aria-labelledby="partners-heading">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            id="partners-heading"
            eyebrow="Business partnerships"
            title="Manufacturers and retailers — let's work together"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              {
                href: "/manufacturers",
                icon: Factory,
                title: "Are you a manufacturer?",
                body: "Share your products and supply capability. Suitable proposals are evaluated for the MaxxCity Mart range.",
                cta: "Manufacturer enquiry",
              },
              {
                href: "/retailers",
                icon: StoreIcon,
                title: "Are you a retailer or distributor?",
                body: "Explore distribution, wholesale supply, local sourcing or regional partnership discussions.",
                cta: "Retailer enquiry",
              },
            ].map(({ href, icon: Icon, title, body, cta }) => (
              <Link
                key={href}
                href={href}
                className="reveal group flex flex-col rounded-2xl border border-line p-6 transition-colors hover:border-brand-blue sm:p-8"
              >
                <Icon aria-hidden className="size-8 text-brand-green" strokeWidth={1.75} />
                <h3 className="mt-5 font-display text-2xl font-bold text-ink">{title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{body}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-blue">
                  {cta}
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-soft">
            Property owner with a suitable commercial space?{" "}
            <Link href="/partner-with-us" className="font-semibold text-brand-blue underline underline-offset-4">
              See all business enquiries
            </Link>
          </p>
        </Container>
      </section>

      {/* 7. Store */}
      <section aria-labelledby="store-heading" className="border-t border-line bg-paper">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="reveal">
            <SectionHeading
              id="store-heading"
              eyebrow="Visit us"
              title="Our store in Adilabad"
              lead={`Our current MaxxCity Mart store is on ${openStores[0] ? shortLocation(openStores[0]) : "Adilabad"}. New locations will be listed here as they open.`}
            />
            <ButtonLink href="/stores" variant="outline" className="mt-8">
              Find a store
            </ButtonLink>
          </div>
          {openStores[0] && <StoreCard store={openStores[0]} />}
        </Container>
      </section>

      {/* 8. Founder */}
      <section aria-labelledby="founder-heading">
        <Container className="grid gap-10 py-16 sm:py-20 md:grid-cols-[0.7fr_1.3fr] md:items-center lg:gap-16">
          <FounderPortrait className="reveal mx-auto w-full max-w-xs md:max-w-none" sizes="(min-width: 768px) 360px, 320px" />
          <div className="reveal">
            <Eyebrow>Founder &amp; vision</Eyebrow>
            <h2 id="founder-heading" className="sr-only">
              A message from our founder
            </h2>
            <Quote aria-hidden className="mt-6 size-10 text-brand-green" />
            <blockquote className="mt-4 font-display text-2xl font-medium leading-snug text-ink sm:text-[1.7rem]">
              <p>{site.founder.message}</p>
            </blockquote>
            <p className="mt-6 font-semibold text-ink">
              {site.founder.name}
              <span className="font-normal text-ink-soft"> — {site.founder.role}</span>
            </p>
            <Link href="/founder" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-blue hover:underline underline-offset-4">
              Read about our vision <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* 9. FAQ */}
      <section aria-labelledby="faq-heading" className="border-t border-line">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading id="faq-heading" eyebrow="FAQ" title="Questions people ask us" />
            <Link href="/faq" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-blue hover:underline underline-offset-4">
              All questions <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <FaqList items={homeFaqs} />
        </Container>
      </section>

      {/* 10. Final CTA */}
      <CtaBand placement="home-final" />

      <JsonLd data={allStoresJsonLd()} />
    </>
  );
}
