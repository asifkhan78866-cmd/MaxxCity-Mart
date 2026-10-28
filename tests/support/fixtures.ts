import sharp from "sharp";

/** Minimal valid payloads for each form, matching what the browser forms send. */
export const validPayloads = {
  franchise: {
    fullName: "Ravi Kumar",
    phone: "9123456780",
    city: "Nirmal",
    state: "Telangana",
    preferredLocation: "Main road near the bus stand",
    propertyStatus: "lease",
    investmentReadiness: "exploring",
    consent: "yes",
  },
  "product-request": {
    productName: "Steel lunch box",
    quantity: "2",
    branch: "adilabad-mavala",
    name: "Test Customer",
    phone: "+91 98765 43210",
    consent: "yes",
  },
  manufacturer: {
    companyName: "ABC Plastics",
    contactPerson: "Anil",
    phone: "9123456780",
    email: "anil@example.com",
    location: "Hyderabad, Telangana",
    categories: ["Household & kitchen", "Cleaning products"],
    productDescription: "Plastic containers and buckets",
    consent: "yes",
  },
  retailer: {
    businessName: "Sri Traders",
    contactPerson: "Sri",
    phone: "9123456780",
    location: "Adilabad",
    businessType: "wholesaler",
    categories: "Stationery",
    proposal: "wholesale",
    consent: "yes",
  },
  contact: {
    name: "Meena",
    phone: "9123456780",
    topic: "property",
    message: "I have a 1200 sq ft shop on the highway.",
    consent: "yes",
  },
  "location-interest": {
    name: "Kiran",
    phone: "9123456780",
    city: "Mancherial",
    state: "Telangana",
    consent: "yes",
  },
} satisfies Record<string, Record<string, string | string[]>>;

/** A real JPEG carrying EXIF camera metadata, as a phone photo would. */
export async function jpegWithExif(width = 40, height = 30) {
  return sharp({ create: { width, height, channels: 3, background: "#cc2222" } })
    .jpeg()
    .withExif({ IFD0: { Make: "TestCam", Model: "Phone 1" } })
    .toBuffer();
}

/** A PNG with a fully transparent background. */
export async function transparentPng() {
  return sharp({ create: { width: 20, height: 20, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .png()
    .toBuffer();
}

export const file = (bytes: Uint8Array | Buffer, name: string, type: string) =>
  new File([new Uint8Array(bytes)], name, { type });
