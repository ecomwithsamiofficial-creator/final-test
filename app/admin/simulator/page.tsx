'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ExternalLink, 
  ShoppingBag, 
  Layers, 
  Video, 
  Sliders, 
  ShieldCheck, 
  ArrowLeft,
  Eye,
  Key
} from 'lucide-react';

export default function SimulatorHubPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 sm:p-8 font-sans selection:bg-[#00A0DF] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                  MENTOR VIDEO STUDIO
                </span>
                <span className="text-xs text-slate-400">100% Pixel-Perfect Clones</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Live E-Commerce & Ads Simulators
              </h1>
            </div>
          </div>
        </div>

        {/* Quick Launch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. TikTok Ads Manager Simulator Card */}
          <div className="bg-[#111624] border border-white/10 hover:border-[#00C9A7]/40 rounded-2xl p-6 space-y-4 relative group transition-all shadow-xl hover:shadow-[#00C9A7]/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-black border border-white/15 flex items-center justify-center text-white shadow-md">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#00C9A7]">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.38a6.37 6.37 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.75a8.28 8.28 0 0 0 4.84 1.54V6.84a4.83 4.83 0 0 1-.93-.15Z" />
                  </svg>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#00C9A7]/10 text-[#00C9A7] font-bold text-xs border border-[#00C9A7]/20">
                  Exact Screenshot Replica
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-[#00C9A7] transition-colors">
                TikTok Ads Manager
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Includes both <strong>Campaigns Table</strong> (sticky campaign column, working toggles, custom metrics) and <strong>Overview Dashboard</strong> (dual-axis spline chart, top creatives, reached audience).
              </p>

              <div className="pt-1 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck size={13} className="text-[#00C9A7]" />
                  <span>Interactive On/Off green switches</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck size={13} className="text-[#00C9A7]" />
                  <span>Real Spend, Conversions & ROAS calculations</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <a
                href="/admin/simulator/tiktok"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#00C9A7] hover:bg-[#00b596] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00C9A7]/20 transition-all active:scale-98"
              >
                <span>Open in Clean New Tab</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* 2. Shopify Polaris Analytics Simulator Card */}
          <div className="bg-[#111624] border border-white/10 hover:border-[#96BF48]/40 rounded-2xl p-6 space-y-4 relative group transition-all shadow-xl hover:shadow-[#96BF48]/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#96BF48] flex items-center justify-center text-slate-950 shadow-md">
                  <ShoppingBag size={24} className="fill-slate-950 text-slate-950" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#96BF48]/10 text-[#96BF48] font-bold text-xs border border-[#96BF48]/20">
                  Shopify Plus Polaris UI
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-[#96BF48] transition-colors">
                Shopify Polaris Analytics
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Includes <strong>Pulsing Live View Beacon</strong> (organic visitors moving every 5 seconds), <strong>Total Sales Spline Area Chart</strong>, Conversion Funnel, Orders, AOV, and Top Winning Products.
              </p>

              <div className="pt-1 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck size={13} className="text-[#96BF48]" />
                  <span>Real-time fluctuating live visitors beacon</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck size={13} className="text-[#96BF48]" />
                  <span>Customizable 7-figure sales graphs & product names</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <a
                href="/admin/simulator/shopify"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#96BF48] hover:bg-[#85ab3f] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#96BF48]/20 transition-all active:scale-98"
              >
                <span>Open in Clean New Tab</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Video Recording & Screen Capture Guide */}
        <div className="bg-[#161C2C] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Video size={18} />
            <h4 className="font-bold text-sm text-white">How To Record 100% Authentic Video Case Studies:</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/5 space-y-1.5">
              <span className="font-bold text-white flex items-center gap-1.5 text-[13px]">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-emerald-400 font-mono">1</span>
                Press F11 (Full-Screen)
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                When you open the tab, press <strong>F11</strong> to hide the real browser URL bar. The dashboard will look 100% native on camera.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/5 space-y-1.5">
              <span className="font-bold text-white flex items-center gap-1.5 text-[13px]">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-cyan-400 font-mono">2</span>
                Secret Control Shortcut
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Press <code className="bg-white/10 px-1 py-0.5 rounded text-cyan-300 font-mono">Ctrl + Shift + S</code> or <code className="bg-white/10 px-1 py-0.5 rounded text-cyan-300 font-mono">~</code> anytime to open the secret control drawer and edit figures.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/5 space-y-1.5">
              <span className="font-bold text-white flex items-center gap-1.5 text-[13px]">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-purple-400 font-mono">3</span>
                F5 Refresh Proof
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                All numbers are saved in your local storage. If you refresh the page during a video recording, the exact same customized numbers reload seamlessly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
