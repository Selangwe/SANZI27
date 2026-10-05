"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { ImageSlot } from "../ui/ImageSlot";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function WeddingParty() {
  const { weddingParty } = wedding;
  const scroller = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const total = weddingParty.members.length;

  const step = () => {
    const card = scroller.current?.querySelector<HTMLElement>("[data-party-card]");
    return (card?.offsetWidth ?? 260) + 20;
  };

  const scrollBy = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * step(), behavior: "smooth" });

  // Track the most-visible card with an observer rather than a scroll handler,
  // so the counter only re-renders when the active card actually changes.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-party-card]")];
    const visible = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = cards.indexOf(e.target as HTMLElement);
          if (e.isIntersecting) visible.add(i);
          else visible.delete(i);
        }
        // Several cards fit on wide screens: report the first one in view.
        if (visible.size) setCurrent(Math.min(...visible));
      },
      { root, threshold: 0.75 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="party" className="paper relative py-24 sm:py-32">
      <div className="px-6">
        <SectionHeading title={weddingParty.heading} />
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
              className="flex w-[68vw] max-w-[260px] shrink-0 snap-center flex-col items-center text-center sm:snap-start"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.9, delay: Math.min(i, 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-full bg-linen shadow-[0_18px_40px_-24px_rgba(60,40,25,0.6)]">
                <ImageSlot image={m.image} sizes="260px" />
              </div>
              <p className="mt-6 text-[0.6rem] font-medium uppercase tracking-[0.26em] text-gold">{m.role}</p>
              <h3 className="mt-1.5 font-display text-2xl font-semibold text-ink">{m.name}</h3>
              <p className="mt-2 font-display text-[1.05rem] italic leading-snug text-stone">{m.bio}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 px-6">
          <ArrowButton dir={-1} onClick={() => scrollBy(-1)} />
          <span
            className="rounded-full border border-sand bg-ivory px-4 py-1.5 text-[0.65rem] font-medium tabular-nums tracking-[0.2em] text-stone"
            aria-live="polite"
          >
            <span className="text-ink">{pad(current + 1)}</span>
            <span className="mx-2 text-taupe">/</span>
            {pad(total)}
          </span>
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-ivory text-stone transition-colors hover:border-stone hover:text-ink"
    >
      {dir === 1 ? <ArrowRight size={16} weight="light" /> : <ArrowLeft size={16} weight="light" />}
    </button>
  );
}
