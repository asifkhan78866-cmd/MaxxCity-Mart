import { Check, Minus } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Notice } from "@/components/ui/notice";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { Steps } from "@/components/sections/steps";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqList } from "@/components/sections/faq-list";
import { FranchiseForm } from "@/features/franchise/franchise-form";
import { contact } from "@/content/contact";
import { franchise, franchiseeResponsibilities, franchiseProcess, franchiseSupport } from "@/content/franchise";
import { faqs } from "@/content/faqs";
import { whatsappHref } from "@/lib/links";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Franchise Opportunity — FOFO Fixed-Price Retail",
  description:
    "Apply for a MaxxCity Mart franchise. Learn how our FOFO (Franchisee Owned, Franchisee Operated) fixed-price retail model works, what support we provide, and the application process.",
  path: "/franchise",
});

const figureLabels = {
  franchiseFee: "Franchise fee",
  investmentRange: "Indicative investment",
  areaRequirement: "Store area",
  agreementTerm: "Agreement term",
} as const;

export default function FranchisePage() {
  const figures = Object.entries(figureLabels)
    .map(([key, label]) => ({ label, value: franchise.figures[key as keyof typeof figureLabels] }))
    .filter((f) => f.value);
  const showFigures = franchise.figures.published && figures.length > 0;
  const franchiseFaqs = faqs.filter((f) => /franchise|FOFO|investment/i.test(f.q));

  return (
    <>
      <PageHero
        crumbs={[{ name: "Franchise", path: "/franchise" }]}
        eyebrow={`${franchise.model} franchise opportunity`}
        title="Bring MaxxCity Mart to your city"
        lead={`Own and operate a MaxxCity Mart outlet under our ${franchise.modelFull} model — with the brand, sourcing and setup support to get started.`}
        aside={
          <div className="rounded-2xl bg-brand-blue p-6 text-white sm:p-8">
            <p className="font-display text-5xl font-extrabold tracking-tight">{franchise.model}</p>
            <p className="mt-2 text-lg text-white/85">{franchise.modelFull}</p>
            <div className="mt-6 h-px bg-white/20" />
            <p className="mt-6 leading-relaxed text-white/85">
              You invest in and run the store. MaxxCity Mart provides the brand and the agreed support. Final terms are
              set out in the franchise agreement.
            </p>
          </div>
        }
      >
        <TrackedLink href="#apply" event="franchise_cta_click" placement="franchise-hero" className={buttonClasses({ variant: "green", size: "lg" })}>
          Apply for a Franchise
        </TrackedLink>
        <TrackedLink
          href={whatsappHref(contact.whatsappMessages.franchise)}
          event="whatsapp_click"
          placement="franchise-hero"
          className={buttonClasses({ variant: "outline", size: "lg" })}
        >
          Ask on WhatsApp
        </TrackedLink>
      </PageHero>

      {/* Responsibilities */}
      <section aria-labelledby="model-heading">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            id="model-heading"
            eyebrow="How FOFO works"
            title="Clear roles from day one"
            lead="Every arrangement is confirmed in the final agreement, but this is how responsibilities are generally shared."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="reveal rounded-2xl border border-line p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-ink">The franchise partner generally</h3>
              <p className="mt-1 text-sm text-ink-soft">invests in and operates the outlet, including:</p>
              <ul className="mt-6 space-y-3">
                {franchiseeResponsibilities.map((r) => (
                  <li key={r} className="flex gap-3 text-ink">
                    <Minus aria-hidden className="mt-1 size-4 shrink-0 text-ink-soft" /> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal rounded-2xl bg-brand-green-soft p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-ink">MaxxCity Mart provides</h3>
              <p className="mt-1 text-sm text-ink-soft">the agreed franchise support, which may include:</p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {franchiseSupport.map((s) => (
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
          </div>
        </Container>
      </section>

      {/* Commercials */}
      <section aria-labelledby="commercials-heading" className="border-y border-line bg-paper">
        <Container className="grid gap-8 py-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionHeading
            id="commercials-heading"
            eyebrow="Investment & terms"
            title="Commercial details, shared directly"
          />
          {showFigures ? (
            <dl className="grid gap-4 sm:grid-cols-2">
              {figures.map((f) => (
                <div key={f.label} className="rounded-xl bg-white p-5">
                  <dt className="text-sm text-ink-soft">{f.label}</dt>
                  <dd className="mt-1 font-display text-xl font-bold text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>
                Investment depends on your location, store size and setup, so we discuss commercial requirements with
                each applicant individually rather than publishing a single figure.
              </p>
              <p className="text-base">
                We do not promise specific sales, profits, footfall or returns. Any figures we share are part of the
                discussion and the final agreement.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Process */}
      <section aria-labelledby="process-heading">
        <Container className="py-16 sm:py-20">
          <SectionHeading id="process-heading" eyebrow="Application process" title="From enquiry to opening" />
          <div className="mt-12">
            <Steps steps={franchiseProcess} columns={3} />
          </div>
        </Container>
      </section>

      {/* Form */}
      <section id="apply" aria-labelledby="apply-heading" className="scroll-mt-20 bg-brand-blue-soft">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="apply-heading"
              eyebrow="Apply"
              title="Apply for a franchise"
              lead="Tell us about yourself and the location you have in mind. It takes about five minutes."
            />
            <div className="mt-6">
              <Notice>
                This is an enquiry, not an application approval. Every enquiry is reviewed, and any franchise is
                subject to due diligence and a signed franchise agreement.
              </Notice>
            </div>
          </div>
          <FranchiseForm />
        </Container>
      </section>

      <section aria-labelledby="franchise-faq-heading">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="franchise-faq-heading" eyebrow="FAQ" title="Franchise questions" />
          <FaqList items={franchiseFaqs} />
        </Container>
      </section>

      <CtaBand
        placement="franchise-final"
        title="Prefer to talk it through first?"
        lead="Call or WhatsApp us to discuss the franchise opportunity before you apply."
        whatsappMessage={contact.whatsappMessages.franchise}
        showFranchise={false}
      />
    </>
  );
}
