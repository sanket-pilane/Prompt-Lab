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
      className={`fixed inset-0 z-[200] bg-brand-bg flex flex-col items-center justify-center transition-opacity duration-700 ${
        phase === "reveal" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Scanline effect */}
      <div className="scanline absolute inset-0" />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-brand-yellow" />
      <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-brand-yellow" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-brand-yellow" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-brand-yellow" />

      {/* Content */}
      <div className="flex flex-col items-center gap-6 select-none">
        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.5em]">
          INITIALIZING_SYSTEM
        </span>

        <div className="font-display text-6xl md:text-8xl text-white tracking-widest text-striped pb-2 leading-none">
          PROMPT.LAB
        </div>

        <div className="flex items-center gap-2">
          {/* Animated progress bar */}
          <div className="w-48 h-[2px] bg-zinc-800 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-brand-yellow animate-[boot-progress_1s_ease-out_forwards]"
              style={{ width: phase === "boot" ? "0%" : "100%" }}
            />
            <div
              className={`absolute left-0 top-0 h-full bg-brand-yellow transition-all duration-1000 ease-out ${
                phase === "boot" ? "w-0" : "w-full"
              }`}
            />
          </div>
          <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">LOADING</span>
        </div>

        <div className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
          ARCHIVE_v0.4 // {CURATED_PROMPTS.length} ENTRIES
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
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 transition-all duration-700 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}>
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-wider title-brutalist leading-[0.85] mb-6 select-none text-striped pb-2">
              ARCHIVE<br />
              SYSTEM
            </h1>
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
              // HIGH PERFORMANCE PROMPT EXTRACTION FOR NEURAL<br className="hidden md:block" />
              MEDIA GENERATION ENGINES.
            </p>
          </div>

          <div className={`w-full md:w-[350px] shrink-0 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            <div className="relative flex items-center w-full group">
              <Search className="absolute left-4 text-zinc-500 group-focus-within:text-brand-yellow transition-colors" size={16} />
              <input
                type="text"
                placeholder="PROMPT_SEARCH_QUERY"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border h-12 pl-12 pr-4 font-mono text-xs uppercase text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-yellow transition-colors"
                spellCheck={false}
                suppressHydrationWarning
              />
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className={`flex items-center gap-4 mb-8 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <h2 className="font-display text-2xl uppercase tracking-widest text-white whitespace-nowrap">
            LATEST_ENTRIES<span className="text-zinc-600">//{categoryLabel}</span>
          </h2>
          <div className="h-[1px] bg-brand-border flex-1" />
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest whitespace-nowrap">
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
