"use client";

import { wedding } from "@/content/wedding";

/**
 * The invitation card: handmade deckle-edged paper, a twine bow over the top
 * right corner and a sprig of dried gypsophila down the right side, after the
 * client's reference card. Wording comes from wedding.ts.
 *
 * The paper (torn edge + shadow) is a pre-rendered PNG and the ornaments are
 * plain SVG with no filters, so the card stays cheap to animate.
 *
 * The card is 7:10 where there is room for it; on tall phone screens it
 * stretches to fill almost the whole screen. Sizes use --u (1% of the card's
 * width), so it reads the same tucked in the envelope and settled full-screen.
 */
export function InvitationCardFace() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ containerType: "size" }}>
      <div className="ic">
        <Card />
      </div>
    </div>
  );
}

/**
 * Where the card sits once it has left the envelope: centred on screen with a
 * small margin (tighter on phones, so the card fills almost the whole screen).
 * Shared by the envelope's expand step and the pinned card behind the cover
 * (which uses the matching --card-margin in globals.css).
 */
export const cardMargin = (w: number, h: number) => Math.min(w, h) * (w < 640 ? 0.025 : 0.05);
export const cardRestingRect = (w: number, h: number) => {
  const m = cardMargin(w, h);
  return { top: m, left: m, width: w - m * 2, height: h - m * 2 };
};

function Card() {
  const { partnerOne, partnerTwo } = wedding.couple;
  const { venue, families, card } = wedding;

  return (
    <div className="absolute inset-0">
      <div className="ic-paper absolute inset-0" />
      <div className="ic-grain absolute inset-0" />

      {/* Typography */}
      <div className="ic-body">
        {card.quote && (
          <div>
            <p className="ic-quote">{card.quote}</p>
            {card.quoteCite && <p className="ic-cite">({card.quoteCite})</p>}
          </div>
        )}
        <Flourish />
        <p className="ic-caps">{families.intro}</p>

        <div className="flex flex-col items-center">
          <span className="ic-name">{partnerOne.firstName} {lastName(partnerOne.fullName)}</span>
          <span className="ic-amp">&amp;</span>
          <span className="ic-name">{partnerTwo.firstName} {lastName(partnerTwo.fullName)}</span>
        </div>

        <p className="ic-caps ic-request">{card.request}</p>

        <div className="ic-date">
          <div>
            <p className="ic-date-label">{card.weekday}</p>
            <p className="ic-date-value">{card.day}</p>
          </div>
          <span className="ic-date-rule" />
          <div>
            <p className="ic-date-label">{card.month}</p>
            <p className="ic-date-value">{card.year}</p>
          </div>
          <span className="ic-date-rule" />
          <div>
            <p className="ic-date-label">At</p>
            <p className="ic-date-value">{card.time}</p>
          </div>
        </div>

        <Flourish />
        <div>
          <p className="ic-venue">{venue.name}</p>
          <p className="ic-address">{venue.addressLines.slice(0, 2).join(", ")}</p>
        </div>

        <div>
          <p className="ic-signoff">{card.signOff}</p>
          <p className="ic-caps ic-closing">{card.closing}</p>
        </div>
      </div>

      <Sprig />
      <Twine />
    </div>
  );
}

const lastName = (full: string) => full.trim().split(/\s+/).at(-1) ?? "";

/* ── Ornaments ──────────────────────────────────────────────────────────── */

function Flourish() {
  return (
    <svg viewBox="0 0 120 12" className="ic-flourish" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
        <path d="M6 6 H44" />
        <path d="M76 6 H114" />
        <path d="M60 6 C55 1 49 2 50 6 C51 9 55 9 56 6" />
        <path d="M60 6 C65 1 71 2 70 6 C69 9 65 9 64 6" />
        <path d="M60 2.5 V9.5" />
      </g>
      <circle cx="60" cy="6" r="1.3" fill="currentColor" />
    </svg>
  );
}

/** Jute twine tied in a bow, wrapping the top right corner. */
function Twine() {
  // Each strand is drawn three times: base fibre, darker twist, light highlight.
  const strands = [
    // Two wraps running diagonally across the corner, off both edges
    "M44 -6 C80 22 140 62 210 118",
    "M34 2 C72 30 132 70 206 128",
    // Bow loops
    "M120 62 C100 40 74 22 66 34 C58 48 92 62 120 64",
    "M120 62 C140 34 170 18 178 30 C186 44 150 62 122 66",
    // Tails
    "M120 64 C110 84 96 96 84 122 C80 132 82 140 78 150",
    "M122 64 C132 86 150 96 152 118 C154 132 166 140 170 152",
  ];
  return (
    <svg viewBox="0 0 200 160" className="ic-twine" aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        {strands.map((d) => (
          <path key={`b${d}`} d={d} stroke="#a9875a" strokeWidth="3.4" />
        ))}
        {strands.map((d) => (
          <path key={`t${d}`} d={d} stroke="#7d5f3b" strokeWidth="3.4" strokeDasharray="1.6 2.6" opacity="0.7" />
        ))}
        {strands.map((d) => (
          <path key={`h${d}`} d={d} stroke="#d8bd92" strokeWidth="1" strokeDasharray="1.2 3" strokeDashoffset="1.4" />
        ))}
      </g>
      {/* Knot */}
      <ellipse cx="121" cy="64" rx="6.5" ry="5" fill="#9c7a4e" />
      <ellipse cx="121" cy="64" rx="6.5" ry="5" fill="none" stroke="#6f5233" strokeWidth="1" strokeDasharray="1.5 2" />
      <path d="M116 61 Q121 66 126 61" fill="none" stroke="#d2b689" strokeWidth="0.8" />
    </svg>
  );
}

/** Dried baby's breath: one stem with branching floret clusters. */
function Sprig() {
  return (
    <svg viewBox="0 0 200 420" className="ic-sprig" aria-hidden="true">
      <g fill="none" stroke="#9a7850" strokeLinecap="round">
        <path d={SPRIG.stem} strokeWidth="1.8" />
        {SPRIG.branches.map((b, i) => (
          <path key={i} d={b} strokeWidth="0.9" />
        ))}
        {SPRIG.twigs.map((t, i) => (
          <path key={i} d={t} strokeWidth="0.5" />
        ))}
      </g>
      {SPRIG.florets.map((f, i) => (
        <g key={i}>
          <circle cx={f.x} cy={f.y} r={f.r} fill={f.tone} stroke="#bba07a" strokeWidth="0.35" />
          <circle cx={f.x + f.r * 0.15} cy={f.y + f.r * 0.15} r={f.r * 0.38} fill="#c9ad82" opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

/* ── Seeded geometry (computed once, identical on server and client) ─────── */

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SPRIG = (() => {
  const r = rng(5);
  const P0 = { x: 40, y: 415 };
  const P1 = { x: 72, y: 230 };
  const P2 = { x: 168, y: 34 };
  const at = (t: number) => ({
    x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x,
    y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y,
  });
  const tangent = (t: number) => {
    const dx = 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
    const dy = 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
    return Math.atan2(dy, dx);
  };

  const branches: string[] = [];
  const twigs: string[] = [];
  const florets: { x: number; y: number; r: number; tone: string }[] = [];
  const tones = ["#f1e9da", "#ece2cf", "#e4d6bd", "#f6f0e4"];

  const cluster = (cx: number, cy: number, n: number, spread: number) => {
    for (let k = 0; k < n; k++) {
      const a = r() * Math.PI * 2;
      const d = spread * (0.35 + r() * 0.65);
      const fx = cx + Math.cos(a) * d;
      const fy = cy + Math.sin(a) * d - spread * 0.3;
      twigs.push(`M${cx.toFixed(1)} ${cy.toFixed(1)} L${fx.toFixed(1)} ${fy.toFixed(1)}`);
      florets.push({ x: fx, y: fy, r: 2.4 + r() * 1.9, tone: tones[Math.floor(r() * tones.length)] });
    }
  };

  const count = 15;
  for (let i = 0; i < count; i++) {
    const t = 0.32 + (i / (count - 1)) * 0.68;
    const base = at(t);
    const side = i % 2 === 0 ? -1 : 1;
    const ang = tangent(t) + side * (0.45 + r() * 0.5);
    const len = 22 + r() * 34 * (1 - t * 0.4);
    const end = { x: base.x + Math.cos(ang) * len, y: base.y + Math.sin(ang) * len };
    const mid = { x: (base.x + end.x) / 2 + side * 4, y: (base.y + end.y) / 2 };
    branches.push(
      `M${base.x.toFixed(1)} ${base.y.toFixed(1)} Q${mid.x.toFixed(1)} ${mid.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
    );
    cluster(end.x, end.y, 4 + Math.floor(r() * 5), 9 + r() * 6);
  }
  cluster(P2.x, P2.y, 8, 13);

  return {
    stem: `M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`,
    branches,
    twigs,
    florets,
  };
})();
