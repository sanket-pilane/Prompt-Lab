"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Filter, Trash2, Download } from "lucide-react";

type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
}

const DUMMY_LOGS: LogEntry[] = [
  { id: "1", timestamp: "2024-04-22T14:23:01.412Z", level: "INFO", module: "ARCHIVE_SYS", message: "Session initialized. User ARCHIVE_SYS connected." },
  { id: "2", timestamp: "2024-04-22T14:23:02.100Z", level: "DEBUG", module: "RENDER_PIPE", message: "GPU acceleration enabled. WebGL 2.0 context acquired." },
  { id: "3", timestamp: "2024-04-22T14:23:05.221Z", level: "INFO", module: "DATA_LOADER", message: "Loaded 1,373 prompt entries from local dataset." },
  { id: "4", timestamp: "2024-04-22T14:24:12.003Z", level: "WARN", module: "NETWORK", message: "External CDN latency exceeded 200ms threshold. Falling back to cache." },
  { id: "5", timestamp: "2024-04-22T14:25:00.142Z", level: "INFO", module: "GALLERY_GRID", message: "Infinite scroll observer attached. Page size: 24." },
  { id: "6", timestamp: "2024-04-22T14:26:33.891Z", level: "ERROR", module: "VIDEO_PLAYER", message: "CORS blocked: https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" },
  { id: "7", timestamp: "2024-04-22T14:27:10.552Z", level: "INFO", module: "PROMPT_DRAWER", message: "Entry #042 accessed. Prompt text loaded to clipboard buffer." },
  { id: "8", timestamp: "2024-04-22T14:28:01.000Z", level: "DEBUG", module: "CACHE_MGR", message: "IndexedDB history sync complete. 3 items persisted." },
  { id: "9", timestamp: "2024-04-22T14:30:15.700Z", level: "INFO", module: "OPTIMIZER", message: "Gemini 3 Flash API endpoint pinged. Status: 200 OK." },
  { id: "10", timestamp: "2024-04-22T14:31:44.123Z", level: "WARN", module: "MEMORY", message: "Heap usage at 78%. Consider clearing cached thumbnails." },
  { id: "11", timestamp: "2024-04-22T14:33:00.000Z", level: "INFO", module: "AUTH", message: "Session token refreshed. TTL: 3600s." },
  { id: "12", timestamp: "2024-04-22T14:35:22.456Z", level: "DEBUG", module: "RENDER_PIPE", message: "Repainting 24 card nodes. Batch animation queued." },
];

const LEVEL_COLORS: Record<LogLevel, string> = {
  INFO: "text-secondary",
  WARN: "text-amber-400",
  ERROR: "text-red-400",
  DEBUG: "text-brand-text-muted",
};

const LEVEL_BG: Record<LogLevel, string> = {
  INFO: "bg-secondary/10 border-secondary/30",
  WARN: "bg-amber-400/10 border-amber-400/30",
  ERROR: "bg-red-400/10 border-red-400/30",
  DEBUG: "bg-[#353534] border-[#494454]",
};

export default function LogsPage() {
  const [filter, setFilter] = useState<LogLevel | "ALL">("ALL");

  const filtered = filter === "ALL" ? DUMMY_LOGS : DUMMY_LOGS.filter((l) => l.level === filter);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 });
  };

  return (
    <div className="max-w-6xl mx-auto p-10 animate-blur-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Terminal size={20} className="text-primary" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
              SYSTEM_LOGS
            </h1>
          </div>
          <p className="font-mono text-[11px] text-brand-text-muted uppercase tracking-widest">
            RUNTIME_OUTPUT // {DUMMY_LOGS.length} ENTRIES CAPTURED
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-9 px-4 bg-[#1c1b1b] border border-[#2a2a2a] text-brand-text-muted hover:text-white font-mono text-[10px] uppercase tracking-widest rounded transition-colors flex items-center gap-2">
            <Download size={12} /> EXPORT
          </button>
          <button className="h-9 px-4 bg-[#1c1b1b] border border-[#2a2a2a] text-brand-text-muted hover:text-red-400 font-mono text-[10px] uppercase tracking-widest rounded transition-colors flex items-center gap-2">
            <Trash2 size={12} /> CLEAR
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={14} className="text-brand-text-muted" />
        {(["ALL", "INFO", "WARN", "ERROR", "DEBUG"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`h-7 px-3 font-mono text-[10px] uppercase tracking-widest rounded transition-all border ${
              filter === level
                ? "bg-primary/10 border-primary/40 text-primary font-bold"
                : "bg-[#1c1b1b] border-[#2a2a2a] text-brand-text-muted hover:text-white hover:border-[#353534]"
            }`}
          >
            {level}
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] text-brand-text-muted uppercase tracking-widest">
          SHOWING: {filtered.length}
        </span>
      </div>

      {/* Log Entries */}
      <div className="bg-[#0e0e0e] border border-[#2a2a2a] rounded overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-[90px_60px_140px_1fr] gap-4 px-5 py-3 border-b border-[#2a2a2a] bg-[#1c1b1b]">
          <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-widest">TIME</div>
          <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-widest">LEVEL</div>
          <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-widest">MODULE</div>
          <div className="font-mono text-[9px] text-brand-text-muted uppercase tracking-widest">MESSAGE</div>
        </div>

        {/* Rows */}
        {filtered.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-[90px_60px_140px_1fr] gap-4 px-5 py-3 border-b border-[#1c1b1b] hover:bg-[#1c1b1b] transition-colors group"
          >
            <div className="font-mono text-[11px] text-brand-text-muted tabular-nums">
              {formatTime(log.timestamp)}
            </div>
            <div>
              <span className={`font-mono text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${LEVEL_BG[log.level]} ${LEVEL_COLORS[log.level]}`}>
                {log.level}
              </span>
            </div>
            <div className="font-mono text-[11px] text-primary/80 uppercase tracking-wider truncate">
              {log.module}
            </div>
            <div className="font-mono text-[12px] text-[#cbc3d7] leading-relaxed group-hover:text-white transition-colors truncate">
              {log.message}
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <div className="font-mono text-[11px] text-brand-text-muted uppercase tracking-widest">
              NO LOGS MATCHING FILTER: {filter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
