import Image from "next/image";
import { site } from "@/content/site";

/**
 * Shows the founder photograph once `site.founder.photo` is set.
 * Until then, a typographic placeholder keeps the layout intact without
 * using a stock or generated face.
 */
export function FounderPortrait({ className = "", sizes = "(min-width: 1024px) 420px, 100vw" }: { className?: string; sizes?: string }) {
  const { photo, name, role } = site.founder;
  return (
    <figure className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-blue ${className}`}>
      {photo ? (
        <Image src={photo} alt={`${name}, ${role}`} fill sizes={sizes} className="object-cover" />
      ) : (
        <div aria-hidden className="flex h-full flex-col justify-between p-8 text-white">
          <span className="font-display text-8xl font-extrabold leading-none tracking-tighter text-white/90 sm:text-9xl">
            SA
          </span>
          <span className="h-1.5 w-16 rounded-full bg-brand-green" />
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 bg-ink/80 px-6 py-4 text-white backdrop-blur-sm">
        <span className="block font-display text-lg font-semibold">{name}</span>
        <span className="block text-sm text-white/75">{role}</span>
      </figcaption>
    </figure>
  );
}
