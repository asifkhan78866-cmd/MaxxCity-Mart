import { Quote } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { FounderPortrait } from "@/components/sections/founder-portrait";
import { CtaBand } from "@/components/sections/cta-band";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Founder & Vision — Syed Asif",
  description:
    "Meet Syed Asif, founder of MaxxCity Mart, and read the vision behind the fixed-price retail concept: accessible everyday shopping and opportunities for entrepreneurs, retailers and manufacturers.",
  path: "/founder",
});

const direction = [
  { title: "More cities and towns", body: "Bringing the MaxxCity Mart concept to more communities over time." },
  { title: "Opportunities for entrepreneurs", body: "Helping aspiring business owners run their own outlet through the FOFO franchise model." },
  { title: "Manufacturer and supplier relationships", body: "Building long-term relationships with the people who make and supply our products." },
  { title: "Products people ask for", body: "Letting customers request products that may not currently be available locally." },
  { title: "A consistent experience", body: "Developing a recognisable store experience that customers can rely on wherever they shop with us." },
];

export default function FounderPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Founder & Vision", path: "/founder" }]}
        eyebrow="Founder & vision"
        title={site.founder.name}
        lead={`${site.founder.role}`}
      />

      <section aria-labelledby="message-heading">
        <Container className="grid gap-12 py-16 sm:py-20 md:grid-cols-[0.75fr_1.25fr] md:items-start lg:gap-16">
          <FounderPortrait className="mx-auto w-full max-w-sm md:sticky md:top-28" />
          <div>
            <h2 id="message-heading" className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">
              A message from our founder
            </h2>
            <Quote aria-hidden className="mt-6 size-12 text-brand-green" />
            <blockquote className="mt-4">
              <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">{site.founder.message}</p>
              <footer className="mt-6 text-ink-soft">
                — <cite className="not-italic font-semibold text-ink">{site.founder.name}</cite>, {site.founder.role}
              </footer>
            </blockquote>

            <div className="mt-16">
              <SectionHeading eyebrow="Where we are heading" title="The long-term direction" />
              <ol className="mt-8 divide-y divide-line border-y border-line">
                {direction.map((d, i) => (
                  <li key={d.title} className="reveal grid gap-1 py-5 sm:grid-cols-[3rem_1fr]">
                    <span aria-hidden className="font-display text-sm font-bold text-brand-green">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink">{d.title}</h3>
                      <p className="mt-1 leading-relaxed text-ink-soft">{d.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/franchise" variant="green" size="lg">
                Explore the franchise
              </ButtonLink>
              <ButtonLink href="/partner-with-us" variant="outline" size="lg">
                Partner with us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand placement="founder-final" />
    </>
  );
}
