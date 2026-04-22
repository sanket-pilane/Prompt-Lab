"use client";

import { Search } from "lucide-react";
import { useState, useMemo, Suspense, useEffect } from "react";
import { CURATED_PROMPTS } from "@/lib/data";
import { Prompt } from "@/lib/types";
import { GalleryGrid } from "@/components/gallery-grid";
import { PromptDrawer } from "@/components/prompt-drawer";
import { useSearchParams } from "next/navigation";

// ─── Landing animation overlay ──────────────────────────────────────────────
function LandingAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"boot" | "reveal" | "done">("boot");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 1200);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-brand-bg flex flex-col items-center justify-center transition-all duration-1000 ${
        phase === "reveal" ? "opacity-0 blur-md pointer-events-none" : "opacity-100 blur-none"
      }`}
    >
      {/* Scanline effect */}
      <div className="scanline absolute inset-0 opacity-50" />

      {/* Elegant framing instead of heavy borders */}
      <div className="absolute top-8 left-8 w-1 h-1 bg-brand-yellow/60 rounded-full" />
      <div className="absolute top-8 right-8 w-1 h-1 bg-brand-yellow/60 rounded-full" />
      <div className="absolute bottom-8 left-8 w-1 h-1 bg-brand-yellow/60 rounded-full" />
      <div className="absolute bottom-8 right-8 w-1 h-1 bg-brand-yellow/60 rounded-full" />

      {/* Content */}
      <div className="flex flex-col items-center gap-6 select-none animate-blur-in">
        <span className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.4em]">
          INITIALIZING_SYSTEM
        </span>

        <div className="font-display text-5xl md:text-7xl text-white tracking-[0.15em] text-striped pb-2 leading-none font-light">
          PROMPT.LAB
        </div>

        <div className="flex items-center gap-3">
          {/* Animated progress bar - refined */}
          <div className="w-32 h-[1px] bg-zinc-800 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-brand-yellow/80 animate-[boot-progress_1s_ease-out_forwards]"
              style={{ width: phase === "boot" ? "0%" : "100%" }}
            />
            <div
              className={`absolute left-0 top-0 h-full bg-brand-yellow/80 transition-all duration-1000 ease-out ${
                phase === "boot" ? "w-0" : "w-full"
              }`}
            />
          </div>
          <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">LOADING</span>
        </div>

        <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em] mt-4">
          ARCHIVE_v0.4 <span className="opacity-50 mx-1">/</span> {CURATED_PROMPTS.length} ENTRIES
        </div>
      </div>
    </div>
  );
}

// ─── Home content with category filter ──────────────────────────────────────
function HomeContent({ isVisible }: { isVisible: boolean }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const searchParams = useSearchParams();
  const categoryFilter = searchParams?.get("category")?.toLowerCase() || "all";

  const filteredPrompts = useMemo(() => {
    let result = CURATED_PROMPTS;
    if (categoryFilter !== "all" && categoryFilter !== "saved") {
      result = result.filter(p => p.category.toLowerCase() === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.promptText.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, categoryFilter]);

  const categoryLabel = categoryFilter === "all" ? "ALL" : categoryFilter.toUpperCase();

  return (
    <div
      className={`min-h-screen bg-brand-bg flex flex-col relative w-full pt-10 transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <main className="max-w-7xl mx-auto w-full px-6 pb-20 flex-1">

        {/* Header Hero — staggered slide-up */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl md:text-6xl lg:text-[80px] text-white uppercase tracking-[0.1em] title-brutalist leading-[0.9] mb-8 select-none text-striped pb-2 font-light">
              ARCHIVE<br />
              <span className="text-zinc-400">SYSTEM</span>
            </h1>
            <p className="font-mono text-[11px] text-brand-text-muted uppercase tracking-[0.15em] leading-[1.8]">
              High-performance prompt extraction for neural<br className="hidden md:block" />
              media generation engines.
            </p>
          </div>

          <div className={`w-full md:w-[320px] shrink-0 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            <div className="relative flex items-center w-full group">
              <Search className="absolute left-4 text-brand-text-muted group-focus-within:text-white transition-colors" size={14} strokeWidth={2} />
              <input
                type="text"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-surface/50 border border-brand-border/60 hover:border-zinc-700 h-[44px] pl-11 pr-4 font-mono text-[11px] tracking-wide text-white placeholder:text-brand-text-muted focus:outline-none focus:border-brand-yellow/80 focus:bg-brand-surface transition-all rounded-[2px]"
                spellCheck={false}
                suppressHydrationWarning
              />
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className={`flex items-center gap-5 mb-10 transition-all duration-1000 delay-600 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white whitespace-nowrap">
            LATEST ENTRIES <span className="text-brand-text-muted opacity-50 ml-1">/ {categoryLabel}</span>
          </h2>
          <div className="h-[1px] bg-gradient-to-r from-brand-border/60 to-transparent flex-1" />
          <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-widest whitespace-nowrap">
            COUNT: {filteredPrompts.length}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={`transition-all duration-700 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <GalleryGrid
            prompts={filteredPrompts}
            selectedId={selectedPrompt?.id}
            onSelect={setSelectedPrompt}
          />
        </div>

        {/* Empty State */}
        {filteredPrompts.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center border border-brand-border border-dashed">
            <div className="font-display text-2xl text-zinc-600 uppercase tracking-widest mb-2">0 RESULTS FOUND</div>
            <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">NO ENTRIES MATCH YOUR QUERY.</div>
          </div>
        )}
      </main>

      <PromptDrawer
        prompt={selectedPrompt}
        isOpen={selectedPrompt !== null}
        onClose={() => setSelectedPrompt(null)}
      />
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function PromptOasisHome() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      <LandingAnimation onComplete={() => setBooted(true)} />
      <Suspense fallback={
        <div className="min-h-screen bg-brand-bg flex items-center justify-center">
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest animate-pulse">LOADING_ARCHIVE...</span>
        </div>
      }>
        <HomeContent isVisible={booted} />
      </Suspense>
    </>
  );
}
