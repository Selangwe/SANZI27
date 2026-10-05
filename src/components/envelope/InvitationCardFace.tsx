"use client";

import { wedding } from "@/content/wedding";
import { LayerImage } from "./LayerImage";

/**
 * The invitation card. Shows /public/envelope/invitation-card.png when it
 * exists; otherwise a typeset card. Typography uses container units so the
 * same card reads well tucked in the envelope and at full screen.
 */
export function InvitationCardFace({ onSettled, priority = true }: { onSettled?: () => void; priority?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ivory" style={{ containerType: "size" }}>
      <LayerImage
        src={wedding.envelope.images.card}
        alt="Wedding invitation"
        sizes="100vw"
        fit="cover"
        priority={priority}
        onSettled={onSettled}
        fallback={<TypesetCard />}
      />
    </div>
  );
}

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
