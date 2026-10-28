import { LegalPage } from "@/components/layout/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Product Request Terms",
  description: "How MaxxCity Mart product requests work, and what a request does and does not mean.",
  path: "/legal/product-request-terms",
});

export default function ProductRequestTermsPage() {
  return (
    <LegalPage
      title="Product Request Terms"
      path="/legal/product-request-terms"
      intro="How product requests work, and what a request does and does not mean."
    >
      <h2>A request, not an order</h2>
      <p>
        When you submit a product request, you are asking MaxxCity Mart to look into sourcing a product. A request is
        not an order, a reservation or a contract, and no payment is taken on this website.
      </p>

      <h2>Review and confirmation</h2>
      <ul>
        <li>Our team reviews each request and decides whether, and how, the product can be sourced.</li>
        <li>
          Sourcing feasibility, price, availability, quantity and collection timing are confirmed only when our team
          contacts you.
        </li>
        <li>
          We cannot guarantee that every requested product can be sourced, or that it can be sourced at ₹99 or at the
          price range you indicate.
        </li>
        <li>We may decline a request without giving a reason.</li>
      </ul>

      <h2>Collection</h2>
      <p>
        If we confirm a request and you agree to the terms we share with you, the product is collected from the
        participating MaxxCity Mart branch we agree with you. Any payment is made at that branch, under the terms
        confirmed at that time.
      </p>

      <h2>Your photos and links</h2>
      <p>
        Only upload photos you took or are allowed to share. We use them solely to identify and source the product you
        requested. Uploaded photos are stored privately and are not published.
      </p>

      <h2>Restricted products</h2>
      <p>
        We do not source products that are illegal, unsafe, counterfeit, age-restricted or otherwise unsuitable for our
        stores.
      </p>
    </LegalPage>
  );
}
