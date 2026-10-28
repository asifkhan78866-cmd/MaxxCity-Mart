import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { NavLinks } from "@/components/navigation/nav-links";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { contact } from "@/content/contact";
import { telHref } from "@/lib/links";
import logo from "../../../public/brand/maxxcity-mart-logo.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="shrink-0" aria-label="MaxxCity Mart home">
          <Image
            src={logo}
            alt="MaxxCity Mart — Maxx Saving, Maxx Value"
            className="h-10 w-auto lg:h-12"
            sizes="(min-width: 1024px) 160px, 130px"
            preload
          />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <TrackedLink
            href={telHref()}
            event="phone_click"
            placement="header"
            className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-ink hover:text-brand-blue md:inline-flex xl:hidden 2xl:inline-flex"
          >
            <Phone aria-hidden className="size-4" />
            {contact.phoneDisplay}
          </TrackedLink>
          <div className="hidden sm:block">
            <TrackedLink
              href="/franchise#apply"
              event="franchise_cta_click"
              placement="header"
              className={buttonClasses({ variant: "green" })}
            >
              Franchise enquiry
            </TrackedLink>
          </div>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
