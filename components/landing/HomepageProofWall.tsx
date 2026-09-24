'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, ZoomIn } from 'lucide-react';
import { defaultCmsContent } from '@/utils/cmsStore';

function getReviewUrl(src: string): string {
  if (!src) return '/images/sami-logo.jpg';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}v=sami_review_v2`;
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

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
      {/* Header Section */}
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
          {loopImages.map((src, idx) => {
            const finalUrl = getReviewUrl(src);
            const isInitial = idx < 6;
            return (
              <div
                key={`proof-card-${idx}`}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedImage(finalUrl)}
                className="relative group flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 bg-[#070B14] w-[210px] sm:w-[260px] h-[400px] sm:h-[500px] flex items-center justify-center p-1"
                title="Click to view full screenshot proof"
              >
                <img
                  src={finalUrl}
                  alt={`Student Result ${idx + 1}`}
                  loading={isInitial ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.opacity = '0.7';
                  }}
                  className="w-full h-full object-contain rounded-xl block pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold pointer-events-none rounded-xl">
                  <ZoomIn size={18} className="text-[#00A0DF]" />
                  <span>Click to Zoom</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Click-to-Zoom Lightbox Modal */}
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
    </div>
  );
}

export default HomepageProofWall;
