"use client";

import React, { useRef, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ImagePlus, X, Loader2 } from "lucide-react";
import { ASPECT_RATIOS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PromptComposerProps {
  input: string;
  setInput: (value: string) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  aspectRatio: string;
  setAspectRatio: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function PromptComposer({
  input,
  setInput,
  images,
  setImages,
  aspectRatio,
  setAspectRatio,
  onSubmit,
  disabled,
  isLoading,
}: PromptComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && input.trim()) {
        onSubmit();
      }
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Basic validation
      if (!file.type.startsWith("image/")) return;
      if (images.length >= 3) return; // limit to 3 images

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          setImages((prev) => {
            if (prev.length >= 3) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 md:px-6 mb-4 md:mb-8">
      <div className="bg-brand-surface border border-brand-border shadow-2xl relative">
        <div className="absolute -top-[1px] -left-[1px] w-8 h-[1px] bg-brand-yellow"></div>
        <div className="absolute -top-[1px] -left-[1px] w-[1px] h-8 bg-brand-yellow"></div>
        
        {/* Top toolbar: aspect ratio selector */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-brand-border/50 bg-black/20">
          <div className="flex items-center bg-brand-bg border border-brand-border p-1">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-3 py-1 text-[10px] md:text-xs font-mono font-bold uppercase transition-colors ${
                  aspectRatio === ratio
                    ? "bg-brand-yellow text-black"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || images.length >= 3}
            className="text-zinc-400 hover:text-white transition-colors p-1.5 border border-transparent hover:border-brand-border disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload images (Max 3)"
          >
            <ImagePlus size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            multiple
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
        </div>

        {/* Selected Images Preview */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pt-3 flex gap-3 overflow-x-auto"
            >
              {images.map((img, idx) => (
                <div key={idx} className="relative group shrink-0">
                  <div className="w-16 h-16 border border-brand-border/80 bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                  {!disabled && (
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Input Area */}
        <div className="flex items-end px-2 py-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="DESCRIBE_THE_IMAGE_PROMPT_TO_EXTRACT..."
            autoFocus
            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-zinc-600 resize-none font-mono text-sm leading-relaxed p-3 min-h-[60px] md:min-h-[80px]"
            rows={1}
          />
          
          <button
            onClick={onSubmit}
            disabled={disabled || !input.trim()}
            className={`flex items-center gap-2 px-6 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
              disabled || !input.trim()
                ? "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed opacity-50"
                : "bg-brand-yellow text-black border-brand-yellow hover:bg-brand-yellow/90 shadow-[0_0_15px_rgba(255,204,0,0.2)]"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Initialize</span>
          </button>
        </div>
      </div>
      
      {/* Footer hint */}
      <div className="text-center mt-3 text-xs text-zinc-600 font-mono flex items-center justify-center gap-4">
        <span><kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded mr-1 text-[10px]">Enter</kbd> to send</span>
        <span><kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded mr-1 text-[10px]">Shift</kbd> + <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded mr-1 text-[10px]">Enter</kbd> newline</span>
      </div>
    </div>
  );
}
