"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { GalleryCard } from "./gallery-card";
import { Prompt } from "@/lib/types";


interface GalleryGridProps {
  prompts: Prompt[];
  selectedId?: string | null;
  onSelect: (prompt: Prompt) => void;
}

const PAGE_SIZE = 24;

export function GalleryGrid({ prompts, selectedId, onSelect }: GalleryGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset visible count when prompts change (category/search filter)
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [prompts]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, prompts.length));
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [prompts.length]);

  const visiblePrompts = useMemo(
    () => prompts.slice(0, visibleCount),
    [prompts, visibleCount]
  );

  const handleSelect = useCallback(
    (prompt: Prompt) => onSelect(prompt),
    [onSelect]
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visiblePrompts.map((prompt, i) => (
          <GalleryCard
            key={prompt.id}
            index={i}
            id={prompt.id}
            title={prompt.title}
            imageUrl={prompt.imageUrl}
            promptText={prompt.promptText}
            model={prompt.model}
            category={prompt.category}
            videoUrl={prompt.videoUrl}
            isSelected={selectedId === prompt.id}
            onClick={() => handleSelect(prompt)}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {visibleCount < prompts.length && (
        <div ref={sentinelRef} className="w-full py-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 opacity-50">
            <div className="w-4 h-4 border border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em]">
              LOADING / {visibleCount} OF {prompts.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
