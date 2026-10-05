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
| `party/member-1.jpg` … `member-6.jpg`    | 6 · Wedding Party (circle)   | 1:1, face centred |
| `registry/item-1.jpg` … `item-4.jpg`     | 9 · Gifts registry           | 1:1              |

To add or remove wedding party members or registry items, edit the arrays in
`wedding.ts`. The layout adapts to the count.

### Envelope (`public/envelope/`)

The intro is built from separate transparent layers, all cut from the client's
closed-envelope artwork (612 × 407) so they line up exactly:

```
z40  wax-seal.png           sits on the flap's point
z35  envelope-flowers.png   top-left bouquet, lying on the envelope
z30  envelope-flap.png      the V flap ("From the Sanzi"), hinged on its top edge
z20  envelope-pocket.png    the envelope with the flap cut away (bottom bouquet, 2027)
z15  card (code)            the invitation card, tucked inside
z10  inside panel (CSS)     the envelope's inside, seen once the flap opens
```

`card-paper.png` is the card's deckle-edged paper (with its shadow) and
`paper-grain.png` a small grain tile. Both are pre-rendered so nothing heavy is
drawn live while the envelope animates.

The invitation card is laid out in code (`InvitationCardFace.tsx`): torn paper,
twine bow and a dried-flower sprig. Its wording comes from `card` in
`wedding.ts`. On phones it stretches to fill almost the whole screen.

If the envelope artwork changes, re-cut the layers and update the `BODY`,
`FLAP`, `SEAL` and `FLAP_OUTLINE` constants (artwork pixels) at the top of
`src/components/envelope/EnvelopeIntro.tsx`.

**Opening sequence** (`EnvelopeIntro.tsx`, `open()`), with the steps overlapping
so it flows (about 2.5 s in all):

1. The seal lifts, scales to 1.15 and fades (0.45 s).
2. 0.3 s in, the flap rotates `rotateX 0 → 180°` about its top edge inside a
   `perspective: 1400px` container (0.8 s), swinging toward the viewer and
   folding back point-up. Edge-on it drops behind the card.
3. Before the flap has settled, the card slides up out of the pocket while the
   envelope sinks (0.95 s).
4. The card grows to fill the screen (0.85 s; almost edge to edge on phones).
   Scrolling then unlocks and the page continues below it.
When the guest's device asks for reduced motion, the same sequence plays at
well under half the duration.

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
