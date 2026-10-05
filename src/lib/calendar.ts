import { wedding } from "@/content/wedding";

/** 2027-06-12T15:00:00+02:00 → 20270612T130000Z */
function toUtcStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\;");
}

function eventDetails() {
  const { event, venue } = wedding;
  return {
    title: event.calendarTitle,
    location: [venue.name, ...venue.addressLines].join(", "),
    description: `We can't wait to celebrate with you! Directions: ${venue.mapsUrl}`,
    start: toUtcStamp(event.start),
    end: toUtcStamp(event.end),
  };
}

export function buildIcs() {
  const e = eventDetails();
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-${e.start}@invitation`,
    `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
    `DTSTART:${e.start}`,
    `DTEND:${e.end}`,
    `SUMMARY:${escapeIcs(e.title)}`,
    `LOCATION:${escapeIcs(e.location)}`,
    `DESCRIPTION:${escapeIcs(e.description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(e.title)} is tomorrow`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function googleCalendarUrl() {
  const e = eventDetails();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${e.start}/${e.end}`,
    location: e.location,
    details: e.description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
