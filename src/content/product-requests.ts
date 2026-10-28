export const productRequestSteps = [
  { title: "Show us the product", body: "Upload a photo, paste a link, or describe what you're looking for." },
  { title: "Choose a branch", body: "Pick a MaxxCity Mart collection branch, or ask us to suggest one." },
  { title: "We review it", body: "Our team checks whether it can be sourced, and at what price and timing." },
  { title: "We call you back", body: "If confirmed, you collect it from the agreed branch. No payment is taken online." },
];

/** The customer's own expectation — not a price we offer. */
export const productPriceRanges = [
  { value: "up-to-99", label: "Up to ₹99" },
  { value: "100-299", label: "₹100 – ₹299" },
  { value: "300-999", label: "₹300 – ₹999" },
  { value: "1000-plus", label: "₹1,000 or more" },
  { value: "not-sure", label: "Not sure" },
] as const;
