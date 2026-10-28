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

/** What MaxxCity Mart may provide, subject to the final agreement. */
export const franchiseSupport = [
  { title: "Brand licensing", body: "Approved use of the MaxxCity Mart name, logo and store identity." },
  { title: "Store layout & setup", body: "Guidance on layout, fixtures, signage and product placement." },
  { title: "Product sourcing", body: "Supply coordination and category planning for the ₹99 range." },
  { title: "POS & billing support", body: "Help setting up a billing system for the store, offered as a service." },
  { title: "Training", body: "Staff training and day-to-day operational guidance." },
  { title: "Launch marketing", body: "Guidance for your opening and local promotion." },
  { title: "Brand standards", body: "Consistent customer experience across every MaxxCity Mart outlet." },
  { title: "Ongoing support", body: "A point of contact for business questions after launch." },
];

/** What the franchise partner generally invests in and runs, subject to the final agreement. */
export const franchiseeResponsibilities = [
  "Commercial premises — owned or leased",
  "Store setup, fit-out and signage",
  "Initial stock investment",
  "Hiring and managing staff",
  "Day-to-day running and operating expenses",
];

export const franchiseProcess = [
  { title: "Submit an enquiry", body: "Fill in the franchise application form on this page." },
  { title: "Share your details", body: "Tell us about your location, property and business background." },
  { title: "Initial discussion", body: "Our team screens the enquiry and arranges a conversation." },
  { title: "Location & requirements", body: "We review commercial requirements and premises suitability together." },
  { title: "Due diligence & terms", body: "Both sides complete checks and agree terms in writing." },
  { title: "Agreement & launch", body: "Once approved and signed, we plan setup and launch with you." },
];
