"use client";

import { CaretDown } from "@phosphor-icons/react";
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
      <SectionHeading title={faq.heading} />

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
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className="w-3 shrink-0 font-display text-sm font-semibold text-gold" aria-hidden="true">
                    Q
                  </span>
                  <span className="flex-1 text-[0.95rem] font-normal text-ink">{item.q}</span>
                  <motion.span
                    className="shrink-0 text-taupe"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                  >
                    <CaretDown size={16} weight="light" />
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
                    <div className="flex gap-4 pb-6 pr-8">
                      <span className="w-3 shrink-0 font-display text-sm font-semibold text-taupe" aria-hidden="true">
                        A
                      </span>
                      <p className="text-[0.95rem] leading-relaxed text-ink/70">{item.a}</p>
                    </div>
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
