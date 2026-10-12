"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { slides } from "@/data/content";

const INTERVAL = 6000;
const pad = (n: number) => String(n).padStart(2, "0");

// `media` holds each slide's photo/map panel, rendered on the server.
export default function HeroCarousel({ media }: { media: ReactNode[] }) {
  const [cur, setCur] = useState(0);
  const paused = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const n = slides.length;

  const startTimer = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (!paused.current) setCur((c) => (c + 1) % n);
    }, INTERVAL);
  }, [n]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timer.current);
  }, [startTimer]);

  const go = (i: number) => {
    setCur(((i % n) + n) % n);
    startTimer();
  };

  return (
    <div
      className="carousel"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      {slides.map((s, i) => {
        const active = i === cur;
        const href = s.location ? `/portfolio?location=${s.location}` : "/portfolio";
        const Title = i === 0 ? "h1" : "h2";
        return (
          <div
            key={s.title}
            className="slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
            aria-hidden={active ? undefined : true}
            inert={!active}
            style={{
              opacity: active ? 1 : 0,
              visibility: active ? "visible" : "hidden",
              transform: `translateX(${active ? "0px" : i < cur ? "-24px" : "24px"})`,
            }}
          >
            <div className="slide-text">
              <span className="slide-eyebrow">{s.eyebrow}</span>
              <Title className="slide-title">{s.title}</Title>
              <p className="slide-body">{s.body}</p>
              <div className="btn-row">
                <Link href={href} className="btn btn-primary">{s.cta}</Link>
                <Link href="/about" className="btn btn-secondary">About us</Link>
              </div>
            </div>
            <div className="duotone slide-photo">
              {media[i]}
            </div>
          </div>
        );
      })}
      <div className="carousel-controls">
        <button type="button" className="carousel-arrow" onClick={() => go(cur - 1)} aria-label="Previous slide">←</button>
        <div className="carousel-dots">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className="carousel-dot"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === cur ? "true" : undefined}
              style={{ width: i === cur ? 36 : 16, backgroundColor: i === cur ? "#1d1f20" : "#bdbdc0" }}
            />
          ))}
        </div>
        <button type="button" className="carousel-arrow" onClick={() => go(cur + 1)} aria-label="Next slide">→</button>
        <span className="carousel-counter">{pad(cur + 1)} / {pad(n)}</span>
      </div>
    </div>
  );
}
