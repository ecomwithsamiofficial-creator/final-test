'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Download, 
  ExternalLink, 
  FileText, 
  Package, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowLeft, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag, 
  Video, 
  Radio, 
  LogOut,
  FolderArchive,
  BookOpen,
  Filter,
  Eye,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { ResourceItem } from '@/utils/db';

export default function LmsBonusesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [user, setUser] = useState<any>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch user auth session
    fetch('/api/auth/me?t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then(res => {
        if (res.authenticated && res.user) {
          setUser(res.user);
        }
      })
      .catch(() => {});

    // 2. Fetch bonus resources
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/lms/resources?t=' + Date.now(), { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.resources)) {
        setResources(data.resources);
      }
    } catch (e) {
      console.error('Failed to load resources:', e);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type: string, title: string) => {
    const lower = (type + ' ' + title).toLowerCase();
    if (lower.includes('theme') || lower.includes('zip') || lower.includes('shopify')) {
      return <Package className="text-purple-600" size={20} />;
    }
    if (lower.includes('pdf') || lower.includes('guide') || lower.includes('blueprint') || lower.includes('sop')) {
      return <FileText className="text-rose-600" size={20} />;
    }
    if (lower.includes('excel') || lower.includes('calculator') || lower.includes('margin') || lower.includes('sheet') || lower.includes('xlsx')) {
      return <FileSpreadsheet className="text-emerald-600" size={20} />;
    }
    if (lower.includes('image') || lower.includes('banner') || lower.includes('creative') || lower.includes('ad')) {
      return <ImageIcon className="text-amber-600" size={20} />;
    }
    return <Sparkles className="text-blue-600" size={20} />;
  };

  const isPdf = (url: string, type: string, title: string) => {
    const combined = (url + ' ' + type + ' ' + title).toLowerCase();
    return combined.includes('.pdf') || combined.includes('pdf');
  };

  const handleDownload = (res: ResourceItem) => {
    setDownloadingId(res.id);

    // If external URL (Google Drive, Mega, Dropbox, etc.)
    if (res.downloadUrl.startsWith('http://') || res.downloadUrl.startsWith('https://')) {
      if (!res.downloadUrl.includes('localhost') && !res.downloadUrl.includes('ecomwithsami')) {
        window.open(res.downloadUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => setDownloadingId(null), 1000);
        return;
      }
    }

    // Direct download endpoint with forced Content-Disposition: attachment headers
    const downloadEndpoint = `/api/lms/resources/download?url=${encodeURIComponent(res.downloadUrl)}&name=${encodeURIComponent(res.title)}`;
    
    // Trigger download iframe/link for Safari & Android compliance
    const a = document.createElement('a');
    a.href = downloadEndpoint;
    a.download = res.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  const filtered = resources.filter(r => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = r.title.toLowerCase().includes(query) || 
                          r.description.toLowerCase().includes(query) ||
                          r.type.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (selectedCategory === 'ALL') return true;
    const cat = selectedCategory.toLowerCase();
    const type = (r.type + ' ' + r.title).toLowerCase();
    if (cat === 'themes') return type.includes('theme') || type.includes('zip') || type.includes('shopify');
    if (cat === 'pdf') return type.includes('pdf') || type.includes('guide') || type.includes('blueprint');
    if (cat === 'calculators') return type.includes('calculator') || type.includes('excel') || type.includes('xlsx') || type.includes('margin');
    if (cat === 'banners') return type.includes('banner') || type.includes('creative') || type.includes('image') || type.includes('asset');
    return true;
  });

  return (
    <div className="min-vh-100 bg-[#F8FAFC] text-slate-800 font-sans pb-24 md:pb-12">
      {/* TOP DESKTOP & TABLET HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Mentorship Badge */}
          <div className="flex items-center gap-3">
            <Link href="/lms" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
                S
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 block group-hover:text-blue-600 transition-colors">
                  Ecom With Sami
                </span>
                <span className="text-[10px] sm:text-[11px] font-black text-blue-600 tracking-wider uppercase block">
                  MASTERY MENTORSHIP
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DRM Protected &amp; Secure</span>
            </div>
          </div>

          {/* Center Navigation Tabs (Synchronized with LMS) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 text-xs font-bold">
            <Link
              href="/lms"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all"
            >
              <Video size={13} />
              <span>Curriculum</span>
            </Link>

            <Link
              href="/lms"
              onClick={() => {
                if (typeof window !== 'undefined') sessionStorage.setItem('sami_lms_target_tab', 'suppliers');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all"
            >
              <ShoppingBag size={13} />
              <span>GCC &amp; PK Suppliers</span>
            </Link>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30">
              <Download size={13} />
              <span>Bonuses Hub</span>
            </div>

            <Link
              href="/lms"
              onClick={() => {
                if (typeof window !== 'undefined') sessionStorage.setItem('sami_lms_target_tab', 'community');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all"
            >
              <Radio size={13} />
              <span>Community</span>
            </Link>
          </nav>

          {/* User Profile & Back Button */}
          <div className="flex items-center gap-2">
            <Link
              href="/lms"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">Back to Classroom</span>
              <span className="sm:hidden">Classroom</span>
            </Link>

            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
                </div>
                <div className="text-left text-xs leading-none">
                  <span className="font-bold text-slate-900 block truncate max-w-[120px]">{user.name || 'Student'}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Active Member</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* DYNAMIC WATERMARK NOTICE BAR */}
      <div className="bg-blue-50/70 border-b border-blue-100 px-4 py-2 text-center text-[11px] font-medium text-blue-900/80 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-600" />
        <span><strong>Verified Student Downloads Hub:</strong> All bonus files, themes, and PDF guides are licensed exclusively for your personal stores.</span>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* HERO TITLE CARD */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                <Sparkles size={12} className="text-blue-600" />
                <span>Power Bonus Downloads (2026-27 Edition)</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Shopify Themes, Ad Blueprints &amp; Profit Systems
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Direct one-click download access to our 7-figure Shopify ZIP themes, video ad copy templates, wholesale directories, and profit margin calculators. Works instantly on Mobile, iPhone (Safari), Android &amp; Laptops.
              </p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-2 self-start md:self-auto bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-3 shadow-xs">
              <div className="text-left">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Total Resource Worth</span>
                <span className="text-base sm:text-lg font-black text-amber-900">Rs 30,000+ Value</span>
                <span className="text-[10px] font-bold text-emerald-600 block">✓ Included 100% Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & CATEGORY FILTER BAR */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, file type (ZIP, PDF, Excel), or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadResources}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors disabled:opacity-50 self-stretch sm:self-auto justify-center"
              title="Refresh bonuses list"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Bonuses ({resources.length})
            </button>

            <button
              onClick={() => setSelectedCategory('themes')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'themes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Package size={13} />
              <span>Shopify Themes (ZIP)</span>
            </button>

            <button
              onClick={() => setSelectedCategory('pdf')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'pdf'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText size={13} />
              <span>PDF Blueprints &amp; SOPs</span>
            </button>

            <button
              onClick={() => setSelectedCategory('calculators')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'calculators'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileSpreadsheet size={13} />
              <span>Profit Calculators (Excel)</span>
            </button>

            <button
              onClick={() => setSelectedCategory('banners')}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === 'banners'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ImageIcon size={13} />
              <span>Ad Banners &amp; Creatives</span>
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-xs">
            <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">Loading Power Bonus Resources...</h3>
            <p className="text-xs text-slate-500 mt-1">Fetching verified downloads from Hostinger database</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Download size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching bonus files found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with another keyword or select "All Bonuses" to view all available resources.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* RESOURCES GRID */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filtered.map((item) => {
              const hasPdf = isPdf(item.downloadUrl, item.type, item.title);
              const isDownloading = downloadingId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors">
                          {getResourceIcon(item.type, item.title)}
                        </span>
                        <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                          {item.type}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {item.size}
                        </span>
                      </div>

                      <span className="text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                        {item.value || 'Rs 5,000'}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors leading-snug">
                      {item.title}
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed mb-5">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Buttons Container */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {/* Primary Instant Download Button */}
                    <button
                      onClick={() => handleDownload(item)}
                      disabled={isDownloading}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      title="Download file directly to this device"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Preparing Download...</span>
                        </>
                      ) : (
                        <>
                          <Download size={14} />
                          <span>Direct Download</span>
                        </>
                      )}
                    </button>

                    {/* Secondary Option: Open / View PDF in Browser */}
                    {hasPdf && (
                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                        title="Open PDF directly in browser"
                      >
                        <Eye size={13} />
                        <span className="hidden sm:inline">Preview</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BOTTOM HELP FOOTER */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Need assistance unzipping or importing a theme to Shopify?</span>
          </div>
          <a
            href="https://wa.me/923330093269?text=Assalam-o-Alaikum%20Mentor%20Sami!%20I%20need%20help%20with%20LMS%20bonus%20downloads."
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
          >
            Chat with Mentor Sami on WhatsApp →
          </a>
        </div>

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (FIXED FOR CELLPHONES) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-2 flex items-center justify-around text-[10px] font-bold shadow-lg">
        <Link
          href="/lms"
          className="flex flex-col items-center gap-1 p-1 text-slate-500 hover:text-slate-900 active:scale-95"
        >
          <Video size={18} />
          <span>Curriculum</span>
        </Link>

        <Link
          href="/lms"
          onClick={() => {
            if (typeof window !== 'undefined') sessionStorage.setItem('sami_lms_target_tab', 'suppliers');
          }}
          className="flex flex-col items-center gap-1 p-1 text-slate-500 hover:text-slate-900 active:scale-95"
        >
          <ShoppingBag size={18} />
          <span>Suppliers</span>
        </Link>

        <div className="flex flex-col items-center gap-1 p-1 text-blue-600 font-extrabold active:scale-95">
          <Download size={18} />
          <span>Bonuses</span>
        </div>

        <Link
          href="/lms"
          onClick={() => {
            if (typeof window !== 'undefined') sessionStorage.setItem('sami_lms_target_tab', 'community');
          }}
          className="flex flex-col items-center gap-1 p-1 text-slate-500 hover:text-slate-900 active:scale-95"
        >
          <Radio size={18} />
          <span>Updates</span>
        </Link>
      </div>

    </div>
  );
}
