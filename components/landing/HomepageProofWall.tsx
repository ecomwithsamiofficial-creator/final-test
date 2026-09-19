'use client';

import React, { useState, useEffect } from 'react';
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
    : (Array.isArray(fallback.images) ? fallback.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0) : []);

  if (rawImages.length === 0) {
    return null;
  }

  // Duplicate once for seamless -50% translateX loop (learnwithafaq exact pattern)
  let baseImages = [...rawImages];
  while (baseImages.length < 10) {
    baseImages = baseImages.concat(rawImages);
  }
  const loopImages = [...baseImages, ...baseImages];

  return (
    <div className="lwaSs w-full py-6 sm:py-10">
      {/* Header Section (LearnWithAfaq Style) */}
      <div className="lwaSsHead text-center mb-8 px-4">
        <span className="lwaSsTag">
          {badge}
        </span>

        <h2 className="lwaSsTitle">
          {title.includes('Success') ? (
            <>
              {title.split('Success')[0]}
              <span>Success</span>
              {title.split('Success')[1]}
            </>
          ) : (
            title
          )}
        </h2>

        <p className="lwaSsSub">
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
              src={src}
              alt="Student result"
              loading="eager"
              decoding="async"
              onError={(e) => {
                // If any image fails, hide it gracefully so layout is never broken
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomepageProofWall;
