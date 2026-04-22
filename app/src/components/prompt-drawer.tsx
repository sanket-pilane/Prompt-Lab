"use client";

import { motion } from "framer-motion";
import { Copy, X, Save, Check } from "lucide-react";
import { Prompt } from "@/lib/types";
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface PromptDrawerProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromptDrawer({ prompt, isOpen, onClose }: PromptDrawerProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

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
        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#131313] border-l border-[#353534] z-[70] flex flex-col overflow-y-auto overflow-x-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 bg-[#0e0e0e]/80 backdrop-blur-md text-[#e5e2e1] border border-[#353534] hover:bg-white hover:text-black transition-all duration-300 rounded z-20"
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] to-transparent pointer-events-none h-1/2 bottom-0 mt-auto" />
        </div>

        <div className="p-8 md:p-10 flex flex-col flex-1 relative -mt-10 z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-mono text-[10px] text-brand-text-muted uppercase tracking-widest">ENTRY_{prompt.id.padStart(3, '0')}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-white mb-10 leading-[1.1] font-bold tracking-tight">
            {prompt.title}
          </h1>

          <div className="grid grid-cols-2 gap-6 mb-10 pb-8 border-b border-[#353534]">
             <div>
               <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-[0.1em] mb-1.5">AUTHOR</div>
               <div className="font-sans text-[14px] text-[#e5e2e1] font-medium tracking-wide">{prompt.author}</div>
             </div>
             <div>
               <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-[0.1em] mb-1.5">ENGINE</div>
               <div className="font-sans text-[14px] text-[#e5e2e1] font-medium tracking-wide">{prompt.model}</div>
             </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-[0.1em]">RAW PROMPT</div>
            <button
              onClick={() => copyToClipboard(prompt.promptText, "prompt")}
              className="font-mono text-[10px] font-medium text-secondary hover:text-white transition-colors flex items-center gap-1"
            >
              {copiedField === "prompt" ? <><Check size={10} /> COPIED</> : "[COPY]"}
            </button>
          </div>
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 font-mono text-[13px] leading-relaxed text-[#cbc3d7] mb-10 whitespace-pre-wrap rounded">
            {prompt.promptText}
          </div>

          {prompt.negativePrompt && (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-[0.1em]">NEGATIVE_CONSTRAINT</div>
                <button
                  onClick={() => copyToClipboard(prompt.negativePrompt!, "negative")}
                  className="font-mono text-[10px] font-medium text-secondary hover:text-white transition-colors flex items-center gap-1"
                >
                  {copiedField === "negative" ? <><Check size={10} /> COPIED</> : "[COPY]"}
                </button>
              </div>
              <div className="bg-[#1c1b1b]/50 border border-[#2a2a2a]/50 p-6 font-mono text-[13px] leading-relaxed text-[#958ea0] mb-10 italic rounded">
                {prompt.negativePrompt}
              </div>
            </>
          )}

          <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-[0.1em] mb-5">METADATA</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-16">
            {Object.entries(prompt.parameters).map(([key, value]) => (
              <div key={key}>
                <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-[0.1em] mb-1.5">{key.toUpperCase().replace(' ', '_')}</div>
                <div className="font-sans text-[14px] text-[#e5e2e1] font-medium tracking-wide">{String(value)}</div>
              </div>
            ))}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-[#353534]">
            <button
              onClick={() => copyToClipboard(prompt.promptText, "main")}
              className="flex items-center justify-center gap-2 bg-primary text-[#3c0091] py-4 font-display text-[12px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors rounded shadow-[0_0_15px_rgba(208,188,255,0.15)]"
            >
              {copiedField === "main" ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Prompt</>}
            </button>
             <button className="flex items-center justify-center gap-2 border border-secondary text-secondary py-4 font-display text-[12px] font-bold uppercase tracking-widest hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(76,215,246,0.2)] transition-all duration-300 rounded">
              <Save size={16} /> Save Item
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
