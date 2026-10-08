'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Mic, Sparkles, Volume2 } from 'lucide-react';
import { VoiceAdvisorModal } from './VoiceAdvisorModal';

export function VoiceAdvisorButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Hide on Admin and LMS portals
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/lms')) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 flex items-center gap-2.5 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pulsating Floating Call Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Talk with Ayesha AI Advisor"
          className="relative group w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#008ac2] to-[#00A0DF] text-white flex items-center justify-center shadow-[0_0_25px_rgba(0,160,223,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/40 cursor-pointer"
        >
          {/* Animated Concentric Waves */}
          <span className="absolute -inset-1 rounded-full border-2 border-[#00A0DF]/60 animate-ping pointer-events-none" />
          <span className="absolute -inset-2 rounded-full bg-[#00A0DF]/20 animate-pulse pointer-events-none" />

          {/* Avatar / Equalizer Icon */}
          <div className="relative flex items-center justify-center">
            {/* Equalizer Micro-bars */}
            <div className="flex items-end gap-0.5 h-4 mb-0.5">
              <span className="w-1 bg-white rounded-full h-2 animate-bounce" />
              <span className="w-1 bg-white rounded-full h-4 animate-pulse" />
              <span className="w-1 bg-white rounded-full h-3 animate-bounce" style={{ animationDelay: '150ms' }} />
            </div>
          </div>

          {/* Online Active Dot Badge */}
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#070B14] shadow-sm animate-pulse" />
        </button>

        {/* Hover / Idle Tooltip Pill */}
        <div
          onClick={() => setIsOpen(true)}
          className={`hidden sm:flex items-center gap-2 bg-[#070B14] text-white px-3.5 py-2 rounded-full text-xs font-bold shadow-xl border border-[#00A0DF]/40 cursor-pointer hover:border-[#00A0DF] transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-90 translate-x-0'
          }`}
        >
          <Sparkles size={13} className="text-[#00A0DF] animate-pulse" />
          <span className="text-slate-200">Talk with Ayesha <span className="text-[#00A0DF] font-mono text-[10px]">(AI Advisor)</span></span>
        </div>
      </div>

      {/* Interactive Voice Call Modal (Mounted only when opened) */}
      {isOpen && <VoiceAdvisorModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default VoiceAdvisorButton;
