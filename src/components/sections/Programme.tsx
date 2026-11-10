"use client";

import {
  Bank,
  CaretLeft,
  CaretRight,
  Camera,
  Car,
  Champagne,
  Church,
  Confetti,
  ForkKnife,
  HandWaving,
  Hourglass,
  MusicNotes,
  type Icon,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding, type ProgrammePart } from "@/content/wedding";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

type Group = (typeof wedding.programme.groups)[number];
type Part = ProgrammePart;

const ICONS: Record<Part["items"][number]["icon"], Icon> = {
  court: Bank,
  camera: Camera,
  toast: Champagne,
  break: Hourglass,
  welcome: HandWaving,
  drum: MusicNotes,
  church: Church,
  meal: ForkKnife,
  tour: Car,
  entrance: Confetti,
};

/**
 * The day programmes as a horizontal canvas of cards: Civil and Traditional
 * share one outer card split by an inset divider, the Church wedding stands on
 * its own. The track is wider than the screen on purpose — the next card is cut
 * off at the edge and fades out there, so it reads as "swipe for more".
 */
export function Programme() {
  const { programme, couple } = wedding;

  return (
    <section
      id="programme"
      className="paper relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <SectionHeading title={programme.heading} />
      </div>

      <Track groups={programme.groups} label={programme.heading} />

      <Reveal className="mx-auto mt-10 w-full max-w-5xl px-6 text-center">
        <p className="font-display text-2xl tracking-[0.3em] text-gold">{couple.weddingName}</p>
        <p className="mt-2 font-display text-lg italic text-stone">{couple.tagline}</p>
      </Reveal>
    </section>
  );
}

/** The scrollable canvas, its edge fades, the dots and the desktop arrows. */
function Track({ groups, label }: { groups: readonly Group[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  /** Which card sits nearest the left edge; also lights the matching dot. */
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft > max - 8);

    // Cards carry data-group. On phones a two-part group splits into one card
    // per part, so several cards can share a group index — that is fine, the
    // dots track groups either way.
    // display: contents leaves the phone group wrapper boxless; skip those
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-group]")).filter((c) => c.offsetWidth > 0);
    const groups = cards.map((c) => Number(c.dataset.group ?? 0));
    let nearest = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (d < best) {
        best = d;
        nearest = groups[i];
      }
    });
    // At the far end the last card is fully in view even on wide screens, so
    // light its dot rather than the one still nearest the left edge.
    setActive(el.scrollLeft > max - 8 && groups.length ? groups[groups.length - 1] : nearest);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-group="' + i + '"]');
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="relative mt-10">
      <div className="prog-mask">
        <div
          ref={ref}
          onScroll={sync}
          tabIndex={0}
          role="region"
          aria-label={label}
          className="prog-track no-scrollbar flex items-start gap-5 overflow-x-auto overscroll-x-contain pb-4 pt-1 md:items-stretch md:gap-8"
        >
          {groups.map((group, g) =>
            group.parts.length > 1 ? (
              <div
                key={group.id}
                data-group={g}
                className="prog-group"
              >
                {/* Inset divider: separated from the outer border, per the sketch */}
                <span aria-hidden="true" className="absolute inset-y-10 left-1/2 hidden w-px bg-sand md:block" />
                {group.parts.map((part, p) => (
                  <Panel
                    key={part.title}
                    part={part}
                    delay={p * 0.08}
                    group={g}
                    tagOnPhone
                    className="card w-[82vw] shrink-0 snap-start md:w-1/2 md:rounded-none md:border-0 md:bg-transparent md:shadow-none"
                  />
                ))}
              </div>
            ) : (
              <Panel
                key={group.id}
                part={group.parts[0]}
                delay={0}
                group={g}
                tag
                className="card w-[82vw] shrink-0 snap-start md:w-[min(30rem,72vw)]"
              />
            ),
          )}
        </div>
      </div>

      {/* Affordances, so the cut-off card reads as "there is more" */}
      <div className="mx-auto mt-5 flex w-full max-w-5xl items-center justify-center gap-6 px-6">
        <Arrow dir={-1} onClick={() => nudge(-1)} disabled={atStart} />
        <div className="flex items-center gap-2.5">
          {groups.map((group, i) => (
            <button
              key={group.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={"Go to programme " + (i + 1) + " of " + groups.length}
              aria-current={i === active}
              className={
                "h-2 rounded-full transition-all duration-300 " +
                (i === active ? "w-6 bg-gold" : "w-2 bg-sand hover:bg-gold-soft")
              }
            />
          ))}
        </div>
        <Arrow dir={1} onClick={() => nudge(1)} disabled={atEnd} />
      </div>
    </div>
  );
}

function Arrow({ dir, onClick, disabled }: { dir: 1 | -1; onClick: () => void; disabled: boolean }) {
  const Caret = dir === 1 ? CaretRight : CaretLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? "Next programme" : "Previous programme"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-ivory text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ivory disabled:pointer-events-none disabled:opacity-30"
    >
      <Caret size={16} weight="light" aria-hidden="true" />
    </button>
  );
}

/** One wedding: its type, the date beneath it, then the running order. */
function Panel({
  part,
  delay,
  group,
  tag,
  tagOnPhone,
  className = "",
}: {
  part: Part;
  delay: number;
  group: number;
  /** This panel is itself a card on the canvas (a one-part group) */
  tag?: boolean;
  /** This panel is a card only on phones; on md+ its group is the card */
  tagOnPhone?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      delay={delay}
      data-group={tag || tagOnPhone ? group : undefined}
      className={"flex flex-col px-6 py-7 sm:px-8 md:px-9 md:py-9 " + className}
    >
      <h3 className="font-display text-[1.7rem] font-semibold leading-tight text-ink">{part.title}</h3>
      <p className="mt-2 text-[0.66rem] font-medium uppercase tracking-[0.24em] text-gold">{part.date}</p>
      {part.place && <p className="mt-1 font-display text-lg italic text-stone">{part.place}</p>}

      {part.note && (
        <div className="mt-6 rounded-[0.5rem] border border-sand/70 bg-cream/60 px-4 py-3">
          <p className="text-[1rem] leading-snug text-ink">{part.note.label}</p>
          <p className="mt-1 text-[0.85rem] italic text-stone">{part.note.detail}</p>
        </div>
      )}

      {part.itemsLabel && <p className="eyebrow mt-7">{part.itemsLabel}</p>}

      <ol className={part.itemsLabel ? "mt-5" : "mt-6"}>
        {part.items.map((item, i) => {
          const ItemIcon = ICONS[item.icon];
          const last = i === part.items.length - 1;
          return (
            <li key={item.label} className="relative flex gap-4 pb-6 last:pb-0">
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
  );
}
