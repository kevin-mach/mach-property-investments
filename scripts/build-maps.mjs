// Generates the location maps:
//   public/maps/<view>.svg   — static base maps (land, borders, highlighted region)
//   data/maps.generated.ts   — projection settings so pins can be placed on top
// Run with `npm run maps`. Boundary data is downloaded once into .cache/.
//
// Source: UK-GeoJSON by Martin Chorley (CC BY 4.0), https://github.com/martinjc/UK-GeoJSON
// Contains Ordnance Survey data © Crown copyright and database right 2014.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { geoBounds, geoClipRectangle, geoPath, geoTransform, geoTransverseMercator } from "d3-geo";
import { feature, merge, mesh } from "topojson-client";
import { presimplify, simplify, sphericalTriangleArea } from "topojson-simplify";

const SOURCES = {
  gb: "https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/gb/topo_lad.json",
  ni: "https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/ni/topo_lgd.json",
};

const W = 800;
const H = 600;
// Base maps extend past the 800×600 frame so they fill taller or narrower panels.
const BLEED = [60, 180];
const EXTENT = [-BLEED[0], -BLEED[1], W + 2 * BLEED[0], H + 2 * BLEED[1]];
const ROTATE = [2, 0, 0]; // central meridian 2°W, as the British National Grid

const COLORS = {
  land: "#e4e4e7",
  coast: "#b7b7ba",
  border: "#cacacd",
  region: "#d2d2d5",
  regionInternal: "#98989b",
  regionEdge: "#1d1f20",
};

const ESSEX = ["Basildon", "Braintree", "Brentwood", "Castle Point", "Chelmsford", "Colchester", "Epping Forest",
  "Harlow", "Maldon", "Rochford", "Tendring", "Uttlesford", "Southend-on-Sea", "Thurrock"];
const MANCHESTER = ["Bolton", "Bury", "Manchester", "Oldham", "Rochdale", "Salford", "Stockport", "Tameside",
  "Trafford", "Wigan"];
const REGIONS = {
  london: (p) => p.LAD13CD.startsWith("E09"),
  essex: (p) => ESSEX.includes(p.LAD13NM),
  manchester: (p) => MANCHESTER.includes(p.LAD13NM),
};

async function load(name) {
  mkdirSync(".cache", { recursive: true });
  const file = `.cache/${name}.json`;
  if (!existsSync(file)) {
    console.log(`Downloading ${name} boundaries…`);
    const res = await fetch(SOURCES[name]);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    writeFileSync(file, await res.text());
  }
  return JSON.parse(readFileSync(file, "utf8"));
}

const gbRaw = await load("gb");
const niRaw = await load("ni");
const gbPre = presimplify(gbRaw, sphericalTriangleArea);
const niPre = presimplify(niRaw, sphericalTriangleArea);
const gbKey = Object.keys(gbRaw.objects)[0];
const niKey = Object.keys(niRaw.objects)[0];

const regionGeoms = (topo, region) => topo.objects[gbKey].geometries.filter((g) => REGIONS[region](g.properties));

// Drops detail smaller than `px` square pixels at the given projection scale.
const simplifyFor = (pre, scale, px) => simplify(pre, px / (scale * scale));

const stroke = (color, width, extra = "") =>
  `fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" vector-effect="non-scaling-stroke"${extra}`;

// The source rings don't follow d3's spherical winding convention, so geometry is
// projected point-by-point and handled as flat shapes (filled with evenodd).
function planarPath(projection, minArea) {
  const project = geoTransform({
    point(x, y) {
      const [px, py] = projection([x, y]);
      this.stream.point(px, py);
    },
  });
  const clip = geoClipRectangle(EXTENT[0] - 5, EXTENT[1] - 5, EXTENT[0] + EXTENT[2] + 5, EXTENT[1] + EXTENT[3] + 5);
  const path = geoPath({ stream: (s) => project.stream(clip(s)) }).digits(1);
  const area = geoPath(project).area;
  // Drop islands and slivers too small to see.
  const prune = (g) => {
    if (g.type === "MultiPolygon") return { ...g, coordinates: g.coordinates.filter((p) => area({ type: "Polygon", coordinates: [p[0]] }) >= minArea) };
    return g;
  };
  return (g) => path(prune(g)) ?? "";
}

const coordsOf = (topo, geoms) =>
  ({ type: "MultiPoint", coordinates: feature(topo, { type: "GeometryCollection", geometries: geoms }).features
    .flatMap((f) => f.geometry.coordinates.flat(f.geometry.type === "MultiPolygon" ? 2 : 1)) });

function build(name, { fit, padding, regions, solid, detail = 3 }) {
  const projection = geoTransverseMercator().rotate(ROTATE)
    .fitExtent([[padding[0], padding[1]], [W - padding[0], H - padding[1]]], fit);
  const scale = projection.scale();
  const gb = simplifyFor(gbPre, scale, detail);
  const ni = simplifyFor(niPre, scale, detail);
  const path = planarPath(projection, detail);
  const all = gb.objects[gbKey];

  // Districts are filled individually (merging them produces broken rings in this data);
  // the coastline is every arc used by only one district.
  const fill = (topo, geoms) => feature(topo, { type: "GeometryCollection", geometries: geoms }).features.map((f) => path(f.geometry)).join("");
  const niAll = ni.objects[niKey];
  const land = fill(gb, all.geometries) + fill(ni, niAll.geometries);
  const coast = path(mesh(gb, all, (a, b) => a === b)) + path(mesh(ni, niAll, (a, b) => a === b));
  const layers = [`<path d="${land}" fill="${COLORS.land}"/>`];
  if (!solid) layers.push(`<path d="${path(mesh(gb, all, (a, b) => a !== b))}" ${stroke(COLORS.border, 0.75)}/>`);
  layers.push(`<path d="${coast}" ${stroke(COLORS.coast, 0.75)}/>`);

  // Clickable area shapes, drawn inline by LocationMap so they can react to hover.
  // Coarser than the base map: the overlay is translucent, so small differences don't show.
  const areaGb = solid ? gb : simplifyFor(gbPre, scale, 12);
  const areaPath = solid ? path : planarPath(projection, 12);
  const areas = {};
  const centroids = {};
  for (const r of regions) {
    areas[r] = feature(areaGb, { type: "GeometryCollection", geometries: regionGeoms(areaGb, r) }).features.map((f) => areaPath(f.geometry)).join("");
    const geoms = regionGeoms(gb, r);
    const set = new Set(geoms);
    const shape = fill(gb, geoms);
    if (!solid) {
      const edge = mesh(gb, all, (a, b) => (a === b ? set.has(a) : set.has(a) !== set.has(b)));
      layers.push(`<path d="${shape}" fill="${COLORS.region}"/>`);
      layers.push(`<path d="${path(mesh(gb, all, (a, b) => a !== b && set.has(a) && set.has(b)))}" ${stroke(COLORS.regionInternal, 0.75, ' stroke-dasharray="3 3"')}/>`);
      layers.push(`<path d="${path(edge)}" ${stroke(COLORS.regionEdge, 1.5)}/>`);
    }
    // Centre of the bounding box (used to position labels).
    const [[x0, y0], [x1, y1]] = geoBounds(coordsOf(gbRaw, regionGeoms(gbRaw, r)));
    centroids[r] = [+((x0 + x1) / 2).toFixed(4), +((y0 + y1) / 2).toFixed(4)];
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${EXTENT.join(" ")}">${layers.join("")}</svg>\n`;
  writeFileSync(`public/maps/${name}.svg`, svg);
  console.log(`${name}.svg: ${Math.round(svg.length / 1024)} KB`);
  return {
    projection: { scale: +scale.toFixed(3), translate: projection.translate().map((v) => +v.toFixed(3)), rotate: ROTATE },
    centroids,
    areas,
  };
}

const regionShape = (r) => coordsOf(gbRaw, regionGeoms(gbRaw, r));

mkdirSync("public/maps", { recursive: true });
const views = {
  // Mainland GB + NI, leaving out Shetland so the main island fills the frame.
  uk: build("uk", {
    fit: { type: "MultiPoint", coordinates: [[-8.2, 49.9], [1.8, 49.9], [-8.2, 59.0], [1.8, 59.0]] },
    padding: [40, 24], regions: ["london", "essex", "manchester"], solid: true, detail: 30,
  }),
  london: build("london", { fit: regionShape("london"), padding: [150, 110], regions: ["london"] }),
  essex: build("essex", { fit: regionShape("essex"), padding: [150, 100], regions: ["essex"] }),
  manchester: build("manchester", { fit: regionShape("manchester"), padding: [150, 110], regions: ["manchester"] }),
};

writeFileSync(
  "data/maps.generated.ts",
  `// Generated by scripts/build-maps.mjs — do not edit by hand.
export const mapSize = { width: ${W}, height: ${H}, extent: ${JSON.stringify(EXTENT)} } as const;
export const mapViews = ${JSON.stringify(views, null, 2)} as const;
`,
);
console.log("Wrote data/maps.generated.ts");
