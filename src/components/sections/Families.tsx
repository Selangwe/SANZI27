"use client";

import { wedding } from "@/content/wedding";
import { ImageSlot } from "../ui/ImageSlot";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";

/**
 * Tall terracotta title over an arched couple photo, script names, date and
 * venue, then both full names with their parents.
 */
export function Families() {
  const { partnerOne, partnerTwo } = wedding.couple;
  const { families, event, venue } = wedding;

  return (
    <Section id="families" className="paper">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <Reveal className="relative z-10 w-full">
          <h2 className="font-tall text-[3.4rem] uppercase leading-[0.9] tracking-[-0.01em] text-gold sm:text-7xl">
            {families.title}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="-mt-3 w-[84%] sm:-mt-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full shadow-[0_24px_50px_-28px_rgba(60,40,25,0.55)]">
            <ImageSlot image={families.image} sizes="(max-width: 768px) 84vw, 380px" />
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <p className="font-script text-[3.2rem] leading-tight text-ink">
            {partnerOne.firstName} <span className="text-[0.85em]">&amp;</span> {partnerTwo.firstName}
          </p>
          <p className="mt-2 font-display text-lg uppercase tracking-[0.14em] text-ink/85">{event.displayDate}</p>
          <p className="mt-1 font-display text-lg tracking-[0.08em] text-stone">{venue.name}</p>
        </Reveal>

        <Reveal delay={0.2} className="mt-16 w-full">
          <p className="font-display text-lg italic text-stone">{families.intro}</p>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">
            {partnerOne.fullName} <span className="font-normal italic text-gold">&amp;</span> {partnerTwo.fullName}
          </p>
        </Reveal>

        <div className="mt-10 grid w-full grid-cols-1 gap-8 border-t border-sand pt-10 sm:grid-cols-2">
          <Parents relation={partnerOne.relation} parents={partnerOne.parents} />
          <Parents relation={partnerTwo.relation} parents={partnerTwo.parents} />
        </div>
      </div>
    </Section>
  );
}

function Parents({ relation, parents }: { relation: string; parents: string }) {
  return (
    <Reveal className="flex flex-col items-center">
      <p className="text-[0.62rem] uppercase tracking-[0.26em] text-taupe">{relation}</p>
      <p className="mt-1 font-display text-lg italic text-stone">{parents}</p>
    </Reveal>
  );
}
