"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { wedding } from "@/content/wedding";
import { InvitationCardFace } from "../envelope/InvitationCardFace";
import { ImageSlot } from "../ui/ImageSlot";
import { ScrollCue } from "../ui/ScrollCue";

/**
 * The full-screen invitation card the envelope reveals, pinned in place while
 * section 1 (the cinematic cover) slides up over it.
 */
export function OpeningCover({ revealed }: { revealed: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const cardShade = useTransform(scrollYProgress, [0, 1], [0, 0.55]);

  return (
    <div ref={ref} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-ink">
        <motion.div className="absolute inset-0" style={{ scale: cardScale }}>
          <InvitationCardFace />
        </motion.div>
        <motion.div className="absolute inset-0 bg-ink" style={{ opacity: cardShade }} />
        <ScrollCue visible={revealed} />
      </div>
      <Cover revealed={revealed} />
    </div>
  );
}

function Cover({ revealed }: { revealed: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const { partnerOne, partnerTwo } = wedding.couple;

  return (
    <section
      ref={ref}
      id="cover"
      className="relative z-10 flex h-[100dvh] items-end justify-center overflow-hidden bg-ink text-ivory"
    >
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <ImageSlot image={wedding.cover.image} tone="dark" labelAt="top" priority={revealed} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/65" />

      <motion.div
        className="relative mb-[22dvh] flex flex-col items-center px-6 text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={{ show: { transition: { staggerChildren: 0.25 } } }}
      >
        {[
          <p key="d" className="text-[0.65rem] uppercase tracking-[0.4em] text-ivory/80">
            {wedding.event.shortDate}
          </p>,
          <h1 key="n" className="mt-6 font-script text-[4.2rem] leading-[0.95] sm:text-8xl">
            {partnerOne.firstName}
            <span className="mx-3 block font-display text-3xl italic text-gold-soft sm:inline sm:text-5xl">&amp;</span>
            {partnerTwo.firstName}
          </h1>,
          <p key="t" className="mt-6 font-display text-2xl font-light italic tracking-wide text-ivory/90 sm:text-3xl">
            {wedding.cover.tagline}
          </p>,
        ].map((child) => (
          <motion.div
            key={child.key}
            variants={{
              hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
              show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>

      <ScrollCue light />
    </section>
  );
}
