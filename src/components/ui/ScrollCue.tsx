"use client";

import { motion } from "framer-motion";

export function ScrollCue({ visible = true, light = false }: { visible?: boolean; light?: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 ${
        light ? "text-ivory/85" : "text-stone"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1, delay: visible ? 0.6 : 0 }}
    >
      <span className="text-[0.6rem] uppercase tracking-[0.4em]">Scroll</span>
      <span className={`relative h-12 w-px overflow-hidden ${light ? "bg-ivory/25" : "bg-stone/25"}`}>
        <motion.span
          className={`absolute left-0 top-0 h-1/2 w-px ${light ? "bg-ivory" : "bg-stone"}`}
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
        />
      </span>
    </motion.div>
  );
}
