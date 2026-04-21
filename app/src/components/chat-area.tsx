"use client";

import React, { useEffect, useRef } from "react";
import { type Message } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { HeroTitle } from "./hero-title";
import { AnimatePresence } from "framer-motion";

interface ChatAreaProps {
  messages: Message[];
}

export function ChatArea({ messages }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto px-4 py-8 custom-scrollbar">
      {messages.length === 0 ? (
        <HeroTitle />
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </AnimatePresence>
          <div ref={bottomRef} className="h-20" />
        </div>
      )}
    </div>
  );
}
