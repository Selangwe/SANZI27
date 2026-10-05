/** Thin botanical divider used between headings and content. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 16"
      className={`h-4 w-40 text-gold ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 8h62M98 8h62" stroke="currentColor" strokeWidth="0.75" />
      <path
        d="M80 2c3 3 3 9 0 12-3-3-3-9 0-12zM72 8c2.5-2.2 5.5-2.2 8 0-2.5 2.2-5.5 2.2-8 0zM88 8c-2.5-2.2-5.5-2.2-8 0 2.5 2.2 5.5 2.2 8 0z"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <circle cx="66" cy="8" r="1" fill="currentColor" />
      <circle cx="94" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}
