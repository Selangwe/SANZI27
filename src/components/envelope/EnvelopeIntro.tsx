"use client";

import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { EnvelopeBodyArt, WaxSealArt } from "./fallbacks";
import { InvitationCardFace, cardRestingRect } from "./InvitationCardFace";
import { LayerImage } from "./LayerImage";

const LUXE = [0.22, 1, 0.36, 1] as const;
const LAYER_COUNT = 4; // pocket, flap, flowers, seal
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/*
 * Geometry of the client's envelope artwork (612 × 407 px), in % of the stage.
 * All four PNG layers were cut from that one image, so they line up exactly.
 */
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;
const ART = { w: 612, h: 407 };
/** The envelope's paper rectangle */
const BODY = { left: 103, top: 97, right: 510, bottom: 372 };
/** The flap PNG's box (hinge = its top edge) */
const FLAP = { left: 103, top: 97, w: 407, h: 202 };
/** Wax seal centre and diameter */
const SEAL = { x: 302, y: 276, d: 84 };
/** Tucked card: width (% of stage) and top edge (px of the artwork) */
const CARD = { width: 44, centerX: 306, top: 108 };

/** Flap outline in % of the flap box, used for the plain inside face */
const FLAP_OUTLINE: [number, number][] = [
  [0, 0], [99.75, 0], [99.26, 3.96], [97.54, 10.4], [94.59, 21.29], [87.47, 31.19], [80.34, 41.09],
  [74.94, 50.99], [69.78, 60.89], [65.85, 70.79], [62.41, 80.69], [55.77, 90.59], [49.63, 99.5],
  [39.8, 80.69], [29.24, 60.89], [18.92, 41.09], [9.34, 21.29], [0, 2.48],
];
const polygon = (mirror: boolean) =>
  `polygon(${FLAP_OUTLINE.map(([x, y]) => `${mirror ? 100 - x : x}% ${y}%`).join(", ")})`;

/**
 * Layered envelope intro.
 *
 *   z 40  wax seal       sits on the flap's point
 *   z 35  flowers        top-left bouquet, lying on top of the envelope
 *   z 30  flap           hinged on its top edge (drops to z 12 once open)
 *   z 20  pocket         the envelope with the flap cut away (bottom bouquet, 2027)
 *   z 15  card           tucked inside, slides up and out
 *   z 10  inside panel   the envelope's inside, seen once the flap is open
 *
 * Sequence on tap (steps overlap so it flows): seal lifts + fades → flap swings
 * open toward the viewer in 3D → card slides up out of the pocket → card grows
 * to fill the screen → onComplete() unlocks scrolling.
 */
export function EnvelopeIntro({ onComplete }: { onComplete: () => void }) {
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

    // 1. Wax seal lifts, grows slightly and fades away.
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

    // 4. Card expands to fill the screen. The full-size copy is already mounted
    //    (hidden), so this step only swaps visibility and animates its box.
    const r = cardRef.current?.getBoundingClientRect();
    const from = r ? { top: r.top, left: r.left, width: r.width, height: r.height } : cardRestingRect(innerWidth, innerHeight);
    await animate("[data-expand]", { ...from, visibility: "visible" }, { duration: 0 });
    animate("[data-card]", { opacity: 0 }, { duration: 0 });
    animate("[data-envelope]", { opacity: 0, y: "60%" }, { duration: d(0.6), ease: "easeIn" });
    await animate("[data-expand]", cardRestingRect(innerWidth, innerHeight), { duration: d(0.85), ease: LUXE });
    onComplete();
  }, [animate, phase, ready, reduceMotion, onComplete]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  const { partnerOne, partnerTwo, monogram } = wedding.couple;
  const { images, eyebrow, tapHint } = wedding.envelope;
  const face = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" } as const;
  const artSizes = "(max-width: 640px) 94vw, 600px";

  return (
    <motion.div
      ref={scope}
      className="paper fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-3"
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
          className="relative aspect-[612/407] w-[min(96vw,740px,110dvh)] cursor-pointer outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-8 focus-visible:ring-offset-cream"
          style={{ perspective: 1400 }}
        >
          {/* Ground shadow under the envelope's rectangle */}
          <div
            aria-hidden="true"
            className="absolute h-6 rounded-[50%] bg-[#5d4c36]/25 blur-xl"
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
                "linear-gradient(180deg, rgba(70,50,30,0.22), rgba(70,50,30,0) 18%), linear-gradient(180deg, #c9b193, #d6c2a6 60%, #cdb69a)",
            }}
          />

          {/* z15: invitation card, tucked behind the pocket. It can only be seen
              above the envelope's bottom edge. */}
          <div
            className="pointer-events-none absolute inset-0 z-[15]"
            style={{ clipPath: `inset(-400% -100% ${pct(ART.h - BODY.bottom, ART.h)} -100%)` }}
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

          {/* z20: pocket (the envelope with its flap cut away) */}
          <div className="absolute inset-0 z-20">
            <LayerImage src={images.pocket} sizes={artSizes} fallback={<BodyFallback />} onSettled={onLayerSettled} />
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
                fallback={<div className="absolute inset-0 bg-[#bba185]" style={{ clipPath: polygon(false) }} />}
                onSettled={onLayerSettled}
              />
              <div data-flap-shade className="absolute inset-0 bg-[#3a2b1c] opacity-0" style={{ clipPath: polygon(false) }} />
            </div>
            <div className="absolute inset-0" style={{ ...face, transform: "rotateY(180deg)" }}>
              <div
                className="absolute inset-0"
                style={{ clipPath: polygon(true), background: "linear-gradient(180deg, #cdb79b, #dcc8ad)" }}
              />
              <div data-flap-shade className="absolute inset-0 bg-[#3a2b1c] opacity-0" style={{ clipPath: polygon(true) }} />
            </div>
          </motion.div>

          {/* z35: top-left bouquet lying on the envelope */}
          <div className="pointer-events-none absolute inset-0 z-[35]">
            <LayerImage src={images.flowers} sizes={artSizes} fallback={null} onSettled={onLayerSettled} />
          </div>

          {/* z40: wax seal on the flap's point */}
          <div
            className="absolute z-40 aspect-square -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(SEAL.x, ART.w), top: pct(SEAL.y, ART.h), width: pct(SEAL.d, ART.w) }}
          >
            <motion.div data-seal className="absolute inset-0">
              <LayerImage
                src={images.seal}
                sizes="140px"
                fallback={<WaxSealArt monogram={monogram} />}
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

/** Drawn stand-in for the pocket artwork, placed on the envelope's rectangle */
function BodyFallback() {
  return (
    <div
      className="absolute"
      style={{
        left: pct(BODY.left, ART.w),
        top: pct(BODY.top, ART.h),
        width: pct(BODY.right - BODY.left, ART.w),
        height: pct(BODY.bottom - BODY.top, ART.h),
      }}
    >
      <EnvelopeBodyArt />
    </div>
  );
}
