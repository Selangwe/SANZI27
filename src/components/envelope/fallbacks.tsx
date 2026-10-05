/**
 * Hand-drawn SVG stand-ins for the envelope PNGs.
 * They render automatically whenever a PNG in /public/envelope is missing,
 * so the intro works (and looks finished) before the real artwork arrives.
 */

export function EnvelopeBodyArt() {
  return (
    <svg viewBox="0 0 700 500" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="env-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6dac6" />
          <stop offset="1" stopColor="#ddd0b9" />
        </linearGradient>
        <linearGradient id="env-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ebe1d0" />
          <stop offset="1" stopColor="#e2d6c1" />
        </linearGradient>
        <linearGradient id="env-bottom" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f3ece0" />
          <stop offset="1" stopColor="#ece2d2" />
        </linearGradient>
        <filter id="env-fold-shadow" x="-10%" y="-20%" width="120%" height="140%">
          <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="#6b5a43" floodOpacity="0.18" />
        </filter>
      </defs>
      <rect width="700" height="500" rx="10" fill="url(#env-back)" />
      <path d="M0 10 Q0 0 10 0 L338 262 Q350 272 338 282 L10 500 Q0 500 0 490 Z" fill="url(#env-side)" />
      <path
        d="M700 10 Q700 0 690 0 L362 262 Q350 272 362 282 L690 500 Q700 500 700 490 Z"
        fill="url(#env-side)"
      />
      <path
        d="M0 490 L332 238 Q350 226 368 238 L700 490 Q700 500 690 500 L10 500 Q0 500 0 490 Z"
        fill="url(#env-bottom)"
        filter="url(#env-fold-shadow)"
      />
      <path d="M0 490 L332 238 Q350 226 368 238 L700 490" fill="none" stroke="#b9a88d" strokeOpacity="0.35" />
      <rect x="0.5" y="0.5" width="699" height="499" rx="10" fill="none" stroke="#b9a88d" strokeOpacity="0.35" />
    </svg>
  );
}

/** Wavy wax-blob outline, computed once. */
const sealPath = (() => {
  const points: string[] = [];
  const steps = 72;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = 90 + 4.5 * Math.sin(9 * t) + 3 * Math.sin(4 * t + 1.3) + 2 * Math.cos(13 * t);
    points.push(`${(100 + r * Math.cos(t)).toFixed(1)} ${(100 + r * Math.sin(t)).toFixed(1)}`);
  }
  return `M${points.join(" L")} Z`;
})();

export function WaxSealArt({ monogram }: { monogram: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#a8453f" />
          <stop offset="0.55" stopColor="#862e2c" />
          <stop offset="1" stopColor="#5f1d1d" />
        </radialGradient>
        <radialGradient id="wax-inner" cx="50%" cy="50%" r="50%">
          <stop offset="0.75" stopColor="#7a2726" />
          <stop offset="1" stopColor="#5a1b1b" />
        </radialGradient>
        <filter id="wax-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#3a1010" floodOpacity="0.35" />
        </filter>
      </defs>
      <path d={sealPath} fill="url(#wax)" filter="url(#wax-shadow)" />
      <circle cx="100" cy="100" r="64" fill="url(#wax-inner)" />
      <circle cx="100" cy="100" r="64" fill="none" stroke="#c46a5f" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="56" fill="none" stroke="#3d1111" strokeOpacity="0.35" strokeWidth="1" />
      <text
        x="100"
        y="114"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontStyle="italic"
        fontSize="40"
        fill="#3d1010"
        fillOpacity="0.55"
        transform="translate(1 1.5)"
      >
        {monogram}
      </text>
      <text
        x="100"
        y="114"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontStyle="italic"
        fontSize="40"
        fill="#e8b9a8"
        fillOpacity="0.85"
      >
        {monogram}
      </text>
      <ellipse cx="72" cy="62" rx="22" ry="10" fill="#fff" fillOpacity="0.12" transform="rotate(-30 72 62)" />
    </svg>
  );
}
