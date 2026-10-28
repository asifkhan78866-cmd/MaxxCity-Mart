import { contact } from "@/content/site";

export const telHref = (e164: string = contact.phoneE164) => `tel:${e164}`;

/** Opens WhatsApp with a prefilled draft. Nothing is sent until the visitor taps send. */
export function whatsappHref(message: string = contact.whatsappMessages.general) {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
