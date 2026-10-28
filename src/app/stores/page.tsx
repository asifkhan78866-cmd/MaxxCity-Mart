import { PageHero } from "@/components/page-hero";
import { Container, JsonLd, SectionHeading } from "@/components/ui/layout";
import { StoreCard } from "@/components/sections/store-card";
import { LocationInterestForm } from "@/components/forms/business-forms";
import { openStores, shortLocation, stores } from "@/content/stores";
import { allStoresJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Find a Store in Adilabad",
  description:
    `Find MaxxCity Mart stores. Visit our ₹99 fixed-price variety store on ${openStores.map(shortLocation).join("; ")}, or ask us to open in your town.`,
  path: "/stores",
});

export default function StoresPage() {
  const byCity = Object.entries(
    openStores.reduce<Record<string, typeof openStores>>((acc, s) => {
      (acc[`${s.city}, ${s.state}`] ??= []).push(s);
      return acc;
    }, {}),
  );
  const comingSoon = stores.filter((s) => s.status === "coming-soon");

  return (
    <>
      <PageHero
        crumbs={[{ name: "Find a Store", path: "/stores" }]}
        eyebrow="Store directory"
        title="Find a MaxxCity Mart store"
        lead={`${openStores.length === 1 ? "Our store is" : `We have ${openStores.length} stores`} open today. New locations will be listed here once they are confirmed and open.`}
      />

      <section aria-label="Open stores">
        <Container className="space-y-14 py-14 sm:py-16">
          {byCity.map(([city, list]) => (
            <div key={city}>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-brand-green">{city}</h2>
              <div className={`mt-5 grid gap-6 ${list.length > 1 ? "lg:grid-cols-2" : ""}`}>
                {list.map((s) => (
                  <StoreCard key={s.slug} store={s} wide={list.length === 1} headingLevel="h3" />
                ))}
              </div>
            </div>
          ))}
          {comingSoon.length > 0 && (
            <div>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-brand-green">Coming soon</h2>
              <div className="mt-5 grid gap-6 lg:grid-cols-2">
                {comingSoon.map((s) => (
                  <StoreCard key={s.slug} store={s} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      <section id="new-location" aria-labelledby="interest-heading" className="scroll-mt-20 border-t border-line bg-paper">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            id="interest-heading"
            eyebrow="Not near you yet?"
            title="Ask for MaxxCity Mart in your town"
            lead="Tell us where you are. We use this to plan where to open next — and if you'd like to run a store yourself, take a look at our franchise opportunity."
          />
          <div className="rounded-2xl border border-line bg-white p-5 sm:p-7">
            <LocationInterestForm />
          </div>
        </Container>
      </section>

      <JsonLd data={allStoresJsonLd()} />
    </>
  );
}
