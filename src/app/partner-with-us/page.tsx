import Link from "next/link";
import { ArrowRight, Building2, Factory, Handshake, Store, Truck, Users } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/sections/cta-band";
import { contact } from "@/content/contact";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Partner With Us — Business Enquiries",
  description:
    "Business enquiries for MaxxCity Mart: franchise applicants, manufacturers, suppliers and distributors, retailers, and commercial property owners.",
  path: "/partner-with-us",
});

const routes = [
  {
    icon: Users,
    title: "Franchise applicants",
    body: "Own and run a MaxxCity Mart outlet under the FOFO model.",
    href: "/franchise#apply",
    cta: "Apply for a franchise",
  },
  {
    icon: Factory,
    title: "Manufacturers",
    body: "Propose products for the MaxxCity Mart range and share your catalogue.",
    href: "/manufacturers#enquiry",
    cta: "Manufacturer enquiry",
  },
  {
    icon: Truck,
    title: "Suppliers & distributors",
    body: "Discuss distribution, wholesale supply or local sourcing.",
    href: "/retailers#enquiry",
    cta: "Supplier enquiry",
  },
  {
    icon: Store,
    title: "Retailers",
    body: "Explore a partnership that fits your retail business.",
    href: "/retailers#enquiry",
    cta: "Retailer enquiry",
  },
  {
    icon: Building2,
    title: "Commercial property owners",
    body: "Have a space that could suit a MaxxCity Mart store? Tell us its location, size and frontage.",
    href: "/contact?topic=property#enquiry",
    cta: "Propose a property",
  },
  {
    icon: Handshake,
    title: "Other business partners",
    body: "Anything else in mind? Send us a message and we'll route it to the right person.",
    href: "/contact?topic=other#enquiry",
    cta: "Send a business enquiry",
  },
];

export default function PartnerPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Partner With Us", path: "/partner-with-us" }]}
        eyebrow="Business enquiries"
        title="Let's grow MaxxCity Mart together"
        lead="Choose the option that best describes you and we'll take you to the right enquiry form."
      />

      <section aria-label="Enquiry types">
        <Container className="py-14 sm:py-16">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map(({ icon: Icon, title, body, href, cta }) => (
              <li key={title} className="reveal">
                <Link
                  href={href}
                  className="group flex h-full flex-col rounded-2xl border border-line p-6 transition-colors hover:border-brand-blue hover:bg-brand-blue-soft/40"
                >
                  <Icon aria-hidden className="size-8 text-brand-green" strokeWidth={1.75} />
                  <h2 className="mt-5 font-display text-xl font-bold text-ink">{title}</h2>
                  <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{body}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-blue">
                    {cta}
                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        placement="partner-final"
        title="Rather speak to someone?"
        lead="Call or WhatsApp the MaxxCity Mart team about any business enquiry."
        whatsappMessage={contact.whatsappMessages.partnership}
      />
    </>
  );
}
