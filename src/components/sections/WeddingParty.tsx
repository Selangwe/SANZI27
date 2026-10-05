"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { wedding } from "@/content/wedding";
import { ImageSlot } from "../ui/ImageSlot";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function WeddingParty() {
  const { weddingParty } = wedding;
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-party-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 280) + 20), behavior: "smooth" });
  };

  return (
    <section id="party" className="paper relative py-24 sm:py-32">
      <div className="px-6">
        <SectionHeading eyebrow={weddingParty.eyebrow} title={weddingParty.heading} />
      </div>

      <Reveal className="relative mt-14">
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[max(1.5rem,calc((100vw-64rem)/2))] pb-4"
          aria-label="Wedding party members"
        >
          {weddingParty.members.map((m, i) => (
            <motion.article
              key={m.name}
              data-party-card
              className="w-[74vw] max-w-[290px] shrink-0 snap-center sm:snap-start"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.9, delay: Math.min(i, 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-linen">
                <ImageSlot image={m.image} sizes="290px" />
              </div>
              <div className="border-x border-b border-sand bg-ivory px-5 pb-7 pt-5 text-center">
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gold">{m.role}</p>
                <h3 className="mt-2 font-display text-2xl text-ink">{m.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{m.bio}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 px-6">
          <ArrowButton dir={-1} onClick={() => scrollBy(-1)} />
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-taupe">Swipe to meet them</span>
          <ArrowButton dir={1} onClick={() => scrollBy(1)} />
        </div>
      </Reveal>
    </section>
  );
}

function ArrowButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Next" : "Previous"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-sand text-stone transition-colors hover:border-stone hover:text-ink"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: dir === -1 ? "scaleX(-1)" : undefined }}>
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
