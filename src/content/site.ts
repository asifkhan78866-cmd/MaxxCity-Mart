/**
 * Central business content for the MaxxCity Mart website.
 *
 * Everything a non-developer is likely to change lives here: contact details,
 * the price-point message, franchise options and the founder message.
 * Values marked "UNPUBLISHED" are deliberately empty and are not shown on
 * the site until the business approves real figures.
 */

export const site = {
  name: "MaxxCity Mart",
  legalName: "MaxxCity Mart", // Replace with the registered entity name once confirmed.
  promise: "Maxx Saving • Maxx Value",
  tagline: "People • Products • A Better Tomorrow",
  category: "Fixed-price variety retail",
  description:
    "MaxxCity Mart is a fixed-price variety retail store in Adilabad, Telangana, built around everyday products at ₹99. Explore FOFO franchise opportunities, request a product, or partner with us as a manufacturer or retailer.",
  locale: "en_IN",
  founder: {
    name: "Syed Asif",
    role: "Founder, MaxxCity Mart",
    /** Path under /public, e.g. "/images/founder-syed-asif.jpg". Leave null until an approved photograph is supplied. */
    photo: null as string | null,
    /**
     * Proposed vision statement — editable website copy for the founder to
     * review. Change the wording here and it updates everywhere it appears.
     */
    message:
      "My vision for MaxxCity Mart is to make everyday shopping more accessible while creating opportunities for entrepreneurs, retailers, and manufacturers. I want to build a retail concept centred on value, convenience, trust, and long-term partnerships—one that can grow into more communities through a consistent customer experience.",
  },
} as const;

export const contact = {
  /** Shown to visitors. */
  phoneDisplay: "+91 91007 70398",
  /** Used in tel: links (E.164). */
  phoneE164: "+919100770398",
  /** Used in wa.me links: country code + number, digits only. */
  whatsappNumber: "919100770398",
  whatsappMessages: {
    general: "Hello MaxxCity Mart, I have a question.",
    franchise:
      "Hello MaxxCity Mart, I am interested in the FOFO franchise opportunity. Please share the details.",
    productRequest: "Hello MaxxCity Mart, I would like to ask about a product request.",
    partnership: "Hello MaxxCity Mart, I would like to discuss a business partnership.",
  },
} as const;

/** The ₹99 proposition. Edit the copy here; keep claims to what the store actually offers. */
export const pricing = {
  pricePoint: "₹99",
  headline: "Everyday products at ₹99",
  body: "MaxxCity Mart is built around one simple price point. Walk in, pick what you need from a wide range of everyday products, and know what you are paying at a glance.",
  finePrint:
    "The range, price points and offers displayed in store apply at the time of purchase and may change.",
  /** Optional promotional line shown above the price band. Leave empty to hide. */
  promo: "",
} as const;

export const franchise = {
  model: "FOFO",
  modelFull: "Franchisee Owned, Franchisee Operated",
  /**
   * UNPUBLISHED commercial figures. Each is hidden until a value is entered
   * AND `published` is set to true after the business approves it.
   */
  figures: {
    published: false,
    franchiseFee: "",
    investmentRange: "",
    areaRequirement: "",
    agreementTerm: "",
  },
  /** Options for "investment readiness" on the application form. No amounts by design. */
  investmentReadiness: [
    { value: "ready", label: "I have funds arranged and am ready to proceed" },
    { value: "arranging", label: "I am arranging funds (within the next 3 months)" },
    { value: "exploring", label: "I am exploring and would like to understand the requirements first" },
  ],
  propertyOptions: [
    { value: "own", label: "Yes — I own a suitable commercial property" },
    { value: "lease", label: "Yes — I have a property I can lease or rent" },
    { value: "searching", label: "Not yet — I am looking for a property" },
  ],
} as const;

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

/** Categories offered on the manufacturer form. Indicative only. */
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

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry",
] as const;

/** Date shown on legal pages. Update whenever a policy is changed. */
export const legalLastUpdated = "29 October 2026";
