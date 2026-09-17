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

  // Multiply items safely so horizontal stream fills all desktop & mobile viewports seamlessly
  let baseList: string[] = [...rawImages];
  while (baseList.length < 8 && rawImages.length > 0) {
    baseList = baseList.concat(rawImages);
  }

  // Exactly two sets for continuous 50% translateX loop
  const loopImages = [...baseList, ...baseList];

  return (
    <div className="w-full py-6 sm:py-10">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00A0DF]/10 border border-[#00A0DF]/30 text-[#00A0DF] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
          <Sparkles size={14} className="animate-pulse" />
          <span>{badge}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
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

        <p className="text-xs sm:text-sm md:text-base text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Horizontal Continuous Stream Frame: 100% Non-Clickable, Ultra-Smooth on iPhone Safari & Android */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none group-proof-hover">
        
        {/* Left Soft Fade Mask */}
        <div className="absolute left-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-r from-[#0B0F19] to-transparent z-20 pointer-events-none" />
        
        {/* Right Soft Fade Mask */}
        <div className="absolute right-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-l from-[#0B0F19] to-transparent z-20 pointer-events-none" />

        {/* Horizontal Marquee Track */}
        <div className="animate-scroll-horizontal-proof flex gap-4 sm:gap-6 py-4 px-2">
          {loopImages.map((src, idx) => (
            <div
              key={`hproof-${idx}`}
              className="relative w-[240px] xs:w-[270px] sm:w-[310px] md:w-[340px] h-[340px] xs:h-[380px] sm:h-[430px] md:h-[460px] flex-shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#111827] shadow-2xl shadow-black/60"
            >
              <img
                src={src}
                alt="Student WhatsApp & Store Result Review"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover block pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomepageProofWall;
