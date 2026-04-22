"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NavbarContent() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get("category")?.toLowerCase() || "all";

  const categories = [
    { id: "all", label: "All Archive", href: "/" },
    { id: "image", label: "Image", href: "/?category=image" },
    { id: "video", label: "Video", href: "/?category=video" },
    { id: "3d", label: "3D", href: "/?category=3d" },
    { id: "audio", label: "Audio", href: "/?category=audio" },
    { id: "saved", label: "Saved (0)", href: "/?category=saved" },
  ];

  return (
    <nav className="w-full border-b border-brand-border/40 bg-brand-bg/80 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex flex-col select-none group">
            <span className="font-mono text-[9px] text-brand-text-muted uppercase tracking-[0.2em] leading-none mb-1 group-hover:text-zinc-400 transition-colors">Archive_v.04</span>
            <span className="font-display text-[22px] text-white tracking-[0.15em] leading-none text-striped pb-1 opacity-90 group-hover:opacity-100 transition-opacity">PROMPT.LAB</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 mt-1">
            {categories.map(cat => {
              const isActive = currentCategory === cat.id;
              return (
                <Link 
                  key={cat.id} 
                  href={cat.href} 
                  className={`relative font-mono text-[11px] uppercase tracking-[0.15em] transition-all duration-300 py-2 ${
                    isActive 
                      ? "text-white font-medium" 
                      : "text-brand-text-muted hover:text-zinc-300 font-normal"
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-[1px] bg-brand-yellow/80" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center">
          <Link 
            href="/optimizer" 
            className="font-mono text-[10px] font-medium border border-brand-border/60 text-white px-5 py-2.5 uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-all duration-300 rounded-[2px]"
          >
            Image Optimizer
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={
      <nav className="w-full border-b border-brand-border bg-brand-bg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <span className="font-display text-2xl text-white tracking-widest leading-none text-striped pb-1">PROMPT.LAB</span>
        </div>
      </nav>
    }>
      <NavbarContent />
    </Suspense>
  );
}
