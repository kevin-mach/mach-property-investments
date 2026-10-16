"use client";

import Image from "next/image";
import { useState } from "react";

// Large photo with a row of thumbnails underneath; arrow keys step through when focused.
export default function Gallery({ images }: { images: { src: string; alt: string }[] }) {
  const [cur, setCur] = useState(0);
  const n = images.length;
  const go = (i: number) => setCur(((i % n) + n) % n);

  return (
    <div className="gallery">
      <div
        className="blueprint duotone gallery-main"
        tabIndex={0}
        aria-roledescription="gallery"
        aria-label={`Photo ${cur + 1} of ${n}: ${images[cur].alt}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(cur - 1);
          if (e.key === "ArrowRight") go(cur + 1);
        }}
      >
        <i className="corner tl" aria-hidden="true" /><i className="corner tr" aria-hidden="true" />
        <i className="corner bl" aria-hidden="true" /><i className="corner br" aria-hidden="true" />
        <Image src={images[cur].src} alt={images[cur].alt} fill sizes="(max-width: 900px) 100vw, 760px" style={{ objectFit: "cover" }} priority />
        {n > 1 && (
          <div className="gallery-controls">
            <button type="button" className="carousel-arrow" onClick={() => go(cur - 1)} aria-label="Previous photo">←</button>
            <span className="gallery-count">{String(cur + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
            <button type="button" className="carousel-arrow" onClick={() => go(cur + 1)} aria-label="Next photo">→</button>
          </div>
        )}
      </div>
      {n > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className="duotone gallery-thumb"
              aria-label={`Show photo ${i + 1}: ${img.alt}`}
              aria-current={i === cur ? "true" : undefined}
              onClick={() => setCur(i)}
            >
              <Image src={img.src} alt="" fill sizes="120px" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
