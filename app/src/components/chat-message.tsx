import React from "react";
import { type Message } from "@/lib/types";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { JsonViewer } from "./json-viewer";

interface ChatMessageProps {
  message: Message;
  onEdit?: (newPayload: any) => void;
}

export function ChatMessage({ message, onEdit }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6 min-w-0`}
    >
      <div className={`max-w-[95%] md:max-w-[85%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"} min-w-0`}>
        
        {/* User Message Bubble */}
        {isUser && (
          <div className="bg-[#1a1a1a] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm border border-[#333] shadow-lg max-w-full">
            <p className="whitespace-pre-wrap font-sans text-sm break-words">{message.content}</p>
            {message.images && message.images.length > 0 && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-[#333]">
                {message.images.map((img, idx) => (
                  <div key={idx} className="w-16 h-16 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="Reference" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assistant Message Bubble */}
        {!isUser && (
          <div
            className={`w-full ${
              isUser ? "" : "bg-brand-surface/40 border-y border-brand-border"
            }`}
          >
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
              <div className="flex gap-4 md:gap-8">
                {/* Minimal ID/Role label */}
                <div className="shrink-0 flex flex-col pt-1">
                   <span className="font-mono text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">
                     {isUser ? "USER_INPUT" : "SYSTEM_OUT"}
                   </span>
                   {!isUser && message.state !== "complete" && (
                     <span className="font-mono text-[8px] text-brand-yellow animate-pulse mt-1">
                       {message.state?.toUpperCase()}...
                     </span>
                   )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="prose prose-invert max-w-none">
                    {message.content && (
                      <p className={`font-mono text-xs md:text-sm leading-relaxed ${isUser ? "text-white" : "text-zinc-300"}`}>
                        {message.content}
                      </p>
                    )}

                    {/* Coming up next: JSON Expansion Panel */}
                    {message.jsonPayload && (
                      <JsonViewer data={message.jsonPayload} defaultExpanded={message.state === "complete"} onEdit={onEdit} />
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </motion.div>
  );
}
