"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo" aria-label="Mach Property Investments home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mach-logo.jpg" alt="Mach Investments" width={89} height={52} />
        </Link>
        <nav aria-label="Main" className="header-nav">
          {navLinks.map((n) => (
            <Link key={n.href} href={n.href} aria-current={pathname === n.href ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="header-cta">Contact us</Link>
      </div>
    </header>
  );
}
