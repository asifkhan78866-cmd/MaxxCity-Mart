import Image from "next/image";
import { Clock, MapPin, Navigation, Phone, PackageCheck } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { contact } from "@/content/site";
import { formatAddress, type Store } from "@/content/stores";
import { telHref } from "@/lib/links";

export function StoreCard({
  store,
  headingLevel = "h3",
  wide = false,
}: {
  store: Store;
  headingLevel?: "h2" | "h3";
  /** Photo beside the details on large screens. */
  wide?: boolean;
}) {
  const Heading = headingLevel;
  const phone = store.phoneE164 ?? contact.phoneE164;
  const phoneDisplay = store.phoneDisplay ?? contact.phoneDisplay;

  return (
    <article
      id={store.slug}
      className={`overflow-hidden rounded-2xl border border-line bg-white ${wide ? "lg:grid lg:grid-cols-[1.1fr_1fr]" : ""}`}
    >
      {store.photo && (
        <div className={`relative aspect-[16/9] bg-paper ${wide ? "lg:aspect-auto lg:min-h-full" : ""}`}>
          <Image
            src={store.photo.src}
            alt={store.photo.alt}
            fill
            sizes={wide ? "(min-width: 1024px) 620px, 100vw" : "(min-width: 1024px) 560px, 100vw"}
            className="object-cover"
          />
        </div>
      )}
      <div className={`p-6 sm:p-7 ${wide ? "lg:p-10" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-soft px-2.5 py-1 text-xs font-semibold text-brand-green-deep">
            <span aria-hidden className="size-1.5 rounded-full bg-brand-green" />
            {store.status === "open" ? "Open" : "Coming soon"}
          </span>
          <span className="text-sm text-ink-soft">
            {store.locality}, {store.city}
          </span>
        </div>
        <Heading className="mt-3 font-display text-2xl font-bold text-ink">{store.name}</Heading>

        <dl className="mt-5 space-y-4 text-[0.95rem]">
          <div className="flex gap-3">
            <dt>
              <MapPin aria-hidden className="mt-0.5 size-5 text-brand-green" />
              <span className="sr-only">Address</span>
            </dt>
            <dd>
              <address className="not-italic leading-relaxed text-ink">{formatAddress(store)}</address>
            </dd>
          </div>
          <div className="flex gap-3">
            <dt>
              <Phone aria-hidden className="mt-0.5 size-5 text-brand-green" />
              <span className="sr-only">Phone</span>
            </dt>
            <dd>
              <a href={telHref(phone)} className="font-semibold text-ink hover:text-brand-blue">
                {phoneDisplay}
              </a>
              {!store.phoneDisplay && <span className="block text-sm text-ink-soft">MaxxCity Mart main line</span>}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt>
              <Clock aria-hidden className="mt-0.5 size-5 text-brand-green" />
              <span className="sr-only">Opening hours</span>
            </dt>
            <dd className="text-ink-soft">
              {store.hours ? (
                <ul>
                  {store.hours.map((h) => (
                    <li key={h.days}>
                      <span className="font-medium text-ink">{h.days}:</span> {h.hours}
                    </li>
                  ))}
                </ul>
              ) : (
                "Please call ahead to confirm today's opening hours."
              )}
            </dd>
          </div>
          {store.acceptsProductRequestCollection && (
            <div className="flex gap-3">
              <dt>
                <PackageCheck aria-hidden className="mt-0.5 size-5 text-brand-green" />
                <span className="sr-only">Product requests</span>
              </dt>
              <dd className="text-ink-soft">Collection point for confirmed product requests</dd>
            </div>
          )}
        </dl>

        {store.mapsUrl && (
          <TrackedLink
            href={store.mapsUrl}
            event="store_directions_click"
            store={store.slug}
            className={buttonClasses({ variant: "primary", className: "mt-6 w-full sm:w-auto" })}
          >
            <Navigation aria-hidden className="size-4" /> Get directions
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </TrackedLink>
        )}
      </div>
    </article>
  );
}
