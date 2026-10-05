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

  const item = wedding.gifts.registry.find((g) => g.id === data.itemId);
  const name = cleanString(data.name, 120);
  if (!item) return NextResponse.json({ error: "Unknown gift." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });

  try {
    await forwardToWebhook(process.env.GIFTS_WEBHOOK_URL, "gift-claim", {
      itemId: item.id,
      itemName: item.name,
      name,
    });
  } catch (err) {
    console.error("[gift-claim] forward failed", err);
    return NextResponse.json({ error: "We couldn't save your claim. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
