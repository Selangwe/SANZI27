"use client";

import { wedding } from "@/content/wedding";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

export function InvitationText() {
  const { invitation, event, venue } = wedding;

  const fill = (text: string) =>
    text.split(/(\{date\}|\{time\}|\{venue\})/g).map((part, i) => {
      const value = { "{date}": event.displayDate, "{time}": event.displayTime, "{venue}": venue.name }[part];
      return value ? (
        <span key={i} className="whitespace-nowrap not-italic text-ink">
          {value}
        </span>
      ) : (
        part
      );
    });

  return (
    <Section id="invitation" className="bg-ivory">
      <SectionHeading title={invitation.heading} />
      <div className="mx-auto mt-12 max-w-xl space-y-6 text-center">
        {invitation.body.map((p, i) => (
          <Reveal key={i} delay={i * 0.12}>
            <p className="font-display text-[1.35rem] font-light italic leading-relaxed text-stone sm:text-2xl">
              {fill(p)}
            </p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.4} className="mt-12 flex justify-center">
        <p className="font-script text-4xl text-gold">{wedding.couple.monogram}</p>
      </Reveal>
    </Section>
  );
}
