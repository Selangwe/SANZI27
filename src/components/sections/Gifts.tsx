"use client";

import { Gift, WhatsappLogo } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { wedding } from "@/content/wedding";
import { waLink } from "@/lib/whatsapp";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * Gifts & contributions. There is no registry and no payment page: the guest
 * picks an amount and the button opens WhatsApp with the message written out,
 * addressed to the couple's number — the same route the RSVP uses.
 */
export function Gifts() {
  const { gifts, rsvp, couple } = wedding;
  const money = useMoney();
  const [preset, setPreset] = useState<number>(gifts.presets[1] ?? gifts.presets[0]);
  const [custom, setCustom] = useState("");

  const chosen = custom ? Number(custom) : preset;
  const href = waLink(rsvp.whatsapp, [
    `Gift \u00b7 ${couple.weddingName}\n`,
    chosen > 0 ? `I'd like to contribute ${money.format(chosen)}.` : "I'd like to contribute towards your new home.",
    "\nPlease let me know how to send it.",
  ]);

  return (
    <Section id="gifts" className="paper">
      <SectionHeading title={gifts.heading} />

      <Reveal className="card mx-auto mt-12 max-w-2xl px-6 py-10 text-center sm:px-12">
        <Gift size={30} weight="light" className="mx-auto text-gold" aria-hidden="true" />
        <p className="mx-auto mt-5 max-w-md font-display text-lg italic leading-relaxed text-stone">{gifts.intro}</p>

        <p className="eyebrow mt-10">{gifts.amountLabel}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          {gifts.presets.map((p) => {
            const active = !custom && preset === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPreset(p);
                  setCustom("");
                }}
                aria-pressed={active}
                className={`min-h-11 rounded-full border px-5 text-sm font-medium transition-colors ${
                  active ? "border-cocoa bg-cocoa text-ivory" : "border-sand bg-ivory text-ink hover:border-stone"
                }`}
              >
                {money.format(p)}
              </button>
            );
          })}
        </div>

        <label className="mx-auto mt-3 block max-w-xs">
          <span className="sr-only">Custom amount</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/\D/g, "").slice(0, 9))}
            placeholder={gifts.customPlaceholder}
            className="field text-center"
          />
        </label>

        <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-7 w-full sm:w-auto">
          <WhatsappLogo size={16} weight="fill" aria-hidden="true" />
          {gifts.contributeLabel}
          {chosen > 0 ? ` \u00b7 ${money.format(chosen)}` : ""}
        </a>

        <p className="mx-auto mt-5 max-w-sm text-xs leading-relaxed text-taupe">{gifts.note}</p>
        <p className="mt-6 font-script text-3xl text-gold">{gifts.thankYou}</p>
      </Reveal>
    </Section>
  );
}

/** Formatted by hand (not Intl) so server and browser render identical text. */
function useMoney() {
  const { symbol, thousandsSeparator } = wedding.gifts.currency;
  return useMemo(
    () => ({
      format: (n: number) =>
        `${symbol}${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)}`,
    }),
    [symbol, thousandsSeparator],
  );
}
