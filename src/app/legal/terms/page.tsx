import Link from "next/link";
import { LegalPage } from "@/components/layout/legal-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "The terms that apply when you use the MaxxCity Mart website.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" path="/legal/terms" intro="The terms that apply when you use the MaxxCity Mart website.">
      <h2>About this website</h2>
      <p>
        This website provides information about MaxxCity Mart, our store, and our franchise and partnership
        opportunities, and lets you send us enquiries and product requests. It is not an online shop: no products are
        sold and no payments are taken on this website.
      </p>

      <h2>Information on the website</h2>
      <p>
        We try to keep the information here accurate and current, but product ranges, prices, offers, store details
        and opening hours can change. Prices and offers displayed in store at the time of purchase apply. Nothing on
        this website is an offer capable of acceptance or a guarantee of availability.
      </p>

      <h2>Enquiries and requests</h2>
      <p>
        Submitting a form creates an enquiry only. It does not create an order, a contract, a franchise, a supply
        arrangement or any other commitment. See our{" "}
        <Link href="/legal/product-request-terms">product request terms</Link>,{" "}
        <Link href="/legal/franchise-disclaimer">franchise enquiry disclaimer</Link> and{" "}
        <Link href="/legal/business-enquiry-disclaimer">business enquiry disclaimer</Link>.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Only submit information that is accurate and that you are entitled to share.</li>
        <li>Do not upload unlawful, offensive or infringing material, or files containing malware.</li>
        <li>Do not attempt to disrupt the website, send automated submissions, or access data that isn&apos;t yours.</li>
      </ul>

      <h2>Brand and content</h2>
      <p>
        The MaxxCity Mart name, logo, photographs and website content belong to MaxxCity Mart or are used with
        permission. You may not use them without our written consent.
      </p>

      <h2>Links to other websites</h2>
      <p>
        Links to services such as Google Maps or WhatsApp are provided for convenience. Those services are governed by
        their own terms and privacy policies.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent permitted by law, we are not liable for any loss arising from use of, or reliance on, this
        website. Nothing in these terms limits any rights you have that cannot be limited by law.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>
    </LegalPage>
  );
}
