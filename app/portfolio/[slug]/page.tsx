import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import LocationMap, { type MapView } from "@/components/LocationMap";
import { Corners } from "@/components/Photo";
import { CtaBand } from "@/components/Footer";
import { figuresOf, pinOf, portfolio } from "@/data/portfolio";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return portfolio.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = portfolio.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.desc } : {};
}

export default async function PropertyPage({ params }: Params) {
  const { slug } = await params;
  const p = portfolio.find((x) => x.slug === slug);
  if (!p) notFound();
  const figures = figuresOf(p);
  const facts = [
    { label: "Location", value: p.area },
    { label: "Type", value: p.type },
    p.beds && { label: "Bedrooms", value: String(p.beds) },
    p.status && { label: "Status", value: p.status },
  ].filter((f): f is { label: string; value: string } => !!f);
  const map = <LocationMap view={p.city.toLowerCase() as MapView} pins={[pinOf(p)]} title={`Map of ${p.city} showing ${p.title}`} />;

  return (
    <>
      <div className="container page">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/portfolio">Portfolio</Link> <span aria-hidden="true">/</span>{" "}
          <Link href={`/portfolio?location=${p.city}`}>{p.city}</Link>
        </nav>
        <span className="eyebrow">{p.city} · {p.beds ? `${p.beds}-bed ` : ""}{p.type}</span>
        <h1 className="h1-page" style={{ marginBottom: 16 }}>{p.title}</h1>
        <p className="lead" style={{ maxWidth: "60ch", marginBottom: 36 }}>{p.desc}</p>

        <div className="property-layout">
          {p.images?.length ? (
            <Gallery images={p.images} />
          ) : (
            <div className="blueprint duotone gallery-main"><Corners />{map}</div>
          )}

          <aside className="property-aside">
            <dl className="property-facts">
              {facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
            </dl>
            {figures.length > 0 ? (
              <dl className="property-figures" style={{ marginTop: 24 }}>
                {figures.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
              </dl>
            ) : (
              <p className="property-pending" style={{ marginTop: 24 }}>Figures to follow</p>
            )}
            {p.images?.length ? (
              <div className="blueprint duotone property-aside-map"><Corners />{map}</div>
            ) : null}
            <Link href="/contact" className="btn btn-primary" style={{ marginTop: 24, width: "100%" }}>Ask about this property</Link>
          </aside>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
