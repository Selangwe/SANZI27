import { NextResponse } from "next/server";
import { wedding } from "@/content/wedding";
import { cleanString, forwardToWebhook } from "@/lib/webhook";

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const attending = data.attending === true;
  const name = cleanString(data.name, 120);
  const guests = attending ? Math.min(Math.max(Number(data.guests) || 1, 1), wedding.rsvp.maxGuests) : 0;

  if (!name) return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });

  try {
    await forwardToWebhook(process.env.RSVP_WEBHOOK_URL, "rsvp", {
      attending,
      name,
      guests,
      email: cleanString(data.email, 200),
      dietary: cleanString(data.dietary),
      message: cleanString(data.message, 1000),
    });
  } catch (err) {
    console.error("[rsvp] forward failed", err);
    return NextResponse.json({ error: "We couldn't save your reply. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
