import Image from "next/image";
import type { ReactNode } from "react";

// Greyscale photo slot. Renders the image when one is supplied, otherwise the
// fallback graphic (e.g. a map), otherwise a labelled placeholder.
export default function Photo({ src, alt, placeholder, sizes, fallback }: { src?: string; alt: string; placeholder: string; sizes: string; fallback?: ReactNode }) {
  if (src) return <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />;
  if (fallback) return fallback;
  return (
    <div className="photo-placeholder" role="img" aria-label={`${placeholder} (to be supplied)`}>
      <span>{placeholder}</span>
    </div>
  );
}

export function Corners() {
  return (
    <>
      <i className="corner tl" aria-hidden="true" />
      <i className="corner tr" aria-hidden="true" />
      <i className="corner bl" aria-hidden="true" />
      <i className="corner br" aria-hidden="true" />
    </>
  );
}
