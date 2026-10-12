import type { Metadata } from "next";
import Photo, { Corners } from "@/components/Photo";
import { CtaBand } from "@/components/Footer";
import { completed, team } from "@/data/content";
import { figures } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: "Straightforward property investment advice from people who invest themselves. Our track record and the team you'll work with.",
};

export default function AboutPage() {
  return (
    <>
      <div className="container page">
        <div className="two-col">
          <div>
            <span className="eyebrow">About Mach</span>
            <h1 className="h1-page" style={{ marginBottom: 20 }}>Straightforward advice from people who invest themselves</h1>
            <p className="lead" style={{ marginBottom: 16 }}>
              Mach Property Investments was founded to make property investing simpler for people who don&apos;t have the time to do it themselves. We only present deals we would buy ourselves, and we stay with you after completion.
            </p>
            <p className="lead">You get one point of contact, plain-English reporting every month, and no hidden fees.</p>
          </div>
          <figure className="blueprint duotone" style={{ aspectRatio: "5 / 4" }}>
            <Photo alt="The Mach team" placeholder="Office or team photograph" sizes="(max-width: 700px) 100vw, 600px" />
            <Corners />
          </figure>
        </div>

        <section style={{ paddingTop: "clamp(56px, 7vw, 96px)" }}>
          <span className="eyebrow">Track record</span>
          <h2 className="h2-sm" style={{ marginBottom: 28 }}>Our results so far</h2>
          <div className="track-figures">
            {figures.map((f) => (
              <div key={f.label}>
                <div className="figure-value">{f.value}</div>
                <div className="figure-label">{f.label}</div>
              </div>
            ))}
          </div>
          <h3 className="h3" style={{ marginBottom: 16 }}>Recently completed</h3>
          <div style={{ overflowX: "auto" }}>
            <table className="table" style={{ minWidth: 640 }}>
              <thead><tr><th>Property</th><th>Strategy</th><th>Purchase price</th><th>Gross yield</th><th>Completed</th></tr></thead>
              <tbody>
                {completed.map((c) => (
                  <tr key={c.title}><td>{c.title}</td><td>{c.strategy}</td><td>{c.price}</td><td>{c.yield}</td><td>{c.year}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ paddingTop: "clamp(56px, 7vw, 96px)" }}>
          <span className="eyebrow">Our team</span>
          <h2 className="h2-sm" style={{ marginBottom: 28 }}>The people you&apos;ll work with</h2>
          <div className="team-grid">
            {team.map((t, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <figure className="blueprint duotone" style={{ aspectRatio: "4 / 5" }}>
                  <Photo src={t.image} alt={t.name} placeholder="Portrait" sizes="(max-width: 700px) 100vw, 400px" />
                  <Corners />
                </figure>
                <div>
                  <div className="team-name">{t.name}</div>
                  <div className="team-role">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <CtaBand />
    </>
  );
}
