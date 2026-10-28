"use client";

import Link from "next/link";
import { useRef } from "react";
import { Menu, X, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { primaryNav } from "@/content/navigation";
import { contact } from "@/content/contact";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { telHref, whatsappHref } from "@/lib/links";

/** Full-screen menu built on the native <dialog> element (focus trap, Esc to close). */
export function MobileNav() {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink hover:border-brand-blue hover:text-brand-blue"
        aria-label="Open menu"
        aria-haspopup="dialog"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      <dialog
        ref={ref}
        aria-label="Site menu"
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-white p-0 backdrop:bg-ink/50 open:animate-rise open:[animation-duration:220ms]"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <span className="font-display text-lg font-bold">Menu</span>
            <button
              type="button"
              onClick={close}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line"
              aria-label="Close menu"
              autoFocus
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="divide-y divide-line">
              {[{ href: "/", label: "Home" }, ...primaryNav, { href: "/founder", label: "Founder & Vision" }, { href: "/faq", label: "FAQ" }].map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="flex items-center justify-between py-4 text-lg font-medium text-ink"
                    >
                      {item.label}
                      <ArrowRight aria-hidden className="size-4 text-ink-soft" />
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="grid gap-3 border-t border-line p-5">
            <TrackedLink
              href="/franchise#apply"
              event="franchise_cta_click"
              placement="mobile-menu"
              onClick={close}
              className={buttonClasses({ variant: "green", size: "lg" })}
            >
              Apply for a franchise
            </TrackedLink>
            <div className="grid grid-cols-2 gap-3">
              <TrackedLink href={telHref()} event="phone_click" placement="mobile-menu" className={buttonClasses({ variant: "outline" })}>
                <Phone aria-hidden className="size-4" /> Call
              </TrackedLink>
              <TrackedLink
                href={whatsappHref()}
                event="whatsapp_click"
                placement="mobile-menu"
                className={buttonClasses({ variant: "outline" })}
              >
                <MessageCircle aria-hidden className="size-4" /> WhatsApp
              </TrackedLink>
            </div>
            <p className="text-center text-sm text-ink-soft">{contact.phoneDisplay}</p>
          </div>
        </div>
      </dialog>
    </div>
  );
}
