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
      className="group cursor-pointer border border-brand-border bg-brand-surface hover:border-zinc-400 transition-all duration-300 animate-slide-up opacity-0"
      style={{ animationDelay: `${(index % 24) * 0.05}s`, animationFillMode: "forwards" }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media Container */}
      <div className="aspect-video w-full overflow-hidden bg-brand-bg relative border-b border-brand-border">
        {/* Poster / Thumbnail Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-500 scale-100 ${
            isSelected ? "grayscale opacity-80" : (!isVideo ? "group-hover:grayscale group-hover:scale-105" : "")
          } ${isVideo && isVideoPlaying ? "opacity-0" : "opacity-100"}`}
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
            <div className={`absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/80 border border-brand-border transition-opacity duration-300 ${
              isHovering ? "opacity-0" : "opacity-100"
            }`}>
              <div className="w-0 h-0 border-l-[5px] border-l-brand-yellow border-y-[3px] border-y-transparent" />
              <span className="font-mono text-[9px] text-brand-yellow font-bold uppercase tracking-wider">VIDEO</span>
            </div>

            {/* PLAYING badge — shown during playback */}
            <div className={`absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-brand-yellow/90 transition-opacity duration-300 ${
              isVideoPlaying ? "opacity-100" : "opacity-0"
            }`}>
              <span className="font-mono text-[9px] text-black font-black uppercase tracking-wider">◼ PLAYING</span>
            </div>
          </>
        )}

        {/* 3D badge */}
        {category === "3D" && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/80 border border-brand-border">
            <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider">3D ASSET</span>
          </div>
        )}

        {/* Selected overlay */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-brand-yellow pointer-events-none" />
        )}
      </div>

      {/* Card Meta */}
      <div className="p-4 flex flex-col justify-between h-[100px]">
        <div className="flex justify-between items-start">
          <h3 className="font-display text-xl uppercase tracking-wider text-white truncate title-brutalist group-hover:text-brand-yellow transition-colors duration-300">
            {title}
          </h3>
          <span className={`font-mono text-[10px] px-1 py-0.5 ml-2 font-bold leading-none shrink-0 border transition-colors duration-300 ${
            isSelected ? "bg-brand-yellow text-black border-brand-yellow" : "bg-white text-black border-white"
          }`}>
            {id.padStart(3, "0")}
          </span>
        </div>

        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-2 group-hover:text-zinc-400 transition-colors">
          {model} // {category}
        </div>
      </div>
    </div>
  );
});
