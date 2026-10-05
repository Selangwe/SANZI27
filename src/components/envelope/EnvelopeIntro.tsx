"use client";

import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { EnvelopeBodyArt, EnvelopeFlapArt, WaxSealArt } from "./fallbacks";
import { InvitationCardFace, cardRestingRect } from "./InvitationCardFace";
import { LayerImage } from "./LayerImage";

const LUXE = [0.22, 1, 0.36, 1] as const;
const LAYER_COUNT = 4; // body, flap, seal, card
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Rect = { top: number; left: number; width: number; height: number };

/**
 * Layered envelope intro.
 *
 *   z 40  wax seal   — sits on the flap's point
 *   z 30  flap       — V-shaped, hinged on its top edge (drops to z 5 once open)
 *   z 20  body       — static envelope base, hides the card
 *   z 10  card       — tucked inside, slides up and out
 *
 * Sequence on tap: seal lifts + fades → pause → flap swings open in 3D
 * (rotateX about its top edge, inside a perspective container) → card slides
 * up → card grows to fill the screen (with a small margin) → onComplete()
 * unlocks scrolling.
 */
export function EnvelopeIntro({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "opening" | "expanding">("idle");
  const [expandFrom, setExpandFrom] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  // Fade the envelope in only after every layer has loaded (or fallen back),
  // so guests never see PNGs popping in one at a time.
  const [settledCount, setSettledCount] = useState(0);
  const [forceReady, setForceReady] = useState(false);
  const onLayerSettled = useCallback(() => setSettledCount((n) => n + 1), []);
  const ready = settledCount >= LAYER_COUNT || forceReady;

  useEffect(() => {
    const t = setTimeout(() => setForceReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const open = useCallback(async () => {
    if (phase !== "idle" || !ready) return;
    setPhase("opening");
    const speed = reduceMotion ? 0.35 : 1;
    const d = (s: number) => s * speed;

    // 1. Wax seal lifts, grows slightly and fades away.
    await animate(
      "[data-seal]",
      { y: -42, scale: 1.18, opacity: 0 },
      { duration: d(0.7), ease: [0.4, 0, 0.2, 1] },
    );

    // 2. Brief pause.
    await sleep(d(250));

    // 3. Flap swings toward the viewer on its top hinge. Halfway (edge-on)
    //    it drops behind the card so the card can slide out in front of it.
    await animate(
      "[data-flap]",
      { rotateX: 90, filter: "brightness(0.97)" },
      { duration: d(0.45), ease: [0.55, 0, 0.9, 0.6] },
    );
    await animate("[data-flap]", { zIndex: 5 }, { duration: 0 });
    await animate(
      "[data-flap]",
      { rotateX: 180, filter: "brightness(0.9)" },
      { duration: d(0.55), ease: [0.1, 0.4, 0.3, 1] },
    );

    // 4. Card slides up and out while the envelope settles lower.
    animate("[data-envelope]", { y: "26%" }, { duration: d(1.2), ease: LUXE });
    await animate("[data-card]", { y: "-78%" }, { duration: d(1.2), ease: LUXE });
    await sleep(d(250));

    // 5. Card expands to fill the screen.
    const rect = cardRef.current?.getBoundingClientRect();
    setViewport({ w: window.innerWidth, h: window.innerHeight });
    setExpandFrom(rect ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : null);
    setPhase("expanding");
    animate("[data-envelope]", { opacity: 0, y: "40%" }, { duration: d(0.7), ease: "easeIn" });
  }, [animate, phase, ready, reduceMotion]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  const { partnerOne, partnerTwo, monogram } = wedding.couple;
  const { images, eyebrow, tapHint } = wedding.envelope;

  return (
    <motion.div
      ref={scope}
      className="paper fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Soft vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(122,109,92,0.16) 100%)" }}
      />

      <motion.div
        className="relative mb-10 text-center sm:mb-14"
        initial={{ opacity: 0, y: 12 }}
        animate={ready ? (phase === "idle" ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }) : undefined}
        transition={phase === "idle" ? { duration: 1.2, ease: LUXE, delay: 0.2 } : { duration: 0.5 }}
      >
        <p className="eyebrow">{eyebrow}</p>
        <p className="mt-3 font-script text-4xl text-ink sm:text-5xl">
          {partnerOne.firstName} <span className="font-display text-2xl italic text-gold">&amp;</span>{" "}
          {partnerTwo.firstName}
        </p>
      </motion.div>

      {/* Idle float wrapper (kept separate from the sequence transforms) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={ready ? { opacity: 1, y: phase === "idle" && !reduceMotion ? [0, -6, 0] : 0 } : undefined}
        transition={{
          opacity: { duration: 1.2, ease: LUXE },
          y:
            phase === "idle" && !reduceMotion
              ? { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
              : { duration: 0.6 },
        }}
      >
        <div
          data-envelope
          role="button"
          tabIndex={0}
          aria-label="Open the invitation"
          onClick={open}
          onKeyDown={onKeyDown}
          className="relative aspect-[7/5] w-[min(86vw,520px,92dvh)] cursor-pointer outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-8 focus-visible:ring-offset-cream"
          style={{ perspective: 1400 }}
        >
          {/* Ground shadow */}
          <div
            aria-hidden="true"
            className="absolute -bottom-6 left-[8%] right-[8%] h-8 rounded-[50%] bg-[#5d4c36]/20 blur-xl"
          />

          {/* z10 — Invitation card (portrait, ~1:1.42), tucked inside */}
          <div
            ref={cardRef}
            data-card
            className="absolute bottom-[5%] left-[27%] right-[27%] top-[5%] z-10"
            style={{ opacity: phase === "expanding" ? 0 : 1 }}
          >
            <InvitationCardFace onSettled={onLayerSettled} />
          </div>

          {/* z20 — Envelope body */}
          <div className="absolute inset-0 z-20 drop-shadow-[0_18px_30px_rgba(60,45,30,0.18)]">
            <LayerImage
              src={images.body}
              sizes="(max-width: 640px) 90vw, 520px"
              fallback={<EnvelopeBodyArt />}
              onSettled={onLayerSettled}
            />
          </div>

          {/* z30 — Flap, hinged on its top edge */}
          <motion.div
            data-flap
            className="absolute left-0 right-0 top-0 z-30 h-[56%]"
            style={{
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
              filter: "brightness(1)",
              rotateX: 0,
            }}
          >
            <LayerImage
              src={images.flap}
              sizes="(max-width: 640px) 90vw, 520px"
              fallback={<EnvelopeFlapArt />}
              onSettled={onLayerSettled}
            />
          </motion.div>

          {/* z40 — Wax seal on the flap's point */}
          <div className="absolute left-1/2 top-[56%] z-40 aspect-square w-[21%] -translate-x-1/2 -translate-y-[62%]">
            <motion.div data-seal className="absolute inset-0">
              <LayerImage
                src={images.seal}
                sizes="120px"
                fallback={<WaxSealArt monogram={monogram} />}
                onSettled={onLayerSettled}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.p
        className="eyebrow relative mt-14 sm:mt-16"
        initial={{ opacity: 0 }}
        animate={ready ? (phase === "idle" ? { opacity: reduceMotion ? 0.8 : [0.35, 1, 0.35] } : { opacity: 0 }) : undefined}
        transition={
          phase === "idle" ? { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.4 } : { duration: 0.3 }
        }
      >
        {tapHint}
      </motion.p>

      {/* 5. The card, lifted out of the envelope, growing to fill the screen */}
      {phase === "expanding" && (
        <motion.div
          className="fixed z-[60]"
          initial={expandFrom ?? { ...cardRestingRect(viewport.w, viewport.h), opacity: 0 }}
          animate={{ ...cardRestingRect(viewport.w, viewport.h), opacity: 1 }}
          transition={{ duration: reduceMotion ? 0.4 : 1.15, ease: LUXE }}
          onAnimationComplete={onComplete}
        >
          <InvitationCardFace />
        </motion.div>
      )}
    </motion.div>
  );
}
