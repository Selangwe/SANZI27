# Animated Wedding Invitation

A mobile-first, single-page wedding invitation for Sandra & Arnold (SANZI27),
across five days in Bafoussam and Limbe, Cameroon. It opens with a layered
envelope, then scrolls through the cover, families, invitation, story,
countdown, celebrations, programmes, the guests' photo gallery, RSVP, gifts &
contributions and the footer.

Two further sections — wedding party and FAQ — are built but hidden until their
content arrives. Switch them on in `sections` at the top of
`src/content/wedding.ts`.

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

### Colours

**Black, white and sage green** — the three colours the dress code asks guests
for. White carries the surfaces, black the type and the solid buttons, sage
every accent, ornament and rule. Every colour comes from a token in the
`@theme` block at the top of `globals.css`, so changing one there re-themes the
whole site — `ink` is the near-black used for headings, `gold` the deep sage on
eyebrows and ornaments, `cocoa` the black button fill, `sand` the borders.

The token names are historical, from an earlier cream-and-gold palette: `gold`
now holds sage and `cocoa` near-black. They were kept because nineteen files
reference them; the mapping is written out in the comment above the tokens.

**Before changing a text token, check its contrast.** `taupe`, `stone` and
`gold` are used for small labels and are kept at WCAG AA (4.5:1) against
`cream`, `ivory` and `linen`.

**The one place gold survives** is the envelope and the acrylic invitation card
(`.foil`, `.acrylic`, `.ic-*` in `globals.css`, plus the `envelope/` and
`suite/` components). Those hexes are deliberately outside the palette, so the
opening stays gold-on-black. The dress-code swatches in `wedding.ts` are real
garment colours and are likewise not tokens.

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

The guests' photo gallery needs no files here — those photos are uploaded by
guests and served from Cloudinary (see below). To add or remove wedding party
members, edit the array in `wedding.ts`; the layout adapts to the count.

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

## Wedding programmes

The running orders are a horizontal canvas of cards, not a vertical timeline.
The track is wider than the screen on purpose: the next card is cut off at the
edge and fades out there, so it reads as "swipe for more". Dots and, on
desktop, arrows sit underneath.

Edit `programme.groups` in `wedding.ts`. **One group is one card**, and a group
with two parts is a single card split by an inset divider — that is how Civil
and Traditional share the Bafoussam day in the couple's sketch. On phones a
two-part group dissolves and each part becomes its own slide. The dots count
cards, not parts, so the four programmes show as three dots.

```ts
{
  id: "limbe",
  parts: [{
    title: "Church Wedding",
    date: "Saturday, 20 February 2027",
    place: "Limbe, Cameroon",
    note: { label: "…", detail: "…" },   // optional, sits above the running order
    itemsLabel: "Wedding Day Programme", // optional heading for the list
    items: [{ time: "10:30 AM – 12:30 PM", label: "Church Service", icon: "church" }],
  }],
}
```

`time` is optional — **leave it off rather than inventing an hour.** The label
then centres against its icon instead of hanging under an empty slot, which is
how the BBQ card reads while its times are unconfirmed. Pair that with `note`
to say when the times will be known.

To use a new icon, add its name to the `icon` union in the `ProgrammePart` type
(same file) and map it to a [Phosphor](https://phosphoricons.com) icon in
`ICONS` at the top of `src/components/sections/Programme.tsx`. TypeScript will
point at the map if you forget.

---

## Where to stay (`/stay`)

A separate page lists hotels near each set of celebrations (Bafoussam on 16
February; Limbe/Bota on 20–21 February). Edit the list in `lodging` in
`wedding.ts`. Each hotel is pinned on an embedded Google map by its
`mapsQuery` (Google finds it by name, so no coordinates or API key are
needed); tapping a hotel moves the pin, and the arrow button opens directions.
The page is linked from the Celebrations section and the footer. Coming back
to the invitation from it skips the envelope for the rest of that visit.

## RSVP, contributions and the photo gallery

**RSVP replies go to WhatsApp.** Submitting the form opens WhatsApp with the
guest's reply already written (name, accept/decline, number of guests, dietary
needs, email and note), addressed to `rsvp.whatsapp` in `wedding.ts`
(currently +44 7729 468739). The guest only has to press send. To change the
number, edit `rsvp.whatsapp` (international format, digits only).

Each RSVP is also sent to the server in the background: it is logged
(Vercel → Project → **Logs**) and forwarded as JSON to a webhook, if you set one:

```bash
RSVP_WEBHOOK_URL=   # e.g. a Google Apps Script web app that appends to a Sheet
```

Set this in Vercel → Project → Settings → Environment Variables (see `.env.example`).

### Gifts & contributions

No registry and no payment page. The guest picks an amount (or types their own)
and **Send on WhatsApp** opens a message with that amount written out, to the
same number as the RSVP — the couple reply with however they would like to
receive it, so no account details sit on a public page. Edit the amounts,
currency and wording in `gifts` in `wedding.ts`; both the RSVP and this card
build their links with `waLink()` in `src/lib/whatsapp.ts`.

### Guests' photo gallery

Guests tap the camera, pick photos, and everyone sees them: five at a time in a
bordered strip, swipe or use the arrows for the rest, tap one to open it full
size. Photos live on **Cloudinary's free tier**, and the browser uploads
straight to an *unsigned* upload preset, so no secret key ships with the site.

To switch it on, fill in `gallery.cloudName` and `gallery.uploadPreset` in
`wedding.ts`:

1. Make a free account at [cloudinary.com](https://cloudinary.com) and copy the
   **Cloud name** from the dashboard.
2. **Settings → Upload → Add upload preset**, set *Signing mode* to
   **Unsigned**, and copy the preset name.
3. **Settings → Security →** tick **Resource list**, which lets the site read
   the list of photos carrying `gallery.tag`.

Until both values are filled in, the section shows its empty state and says so,
rather than failing silently. Photos are not moderated — anything a guest adds
appears at once, and anything unwanted is deleted from the Cloudinary dashboard
(Media Library → the `sanzi27-guests` tag).

Each guest's own uploads are also kept in their browser's `localStorage` and
shown straight away, because Cloudinary's tag listing is CDN cached for about a
minute. Photos are shrunk to 2000px on the longest side before they leave the
phone, and anything over `gallery.maxFileMb` or not an image is refused with a
message.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project**, import the repo and keep the
   defaults (Next.js is detected automatically).
3. Optional: add `RSVP_WEBHOOK_URL`, and `NEXT_PUBLIC_SITE_URL` only if the
   canonical host differs from the one in `src/lib/site.ts`.
4. Deploy.

The site is live at **https://www.sanzi27.uk**. Vercel 308-redirects the bare
`sanzi27.uk` to the `www` host, which is why `src/lib/site.ts` names the `www`
address: the sitemap, the canonical tag and the link-preview URLs all come from
there, and naming the apex would point them at URLs that redirect. If the
primary domain is ever changed in Vercel, change that one file to match.

`/calendar.ics` is generated at build time from the event start and end in
`wedding.ts`. The **Add to Calendar** button links to it, and phones open it
directly in their calendar app. A Google Calendar link is also shown.

---

## Search engines

| Route             | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `/sitemap.xml`    | The invitation and `/stay`, from `src/app/sitemap.ts`                 |
| `/robots.txt`     | Allows crawling, hides `/api/`, points at the sitemap                 |
| `/opengraph-image`| The 1200×630 preview card shown when the link is shared on WhatsApp   |

To submit the sitemap in **Google Search Console**: pick the
`https://www.sanzi27.uk` property (or a DNS-verified *Domain* property, which
covers both hosts), open **Sitemaps**, and type `sitemap.xml` — the field is a
path, so pasting the full URL is rejected as "submit a valid path to a sitemap
on my site". The same error appears when the sitemap simply isn't deployed yet,
so check `https://www.sanzi27.uk/sitemap.xml` returns XML first.

**To keep a deployment out of search** — a preview, or the whole site if the
couple would rather it stayed unlisted — set `NEXT_PUBLIC_NOINDEX=1`. Every page
then carries `noindex, nofollow` and `robots.txt` disallows everything.

Adding a page means adding a line to `src/app/sitemap.ts`; `lastModified` is the
build time, so redeploying tells Google the pages were touched.

---

## Project structure

```
src/
  app/
    layout.tsx               fonts, metadata
    page.tsx                 renders <InvitationExperience/>
    globals.css              design tokens, base styles, typeset card
    sitemap.ts               /sitemap.xml
    robots.ts                /robots.txt
    opengraph-image.tsx      link-preview card
    calendar.ics/route.ts    .ics download
    api/rsvp/route.ts
    api/gallery/route.ts     lists the guests' photos from Cloudinary
  content/wedding.ts         ← ALL content lives here
  components/
    InvitationExperience.tsx intro → scroll unlock → sections
    envelope/                EnvelopeIntro, layer loader, SVG stand-ins, card face
    sections/                one file per section
    ui/                      ImageSlot, Reveal, SectionHeading, CopyButton…
  lib/                       calendar, webhook, storage, whatsapp, cloudinary helpers
public/
  envelope/                  the four envelope PNGs
  images/                    client photos
```
