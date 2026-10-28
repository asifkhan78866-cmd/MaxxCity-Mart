export type Faq = { q: string; a: string; link?: { href: string; label: string } };

export const faqs: Faq[] = [
  {
    q: "What is MaxxCity Mart?",
    a: "MaxxCity Mart is a fixed-price variety retail store. Our concept is built around a wide range of everyday products at the ₹99 price point, with our current store on Adilabad Main Road in Adilabad, Telangana.",
    link: { href: "/about", label: "About MaxxCity Mart" },
  },
  {
    q: "How does the ₹99 concept work?",
    a: "Our range is planned around one simple price point, so you can pick up everyday essentials and know what you are paying at a glance. The range, price points and offers displayed in store at the time of purchase are the ones that apply.",
  },
  {
    q: "Which product categories are available?",
    a: "Our range typically covers kitchen and crockery, electrical items, beauty and personal care, clothing, footwear, toys and stationery, cleaning products, and daily-use lifestyle items. Exact products vary by store and season.",
  },
  {
    q: "Can I request a product by sending a picture?",
    a: "Yes. Upload a photo of the product, add a few details, choose a collection branch and submit. You will receive a reference number, and our team will review the request and contact you.",
    link: { href: "/request-product", label: "Request a product" },
  },
  {
    q: "How does collection from a branch work?",
    a: "If we can source your requested product, our team will contact you to confirm the price, timing and the participating branch where you can collect it. Nothing is reserved or charged when you submit a request.",
  },
  {
    q: "Does a product request guarantee availability?",
    a: "No. A product request is not an order or a guarantee. Sourcing feasibility, price, availability and collection timing are all confirmed by our team after review. We cannot promise that every requested product can be sourced, or sourced at ₹99.",
  },
  {
    q: "Can I apply for a MaxxCity Mart franchise?",
    a: "Yes. Submit a franchise enquiry with your location and business details. Our team will review it and contact you for an initial discussion. Every application is subject to screening, due diligence and a signed franchise agreement.",
    link: { href: "/franchise#apply", label: "Apply for a franchise" },
  },
  {
    q: "What does FOFO mean?",
    a: "FOFO stands for Franchisee Owned, Franchisee Operated. The franchise partner generally invests in and runs the outlet — including premises, setup, initial stock, staff and running costs — while MaxxCity Mart provides the brand and the agreed support, subject to the final agreement.",
  },
  {
    q: "What investment is required to open a franchise?",
    a: "Investment depends on the location, store size and setup. We share the commercial requirements directly with applicants during the discussion stage rather than publishing a single figure. Please submit an enquiry or call us for details.",
  },
  {
    q: "How can manufacturers approach MaxxCity Mart?",
    a: "Manufacturers can use our manufacturer enquiry form to share their company details, product categories and supply capability, and can attach a catalogue. Every proposal is evaluated, and submitting one does not commit MaxxCity Mart to any purchase.",
    link: { href: "/manufacturers", label: "Manufacturer enquiries" },
  },
  {
    q: "Can retailers or distributors submit partnership proposals?",
    a: "Yes. Retailers, wholesalers, distributors and other local businesses can send a proposal through our retailer partnership form. Any collaboration is subject to mutual agreement.",
    link: { href: "/retailers", label: "Retailer partnerships" },
  },
];

/** The subset shown on the homepage. */
export const homeFaqs = [faqs[1], faqs[3], faqs[5], faqs[7], faqs[8]];
