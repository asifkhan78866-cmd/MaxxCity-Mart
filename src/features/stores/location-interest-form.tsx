"use client";

import { indianStates } from "@/content/regions";
import { PrivacyLink } from "@/components/forms/enquiry-copy";
import {
  ConsentField,
  EnquiryForm,
  PhoneField,
  SelectField,
  TextArea,
  TextField,
} from "@/components/forms/form-kit";

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
