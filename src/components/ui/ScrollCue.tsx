"use client";

import { CaretDown } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A single quiet caret under the full-screen invitation card. After the
 * envelope opens the card fills the screen and looks "finished", so guests
 * need one hint that the page continues. No label; still under reduced motion.
 */
export function ScrollCue({ visible = true }: { visible?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-stone"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 0.8 : 0, y: visible && !reduce ? [0, 5, 0] : 0 }}
      transition={{
        opacity: { duration: 1, delay: visible ? 0.8 : 0 },
        y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <CaretDown size={22} weight="light" />
    </motion.div>
  );
}
