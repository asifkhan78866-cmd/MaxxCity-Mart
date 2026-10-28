export function Steps({
  steps,
  dark = false,
  columns = 4,
}: {
  steps: { title: string; body: string }[];
  dark?: boolean;
  columns?: 3 | 4;
}) {
  const cols = columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <ol className={`grid gap-x-8 gap-y-10 sm:grid-cols-2 ${cols}`}>
      {steps.map((s, i) => (
        <li key={s.title} className="reveal">
          <span
            aria-hidden
            className={`font-display text-sm font-bold tabular-nums ${dark ? "text-price-yellow" : "text-brand-green"}`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className={`mt-3 h-px w-full ${dark ? "bg-white/20" : "bg-line"}`} />
          <h3 className={`mt-4 font-display text-lg font-semibold ${dark ? "text-white" : "text-ink"}`}>
            <span className="sr-only">Step {i + 1}: </span>
            {s.title}
          </h3>
          <p className={`mt-2 leading-relaxed ${dark ? "text-white/75" : "text-ink-soft"}`}>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
