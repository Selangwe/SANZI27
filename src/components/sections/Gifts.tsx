"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { wedding } from "@/content/wedding";
import { readLocal, writeLocal } from "@/lib/storage";
import { ImageSlot } from "../ui/ImageSlot";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

type RegistryItem = (typeof wedding.gifts.registry)[number];
const CLAIMS_KEY = "wedding-gift-claims";

// Formatted by hand (not Intl) so server and browser render identical text.
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

export function Gifts() {
  const { gifts } = wedding;
  const money = useMoney();
  // Items this guest claimed on this device (shared claims are set in content via `claimed: true`)
  const [myClaims, setMyClaims] = useState<string[]>([]);
  const [claiming, setClaiming] = useState<RegistryItem | null>(null);

  useEffect(() => setMyClaims(readLocal<string[]>(CLAIMS_KEY) ?? []), []);

  const markClaimed = (id: string) => {
    const next = [...new Set([...myClaims, id])];
    setMyClaims(next);
    writeLocal(CLAIMS_KEY, next);
  };

  return (
    <Section id="gifts" className="paper">
      <SectionHeading title={gifts.heading} />
      <Reveal className="mx-auto mt-6 max-w-lg text-center">
        <p className="font-display text-lg italic leading-relaxed text-stone">{gifts.intro}</p>
      </Reveal>

      <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
        {gifts.registry.map((item, i) => {
          const mine = myClaims.includes(item.id);
          const claimed = item.claimed || mine;
          return (
            <Reveal key={item.id} delay={(i % 4) * 0.08} className="card flex flex-col overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-linen">
                <ImageSlot image={item.image} sizes="(max-width: 768px) 45vw, 240px" className={claimed ? "opacity-50 grayscale" : ""} />
              </div>
              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <h3 className="font-sans text-[0.85rem] font-medium leading-snug text-ink">{item.name}</h3>
                <p className="mt-1 font-display text-xl font-semibold text-gold">{money.format(item.price)}</p>
                <p className="mb-4 mt-1 text-xs text-stone">
                  {mine ? "You claimed this" : claimed ? "Already claimed" : "Available"}
                </p>
                <button
                  type="button"
                  disabled={claimed}
                  onClick={() => setClaiming(item)}
                  className="btn btn-solid mt-auto min-h-9 px-3 text-[0.6rem]"
                >
                  {claimed ? "Claimed" : "Claim"}
                </button>
              </div>
            </Reveal>
          );
        })}
      </div>

      <HoneymoonFund />

      <AnimatePresence>
        {claiming && (
          <ClaimDialog
            item={claiming}
            onClose={() => setClaiming(null)}
            onClaimed={() => {
              markClaimed(claiming.id);
            }}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}

function HoneymoonFund() {
  const { honeymoon } = wedding.gifts;
  const money = useMoney();
  const [amount, setAmount] = useState<number>(honeymoon.presets[1] ?? honeymoon.presets[0]);
  const [custom, setCustom] = useState("");
  const pct = Math.min(100, Math.round((honeymoon.raised / honeymoon.goal) * 100));
  const chosen = custom ? Number(custom) : amount;
  const payUrl =
    honeymoon.paymentUrlTemplate && chosen > 0
      ? honeymoon.paymentUrlTemplate.replace("{amount}", String(chosen))
      : null;

  return (
    <Reveal className="card mx-auto mt-16 max-w-2xl px-6 py-10 text-center sm:px-12">
      <h3 className="font-display text-4xl font-semibold text-ink">{honeymoon.heading}</h3>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink/70">{honeymoon.description}</p>

      <div className="mt-10">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-display text-2xl text-ink">{money.format(honeymoon.raised)}</span>
          <span className="text-stone">of {money.format(honeymoon.goal)}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand/70" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-gold-soft to-cocoa"
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>
        <p className="mt-2 text-right text-[0.6rem] uppercase tracking-[0.25em] text-taupe">{pct}% of our goal</p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        {honeymoon.presets.map((p) => {
          const active = !custom && amount === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                setAmount(p);
                setCustom("");
              }}
              aria-pressed={active}
              className={`min-h-11 min-w-20 rounded-full border px-4 text-sm font-medium transition-colors ${
                active ? "border-cocoa bg-cocoa text-ivory" : "border-sand bg-cream text-ink hover:border-stone"
              }`}
            >
              {money.format(p)}
            </button>
          );
        })}
      </div>
      <label className="mt-3 block">
        <span className="sr-only">Custom amount</span>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={custom}
          onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
          placeholder="Or enter your own amount"
          className="field text-center"
        />
      </label>

      {payUrl && (
        <a href={payUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-6 w-full sm:w-auto">
          {honeymoon.contributeLabel} {money.format(chosen)}
        </a>
      )}
    </Reveal>
  );
}

function ClaimDialog({ item, onClose, onClaimed }: { item: RegistryItem; onClose: () => void; onClaimed: () => void }) {
  const money = useMoney();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "");
    setStatus("sending");
    try {
      const res = await fetch("/api/gift-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, name }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      onClaimed();
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-title"
        className="w-full max-w-sm rounded-2xl bg-ivory px-6 pb-8 pt-10 text-center"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {status === "done" ? (
          <>
            <p className="font-script text-5xl text-ink">Thank you</p>
            <p className="mt-3 font-display text-lg italic text-stone">
              You&apos;ve claimed the {item.name.toLowerCase()}.
            </p>
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-6 w-full">
                View in store
              </a>
            )}
            <button type="button" onClick={onClose} className="btn btn-solid mt-3 w-full">
              Done
            </button>
          </>
        ) : (
          <form onSubmit={submit}>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-gold">Claim gift</p>
            <h3 id="claim-title" className="mt-3 font-display text-3xl text-ink">
              {item.name}
            </h3>
            <p className="mt-1 text-sm text-stone">{money.format(item.price)}</p>
            <input name="name" required autoFocus autoComplete="name" placeholder="Your name" className="field mt-6" />
            {status === "error" && <p className="mt-3 text-sm text-wax">{error}</p>}
            <button type="submit" disabled={status === "sending"} className="btn btn-solid mt-4 w-full">
              {status === "sending" ? "Claiming…" : "Claim this gift"}
            </button>
            <button type="button" onClick={onClose} className="mt-4 text-[0.65rem] uppercase tracking-[0.25em] text-stone">
              Cancel
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
