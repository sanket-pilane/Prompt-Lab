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
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-brand-bg border-l border-brand-border z-[70] flex flex-col overflow-y-auto overflow-x-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white text-black hover:bg-zinc-200 transition-colors z-20"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Hero Image */}
        <div className="w-full h-64 md:h-80 bg-zinc-900 relative border-b border-brand-border shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={prompt.imageUrl} 
            alt={prompt.title} 
            className="w-full h-full object-cover opacity-100"
          />
        </div>

        <div className="p-8 flex flex-col flex-1 relative">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">SELECTED PROMPT_{prompt.id.padStart(3, '0')}</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wider text-white mb-8 title-brutalist leading-none">
            {prompt.title}
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-10 pb-6 border-b border-brand-border">
             <div>
               <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">AUTHOR</div>
               <div className="font-bold text-sm tracking-wider uppercase">{prompt.author}</div>
             </div>
             <div>
               <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">ENGINE</div>
               <div className="font-bold text-sm tracking-wider uppercase">{prompt.model}</div>
             </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">RAW PROMPT</div>
            <button className="font-mono text-[10px] font-bold text-white hover:text-brand-yellow">[COPY]</button>
          </div>
          <div className="bg-brand-surface border border-brand-border p-5 font-mono text-xs leading-relaxed text-zinc-300 mb-8 whitespace-pre-wrap">
            {prompt.promptText}
          </div>

          {prompt.negativePrompt && (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">NEGATIVE_CONSTRAINT</div>
                <button className="font-mono text-[10px] font-bold text-white hover:text-brand-yellow">[COPY]</button>
              </div>
              <div className="bg-brand-surface border border-brand-border p-5 font-mono text-xs leading-relaxed text-zinc-500 mb-8 italic">
                {prompt.negativePrompt}
              </div>
            </>
          )}

          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">METADATA</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-12">
            {Object.entries(prompt.parameters).map(([key, value]) => (
              <div key={key}>
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{key.toUpperCase().replace(' ', '_')}</div>
                <div className="font-bold text-sm tracking-wider uppercase">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 pt-4">
            <button className="flex items-center justify-center gap-2 bg-white text-black py-4 font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors">
              <Copy size={16} /> Copy Prompt
            </button>
             <button className="flex items-center justify-center gap-2 border border-brand-border bg-transparent text-white py-4 font-bold text-xs uppercase tracking-widest hover:bg-brand-surface transition-colors">
              <Save size={16} /> Save Item
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
