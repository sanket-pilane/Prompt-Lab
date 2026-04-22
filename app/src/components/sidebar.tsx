"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Image as ImageIcon, Sparkles, Settings, Terminal, LogOut, Plus } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "GALLERY", href: "/", icon: LayoutGrid },

    { label: "PROMPT OPTIMIZER", href: "/optimizer", icon: Sparkles },
    { label: "SETTINGS", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-[240px] h-full bg-[#0a0a0a] border-r border-brand-border flex flex-col shrink-0">
      <Link href="/profile" className="p-6 pb-4 block hover:bg-white/[0.02] transition-colors group">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-brand-surface-container overflow-hidden border border-brand-border group-hover:border-primary transition-colors">
            {/* Using a placeholder gradient for the avatar */}
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-80" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-[15px] font-bold text-white tracking-wide group-hover:text-primary transition-colors">ARCHIVE_SYS</span>
            <span className="font-mono text-[10px] text-secondary tracking-widest uppercase">LATENCY: 12ms</span>
          </div>
        </div>

        <button className="w-full h-10 bg-primary hover:bg-primary/90 text-[#3c0091] font-display text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 rounded transition-all shadow-[0_0_15px_rgba(208,188,255,0.15)] hover:shadow-[0_0_20px_rgba(208,188,255,0.3)]">
          <Plus size={14} /> GENERATE_NEW
        </button>
      </Link>

      <div className="h-px w-full bg-brand-border" />

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded text-[11px] font-mono tracking-widest uppercase transition-all duration-300 ${isActive
                ? "bg-brand-surface-container text-white font-medium"
                : "text-brand-text-muted hover:text-white hover:bg-white/5"
                }`}
            >
              <item.icon size={16} className={isActive ? "text-primary" : "text-brand-text-muted"} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="h-px w-full bg-brand-border" />

      {/* Bottom Navigation */}
      <div className="px-4 py-4 flex flex-col gap-1">
        <Link
          href="/logs"
          className="flex items-center gap-3 px-4 py-3 rounded text-[11px] font-mono tracking-widest uppercase text-brand-text-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <Terminal size={16} strokeWidth={1.5} />
          LOGS
        </Link>
        <button
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded text-[11px] font-mono tracking-widest uppercase text-brand-text-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={16} strokeWidth={1.5} />
          LOGOUT
        </button>
      </div>
    </aside>
  );
}
