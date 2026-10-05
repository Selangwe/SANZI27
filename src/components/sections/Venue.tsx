"use client";

import { ArrowUpRight, MapPin } from "@phosphor-icons/react";
import { wedding } from "@/content/wedding";
import { CopyButton } from "../ui/CopyButton";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

export function Venue() {
  const { venue, venueSection } = wedding;

  return (
    <Section id="venue" className="paper">
      <SectionHeading title={venueSection.heading} />

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal className="card flex flex-col items-center px-6 py-12 text-center">
          <MapPin size={28} weight="light" className="text-gold" />
          <h3 className="mt-5 font-display text-3xl font-semibold text-ink">{venue.name}</h3>
          <address className="mt-4 not-italic leading-relaxed text-ink/70">
            {venue.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone">{venue.directionsNote}</p>
          <a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-8">
            {venueSection.mapsLabel}
            <ArrowUpRight size={14} weight="light" />

          </a>
        </Reveal>

        <Reveal delay={0.12} className="card flex flex-col items-center justify-center px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-[0.6rem] font-medium uppercase tracking-[0.1em] text-ivory">
            {venue.rideshare.provider}
          </span>
          <h3 className="mt-5 font-display text-3xl font-semibold text-ink">Your ride is on us</h3>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/70">{venue.rideshare.note}</p>

          <div className="mt-8 w-full max-w-xs rounded-lg border border-dashed border-taupe/70 bg-cream/60 p-5">
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-stone">{venue.rideshare.provider} voucher code</p>
            <p className="mt-2 select-all break-all font-sans text-xl font-medium tracking-[0.2em] text-ink">{venue.rideshare.code}</p>
          </div>
          <div className="mt-6">
            <CopyButton text={venue.rideshare.code} label="Copy code" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
