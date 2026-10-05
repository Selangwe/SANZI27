# Animated Wedding Invitation

A mobile-first, single-page wedding invitation. It opens with a layered envelope,
then scrolls through the cover, families, invitation, story, countdown, wedding
party, RSVP, venue, gifts and FAQ sections.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Framer Motion · TypeScript

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

---

## Where to edit what

| To change…                           | Edit                                    |
| ------------------------------------ | --------------------------------------- |
| Names, date, venue, all text, prices | `src/content/wedding.ts` (one file)     |
| Photos                               | drop files into `public/images/`        |
| Envelope artwork                     | drop 4 PNGs into `public/envelope/`     |
| Colours and fonts                    | `src/app/globals.css` (`@theme`) and `src/app/layout.tsx` |

All copy is placeholder. Every image path is listed in `src/content/wedding.ts`.
**If an image file is missing, the site shows a labeled placeholder** that names
the expected file (for example `public/images/cover.jpg`). You can swap photos
in one at a time.

### Photos (`public/images/`)

| File                                     | Section                      | Suggested shape  |
| ---------------------------------------- | ---------------------------- | ---------------- |
| `cover.jpg`                              | 1 · Cinematic cover          | portrait, ≥1600px tall |
| `families.jpg`                           | 2 · With Our Families (arch) | 3:4              |
| `story.jpg`                              | 4 · Their Story              | 4:5              |
| `party/member-1.jpg` … `member-6.jpg`    | 6 · Wedding Party            | 3:4              |
| `registry/item-1.jpg` … `item-4.jpg`     | 9 · Gifts registry           | 1:1              |

To add or remove wedding party members or registry items, edit the arrays in
`wedding.ts`. The layout adapts to the count.

### Envelope PNGs (`public/envelope/`)

The intro is built from four separate transparent PNG layers, stacked as:

```
z40  wax-seal.png          sits on the flap's point
z30  envelope-flap.png     V-shaped, hinged on its top edge
z20  envelope-body.png     static base, must be opaque where it covers the card
z10  invitation-card.png   tucked behind the body, slides up and out
```

| File                  | Canvas            | Notes |
| --------------------- | ----------------- | ----- |
| `envelope-body.png`   | 1400 × 1000 (7:5) | Full envelope back with the pocket folds. It must be **opaque** over the card area. |
| `envelope-flap.png`   | 1400 × 560 (5:2)  | Same width as the body. The top edge is the hinge and the point is at bottom-centre. |
| `wax-seal.png`        | 400 × 400 (1:1)   | Seal centred on the canvas. It is placed on the flap's point. |
| `invitation-card.png` | 1080 × 1920       | Shown inside the envelope (centre-cropped), then expands to full screen. Portrait works best. |

Until a PNG exists, a built-in SVG stand-in is drawn for that layer, so the
intro always works. If the client's art uses different proportions, change the
percentages in `src/components/envelope/EnvelopeIntro.tsx`: the flap height is
`h-[56%]`, the seal sits at `top-[56%]` and is `w-[21%]` wide, and the
envelope is `aspect-[7/5]`.

**Opening sequence** (`EnvelopeIntro.tsx`, `open()`):

1. The seal lifts, scales to 1.18 and fades.
2. A short pause (250 ms).
3. The flap rotates `rotateX 0 → 180°` about its top edge inside a
   `perspective: 1400px` container, so it swings toward the viewer. At 90° it
   drops behind the card.
4. The card slides up out of the envelope while the envelope sinks.
5. The card expands to fill the screen. Scrolling then unlocks and the page
   continues below it.

When the guest's device asks for reduced motion, the same sequence plays at
about a third of the duration.

---

## RSVP and gift claims

When a guest submits an RSVP or claims a gift, the browser POSTs to
`/api/rsvp` or `/api/gift-claim`. Each submission is:

- logged on the server (Vercel → Project → **Logs**), and
- forwarded as JSON to a webhook, if you set one:

```bash
RSVP_WEBHOOK_URL=   # e.g. a Google Apps Script web app that appends to a Sheet
GIFTS_WEBHOOK_URL=  # Zapier / Make / Formspree endpoints also work
```

Set these in Vercel → Project → Settings → Environment Variables (see `.env.example`).

> **Note:** a claimed gift shows as "Claimed by you" only on that guest's
> device. To mark an item claimed for **everyone**, set `claimed: true` on it in
> `wedding.ts` and redeploy. For live, shared claim status, connect a datastore
> such as Upstash Redis or Vercel Marketplace storage to `/api/gift-claim`.

The honeymoon fund's **Contribute** button opens
`gifts.honeymoon.paymentUrlTemplate`, with `{amount}` replaced by the chosen
amount (for example PayPal.me, Yoco or SnapScan links). The progress bar uses
the `raised` and `goal` values; update them by hand.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project**, import the repo and keep the
   defaults (Next.js is detected automatically).
3. Optional: add `RSVP_WEBHOOK_URL`, `GIFTS_WEBHOOK_URL`, and
   `NEXT_PUBLIC_SITE_URL` (your custom domain, used for link-preview images).
4. Deploy.

`/calendar.ics` is generated at build time from the event start and end in
`wedding.ts`. The **Add to Calendar** button links to it, and phones open it
directly in their calendar app. A Google Calendar link is also shown.

---

## Project structure

```
src/
  app/
    layout.tsx               fonts, metadata
    page.tsx                 renders <InvitationExperience/>
    globals.css              design tokens, base styles, typeset card
    calendar.ics/route.ts    .ics download
    api/rsvp/route.ts
    api/gift-claim/route.ts
  content/wedding.ts         ← ALL content lives here
  components/
    InvitationExperience.tsx intro → scroll unlock → sections
    envelope/                EnvelopeIntro, layer loader, SVG stand-ins, card face
    sections/                one file per section
    ui/                      ImageSlot, Reveal, SectionHeading, CopyButton…
  lib/                       calendar, webhook, storage helpers
public/
  envelope/                  the four envelope PNGs
  images/                    client photos
```
