"use client";

import { Check, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { wedding } from "@/content/wedding";
import { readLocal, writeLocal } from "@/lib/storage";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeading } from "../ui/SectionHeading";

type Choice = "accept" | "decline";
type Saved = { choice: Choice; name: string };
const STORAGE_KEY = "wedding-rsvp";
const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export function Rsvp() {
  const { rsvp } = wedding;
  const [choice, setChoice] = useState<Choice | null>(null);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => setSaved(readLocal<Saved>(STORAGE_KEY)), []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!choice) return;
    const form = new FormData(e.currentTarget);
    const payload = {
      attending: choice === "accept",
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      guests: Number(form.get("guests") ?? 1),
      dietary: String(form.get("dietary") ?? ""),
      message: String(form.get("message") ?? ""),
    };
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      const next = { choice, name: payload.name };
      writeLocal(STORAGE_KEY, next);
      setSaved(next);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <Section id="rsvp" className="bg-linen/60">
      <SectionHeading eyebrow={rsvp.eyebrow} title={rsvp.heading} />
      <Reveal className="mt-4 text-center">
        <p className="font-display text-lg italic text-stone">{rsvp.replyBy}</p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-md">
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="done" {...fade} className="card px-6 py-12 text-center">
              <p className="font-script text-5xl text-ink">Thank you{saved.name ? `, ${saved.name.split(" ")[0]}` : ""}</p>
              <p className="mt-4 font-display text-lg italic text-stone">
                {saved.choice === "accept" ? rsvp.thankYouAccept : rsvp.thankYouDecline}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSaved(null);
                  setChoice(null);
                }}
                className="mt-8 text-[0.65rem] uppercase tracking-[0.25em] text-stone underline decoration-sand underline-offset-4 hover:text-ink"
              >
                Change my reply
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" {...fade}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ChoiceButton icon="check" active={choice === "accept"} onClick={() => setChoice("accept")}>
                  {rsvp.acceptLabel}
                </ChoiceButton>
                <ChoiceButton icon="cross" active={choice === "decline"} onClick={() => setChoice("decline")}>
                  {rsvp.declineLabel}
                </ChoiceButton>
              </div>

              <AnimatePresence initial={false}>
                {choice && (
                  <motion.form
                    key="fields"
                    onSubmit={submit}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-8">
                      <Field label="Full name">
                        <input name="name" required autoComplete="name" className="field" placeholder="Your name" />
                      </Field>
                      <Field label="Email (optional)">
                        <input name="email" type="email" autoComplete="email" className="field" placeholder="you@example.com" />
                      </Field>
                      {choice === "accept" && (
                        <>
                          <Field label="Number of guests (including you)">
                            <select name="guests" className="field" defaultValue="1">
                              {Array.from({ length: rsvp.maxGuests }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Dietary requirements">
                            <input name="dietary" className="field" placeholder="Allergies, vegetarian…" />
                          </Field>
                        </>
                      )}
                      <Field label="A note for the couple (optional)">
                        <textarea name="message" rows={3} className="field resize-none" />
                      </Field>
                      {status === "error" && <p className="text-sm text-wax">{error}</p>}
                      <button type="submit" disabled={status === "sending"} className="btn btn-solid w-full">
                        {status === "sending" ? "Sending…" : "Send reply"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </Section>
  );
}

function ChoiceButton({
  icon,
  active,
  onClick,
  children,
}: {
  icon: "check" | "cross";
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-16 items-center justify-center gap-3 rounded-lg border px-4 text-[0.68rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
        active
          ? "border-cocoa bg-cocoa text-ivory shadow-[0_8px_20px_-10px_rgba(90,52,34,0.7)]"
          : "border-sand bg-ivory text-ink hover:border-stone"
      }`}
    >
      {icon === "check" ? (
        <Check size={16} weight="light" className={active ? "" : "text-gold"} />
      ) : (
        <X size={16} weight="light" className={active ? "" : "text-gold"} />
      )}
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.62rem] uppercase tracking-[0.22em] text-stone">{label}</span>
      {children}
    </label>
  );
}
