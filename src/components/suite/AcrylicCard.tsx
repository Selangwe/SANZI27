"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { wedding } from "@/content/wedding";
import { Crest } from "./Crest";

/**
 * Smoked clear-acrylic invitation with gold-foil type, laid out like the
 * black tri-fold acrylic suite reference. Rendered inside .ic, so it shares
 * the paper card's size and position; --u keeps it readable tucked in the
 * envelope and at full screen.
 */
export function AcrylicCard() {
  const { partnerOne, partnerTwo, monogramLetters } = wedding.couple;
  const { event, venue } = wedding;
  const card = wedding.card.acrylic;

  return (
    <div className="acrylic">
      <div className="acrylic-body">
        <CardCrest letter={monogramLetters} />

        <div className="acrylic-caps foil">
          <p>{partnerOne.parents}</p>
          <p>{card.joiner}</p>
          <p>{partnerTwo.parents}</p>
          {card.request.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <p className="acrylic-script foil px-[0.3em]">{partnerOne.inviteName}</p>
          <p className="acrylic-caps foil">{card.and}</p>
          <p className="acrylic-script foil px-[0.3em]">{partnerTwo.inviteName}</p>
        </div>

        <div className="acrylic-caps foil">
          <p>{event.displayDateFormal}</p>
          <p>{event.displayYearFormal}</p>
          <p>{event.displayTimeFormal}</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="acrylic-venue foil px-[0.3em]">{venue.name}</p>
          <div className="acrylic-caps foil">
            {venue.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Light catching the acrylic. The intro sweeps it; idle otherwise. */}
      <motion.div data-glare className="glare" initial={{ x: "-70%" }} />
    </div>
  );
}

/** The client's crest artwork if present (public/invitation/crest.png), else the drawn one. */
function CardCrest({ letter }: { letter: string }) {
  const [missing, setMissing] = useState(false);
  return (
    <div className="relative aspect-[200/140] w-[calc(var(--u)*30)] shrink-0">
      {missing ? (
        <Crest letter={letter} finish="foil" className="absolute inset-0 h-full w-full" />
      ) : (
        <Image
          src={wedding.card.acrylic.crestImage}
          alt=""
          fill
          sizes="240px"
          className="object-contain"
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
