/**
 * Privacy-conscious analytics helpers.
 *
 * Events fire only when an analytics provider is configured AND the visitor
 * has accepted analytics cookies. Payloads are limited to the whitelisted,
 * non-personal properties below — never names, phone numbers, emails,
 * free text or uploaded files.
 */

export type AnalyticsEvent =
  | "franchise_cta_click"
  | "franchise_application_submit"
  | "product_request_submit"
  | "product_image_added"
  | "manufacturer_enquiry_submit"
  | "retailer_enquiry_submit"
  | "contact_enquiry_submit"
  | "location_interest_submit"
  | "store_directions_click"
  | "phone_click"
  | "whatsapp_click";

type SafeProps = {
  /** Where on the site the action happened, e.g. "hero", "footer". */
  placement?: string;
  /** Store slug for directions clicks. */
  store?: string;
};

export const CONSENT_KEY = "mcm-analytics-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function hasAnalyticsConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function track(event: AnalyticsEvent, props: SafeProps = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  const clean: Record<string, string> = {};
  if (props.placement) clean.placement = props.placement.slice(0, 40);
  if (props.store) clean.store = props.store.slice(0, 60);
  window.gtag?.("event", event, clean);
  window.plausible?.(event, { props: clean });
}
