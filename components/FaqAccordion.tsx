"use client";

import { useState } from "react";
import { faqGroups } from "@/data/content";

export default function FaqAccordion() {
  const [open, setOpen] = useState<string | null>("0-0");
  return (
    <div className="faq-groups">
      {faqGroups.map((g, gi) => (
        <div key={g.title}>
          <h2 className="faq-group-title">{g.title}</h2>
          <div className="faq-list">
            {g.items.map((f, i) => {
              const key = `${gi}-${i}`;
              const isOpen = open === key;
              return (
                <div key={key} className="faq-item">
                  <h3>
                    <button
                      type="button"
                      className="faq-q"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${key}`}
                      onClick={() => setOpen(isOpen ? null : key)}
                    >
                      <span>{f.q}</span>
                      <span className="faq-icon" aria-hidden="true">{isOpen ? "–" : "+"}</span>
                    </button>
                  </h3>
                  <div id={`faq-${key}`} hidden={!isOpen}>
                    <p className="faq-a">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
