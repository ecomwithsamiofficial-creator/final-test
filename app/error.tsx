'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global App Error]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-[#00A0DF] selection:text-white">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00A0DF]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-400 mb-6">A temporary connection error occurred. Please refresh or return to the homepage.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#00A0DF] hover:bg-[#008ac2] text-white font-bold rounded-lg text-sm transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-sm transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
