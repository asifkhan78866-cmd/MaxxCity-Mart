import Link from "next/link";
import { Phone, MessageCircle, ImagePlus } from "lucide-react";
import { TrackedLink } from "@/components/ui/tracked-link";
import { telHref, whatsappHref } from "@/lib/links";

/** Persistent thumb-reach actions on phones. Hidden from large screens, where the header carries them. */
export function MobileActionBar() {
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto flex max-w-md">
        <TrackedLink href={telHref()} event="phone_click" placement="mobile-bar" className={`${item} text-ink`}>
          <Phone aria-hidden className="size-5 text-brand-blue" />
          Call
        </TrackedLink>
        <TrackedLink href={whatsappHref()} event="whatsapp_click" placement="mobile-bar" className={`${item} text-ink`}>
          <MessageCircle aria-hidden className="size-5 text-brand-green" />
          WhatsApp
        </TrackedLink>
        <Link href="/request-product" className={`${item} m-1.5 rounded-xl bg-brand-blue text-white`}>
          <ImagePlus aria-hidden className="size-5" />
          Request a product
        </Link>
      </div>
    </nav>
  );
}
