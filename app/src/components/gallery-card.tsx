"use client";

import { useRef, useState, useCallback, memo, useEffect } from "react";

interface GalleryCardProps {
  id: string;
  title: string;
  imageUrl: string;
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
      className="group cursor-pointer border border-brand-border/40 bg-brand-surface/40 hover:bg-brand-surface hover:border-brand-border transition-all duration-500 animate-slide-up opacity-0 rounded-[2px] overflow-hidden hover:shadow-2xl hover:shadow-brand-yellow/5"
      style={{ animationDelay: `${(index % 24) * 0.05}s`, animationFillMode: "forwards" }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media Container */}
      <div className="aspect-video w-full overflow-hidden bg-[#050505] relative border-b border-brand-border/30">
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

            {/* Loading spinner shown while buffering on hover */}
            {isHovering && !isVideoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-6 h-6 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* VIDEO badge — shown when not hovering */}
            <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 transition-opacity duration-500 rounded-[2px] ${
              isHovering ? "opacity-0" : "opacity-100"
            }`}>
              <div className="w-1 h-1 bg-brand-yellow rounded-full animate-pulse" />
              <span className="font-mono text-[8px] text-white font-medium uppercase tracking-[0.2em]">VIDEO</span>
            </div>

            {/* PLAYING badge — shown during playback */}
            <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-brand-yellow/90 backdrop-blur-md transition-opacity duration-500 rounded-[2px] ${
              isVideoPlaying ? "opacity-100" : "opacity-0"
            }`}>
              <span className="font-mono text-[8px] text-black font-bold uppercase tracking-[0.2em]">PLAYING</span>
            </div>
          </>
        )}

        {/* 3D badge */}
        {category === "3D" && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-[2px]">
            <span className="font-mono text-[8px] text-emerald-400 font-medium uppercase tracking-[0.2em]">3D ASSET</span>
          </div>
        )}

        {/* Selected overlay */}
        {isSelected && (
          <div className="absolute inset-0 ring-1 ring-inset ring-brand-yellow/50 pointer-events-none bg-brand-yellow/5" />
        )}
      </div>

      {/* Card Meta */}
      <div className="p-5 flex flex-col justify-between h-[105px]">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-sans text-[15px] font-medium leading-tight tracking-wide text-zinc-100 line-clamp-2 group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <span className={`font-mono text-[9px] px-1.5 py-0.5 font-medium tracking-widest shrink-0 border transition-all duration-500 rounded-[2px] ${
            isSelected ? "bg-brand-yellow/10 text-brand-yellow border-brand-yellow/30" : "bg-brand-border/20 text-brand-text-muted border-brand-border/40 group-hover:border-zinc-500"
          }`}>
            {id.padStart(3, "0")}
          </span>
        </div>

        <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em] mt-2 group-hover:text-zinc-400 transition-colors flex items-center gap-2">
          <span>{model}</span>
          <span className="w-1 h-1 bg-brand-border rounded-full" />
          <span>{category}</span>
        </div>
      </div>
    </div>
  );
});
