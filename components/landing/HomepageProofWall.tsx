'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { defaultCmsContent } from '@/utils/cmsStore';

interface HomepageProofWallProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    images?: string[];
  };
}

export function HomepageProofWall({ data }: HomepageProofWallProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // CRITICAL: Guarantee 0 hydration mismatches by returning null until client mount
  if (!mounted) {
    return null;
  }

  const fallback = defaultCmsContent.homepage_proof_wall || {
    badge: 'STUDENT RESULTS',
    title: 'Students Success',
    subtitle: 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.',
    images: [
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-312-1.webp',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-309.webp',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-311.webp',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-315.jpg'
    ]
  };

  const badge = data?.badge || fallback.badge || 'STUDENT RESULTS';
  const title = data?.title || fallback.title || 'Students Success';
  const subtitle = data?.subtitle || fallback.subtitle || 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.';

  // Safely extract and sanitize image URLs
  const rawImages: string[] = (Array.isArray(data?.images) && data!.images.length > 0)
    ? data!.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : (Array.isArray(fallback.images) && fallback.images.length > 0
        ? fallback.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
        : [
            'https://learnwithafaq.com/wp-content/uploads/2025/11/image-312-1.webp',
            'https://learnwithafaq.com/wp-content/uploads/2025/11/image-309.webp',
            'https://learnwithafaq.com/wp-content/uploads/2025/11/image-311.webp',
            'https://learnwithafaq.com/wp-content/uploads/2025/11/image-315.jpg'
          ]);

  // Keep single track under 2,200px width (well below Safari's 4,096px GPU texture limit)
  let baseList: string[] = [...rawImages];
  while (baseList.length < 6 && rawImages.length > 0) {
    baseList = baseList.concat(rawImages);
  }

  return (
    <div className="w-full py-6 sm:py-10">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00A0DF]/10 border border-[#00A0DF]/30 text-[#00A0DF] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
          <Sparkles size={14} className="animate-pulse" />
          <span>{badge}</span>
        </div>

        {/* 100% Legible Dark Title with Blue Highlight */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
          {title.includes('Success') ? (
            <>
              {title.split('Success')[0]}
              <span className="text-[#00A0DF]">Success</span>
              {title.split('Success')[1]}
            </>
          ) : (
            title
          )}
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Dual-Track Infinite Stream Frame: 100% Non-Clickable, 0% White Space, Uncropped WhatsApp Screenshots */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none group-proof-hover flex">
        
        {/* Left Soft Pure White Fade Mask */}
        <div className="absolute left-0 inset-y-0 w-12 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
        
        {/* Right Soft Pure White Fade Mask */}
        <div className="absolute right-0 inset-y-0 w-12 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

        {/* Track 1: First Seamless Loop Segment */}
        <div className="animate-marquee-track flex gap-4 sm:gap-6 py-4 pr-4 sm:pr-6">
          {baseList.map((src, idx) => (
            <div
              key={`track-a-${idx}`}
              className="relative h-[480px] xs:h-[520px] sm:h-[580px] md:h-[620px] w-auto max-w-[340px] sm:max-w-[380px] flex-shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-xl shadow-slate-300/40 p-1.5 flex items-center justify-center"
            >
              <img
                src={src}
                alt="Student WhatsApp & Store Result Review"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="h-full w-auto max-w-full object-contain rounded-xl sm:rounded-2xl block pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Track 2: Identical Twin Loop Segment (Follows Track 1 with Zero Gap & Zero White Space) */}
        <div className="animate-marquee-track flex gap-4 sm:gap-6 py-4 pr-4 sm:pr-6" aria-hidden="true">
          {baseList.map((src, idx) => (
            <div
              key={`track-b-${idx}`}
              className="relative h-[480px] xs:h-[520px] sm:h-[580px] md:h-[620px] w-auto max-w-[340px] sm:max-w-[380px] flex-shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-xl shadow-slate-300/40 p-1.5 flex items-center justify-center"
            >
              <img
                src={src}
                alt="Student WhatsApp & Store Result Review"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="h-full w-auto max-w-full object-contain rounded-xl sm:rounded-2xl block pointer-events-none"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default HomepageProofWall;
