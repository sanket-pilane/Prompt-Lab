"use client";

import React, { useState, useEffect } from "react";
import { ChatArea } from "@/components/chat-area";
import { PromptComposer } from "@/components/prompt-composer";
import { HistorySidebar } from "@/components/history-sidebar";
import { type Message, type GenerationState } from "@/lib/types";
import { toast } from "sonner";
import { Menu } from "lucide-react";
import { get, set } from "idb-keyval";

export interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: number;
  image?: string; // Kept since users might still upload reference images
  json: any;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Load History
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await get<HistoryItem[]>("prompt-to-json-history");
        if (stored) {
          setHistoryItems(stored);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    };
    loadHistory();
  }, []);

  // The main generation pipeline
  const handleSubmit = async () => {
    if (!input.trim() || isGenerating) return;

    setIsGenerating(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      images: [...images],
      timestamp: Date.now(),
    };

    const assistantMessageId = (Date.now() + 1).toString();
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      images: [],
      state: "analyzing",
      timestamp: Date.now() + 1,
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setInput("");
    setImages([]);

    const updateAssistantMsg = (updates: Partial<Message>) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, ...updates } : msg
        )
      );
    };

    try {
      // Step 1: Select Fields
      const selectFieldsRes = await fetch("/api/ai/select-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.content, images: userMessage.images }),
      });

      if (!selectFieldsRes.ok) throw new Error("Failed to select fields.");
      const fieldsData = await selectFieldsRes.json();
      const requiredFields = fieldsData.required_fields;

      updateAssistantMsg({ state: "writing" });

      // Step 2: Generate JSON
      const generateJsonRes = await fetch("/api/ai/generate-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage.content,
          images: userMessage.images,
          required_fields: requiredFields,
          aspect_ratio: aspectRatio,
        }),
      });

      if (!generateJsonRes.ok) throw new Error("Failed to generate JSON.");
      const jsonPayload = await generateJsonRes.json();
      
      // Finalize immediately after JSON builds
      updateAssistantMsg({
        state: "complete",
        jsonPayload
      });
      
      toast.success("Generation complete!");

      // Save to History
      saveToHistory({
        id: assistantMessageId,
        prompt: userMessage.content,
        timestamp: Date.now(),
        image: userMessage.images?.[0] || "", // save first reference image if exists
        json: jsonPayload
      });

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred during generation.");
      updateAssistantMsg({
        state: "error",
        content: "Generation failed. Please try again or check your API key constraints.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToHistory = async (item: HistoryItem) => {
    try {
      const newHistory = [item, ...historyItems].slice(0, 50); // Keep last 50
      await set("prompt-to-json-history", newHistory);
      setHistoryItems(newHistory);
    } catch (e) {
      console.error("Failed to save to history", e);
    }
  };

  const handleClearHistory = async () => {
    try {
      await set("prompt-to-json-history", []);
      setHistoryItems([]);
      toast.success("History cleared");
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  };

  const restoreFromHistory = (item: HistoryItem) => {
    // Optionally pre-fill the composer
    setInput(item.prompt);
    setIsSidebarOpen(false);
    toast("Prompt loaded from history");
  };

  return (
    <div className="relative flex flex-col h-full bg-grid-pattern overflow-hidden">
      <div className="scanline"></div>
      
      {/* Top Navigation Bar */}
      <header className="absolute top-0 w-full z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-brand-border"
        >
          <Menu size={20} />
        </button>
        <div className="text-[10px] font-mono tracking-widest text-brand-yellow/50">
          GEMINI_2.0_EXP :: IMAGEN_3.0
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 flex flex-col pt-12 relative z-10 w-full">
        <ChatArea messages={messages} />
      </main>

      {/* Bottom Composer */}
      <div className="relative z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-10">
        <PromptComposer
          input={input}
          setInput={setInput}
          images={images}
          setImages={setImages}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          onSubmit={handleSubmit}
          disabled={isGenerating}
          isLoading={isGenerating}
        />
      </div>

      <HistorySidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        items={historyItems}
        onClear={handleClearHistory}
        onSelect={restoreFromHistory}
      />
    </div>
  );
}
