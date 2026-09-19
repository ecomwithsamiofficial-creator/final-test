'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { defaultCmsContent } from '@/utils/cmsStore';

const VERIFIED_FALLBACKS = [
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-312-1.webp',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-309.webp',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-311.webp',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-315.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-353.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-351.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-356.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-349.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-313.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-310.webp',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-314.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-362.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-352.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-360.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-354.jpg',
  'https://learnwithafaq.com/wp-content/uploads/2025/11/image-350.jpg'
];

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

  // Guarantee 0 hydration mismatches
  if (!mounted) {
    return null;
  }

  const fallback = defaultCmsContent.homepage_proof_wall || {
    badge: 'STUDENT RESULTS',
    title: 'Students Success',
    subtitle: 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.',
    images: VERIFIED_FALLBACKS
  };

  const badge = data?.badge || fallback.badge || 'STUDENT RESULTS';
  const title = data?.title || fallback.title || 'Students Success';
  const subtitle = data?.subtitle || fallback.subtitle || 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.';

  // Extract non-empty image strings, fallback to verified CDN reviews
  const rawImages: string[] = (Array.isArray(data?.images) && data!.images.length > 0)
    ? data!.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : VERIFIED_FALLBACKS;

  const validImages = rawImages.length > 0 ? rawImages : VERIFIED_FALLBACKS;

  // Split images into two columns for natural vertical parallax
  const col1Images: string[] = [];
  const col2Images: string[] = [];

  validImages.forEach((img, idx) => {
    if (idx % 2 === 0) {
      col1Images.push(img);
    } else {
      col2Images.push(img);
    }
  });

  if (col1Images.length === 0 && col2Images.length > 0) {
    col1Images.push(...col2Images);
  } else if (col2Images.length === 0 && col1Images.length > 0) {
    col2Images.push(...col1Images);
  }

  // Ensure each column has at least 8 items for infinite seamless scroll
  let baseCol1: string[] = [...col1Images];
  while (baseCol1.length < 8 && col1Images.length > 0) {
    baseCol1 = baseCol1.concat(col1Images);
  }

  let baseCol2: string[] = [...col2Images];
  while (baseCol2.length < 8 && col2Images.length > 0) {
    baseCol2 = baseCol2.concat(col2Images);
  }

  const loopCol1 = [...baseCol1, ...baseCol1];
  const loopCol2 = [...baseCol2, ...baseCol2];

  return (
    <div className="w-full">
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

      {/* Viewport Frame: 100% Non-Clickable, Pure Display, Battle-Tested 2-Column Vertical Scroll */}
      <div className="relative h-[580px] xs:h-[640px] sm:h-[720px] w-full max-w-3xl mx-auto overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50/60 shadow-2xl pointer-events-none select-none">
        
        {/* Top Soft Gradient Fade Mask */}
        <div className="absolute top-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent z-20 pointer-events-none" />
        
        {/* Bottom Soft Gradient Fade Mask */}
        <div className="absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-20 pointer-events-none" />

        {/* 2-Column Continuous Infinite Vertical Marquee */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 h-full pointer-events-none">
          
          {/* Column 1 (Slow Continuous Infinite Vertical Scroll 75s) */}
          <div className="overflow-hidden relative h-full">
            <div className="flex flex-col gap-3 sm:gap-4 animate-scroll-vertical-col1">
              {loopCol1.map((src, i) => (
                <div
                  key={`home-col1-${i}`}
                  className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md flex-shrink-0"
                >
                  <img
                    src={src}
                    alt="Student Result Review"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = 'true';
                        img.src = VERIFIED_FALLBACKS[i % VERIFIED_FALLBACKS.length];
                      }
                    }}
                    className="w-full h-auto object-cover rounded-2xl block pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 (Slow Continuous Infinite Vertical Scroll 65s - Parallax) */}
          <div className="overflow-hidden relative h-full">
            <div className="flex flex-col gap-3 sm:gap-4 animate-scroll-vertical-col2">
              {loopCol2.map((src, i) => (
                <div
                  key={`home-col2-${i}`}
                  className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md flex-shrink-0"
                >
                  <img
                    src={src}
                    alt="Student Result Review"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = 'true';
                        img.src = VERIFIED_FALLBACKS[(i + 1) % VERIFIED_FALLBACKS.length];
                      }
                    }}
                    className="w-full h-auto object-cover rounded-2xl block pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HomepageProofWall;
