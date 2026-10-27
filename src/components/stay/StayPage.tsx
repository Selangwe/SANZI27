"use client";

import { ArrowLeft, Bed, MapPin, NavigationArrow } from "@phosphor-icons/react";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { wedding } from "@/content/wedding";
import { mapsUrl } from "@/lib/calendar";
import { Reveal } from "../ui/Reveal";

type Area = (typeof wedding.lodging.areas)[number];

/** Google Maps embed that finds a place by name: no API key or coordinates needed. */
const embedUrl = (query: string) => `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;

/**
 * "Where to stay": for each city, a map and the hotels near that day's
 * celebrations. Tapping a hotel (or the venue) moves the map's pin to it.
 */
export function StayPage() {
  const { lodging, couple } = wedding;

  // The root layout starts every page scroll-locked for the envelope intro;
  // this page has no intro, so release it straight away.
  useLayoutEffect(() => {
    document.documentElement.classList.remove("scroll-locked");
  }, []);

  return (
    <main className="paper min-h-[100dvh] pb-[max(4rem,env(safe-area-inset-bottom))]">
      <header className="mx-auto w-full max-w-5xl px-6 pt-8">
        <Link
          href="/#celebrations"
          className="inline-flex min-h-11 items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold hover:text-ink"
        >
          <ArrowLeft size={16} weight="light" aria-hidden="true" />
          Back to the invitation
        </Link>

        <Reveal className="mt-10 text-center">
          <p className="font-display text-xl tracking-[0.3em] text-gold">{couple.weddingName}</p>
          <h1 className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.05] text-ink sm:text-6xl">
            {lodging.title}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[1.02rem] leading-relaxed text-ink/80">{lodging.intro}</p>
        </Reveal>
      </header>

      <div className="mx-auto mt-14 w-full max-w-5xl space-y-20 px-6">
        {lodging.areas.map((area) => (
          <AreaBlock key={area.city} area={area} />
        ))}
      </div>

      <Reveal className="mx-auto mt-16 max-w-lg px-6 text-center">
        <p className="text-sm leading-relaxed text-stone">{lodging.note}</p>
        <Link href="/#celebrations" className="btn btn-outline mt-8">
          <ArrowLeft size={15} weight="light" aria-hidden="true" />
          Back to the invitation
        </Link>
      </Reveal>
    </main>
  );
}

function AreaBlock({ area }: { area: Area }) {
  // null = the venue; otherwise the index of the selected hotel
  const [selected, setSelected] = useState<number | null>(0);
  const query = selected === null ? area.venue.mapsQuery : area.hotels[selected].mapsQuery;
  const label = selected === null ? area.venue.name : area.hotels[selected].name;

  return (
    <section aria-labelledby={`stay-${area.city}`}>
      <Reveal className="text-center">
        <h2 id={`stay-${area.city}`} className="font-script text-6xl leading-none text-ink">
          {area.city}
        </h2>
        <p className="mt-3 text-[0.66rem] font-medium uppercase tracking-[0.24em] text-gold">{area.when}</p>
      </Reveal>

      <div className="mt-8 grid gap-6 md:grid-cols-[1.15fr_1fr] md:items-start">
        {/* The map stays in view while the list scrolls (phones and desktop) */}
        <div className="sticky top-2 z-10 md:top-6">
          <div className="card overflow-hidden p-1.5">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[0.7rem] bg-linen md:aspect-square">
              <iframe
                key={query}
                title={`Map showing ${label}`}
                src={embedUrl(query)}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink/80">
              <MapPin size={16} weight="fill" className="shrink-0 text-gold" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </p>
          </div>
        </div>

        <ul className="space-y-3">
          <li>
            <PlaceRow
              icon="venue"
              name={area.venue.name}
              description="The celebration venue"
              active={selected === null}
              onSelect={() => setSelected(null)}
              mapsQuery={area.venue.mapsQuery}
            />
          </li>
          {area.hotels.map((hotel, i) => (
            <li key={hotel.name}>
              <PlaceRow
                icon="hotel"
                name={hotel.name}
                description={hotel.description}
                active={selected === i}
                onSelect={() => setSelected(i)}
                mapsQuery={hotel.mapsQuery}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PlaceRow({
  icon,
  name,
  description,
  active,
  onSelect,
  mapsQuery,
}: {
  icon: "venue" | "hotel";
  name: string;
  description: string;
  active: boolean;
  onSelect: () => void;
  mapsQuery: string;
}) {
  const Icon = icon === "venue" ? MapPin : Bed;
  return (
    <div
      className={`card flex gap-4 p-4 transition-[border-color,box-shadow] duration-300 ${
        active ? "border-gold/60 shadow-[0_14px_34px_-18px_rgba(147,81,47,0.55)]" : ""
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className="flex flex-1 items-start gap-4 text-left"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 transition-colors ${
            active ? "bg-gold text-ivory ring-gold" : "bg-gold/10 text-gold ring-gold/30"
          }`}
        >
          <Icon size={18} weight={active ? "fill" : "light"} aria-hidden="true" />
        </span>
        <span>
          <span className="block font-display text-xl font-semibold leading-tight text-ink">{name}</span>
          <span className="mt-1 block text-[0.92rem] leading-relaxed text-ink/75">{description}</span>
          <span className="mt-2 block text-[0.62rem] font-medium uppercase tracking-[0.22em] text-gold">
            {active ? "On the map" : "Show on map"}
          </span>
        </span>
      </button>
      <a
        href={mapsUrl(mapsQuery)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Directions to ${name} in Google Maps`}
        className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full text-gold ring-1 ring-gold/30 transition-colors hover:bg-gold/10"
      >
        <NavigationArrow size={18} weight="light" aria-hidden="true" />
      </a>
    </div>
  );
}
