"use client";

import { wedding } from "@/content/wedding";
import { ImageSlot } from "../ui/ImageSlot";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

export function Families() {
  const { partnerOne, partnerTwo } = wedding.couple;
  const { families, event, venue } = wedding;

  return (
    <Section id="families" className="paper">
      <SectionHeading eyebrow={families.eyebrow} title={families.intro} />

      <div className="mt-14 grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <Reveal className="mx-auto w-full max-w-sm">
          <div className="relative">
            <div className="absolute -inset-3 rounded-t-full border border-gold/40" aria-hidden="true" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full">
              <ImageSlot image={families.image} sizes="(max-width: 768px) 90vw, 400px" />
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col items-center text-center">
          <Person name={partnerOne.fullName} relation={partnerOne.relation} parents={partnerOne.parents} />
          <Reveal delay={0.1}>
            <span className="my-6 block font-display text-4xl italic text-gold">&amp;</span>
          </Reveal>
          <Person name={partnerTwo.fullName} relation={partnerTwo.relation} parents={partnerTwo.parents} />

          <Reveal delay={0.2} className="mt-12 flex w-full flex-col items-center gap-2 border-t border-sand pt-10">
            <p className="eyebrow">{event.displayDate}</p>
            <p className="font-display text-xl italic text-stone">{venue.name}</p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function Person({ name, relation, parents }: { name: string; relation: string; parents: string }) {
  return (
    <Reveal className="flex flex-col items-center">
      <p className="font-script text-5xl leading-tight text-ink sm:text-6xl">{name.split(" ")[0]}</p>
      <p className="mt-1 font-display text-lg tracking-wide text-ink/80">{name}</p>
      <p className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-taupe">{relation}</p>
      <p className="mt-1 font-display text-lg italic text-stone">{parents}</p>
    </Reveal>
  );
}
