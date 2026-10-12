import { formatGBP, pinOf, type Property } from "@/data/portfolio";
import LocationMap, { type MapView } from "./LocationMap";
import Photo, { Corners } from "./Photo";

export default function PropertyCard({ property: p, showDesc = true }: { property: Property; showDesc?: boolean }) {
  return (
    <article className="blueprint property-card">
      <Corners />
      <div className="duotone property-photo">
        <Photo
          src={p.image}
          alt={p.title}
          placeholder="Property photo"
          sizes="(max-width: 700px) 100vw, 400px"
          fallback={<LocationMap view={p.city.toLowerCase() as MapView} pins={[pinOf(p)]} title={`Map of ${p.city} showing ${p.title}`} compact />}
        />
      </div>
      <div className="property-body">
        <div className="property-meta">
          <span className="property-kicker">{p.city} · {p.type}</span>
          <span className={`tag ${p.status === "Let" ? "tag-outline" : "tag-neutral"}`}>{p.status}</span>
        </div>
        <h3 className="h3">{p.title}</h3>
        {showDesc && <p className="property-desc">{p.desc}</p>}
        <dl className="property-figures">
          <div><dt>Purchase price</dt><dd>{formatGBP(p.price)}</dd></div>
          <div><dt>Current value</dt><dd>{formatGBP(p.value)}</dd></div>
          <div><dt>Gross yield</dt><dd>{p.yield}</dd></div>
        </dl>
      </div>
    </article>
  );
}
