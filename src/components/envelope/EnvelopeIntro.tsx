"use client";

import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { Crest } from "../suite/Crest";
import { EnvelopeBodyArt, EnvelopeFlapArt } from "./fallbacks";
import { InvitationCardFace, cardRestingRect } from "./InvitationCardFace";
import { LayerImage } from "./LayerImage";

const LUXE = [0.22, 1, 0.36, 1] as const;
const LAYER_COUNT = 3; // body, flap, crest
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/*
 * Geometry of the stage, in "art px" (converted to % so it scales): a black
 * envelope (407 × 275, a 20 px margin all round) with a V flap and a gold
 * crest on its point.
 */
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;
const ART = { w: 447, h: 315 };
/** The envelope's paper rectangle */
const BODY = { left: 20, top: 20, right: 427, bottom: 295 };
/** The flap's box (hinge = its top edge, point at bottom centre) */
const FLAP = { left: 20, top: 20, w: 407, h: 154 };
/** Gold crest: centre (on the flap's point) and width; the crest is 10:7 */
const CREST = { x: 223.5, y: 174, w: 138 };
/** Tucked card: width (% of stage) and top edge (art px) */
const CARD = { width: 60, centerX: 223.5, top: 31 };

/** V-shaped flap, in % of the flap box (also the inside face and its shading) */
const FLAP_V = "polygon(0% 0%, 100% 0%, 50% 100%)";

/**
 * Layered envelope intro.
 *
 *   z 40  gold crest     mirror-acrylic SZ crest on the flap's point
 *   z 30  flap           black V flap, hinged on its top edge (drops to z 12 once open)
 *   z 20  body           the black envelope's front (pocket folds)
 *   z 15  card           tucked inside, slides up and out
 *   z 10  inside panel   the envelope's inside, seen once the flap is open
 *
 * Each layer can be replaced by a PNG (see wedding.ts → envelope.images);
 * until then it is drawn in code.
 *
 * Sequence on tap (steps overlap so it flows): crest glints, lifts + fades →
 * flap swings open toward the viewer in 3D → card slides up out of the pocket
 * → (acrylic card) it tilts toward the light as a glare sweeps across it →
 * the room dims and the card grows to fill the screen → onComplete() unlocks
 * scrolling.
 */
export function EnvelopeIntro({ onComplete }: { onComplete: () => void }) {
  const acrylic = wedding.card.style === "acrylic";
  const reduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "opening">("idle");

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
    const speed = reduceMotion ? 0.4 : 1;
    const d = (s: number) => s * speed;

    // 1. The gold crest catches the light, then lifts, grows slightly and fades away.
    if (!reduceMotion) {
      await animate(
        "[data-seal]",
        { scale: [1, 1.06, 1], filter: ["brightness(1)", "brightness(1.35)", "brightness(1)"] },
        { duration: 0.45, ease: "easeInOut" },
      );
    }
    animate("[data-seal]", { y: -36, scale: 1.15, opacity: 0 }, { duration: d(0.45), ease: [0.4, 0, 0.2, 1] });
    await sleep(d(300));

    // 2. Flap swings forward toward the viewer on its top hinge and folds back
    //    point-up. Edge-on (halfway) it drops behind the card.
    const flapTime = d(0.8);
    animate("[data-flap]", { rotateX: 180 }, { duration: flapTime, ease: [0.45, 0, 0.25, 1] });
    animate("[data-flap-shade]", { opacity: [0, 0.28, 0] }, { duration: flapTime, ease: "linear" });
    animate("[data-flap]", { zIndex: 12 }, { duration: 0, delay: flapTime * 0.5 });
    await sleep(flapTime * 1000 * 0.62);

    // 3. Card slides up out of the pocket while the envelope settles lower.
    animate("[data-envelope]", { y: "34%" }, { duration: d(0.95), ease: LUXE });
    await animate("[data-card]", { y: "-104%" }, { duration: d(0.95), ease: LUXE });

    // 3b. Acrylic card: it tilts toward the viewer while light sweeps across it.
    if (acrylic && !reduceMotion) {
      animate("[data-card] [data-glare]", { x: ["-70%", "70%"] }, { duration: 1.1, ease: [0.45, 0, 0.25, 1] });
      await animate("[data-card]", { rotateY: [0, -12, 0], rotateX: [0, 5, 0] }, { duration: 1.2, ease: "easeInOut" });
    }

    // 4. Card expands to fill the screen. The full-size copy is already mounted
    //    (hidden), so this step only swaps visibility and animates its box.
    const r = cardRef.current?.getBoundingClientRect();
    const from = r ? { top: r.top, left: r.left, width: r.width, height: r.height } : cardRestingRect(innerWidth, innerHeight);
    await animate("[data-expand]", { ...from, visibility: "visible" }, { duration: 0 });
    animate("[data-card]", { opacity: 0 }, { duration: 0 });
    animate("[data-envelope]", { opacity: 0, y: "60%" }, { duration: d(0.6), ease: "easeIn" });
    if (acrylic) animate("[data-dim]", { opacity: 1 }, { duration: d(0.85), ease: "easeInOut" });
    await animate("[data-expand]", cardRestingRect(innerWidth, innerHeight), { duration: d(0.85), ease: LUXE });
    onComplete();
  }, [acrylic, animate, phase, ready, reduceMotion, onComplete]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  const { partnerOne, partnerTwo, monogramLetters } = wedding.couple;
  const { images, eyebrow, tapHint } = wedding.envelope;
  const face = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" } as const;
  const artSizes = "(max-width: 640px) 90vw, 520px";

  return (
    <motion.div
      ref={scope}
      className="paper fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-3"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Lights down as the acrylic card comes forward */}
      <div data-dim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-noir opacity-0" />

      {/* Soft vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(122,109,92,0.16) 100%)" }}
      />

      <motion.div
        className="relative mb-2 text-center sm:mb-4"
        initial={{ opacity: 0, y: 12 }}
        animate={ready ? (phase === "idle" ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }) : undefined}
        transition={phase === "idle" ? { duration: 1, ease: LUXE, delay: 0.15 } : { duration: 0.35 }}
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
          opacity: { duration: 1, ease: LUXE },
          y:
            phase === "idle" && !reduceMotion
              ? { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
              : { duration: 0.4 },
        }}
      >
        <div
          data-envelope
          role="button"
          tabIndex={0}
          aria-label="Open the invitation"
          onClick={open}
          onKeyDown={onKeyDown}
          className="relative aspect-[447/315] w-[min(94vw,560px,100dvh)] cursor-pointer outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-8 focus-visible:ring-offset-cream"
          style={{ perspective: 1400 }}
        >
          {/* Ground shadow under the envelope's rectangle */}
          <div
            aria-hidden="true"
            className="absolute h-6 rounded-[50%] bg-black/40 blur-xl"
            style={{ left: pct(BODY.left + 20, ART.w), right: pct(ART.w - BODY.right + 20, ART.w), top: pct(BODY.bottom - 16, ART.h) }}
          />

          {/* z10: inside of the envelope, only seen once the flap is open */}
          <div
            aria-hidden="true"
            className="absolute z-10"
            style={{
              left: pct(BODY.left, ART.w),
              top: pct(BODY.top, ART.h),
              width: pct(BODY.right - BODY.left, ART.w),
              height: pct(BODY.bottom - BODY.top, ART.h),
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0) 22%), linear-gradient(180deg, #161617, #1d1d1f 60%, #19191a)",
            }}
          />

          {/* z15: invitation card, tucked behind the pocket. It can only be seen
              above the envelope's bottom edge. */}
          <div
            className="pointer-events-none absolute inset-0 z-[15]"
            style={{
              // a few px above the paper's bottom edge, which is soft in the artwork
              clipPath: `inset(-400% -100% ${pct(ART.h - BODY.bottom + 8, ART.h)} -100%)`,
              // 3D for the card's tilt, centred on where the card is once it is out
              perspective: 1400,
              perspectiveOrigin: "50% -55%",
            }}
          >
            <div
              ref={cardRef}
              data-card
              className="absolute aspect-[7/10]"
              style={{
                width: `${CARD.width}%`,
                left: `calc(${pct(CARD.centerX, ART.w)} - ${CARD.width / 2}%)`,
                top: pct(CARD.top, ART.h),
              }}
            >
              <InvitationCardFace />
            </div>
          </div>

          {/* z20: the envelope's front */}
          <div
            className="absolute z-20"
            style={{
              left: pct(BODY.left, ART.w),
              top: pct(BODY.top, ART.h),
              width: pct(BODY.right - BODY.left, ART.w),
              height: pct(BODY.bottom - BODY.top, ART.h),
            }}
          >
            <LayerImage
              src={images.body}
              sizes={artSizes}
              fit="fill"
              fallback={<EnvelopeBodyArt variant="noir" />}
              onSettled={onLayerSettled}
            />
          </div>

          {/* z30: flap, hinged on its top edge: artwork outside, plain paper inside */}
          <motion.div
            data-flap
            className="absolute z-30"
            style={{
              left: pct(FLAP.left, ART.w),
              top: pct(FLAP.top, ART.h),
              width: pct(FLAP.w, ART.w),
              height: pct(FLAP.h, ART.h),
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
              rotateX: 0,
            }}
          >
            <div className="absolute inset-0" style={face}>
              <LayerImage
                src={images.flap}
                sizes={artSizes}
                fit="fill"
                fallback={<EnvelopeFlapArt variant="noir" />}
                onSettled={onLayerSettled}
              />
              <div data-flap-shade className="absolute inset-0 bg-black opacity-0" style={{ clipPath: FLAP_V }} />
            </div>
            <div className="absolute inset-0" style={{ ...face, transform: "rotateY(180deg)" }}>
              <div
                className="absolute inset-0"
                style={{ clipPath: FLAP_V, background: "linear-gradient(180deg, #232325, #18181a)" }}
              />
              <div data-flap-shade className="absolute inset-0 bg-black opacity-0" style={{ clipPath: FLAP_V }} />
            </div>
          </motion.div>

          {/* z40: gold mirror-acrylic crest on the flap's point */}
          <div
            className="absolute z-40 aspect-[200/140] -translate-x-1/2 -translate-y-[58%]"
            style={{ left: pct(CREST.x, ART.w), top: pct(CREST.y, ART.h), width: pct(CREST.w, ART.w) }}
          >
            <motion.div data-seal className="absolute inset-0">
              <LayerImage
                src={images.seal}
                sizes="200px"
                fallback={<Crest letter={monogramLetters} finish="mirror" className="h-full w-full" />}
                onSettled={onLayerSettled}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.p
        className="eyebrow relative mt-4 sm:mt-6"
        initial={{ opacity: 0 }}
        animate={ready ? (phase === "idle" ? { opacity: reduceMotion ? 0.8 : [0.35, 1, 0.35] } : { opacity: 0 }) : undefined}
        transition={
          phase === "idle" ? { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 } : { duration: 0.25 }
        }
      >
        {tapHint}
      </motion.p>

      {/* 4. The card, lifted out of the envelope, growing to fill the screen.
          Mounted up front (hidden) so the hand-off costs no render. */}
      <div data-expand aria-hidden="true" className="invisible fixed left-0 top-0 z-[60] h-px w-px">
        <InvitationCardFace />
      </div>
    </motion.div>
  );
}
