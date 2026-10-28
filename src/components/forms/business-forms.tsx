"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { indianStates, supplierCategories } from "@/content/site";
import { contactTopics, retailerBusinessTypes, retailerProposals } from "@/lib/forms/types";
import {
  ChoiceGroup,
  ConsentField,
  EnquiryForm,
  FormSection,
  PhoneField,
  SelectField,
  TextArea,
  TextField,
} from "@/components/forms/form-kit";
import { UploadField } from "@/components/forms/upload-field";

const businessNextSteps = (
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

const PrivacyLink = () => (
  <Link href="/legal/privacy" className="font-semibold text-brand-blue underline underline-offset-4">
    privacy policy
  </Link>
);
const BusinessDisclaimerLink = () => (
  <Link href="/legal/business-enquiry-disclaimer" className="font-semibold text-brand-blue underline underline-offset-4">
    business enquiry disclaimer
  </Link>
);

export function ManufacturerForm() {
  return (
    <EnquiryForm
      form="manufacturer"
      event="manufacturer_enquiry_submit"
      submitLabel="Submit manufacturer enquiry"
      confirmation={{ title: "Thank you — your manufacturer enquiry has been received", nextSteps: businessNextSteps }}
    >
      <FormSection title="Company">
        <TextField name="companyName" label="Company or manufacturing-unit name" autoComplete="organization" required maxLength={160} requiredMessage="Please enter your company name." />
        <TextField name="location" label="Manufacturing location" hint="City and state of your unit." required maxLength={200} requiredMessage="Please enter your manufacturing location." />
        <TextField name="websiteUrl" label="Website or online catalogue" type="url" inputMode="url" placeholder="https://" maxLength={500} />
      </FormSection>

      <FormSection title="Contact">
        <TextField name="contactPerson" label="Contact person" autoComplete="name" required maxLength={120} requiredMessage="Please enter a contact person." />
        <div className="grid gap-5 sm:grid-cols-2">
          <PhoneField label="Phone" />
          <TextField name="email" label="Email address" type="email" autoComplete="email" required maxLength={200} requiredMessage="Please enter an email address." />
        </div>
      </FormSection>

      <FormSection title="Products & capability">
        <ChoiceGroup name="categories" type="checkbox" label="Product categories" hint="Choose all that apply." required columns={2} options={supplierCategories} />
        <TextArea
          name="productDescription"
          label="Product description"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          requiredMessage="Please describe your products."
          placeholder="What do you make? Materials, typical price points, packaging…"
        />
        <UploadField name="catalogue" label="Catalogue or line sheet" kind="catalogue" />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="moq" label="Minimum order quantity" maxLength={200} placeholder="e.g. 500 pcs per SKU" />
          <TextField name="capacity" label="Production / supply capability" maxLength={500} placeholder="e.g. 20,000 pcs per month" />
        </div>
        <TextArea name="additionalInfo" label="Additional details" rows={3} maxLength={2000} />
      </FormSection>

      <ConsentField>
        I agree to be contacted about this enquiry. I understand that submitting it does not commit MaxxCity Mart to
        any purchase, and I have read the <BusinessDisclaimerLink /> and <PrivacyLink />.
      </ConsentField>
    </EnquiryForm>
  );
}

export function RetailerForm() {
  return (
    <EnquiryForm
      form="retailer"
      event="retailer_enquiry_submit"
      submitLabel="Submit partnership enquiry"
      confirmation={{ title: "Thank you — your partnership enquiry has been received", nextSteps: businessNextSteps }}
    >
      <FormSection title="Business">
        <TextField name="businessName" label="Business name" autoComplete="organization" required maxLength={160} requiredMessage="Please enter your business name." />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="location" label="Location" hint="City / town and state." required maxLength={200} requiredMessage="Please enter your location." />
          <SelectField name="businessType" label="Current business type" required options={retailerBusinessTypes} requiredMessage="Please choose your business type." />
        </div>
        <TextField name="categories" label="Product categories you deal in" required maxLength={500} requiredMessage="Please tell us the categories you deal in." placeholder="e.g. Plasticware, stationery, toys" />
      </FormSection>

      <FormSection title="Contact">
        <TextField name="contactPerson" label="Contact person" autoComplete="name" required maxLength={120} requiredMessage="Please enter a contact person." />
        <div className="grid gap-5 sm:grid-cols-2">
          <PhoneField label="Phone" />
          <TextField name="email" label="Email address" type="email" autoComplete="email" maxLength={200} />
        </div>
      </FormSection>

      <FormSection title="Your proposal">
        <ChoiceGroup name="proposal" label="What kind of partnership do you have in mind?" required columns={2} options={retailerProposals} />
        <TextArea name="comments" label="Tell us more" rows={4} maxLength={2000} />
      </FormSection>

      <ConsentField>
        I agree to be contacted about this enquiry. I understand that any partnership is subject to mutual agreement,
        and I have read the <BusinessDisclaimerLink /> and <PrivacyLink />.
      </ConsentField>
    </EnquiryForm>
  );
}

const noSubscribe = () => () => {};
const topicFromUrl = () => {
  const t = new URLSearchParams(window.location.search).get("topic") ?? "";
  return contactTopics.some((o) => o.value === t) ? t : "";
};

export function ContactForm() {
  // Links such as /contact?topic=property preselect a topic; the visitor's own choice wins.
  const linkedTopic = useSyncExternalStore(noSubscribe, topicFromUrl, () => "");
  const [chosen, setChosen] = useState<string | null>(null);
  const topic = chosen ?? linkedTopic;

  return (
    <EnquiryForm
      form="contact"
      event="contact_enquiry_submit"
      submitLabel="Send message"
      confirmation={{
        title: "Thank you — your message has been received",
        nextSteps: <p>Our team will get back to you by phone, WhatsApp or email.</p>,
      }}
    >
      <TextField name="name" label="Your name" autoComplete="name" required maxLength={120} requiredMessage="Please enter your name." />
      <div className="grid gap-5 sm:grid-cols-2">
        <PhoneField />
        <TextField name="email" label="Email address" type="email" autoComplete="email" maxLength={200} />
      </div>
      <SelectField
        name="topic"
        label="What is it about?"
        required
        options={contactTopics}
        value={topic}
        onChange={(e) => setChosen(e.target.value)}
        requiredMessage="Please choose a topic."
      />
      <TextArea
        name="message"
        label="Message"
        required
        minLength={5}
        maxLength={2000}
        rows={5}
        requiredMessage="Please enter your message."
        hint={topic === "property" ? "Please include the property's location, approximate size and frontage." : undefined}
      />
      <ConsentField>
        I agree to be contacted about this enquiry and have read the <PrivacyLink />.
      </ConsentField>
    </EnquiryForm>
  );
}

export function LocationInterestForm() {
  return (
    <EnquiryForm
      form="location-interest"
      event="location_interest_submit"
      submitLabel="Register my interest"
      confirmation={{
        title: "Thank you — we've noted your interest",
        nextSteps: (
          <p>
            Requests like yours help us decide where MaxxCity Mart goes next. We can&apos;t promise a store in every town,
            but we may contact you if we plan to open nearby.
          </p>
        ),
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Your name" autoComplete="name" required maxLength={120} requiredMessage="Please enter your name." />
        <PhoneField />
        <TextField name="city" label="Town / city" autoComplete="address-level2" required maxLength={80} requiredMessage="Please enter your town or city." />
        <SelectField name="state" label="State" required options={indianStates} placeholder="Choose a state" requiredMessage="Please choose a state." />
      </div>
      <TextArea name="note" label="Anything to add?" rows={2} maxLength={1000} placeholder="e.g. a good area for a store" />
      <ConsentField>
        I agree to be contacted if MaxxCity Mart plans a store near me, and I have read the <PrivacyLink />.
      </ConsentField>
    </EnquiryForm>
  );
}
