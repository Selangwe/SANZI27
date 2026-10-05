"use client";

import { wedding } from "@/content/wedding";
import { Ornament } from "../ui/Ornament";
import { Reveal } from "../ui/Reveal";

export function Footer() {
  const { couple, event, footer } = wedding;
  return (
    <footer className="bg-ink px-6 pb-[max(4rem,env(safe-area-inset-bottom))] pt-24 text-center text-ivory">
      <Reveal className="flex flex-col items-center">
        <p className="font-display text-lg italic text-ivory/70">{footer.closing}</p>
        <p className="mt-3 flex flex-col items-center font-script text-6xl leading-tight sm:flex-row sm:gap-4">
          <span>{couple.partnerOne.firstName}</span>
          <span className="font-display text-3xl italic text-gold-soft">&amp;</span>
          <span>{couple.partnerTwo.firstName}</span>
        </p>
        <Ornament className="mt-8 text-gold-soft" />
        <p className="mt-6 text-[0.65rem] uppercase tracking-[0.4em] text-ivory/60">{event.shortDate}</p>
        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-gold-soft">{couple.hashtag}</p>
      </Reveal>
    </footer>
  );
}
