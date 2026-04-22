"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Search, Bell, MonitorPlay } from "lucide-react";

function NavbarContent() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get("category")?.toLowerCase() || "all";

  const categories = [
    { id: "all", label: "ARCHIVE", href: "/" },
    { id: "image", label: "IMAGE", href: "/?category=image" },
    { id: "video", label: "VIDEO", href: "/?category=video" },
    { id: "3d", label: "3D", href: "/?category=3d" },
    { id: "audio", label: "AUDIO", href: "/?category=audio" },
  ];

  return (
    <nav className="w-full border-b border-brand-border bg-brand-bg sticky top-0 z-50 h-[72px] flex items-center justify-between px-6 shrink-0">
      
      {/* Brand & Tabs */}
      <div className="flex items-center gap-10 h-full">
        <div className="font-display text-[18px] text-primary leading-none uppercase tracking-wide">
          PROMPT_OS<br/><span className="text-primary/70 text-[14px]">v2.0</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 h-full">
          {categories.map(cat => {
            const isActive = currentCategory === cat.id;
            return (
              <Link 
                key={cat.id} 
                href={cat.href} 
                className={`relative font-mono text-[11px] uppercase tracking-[0.15em] transition-all duration-300 h-full flex items-center ${
                  isActive 
                    ? "text-primary font-bold" 
                    : "text-brand-text-muted hover:text-white font-medium"
                }`}
              >
                {cat.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(208,188,255,0.6)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Header Search */}
        <div className="relative hidden lg:flex items-center w-[300px] group">
          <Search className="absolute left-3 text-brand-text-muted group-focus-within:text-primary transition-colors" size={14} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search archive..."
            className="w-full bg-brand-surface-container border border-brand-border h-[36px] pl-9 pr-4 font-mono text-[11px] text-white placeholder:text-brand-text-muted focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(208,188,255,0.2)] transition-all rounded"
          />
        </div>

        <div className="flex items-center gap-4 text-brand-text-muted">
          <button className="hover:text-white transition-colors"><Bell size={18} strokeWidth={1.5} /></button>
          <button className="hover:text-white transition-colors"><MonitorPlay size={18} strokeWidth={1.5} /></button>
        </div>

        <Link 
          href="/profile"
          className="flex items-center gap-2 h-[36px] px-4 bg-primary/10 border border-primary/40 text-primary hover:bg-primary hover:text-[#3c0091] font-display text-xs font-semibold uppercase tracking-widest rounded transition-all group"
        >
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-white group-hover:border-white transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          PROFILE
        </Link>
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
