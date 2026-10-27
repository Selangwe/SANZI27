import { useId } from "react";

/**
 * Baroque filigree crest framing the couple's initials, as on the black acrylic
 * suite: a double ring, acanthus scrolls either side, a finial above and a
 * drop below.
 *
 *   finish="mirror" — thick gold mirror acrylic with depth (the envelope seal)
 *   finish="foil"   — flat gold foil (printed on the acrylic card)
 */
export function Crest({
  letter,
  finish = "foil",
  className = "",
}: {
  letter: string;
  finish?: "mirror" | "foil";
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const gold = `crest-gold-${id}`;
  const shade = `crest-shade-${id}`;
  const mirror = finish === "mirror";

  // Right-hand half; the left half is the same group mirrored.
  const half = (
    <g>
      {/* upper scroll */}
      <path d="M126 60 C138 42 160 33 175 42 C186 49 184 64 172 66 C163 67 159 57 166 53" />
      {/* lower scroll */}
      <path d="M126 82 C139 98 160 106 175 98 C186 91 183 77 172 76 C164 76 163 85 170 87" />
      {/* inner tendril */}
      <path d="M132 71 C146 70 154 64 158 56" />
      {/* leaves */}
      <path d="M146 46 C150 36 160 32 168 34 C163 42 156 46 146 46 Z" fill={`url(#${gold})`} />
      <path d="M148 95 C153 104 162 108 170 106 C165 99 158 95 148 95 Z" fill={`url(#${gold})`} />
      <path d="M157 71 C164 66 172 66 178 70 C172 75 164 76 157 71 Z" fill={`url(#${gold})`} />
      {/* arch over the ring */}
      <path d="M106 34 C117 22 136 24 140 38 C143 48 134 54 128 49 C124 46 126 40 131 41" />
      <path d="M118 28 C124 20 132 18 138 21 C134 27 126 30 118 28 Z" fill={`url(#${gold})`} />
      {/* arch under the ring */}
      <path d="M106 107 C116 117 132 117 138 108 C142 101 135 96 130 100" />
      {/* finial */}
      <path d="M100 38 C104 30 112 26 117 29 C121 32 118 38 112 37" />
      {/* drop */}
      <path d="M100 104 C103 111 109 114 113 111 C116 108 113 104 109 105" />
    </g>
  );

  return (
    <svg viewBox="0 0 200 140" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6a2e" />
          <stop offset="0.28" stopColor="#e8cd86" />
          <stop offset="0.42" stopColor="#fff2c4" />
          <stop offset="0.56" stopColor="#c39a4b" />
          <stop offset="0.78" stopColor="#f0d792" />
          <stop offset="1" stopColor="#8d6a2b" />
        </linearGradient>
        {mirror && (
          <filter id={shade} x="-20%" y="-30%" width="140%" height="170%">
            {/* acrylic thickness + soft cast shadow */}
            <feOffset in="SourceAlpha" dy="1.6" result="o1" />
            <feFlood floodColor="#5c4316" />
            <feComposite in2="o1" operator="in" result="edge" />
            <feDropShadow in="SourceGraphic" dx="0" dy="4" stdDeviation="3.5" floodColor="#000" floodOpacity="0.55" result="sh" />
            <feMerge>
              <feMergeNode in="sh" />
              <feMergeNode in="edge" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g
        fill="none"
        stroke={`url(#${gold})`}
        strokeWidth={mirror ? 4.2 : 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={mirror ? `url(#${shade})` : undefined}
      >
        {half}
        <g transform="matrix(-1 0 0 1 200 0)">{half}</g>
        {/* top & bottom points */}
        <path d="M100 18 L105 27 L100 36 L95 27 Z" fill={`url(#${gold})`} />
        <circle cx="100" cy="114" r="3" fill={`url(#${gold})`} />
        {/* double ring */}
        <circle cx="100" cy="71" r="30" />
        <circle cx="100" cy="71" r="24.5" strokeWidth={mirror ? 1.6 : 1.1} />
        {/* initial */}
        <text
          x="100"
          y={letter.length > 1 ? 80 : 83}
          textAnchor="middle"
          fontFamily="var(--font-pinyon), 'Pinyon Script', cursive"
          fontSize={letter.length > 1 ? 27 : 38}
          stroke="none"
          fill={`url(#${gold})`}
        >
          {letter}
        </text>
      </g>
    </svg>
  );
}
