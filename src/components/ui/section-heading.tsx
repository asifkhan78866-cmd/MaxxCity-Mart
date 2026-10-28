import type { ReactNode } from "react";

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
