import Link from "next/link";
import type { ReactNode } from "react";

/** Inline link to a legal page, as used in consent text. */
export function LegalLink({ href, children }: { href: `/legal/${string}`; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-brand-blue underline underline-offset-4">
      {children}
    </Link>
  );
}

export const PrivacyLink = () => <LegalLink href="/legal/privacy">privacy policy</LegalLink>;

export const BusinessDisclaimerLink = () => (
  <LegalLink href="/legal/business-enquiry-disclaimer">business enquiry disclaimer</LegalLink>
);

/** Confirmation copy shared by the manufacturer and retailer forms. */
export function BusinessNextSteps() {
  return (
    <>
      <p className="font-semibold text-ink">What happens next</p>
      <ol>
        <li>Our team reviews your proposal.</li>
        <li>If there is a potential fit, we contact you to discuss it further.</li>
      </ol>
      <p className="mt-4 text-sm">
        Submitting an enquiry does not create any commitment to purchase, supply or partner. Any arrangement is subject
        to evaluation and a written agreement.
      </p>
    </>
  );
}
