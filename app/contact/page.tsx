import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { Corners } from "@/components/Photo";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the Mach Property Investments team. Tell us what you'd like to achieve and we'll explain the options that fit.",
};

export default function ContactPage() {
  return (
    <div className="container page contact-layout">
      <div>
        <span className="eyebrow">Contact</span>
        <h1 className="h1-page" style={{ marginBottom: 20 }}>Talk to our team</h1>
        <p className="lead" style={{ marginBottom: 36, maxWidth: "46ch" }}>
          Tell us what you&apos;d like to achieve and we&apos;ll explain the options that fit. No obligation.
        </p>
        <dl className="contact-details">
          <div><dt>Phone</dt><dd><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></dd></div>
          <div><dt>Email</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
          <div><dt>Hours</dt><dd>{site.hours}</dd></div>
        </dl>
      </div>
      <div className="blueprint contact-card">
        <Corners />
        <ContactForm />
      </div>
    </div>
  );
}
