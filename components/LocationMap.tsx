import { geoTransverseMercator } from "d3-geo";
import Link from "next/link";
import { mapSize, mapViews } from "@/data/maps.generated";

export type MapView = keyof typeof mapViews;
export type Pin = { lat: number; lng: number; label: string };

const { width: W, height: H, extent } = mapSize;
const EARTH_KM = 6371;
const NICE_KM = [1, 2, 5, 10, 20, 50, 100, 200];

const AREAS = {
  // `hit`: radius of an invisible click target on the UK map, for areas too small to hit easily.
  manchester: { name: "Manchester", dx: -150, dy: -24, hit: 26 },
  london: { name: "London", dx: -150, dy: 56, hit: 0 },
  essex: { name: "Essex", dx: 96, dy: -60, hit: 0 },
} as const;
type Area = keyof typeof AREAS;

function projectionFor(view: MapView) {
  const { scale, translate, rotate } = mapViews[view].projection;
  return geoTransverseMercator()
    .rotate([...rotate])
    .scale(scale)
    .translate([translate[0], translate[1]]);
}

// Merge pins closer than `minDist` (viewBox px) into one, labelled with their distinct labels and a count.
function clusterPins(points: { x: number; y: number; label: string }[], minDist: number) {
  const groups: { x: number; y: number; labels: string[] }[] = [];
  for (const p of points) {
    const g = groups.find((g) => Math.hypot(g.x - p.x, g.y - p.y) < minDist);
    if (!g) groups.push({ x: p.x, y: p.y, labels: [p.label] });
    else {
      const n = g.labels.length;
      g.x = (g.x * n + p.x) / (n + 1);
      g.y = (g.y * n + p.y) / (n + 1);
      g.labels.push(p.label);
    }
  }
  return groups.map((g) => ({
    x: g.x,
    y: g.y,
    label: [...new Set(g.labels)].join(" · ") + (g.labels.length > 1 ? ` (${g.labels.length})` : ""),
  }));
}

const fmtCoord = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`;

// Placeholder graphic for a location: base map (static SVG in /public/maps) with pins and labels drawn on top.
// Each area is a link to the portfolio filtered to it, highlighted on hover/focus (see .map-area in globals.css).
// `compact` is for small panels (cards): bigger pins and labels, no scale bar or coordinates.
export default function LocationMap({ view, pins = [], title, compact = false }: { view: MapView; pins?: Pin[]; title: string; compact?: boolean }) {
  const k = compact ? 1.8 : 1;
  const projection = projectionFor(view);
  const pxPerKm = mapViews[view].projection.scale / EARTH_KM;
  const barKm = NICE_KM.reduce((best, km) => (km * pxPerKm <= 140 ? km : best), NICE_KM[0]);
  const barPx = barKm * pxPerKm;
  const centroids = mapViews[view].centroids as Record<string, readonly [number, number]>;
  const [cLng, cLat] = view === "uk" ? [-2, 54] : centroids[view];
  const areas = Object.entries(mapViews[view].areas) as [Area, string][];
  const points = pins.flatMap((p) => {
    const pt = projection([p.lng, p.lat]);
    return pt ? [{ x: pt[0], y: pt[1], label: p.label }] : [];
  });
  const markers = clusterPins(points, 28 * k);

  return (
    <div className="location-map">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="group" aria-label={title}>
        <image href={`/maps/${view}.svg`} x={extent[0]} y={extent[1]} width={extent[2]} height={extent[3]} aria-hidden="true" />

        {areas.map(([r, d]) => {
          const { name, dx, dy, hit } = AREAS[r];
          let label = null;
          if (view === "uk") {
            const [x, y] = projection([...centroids[r]] as [number, number])!;
            const lx = x + dx;
            const ly = y + dy;
            label = (
              <>
                {hit > 0 && <circle cx={x} cy={y} r={hit} fill="transparent" />}
                <polyline points={`${x},${y} ${lx + (dx < 0 ? 8 : -8)},${ly} ${lx},${ly}`} className="map-leader" />
                <text x={lx + (dx < 0 ? -6 : 6)} y={ly} dy="0.35em" textAnchor={dx < 0 ? "end" : "start"} className="map-label map-label-lg">
                  {name}
                </text>
              </>
            );
          }
          return (
            <Link
              key={r}
              href={`/portfolio?location=${name}`}
              className={`map-area${view === "uk" ? " map-area-solid" : ""}`}
              aria-label={`View ${name} properties`}
            >
              <title>{`View ${name} properties`}</title>
              <path d={d} className="map-area-shape" />
              {label}
            </Link>
          );
        })}

        <g className="map-overlay" aria-hidden="true">
          {markers.map(({ x, y, label }) => {
            return (
              <g key={label}>
                <line x1={x} y1={y} x2={x + 22 * k} y2={y - 22 * k} className="map-leader" />
                <rect x={x - 6 * k} y={y - 6 * k} width={12 * k} height={12 * k} className="map-pin" />
                <rect x={x - 2 * k} y={y - 2 * k} width={4 * k} height={4 * k} fill="#fff" />
                <text x={x + 26 * k} y={y - 22 * k} dy="0.35em" className="map-label" style={compact ? { fontSize: 40, strokeWidth: 8 } : undefined}>
                  {label}
                </text>
              </g>
            );
          })}

          {/* North arrow */}
          <g transform={`translate(${W - 44} 44)`}>
            <path d="M0,-18 L7,8 L0,3 L-7,8 Z" fill="#1d1f20" />
            <text y={28} textAnchor="middle" className="map-small">N</text>
          </g>

          {/* Scale bar + coordinates */}
          {!compact && (
            <g transform={`translate(${W - 32 - barPx} ${H - 52})`}>
              <rect width={barPx / 2} height={5} fill="#1d1f20" />
              <rect x={barPx / 2} width={barPx / 2} height={5} fill="#fff" stroke="#1d1f20" strokeWidth={1} vectorEffect="non-scaling-stroke" />
              <text x={barPx} y={-8} textAnchor="end" className="map-small">{barKm} km</text>
              <text x={barPx} y={26} textAnchor="end" className="map-small map-muted">
                {fmtCoord(cLat, "N", "S")}  {fmtCoord(cLng, "E", "W")}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
