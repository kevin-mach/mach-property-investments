// Edit this list to update the portfolio. Newest first.
//
// - `images`: photos under /public/properties/<slug>/; the first is used on the card. Leave out to show a map instead.
// - `lat` / `lng`: map pin position (right-click the spot in Google Maps to copy them).
// - `price`, `value`, `yield`, `status`, `beds` are optional: anything left out is simply not shown.
// - Titles use street + postcode district rather than the door number, so tenants' homes aren't identifiable.

export type Location = "Essex" | "London" | "Manchester";

export type Property = {
  slug: string;
  city: Location;
  area: string;
  type: string;
  beds?: number;
  title: string;
  desc: string;
  lat: number;
  lng: number;
  status?: "Let" | "In refurbishment";
  price?: number;
  value?: number;
  yield?: string;
  images?: { src: string; alt: string }[];
};

export const locations: Location[] = ["Essex", "London", "Manchester"];

const photos = (slug: string, list: [file: string, alt: string][]) =>
  list.map(([file, alt]) => ({ src: `/properties/${slug}/${file}`, alt }));

export const portfolio: Property[] = [
  {
    slug: "san-marcos-drive",
    city: "Essex",
    area: "Chafford Hundred, Grays",
    type: "Flat",
    beds: 2,
    title: "San Marcos Drive, RM16",
    desc: "2-bed flat in a three-storey block in Chafford Hundred, with a lounge/diner, kitchen and family bathroom.",
    lat: 51.4829,
    lng: 0.2952,
    images: photos("san-marcos-drive", [
      ["exterior.jpg", "Three-storey brick block with a lawned garden"],
      ["lounge.jpg", "Lounge/diner"],
      ["kitchen.jpg", "Kitchen"],
      ["bedroom-1.jpg", "Double bedroom"],
      ["bedroom-2.jpg", "Second bedroom"],
      ["bathroom.jpg", "Bathroom"],
    ]),
  },
  {
    slug: "city-point-salford",
    city: "Manchester",
    area: "Chapel Street, Salford",
    type: "Flat",
    title: "City Point, M3",
    desc: "Apartment in the City Point development on Chapel Street, Salford, a short walk from Salford Central station.",
    lat: 53.4836,
    lng: -2.2568,
  },
  {
    slug: "gower-place",
    city: "Essex",
    area: "Chafford Hundred, Grays",
    type: "Flat",
    title: "Gower Place, RM16",
    desc: "Flat in a purpose-built block off Fleming Road, Chafford Hundred.",
    lat: 51.4877,
    lng: 0.2884,
  },
  {
    slug: "the-chase-grays",
    city: "Essex",
    area: "Grays",
    type: "Flat",
    beds: 2,
    title: "The Chase, RM20",
    desc: "2-bed flat in a modern block in Grays, with an en-suite shower room and a family bathroom.",
    lat: 51.4766,
    lng: 0.299,
    images: photos("the-chase-grays", [
      ["exterior.jpg", "Six-storey brick apartment block with parking"],
      ["living-room.jpg", "Living room with doors to the balcony"],
      ["view.jpg", "View from the balcony"],
      ["kitchen.jpg", "Kitchen"],
      ["kitchen-2.jpg", "Kitchen"],
      ["bedroom-1.jpg", "Bedroom with balcony door"],
      ["bedroom-2.jpg", "Second bedroom"],
      ["bathroom.jpg", "Bathroom"],
      ["en-suite.jpg", "En-suite shower room"],
      ["en-suite-2.jpg", "En-suite shower room"],
    ]),
  },
];

export const formatGBP = (n: number) => "£" + n.toLocaleString("en-GB");

// "San Marcos Drive, RM16" → "RM16"
export const postcodeOf = (p: Property) => p.title.split(",").pop()!.trim();

export const pinOf = (p: Property) => ({ lat: p.lat, lng: p.lng, label: postcodeOf(p) });

export const figuresOf = (p: Property) =>
  [
    p.price != null && { label: "Purchase price", value: formatGBP(p.price) },
    p.value != null && { label: "Current value", value: formatGBP(p.value) },
    p.yield && { label: "Gross yield", value: p.yield },
  ].filter((f): f is { label: string; value: string } => !!f);
