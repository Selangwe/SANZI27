"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { wedding } from "@/content/wedding";
import { EnvelopeIntro } from "./envelope/EnvelopeIntro";
import { OpeningCover } from "./sections/OpeningCover";
import { Families } from "./sections/Families";
import { InvitationText } from "./sections/InvitationText";
import { Story } from "./sections/Story";
import { Countdown } from "./sections/Countdown";
import { WeddingParty } from "./sections/WeddingParty";
import { Rsvp } from "./sections/Rsvp";
import { Celebrations } from "./sections/Celebrations";
import { Programme } from "./sections/Programme";
import { Gifts } from "./sections/Gifts";
import { Faq } from "./sections/Faq";
import { Footer } from "./sections/Footer";

/**
 * Set once the envelope has been opened. It lives in memory only, so coming
 * back from another page of the site (e.g. "Where to stay") skips the envelope,
 * while a fresh visit or reload plays it again.
 */
let openedThisVisit = false;

export function InvitationExperience() {
  const [opened, setOpened] = useState(openedThisVisit);

  // Start at the top, with scrolling locked until the envelope opens. When
  // returning to an already-opened invitation, jump to the #section instead.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!openedThisVisit) {
      window.scrollTo(0, 0);
      return;
    }
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("scroll-locked", !opened);
  }, [opened]);

  const handleOpened = useCallback(() => {
    openedThisVisit = true;
    setOpened(true);
  }, []);

  return (
    // reducedMotion="user": transform animations become instant fades for guests
    // who ask their device for less motion. Scroll-linked effects opt out separately.
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!opened && <EnvelopeIntro key="intro" onComplete={handleOpened} />}</AnimatePresence>

      <main inert={!opened} aria-hidden={!opened} className="overflow-x-clip">
        <OpeningCover revealed={opened} />
        <Families />
        <InvitationText />
        <Story />
        <Countdown />
        <Celebrations />
        <Programme />
        {wedding.sections.weddingParty && <WeddingParty />}
        <Rsvp />
        {wedding.sections.gifts && <Gifts />}
        {wedding.sections.faq && <Faq />}
        <Footer />
      </main>
    </MotionConfig>
  );
}
