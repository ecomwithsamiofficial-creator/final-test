'use client';

import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Sparkles } from 'lucide-react';
import { defaultCmsContent } from '@/utils/cmsStore';

function getReviewUrl(src: string): string {
  if (!src) return '/images/sami-logo.jpg';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}v=20260919_v3`;
}

interface ScrollingScreenshotReviewsProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    images?: string[];
  };
  backupImages?: string[];
}

export function ScrollingScreenshotReviews({ data, backupImages }: ScrollingScreenshotReviewsProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // CRITICAL: Guarantee 0 hydration mismatches by returning null until client mount
  if (!mounted) {
    return null;
  }

  const fallback = defaultCmsContent.screenshot_reviews || {
    badge: 'REAL STUDENT RESULTS',
    title: 'Join 9,700+ Happy Students',
    subtitle: 'Real, unedited screenshots from our students — results & feedback.',
    images: []
  };

  const badge = data?.badge || fallback.badge || 'REAL STUDENT RESULTS';
  const title = data?.title || fallback.title || 'Join 9,700+ Happy Students';
  const subtitle = data?.subtitle || fallback.subtitle || 'Real, unedited screenshots from our students — results & feedback.';
  
  // Smart Bi-directional Fallback:
  // 1. Primary: Tab 11A (Checkout reviews)
  // 2. Backup: Tab 11B (Homepage proof wall reviews uploaded by admin)
  const primaryImages = (Array.isArray(data?.images) && data!.images.length > 0)
    ? data!.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : [];

  const secondaryImages = (Array.isArray(backupImages) && backupImages.length > 0)
    ? backupImages.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : [];

  const rawImages: string[] = primaryImages.length > 0 
    ? primaryImages 
    : (secondaryImages.length > 0 ? secondaryImages : ['/uploads/reviews/review_verified_student.svg']);

  // Split images into two columns for natural vertical parallax
  const col1Images: string[] = [];
  const col2Images: string[] = [];

  rawImages.forEach((img, idx) => {
    if (idx % 2 === 0) {
      col1Images.push(img);
    } else {
      col2Images.push(img);
    }
  });

  // If one column is empty (e.g. only 1 image provided), share evenly
  if (col1Images.length === 0 && col2Images.length > 0) {
    col1Images.push(...col2Images);
  } else if (col2Images.length === 0 && col1Images.length > 0) {
    col2Images.push(...col1Images);
  }

  // Cap column items strictly so total height never exceeds iOS Safari GPU texture limits (~2000px)
  let baseCol1: string[] = [];
  while (baseCol1.length < 3 && col1Images.length > 0) {
    baseCol1 = baseCol1.concat(col1Images);
  }
  baseCol1 = baseCol1.slice(0, 4);

  let baseCol2: string[] = [];
  while (baseCol2.length < 3 && col2Images.length > 0) {
    baseCol2 = baseCol2.concat(col2Images);
  }
  baseCol2 = baseCol2.slice(0, 4);

  const loopCol1 = [...baseCol1, ...baseCol1];
  const loopCol2 = [...baseCol2, ...baseCol2];

  return (
    <section className="relative w-full py-12 sm:py-16 overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0B0F19] via-[#0D1322] to-[#0B0F19]">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00A0DF]/15 border border-[#00A0DF]/40 text-[#00A0DF] text-xs font-black uppercase tracking-wider shadow-sm shadow-[#00A0DF]/10">
            <Sparkles size={14} className="animate-pulse" />
            <span>{badge}</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Viewport Frame with Gradient Fading Masks (Top & Bottom) */}
        <div 
          style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)', WebkitOverflowScrolling: 'touch' }}
          className="relative h-[560px] xs:h-[620px] sm:h-[680px] w-full max-w-2xl mx-auto overflow-hidden rounded-3xl border border-white/10 bg-[#070B14]/80 shadow-2xl group-scroll"
        >
          
          {/* Top Soft Gradient Fade Mask */}
          <div className="absolute top-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-b from-[#070B14] via-[#070B14]/80 to-transparent pointer-events-none z-20" />
          
          {/* Bottom Soft Gradient Fade Mask */}
          <div className="absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent pointer-events-none z-20" />

          {/* 2-Column Marquee Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 h-full">
            
            {/* Column 1 (Scrolling Upwards Speed A - 75s Slow & Smooth) */}
            <div className="overflow-hidden relative h-full">
              <div 
                style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                className="flex flex-col gap-3 sm:gap-4 animate-scroll-vertical-col1"
              >
                {loopCol1.map((src, i) => {
                  const finalUrl = getReviewUrl(src);
                  return (
                    <div
                      key={`col1-${i}`}
                      role="button"
                      tabIndex={0}
                      style={{ touchAction: 'manipulation' }}
                      onClick={() => setSelectedImage(finalUrl)}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        setSelectedImage(finalUrl);
                      }}
                      className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-[#00A0DF]/60 bg-[#111827] shadow-lg cursor-pointer transition-transform duration-200 active:opacity-90 flex-shrink-0 select-none"
                    >
                      <img
                        src={finalUrl}
                        alt="Student Result Review"
                        loading="eager"
                        decoding="async"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.opacity = '0.6';
                        }}
                        className="w-full h-auto object-cover rounded-2xl block pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-bold pointer-events-none">
                        <ZoomIn size={16} className="text-[#00A0DF]" />
                        <span>Click to Zoom</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2 (Scrolling Upwards Speed B - 65s Parallax) */}
            <div className="overflow-hidden relative h-full">
              <div 
                style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                className="flex flex-col gap-3 sm:gap-4 animate-scroll-vertical-col2"
              >
                {loopCol2.map((src, i) => {
                  const finalUrl = getReviewUrl(src);
                  return (
                    <div
                      key={`col2-${i}`}
                      role="button"
                      tabIndex={0}
                      style={{ touchAction: 'manipulation' }}
                      onClick={() => setSelectedImage(finalUrl)}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        setSelectedImage(finalUrl);
                      }}
                      className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-[#00A0DF]/60 bg-[#111827] shadow-lg cursor-pointer transition-transform duration-200 active:opacity-90 flex-shrink-0 select-none"
                    >
                      <img
                        src={finalUrl}
                        alt="Student Result Review"
                        loading="eager"
                        decoding="async"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.opacity = '0.6';
                        }}
                        className="w-full h-auto object-cover rounded-2xl block pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-bold pointer-events-none">
                        <ZoomIn size={16} className="text-[#00A0DF]" />
                        <span>Click to Zoom</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Click-to-Zoom Lightbox Modal (For Mobile & Desktop Deep Inspection) */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full max-h-[92vh] flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 sm:-right-4 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              title="Close modal"
            >
              <X size={22} />
            </button>
            <img
              src={selectedImage}
              alt="Zoomed Student Review Proof"
              className="max-h-[85vh] w-auto max-w-full rounded-2xl shadow-2xl border border-white/20 object-contain block"
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default ScrollingScreenshotReviews;
