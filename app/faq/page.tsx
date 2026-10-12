import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import { CtaBand } from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about investing with Mach Property Investments: getting started, fees and finance, and what happens after you buy.",
};

export default function FaqPage() {
  return (
    <>
      <div className="container page faq-layout">
        <div className="faq-intro">
          <span className="eyebrow">FAQ</span>
          <h1 className="h1-page" style={{ marginBottom: 16 }}>Frequently asked questions</h1>
          <p className="lead" style={{ marginBottom: 24 }}>Can&apos;t find what you need? We&apos;re happy to talk it through.</p>
          <Link href="/contact" className="btn btn-primary" style={{ padding: "13px 22px", fontSize: 15 }}>Ask a question</Link>
        </div>
        <FaqAccordion />
      </div>
      <CtaBand />
    </>
  );
}
