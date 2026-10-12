"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { locations, portfolio, type Location } from "@/data/portfolio";
import PropertyCard from "./PropertyCard";

type Sort = "newest" | "price-asc" | "price-desc";
const filters = ["All", ...locations] as const;

export default function PortfolioBrowser() {
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
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

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
      <div className="card-grid">
        {list.map((p) => <PropertyCard key={p.slug} property={p} />)}
      </div>
    </>
  );
}
