import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import PropertyCard from "@/components/PropertyCard";
import { CtaBand } from "@/components/Footer";
import LocationMap, { type MapView } from "@/components/LocationMap";
import Photo from "@/components/Photo";
import { slides as allSlides } from "@/data/content";
import { pinOf, portfolio } from "@/data/portfolio";
import { figures } from "@/data/site";

export default function Home() {
  const slides = allSlides.filter((s) => !s.location || portfolio.some((p) => p.city === s.location));
  return (
    <>
      <section className="hero">
        <HeroCarousel
          slides={slides}
          media={slides.map((s) => (
            <Photo
              key={s.title}
              src={s.image}
              alt={s.title}
              placeholder={s.placeholder}
              sizes="(max-width: 700px) 100vw, 640px"
              fallback={
                s.location ? (
                  <LocationMap
                    view={s.location.toLowerCase() as MapView}
                    pins={portfolio.filter((p) => p.city === s.location).map(pinOf)}
                    title={`Map of ${s.location} showing our properties`}
                  />
                ) : (
                  <LocationMap view="uk" title="Map of the UK highlighting London, Essex and Manchester" />
                )
              }
            />
          ))}
        />
        <div className="figures-strip">
          <div className="figures-grid">
            {figures.map((f) => (
              <div key={f.label} className="figure-cell">
                <div className="figure-value">{f.value}</div>
                <div className="figure-label">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <section className="section">
          <div className="section-head">
            <div>
              <span className="eyebrow">Our portfolio</span>
              <h2 className="h2">Recent acquisitions</h2>
            </div>
            <Link href="/portfolio">See full portfolio →</Link>
          </div>
          <div className="card-grid">
            {portfolio.slice(0, 3).map((p) => <PropertyCard key={p.slug} property={p} showDesc={false} />)}
          </div>
        </section>
      </div>

      <CtaBand />
    </>
  );
}
