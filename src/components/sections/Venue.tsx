"use client";

import { wedding } from "@/content/wedding";
import { CopyButton } from "../ui/CopyButton";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

export function Venue() {
  const { venue, venueSection } = wedding;

  return (
    <Section id="venue" className="paper">
      <SectionHeading eyebrow={venueSection.eyebrow} title={venueSection.heading} />

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal className="flex flex-col items-center border border-sand bg-ivory px-6 py-12 text-center">
          <PinIcon />
          <h3 className="mt-5 font-display text-3xl text-ink">{venue.name}</h3>
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
        </Reveal>

        <Reveal delay={0.12} className="flex flex-col items-center justify-center bg-ink px-6 py-12 text-center text-ivory">
          <p className="text-[0.62rem] uppercase tracking-[0.32em] text-gold-soft">Getting there</p>
          <h3 className="mt-4 font-display text-3xl font-light">Your ride is on us</h3>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">{venue.rideshare.note}</p>

          <div className="mt-8 w-full max-w-xs rounded-sm border border-dashed border-gold-soft/60 p-5">
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-ivory/60">{venue.rideshare.provider} voucher code</p>
            <p className="mt-2 select-all break-all font-sans text-xl font-normal tracking-[0.2em] text-ivory">{venue.rideshare.code}</p>
          </div>
          <div className="mt-6 [&_.btn-solid]:bg-ivory [&_.btn-solid]:text-ink [&_.btn-solid:hover]:bg-sand">
            <CopyButton text={venue.rideshare.code} label="Copy code" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function PinIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-gold" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
