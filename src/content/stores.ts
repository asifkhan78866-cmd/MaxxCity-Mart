/**
 * Store directory.
 *
 * Only add a branch once it is open and its details are verified. Fields left
 * as null are simply not shown — never fill them with guesses.
 *
 * `acceptsProductRequestCollection` controls whether the branch appears as a
 * collection point on the Request a Product form.
 */

export type Store = {
  slug: string;
  name: string;
  status: "open" | "coming-soon";
  city: string;
  locality: string;
  state: string;
  postalCode: string;
  streetAddress: string;
  landmark: string | null;
  /** Branch phone in E.164. null = use the main business line. */
  phoneE164: string | null;
  phoneDisplay: string | null;
  mapsUrl: string | null;
  /** e.g. [{ days: "Mon–Sun", hours: "10:00 am – 10:00 pm" }]. null until confirmed. */
  hours: { days: string; hours: string }[] | null;
  acceptsProductRequestCollection: boolean;
  photo: { src: string; alt: string } | null;
};

export const stores: Store[] = [
  {
    slug: "adilabad-mavala",
    name: "MaxxCity Mart Adilabad",
    status: "open",
    city: "Adilabad",
    locality: "Mavala",
    state: "Telangana",
    postalCode: "504002",
    streetAddress: "10-193, Adilabad Main Road",
    landmark: "Opposite Royal Enfield Showroom",
    phoneE164: null,
    phoneDisplay: null,
    mapsUrl: "https://maps.app.goo.gl/QAeTHGgxasy1RFfd6",
    hours: null,
    acceptsProductRequestCollection: true,
    photo: {
      src: "/images/maxxcity-mart-adilabad-storefront.jpg",
      alt: "MaxxCity Mart storefront on Adilabad Main Road, decorated with blue and white balloons on opening day",
    },
  },
];

export const openStores = stores.filter((s) => s.status === "open");
export const collectionStores = openStores.filter((s) => s.acceptsProductRequestCollection);

export function formatAddress(store: Store) {
  return [
    store.streetAddress,
    store.landmark,
    store.locality,
    `${store.city}, ${store.state} ${store.postalCode}`,
  ]
    .filter(Boolean)
    .join(", ");
}
