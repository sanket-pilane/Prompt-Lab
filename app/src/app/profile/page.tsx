"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, Zap, Clock, Package, Share2, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const dummyUser = {
    name: "ARCHIVE_SYSTEM_OPERATOR",
    email: "sys_op_04@prompt-lab.neural",
    role: "ELITE RESEARCHER",
    status: "ACTIVE",
    joinDate: "2024.03.12",
    totalPrompts: 1402,
    latencyAvg: "12ms",
    clearance: "LEVEL_05",
  };

  const stats = [
    { label: "TOTAL_PROMPTS", value: dummyUser.totalPrompts, icon: Package },
    { label: "AVG_LATENCY", value: dummyUser.latencyAvg, icon: Zap },
    { label: "ACCESS_CLEARANCE", value: dummyUser.clearance, icon: Shield },
    { label: "UPTIME", value: "99.98%", icon: Clock },
  ];

  return (
    <div className="max-w-5xl mx-auto p-10 animate-blur-in">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-10 items-start mb-16 relative">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded bg-brand-surface-container border border-brand-border flex items-center justify-center relative overflow-hidden group shadow-[0_0_30px_rgba(208,188,255,0.05)]">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-50" />
           <User size={80} strokeWidth={1} className="text-primary opacity-80" />
           <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
             <Edit3 size={24} className="text-white" />
           </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
             <span className="bg-primary/10 border border-primary/30 text-primary font-mono text-[10px] px-3 py-1 rounded tracking-widest uppercase">
               {dummyUser.status}
             </span>
             <span className="bg-[#1c1b1b] border border-[#2a2a2a] text-brand-text-muted font-mono text-[10px] px-3 py-1 rounded tracking-widest uppercase">
               {dummyUser.role}
             </span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white uppercase tracking-tight mb-4">
            {dummyUser.name}
          </h1>
          
          <div className="flex flex-col gap-2 font-mono text-sm text-brand-text-muted">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-primary" />
              <span>{dummyUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-secondary" />
              <span>LOGGED_IN_SINCE: {dummyUser.joinDate}</span>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="h-10 px-6 bg-primary text-[#3c0091] font-display text-xs font-bold uppercase tracking-widest rounded hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(208,188,255,0.2)]">
              UPDATE_PROTOCOL
            </button>
            <button className="h-10 px-6 bg-[#1c1b1b] border border-[#2a2a2a] text-white font-display text-xs font-bold uppercase tracking-widest rounded hover:bg-[#2a2a2a] transition-all">
              <Share2 size={16} className="inline mr-2" /> SHARE_ID
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 rounded relative group hover:border-primary/50 transition-colors"
          >
            <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-widest mb-4 flex items-center justify-between">
              {stat.label}
              <stat.icon size={12} className="text-brand-text-muted group-hover:text-primary transition-colors" />
            </div>
            <div className="font-display text-2xl font-bold text-white tracking-tight">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Timeline / Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wide">SYSTEM_ACTIVITY</h2>
            <div className="h-[1px] bg-brand-border flex-1" />
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-px h-full bg-brand-border relative">
                  <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(208,188,255,0.8)]" />
                </div>
                <div className="pb-6">
                  <div className="font-mono text-[10px] text-brand-text-muted mb-1 uppercase tracking-widest">2024.04.22 // 14:23:01</div>
                  <div className="text-sm font-sans text-white mb-1">PROMPT_ARCHIVE_ACCESS: [ENTRY_042_BETA]</div>
                  <div className="text-xs font-mono text-brand-text-muted">PROTOCOL_HASH: 0x4f2e...9a12</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wide">SYSTEM_INFO</h2>
            <div className="h-[1px] bg-brand-border flex-1" />
          </div>

          <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-8 rounded space-y-6">
             <div>
               <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-widest mb-2">NEURAL_ENGINE</div>
               <div className="text-sm text-white font-medium uppercase tracking-wide">V-LABS CORE v4.2</div>
             </div>
             <div>
               <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-widest mb-2">DATA_CENTER</div>
               <div className="text-sm text-white font-medium uppercase tracking-wide">REGION_NORTH_ALPHA</div>
             </div>
             <div>
               <div className="font-mono text-[10px] text-brand-text-muted uppercase tracking-widest mb-2">SECURITY_TOKEN</div>
               <div className="text-xs text-secondary font-mono break-all bg-brand-surface-container p-2 rounded border border-brand-border">
                 SYS_882_NX_991_PROTO_K1
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
