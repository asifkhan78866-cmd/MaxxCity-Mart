import { LegalPage } from "@/components/layout/legal-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Cookie Notice",
  description: "How the MaxxCity Mart website uses browser storage and optional analytics cookies.",
  path: "/legal/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Notice" path="/legal/cookies" intro="How this website uses browser storage and optional analytics.">
      <h2>Essential storage</h2>
      <p>
        This website does not need cookies to work. If you make a choice about analytics, we remember it in your
        browser&apos;s local storage so we don&apos;t ask again on every page.
      </p>

      <h2>Optional analytics</h2>
      <p>
        If analytics is enabled on this website, we ask for your permission before loading it. Analytics helps us
        understand which pages are useful and whether visitors can find our forms — for example, how many people start
        a product request. It may set cookies in your browser.
      </p>
      <p>
        Analytics events never include your name, phone number, email address, the text you type into forms, or files
        you upload.
      </p>

      <h2>Changing your choice</h2>
      <p>
        When analytics is enabled, use the &ldquo;Cookie settings&rdquo; link in the website footer to change your
        choice at any time. You can also clear this website&apos;s data in your browser settings.
      </p>

      <h2>Third-party services</h2>
      <p>
        Links to Google Maps and WhatsApp open those services, which have their own cookie and privacy policies.
      </p>
    </LegalPage>
  );
}
