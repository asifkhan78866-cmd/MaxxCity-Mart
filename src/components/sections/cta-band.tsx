import { Phone, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { contact } from "@/content/contact";
import { telHref, whatsappHref } from "@/lib/links";

export function CtaBand({
  title = "Talk to the MaxxCity Mart team",
  lead = "Questions about a franchise, a product request or a partnership? Call or send us a WhatsApp message — we're happy to help.",
  whatsappMessage = contact.whatsappMessages.general,
  placement = "cta-band",
  showFranchise = true,
}: {
  title?: string;
  lead?: string;
  whatsappMessage?: string;
  placement?: string;
  showFranchise?: boolean;
}) {
  return (
    <section aria-labelledby={`${placement}-title`} className="on-dark bg-brand-green-deep text-white">
      <Container className="grid gap-8 py-14 sm:py-16 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div className="reveal">
          <h2 id={`${placement}-title`} className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">{lead}</p>
          <p className="mt-6 font-display text-2xl font-semibold tracking-wide sm:text-3xl">{contact.phoneDisplay}</p>
        </div>
        <div className="reveal grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <TrackedLink href={telHref()} event="phone_click" placement={placement} className={buttonClasses({ variant: "light", size: "lg" })}>
            <Phone aria-hidden className="size-5" /> Call {contact.phoneDisplay}
          </TrackedLink>
          <TrackedLink
            href={whatsappHref(whatsappMessage)}
            event="whatsapp_click"
            placement={placement}
            className={buttonClasses({ variant: "outline-light", size: "lg" })}
          >
            <MessageCircle aria-hidden className="size-5" /> Message on WhatsApp
          </TrackedLink>
          {showFranchise && (
            <TrackedLink
              href="/franchise#apply"
              event="franchise_cta_click"
              placement={placement}
              className={buttonClasses({ variant: "yellow", size: "lg", className: "sm:col-span-2 lg:col-span-1" })}
            >
              Apply for a franchise
            </TrackedLink>
          )}
        </div>
      </Container>
    </section>
  );
}
