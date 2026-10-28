"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CONSENT_KEY } from "@/lib/analytics";
import { analyticsConfigured, publicEnv } from "@/lib/config/public-env";

const GA_ID = publicEnv.gaMeasurementId;
const PLAUSIBLE_DOMAIN = publicEnv.plausibleDomain;

type Consent = "granted" | "denied" | null;
const CHANGE = "mcm-consent-change";
const REOPEN = "mcm-consent-reopen";

function readConsent(): Consent {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function writeConsent(v: Exclude<Consent, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, v);
  } catch {
    /* storage unavailable: the choice applies to this page view only */
  }
  window.dispatchEvent(new Event(CHANGE));
}

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE, cb);
    window.removeEventListener("storage", cb);
  };
}

function loadScript(src: string, attrs: Record<string, string> = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

function startAnalytics() {
  if (GA_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`);
  }
  if (PLAUSIBLE_DOMAIN) {
    loadScript("https://plausible.io/js/script.js", { "data-domain": PLAUSIBLE_DOMAIN, defer: "" });
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** Shown only when an analytics provider is configured. Nothing loads before the visitor accepts. */
export function ConsentBanner() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => "denied" as Consent);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const onReopen = () => setReopened(true);
    window.addEventListener(REOPEN, onReopen);
    return () => window.removeEventListener(REOPEN, onReopen);
  }, []);

  useEffect(() => {
    if (analyticsConfigured && consent === "granted") startAnalytics();
  }, [consent]);

  if (!analyticsConfigured || (consent !== null && !reopened)) return null;

  const choose = (v: "granted" | "denied") => {
    const withdrawing = consent === "granted" && v === "denied";
    writeConsent(v);
    setReopened(false);
    // Already-loaded analytics scripts cannot be unloaded; a reload starts the page without them.
    if (withdrawing) window.location.reload();
  };

  return (
    <section
      role="region"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-24 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-white p-5 shadow-xl lg:bottom-6"
    >
      <p className="text-sm leading-relaxed text-ink-soft">
        We would like to use analytics cookies to understand how visitors use this website. They are off unless
        you accept, and they never receive the details you type into our forms.{" "}
        <Link href="/legal/cookies" className="font-medium text-brand-blue underline underline-offset-4">
          Cookie notice
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="min-h-11 rounded-full bg-brand-blue px-5 text-sm font-semibold text-white hover:bg-brand-blue-deep"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="min-h-11 rounded-full border-2 border-ink/15 px-5 text-sm font-semibold text-ink hover:border-ink/40"
        >
          Decline
        </button>
      </div>
    </section>
  );
}

export function ConsentSettingsLink() {
  if (!analyticsConfigured) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(REOPEN))}
      className="hover:text-brand-blue hover:underline underline-offset-4"
    >
      Cookie settings
    </button>
  );
}
