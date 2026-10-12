import type { Metadata } from "next";
import { Suspense } from "react";
import PortfolioBrowser from "@/components/PortfolioBrowser";
import PropertyCard from "@/components/PropertyCard";
import { portfolio } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Every property Mach Property Investments has acquired across Essex, London and Manchester, with purchase price, current value and gross yield.",
};

export default function PortfolioPage() {
  return (
    <div className="container page">
      <span className="eyebrow">Portfolio</span>
      <h1 className="h1-page" style={{ marginBottom: 16 }}>Our portfolio</h1>
      <p className="lead" style={{ marginBottom: 36, maxWidth: "60ch" }}>
        Every property Mach Investments has acquired, with the key numbers for each.
      </p>
      <Suspense>
        <PortfolioBrowser cards={Object.fromEntries(portfolio.map((p) => [p.slug, <PropertyCard key={p.slug} property={p} />]))} />
      </Suspense>
      <p className="muted" style={{ fontSize: 13, marginTop: 32 }}>
        Current values are internal estimates as of October 2026. Yields are gross, based on current rent.
      </p>
    </div>
  );
}
