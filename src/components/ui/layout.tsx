import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.16em] text-brand-green ${className}`}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  className = "",
  dark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow className={dark ? "text-price-yellow" : ""}>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className={`mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl ${dark ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`mt-4 text-lg leading-relaxed text-pretty ${dark ? "text-white/80" : "text-ink-soft"}`}>{lead}</p>
      )}
    </div>
  );
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Small notice used wherever availability, pricing or approval must be confirmed by the business. */
export function Notice({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "warm" }) {
  const styles =
    tone === "warm"
      ? "border-price-yellow/60 bg-[#fff8e1] text-ink"
      : "border-line bg-paper text-ink-soft";
  return <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles}`}>{children}</div>;
}
