export const primaryNav = [
  { href: "/franchise", label: "Franchise" },
  { href: "/request-product", label: "Request a Product" },
  { href: "/stores", label: "Find a Store" },
  { href: "/partner-with-us", label: "Partner With Us" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerNav = [
  {
    title: "MaxxCity Mart",
    links: [
      { href: "/about", label: "About us" },
      { href: "/founder", label: "Founder & vision" },
      { href: "/stores", label: "Find a store" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Work with us",
    links: [
      { href: "/franchise", label: "Franchise (FOFO)" },
      { href: "/manufacturers", label: "Manufacturers" },
      { href: "/retailers", label: "Retailers & distributors" },
      { href: "/partner-with-us", label: "All business enquiries" },
    ],
  },
  {
    title: "Customers",
    links: [
      { href: "/request-product", label: "Request a product" },
      { href: "/legal/product-request-terms", label: "Product request terms" },
      { href: "/stores#new-location", label: "Ask for a store in your city" },
    ],
  },
] as const;

export const legalNav = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms of use" },
  { href: "/legal/franchise-disclaimer", label: "Franchise disclaimer" },
  { href: "/legal/business-enquiry-disclaimer", label: "Business enquiry disclaimer" },
  { href: "/legal/cookies", label: "Cookies" },
] as const;
