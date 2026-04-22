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

export default function Optimizer() {
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

  const handleEditMessage = async (messageId: string, newJsonPayload: any) => {
    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, jsonPayload: newJsonPayload } : msg
        )
      );

      // Update history if this message was saved
      const updatedHistory = historyItems.map((item) =>
        item.id === messageId ? { ...item, json: newJsonPayload } : item
      );
      
      if (JSON.stringify(updatedHistory) !== JSON.stringify(historyItems)) {
        setHistoryItems(updatedHistory);
        await set("prompt-to-json-history", updatedHistory);
      }

      toast.success("JSON updated and saved to history");
    } catch (e) {
      console.error("Failed to update message payload", e);
      toast.error("Failed to update history persistence");
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-brand-bg overflow-hidden font-mono selection:bg-brand-yellow/30">
      <div className="scanline"></div>
      
      {/* Top Navigation / Status Bar */}
      <header className="w-full h-14 z-30 flex items-center justify-between px-6 border-b border-brand-border bg-brand-bg">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-2 py-1 text-zinc-400 hover:text-white hover:bg-brand-surface transition-colors border border-transparent hover:border-brand-border group"
          >
            <Menu size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline group-hover:text-white">Open_Archive</span>
          </button>
          
          <div className="h-4 w-[1px] bg-brand-border hidden sm:block"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-none shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PROTOCOL_ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] hidden md:block">
            LATENCY: 142MS // BATCH: IMG_OPTIM_v1.0
          </div>
          <div className="bg-brand-yellow px-2 py-0.5 text-black text-[9px] font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(255,204,0,0.3)]">
            GEN_MODEL: GEMINI_3_FLASH
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="flex-1 flex flex-col relative z-10 w-full overflow-hidden bg-grid-pattern">
        <ChatArea messages={messages} onEditMessage={handleEditMessage} />
      </main>

      {/* Bottom Composer Container */}
      <div className="relative z-20 border-t border-brand-border bg-brand-bg px-4 py-8 md:py-12">
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
