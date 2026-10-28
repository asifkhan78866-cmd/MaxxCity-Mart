import { PageHero } from "@/components/page-hero";
import { Container, Notice, SectionHeading } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/button";
import { Steps } from "@/components/sections/steps";
import { ManufacturerForm } from "@/components/forms/business-forms";
import { supplierCategories } from "@/content/categories";
import { manufacturerProcess } from "@/content/partnerships";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Manufacturer Partnerships — Supply MaxxCity Mart",
  description:
    "Are you a manufacturer? Send MaxxCity Mart your product categories, catalogue and supply capability. Suitable proposals are evaluated for our fixed-price retail range.",
  path: "/manufacturers",
});


export default function ManufacturersPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Partner With Us", path: "/partner-with-us" },
          { name: "Manufacturers", path: "/manufacturers" },
        ]}
        eyebrow="Manufacturer partnerships"
        title="Are You a Manufacturer? Let's Build Something Together."
        lead="MaxxCity Mart welcomes enquiries from manufacturers interested in supplying suitable products for our fixed-price retail concept."
      >
        <ButtonLink href="#enquiry" variant="primary" size="lg">
          Send a manufacturer enquiry
        </ButtonLink>
      </PageHero>

      <section aria-labelledby="areas-heading">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            id="areas-heading"
            eyebrow="Collaboration areas"
            title="Categories we're interested in"
            lead="These categories are indicative. Every supplier proposal is evaluated on its own merits."
          />
          <ul className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
            {supplierCategories.map((c) => (
              <li key={c} className="reveal border-b border-r border-line px-5 py-4 font-display font-semibold text-ink">
                {c === "Other" ? "Other relevant retail categories" : c}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="mfg-process-heading" className="border-y border-line bg-paper">
        <Container className="py-16 sm:py-20">
          <SectionHeading id="mfg-process-heading" eyebrow="How it works" title="From enquiry to evaluation" />
          <div className="mt-12">
            <Steps steps={manufacturerProcess} />
          </div>
        </Container>
      </section>

      <section id="enquiry" aria-labelledby="mfg-form-heading" className="scroll-mt-20">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading id="mfg-form-heading" eyebrow="Enquiry" title="Manufacturer enquiry" />
            <div className="mt-6">
              <Notice>
                Submitting an enquiry or catalogue does not mean MaxxCity Mart will buy your products. Proposals are
                reviewed, and any supply is subject to commercial approval and a written agreement.
              </Notice>
            </div>
          </div>
          <ManufacturerForm />
        </Container>
      </section>
    </>
  );
}
