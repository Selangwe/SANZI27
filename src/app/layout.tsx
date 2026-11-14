import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Instrument_Serif, Jost, Pinyon_Script } from "next/font/google";
import { wedding } from "@/content/wedding";
import { indexable, siteUrl } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/** Tall, condensed serif for the "With Our Families" title */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const { partnerOne, partnerTwo } = wedding.couple;
const title = `${partnerOne.firstName} & ${partnerTwo.firstName}: Wedding Invitation`;
const description = `${wedding.couple.weddingName}: join us in ${wedding.venue.name}, Cameroon, from ${wedding.event.displayDate}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // The preview image is drawn by src/app/opengraph-image.tsx, which Next wires
  // up automatically — no entry here, so there is one place to change it.
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    siteName: wedding.couple.weddingName,
  },
  alternates: { canonical: "/" },
  // Indexable so the sitemap submitted to Google Search Console does something;
  // set NEXT_PUBLIC_NOINDEX=1 on preview deployments to keep those out of search.
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f7f4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${instrument.variable} ${pinyon.variable} ${jost.variable} scroll-locked`}
    >
      <body>{children}</body>
    </html>
  );
}
