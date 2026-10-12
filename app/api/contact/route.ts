import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled in: pretend success so bots don't retry.
  if (str(body.company, 200)) return NextResponse.json({ ok: true });

  const name = str(body.name, 200);
  const email = str(body.email, 200);
  const phone = str(body.phone, 50);
  const budget = str(body.budget, 100);
  const interest = str(body.interest, 100);
  const message = str(body.message, 5000);

  if (!name) return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Mach Website <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set.");
    return NextResponse.json(
      { error: "Sorry, our form isn't working right now. Please call or email us instead." },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Budget", budget || "—"],
    ["Interested in", interest || "—"],
    ["Message", message || "—"],
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: email,
      subject: `New website enquiry from ${name}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<table cellpadding="6">${rows
        .map(([k, v]) => `<tr><td valign="top"><strong>${k}</strong></td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
        .join("")}</table>`,
    }),
  });

  if (!res.ok) {
    console.error("Contact form: Resend error", res.status, await res.text());
    return NextResponse.json({ error: "Sorry, we couldn't send your enquiry. Please try again or call us." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
