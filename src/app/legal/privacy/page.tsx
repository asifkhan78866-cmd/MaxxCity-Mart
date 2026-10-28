import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { contact } from "@/content/contact";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How MaxxCity Mart collects, uses and protects the information you share through this website.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/legal/privacy"
      intro="How MaxxCity Mart collects, uses and protects the information you share through this website."
    >
      <h2>Who we are</h2>
      <p>
        This website is operated by {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). You can contact us about
        this policy or your information by calling or messaging {contact.phoneDisplay}.
      </p>

      <h2>Information we collect</h2>
      <p>We only collect information you choose to give us through our forms:</p>
      <ul>
        <li>Contact details such as your name, mobile number, email address, city and state.</li>
        <li>
          Details of your enquiry — for example, a product you would like us to source, your proposed franchise
          location, or information about your business.
        </li>
        <li>Files you upload, such as a product photo or a product catalogue.</li>
        <li>The date and time of your submission and a reference number we generate.</li>
      </ul>
      <p>
        Product photos are re-processed when uploaded, which removes embedded camera information such as GPS
        location. We do not ask for payment details, and this website does not take payments.
      </p>
      <p>
        To protect our forms from abuse, our servers briefly process technical information such as your IP address.
        This is used for rate limiting and is not stored with your submission.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To review and respond to your request or enquiry, and to contact you about it.</li>
        <li>To check whether a requested product can be sourced and to arrange collection at a branch.</li>
        <li>To assess franchise, supplier and partnership enquiries.</li>
        <li>To keep a record of enquiries and to protect our website from spam and misuse.</li>
      </ul>
      <p>We do not sell your information, and we do not use it for unrelated marketing without your consent.</p>

      <h2>Who can see it</h2>
      <p>
        Submissions are stored in a private database and file store that the public cannot access. Only authorised
        MaxxCity Mart staff can view them. We use service providers to host this website, store submissions and send
        internal email notifications; they process information on our behalf and only as needed to provide those
        services. We may disclose information where required by law.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        We only use analytics cookies if you accept them. Analytics never receives the details you type into our forms
        or the files you upload. See our <Link href="/legal/cookies">cookie notice</Link>.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry records for as long as needed to handle your enquiry and for a reasonable period afterwards
        for record-keeping, unless the law requires longer. You can ask us to delete your information sooner.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        Subject to applicable Indian law, including the Digital Personal Data Protection Act, 2023, you may ask to
        access, correct or erase the personal information you have given us, or withdraw consent for us to contact
        you. Call or WhatsApp {contact.phoneDisplay} and quote your reference number if you have one.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above shows the latest version.</p>
    </LegalPage>
  );
}
