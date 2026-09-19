'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { defaultCmsContent } from '@/utils/cmsStore';

const VERIFIED_CDN_REVIEWS = [
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

function getReviewUrl(src: string, idx: number): string {
  if (!src) return VERIFIED_CDN_REVIEWS[idx % VERIFIED_CDN_REVIEWS.length];
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}v=20260919_v2`;
}

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
    subtitle: 'Real screenshots shared by our students — unedited and unfiltered.',
    images: []
  };

  const badge = data?.badge || fallback.badge || 'STUDENT RESULTS';
  const title = data?.title || fallback.title || 'Students Success';
  const subtitle = data?.subtitle || fallback.subtitle || 'Real screenshots shared by our students — unedited and unfiltered.';

  // Extract non-empty image strings from data/CMS
  const rawImages: string[] = (Array.isArray(data?.images) && data!.images.length > 0)
    ? data!.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : (Array.isArray(fallback.images) && fallback.images.length > 0 
        ? fallback.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0) 
        : VERIFIED_CDN_REVIEWS);

  const validImages = rawImages.length > 0 ? rawImages : VERIFIED_CDN_REVIEWS;

  // Duplicate for seamless continuous translateX loop
  let baseImages = [...validImages];
  while (baseImages.length < 10) {
    baseImages = baseImages.concat(validImages);
  }
  const loopImages = [...baseImages, ...baseImages];

  return (
    <div className="lwaSs w-full py-6 sm:py-10">
      {/* Header Section (Pure Tailwind Utility Styling - Immune to CSS load issues) */}
      <div className="text-center mb-8 sm:mb-10 px-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00A0DF]/15 border border-[#00A0DF]/30 text-[#00A0DF] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
          <Sparkles size={14} className="animate-pulse" />
          <span>{badge}</span>
        </div>

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

      {/* LearnWithAfaq Exact Viewport & Track */}
      <div className="lwaSsViewport">
        <div className="lwaSsFade lwaSsFadeL" />
        <div className="lwaSsFade lwaSsFadeR" />
        <div className="lwaSsTrack">
          {loopImages.map((src, idx) => (
            <img
              key={`proof-img-${idx}`}
              src={getReviewUrl(src, idx)}
              alt="Student result"
              loading="eager"
              decoding="async"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (!img.dataset.fallback) {
                  img.dataset.fallback = 'true';
                  img.src = VERIFIED_CDN_REVIEWS[idx % VERIFIED_CDN_REVIEWS.length];
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomepageProofWall;
