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
    <nav className="w-full border-b border-brand-border bg-brand-bg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex flex-col select-none">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-0.5">Index v.04</span>
            <span className="font-display text-2xl text-white tracking-widest leading-none text-striped pb-1">PROMPT.LAB</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 mt-2">
            {categories.map(cat => {
              const isActive = currentCategory === cat.id;
              return (
                <Link 
                  key={cat.id} 
                  href={cat.href} 
                  className={`font-mono text-xs font-bold uppercase tracking-wider pb-1 transition-colors ${
                    isActive 
                      ? "text-white border-b-2 border-white" 
                      : "text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center">
          <Link 
            href="/optimizer" 
            className="font-mono text-xs font-bold bg-white text-zinc-950 px-4 py-2 uppercase tracking-wider hover:bg-zinc-200 transition-colors"
          >
            Image Prompt Optimizer
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
