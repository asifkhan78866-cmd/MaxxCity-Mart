export const contact = {
  /** Shown to visitors. */
  phoneDisplay: "+91 91007 70398",
  /** Used in tel: links (E.164). */
  phoneE164: "+919100770398",
  /** Used in wa.me links: country code + number, digits only. */
  whatsappNumber: "919100770398",
  /** Drafts that open in WhatsApp. Nothing is sent until the visitor taps send. */
  whatsappMessages: {
    general: "Hello MaxxCity Mart, I have a question.",
    franchise:
      "Hello MaxxCity Mart, I am interested in the FOFO franchise opportunity. Please share the details.",
    productRequest: "Hello MaxxCity Mart, I would like to ask about a product request.",
    partnership: "Hello MaxxCity Mart, I would like to discuss a business partnership.",
  },
} as const;

/** Topics on the general contact form. `/contact?topic=<value>` preselects one. */
export const contactTopics = [
  { value: "general", label: "General question" },
  { value: "product-request", label: "An existing product request" },
  { value: "franchise", label: "Franchise" },
  { value: "manufacturer", label: "Manufacturing / supply" },
  { value: "retailer", label: "Retail or distribution partnership" },
  { value: "property", label: "Proposing a commercial property" },
  { value: "other", label: "Something else" },
] as const;
