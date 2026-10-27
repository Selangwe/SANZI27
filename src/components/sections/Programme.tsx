"use client";

import { Bank, Camera, Champagne, HandWaving, Hourglass, MusicNotes, type Icon } from "@phosphor-icons/react";
import { wedding } from "@/content/wedding";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

const ICONS: Record<(typeof wedding.programme.parts)[number]["items"][number]["icon"], Icon> = {
  court: Bank,
  camera: Camera,
  toast: Champagne,
  break: Hourglass,
  welcome: HandWaving,
  drum: MusicNotes,
};

/** The day's running order as a vertical timeline, one card per part of the day. */
export function Programme() {
  const { programme, couple } = wedding;

  return (
    <Section id="programme" className="paper">
      <SectionHeading title={programme.heading} />
      <Reveal className="mt-4 text-center">
        <p className="font-display text-xl italic text-stone">{programme.subheading}</p>
        <p className="mt-3 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-gold">
          {programme.date} · {programme.place}
        </p>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        {programme.parts.map((part, p) => (
          <Reveal key={part.title} delay={p * 0.1} className="card px-6 py-7 sm:px-8">
            <h3 className="font-display text-[1.7rem] font-semibold text-ink">{part.title}</h3>
            <ol className="mt-6">
              {part.items.map((item, i) => {
                const ItemIcon = ICONS[item.icon];
                const last = i === part.items.length - 1;
                return (
                  <li key={item.label} className="relative flex gap-4 pb-7 last:pb-0">
                    {/* the line joining one step to the next */}
                    {!last && <span aria-hidden="true" className="absolute left-[1.1rem] top-10 bottom-1 w-px bg-sand" />}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/30">
                      <ItemIcon size={17} weight="light" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[0.66rem] font-medium uppercase tracking-[0.2em] text-taupe">{item.time}</p>
                      <p className="mt-1 text-[1rem] leading-snug text-ink">{item.label}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 text-center">
        <p className="font-display text-2xl tracking-[0.3em] text-gold">{couple.weddingName}</p>
        <p className="mt-2 font-display text-lg italic text-stone">{couple.tagline}</p>
      </Reveal>
    </Section>
  );
}
