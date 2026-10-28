import type { ReactNode } from "react";

/** Small notice used wherever availability, pricing or approval must be confirmed by the business. */
export function Notice({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "warm" }) {
  const styles =
    tone === "warm"
      ? "border-price-yellow/60 bg-[#fff8e1] text-ink"
      : "border-line bg-paper text-ink-soft";
  return <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles}`}>{children}</div>;
}
