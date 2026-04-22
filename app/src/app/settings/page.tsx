"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Moon, Bell, Shield, Cpu, Database, Eye, Volume2 } from "lucide-react";

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
        enabled ? "bg-primary" : "bg-[#353534]"
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
          enabled
            ? "left-[22px] bg-[#3c0091]"
            : "left-0.5 bg-[#958ea0]"
        }`}
      />
    </button>
  );
}

interface SettingRow {
  label: string;
  description: string;
  key: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    darkMode: true,
    notifications: true,
    autoSave: true,
    highPerf: false,
    analytics: false,
    soundEffects: false,
  });

  const toggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections: { title: string; rows: SettingRow[] }[] = [
    {
      title: "DISPLAY",
      rows: [
        { label: "DARK_MODE", description: "Use vantablack color scheme across the interface.", key: "darkMode", icon: Moon },
        { label: "HIGH_PERF_RENDER", description: "Disable motion blur and glassmorphism for lower-end devices.", key: "highPerf", icon: Monitor },
      ],
    },
    {
      title: "NOTIFICATIONS",
      rows: [
        { label: "PUSH_ALERTS", description: "Receive push notifications for new archive entries.", key: "notifications", icon: Bell },
        { label: "SOUND_EFFECTS", description: "Play audio feedback on interactions.", key: "soundEffects", icon: Volume2 },
      ],
    },
    {
      title: "DATA & PRIVACY",
      rows: [
        { label: "AUTO_SAVE", description: "Automatically persist session data to local storage.", key: "autoSave", icon: Database },
        { label: "USAGE_ANALYTICS", description: "Share anonymous usage data to improve the platform.", key: "analytics", icon: Eye },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-10 animate-blur-in">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={20} className="text-primary" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
            SETTINGS
          </h1>
        </div>
        <p className="font-mono text-[11px] text-brand-text-muted uppercase tracking-widest">
          SYSTEM_PREFERENCES // NEURAL_PROTOCOL_CONFIG
        </p>
      </div>

      {sections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-wide">
              {section.title}
            </h2>
            <div className="h-[1px] bg-brand-border flex-1" />
          </div>

          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded divide-y divide-[#2a2a2a]">
            {section.rows.map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between px-6 py-5 group hover:bg-[#201f1f] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <row.icon
                    size={16}
                    className="text-brand-text-muted group-hover:text-primary transition-colors shrink-0"
                  />
                  <div>
                    <div className="font-mono text-[12px] text-white font-medium tracking-wider">
                      {row.label}
                    </div>
                    <div className="font-sans text-[11px] text-brand-text-muted mt-0.5 leading-relaxed">
                      {row.description}
                    </div>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={toggles[row.key] ?? false}
                  onToggle={() => toggle(row.key)}
                />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-display text-lg font-bold text-white uppercase tracking-wide">
            SYSTEM
          </h2>
          <div className="h-[1px] bg-brand-border flex-1" />
        </div>

        <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu size={14} className="text-brand-text-muted" />
              <span className="font-mono text-[11px] text-brand-text-muted uppercase tracking-widest">VERSION</span>
            </div>
            <span className="font-mono text-[12px] text-white">PROMPT_OS v2.0.4</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database size={14} className="text-brand-text-muted" />
              <span className="font-mono text-[11px] text-brand-text-muted uppercase tracking-widest">CACHE_SIZE</span>
            </div>
            <span className="font-mono text-[12px] text-white">24.8 MB</span>
          </div>
          <div className="pt-4 border-t border-[#2a2a2a]">
            <button className="h-10 px-6 bg-[#2a2a2a] hover:bg-[#353534] text-brand-text-muted hover:text-white font-display text-xs font-bold uppercase tracking-widest rounded transition-all">
              CLEAR_CACHE
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
