import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { StoreCard } from "@/components/sections/store-card";
import { ContactForm } from "@/features/contact/contact-form";
import { contact } from "@/content/contact";
import { openStores } from "@/content/stores";
import { telHref, whatsappHref } from "@/lib/links";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: `Contact Us — Call or WhatsApp ${contact.phoneDisplay}`,
  description:
    `Contact MaxxCity Mart by phone or WhatsApp on ${contact.phoneDisplay}, visit our Adilabad store, or send a general, franchise, product or business enquiry.`,
  path: "/contact",
});

const quickLinks = [
  { href: "/request-product", label: "Request a product" },
  { href: "/franchise#apply", label: "Franchise enquiry" },
  { href: "/manufacturers#enquiry", label: "Manufacturer enquiry" },
  { href: "/retailers#enquiry", label: "Retailer or distributor enquiry" },
  { href: "/stores#new-location", label: "Ask for a store in your town" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title="Get in touch"
        lead="The quickest way to reach us is a call or a WhatsApp message."
      >
        <TrackedLink href={telHref()} event="phone_click" placement="contact-hero" className={buttonClasses({ variant: "primary", size: "lg" })}>
          <Phone aria-hidden className="size-5" /> Call {contact.phoneDisplay}
        </TrackedLink>
        <TrackedLink
          href={whatsappHref()}
          event="whatsapp_click"
          placement="contact-hero"
          className={buttonClasses({ variant: "green", size: "lg" })}
        >
          <MessageCircle aria-hidden className="size-5" /> WhatsApp us
        </TrackedLink>
      </PageHero>

      <section aria-labelledby="whatsapp-heading" className="border-b border-line">
        <Container className="py-10">
          <h2 id="whatsapp-heading" className="font-display text-lg font-semibold text-ink">
            Start a WhatsApp message about…
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Opens WhatsApp with a draft message. Nothing is sent until you press send.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              ["A franchise", contact.whatsappMessages.franchise, "contact-wa-franchise"],
              ["A product request", contact.whatsappMessages.productRequest, "contact-wa-product"],
              ["A business partnership", contact.whatsappMessages.partnership, "contact-wa-partner"],
            ].map(([label, msg, placement]) => (
              <TrackedLink
                key={placement}
                href={whatsappHref(msg)}
                event="whatsapp_click"
                placement={placement}
                className={buttonClasses({ variant: "outline" })}
              >
                <MessageCircle aria-hidden className="size-4 text-brand-green" /> {label}
              </TrackedLink>
            ))}
          </div>
        </Container>
      </section>

      <section id="enquiry" aria-labelledby="contact-form-heading" className="scroll-mt-20 bg-paper">
        <Container className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-line bg-white p-5 sm:p-8">
            <h2 id="contact-form-heading" className="font-display text-2xl font-bold text-ink">
              Send us a message
            </h2>
            <p className="mb-6 mt-1 text-ink-soft">For general questions and business enquiries.</p>
            <ContactForm />
          </div>
          <div className="space-y-8">
            <div>
              <SectionHeading title="Looking for something specific?" className="[&_h2]:text-2xl" />
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="flex items-center justify-between py-4 font-semibold text-ink hover:text-brand-blue">
                      {l.label} <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {openStores[0] && <StoreCard store={openStores[0]} headingLevel="h2" />}
          </div>
        </Container>
      </section>
    </>
  );
}
