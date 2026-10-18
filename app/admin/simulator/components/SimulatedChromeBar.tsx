'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Star, Sparkles, X, Plus, Minus, Square } from 'lucide-react';

interface SimulatedChromeBarProps {
  url: string;
  tabTitle: string;
  favicon?: 'tiktok' | 'shopify';
  onReload?: () => void;
  showChromeBar: boolean;
  onToggleChromeBar: () => void;
}

export function SimulatedChromeBar({
  url,
  tabTitle,
  favicon = 'tiktok',
  onReload,
  showChromeBar,
  onToggleChromeBar,
}: SimulatedChromeBarProps) {
  if (!showChromeBar) {
    return (
      <button
        type="button"
        onClick={onToggleChromeBar}
        title="Show Fake Chrome Browser Header"
        className="fixed top-1 right-2 z-50 text-[10px] bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white px-2 py-0.5 rounded border border-white/10 opacity-30 hover:opacity-100 transition-opacity"
      >
        Show Chrome Tab Bar
      </button>
    );
  }

  return (
    <div className="w-full bg-[#1F2024] select-none text-slate-300 border-b border-black/40 shrink-0 font-sans text-xs">
      {/* Top Tab Strip */}
      <div className="flex items-center justify-between px-2 pt-1.5 h-10">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {/* Active Tab */}
          <div className="flex items-center gap-2 bg-[#2B2D31] text-white px-3.5 py-1.5 rounded-t-lg max-w-[240px] border-t border-x border-white/10 shadow-sm relative group">
            {favicon === 'tiktok' ? (
              <span className="w-4 h-4 rounded-full bg-black flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-[#25F4EE]">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.38a6.37 6.37 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.75a8.28 8.28 0 0 0 4.84 1.54V6.84a4.83 4.83 0 0 1-.93-.15Z" />
                </svg>
              </span>
            ) : (
              <span className="w-4 h-4 rounded-sm bg-[#96BF48] flex items-center justify-center shrink-0 text-[10px] font-black text-white">
                S
              </span>
            )}
            <span className="truncate text-xs font-medium">{tabTitle}</span>
            <X size={13} className="text-slate-400 hover:text-white shrink-0 ml-auto cursor-pointer" />
          </div>

          {/* Plus icon for new tab */}
          <button type="button" className="p-1 hover:bg-white/10 rounded-full text-slate-400">
            <Plus size={14} />
          </button>
        </div>

        {/* Windows Right Controls */}
        <div className="flex items-center gap-3 pr-2 text-slate-400">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-purple-300 font-medium">
            <Sparkles size={12} className="text-purple-400 animate-pulse" />
            <span>Ask Gemini</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 pl-2">
            <Minus size={13} className="cursor-pointer hover:text-white" />
            <Square size={11} className="cursor-pointer hover:text-white" />
            <X size={14} onClick={onToggleChromeBar} className="cursor-pointer hover:text-red-400" title="Hide Chrome Bar" />
          </div>
        </div>
      </div>

      {/* URL & Navigation Bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2B2D31] border-t border-black/20">
        <div className="flex items-center gap-2 text-slate-400">
          <ArrowLeft size={14} className="hover:text-white cursor-pointer" />
          <ArrowRight size={14} className="text-slate-600 cursor-not-allowed" />
          <RotateCw
            size={14}
            onClick={onReload}
            className="hover:text-white cursor-pointer active:rotate-180 transition-transform"
            title="Reload Page"
          />
        </div>

        {/* Omnibox / URL field */}
        <div className="flex-1 flex items-center justify-between bg-[#1F2024] px-3 py-1 rounded-full text-xs font-mono border border-white/5 shadow-inner">
          <div className="flex items-center gap-2 truncate text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block shrink-0" title="Secure SSL connection" />
            <span className="truncate select-all">{url}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-400 shrink-0 pl-2">
            <Star size={13} className="hover:text-yellow-400 cursor-pointer" />
          </div>
        </div>

        {/* Extensions / Avatar */}
        <div className="flex items-center gap-2.5 text-slate-400 pl-1">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
            S
          </span>
        </div>
      </div>
    </div>
  );
}
