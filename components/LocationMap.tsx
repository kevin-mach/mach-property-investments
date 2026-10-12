import { geoTransverseMercator } from "d3-geo";
import { mapSize, mapViews } from "@/data/maps.generated";

export type MapView = keyof typeof mapViews;
export type Pin = { lat: number; lng: number; label: string };

const { width: W, height: H, extent } = mapSize;
const EARTH_KM = 6371;
const NICE_KM = [1, 2, 5, 10, 20, 50, 100, 200];

const REGION_LABELS = {
  manchester: { text: "Manchester", dx: -150, dy: -24 },
  london: { text: "London", dx: -150, dy: 56 },
  essex: { text: "Essex", dx: 96, dy: -60 },
} as const;

function projectionFor(view: MapView) {
  const { scale, translate, rotate } = mapViews[view].projection;
  return geoTransverseMercator()
    .rotate([...rotate])
    .scale(scale)
    .translate([translate[0], translate[1]]);
}

const fmtCoord = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`;

// Placeholder graphic for a location: base map (static SVG in /public/maps) with pins and labels drawn on top.
// `compact` is for small panels (cards): bigger pins and labels, no scale bar or coordinates.
export default function LocationMap({ view, pins = [], title, compact = false }: { view: MapView; pins?: Pin[]; title: string; compact?: boolean }) {
  const k = compact ? 1.8 : 1;
  const projection = projectionFor(view);
  const pxPerKm = mapViews[view].projection.scale / EARTH_KM;
  const barKm = NICE_KM.reduce((best, km) => (km * pxPerKm <= 140 ? km : best), NICE_KM[0]);
  const barPx = barKm * pxPerKm;
  const centroids = mapViews[view].centroids as Record<string, readonly [number, number]>;
  const [cLng, cLat] = view === "uk" ? [-2, 54] : centroids[view];

  return (
    <div className="location-map">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={title}>
        <image href={`/maps/${view}.svg`} x={extent[0]} y={extent[1]} width={extent[2]} height={extent[3]} />

        {view === "uk" &&
          (Object.keys(REGION_LABELS) as (keyof typeof REGION_LABELS)[]).map((r) => {
            const [x, y] = projection([...centroids[r]] as [number, number])!;
            const { text, dx, dy } = REGION_LABELS[r];
            const lx = x + dx;
            const ly = y + dy;
            return (
              <g key={r}>
                <polyline points={`${x},${y} ${lx + (dx < 0 ? 8 : -8)},${ly} ${lx},${ly}`} className="map-leader" />
                <circle cx={x} cy={y} r={3} className="map-dot" />
                <text x={lx + (dx < 0 ? -6 : 6)} y={ly} dy="0.35em" textAnchor={dx < 0 ? "end" : "start"} className="map-label map-label-lg">
                  {text}
                </text>
              </g>
            );
          })}

        {pins.map((p) => {
          const pt = projection([p.lng, p.lat]);
          if (!pt) return null;
          const [x, y] = pt;
          return (
            <g key={p.label}>
              <line x1={x} y1={y} x2={x + 22 * k} y2={y - 22 * k} className="map-leader" />
              <rect x={x - 6 * k} y={y - 6 * k} width={12 * k} height={12 * k} className="map-pin" />
              <rect x={x - 2 * k} y={y - 2 * k} width={4 * k} height={4 * k} fill="#fff" />
              <text x={x + 26 * k} y={y - 22 * k} dy="0.35em" className="map-label" style={compact ? { fontSize: 40, strokeWidth: 8 } : undefined}>
                {p.label}
              </text>
            </g>
          );
        })}

        {/* North arrow */}
        <g transform={`translate(${W - 44} 44)`} className="map-furniture">
          <path d="M0,-18 L7,8 L0,3 L-7,8 Z" fill="#1d1f20" />
          <text y={28} textAnchor="middle" className="map-small">N</text>
        </g>

        {/* Scale bar + coordinates */}
        {!compact && (
        <g transform={`translate(${W - 32 - barPx} ${H - 52})`} className="map-furniture">
          <rect width={barPx / 2} height={5} fill="#1d1f20" />
          <rect x={barPx / 2} width={barPx / 2} height={5} fill="#fff" stroke="#1d1f20" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <text x={barPx} y={-8} textAnchor="end" className="map-small">{barKm} km</text>
          <text x={barPx} y={26} textAnchor="end" className="map-small map-muted">
            {fmtCoord(cLat, "N", "S")}  {fmtCoord(cLng, "E", "W")}
          </text>
        </g>
        )}
      </svg>
    </div>
  );
}
