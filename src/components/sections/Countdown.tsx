"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { wedding } from "@/content/wedding";
import { googleCalendarUrl } from "@/lib/calendar";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function Countdown() {
  const { countdown, event } = wedding;

  return (
    <Section id="countdown" className="bg-ivory">
      <SectionHeading eyebrow={countdown.eyebrow} title={countdown.heading} />

      <div className="mt-14 grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <Reveal>
          <MonthCalendar date={event.date} />
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col items-center">
          <Timer target={event.start} />
          <p className="mt-8 font-display text-xl italic text-stone">{event.displayDate}</p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <a href="/calendar.ics" className="btn btn-solid">
              <CalendarIcon />
              {countdown.addToCalendarLabel}
            </a>
            <a
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.65rem] uppercase tracking-[0.25em] text-stone underline decoration-sand underline-offset-4 hover:text-ink"
            >
              or add to Google Calendar
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function MonthCalendar({ date }: { date: string }) {
  const [year, month, day] = date.split("-").map(Number);
  const cells = useMemo(() => {
    const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  }, [year, month]);

  return (
    <div className="mx-auto w-full max-w-sm border border-sand bg-cream/60 px-6 py-8">
      <div className="text-center">
        <p className="font-display text-3xl font-light text-ink">{MONTHS[month - 1]}</p>
        <p className="mt-1 text-[0.65rem] uppercase tracking-[0.35em] text-taupe">{year}</p>
      </div>
      <div className="mt-6 grid grid-cols-7 gap-y-2 text-center">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="pb-2 text-[0.6rem] uppercase tracking-[0.2em] text-taupe">
            {w}
          </span>
        ))}
        {cells.map((d, i) => (
          <span key={i} className="relative flex aspect-square items-center justify-center text-sm">
            {d === day ? (
              <>
                <motion.svg
                  viewBox="0 0 40 40"
                  className="absolute inset-0 m-auto h-[115%] w-[115%] text-gold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  aria-hidden="true"
                >
                  <motion.path
                    d="M20 35s-13-7.6-13-17A7 7 0 0 1 20 13a7 7 0 0 1 13 5c0 9.4-13 17-13 17z"
                    fill="currentColor"
                    fillOpacity={0.12}
                    stroke="currentColor"
                    strokeWidth={1}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
                  />
                </motion.svg>
                <span className="relative font-medium text-ink">{d}</span>
              </>
            ) : (
              <span className={d ? "text-ink/60" : ""}>{d}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function Timer({ target }: { target: string }) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now === null ? null : Math.max(0, targetMs - now);
  const parts =
    diff === null
      ? null
      : {
          Days: Math.floor(diff / 86_400_000),
          Hours: Math.floor(diff / 3_600_000) % 24,
          Minutes: Math.floor(diff / 60_000) % 60,
          Seconds: Math.floor(diff / 1000) % 60,
        };

  if (diff === 0) {
    return <p className="font-script text-5xl text-ink">Today&apos;s the day!</p>;
  }

  return (
    <div className="grid w-full max-w-sm grid-cols-4 divide-x divide-sand" role="timer" aria-live="off">
      {(["Days", "Hours", "Minutes", "Seconds"] as const).map((label) => {
        const value = parts ? parts[label] : null;
        return (
          <div key={label} className="flex flex-col items-center px-1">
            <span className="relative h-12 overflow-hidden font-display text-[2.6rem] font-light leading-[3rem] tabular-nums text-ink sm:h-14 sm:text-5xl sm:leading-[3.5rem]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={value ?? "x"}
                  className="block"
                  initial={{ y: "-60%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "60%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {value === null ? "—" : String(value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="mt-2 text-[0.58rem] uppercase tracking-[0.25em] text-taupe">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
