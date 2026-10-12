import Link from "next/link";
import { navLinks, site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cols">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mach-logo.jpg" alt="Mach Investments" width={123} height={72} />
        <nav aria-label="Footer" className="footer-col">
          <span className="footer-col-title">Pages</span>
          {navLinks.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </nav>
        <div className="footer-col">
          <span className="footer-col-title">Contact</span>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span>{site.location}</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Mach Property Investments Ltd. Registered in England and Wales.</span>
        <span>Property values can fall as well as rise. Seek independent advice before investing.</span>
        <span style={{ flexBasis: "100%", fontSize: 12 }}>
          Maps contain Ordnance Survey data © Crown copyright and database right 2014. Boundaries:{" "}
          <a href="https://github.com/martinjc/UK-GeoJSON" style={{ color: "inherit" }}>UK-GeoJSON</a> (CC BY 4.0).
        </span>
      </div>
    </footer>
  );
}

export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="cta-band-inner">
        <h2>See every property we&apos;ve invested in</h2>
        <div className="btn-row">
          <Link href="/portfolio" className="btn btn-primary">View portfolio</Link>
          <Link href="/contact" className="btn btn-secondary">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
