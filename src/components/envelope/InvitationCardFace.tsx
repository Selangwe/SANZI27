"use client";

import { wedding } from "@/content/wedding";
import { LayerImage } from "./LayerImage";

/**
 * The invitation card. Shows /public/envelope/invitation-card.png when it
 * exists; otherwise a typeset card. The PNG is a transparent, deckle-edged
 * card, so it is shown whole (contained) with a shadow that follows its edges,
 * over whatever paper sits behind it. Typography of the typeset fallback uses
 * container units so it reads well both tucked in the envelope and full size.
 */
export function InvitationCardFace({ onSettled, priority = true }: { onSettled?: () => void; priority?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ containerType: "size" }}>
      <LayerImage
        src={wedding.envelope.images.card}
        alt="Wedding invitation"
        sizes="(max-width: 640px) 100vw, 640px"
        fit="contain"
        priority={priority}
        onSettled={onSettled}
        imgClassName="drop-shadow-[0_14px_22px_rgba(60,40,25,0.28)]"
        fallback={<TypesetCard />}
      />
    </div>
  );
}

/**
 * Where the card sits once it has left the envelope: centred on screen with a
 * small margin. Shared by the envelope's expand step and the pinned card behind
 * the cover so the hand-off between them is seamless.
 */
export const CARD_MARGIN_VMIN = 7;
export const cardRestingRect = (w: number, h: number) => {
  const m = (Math.min(w, h) * CARD_MARGIN_VMIN) / 100;
  return { top: m, left: m, width: w - m * 2, height: h - m * 2 };
};

function TypesetCard() {
  const { partnerOne, partnerTwo, monogram } = wedding.couple;
  const { event, venue, families } = wedding;
  return (
    <div className="invite paper">
      <div className="invite-frame inset-[calc(var(--u)*3.5)]" />
      <div className="invite-frame inset-[calc(var(--u)*5)] opacity-50" />

      <div className="invite-body">
        <p className="invite-tall invite-amp mb-[calc(var(--u)*4)] text-[length:calc(var(--u)*6)]">{monogram}</p>
        <p className="invite-eyebrow">{families.intro}</p>

        <div className="flex flex-col items-center">
          <span className="invite-name">{partnerOne.firstName}</span>
          <span className="invite-amp my-[calc(var(--u)*0.5)]">&amp;</span>
          <span className="invite-name">{partnerTwo.firstName}</span>
        </div>

        <p className="invite-request">request the pleasure of your company at the celebration of their marriage</p>

        <div className="flex flex-col items-center gap-[calc(var(--u)*1.4)]">
          <p className="invite-date">{event.displayDateFormal}</p>
          <p className="invite-year">{event.displayYearFormal}</p>
          <span className="invite-rule my-[calc(var(--u)*0.8)]" />
          <p className="invite-eyebrow">{venue.name}</p>
        </div>
      </div>
    </div>
  );
}
