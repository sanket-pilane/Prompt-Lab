"use client";

import { motion } from "framer-motion";
import { Copy, X, Save } from "lucide-react";
import { Prompt } from "@/lib/types";

interface PromptDrawerProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromptDrawer({ prompt, isOpen, onClose }: PromptDrawerProps) {
  if (!prompt) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#0c0c0e] border-l border-brand-border/40 z-[70] flex flex-col overflow-y-auto overflow-x-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black transition-all duration-300 rounded-full z-20"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {/* Hero Image */}
        <div className="w-full h-[35vh] md:h-[400px] bg-black relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={prompt.imageUrl} 
            alt={prompt.title} 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] to-transparent pointer-events-none h-1/2 bottom-0 mt-auto" />
        </div>

        <div className="p-8 md:p-10 flex flex-col flex-1 relative -mt-10 z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span>
            <span className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em]">ENTRY_{prompt.id.padStart(3, '0')}</span>
          </div>

          <h1 className="font-sans text-3xl md:text-4xl text-white mb-10 leading-[1.1] font-medium tracking-tight">
            {prompt.title}
          </h1>

          <div className="grid grid-cols-2 gap-6 mb-10 pb-8 border-b border-brand-border/30">
             <div>
               <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em] mb-1.5">AUTHOR</div>
               <div className="font-sans text-[13px] text-white font-medium tracking-wide">{prompt.author}</div>
             </div>
             <div>
               <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em] mb-1.5">ENGINE</div>
               <div className="font-sans text-[13px] text-white font-medium tracking-wide">{prompt.model}</div>
             </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em]">RAW PROMPT</div>
            <button className="font-mono text-[9px] font-medium text-white hover:text-brand-yellow transition-colors">[COPY]</button>
          </div>
          <div className="bg-brand-surface/50 border border-brand-border/40 p-6 font-mono text-[11px] leading-relaxed text-zinc-300 mb-10 whitespace-pre-wrap rounded-[2px]">
            {prompt.promptText}
          </div>

          {prompt.negativePrompt && (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em]">NEGATIVE_CONSTRAINT</div>
                <button className="font-mono text-[9px] font-medium text-white hover:text-brand-yellow transition-colors">[COPY]</button>
              </div>
              <div className="bg-brand-surface/30 border border-brand-border/30 p-6 font-mono text-[11px] leading-relaxed text-brand-text-muted mb-10 italic rounded-[2px]">
                {prompt.negativePrompt}
              </div>
            </>
          )}

          <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em] mb-5">METADATA</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-16">
            {Object.entries(prompt.parameters).map(([key, value]) => (
              <div key={key}>
                <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em] mb-1.5">{key.toUpperCase().replace(' ', '_')}</div>
                <div className="font-sans text-[13px] text-white font-medium tracking-wide">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-brand-border/30">
            <button className="flex items-center justify-center gap-2 bg-white text-black py-4 font-mono text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-zinc-200 transition-colors rounded-[2px]">
              <Copy size={14} /> Copy Prompt
            </button>
             <button className="flex items-center justify-center gap-2 border border-brand-border/60 bg-brand-surface/50 text-white py-4 font-mono text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-brand-surface hover:border-brand-border transition-all duration-300 rounded-[2px]">
              <Save size={14} /> Save Item
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
