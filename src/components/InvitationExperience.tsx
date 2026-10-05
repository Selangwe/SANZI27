"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { EnvelopeIntro } from "./envelope/EnvelopeIntro";
import { OpeningCover } from "./sections/OpeningCover";
import { Families } from "./sections/Families";
import { InvitationText } from "./sections/InvitationText";
import { Story } from "./sections/Story";
import { Countdown } from "./sections/Countdown";
import { WeddingParty } from "./sections/WeddingParty";
import { Rsvp } from "./sections/Rsvp";
import { Venue } from "./sections/Venue";
import { Gifts } from "./sections/Gifts";
import { Faq } from "./sections/Faq";
import { Footer } from "./sections/Footer";

export function InvitationExperience() {
  const [opened, setOpened] = useState(false);

  // Always start at the top, with scrolling locked until the envelope opens.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("scroll-locked", !opened);
  }, [opened]);

  const handleOpened = useCallback(() => setOpened(true), []);

  return (
    <>
      <AnimatePresence>{!opened && <EnvelopeIntro key="intro" onComplete={handleOpened} />}</AnimatePresence>

      <main inert={!opened} aria-hidden={!opened} className="overflow-x-clip">
        <OpeningCover revealed={opened} />
        <Families />
        <InvitationText />
        <Story />
        <Countdown />
        <WeddingParty />
        <Rsvp />
        <Venue />
        <Gifts />
        <Faq />
        <Footer />
      </main>
    </>
  );
}
