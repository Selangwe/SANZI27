import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <Reveal className={`flex flex-col items-center text-center ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-display text-[2.6rem] font-light leading-[1.05] text-ink sm:text-6xl">
        {title}
      </h2>
      <Ornament className="mt-5" />
    </Reveal>
  );
}
