/**
 * Brand-level content for the MaxxCity Mart website.
 *
 * Related content lives alongside this file:
 *   contact.ts          phone, WhatsApp and enquiry topics
 *   franchise.ts        FOFO model, support, process and (unpublished) figures
 *   categories.ts       product and supplier categories
 *   stores.ts           verified store locations
 *   product-requests.ts request steps and price ranges
 *   partnerships.ts     manufacturer and retailer options
 *   faqs.ts             questions and answers
 *   navigation.ts       header, footer and legal links
 */

export const site = {
  name: "MaxxCity Mart",
  /** Shown in the privacy policy. Replace with the registered entity name once confirmed. */
  legalName: "MaxxCity Mart",
  promise: "Maxx Saving • Maxx Value",
  tagline: "People • Products • A Better Tomorrow",
  category: "Fixed-price variety retail",
  description:
    "MaxxCity Mart is a fixed-price variety retail store in Adilabad, Telangana, built around everyday products at ₹99. Explore FOFO franchise opportunities, request a product, or partner with us as a manufacturer or retailer.",
  locale: "en_IN",
  founder: {
    name: "Syed Asif",
    role: "Founder, MaxxCity Mart",
    /** Path under /public, e.g. "/images/founder/syed-asif.jpg". Leave null until an approved photograph is supplied. */
    photo: null as string | null,
    /**
     * Proposed vision statement — editable website copy for the founder to
     * review. Change the wording here and it updates everywhere it appears.
     */
    message:
      "My vision for MaxxCity Mart is to make everyday shopping more accessible while creating opportunities for entrepreneurs, retailers, and manufacturers. I want to build a retail concept centred on value, convenience, trust, and long-term partnerships—one that can grow into more communities through a consistent customer experience.",
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

/** Date shown on legal pages. Update whenever a policy is changed. */
export const legalLastUpdated = "29 October 2026";
