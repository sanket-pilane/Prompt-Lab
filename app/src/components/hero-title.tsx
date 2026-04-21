"use client";

import { motion } from "framer-motion";

export function HeroTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="flex flex-col justify-center items-center h-full w-full max-w-3xl mx-auto"
    >
      <div className="text-center space-y-6">
        <h1 className="text-7xl md:text-[8rem] leading-none tracking-tight flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-brand-yellow drop-shadow-2xl">
          <span className="font-serif italic font-medium -rotate-2">PROMPT</span>
          <span className="font-display tracking-wide uppercase">TO JSON</span>
        </h1>
        <p className="text-zinc-500 font-mono text-sm md:text-base uppercase tracking-[0.2em] bg-zinc-900/50 inline-block px-4 py-2 border border-brand-border/50 rounded pointer-events-none">
          Enhance your image prompts with Gemini
        </p>
      </div>
    </motion.div>
  );
}
