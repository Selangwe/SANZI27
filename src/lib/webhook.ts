/**
 * Forwards a submission to a webhook (Google Apps Script, Zapier, Make,
 * Formspree…) if one is configured, and always logs it to the server console
 * (visible in Vercel → Project → Logs).
 */
export async function forwardToWebhook(url: string | undefined, kind: string, payload: Record<string, unknown>) {
  const body = { kind, receivedAt: new Date().toISOString(), ...payload };
  console.log(`[${kind}]`, JSON.stringify(body));
  if (!url) return { forwarded: false };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  return { forwarded: true };
}

export function cleanString(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
