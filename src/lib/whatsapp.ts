/**
 * The one way the site hands a message to the couple: a wa.me link with the
 * text written out, which opens WhatsApp with everything already filled in.
 * Used by the RSVP and by the contribution card.
 */
export function waLink(number: string, lines: (string | false | null | undefined)[]) {
  const text = lines.filter((l): l is string => Boolean(l)).join("\n");
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
