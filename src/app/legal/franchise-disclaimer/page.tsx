import { LegalPage } from "@/components/layout/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Franchise Enquiry Disclaimer",
  description: "Important information about MaxxCity Mart franchise enquiries and the FOFO model.",
  path: "/legal/franchise-disclaimer",
});

export default function FranchiseDisclaimerPage() {
  return (
    <LegalPage
      title="Franchise Enquiry Disclaimer"
      path="/legal/franchise-disclaimer"
      intro="Important information about franchise enquiries and the FOFO model."
    >
      <h2>Enquiry only</h2>
      <p>
        Submitting a franchise enquiry does not create a franchise, an approval, a reservation of any location or
        territory, or any obligation on you or on MaxxCity Mart. Applications are never approved automatically.
      </p>

      <h2>Subject to review and agreement</h2>
      <p>
        Every enquiry is subject to screening, discussion, assessment of the proposed premises, due diligence by both
        parties and mutually agreed terms. A franchise exists only when a written franchise agreement has been signed by
        both parties. The terms of that agreement prevail over anything on this website.
      </p>

      <h2>No guaranteed results</h2>
      <p>
        MaxxCity Mart does not promise or guarantee any level of sales, profit, customer footfall, return on investment
        or payback period. The performance of any outlet depends on many factors, including location, management,
        local market conditions and the franchisee&apos;s own effort. Applicants should make their own independent
        assessment and take professional advice before investing.
      </p>

      <h2>Investment and support</h2>
      <p>
        Under the FOFO (Franchisee Owned, Franchisee Operated) model, the franchise partner generally invests in and
        operates the outlet. Any support described on this website is indicative; the actual support, fees and
        investment are set out in the final agreement.
      </p>
    </LegalPage>
  );
}
