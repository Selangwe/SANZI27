import { ImageResponse } from "next/og";
import { wedding } from "@/content/wedding";

/**
 * The preview card shown when the invitation is shared — on WhatsApp (how most
 * guests will receive it), in search results, and anywhere else a link unfurls.
 *
 * Drawn here rather than pointed at a photo on purpose: `cover.jpg` is still a
 * placeholder slot, and a link preview that 404s looks broken. It follows the
 * site's palette — near-black card, sage rule, white type — so the preview and
 * the invitation read as one piece. Next serves it at /opengraph-image and
 * wires up the og:image tags itself, overriding `openGraph.images` in layout.
 */
export const alt = `${wedding.couple.partnerOne.firstName} & ${wedding.couple.partnerTwo.firstName}: wedding invitation`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { couple, event, venue } = wedding;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#121413",
          color: "#ffffff",
          fontFamily: "serif",
          textAlign: "center",
          padding: "0 90px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "#9caf88",
          }}
        >
          You are cordially invited
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 44 }}>
          <div style={{ display: "flex", fontSize: 96 }}>{couple.partnerOne.firstName}</div>
          <div style={{ display: "flex", fontSize: 60, color: "#9caf88" }}>&</div>
          <div style={{ display: "flex", fontSize: 96 }}>{couple.partnerTwo.firstName}</div>
        </div>

        {/* Sage rule, the same accent the site uses between sections */}
        <div style={{ width: 180, height: 2, backgroundColor: "#9caf88", marginTop: 46 }} />

        <div style={{ display: "flex", fontSize: 34, marginTop: 44, color: "#e9ece5" }}>{event.displayDate}</div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginTop: 18,
            color: "#9caf88",
          }}
        >
          {`${venue.name} · Cameroon`}
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 54,
            fontSize: 22,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#5d655b",
          }}
        >
          {couple.weddingName}
        </div>
      </div>
    ),
    size,
  );
}
