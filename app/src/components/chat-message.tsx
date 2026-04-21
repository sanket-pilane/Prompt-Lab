import React from "react";
import { type Message } from "@/lib/types";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { JsonViewer } from "./json-viewer";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
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
          <div className="w-full">
            {/* Main Assistant Bubble for Text/Status */}
            <div className="flex items-start gap-4 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center flex-shrink-0 font-display text-xs font-bold pt-0.5 mt-1">
                AI
              </div>
              <div className="flex-1 space-y-4 pt-1 min-w-0 overflow-hidden">
                {/* Generation State Handling */}
                {message.state !== "idle" && message.state !== "complete" && message.state !== "error" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-zinc-400 font-mono text-sm flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-brand-yellow" />
                      {message.state === "analyzing" && "Analyzing request fields..."}
                      {message.state === "writing" && "Writing structured JSON prompt..."}
                    </p>
                  </div>
                )}
                
                {/* Final or error content */}
                {(message.state === "complete" || message.state === "error") && message.content && (
                  <div className="text-zinc-200 font-sans text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                )}

                {/* Coming up next: JSON Expansion Panel */}
                {message.jsonPayload && (
                  <JsonViewer data={message.jsonPayload} defaultExpanded={message.state === "complete"} />
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </motion.div>
  );
}
