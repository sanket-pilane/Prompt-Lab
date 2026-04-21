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
            className={cn(
              "fixed inset-y-0 left-0 w-80 bg-brand-surface border-r border-brand-border z-50 flex flex-col shadow-2xl",
              "top-0 bottom-0"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-brand-border/60 text-zinc-300">
              <div className="flex items-center gap-2 font-mono text-sm tracking-wider uppercase">
                <History size={16} className="text-brand-yellow" />
                History
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3 font-mono text-xs">
                  <Clock size={32} strokeWidth={1} className="opacity-50" />
                  <p>No recent generations</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <motion.div 
                      key={item.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => onSelect && onSelect(item)}
                      className="p-3 rounded-lg border border-brand-border bg-black/40 hover:bg-white/5 cursor-pointer flex gap-3 transition-colors group"
                    >
                      <div className="w-12 h-12 shrink-0 bg-zinc-900 rounded overflow-hidden border border-brand-border/60">
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden flex flex-col justify-center">
                        <p className="text-sm font-sans text-white truncate w-full group-hover:text-brand-yellow transition-colors">{item.prompt}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1">
                          {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {items.length > 0 && (
              <div className="p-4 border-t border-brand-border/60">
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
