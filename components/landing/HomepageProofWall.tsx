'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { defaultCmsContent } from '@/utils/cmsStore';

function getReviewUrl(src: string): string {
  if (!src) return '/images/sami-logo.jpg';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}v=20260919_v3`;
}

interface HomepageProofWallProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    images?: string[];
  };
  backupImages?: string[];
}

export function HomepageProofWall({ data, backupImages }: HomepageProofWallProps) {
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

  // Smart Bi-directional Fallback:
  // 1. Primary: Tab 11B (Homepage proof wall uploaded by admin)
  // 2. Backup: Tab 11A (Checkout reviews uploaded by admin)
  const primaryImages = (Array.isArray(data?.images) && data!.images.length > 0)
    ? data!.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : [];

  const secondaryImages = (Array.isArray(backupImages) && backupImages.length > 0)
    ? backupImages.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : [];

  const rawImages: string[] = primaryImages.length > 0
    ? primaryImages
    : (secondaryImages.length > 0 ? secondaryImages : ['/uploads/reviews/review_verified_student.svg']);

  // Duplicate for seamless continuous translateX loop
  let baseImages = [...rawImages];
  while (baseImages.length < 6 && rawImages.length > 0) {
    baseImages = baseImages.concat(rawImages);
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

      {/* Viewport & Track */}
      <div className="lwaSsViewport">
        <div className="lwaSsFade lwaSsFadeL" />
        <div className="lwaSsFade lwaSsFadeR" />
        <div className="lwaSsTrack">
          {loopImages.map((src, idx) => (
            <img
              key={`proof-img-${idx}`}
              src={getReviewUrl(src)}
              alt="Student result"
              loading="eager"
              decoding="async"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.opacity = '0.6';
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomepageProofWall;
