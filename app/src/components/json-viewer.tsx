"use client";

import React, { useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SquarePen, Copy, ChevronDown, ChevronUp, Save, X as CloseIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface JsonViewerProps {
  data: any;
  defaultExpanded?: boolean;
  onEdit?: (newPayload: any) => void;
}

export function JsonViewer({ data, defaultExpanded = false, onEdit }: JsonViewerProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("");
  
  const jsonString = JSON.stringify(data, null, 2);

  // Sync edited value when data changes or entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditedValue(jsonString);
    }
  }, [isEditing, jsonString]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    toast.success("JSON copied to clipboard", {
      style: { background: "#111", color: "#FFCC00", border: "1px solid #333" }
    });
  };

  const handleEditToggle = () => {
    if (!onEdit) {
      toast.error("Editing is not available for this message");
      return;
    }
    setIsEditing(true);
    setExpanded(true);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editedValue);
      onEdit?.(parsed);
      setIsEditing(false);
    } catch (e) {
      toast.error("Invalid JSON format. Please fix the errors before saving.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="rounded-md border border-brand-border/60 bg-[#0a0a0a] overflow-hidden mt-4 w-full max-w-full shadow-lg">
      <div 
        className="flex items-center justify-between px-3 md:px-4 py-2 bg-brand-surface/80 border-b border-brand-border cursor-pointer hover:bg-brand-surface transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-zinc-400 font-semibold tracking-wider truncate mr-2">
          <span className="w-2 h-2 rounded-full bg-brand-yellow/80 shrink-0"></span>
          <span className="truncate">{isEditing ? "EDITING_PAYLOAD.JSON" : "STRUCTURED_PAYLOAD.JSON"}</span>
        </div>
        
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] md:text-xs bg-brand-yellow text-black hover:bg-brand-yellow/90 rounded transition-colors font-bold"
              >
                <Save size={12} className="md:w-[14px] md:h-[14px]" /> Save
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] md:text-xs text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <CloseIcon size={12} className="md:w-[14px] md:h-[14px]" /> Cancel
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); handleEditToggle(); }}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] md:text-xs text-brand-yellow/80 hover:text-brand-yellow hover:bg-brand-yellow/10 rounded transition-colors whitespace-nowrap"
                title="Edit JSON"
                disabled={!onEdit}
              >
                <SquarePen size={12} className="md:w-[14px] md:h-[14px]" /> <span className="hidden sm:inline">Edit</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] md:text-xs text-brand-yellow/80 hover:text-brand-yellow hover:bg-brand-yellow/10 rounded transition-colors whitespace-nowrap"
                title="Copy JSON"
              >
                <Copy size={12} className="md:w-[14px] md:h-[14px]" /> <span className="hidden sm:inline">Copy</span>
              </button>
            </>
          )}
          <div className="text-zinc-500 ml-1 shrink-0">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-border/40"
          >
            <div className="text-xs max-h-[500px] overflow-auto custom-scrollbar w-full bg-black/40">
              {isEditing ? (
                <textarea
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  className="w-full h-[300px] md:h-[400px] bg-transparent text-brand-yellow/90 font-mono p-4 outline-none resize-none leading-relaxed text-[12px]"
                  autoFocus
                  spellCheck={false}
                />
              ) : (
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  wrapLongLines={true}
                  customStyle={{
                    margin: 0,
                    padding: '1.25rem',
                    background: 'transparent',
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: '12px',
                    lineHeight: '1.6',
                  }}
                >
                  {jsonString}
                </SyntaxHighlighter>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
