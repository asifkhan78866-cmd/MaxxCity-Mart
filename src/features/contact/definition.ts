import "server-only";
import { z } from "zod";
import { contactTopics } from "@/content/contact";
import { defineForm } from "@/lib/forms/define-form";
import { consent, mobile, oneOf, optionalEmail, required } from "@/lib/forms/fields";

export const contactForm = defineForm({
  id: "contact",
  label: "New website enquiry",
  table: "contact_enquiries",
  prefix: "GE",
  schema: z.object({
    name: required("your name"),
    phone: mobile,
    email: optionalEmail,
    topic: oneOf(contactTopics, "Please choose a topic."),
    message: required("your message", 2000, 5),
    consent,
  }),
  subject: (d, ref) => `Website enquiry ${ref} — ${contactTopics.find((t) => t.value === d.topic)?.label ?? d.topic}`,
  fields: [
    ["name", "Name"],
    ["phone", "Mobile"],
    ["email", "Email"],
    ["topic", "Topic", contactTopics],
    ["message", "Message"],
  ],
});
