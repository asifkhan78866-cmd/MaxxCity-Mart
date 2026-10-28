import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui/layout";
import { FaqList } from "@/components/sections/faq-list";
import { CtaBand } from "@/components/sections/cta-band";
import { faqs } from "@/content/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about MaxxCity Mart: the ₹99 concept, product categories, requesting products by photo, branch collection, FOFO franchising, and manufacturer and retailer partnerships.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "FAQ", path: "/faq" }]}
        eyebrow="FAQ"
        title="Frequently asked questions"
        lead="Can't find your answer here? Call or WhatsApp us and we'll help."
      />
      <section aria-label="Questions and answers">
        <Container className="py-12 sm:py-16">
          <div className="max-w-3xl">
            <FaqList items={faqs} />
          </div>
        </Container>
      </section>
      <CtaBand placement="faq-final" title="Still have a question?" />
    </>
  );
}
