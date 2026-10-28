import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { TrackedLink } from "@/components/ui/tracked-link";
import { footerNav, legalNav } from "@/content/navigation";
import { contact } from "@/content/contact";
import { site } from "@/content/site";
import { ConsentSettingsLink } from "@/components/consent";
import { openStores, formatAddress } from "@/content/stores";
import { telHref, whatsappHref } from "@/lib/links";
import logo from "../../public/brand/maxxcity-mart-logo.png";

export function SiteFooter() {
  const store = openStores[0];
  return (
    <footer className="border-t border-line bg-paper pb-24 lg:pb-0">
      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Image src={logo} alt="MaxxCity Mart" className="h-12 w-auto" sizes="160px" />
            <p className="mt-4 font-display text-lg font-semibold text-ink">{site.tagline}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
              {site.category}, built around everyday products at the ₹99 price point.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <TrackedLink
                  href={telHref()}
                  event="phone_click"
                  placement="footer"
                  className="inline-flex items-center gap-2 font-semibold text-ink hover:text-brand-blue"
                >
                  <Phone aria-hidden className="size-4 text-brand-green" /> {contact.phoneDisplay}
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href={whatsappHref()}
                  event="whatsapp_click"
                  placement="footer"
                  className="inline-flex items-center gap-2 font-semibold text-ink hover:text-brand-blue"
                >
                  <MessageCircle aria-hidden className="size-4 text-brand-green" /> WhatsApp us
                </TrackedLink>
              </li>
              {store && (
                <li className="flex gap-2 text-ink-soft">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-green" />
                  <address className="not-italic">{formatAddress(store)}</address>
                </li>
              )}
            </ul>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-ink-soft hover:text-brand-blue hover:underline underline-offset-4">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-soft lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {site.name}. {site.promise}
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand-blue hover:underline underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <ConsentSettingsLink />
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
