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
 * Sequence on tap: one continuous, overlapping timeline (see open()): the
 * crest glints and lifts away → the flap swings open in 3D → the card rises
 * out of the pocket to the centre of the screen → without stopping, it grows
 * to fill the screen, tilting toward the light as a glare sweeps across it,
 * while the room dims → onComplete() unlocks scrolling.
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

    /*
     * One continuous timeline (seconds from the tap). Every step starts while
     * the previous one is still moving, and nothing changes direction, so the
     * eye follows a single gesture from the crest to the full-screen card:
     *
     *   0.00  crest glints and, in the same motion, lifts away and fades
     *   0.20  flap swings open (drops behind the card at its halfway point)
     *   0.60  card rises out of the pocket while the envelope sinks just enough
     *         that the card arrives at the centre of the screen
     *   1.55  while it is still gliding, the card is handed to its full-screen
     *         copy, which grows outward from the centre, tilting toward the
     *         light as a glare sweeps across it; the envelope falls away and
     *         the room dims
     *   ~3.0  the page underneath (showing the same card) takes over
     */
    const tilt = acrylic && !reduceMotion;
    const k = reduceMotion ? 0.4 : 1;
    const at = (s: number) => s * k;
    const SMOOTH = [0.45, 0, 0.2, 1] as const; // gentle start, soft finish
    const RISE = 1.1; // card's travel, in card heights (clears the envelope's top edge)

    // Where the envelope must end up so the risen card is centred on screen
    const tucked = cardRef.current?.getBoundingClientRect();
    const sink = tucked ? innerHeight / 2 - (tucked.top + tucked.height / 2 - RISE * tucked.height) : 0;

    // 1. Crest: glint → lift → fade, one tween
    animate(
      "[data-seal]",
      reduceMotion
        ? { opacity: 0 }
        : {
            scale: [1, 1.08, 1.18],
            y: [0, -6, -40],
            opacity: [1, 1, 0],
            filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"],
          },
      { duration: at(0.65), ease: "easeInOut", times: [0, 0.3, 1] },
    );

    // 2. Flap swings toward the viewer on its top hinge and folds back point-up
    const flapStart = at(0.2);
    const flapTime = at(0.8);
    animate("[data-flap]", { rotateX: 180 }, { duration: flapTime, delay: flapStart, ease: [0.45, 0, 0.25, 1] });
    animate("[data-flap-shade]", { opacity: [0, 0.28, 0] }, { duration: flapTime, delay: flapStart, ease: "linear" });
    animate("[data-flap]", { zIndex: 12 }, { duration: 0, delay: flapStart + flapTime * 0.5 });

    // 3. Card rises while the flap finishes; the envelope sinks so the card
    //    arrives centred
    const riseStart = at(0.6);
    const riseTime = at(1.15);
    animate("[data-envelope]", { y: sink }, { duration: riseTime, delay: riseStart, ease: SMOOTH });
    animate("[data-card]", { y: `${-RISE * 100}%` }, { duration: riseTime, delay: riseStart, ease: SMOOTH });

    // 4. Hand-off while the rise is still gliding (~85% through, card already
    //    clear of the envelope): the full-size copy (mounted, hidden) takes the
    //    card's exact place and grows outward from there in one motion.
    await new Promise((r) => setTimeout(r, (riseStart + riseTime * 0.85) * 1000));
    const r = cardRef.current?.getBoundingClientRect();
    const from = r ? { top: r.top, left: r.left, width: r.width, height: r.height } : cardRestingRect(innerWidth, innerHeight);
    await animate("[data-expand]", { ...from, visibility: "visible", transformPerspective: 1200 }, { duration: 0 });
    animate("[data-card]", { opacity: 0 }, { duration: 0 });

    const growTime = at(1.5);
    const GROW = [0.3, 0.15, 0.2, 1] as const; // picks up the rise's remaining glide, then settles
    animate("[data-envelope]", { opacity: 0, y: sink + innerHeight * 0.25 }, { duration: at(0.9), ease: [0.4, 0, 0.6, 1] });
    if (acrylic) animate("[data-dim]", { opacity: 1 }, { duration: growTime * 0.9, ease: "easeInOut" });
    if (tilt) {
      animate("[data-expand]", { rotateY: [0, -11, 0], rotateX: [0, 4, 0] }, { duration: growTime * 0.9, ease: "easeInOut" });
      animate("[data-expand] [data-glare]", { x: ["-70%", "70%"] }, { duration: growTime * 0.8, ease: [0.45, 0, 0.25, 1] });
    }
    animate("[data-expand]", cardRestingRect(innerWidth, innerHeight), { duration: growTime, ease: GROW });

    // The last stretch of the grow is sub-pixel: let the page take over there,
    // cross-fading onto the identical card underneath, rather than waiting.
    await new Promise((r) => setTimeout(r, growTime * 0.88 * 1000));
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
      {/* Sage watercolour clouds drifting in from the edges */}
      <EdgeClouds />

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

/**
 * Sage watercolour clouds billowing in from the edges of the envelope screen,
 * after the SANZI programme artwork. Each cluster is a heap of overlapping
 * puffs whose outlines are roughened by turbulence and softened, so they read
 * as painted mist. Clusters are anchored to the corners and sides with their
 * own proportions, so they keep their shape on any screen. Static, on their
 * own layers, so they cost nothing while the envelope animates.
 */
function EdgeClouds() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="sage-wash" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed="11" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="13" xChannelSelector="R" yChannelSelector="G" result="ragged" />
            <feGaussianBlur in="ragged" stdDeviation="2.6" />
          </filter>
        </defs>
      </svg>
      {/* bottom corners: the largest banks */}
      <Cloud className="-bottom-[6%] -left-[18%] w-[min(95vw,620px)]" />
      <Cloud className="-bottom-[7%] -right-[20%] w-[min(100vw,660px)]" mirror />
      {/* top corners */}
      <Cloud className="-left-[22%] -top-[5%] w-[min(80vw,520px)] rotate-180 opacity-80" mirror />
      <Cloud className="-right-[26%] -top-[4%] w-[min(70vw,460px)] rotate-180 opacity-60" />
      {/* drifting in from the sides */}
      <Cloud className="-left-[34%] top-[38%] w-[min(62vw,420px)] rotate-90 opacity-50" />
      <Cloud className="-right-[34%] top-[46%] w-[min(62vw,420px)] -rotate-90 opacity-50" mirror />
    </div>
  );
}

/** One cloud bank: a heap of puffs, darker sage at the base, paler on top. */
function Cloud({ className = "", mirror = false }: { className?: string; mirror?: boolean }) {
  // [cx, cy, r] puffs in a 160 × 100 box, base along the bottom edge
  const base: [number, number, number][] = [
    [12, 92, 30], [40, 84, 30], [70, 90, 26], [98, 88, 24], [124, 94, 22], [148, 98, 18],
  ];
  const billows: [number, number, number][] = [
    [22, 66, 20], [46, 56, 22], [70, 64, 18], [90, 70, 15], [112, 76, 12], [34, 42, 13], [58, 36, 11],
  ];
  const highlights: [number, number, number][] = [
    [40, 50, 10], [58, 44, 7], [24, 62, 9], [78, 66, 8],
  ];
  return (
    <svg
      viewBox="0 0 160 100"
      className={`absolute aspect-[16/10] [will-change:transform] ${className}`}
      style={mirror ? { scale: "-1 1" } : undefined}
    >
      <g filter="url(#sage-wash)">
        {base.map(([cx, cy, r], i) => (
          <circle key={`b${i}`} cx={cx} cy={cy} r={r} fill="#9cad8b" opacity="0.55" />
        ))}
        {billows.map(([cx, cy, r], i) => (
          <circle key={`m${i}`} cx={cx} cy={cy} r={r} fill="#b4c2a3" opacity="0.6" />
        ))}
        {highlights.map(([cx, cy, r], i) => (
          <circle key={`h${i}`} cx={cx} cy={cy} r={r} fill="#dfe6d3" opacity="0.4" />
        ))}
      </g>
    </svg>
  );
}
