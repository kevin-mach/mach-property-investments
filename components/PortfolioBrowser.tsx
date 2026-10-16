"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { locations, portfolio, type Location } from "@/data/portfolio";

type Sort = "newest" | "price-asc" | "price-desc";
const filters = ["All", ...locations] as const;

// Cards are rendered on the server (they include the maps) and passed in by slug.
export default function PortfolioBrowser({ cards }: { cards: Record<string, ReactNode> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [sort, setSort] = useState<Sort>("newest");

  const param = params.get("location");
  const filter = locations.find((l) => l.toLowerCase() === param?.toLowerCase()) ?? "All";

  const setFilter = (f: "All" | Location) => {
    const next = new URLSearchParams(params.toString());
    if (f === "All") next.delete("location");
    else next.set("location", f);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  let list = portfolio.filter((p) => filter === "All" || p.city === filter);
  // Properties without a price yet go last either way.
  const byPrice = (dir: 1 | -1) => (a: (typeof list)[number], b: (typeof list)[number]) =>
    a.price == null ? 1 : b.price == null ? -1 : dir * (a.price - b.price);
  if (sort === "price-asc") list = [...list].sort(byPrice(1));
  if (sort === "price-desc") list = [...list].sort(byPrice(-1));

  return (
    <>
      <div className="toolbar">
        <div className="seg" role="radiogroup" aria-label="Filter by location">
          {filters.map((f) => (
            <label key={f} className="seg-opt">
              <input type="radio" name="location" checked={filter === f} onChange={() => setFilter(f)} />
              {f}
            </label>
          ))}
        </div>
        <div className="sort">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" className="input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>
      <p className="muted" style={{ margin: "0 0 20px", fontSize: 14 }} aria-live="polite">
        {list.length === 1 ? "1 property" : `${list.length} properties`}
      </p>
      {list.length > 0 ? (
        <div className="card-grid">
          {list.map((p) => <div key={p.slug} style={{ display: "contents" }}>{cards[p.slug]}</div>)}
        </div>
      ) : (
        <div className="blueprint portfolio-empty">
          <p className="lead">No properties in {filter} yet.</p>
          <p className="muted">Want to hear when we buy here? <Link href="/contact">Get in touch</Link>.</p>
        </div>
      )}
    </>
  );
}
