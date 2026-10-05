"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { wedding } from "@/content/wedding";
import { ImageSlot } from "../ui/ImageSlot";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

export function Story() {
  const { story } = wedding;
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const reduce = useReducedMotion();
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <Section id="story" className="paper">
      <SectionHeading title={story.heading} />

      <div className="mt-14 grid items-center gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl border border-gold/35" aria-hidden="true" />
          <div ref={photoRef} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <motion.div className="absolute -inset-y-[8%] inset-x-0" style={{ y }}>
              <ImageSlot image={story.image} sizes="(max-width: 768px) 90vw, 400px" />
            </motion.div>
          </div>
        </Reveal>

        <div>
          <div className="space-y-5">
            {story.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p
                  className={`text-[1.02rem] leading-[1.9] text-ink/80 ${
                    i === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-gold"
                      : ""
                  }`}
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="mt-12 grid grid-cols-3 border-t border-sand pt-8 text-center">
            {story.milestones.map((m) => (
              <div key={m.year} className="flex flex-col items-center gap-1">
                <span className="font-display text-3xl font-light text-ink">{m.year}</span>
                <span className="text-[0.6rem] uppercase tracking-[0.28em] text-taupe">{m.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
