/** Aisles shown on the homepage and About page. `icon` names a Lucide icon mapped in category-grid.tsx. */
export const productCategories = [
  { slug: "kitchen", name: "Kitchen & crockery", icon: "CookingPot", blurb: "Cookware, containers, utensils and serving essentials." },
  { slug: "electrical", name: "Electrical items", icon: "PlugZap", blurb: "Everyday electrical accessories and small fittings." },
  { slug: "beauty", name: "Beauty & personal care", icon: "Sparkles", blurb: "Grooming, skincare and personal-care basics." },
  { slug: "clothing", name: "Clothing", icon: "Shirt", blurb: "Everyday wear and accessories." },
  { slug: "footwear", name: "Footwear", icon: "Footprints", blurb: "Casual and everyday footwear." },
  { slug: "toys", name: "Toys & stationery", icon: "Blocks", blurb: "Toys, games, school and office stationery." },
  { slug: "cleaning", name: "Cleaning products", icon: "SprayCan", blurb: "Home cleaning tools and supplies." },
  { slug: "daily-use", name: "Daily-use & lifestyle", icon: "ShoppingBasket", blurb: "Storage, home and day-to-day lifestyle products." },
] as const;

/** Categories offered on the manufacturer form. Indicative only — every proposal is evaluated. */
export const supplierCategories = [
  "Household & kitchen",
  "Electrical accessories",
  "Beauty & personal care",
  "Clothing & footwear",
  "Toys & stationery",
  "Cleaning products",
  "Daily-use & lifestyle",
  "Other",
] as const;
