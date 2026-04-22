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
      <div className="absolute top-8 left-8 w-1 h-1 bg-primary/60 rounded-full" />
      <div className="absolute top-8 right-8 w-1 h-1 bg-primary/60 rounded-full" />
      <div className="absolute bottom-8 left-8 w-1 h-1 bg-primary/60 rounded-full" />
      <div className="absolute bottom-8 right-8 w-1 h-1 bg-primary/60 rounded-full" />

      {/* Content */}
      <div className="flex flex-col items-center gap-6 select-none animate-blur-in">
        <span className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.4em]">
          INITIALIZING_SYSTEM
        </span>

        <div className="font-display text-5xl md:text-7xl text-white tracking-[0.15em] pb-2 leading-none font-bold">
          PROMPT_OS
        </div>

        <div className="flex items-center gap-3">
          {/* Animated progress bar - refined */}
          <div className="w-32 h-[1px] bg-brand-surface-container relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-primary/80 animate-[boot-progress_1s_ease-out_forwards]"
              style={{ width: phase === "boot" ? "0%" : "100%" }}
            />
            <div
              className={`absolute left-0 top-0 h-full bg-primary/80 transition-all duration-1000 ease-out ${
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

        {/* Header Hero */}
        <div className={`flex flex-col mb-12 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-[80px] text-white uppercase tracking-tight leading-[1] mb-2 select-none font-bold">
                ARCHIVE<br />
                <span className="text-secondary drop-shadow-[0_0_15px_rgba(76,215,246,0.3)]">SYSTEM</span>
              </h1>
            </div>

            {/* Stats Boxes */}
            <div className="flex items-center gap-4">
              <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded px-5 py-4 w-[180px]">
                <div className="font-mono text-[11px] text-brand-text-muted tracking-widest uppercase mb-1">SYS_LATENCY:</div>
                <div className="font-sans text-[15px] font-medium text-secondary">12ms</div>
              </div>
              <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded px-5 py-4 w-[180px]">
                <div className="font-mono text-[11px] text-brand-text-muted tracking-widest uppercase mb-1">TOTAL_ENTRIES:</div>
                <div className="font-sans text-[15px] font-medium text-white">{CURATED_PROMPTS.length.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Secondary Search / Filters */}
          <div className="mt-12 bg-brand-surface-container border border-brand-border rounded flex items-center px-4 h-[60px] group transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(208,188,255,0.1)]">
            <Search className="text-brand-text-muted group-focus-within:text-primary transition-colors" size={18} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Query latent space by prompt, model, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none h-full px-4 font-sans text-[14px] text-white placeholder:text-brand-text-muted focus:outline-none"
              spellCheck={false}
              suppressHydrationWarning
            />
            <button className="h-[36px] px-6 bg-[#353534] hover:bg-[#494454] text-white font-mono text-[11px] uppercase tracking-widest rounded transition-colors">
              FILTERS
            </button>
          </div>
        </div>

        {/* Section Divider - removed in favor of direct grid, but we can keep the count subtle if needed. The image doesn't show a strong divider. */}

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
