"use client";

import { useState } from "react";
import { collectionStores } from "@/content/stores";
import { HELP_CHOOSE_BRANCH } from "./constants";
import { productPriceRanges } from "@/content/product-requests";
import {
  ConsentField,
  EnquiryForm,
  FormSection,
  PhoneField,
  SelectField,
  TextArea,
  TextField,
} from "@/components/forms/form-kit";
import { UploadField } from "@/components/forms/upload-field";
import { LegalLink } from "@/components/forms/enquiry-copy";

export function ProductRequestForm() {
  const [branch, setBranch] = useState(collectionStores.length === 1 ? collectionStores[0]!.slug : "");
  const branchOptions = [
    ...collectionStores.map((s) => ({ value: s.slug, label: `${s.name} — ${s.locality}, ${s.city}` })),
    { value: HELP_CHOOSE_BRANCH, label: "My town isn't listed — help me choose" },
  ];

  return (
    <EnquiryForm
      form="product-request"
      event="product_request_submit"
      submitLabel="Send product request"
      confirmation={{
        title: "Thank you — we've received your product request",
        nextSteps: (
          <>
            <p className="font-semibold text-ink">What happens next</p>
            <ol>
              <li>Our team reviews your request and checks whether the product can be sourced.</li>
              <li>We contact you to confirm the price, timing and collection branch.</li>
              <li>If you agree, you collect the product from that branch.</li>
            </ol>
            <p className="mt-4 text-sm">
              This is a request, not an order. Nothing is reserved or charged, and availability is not guaranteed
              until our team confirms it with you.
            </p>
          </>
        ),
        links: [
          { href: "/request-product", label: "Request another product" },
          { href: "/stores", label: "Find a store" },
        ],
      }}
    >
      <FormSection title="1. The product" description="A clear photo is the quickest way to show us what you mean.">
        <UploadField name="image" label="Photo of the product" kind="image" />
        <TextField name="productName" label="Product name" placeholder="e.g. Steel lunch box with 3 compartments" maxLength={160} />
        <TextField
          name="productUrl"
          label="Link to the product"
          type="url"
          inputMode="url"
          placeholder="https://"
          hint="If you saw it online, paste the web address."
          maxLength={500}
        />
        <TextArea name="description" label="Description" rows={3} maxLength={1500} placeholder="What is it, and what is it used for?" />
        <TextField name="variant" label="Colour, size or variant" maxLength={300} placeholder="e.g. Blue, medium, 1 litre" />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="quantity"
            label="Quantity needed"
            type="number"
            inputMode="numeric"
            min={1}
            max={1000}
            step={1}
            defaultValue={1}
            required
            requiredMessage="Please enter a quantity."
          />
          <SelectField name="priceRange" label="Expected price range" options={productPriceRanges} placeholder="Choose a range" />
        </div>
      </FormSection>

      <FormSection title="2. Collection branch" description="Only open MaxxCity Mart branches that accept collections are listed.">
        <SelectField
          name="branch"
          label="Preferred collection branch"
          required
          options={branchOptions}
          placeholder="Choose a branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          requiredMessage="Please choose a branch, or ask us to help you choose."
        />
        {branch === HELP_CHOOSE_BRANCH && (
          <TextField
            name="preferredCity"
            label="Your town or city"
            autoComplete="address-level2"
            required
            maxLength={80}
            hint="We'll suggest the most convenient participating branch."
            requiredMessage="Please tell us your town or city."
          />
        )}
      </FormSection>

      <FormSection title="3. Your details">
        <TextField name="name" label="Your name" autoComplete="name" required maxLength={120} requiredMessage="Please enter your name." />
        <div className="grid gap-5 sm:grid-cols-2">
          <PhoneField />
          <TextField name="email" label="Email address" type="email" autoComplete="email" maxLength={200} />
        </div>
        <TextArea name="notes" label="Anything else?" rows={3} maxLength={1500} placeholder="Deadlines, alternatives you'd accept, etc." />
      </FormSection>

      <ConsentField>
        I agree to be contacted about this request, and I understand that a product request is not an order and
        does not guarantee availability or price. I have read the{" "}
        <LegalLink href="/legal/product-request-terms">product request terms</LegalLink>{" "}
        and{" "}
        <LegalLink href="/legal/privacy">privacy policy</LegalLink>
        .
      </ConsentField>
    </EnquiryForm>
  );
}
