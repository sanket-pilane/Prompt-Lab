"use client";

import { useRef, useState, useCallback, memo } from "react";

interface GalleryCardProps {
  id: string;
  title: string;
  imageUrl: string;
  promptText: string;
  model: string;
  category: string;
  videoUrl?: string;
  isSelected: boolean;
  index: number;
  onClick: () => void;
}

export const GalleryCard = memo(function GalleryCard({
  id,
  title,
  imageUrl,
  promptText,
  model,
  category,
  videoUrl,
  isSelected,
  index,
  onClick,
}: GalleryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const isVideo = !!videoUrl;

  // When video loads its metadata, mark it ready
  const handleVideoCanPlay = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    const video = videoRef.current;
    if (!video) return;

    // Build a play handler after load if not yet ready
    const doPlay = () => {
      video.currentTime = 0;
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => setIsVideoPlaying(true))
          .catch(() => setIsVideoPlaying(false));
      }
    };

    if (video.readyState >= 3) {
      // HAVE_FUTURE_DATA — can play immediately
      doPlay();
    } else {
      // Trigger load and wait
      video.load();
      video.addEventListener("canplay", doPlay, { once: true });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsVideoPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  return (
    <div
      className="group cursor-pointer border border-[#2a2a2a] bg-[#1c1b1b] hover:bg-[#201f1f] hover:border-primary transition-all duration-300 animate-slide-up opacity-0 rounded flex flex-col overflow-hidden hover:shadow-[0_0_15px_rgba(208,188,255,0.1)] relative"
      style={{ animationDelay: `${(index % 24) * 0.05}s`, animationFillMode: "forwards" }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2 pointer-events-none">
        <div className="bg-[#0e0e0e]/80 backdrop-blur border border-[#353534] px-2 py-1 rounded-[2px]">
          <span className="font-mono text-[9px] text-[#e5e2e1] uppercase tracking-widest">ID: {id.padStart(3, "0")}</span>
        </div>
        {isVideo && (
          <div className="bg-[#0e0e0e]/80 backdrop-blur border border-[#353534] px-2 py-1 rounded-[2px] flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-primary uppercase tracking-widest">PROCESSING</span>
          </div>
        )}
      </div>
      
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-[#0e0e0e]/80 backdrop-blur border border-[#353534] w-7 h-7 rounded flex items-center justify-center text-brand-text-muted hover:text-white transition-colors cursor-pointer pointer-events-auto">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        </div>
      </div>

      {/* Media Container */}
      <div className="w-full h-[280px] overflow-hidden bg-[#0a0a0a] relative shrink-0">
        {/* Poster / Thumbnail Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] scale-[1.02] ${
            isSelected ? "opacity-40" : (!isVideo ? "group-hover:scale-105 group-hover:opacity-90" : "")
          } ${isVideo && isVideoPlaying ? "opacity-0 scale-100" : "opacity-100"}`}
        />

        {/* Video element — only rendered for video prompts */}
        {isVideo && (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              onCanPlay={handleVideoCanPlay}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isVideoPlaying ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        )}

        {/* Selected overlay */}
        {isSelected && (
          <div className="absolute inset-0 ring-1 ring-inset ring-primary pointer-events-none bg-primary/5" />
        )}
      </div>

      {/* Card Meta */}
      <div className="p-4 flex flex-col flex-1 relative bg-gradient-to-t from-[#131313] via-[#1c1b1b] to-transparent">
        <h3 className="font-display text-[20px] font-bold leading-tight tracking-tight text-white line-clamp-1 mb-1">
          {title}
        </h3>
        
        <p className="font-sans text-[12px] text-brand-text-muted line-clamp-2 leading-relaxed mb-4">
          &quot;{promptText}&quot;
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <div className="bg-[#2a2a2a] px-2 py-1 rounded-[2px] border border-[#353534]">
             <span className="font-mono text-[9px] text-[#e5e2e1] uppercase">{model}</span>
          </div>
          <div className="bg-[#2a2a2a] px-2 py-1 rounded-[2px] border border-[#353534]">
             <span className="font-mono text-[9px] text-[#e5e2e1] uppercase">{category}</span>
          </div>
          {isVideo && (
            <div className="ml-auto text-brand-text-muted group-hover:text-primary transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h10a2 2 0 0 1 2 2v3.382l4.163-3.331A1 1 0 0 1 22 6.833v10.334a1 1 0 0 1-1.625.78L16 14.618V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
