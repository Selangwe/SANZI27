/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING CONTENT — the single file to edit when the client sends details.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every name, date, paragraph, link and image path on the site lives here.
 *  Couple, dates, events, dress codes, programme and story are the real
 *  details; the wedding party, gifts and FAQ are still placeholders and are
 *  hidden (see `sections`).
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
  /* ── Which sections are shown ───────────────────────────────────────────── */
  /** Sections still waiting on real content stay hidden until switched on. */
  sections: {
    weddingParty: false,
    gifts: false,
    faq: false,
  },

  /* ── The couple ─────────────────────────────────────────────────────────── */
  couple: {
    partnerOne: {
      firstName: "Sandra",
      /** Full name (add the surname when ready); hidden where it would repeat the first name */
      fullName: "Sandra",
      /** Name as printed on the acrylic card */
      inviteName: "Sandra",
      /** e.g. "Mr. & Mrs. …"; leave "" to hide */
      parents: "",
      relation: "Daughter of",
    },
    partnerTwo: {
      firstName: "Arnold",
      fullName: "Arnold",
      inviteName: "Arnold",
      parents: "",
      relation: "Son of",
    },
    /** The wedding's name */
    weddingName: "SANZI27",
    tagline: "Two Hearts, One Love, One Beautiful Journey",
    /** Used on the wax-seal fallback */
    monogram: "S & A",
    /** Initials inside the gold crest (envelope seal and card) */
    monogramLetters: "SZ",
    hashtag: "#SANZI27",
  },

  /* ── The dates ──────────────────────────────────────────────────────────── */
  event: {
    /** Every celebration day (YYYY-MM-DD), circled on the countdown calendar */
    dates: ["2027-02-16", "2027-02-20", "2027-02-21"],
    /** The countdown runs to the first ceremony (Cameroon is UTC+1) */
    start: "2027-02-16T13:30:00+01:00",
    /** Display strings (written out so you control the exact wording) */
    displayDate: "16 to 21 February 2027",
    shortDate: "16 to 21 February 2027",
    calendarTitle: "Sandra & Arnold (SANZI27)",
  },

  /* ── Where ──────────────────────────────────────────────────────────────── */
  venue: {
    name: "Bafoussam & Limbe",
    addressLines: ["Cameroon"],
  },

  /* ── Envelope intro ─────────────────────────────────────────────────────── */
  envelope: {
    /** Small line shown above the envelope before it is opened */
    eyebrow: "You are cordially invited",
    tapHint: "Tap to open",
    /**
     * Optional transparent PNGs for the black envelope. Until a file exists,
     * that layer is drawn in code. See public/envelope/README.md for sizes.
     */
    images: {
      body: "/envelope/noir-body.png",
      flap: "/envelope/noir-flap.png",
      seal: "/envelope/noir-crest.png",
    },
  },

  /* ── The invitation card inside the envelope ────────────────────────────── */
  card: {
    /**
     * "acrylic" — smoked clear acrylic with gold-foil type and a gold crest,
     *             after the black tri-fold acrylic suite reference
     * "paper"   — deckle-edged paper with twine and dried gypsophila
     */
    style: "acrylic" as "acrylic" | "paper",

    /** Wording for the acrylic card, top to bottom */
    acrylic: {
      hostLines: ["Together with their families"],
      request: ["request the honour of your presence", "at the wedding of"],
      and: "and",
      dateLines: ["The sixteenth to the twenty-first of February", "Two thousand and twenty-seven"],
      /** Shown in script */
      place: "Bafoussam & Limbe",
      placeLines: ["Cameroon"],
      signature: "SANZI27",
      /** Optional crest artwork (transparent PNG, about 10:7); a drawn gold crest is used until it exists */
      crestImage: "/invitation/crest.png",
    },

    /* Wording for the paper card */
    /** Optional opening line; leave quote "" to hide it */
    quote: "",
    quoteCite: "",
    request: "Request the honour of your presence at their wedding celebrations",
    weekday: "Tuesday",
    day: "16",
    month: "February",
    year: "2027",
    time: "1:30 PM",
    signOff: "With love",
    closing: "Two Hearts, One Love, One Beautiful Journey",
  },

  /* ── 1. Cinematic cover ─────────────────────────────────────────────────── */
  cover: {
    image: {
      src: "/images/cover.jpg",
      alt: "Sandra and Arnold",
      label: "Cover photo, full-bleed couple shot",
    } satisfies ImageAsset,
    tagline: "are getting married",
  },

  /* ── 2. With our families ───────────────────────────────────────────────── */
  families: {
    title: "With our families",
    intro: "Together with their families",
    image: {
      src: "/images/families.jpg",
      alt: "Sandra and Arnold together",
      label: "Families section couple photo",
    } satisfies ImageAsset,
  },

  /* ── 3. Invitation text ─────────────────────────────────────────────────── */
  invitation: {
    heading: "Join us",
    body: [
      "Two hearts, one love, one beautiful journey.",
      "Celebrate with us in {venue}, Cameroon, from {date}.",
    ],
  },

  /* ── 4. Our story, in chapters ──────────────────────────────────────────── */
  story: {
    heading: "Our Journey",
    chapters: [
      {
        title: "Our Story",
        image: { src: "/images/story-1.jpg", alt: "Sandra and Arnold", label: "Our Story photo" },
        paragraphs: [
          "It began simply — a hello that turned into hours of talking, a connection that felt like coming home.",
          "We didn’t know then that a chance conversation would become the start of everything. We laughed, we shared dreams, and slowly, beautifully, we became each other’s favourite story.",
          "Through easy days and quiet, gentle ones, through moments that made us smile and times that tested us so hard — we chose each other. We learned that love isn’t just about the perfect moments; it’s about showing up, listening, and holding on, hand in hand.",
          "We’ve grown together, cheered each other on, and built a friendship that turned into a love deeper than we ever imagined. And now, after every step, every laugh, and every quiet promise — we are ready to begin our greatest adventure yet: life together, forever.",
          "Many of you have been part of our journey, and we would be so honoured to have you witness the day we finally say I do.",
        ],
      },
      {
        title: "The Proposal",
        image: { src: "/images/story-2.jpg", alt: "The proposal on the Thames", label: "The Proposal photo" },
        paragraphs: [
          "Then came that magical day, gliding along the Thames beneath London’s skyline. As we sailed past, the London Eye stood tall and radiant beside us — and just as its great wheel turned open and wide, as if unfolding to welcome our new chapter — London Bridge itself lifted before us, making way for our future.",
          "In that breath-taking moment, with the city glowing all around us, the gentle notes of a pianist filling the air, and our dearest friends cheering with happy tears — he got down on one knee. Beneath the turning Eye, beneath the opening bridge, he asked me to be his wife.",
          "It felt as though the whole city had paused just for us: the wheel turning, the bridge rising, the music playing, and the man I love asking to share every sunrise and every adventure for the rest of our lives.",
          "He slipped a beautiful gold ring upon my finger: charming, warm, full of promise, and a treasure in every way — a little ring of fortunes, marking the beginning of everything. And with all my heart, I said yes.",
          "That moment wasn’t just a proposal — it was the world smiling on us. A promise that as the wheel turns and the seasons change, we will walk through every chapter together, hand in hand.",
          "Now we are ready to begin our greatest adventure yet. It would mean everything to have you there to witness us say I do, and to celebrate the beautiful life we are about to build.",
        ],
      },
      {
        title: "How He Changed My Engagement Ring",
        image: { src: "/images/story-3.jpg", alt: "The two rings", label: "The Rings photo" },
        paragraphs: [
          "As we stepped into planning our wedding, my heart began to dream of something more — something bright and new, fitting for the fresh, beautiful life we were about to build together. Like a bride stepping into her forever, I found myself longing for a ring as radiant as the love we had grown into.",
          "And so, he gave me the most wonderful surprise: a new ring, breathtaking beyond anything I could have imagined. Diamonds catching the light like stars fallen to earth — sparkling, brilliant, enchanting — the most beautiful ring my eyes had ever beheld.",
          "It is more than a change of gold for diamonds. It is our story, in two precious circles: the first marking how our love began, full of hope and fortune; the second shining bright with all we have become — deeper, stronger, more dazzling than we ever dreamed. One represents our beautiful start; the other, our endless, brilliant future.",
          "Two rings, one love — and a lifetime ahead to make every moment glow as brightly as the diamonds upon my hand.",
          "Now, we are ready to become husband and wife. It would mean the world to have you by our side as we say I do, and celebrate the forever we are writing, together.",
        ],
      },
      {
        title: "The Next Chapter",
        image: { src: "/images/story-4.jpg", alt: "Sandra and Arnold, hand in hand", label: "The Next Chapter photo" },
        paragraphs: [
          "And now, this is our next chapter — the one we have been dreaming of.",
          "Hand in hand, we stand at the threshold of our forever. We have laughed, we have hoped, we have chosen each other again and again — and now we are ready to vow our lives as one. Not just for the magical moments, but for all the days ahead: waking side by side, building our dreams, sharing kindness, and watching our love grow stronger with every passing year.",
          "We don’t know exactly what the years will bring — but we know who we will walk them with. And that makes every step perfect.",
          "We would be so honoured to have you beside us as we say I do — to witness this moment, to share our joy, and to celebrate the beautiful, brilliant life we are about to begin.",
        ],
      },
    ] satisfies { title: string; image: ImageAsset; paragraphs: string[] }[],
  },

  /* ── 5. Countdown ───────────────────────────────────────────────────────── */
  countdown: {
    heading: "Save the dates",
    addToCalendarLabel: "Add all to Calendar",
  },

  /* ── 6. The celebrations: where, when, colours and dress code ───────────── */
  celebrations: {
    heading: "The celebrations",
    mapsLabel: "Open in Maps",
    cities: [
      {
        city: "Bafoussam",
        days: [
          {
            date: "2027-02-16",
            label: "Tuesday, 16 February 2027",
            events: [
              {
                id: "court",
                name: "Court Wedding",
                venue: "Bafoussam Urban Council",
                time: "1:30 PM",
                /** For the calendar file; leave "" for an all-day entry */
                start: "2027-02-16T13:30:00+01:00",
                end: "2027-02-16T16:30:00+01:00",
                mapsQuery: "Bafoussam Urban Council, Bafoussam, Cameroon",
                colours: "80% black and 20% a touch of sage green",
                swatches: [
                  { name: "Black", hex: "#141414", share: 80 },
                  { name: "Sage green", hex: "#9caf88", share: 20 },
                ],
                dressCode: "Executive wear (suits with skirts, gowns or trousers)",
              },
              {
                id: "traditional",
                name: "Traditional Wedding",
                venue: "Urban Council Hall, opposite Finance",
                time: "6:30 PM",
                start: "2027-02-16T18:30:00+01:00",
                end: "2027-02-16T23:59:00+01:00",
                mapsQuery: "Urban Council Hall, Bafoussam, Cameroon",
                colours: "Toghu and Ndup (Bamenda and Bangwa)",
                swatches: [
                  { name: "Toghu", hex: "#1b1b1b", accent: ["#c8102e", "#f2c200", "#1f7a3a"] },
                  { name: "Ndup", hex: "#22325f", accent: ["#f4f1ea"] },
                ],
                dressCode: "All traditional wears represented",
              },
            ],
          },
        ],
      },
      {
        city: "Limbe",
        days: [
          {
            date: "2027-02-20",
            label: "Saturday, 20 February 2027",
            events: [
              {
                id: "church",
                name: "Seaside Church Wedding",
                venue: "SS Club, Bota",
                time: "",
                start: "",
                end: "",
                mapsQuery: "SS Club, Bota, Limbe, Cameroon",
                colours: "80% all shades of white (except pure white) and 20% sage green",
                swatches: [
                  { name: "Ivory", hex: "#f3ecdc", share: 30 },
                  { name: "Champagne", hex: "#e8d9b8", share: 25 },
                  { name: "Pearl", hex: "#ebe6dc", share: 25 },
                  { name: "Sage green", hex: "#9caf88", share: 20 },
                ],
                dressCode: "Royal Ascot",
              },
              {
                id: "reception",
                name: "Main Reception",
                venue: "ACE Events Center, Bota",
                time: "",
                start: "",
                end: "",
                mapsQuery: "ACE Events Center, Bota, Limbe, Cameroon",
                colours: "All shades of white",
                swatches: [
                  { name: "Ivory", hex: "#f3ecdc" },
                  { name: "Champagne", hex: "#e8d9b8" },
                  { name: "Pearl", hex: "#ebe6dc" },
                  { name: "White", hex: "#fbfaf7" },
                ],
                dressCode: "Classy bougie",
              },
            ],
          },
          {
            date: "2027-02-21",
            label: "Sunday, 21 February 2027",
            events: [
              {
                id: "bbq",
                name: "BBQ & Live Bang Music",
                venue: "Sokoto Aminatou Square",
                time: "",
                start: "",
                end: "",
                mapsQuery: "Sokoto Aminatou Square, Limbe, Cameroon",
                colours: "All white party",
                swatches: [{ name: "White", hex: "#fbfaf7" }],
                dressCode: "Dress to impress",
              },
            ],
          },
        ],
      },
    ] satisfies {
      city: string;
      days: {
        date: string;
        label: string;
        events: {
          id: string;
          name: string;
          venue: string;
          time: string;
          start: string;
          end: string;
          mapsQuery: string;
          colours: string;
          swatches: { name: string; hex: string; share?: number; accent?: string[] }[];
          dressCode: string;
        }[];
      }[];
    }[],
  },

  /* ── 7. Day programme ───────────────────────────────────────────────────── */
  programme: {
    heading: "Wedding programme",
    subheading: "Civil & Traditional Wedding",
    date: "Tuesday, 16 February 2027",
    place: "Bafoussam, Cameroon",
    parts: [
      {
        title: "Civil Wedding",
        items: [
          { time: "1:30 PM – 2:30 PM", label: "Court Wedding Ceremony", icon: "court" },
          { time: "2:30 PM – 3:30 PM", label: "Wedding Picture Session", icon: "camera" },
          { time: "3:30 PM – 4:30 PM", label: "Light Reception & Refreshments", icon: "toast" },
          { time: "4:30 PM – 5:30 PM", label: "Short Break & Preparation for Traditional Wedding", icon: "break" },
        ],
      },
      {
        title: "Traditional Wedding",
        items: [
          { time: "6:30 PM – 7:30 PM", label: "Arrival & Welcome of Guests", icon: "welcome" },
          { time: "7:30 PM onwards", label: "Official Start of Traditional Wedding Activities", icon: "drum" },
        ],
      },
    ] satisfies {
      title: string;
      items: { time: string; label: string; icon: "court" | "camera" | "toast" | "break" | "welcome" | "drum" }[];
    }[],
  },

  /* ── Wedding party (placeholder; hidden until sections.weddingParty) ─────── */
  weddingParty: {
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
        bio: "Eleanor's younger sister, the family's resident baker and dance-floor starter.",
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

  /* ── 8. RSVP ────────────────────────────────────────────────────────────── */
  rsvp: {
    eyebrow: "Kindly reply",
    heading: "Will you join us?",
    /** e.g. "Kindly respond by 15 January 2027"; leave "" to hide */
    replyBy: "",
    acceptLabel: "Joyfully Accepts",
    declineLabel: "Regretfully Declines",
    /** Max number of guests a single reply can include (incl. the guest) */
    maxGuests: 4,
    thankYouAccept: "We can't wait to celebrate with you!",
    thankYouDecline: "You'll be dearly missed. Thank you for letting us know.",
  },

  /* ── Gifts (placeholder; hidden until sections.gifts) ───────────────────── */
  gifts: {
    heading: "Gifts for our next chapter",
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
      description: "Help us toast to forever on the Amalfi Coast: a sunset dinner, a boat day, a few too many gelatos.",
      goal: 60000,
      raised: 23500,
      presets: [250, 500, 1000, 2500],
      /** "{amount}" is replaced with the chosen amount. Leave "" to hide the button. */
      paymentUrlTemplate: "https://www.paypal.com/paypalme/yourhandle/{amount}",
      contributeLabel: "Contribute",
    },
  },

  /* ── FAQ (placeholder; hidden until sections.faq) ───────────────────────── */
  faq: {
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
        a: "June evenings in the Winelands can be cool, around 10 to 16°C. The ceremony is outdoors, so bring a wrap or jacket.",
      },
      {
        q: "What footwear should I wear?",
        a: "The ceremony is on the lawn, so we recommend block heels, wedges or flats. Heel protectors will be available.",
      },
      {
        q: "Is there parking?",
        a: "Yes, complimentary parking is available on site. We also recommend using the rideshare voucher in the Venue section.",
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
