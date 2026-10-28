"use client";

import { franchise } from "@/content/franchise";
import { indianStates } from "@/content/regions";
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
import { LegalLink } from "@/components/forms/enquiry-copy";

export function FranchiseForm() {
  return (
    <EnquiryForm
      form="franchise"
      event="franchise_application_submit"
      submitLabel="Submit franchise enquiry"
      confirmation={{
        title: "Thank you — your franchise enquiry has been received",
        nextSteps: (
          <>
            <p className="font-semibold text-ink">What happens next</p>
            <ol>
              <li>Our team reviews your enquiry and location details.</li>
              <li>If it&apos;s a potential fit, we contact you for an initial discussion.</li>
              <li>Commercial requirements, premises and terms are reviewed together.</li>
            </ol>
            <p className="mt-4 text-sm">
              Submitting an enquiry does not mean an application has been approved. Any franchise is subject to
              review, due diligence and a signed franchise agreement.
            </p>
          </>
        ),
        links: [
          { href: "/franchise", label: "Back to franchise information" },
          { href: "/faq", label: "Read the FAQ" },
        ],
      }}
    >
      <FormSection title="About you">
        <TextField name="fullName" label="Full name" autoComplete="name" required maxLength={120} requiredMessage="Please enter your full name." />
        <div className="grid gap-5 sm:grid-cols-2">
          <PhoneField />
          <TextField name="email" label="Email address" type="email" autoComplete="email" maxLength={200} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="city" label="City / town" autoComplete="address-level2" required maxLength={80} requiredMessage="Please enter your city." />
          <SelectField name="state" label="State" required options={indianStates} placeholder="Choose a state" requiredMessage="Please choose a state." />
        </div>
      </FormSection>

      <FormSection title="Your proposed outlet">
        <TextField
          name="preferredLocation"
          label="Preferred outlet location"
          hint="Area, road or market where you would like to open."
          required
          maxLength={200}
          requiredMessage="Please tell us where you would like to open."
        />
        <ChoiceGroup name="propertyStatus" label="Do you have a suitable commercial property?" required options={franchise.propertyOptions} />
        <TextArea
          name="experience"
          label="Relevant retail or business experience"
          hint="E.g. a shop you run, years in business, or the industry you work in."
          rows={3}
          maxLength={1500}
        />
      </FormSection>

      <FormSection title="Investment readiness">
        <ChoiceGroup
          name="investmentReadiness"
          label="Which best describes your situation?"
          hint="We'll explain the actual investment requirements during the discussion."
          required
          options={franchise.investmentReadiness}
        />
        <TextArea name="additionalInfo" label="Anything else you'd like us to know?" rows={3} maxLength={2000} />
      </FormSection>

      <ConsentField>
        I agree to be contacted by MaxxCity Mart about this franchise enquiry by phone, WhatsApp or email. I
        understand this is an enquiry, not an approved application, and I have read the{" "}
        <LegalLink href="/legal/franchise-disclaimer">franchise enquiry disclaimer</LegalLink>{" "}
        and{" "}
        <LegalLink href="/legal/privacy">privacy policy</LegalLink>
        .
      </ConsentField>
    </EnquiryForm>
  );
}
