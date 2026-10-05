import { Reveal } from "./Reveal";

/**
 * Section title. The small uppercase eyebrow is optional and used sparingly
 * (currently only on RSVP); most sections lead with the title alone.
 */
export function SectionHeading({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <Reveal className={`flex flex-col items-center text-center ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-[2.15rem] font-semibold leading-[1.1] text-ink sm:text-5xl">{title}</h2>
    </Reveal>
  );
}
