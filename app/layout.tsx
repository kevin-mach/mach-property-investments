import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow" });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-barlow-condensed" });

export const metadata: Metadata = {
  title: { default: "Mach Property Investments", template: "%s | Mach Property Investments" },
  description: "We source, refurbish and manage UK residential property for private investors, with the full numbers on every deal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body>
        <div className="site">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
