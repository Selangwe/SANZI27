"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { wedding } from "@/content/wedding";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

export function Faq() {
  const { faq } = wedding;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="paper">
      <SectionHeading eyebrow={faq.eyebrow} title={faq.heading} />

      <Reveal className="mx-auto mt-14 max-w-2xl border-t border-sand">
        {faq.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-sand">
              <h3>
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-xl text-ink sm:text-2xl">{item.q}</span>
                  <motion.span
                    className="relative h-4 w-4 shrink-0 text-gold"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                  >
                    <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                    <span className="absolute left-1/2 top-0 h-4 w-px bg-current" />
                  </motion.span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-10 leading-relaxed text-ink/70">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>
    </Section>
  );
}
