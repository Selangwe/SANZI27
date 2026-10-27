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

The intro is a black envelope sealed with a gold mirror-acrylic crest (the
couple's initials, `couple.monogramLetters`, inside a filigree frame), after
the black tri-fold acrylic suite reference. It is built from separate layers:

```
z40  noir-crest.png         gold crest on the flap's point
z30  noir-flap.png          the black V flap, hinged on its top edge
z20  noir-body.png          the envelope's front (pocket folds)
z15  card (code)            the invitation card, tucked inside
z10  inside panel (CSS)     the envelope's inside, seen once the flap opens
```

Each layer is drawn in code until a PNG with that name exists in
`public/envelope/`; see `public/envelope/README.md` for the shapes. The earlier
kraft "From the Sanzi" artwork is still in that folder but is no longer used.

The invitation card is laid out in code. `card.style` in `wedding.ts` picks one
of two faces:

- **`acrylic`** (default, `suite/AcrylicCard.tsx`): smoked clear acrylic with
  gold-foil type and a gold filigree crest around the couple's initials
  (`couple.monogramLetters`, "SZ" to match the wax seal). It follows the black
  tri-fold acrylic suite reference: parents, request lines, names in script
  (`inviteName`), the date written out, venue in script, then the address.
  Wording is in `card.acrylic`. To use real crest artwork, drop a transparent
  PNG (about 10:7) at `public/invitation/crest.png`.
- **`paper`** (`InvitationCardFace.tsx`): torn deckle-edged paper, a twine bow
  and a dried-flower sprig, with wording from the rest of `card`.

On phones either card stretches to fill almost the whole screen.

To change the envelope's proportions, edit the `ART`, `BODY`, `FLAP`, `CREST`
and `CARD` constants at the top of `src/components/envelope/EnvelopeIntro.tsx`.

**Opening sequence** (`EnvelopeIntro.tsx`, `open()`) is one continuous timeline,
about 3 seconds from tap to page. Each step starts while the previous one is
still moving and nothing changes direction, so it reads as a single gesture:

1. 0.0 s: the crest glints and, in the same motion, lifts away and fades.
2. 0.2 s: the flap swings toward the viewer on its top hinge (`rotateX`
   0 → 180° in a `perspective` container) and drops behind the card halfway.
3. 0.6 s: the card rises out of the pocket while the envelope sinks just
   enough that the card arrives at the centre of the screen.
4. 1.55 s: while the card is still gliding, a pre-mounted full-screen copy
   takes its exact place and grows outward from the centre, tilting toward
   the light as a glare sweeps across the acrylic. The envelope falls away
   and the room dims at the same time.
5. About 3 s: the page underneath, showing the identical card, cross-fades in
   and scrolling unlocks.

When the guest's device asks for reduced motion, the tilt and glare are
skipped and the rest plays at well under half the duration.

---

## Where to stay (`/stay`)

A separate page lists hotels near each set of celebrations (Bafoussam on 16
February; Limbe/Bota on 20–21 February). Edit the list in `lodging` in
`wedding.ts`. Each hotel is pinned on an embedded Google map by its
`mapsQuery` (Google finds it by name, so no coordinates or API key are
needed); tapping a hotel moves the pin, and the arrow button opens directions.
The page is linked from the Celebrations section and the footer. Coming back
to the invitation from it skips the envelope for the rest of that visit.

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
