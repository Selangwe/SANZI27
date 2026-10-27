"use client";

import { CaretDown } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { wedding } from "@/content/wedding";
import { ImageSlot } from "../ui/ImageSlot";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/**
 * The couple's story in chapters. Each chapter shows its opening paragraph;
 * the rest unfolds on "Read the chapter", so the page stays easy to scroll on
 * a phone while every word of the story is there.
 */
export function Story() {
  const { story } = wedding;

  return (
    <Section id="story" className="paper">
      <SectionHeading title={story.heading} />

      <div className="mt-14 space-y-20 sm:space-y-28">
        {story.chapters.map((chapter, i) => (
          <Chapter key={chapter.title} index={i} {...chapter} />
        ))}
      </div>
    </Section>
  );
}

function Chapter({
  index,
  title,
  image,
  paragraphs,
}: (typeof wedding.story.chapters)[number] & { index: number }) {
  const [open, setOpen] = useState(false);
  const [first, ...rest] = paragraphs;
  const flip = index % 2 === 1;
  const bodyId = `chapter-${index}-rest`;

  return (
    <article className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
      <Reveal className={`relative mx-auto w-full max-w-sm ${flip ? "md:order-2" : ""}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_24px_50px_-30px_rgba(60,40,25,0.55)]">
          <ImageSlot image={image} sizes="(max-width: 768px) 90vw, 400px" />
        </div>
      </Reveal>

      <div className={flip ? "md:order-1" : ""}>
        <Reveal>
          <p className="eyebrow">Chapter {NUMERALS[index] ?? index + 1}</p>
          <h3 className="mt-3 font-display text-[2rem] font-semibold leading-tight text-ink sm:text-4xl">{title}</h3>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 text-[1.02rem] leading-[1.9] text-ink/80 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-gold">
            {first}
          </p>
        </Reveal>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={bodyId}
              key="rest"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-5 pt-5">
                {rest.map((p) => (
                  <p key={p} className="text-[1.02rem] leading-[1.9] text-ink/80">
                    {p}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {rest.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={bodyId}
            className="mt-6 inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
          >
            {open ? "Close the chapter" : "Read the chapter"}
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="inline-flex">
              <CaretDown size={14} weight="bold" />
            </motion.span>
          </button>
        )}
      </div>
    </article>
  );
}
