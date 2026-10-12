"use client";

import { useState, type FormEvent } from "react";
import { budgets, interests } from "@/data/content";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="contact-success" role="status">
        <h2 style={{ fontSize: 32, textTransform: "uppercase" }}>Thank you</h2>
        <p className="lead" style={{ lineHeight: 1.6 }}>We&apos;ve received your enquiry and will be in touch within one working day.</p>
        <button type="button" className="btn btn-secondary" style={{ alignSelf: "flex-start", padding: "10px 18px", fontSize: 15 }} onClick={() => setStatus("idle")}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field"><label htmlFor="c-name">Full name</label><input id="c-name" name="name" className="input" required autoComplete="name" maxLength={200} /></div>
      <div className="field"><label htmlFor="c-phone">Phone</label><input id="c-phone" name="phone" className="input" type="tel" autoComplete="tel" maxLength={50} /></div>
      <div className="field full"><label htmlFor="c-email">Email</label><input id="c-email" name="email" className="input" type="email" required autoComplete="email" maxLength={200} /></div>
      <div className="field"><label htmlFor="c-budget">Budget</label>
        <select id="c-budget" name="budget" className="input">{budgets.map((b) => <option key={b}>{b}</option>)}</select></div>
      <div className="field"><label htmlFor="c-interest">Interested in</label>
        <select id="c-interest" name="interest" className="input">{interests.map((o) => <option key={o}>{o}</option>)}</select></div>
      <div className="field full"><label htmlFor="c-msg">Message (optional)</label><textarea id="c-msg" name="message" className="input" rows={4} maxLength={5000} /></div>
      {/* Honeypot: hidden from people, often filled by bots. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
      {status === "error" && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary full" style={{ padding: 14, fontSize: 17 }} disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
      <p className="form-note">We reply within one working day. Your details are never shared.</p>
    </form>
  );
}
