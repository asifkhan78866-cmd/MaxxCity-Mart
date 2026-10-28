"use client";

import { supplierCategories } from "@/content/categories";
import { BusinessDisclaimerLink, BusinessNextSteps, PrivacyLink } from "@/components/forms/enquiry-copy";
import { UploadField } from "@/components/forms/upload-field";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { ChoiceGroup, ConsentField, FormSection, PhoneField, TextArea, TextField } from "@/components/forms/fields";

export function ManufacturerForm() {
  return (
    <EnquiryForm
      form="manufacturer"
      event="manufacturer_enquiry_submit"
      submitLabel="Submit manufacturer enquiry"
      confirmation={{ title: "Thank you — your manufacturer enquiry has been received", nextSteps: <BusinessNextSteps /> }}
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
