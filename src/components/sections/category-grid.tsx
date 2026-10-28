import {
  Blocks,
  CookingPot,
  Footprints,
  PlugZap,
  Shirt,
  ShoppingBasket,
  Sparkles,
  SprayCan,
  type LucideIcon,
} from "lucide-react";
import { productCategories } from "@/content/categories";

const icons: Record<(typeof productCategories)[number]["icon"], LucideIcon> = {
  CookingPot,
  PlugZap,
  Sparkles,
  Shirt,
  Footprints,
  Blocks,
  SprayCan,
  ShoppingBasket,
};

export function CategoryGrid({ showBlurb = true }: { showBlurb?: boolean }) {
  return (
    <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-4">
      {productCategories.map((c) => {
        const Icon = icons[c.icon];
        return (
          <li key={c.slug} className="reveal border-b border-r border-line p-5 sm:p-6">
            <Icon aria-hidden className="size-7 text-brand-blue" strokeWidth={1.75} />
            <h3 className="mt-4 font-display text-base font-semibold leading-snug text-ink sm:text-lg">{c.name}</h3>
            {showBlurb && <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{c.blurb}</p>}
          </li>
        );
      })}
    </ul>
  );
}
