/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING CONTENT — the single file to edit when the client sends details.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every name, date, paragraph, link and image path on the site lives here.
 *  Everything below is PLACEHOLDER content.
 *
 *  Images: drop files into /public at the paths listed below (or change the
 *  paths). Any image that is missing renders as a labeled placeholder slot,
 *  so the site always looks finished while you wait for the real files.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ImageAsset = {
  /** Path inside /public, e.g. "/images/cover.jpg" */
  src: string;
  /** Alt text for screen readers */
  alt: string;
  /** Label shown on the placeholder slot while the file is missing */
  label: string;
};

export const wedding = {
  /* ── The couple ─────────────────────────────────────────────────────────── */
  couple: {
    partnerOne: {
      firstName: "Eleanor",
      fullName: "Eleanor Grace Whitmore",
      parents: "Mr. & Mrs. Robert Whitmore",
      relation: "Daughter of",
    },
    partnerTwo: {
      firstName: "James",
      fullName: "James Alexander Hart",
      parents: "Mr. & Mrs. William Hart",
      relation: "Son of",
    },
    /** Used on the wax-seal fallback and footer */
    monogram: "E & J",
    hashtag: "#EleanorAndJames",
  },

  /* ── The day ────────────────────────────────────────────────────────────── */
  event: {
    /** Calendar date (YYYY-MM-DD) — highlighted on the countdown calendar */
    date: "2027-06-12",
    /** Exact start/end with the venue's UTC offset — drives the countdown + calendar file */
    start: "2027-06-12T15:00:00+02:00",
    end: "2027-06-12T23:30:00+02:00",
    /** Display strings (written out so you control the exact wording) */
    displayDate: "Saturday, June 12, 2027",
    displayDateFormal: "Saturday, the twelfth of June",
    displayYearFormal: "Two thousand and twenty-seven",
    displayTime: "3:00 in the afternoon",
    shortDate: "06 · 12 · 2027",
    calendarTitle: "Eleanor & James — Wedding",
  },

  /* ── Venue ──────────────────────────────────────────────────────────────── */
  venue: {
    name: "The Glasshouse Estate",
    addressLines: ["128 Orchard Lane", "Stellenbosch, 7600", "South Africa"],
    /** Any maps link works (Google Maps, Apple Maps, what3words…) */
    mapsUrl: "https://maps.google.com/?q=The+Glasshouse+Estate",
    directionsNote:
      "Parking is available on site. Follow the lantern-lit drive past the vineyard gates.",
    rideshare: {
      provider: "Uber",
      code: "ELEANORJAMES27",
      note: "Use this voucher for a complimentary ride to and from the celebration (up to R250 each way).",
    },
  },

  /* ── Envelope intro ─────────────────────────────────────────────────────── */
  envelope: {
    /** Small line shown above the envelope before it is opened */
    eyebrow: "You are cordially invited",
    tapHint: "Tap to open",
    /**
     * Transparent PNG layers. Export all four from the same artboard so they
     * line up — see README.md → "Envelope PNGs" for exact sizes.
     */
    images: {
      body: "/envelope/envelope-body.png",
      flap: "/envelope/envelope-flap.png",
      seal: "/envelope/wax-seal.png",
      card: "/envelope/invitation-card.png",
    },
  },

  /* ── 1. Cinematic cover ─────────────────────────────────────────────────── */
  cover: {
    image: {
      src: "/images/cover.jpg",
      alt: "Eleanor and James",
      label: "Cover photo — full-bleed couple shot",
    } satisfies ImageAsset,
    tagline: "are getting married",
  },

  /* ── 2. With our families ───────────────────────────────────────────────── */
  families: {
    eyebrow: "With our families",
    intro: "Together with their families",
    image: {
      src: "/images/families.jpg",
      alt: "Eleanor and James together",
      label: "Families section — couple photo",
    } satisfies ImageAsset,
  },

  /* ── 3. Invitation text ─────────────────────────────────────────────────── */
  invitation: {
    eyebrow: "The invitation",
    heading: "Join us",
    body: [
      "With full hearts and the blessing of our families, we joyfully invite you to celebrate the beginning of our forever.",
      "Please join us as we exchange vows on {date} at {time}, at {venue}, followed by dinner, dancing and a long evening under the stars.",
      "Your presence would be the greatest gift of all.",
    ],
  },

  /* ── 4. Their story ─────────────────────────────────────────────────────── */
  story: {
    eyebrow: "Our story",
    heading: "How we met",
    image: {
      src: "/images/story.jpg",
      alt: "Eleanor and James in the early days",
      label: "Their Story photo",
    } satisfies ImageAsset,
    paragraphs: [
      "It started with a borrowed umbrella on a rainy Tuesday in Cape Town — James insisted, Eleanor refused, and they ended up sharing it for six city blocks and two cups of coffee.",
      "Weekend markets became long road trips; long road trips became a shared bookshelf, a slightly overwatered fern, and a dog named Biscuit.",
      "On a quiet morning on the beach where they spent their first holiday, James finally asked the question. Eleanor said yes before he could finish it.",
    ],
    milestones: [
      { year: "2019", label: "First met" },
      { year: "2021", label: "First home" },
      { year: "2026", label: "Engaged" },
    ],
  },

  /* ── 5. Countdown ───────────────────────────────────────────────────────── */
  countdown: {
    eyebrow: "Save the date",
    heading: "Counting down",
    addToCalendarLabel: "Add to Calendar",
  },

  /* ── 6. Wedding party ───────────────────────────────────────────────────── */
  weddingParty: {
    eyebrow: "The wedding party",
    heading: "Standing beside us",
    members: [
      {
        name: "Sophie Laurent",
        role: "Maid of Honour",
        bio: "Eleanor's best friend since Grade 1 and keeper of every embarrassing story.",
        image: { src: "/images/party/member-1.jpg", alt: "Sophie Laurent", label: "Party member 1 photo" },
      },
      {
        name: "Daniel Okafor",
        role: "Best Man",
        bio: "James's university roommate, travel partner and self-appointed speech writer.",
        image: { src: "/images/party/member-2.jpg", alt: "Daniel Okafor", label: "Party member 2 photo" },
      },
      {
        name: "Clara Whitmore",
        role: "Bridesmaid",
        bio: "Eleanor's younger sister — the family's resident baker and dance-floor starter.",
        image: { src: "/images/party/member-3.jpg", alt: "Clara Whitmore", label: "Party member 3 photo" },
      },
      {
        name: "Thomas Hart",
        role: "Groomsman",
        bio: "James's older brother, who has been giving him unsolicited advice for 30 years.",
        image: { src: "/images/party/member-4.jpg", alt: "Thomas Hart", label: "Party member 4 photo" },
      },
      {
        name: "Naledi Dube",
        role: "Bridesmaid",
        bio: "Colleague turned confidante, and the reason the couple ever went on a second date.",
        image: { src: "/images/party/member-5.jpg", alt: "Naledi Dube", label: "Party member 5 photo" },
      },
      {
        name: "Marcus Bell",
        role: "Groomsman",
        bio: "Childhood neighbour, five-a-side teammate and James's go-to adventure buddy.",
        image: { src: "/images/party/member-6.jpg", alt: "Marcus Bell", label: "Party member 6 photo" },
      },
    ] satisfies { name: string; role: string; bio: string; image: ImageAsset }[],
  },

  /* ── 7. RSVP ────────────────────────────────────────────────────────────── */
  rsvp: {
    eyebrow: "Kindly reply",
    heading: "Will you join us?",
    replyBy: "Kindly respond by April 30, 2027",
    acceptLabel: "Joyfully Accepts",
    declineLabel: "Regretfully Declines",
    /** Max number of guests a single reply can include (incl. the guest) */
    maxGuests: 4,
    thankYouAccept: "We can't wait to celebrate with you!",
    thankYouDecline: "You'll be dearly missed. Thank you for letting us know.",
  },

  /* ── 8. Venue ───────────────────────────────────────────────────────────── */
  venueSection: {
    eyebrow: "The venue",
    heading: "Where to find us",
    mapsLabel: "Open in Maps",
  },

  /* ── 9. Gifts ───────────────────────────────────────────────────────────── */
  gifts: {
    eyebrow: "Gifts",
    heading: "With gratitude",
    intro:
      "Your love and presence are more than enough. For those who have asked, we've put together a small registry and a fund for our honeymoon.",
    /** Prices are shown as e.g. "R2,400" */
    currency: { symbol: "R", thousandsSeparator: "," },
    registry: [
      {
        id: "dinner-set",
        name: "Stoneware Dinner Set",
        price: 2400,
        /** Optional store link — opens alongside the claim */
        url: "",
        /** Set true once a guest has claimed it (shared with everyone) */
        claimed: false,
        image: { src: "/images/registry/item-1.jpg", alt: "Stoneware dinner set", label: "Registry item 1 image" },
      },
      {
        id: "linen-set",
        name: "Belgian Linen Bedding",
        price: 3200,
        url: "",
        claimed: false,
        image: { src: "/images/registry/item-2.jpg", alt: "Linen bedding", label: "Registry item 2 image" },
      },
      {
        id: "espresso",
        name: "Espresso Machine",
        price: 5800,
        url: "",
        claimed: false,
        image: { src: "/images/registry/item-3.jpg", alt: "Espresso machine", label: "Registry item 3 image" },
      },
      {
        id: "glassware",
        name: "Crystal Glassware",
        price: 1600,
        url: "",
        claimed: true,
        image: { src: "/images/registry/item-4.jpg", alt: "Crystal glassware", label: "Registry item 4 image" },
      },
    ] satisfies {
      id: string;
      name: string;
      price: number;
      url: string;
      claimed: boolean;
      image: ImageAsset;
    }[],
    honeymoon: {
      heading: "Honeymoon Fund",
      description: "Help us toast to forever on the Amalfi Coast — a sunset dinner, a boat day, a few too many gelatos.",
      goal: 60000,
      raised: 23500,
      presets: [250, 500, 1000, 2500],
      /** "{amount}" is replaced with the chosen amount. Leave "" to hide the button. */
      paymentUrlTemplate: "https://www.paypal.com/paypalme/yourhandle/{amount}",
      contributeLabel: "Contribute",
    },
  },

  /* ── 10. FAQ ────────────────────────────────────────────────────────────── */
  faq: {
    eyebrow: "Good to know",
    heading: "Questions & answers",
    items: [
      {
        q: "What is the dress code?",
        a: "Black tie optional. Think floor-length gowns, cocktail dresses, suits or tuxedos in soft, neutral tones.",
      },
      {
        q: "Are children welcome?",
        a: "We love your little ones, but our celebration will be adults-only. Thank you for understanding.",
      },
      {
        q: "What will the weather be like?",
        a: "June evenings in the Winelands can be cool — around 10–16°C. The ceremony is outdoors, so bring a wrap or jacket.",
      },
      {
        q: "What footwear should I wear?",
        a: "The ceremony is on the lawn, so we recommend block heels, wedges or flats. Heel protectors will be available.",
      },
      {
        q: "Is there parking?",
        a: "Yes — complimentary parking is available on site. We also recommend using the rideshare voucher in the Venue section.",
      },
      {
        q: "Can you accommodate dietary needs?",
        a: "Absolutely. Please let us know about any allergies or dietary requirements in your RSVP and we'll take care of you.",
      },
    ],
  },

  /* ── Footer ─────────────────────────────────────────────────────────────── */
  footer: {
    closing: "With love,",
  },
};

export type Wedding = typeof wedding;
