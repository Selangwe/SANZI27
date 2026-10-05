import { buildIcs } from "@/lib/calendar";

export const dynamic = "force-static";

/** Served at /calendar.ics — phones open it straight in their calendar app. */
export function GET() {
  return new Response(buildIcs(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wedding.ics"',
    },
  });
}
