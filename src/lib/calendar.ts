import { wedding } from "@/content/wedding";

/** 2027-02-16T13:30:00+01:00 → 20270216T123000Z */
function toUtcStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** 2027-02-20 → 20270220 (and the following day, for an all-day entry's end) */
function toDateStamp(date: string, addDays = 0) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + addDays);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

function escapeIcs(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\;");
}

const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/**
 * Every celebration as a calendar entry. Events with a start time are timed;
 * the rest (times still to be confirmed) are all-day entries on their date.
 */
export function buildIcs() {
  const { couple, celebrations } = wedding;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SANZI27 Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcs(wedding.event.calendarTitle)}`,
  ];
  const stamp = toUtcStamp(new Date().toISOString());

  for (const { city, days } of celebrations.cities) {
    for (const day of days) {
      for (const e of day.events) {
        const title = `${couple.weddingName}: ${e.name}`;
        const when = e.start
          ? [`DTSTART:${toUtcStamp(e.start)}`, `DTEND:${toUtcStamp(e.end || e.start)}`]
          : [`DTSTART;VALUE=DATE:${toDateStamp(day.date)}`, `DTEND;VALUE=DATE:${toDateStamp(day.date, 1)}`];
        const details = [
          `Dress code: ${e.dressCode}`,
          `Colours: ${e.colours}`,
          e.start ? "" : "Time to be confirmed.",
          `Directions: ${mapsUrl(e.mapsQuery)}`,
        ]
          .filter(Boolean)
          .join("\n");
        lines.push(
          "BEGIN:VEVENT",
          `UID:${couple.weddingName.toLowerCase()}-${e.id}@invitation`,
          `DTSTAMP:${stamp}`,
          ...when,
          `SUMMARY:${escapeIcs(title)}`,
          `LOCATION:${escapeIcs(`${e.venue}, ${city}, Cameroon`)}`,
          `DESCRIPTION:${escapeIcs(details)}`,
          "END:VEVENT",
        );
      }
    }
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export { mapsUrl };
