export const manufacturerProcess = [
  { title: "Send your enquiry", body: "Share your company, product categories and capability, with a catalogue if you have one." },
  { title: "Evaluation", body: "We assess fit with our range, price point, quality and supply needs." },
  { title: "Discussion & samples", body: "Where there's potential, we get in touch to discuss products, samples and terms." },
  { title: "Commercial approval", body: "Any supply arrangement is confirmed in writing before orders are placed." },
];

export const retailerBusinessTypes = [
  { value: "retailer", label: "Retailer" },
  { value: "wholesaler", label: "Wholesaler" },
  { value: "distributor", label: "Distributor" },
  { value: "supplier", label: "Supplier / trader" },
  { value: "other", label: "Other local business" },
] as const;

/** Kinds of partnership offered on the retailer form and described on /retailers. */
export const retailerProposals = [
  { value: "distribution", label: "Product distribution", description: "Distributing products that fit the MaxxCity Mart range." },
  { value: "wholesale", label: "Wholesale supply", description: "Supplying stock at wholesale for our stores." },
  { value: "local-sourcing", label: "Local sourcing", description: "Helping us source locally made or locally available products." },
  { value: "regional", label: "Regional partnership", description: "Exploring how we could work together in your region." },
  { value: "other", label: "Something else", description: "Any other commercial relationship that benefits both sides." },
] as const;
