"use client";

import { useState, useSyncExternalStore } from "react";
import { contactTopics } from "@/content/contact";
import { PrivacyLink } from "@/components/forms/enquiry-copy";
import {
  ConsentField,
  EnquiryForm,
  PhoneField,
  SelectField,
  TextArea,
  TextField,
} from "@/components/forms/form-kit";

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
