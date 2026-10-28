import { LegalPage } from "@/components/layout/legal-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Supplier & Business Enquiry Disclaimer",
  description: "Important information for manufacturers, suppliers, retailers and other businesses contacting MaxxCity Mart.",
  path: "/legal/business-enquiry-disclaimer",
});

export default function BusinessDisclaimerPage() {
  return (
    <LegalPage
      title="Supplier & Business Enquiry Disclaimer"
      path="/legal/business-enquiry-disclaimer"
      intro="Important information for manufacturers, suppliers, retailers and other businesses."
    >
      <h2>No commitment</h2>
      <p>
        Submitting an enquiry, proposal, catalogue or sample does not commit MaxxCity Mart to purchase any product,
        appoint any supplier or distributor, or enter into any partnership. Product categories listed on this website
        are indicative only.
      </p>

      <h2>Evaluation</h2>
      <p>
        Proposals are evaluated at our discretion, taking into account factors such as product suitability, quality,
        price, compliance and supply capability. We may not respond to every enquiry.
      </p>

      <h2>Agreements</h2>
      <p>
        Any supply, distribution or partnership arrangement is subject to commercial approval and a written agreement
        signed by both parties. We do not grant resale rights, exclusivity or territories through this website.
      </p>

      <h2>Information you share</h2>
      <p>
        Please do not send confidential information unless we have agreed in writing to keep it confidential. Product
        information and catalogues you submit are used only to evaluate your proposal.
      </p>
    </LegalPage>
  );
}
