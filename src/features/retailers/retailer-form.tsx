"use client";

import { retailerBusinessTypes, retailerProposals } from "@/content/partnerships";
import { BusinessDisclaimerLink, BusinessNextSteps, PrivacyLink } from "@/components/forms/enquiry-copy";
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

export function RetailerForm() {
  return (
    <EnquiryForm
      form="retailer"
      event="retailer_enquiry_submit"
      submitLabel="Submit partnership enquiry"
      confirmation={{ title: "Thank you — your partnership enquiry has been received", nextSteps: <BusinessNextSteps /> }}
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
