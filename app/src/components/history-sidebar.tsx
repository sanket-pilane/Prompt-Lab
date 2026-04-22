"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, X, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistorySidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  // We'll pass history items here later when we implement persistence
  items?: any[];
  onSelect?: (item: any) => void;
  onClear?: () => void;
}

export function HistorySidebar({ isOpen, setIsOpen, items = [], onSelect, onClear }: HistorySidebarProps) {
  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-[300px] md:w-[350px] bg-brand-bg border-r border-brand-border z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-border flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-1">Archive_Index</span>
                <h2 className="font-display text-xl uppercase tracking-wider text-white">HISTORY.LOG</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3 font-mono text-xs">
                  <Clock size={32} strokeWidth={1} className="opacity-50" />
                  <p>NO RECENT GENERATIONS</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <motion.button
                      key={item.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => onSelect && onSelect(item)}
                      className="w-full text-left p-4 bg-brand-surface/30 border border-brand-border hover:border-brand-yellow/50 transition-all group relative"
                    >
                      <div className="absolute top-0 right-0 p-1 font-mono text-[8px] text-zinc-600 group-hover:text-brand-yellow/50">
                        ID_{String(item.id || idx).slice(-4).toUpperCase()}
                      </div>
                      <p className="text-xs text-zinc-300 line-clamp-2 mb-2 font-mono group-hover:text-white">
                        {item.prompt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-brand-yellow/70 font-mono uppercase font-bold tracking-tighter">
                          LOG_ENTRY :: EXTRACTED
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            
            {items.length > 0 && (
              <div className="p-4 border-t border-brand-border">
                <button
                  onClick={onClear}
                  className="w-full flex items-center justify-center gap-2 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-950/30 py-2 rounded transition-colors"
                >
                  <Trash2 size={14} /> Clear History
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
