import { Container } from "@/components/ui/layout";
import { pricing } from "@/content/site";

export function PriceTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`price-tag inline-flex items-center bg-price-yellow pl-6 pr-4 font-display font-extrabold leading-none tracking-tight text-price-red ${className}`}
    >
      {pricing.pricePoint}
    </span>
  );
}

export function PriceBand() {
  return (
    <section aria-labelledby="price-heading" className="bg-price-yellow">
      <Container className="grid items-center gap-8 py-14 sm:py-16 lg:grid-cols-[auto_1fr] lg:gap-16">
        <p
          aria-hidden
          className="reveal font-display text-[7.5rem] font-extrabold leading-[0.8] tracking-tighter text-price-red sm:text-[10rem] lg:text-[13rem]"
        >
          {pricing.pricePoint}
        </p>
        <div className="reveal max-w-xl">
          {pricing.promo && (
            <p className="mb-3 inline-block rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              {pricing.promo}
            </p>
          )}
          <h2 id="price-heading" className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            {pricing.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">{pricing.body}</p>
          <p className="mt-4 text-sm text-ink/70">{pricing.finePrint}</p>
        </div>
      </Container>
    </section>
  );
}
