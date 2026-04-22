"use client";

import { motion } from "framer-motion";

export function HeroTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col justify-center items-center h-full w-full max-w-4xl mx-auto py-20"
    >
      <div className="text-center space-y-4">
        <div className="flex flex-col items-center select-none">
          <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-[0.4em] mb-2 leading-none">SYSTEM_STATUS // ONLINE</span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display text-white tracking-widest leading-[0.8] mb-6 text-striped pb-2">
            OPTIMIZER
          </h1>
        </div>
        
        <div className="relative inline-block px-8 py-3 border border-zinc-800 bg-zinc-900/30">
          <div className="absolute -top-[1px] -left-[1px] w-4 h-[1px] bg-brand-yellow"></div>
          <div className="absolute -top-[1px] -left-[1px] w-[1px] h-4 bg-brand-yellow"></div>
          <p className="text-brand-yellow font-mono text-[10px] md:text-xs uppercase tracking-[0.25em]">
            NEURAL_EXTRACTION_PROTOCOL_v0.9
          </p>
          <div className="absolute -bottom-[1px] -right-[1px] w-4 h-[1px] bg-brand-yellow"></div>
          <div className="absolute -bottom-[1px] -right-[1px] w-[1px] h-4 bg-brand-yellow"></div>
        </div>
      </div>
    </motion.div>
  );
}
