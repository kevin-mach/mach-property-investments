// Edit this list to update the portfolio. Newest first.
// `image` is a path under /public (e.g. "/properties/victoria-road.jpg"); leave empty to show a map instead.
// `lat` / `lng` place the property's pin on the map (approximate is fine — right-click the spot in Google Maps to copy them).

export type Location = "Essex" | "London" | "Manchester";

export type Property = {
  slug: string;
  city: Location;
  type: string;
  title: string;
  desc: string;
  price: number;
  value: number;
  yield: string;
  status: "Let" | "In refurbishment";
  lat: number;
  lng: number;
  image?: string;
};

export const locations: Location[] = ["Essex", "London", "Manchester"];

export const portfolio: Property[] = [
  { slug: "victoria-road-m14", city: "Manchester", type: "HMO", title: "Victoria Road, M14", desc: "5-bed licensed HMO, fully refurbished.", price: 245000, value: 285000, yield: "9.1%", status: "Let", lat: 53.4466, lng: -2.2213 },
  { slug: "mare-street-e8", city: "London", type: "Flat", title: "Mare Street, E8", desc: "2-bed apartment close to London Fields.", price: 415000, value: 440000, yield: "5.6%", status: "Let", lat: 51.543, lng: -0.0553 },
  { slug: "hamlet-court-road-ss0", city: "Essex", type: "House", title: "Hamlet Court Road, SS0", desc: "3-bed terrace in Westcliff-on-Sea.", price: 298000, value: 320000, yield: "6.2%", status: "In refurbishment", lat: 51.5385, lng: 0.693 },
  { slug: "ancoats-works-m4", city: "Manchester", type: "Flat", title: "Ancoats Works, M4", desc: "1-bed city-centre apartment.", price: 172000, value: 188000, yield: "6.9%", status: "Let", lat: 53.4846, lng: -2.225 },
  { slug: "moulsham-street-cm2", city: "Essex", type: "HMO", title: "Moulsham Street, CM2", desc: "6-bed HMO in Chelmsford, en-suite rooms.", price: 365000, value: 410000, yield: "8.4%", status: "Let", lat: 51.729, lng: 0.474 },
  { slug: "lordship-lane-se22", city: "London", type: "House", title: "Lordship Lane, SE22", desc: "3-bed Victorian terrace in East Dulwich.", price: 640000, value: 675000, yield: "4.8%", status: "Let", lat: 51.456, lng: -0.072 },
];

export const formatGBP = (n: number) => "£" + n.toLocaleString("en-GB");

// "Victoria Road, M14" → "M14"
export const postcodeOf = (p: Property) => p.title.split(",").pop()!.trim();

export const pinOf = (p: Property) => ({ lat: p.lat, lng: p.lng, label: postcodeOf(p) });
