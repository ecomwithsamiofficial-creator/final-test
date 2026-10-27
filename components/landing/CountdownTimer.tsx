'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Flame, ShieldCheck, Zap, Users } from 'lucide-react';

export interface CountdownTimerProps {
  timerAnchorTime?: number;
  serverRemainingSeconds?: number;
  serverTime?: number;
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
  timerHeading?: string;
  seatsLeftText?: string;
  seatsFilledPercent?: number;
  trustBadge1?: string;
  trustBadge2?: string;
  trustBadge3?: string;
  variant?: 'card' | 'banner';
}

export function CountdownTimer({
  timerAnchorTime,
  serverRemainingSeconds,
  serverTime,
  initialHours = 2,
  initialMinutes = 27,
  initialSeconds = 38,
  timerHeading = 'Discount Offer Ends In:',
  seatsLeftText = 'Only 12 seats left at this price',
  seatsFilledPercent = 88,
  trustBadge1 = 'Lifetime Access',
  trustBadge2 = 'Instant LMS Activation',
  trustBadge3 = '1,200+ Students',
  variant = 'card'
}: CountdownTimerProps) {
  const configuredDuration = Math.max(
    1,
    Number(initialHours || 0) * 3600 + Number(initialMinutes || 0) * 60 + Number(initialSeconds || 0)
  );

  // Lock initial clock skew ONCE on mount so Date.now() ticks forward naturally every second
  const skewRef = useRef<number>(0);
  const isSkewInitialized = useRef<boolean>(false);

  if (!isSkewInitialized.current) {
    if (typeof window !== 'undefined' && typeof serverTime === 'number' && serverTime > 0) {
      skewRef.current = Date.now() - serverTime;
    }
    isSkewInitialized.current = true;
  }

  const calculateGlobalRemaining = () => {
    const anchor = Number(timerAnchorTime) || 1773100000000;
    // Calibrated time advances by 1000ms every second
    const calibratedNow = Date.now() - skewRef.current;
    const elapsed = Math.max(0, Math.floor((calibratedNow - anchor) / 1000)) % configuredDuration;
    return Math.max(0, configuredDuration - elapsed);
  };

  const [totalSeconds, setTotalSeconds] = useState<number>(() => {
    if (typeof serverRemainingSeconds === 'number' && serverRemainingSeconds >= 0) {
      return serverRemainingSeconds;
    }
    return calculateGlobalRemaining();
  });

  useEffect(() => {
    // Initial sync
    setTotalSeconds(calculateGlobalRemaining());

    // Continuous 1-second real-time tick with automatic rollover
    const timer = setInterval(() => {
      setTotalSeconds(calculateGlobalRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [timerAnchorTime, configuredDuration]);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  const fillPercent = Math.min(100, Math.max(0, Number(seatsFilledPercent) || 88));

  if (variant === 'banner') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-2.5 sm:space-y-3">
        {/* 1. Sleek Blue Timer Bar (LearnWithAfaq Style) */}
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#008ac2] to-[#00A0DF] text-white px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 shadow-lg shadow-[#00A0DF]/20">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-white">
            <Clock size={18} className="animate-pulse text-white flex-shrink-0" />
            <span>{timerHeading || 'Offer ends in:'}</span>
          </div>

          {/* Digital Timer Pills */}
          <div className="flex items-center gap-1.5 xs:gap-2">
            {[
              { val: pad(hours), lbl: 'HRS' },
              { val: pad(minutes), lbl: 'MIN' },
              { val: pad(seconds), lbl: 'SEC' }
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-white/20 backdrop-blur-xs text-white rounded-lg px-2 sm:px-3 py-1 text-center min-w-[42px] sm:min-w-[48px] border border-white/25 shadow-xs"
              >
                <div 
                  className="text-xs sm:text-sm font-black font-mono leading-none tracking-tight"
                  suppressHydrationWarning
                >
                  {unit.val}
                </div>
                <div className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider text-white/90 mt-0.5">
                  {unit.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Urgency Seats Left Strip */}
        <div className="w-full bg-[#FFF9EE] border border-amber-300/60 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2 sm:py-2.5 shadow-xs">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-amber-950 mb-1">
            <span className="flex items-center gap-1.5 font-extrabold text-amber-900">
              <Flame size={15} className="text-amber-500 fill-amber-500 flex-shrink-0" />
              <span>{seatsLeftText}</span>
            </span>
            <span className="text-amber-600 font-black">{fillPercent}%</span>
          </div>
          <div className="h-2 sm:h-2.5 bg-amber-200/60 rounded-full overflow-hidden p-0.5 mt-0.5">
            <div
              style={{ width: `${fillPercent}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* 3. Inline Trust Guarantees Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-1.5 pt-1 text-xs sm:text-sm font-bold text-slate-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
            <span>{trustBadge1}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={16} className="text-[#00A0DF] flex-shrink-0" />
            <span>{trustBadge2}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-amber-400 flex-shrink-0" />
            <span>{trustBadge3}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border-2 border-[#00A0DF]/30 shadow-xl shadow-[#00A0DF]/10 p-4 sm:p-6 md:p-7 mb-8">
      {/* Clock Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-5">
        <div className="flex items-center gap-2 text-red-600 font-extrabold text-sm sm:text-base">
          <Clock size={20} className="animate-pulse flex-shrink-0" />
          <span>{timerHeading}</span>
        </div>

        {/* 3 Box Digital Countdown Timer */}
        <div className="flex items-center gap-1.5 xs:gap-2">
          {[
            { val: pad(hours), lbl: 'HOURS' },
            { val: pad(minutes), lbl: 'MINS' },
            { val: pad(seconds), lbl: 'SECS' }
          ].map((unit, idx) => (
            <div
              key={idx}
              className="bg-slate-950 text-white rounded-xl py-1.5 xs:py-2 px-2.5 xs:px-3.5 sm:px-4 text-center min-w-[52px] xs:min-w-[60px] sm:min-w-[68px] border border-[#00A0DF]/30 shadow-inner"
            >
              <div 
                className="text-lg xs:text-xl sm:text-2xl font-black font-mono text-[#00A0DF] leading-none"
                suppressHydrationWarning
              >
                {unit.val}
              </div>
              <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider mt-1">
                {unit.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seats Left Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
          <span className="flex items-center gap-1.5 text-red-600">
            <Flame size={16} className="text-red-500 flex-shrink-0" />
            <span>{seatsLeftText}</span>
          </span>
          <span className="text-[#00A0DF] font-black">{fillPercent}% Filled</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            style={{ width: `${fillPercent}%` }}
            className="h-full bg-gradient-to-r from-[#00A0DF] to-red-500 rounded-full animate-pulse transition-all duration-500"
          />
        </div>
      </div>

      {/* 3 Trust Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 text-xs sm:text-sm font-bold text-slate-700 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" />
          <span>{trustBadge1}</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Zap size={18} className="text-[#00A0DF] flex-shrink-0" />
          <span>{trustBadge2}</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Users size={18} className="text-amber-500 flex-shrink-0" />
          <span>{trustBadge3}</span>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
