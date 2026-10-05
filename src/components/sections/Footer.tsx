"use client";

import { wedding } from "@/content/wedding";
import { Reveal } from "../ui/Reveal";

export function Footer() {
  const { couple, event, footer } = wedding;
  return (
    <footer className="paper border-t border-sand px-6 pb-[max(4rem,env(safe-area-inset-bottom))] pt-20 text-center">
      <Reveal className="flex flex-col items-center">
        <p className="font-display text-lg italic text-stone">{footer.closing}</p>
        <p className="mt-2 flex flex-col items-center font-script text-6xl leading-tight text-ink sm:flex-row sm:gap-4">
          <span>{couple.partnerOne.firstName}</span>
          <span className="font-display text-3xl italic text-gold">&amp;</span>
          <span>{couple.partnerTwo.firstName}</span>
        </p>
        <p className="mt-8 font-display text-lg text-stone">{event.shortDate}</p>
        <p className="mt-1 text-sm text-gold">{couple.hashtag}</p>
      </Reveal>
    </footer>
  );
}
