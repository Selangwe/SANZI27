"use client";

import { Bed, Clock, MapPin } from "@phosphor-icons/react";
import Link from "next/link";
import { wedding } from "@/content/wedding";
import { mapsUrl } from "@/lib/calendar";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

type CelebrationEvent = (typeof wedding.celebrations.cities)[number]["days"][number]["events"][number];
type Swatch = { name: string; hex: string; share?: number; accent?: readonly string[] };

/**
 * Every celebration, grouped by city and day: venue, time, colours (as
 * swatches) and dress code, with a Maps link for each venue.
 */
export function Celebrations() {
  const { celebrations } = wedding;

  return (
    <Section id="celebrations" className="bg-ivory">
      <SectionHeading title={celebrations.heading} />

      <div className="mt-14 space-y-20">
        {celebrations.cities.map(({ city, days }) => (
          <div key={city}>
            <Reveal className="text-center">
              <p className="font-script text-6xl leading-none text-ink">{city}</p>
              <p className="mt-2 text-[0.62rem] uppercase tracking-[0.3em] text-taupe">Cameroon</p>
            </Reveal>

            <div className="mt-10 space-y-12">
              {days.map((day) => (
                <div key={day.date}>
                  <Reveal className="flex items-center gap-4">
                    <span className="h-px flex-1 bg-sand" />
                    <p className="font-display text-lg font-semibold text-gold">{day.label}</p>
                    <span className="h-px flex-1 bg-sand" />
                  </Reveal>

                  <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {day.events.map((e, i) => (
                      <EventCard key={e.id} event={e} delay={i * 0.08} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Reveal className="mt-16 flex flex-col items-center text-center">
        <p className="font-display text-xl italic text-stone">Travelling in for the celebrations?</p>
        <Link href="/stay" className="btn btn-solid mt-5">
          <Bed size={16} weight="light" aria-hidden="true" />
          {wedding.lodging.linkLabel}
        </Link>
      </Reveal>
    </Section>
  );
}

function EventCard({ event: e, delay }: { event: CelebrationEvent; delay: number }) {
  return (
    <Reveal delay={delay} className="card flex flex-col px-6 py-7 sm:px-8">
      <h3 className="font-display text-[1.7rem] font-semibold leading-tight text-ink">{e.name}</h3>

      <div className="mt-4 space-y-2 text-[0.95rem] text-ink/80">
        <p className="flex items-start gap-2.5">
          <MapPin size={18} weight="light" className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
          <span>{e.venue}</span>
        </p>
        <p className="flex items-start gap-2.5">
          <Clock size={18} weight="light" className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
          <span>{e.time || <span className="italic text-stone">Time to be announced</span>}</span>
        </p>
      </div>

      <div className="mt-6 border-t border-sand pt-5">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.24em] text-taupe">Colours</p>
        <Swatches swatches={e.swatches} />
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/80">{e.colours}</p>

        <p className="mt-5 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-taupe">Dress code</p>
        <p className="mt-1 font-display text-xl font-semibold text-ink">{e.dressCode}</p>
      </div>

      <a
        href={mapsUrl(e.mapsQuery)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline mt-7 self-start"
      >
        <MapPin size={15} weight="light" aria-hidden="true" />
        {wedding.celebrations.mapsLabel}
      </a>
    </Reveal>
  );
}

/** A proportion bar when shares are given (e.g. 80% black / 20% sage), otherwise round chips. */
function Swatches({ swatches }: { swatches: readonly Swatch[] }) {
  const proportional = swatches.every((s) => typeof s.share === "number");

  if (proportional) {
    return (
      <div className="mt-3">
        <div className="flex h-7 overflow-hidden rounded-full ring-1 ring-sand">
          {swatches.map((s) => (
            <span key={s.name} title={s.name} style={{ width: `${s.share}%`, background: fill(s) }} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-stone">
          {swatches.map((s) => (
            <span key={s.name}>
              {s.name} {s.share}%
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-4">
      {swatches.map((s) => (
        <span key={s.name} className="flex items-center gap-2 text-[0.75rem] text-stone">
          <span className="h-8 w-8 rounded-full ring-1 ring-sand" style={{ background: fill(s) }} />
          {s.name}
        </span>
      ))}
    </div>
  );
}

/** Plain colour, or a woven-looking stripe for patterned cloth (Toghu, Ndup). */
function fill(s: Swatch) {
  if (!s.accent?.length) return s.hex;
  const stops: string[] = [];
  let at = 0;
  for (const accent of s.accent) {
    stops.push(`${s.hex} ${at}px ${at + 5}px`, `${accent} ${at + 5}px ${at + 7}px`);
    at += 7;
  }
  return `repeating-linear-gradient(45deg, ${stops.join(", ")})`;
}
