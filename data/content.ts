import type { Location } from "./portfolio";

export type Slide = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  location?: Location;
  image?: string;
  placeholder: string;
};

export const slides: Slide[] = [
  { eyebrow: "Mach Property Investments", title: "Property investment, made clear.", body: "We source, refurbish and manage UK residential property for private investors, with the full numbers on every deal.", cta: "View portfolio", placeholder: "Property photograph" },
  { eyebrow: "Portfolio · Essex", title: "Homes across Essex", body: "From Westcliff-on-Sea to Chelmsford, see purchase price, current value and yield for every Essex property.", cta: "View Essex properties", location: "Essex", placeholder: "Essex property photograph" },
  { eyebrow: "Portfolio · London", title: "Investing in London", body: "Apartments and period houses in east and south London, with the numbers behind each one.", cta: "View London properties", location: "London", placeholder: "London property photograph" },
  { eyebrow: "Portfolio · Manchester", title: "Growing in Manchester", body: "HMOs and city-centre apartments in one of the UK's strongest rental markets.", cta: "View Manchester properties", location: "Manchester", placeholder: "Manchester property photograph" },
];

export const completed = [
  { title: "Wilmslow Road, M20", strategy: "HMO", price: "£212,000", yield: "9.4%", year: "2026" },
  { title: "Bow Road, E3", strategy: "Buy-to-let", price: "£148,000", yield: "6.8%", year: "2026" },
  { title: "London Road, SS1", strategy: "Buy-to-let", price: "£126,500", yield: "7.5%", year: "2025" },
  { title: "Chorlton Mill, M15", strategy: "Development", price: "£640,000", yield: "—", year: "2025" },
  { title: "Springfield Road, CM2", strategy: "HMO", price: "£268,000", yield: "8.9%", year: "2025" },
];

export const team: { name: string; role: string; image?: string }[] = [
  { name: "Founder name", role: "Founder & Managing Director" },
  { name: "Team member", role: "Head of Acquisitions" },
  { name: "Team member", role: "Property Manager" },
];

export const faqGroups = [
  { title: "Getting started", items: [
    { q: "How much do I need to start investing?", a: "Most of our buy-to-let opportunities suit investors with a deposit of around £40,000 to £60,000 plus purchase costs. On a call we can work through what fits your budget." },
    { q: "Do I need property experience?", a: "No. Many of our investors are buying their first investment property. We explain every step and every figure before you commit." },
    { q: "Do I need to live near the property?", a: "No. Many of our investors live elsewhere in the UK or abroad. We handle viewings, refurbishment, tenants and maintenance." },
  ]},
  { title: "Fees and finance", items: [
    { q: "What do your fees cover?", a: "Our sourcing fee covers finding, appraising and negotiating the property, and is only payable on completion. Every fee is listed in the deal pack before you commit." },
    { q: "Can you help with mortgages and legal work?", a: "We work with independent mortgage brokers and conveyancing solicitors who specialise in investment property, and can introduce you. You are free to use your own." },
  ]},
  { title: "After you buy", items: [
    { q: "What happens after completion?", a: "If you choose our management service, we find and vet tenants, collect rent, arrange repairs and keep the property compliant." },
    { q: "How will I know how my property is doing?", a: "You receive a monthly statement showing rent received, costs and any work carried out, plus a named contact you can call at any time." },
  ]},
];

export const budgets = ["Under £100,000", "£100,000 – £250,000", "£250,000 – £500,000", "£500,000+"];
export const interests = ["Not sure yet", "Buy-to-let", "HMO", "Development", "Property management"];
