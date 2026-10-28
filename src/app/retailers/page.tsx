import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { RetailerForm } from "@/features/retailers/retailer-form";
import { retailerProposals } from "@/content/partnerships";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Retailer & Distributor Partnerships",
  description:
    "Retailers, wholesalers, distributors and local businesses can explore partnership opportunities with MaxxCity Mart, including distribution, wholesale supply and local sourcing.",
  path: "/retailers",
});


export default function RetailersPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Partner With Us", path: "/partner-with-us" },
          { name: "Retailers", path: "/retailers" },
        ]}
        eyebrow="Retailer partnerships"
        title="Are You a Retailer? Explore a Partnership With MaxxCity Mart."
        lead="We invite retailers, wholesalers, distributors and relevant local businesses to enquire about collaboration opportunities."
      >
        <ButtonLink href="#enquiry" variant="primary" size="lg">
          Send a partnership enquiry
        </ButtonLink>
      </PageHero>

      <section aria-labelledby="discussions-heading">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            id="discussions-heading"
            eyebrow="Possible discussions"
            title="Ways we might work together"
            lead="What makes sense depends on your business model. Every arrangement is subject to mutual agreement."
          />
          <dl className="divide-y divide-line border-y border-line">
            {retailerProposals.map((p) => (
              <div key={p.value} className="reveal grid gap-1 py-5 sm:grid-cols-[14rem_1fr]">
                <dt className="font-display font-semibold text-ink">{p.label}</dt>
                <dd className="text-ink-soft">{p.description}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="enquiry" aria-labelledby="rt-form-heading" className="scroll-mt-20 border-t border-line bg-paper">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading id="rt-form-heading" eyebrow="Enquiry" title="Retailer & distributor enquiry" />
            <div className="mt-6">
              <Notice>
                We don&apos;t offer resale rights or exclusive territories through this form. Any partnership terms are
                discussed and agreed in writing.
              </Notice>
            </div>
          </div>
          <RetailerForm />
        </Container>
      </section>
    </>
  );
}
