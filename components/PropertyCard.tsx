import Link from "next/link";
import { figuresOf, pinOf, type Property } from "@/data/portfolio";
import LocationMap, { type MapView } from "./LocationMap";
import Photo, { Corners } from "./Photo";

export default function PropertyCard({ property: p, showDesc = true }: { property: Property; showDesc?: boolean }) {
  const figures = figuresOf(p);
  const cover = p.images?.[0];
  return (
    <article className="blueprint property-card">
      <Corners />
      <div className="duotone property-photo">
        <Photo
          src={cover?.src}
          alt={cover?.alt ?? p.title}
          placeholder="Property photo"
          sizes="(max-width: 700px) 100vw, 400px"
          fallback={<LocationMap view={p.city.toLowerCase() as MapView} pins={[pinOf(p)]} title={`Map of ${p.city} showing ${p.title}`} compact />}
        />
      </div>
      <div className="property-body">
        <div className="property-meta">
          <span className="property-kicker">
            {p.city} · {p.beds ? `${p.beds}-bed ` : ""}{p.type}
          </span>
          {p.status && <span className={`tag ${p.status === "Let" ? "tag-outline" : "tag-neutral"}`}>{p.status}</span>}
        </div>
        <h3 className="h3">
          {/* Stretched link: the whole card opens the property page. */}
          <Link href={`/portfolio/${p.slug}`} className="card-link">{p.title}</Link>
        </h3>
        {showDesc && <p className="property-desc">{p.desc}</p>}
        {figures.length > 0 ? (
          <dl className="property-figures">
            {figures.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
          </dl>
        ) : (
          <p className="property-pending">Figures to follow</p>
        )}
      </div>
    </article>
  );
}
