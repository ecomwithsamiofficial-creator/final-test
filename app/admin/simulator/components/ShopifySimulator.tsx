'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  RotateCcw, 
  Calendar, 
  HelpCircle, 
  Bell, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  Activity, 
  Settings, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ShopifyData, defaultShopifyData, defaultTikTokData } from '../simulatorData';
import { SimulatedChromeBar } from './SimulatedChromeBar';
import { SimulatorControllerDrawer } from './SimulatorControllerDrawer';

export function ShopifySimulator() {
  const [shopifyData, setShopifyData] = useState<ShopifyData>(defaultShopifyData);
  const [tiktokData, setTiktokData] = useState(defaultTikTokData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showChromeBar, setShowChromeBar] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState(18);
  const [activeDateTab, setActiveDateTab] = useState<'today' | '7days' | '30days'>('7days');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedShopify = localStorage.getItem('sami_sim_shopify');
      if (storedShopify) {
        setShopifyData(JSON.parse(storedShopify));
      }
      const storedTikTok = localStorage.getItem('sami_sim_tiktok');
      if (storedTikTok) {
        setTiktokData(JSON.parse(storedTikTok));
      }
      const storedChrome = localStorage.getItem('sami_sim_chrome_bar');
      if (storedChrome !== null) {
        setShowChromeBar(storedChrome === 'true');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Organic pulsing live visitor fluctuation (Every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const min = shopifyData.liveVisitorsMin || 14;
      const max = shopifyData.liveVisitorsMax || 22;
      const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
      setLiveVisitors(prev => {
        const next = prev + delta;
        if (next < min) return min + 1;
        if (next > max) return max - 1;
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [shopifyData.liveVisitorsMin, shopifyData.liveVisitorsMax]);

  // Keyboard shortcut listener for secret drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'K' || e.key === 'S')) || e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsDrawerOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F1F2F4] text-[#202223] flex flex-col font-sans select-none overflow-x-hidden">
      {/* 1. Optional Fake Chrome Browser Frame */}
      <SimulatedChromeBar
        url="admin.shopify.com/store/sami-official/analytics"
        tabTitle={`Analytics • ${shopifyData.storeName} • Shopify`}
        favicon="shopify"
        showChromeBar={showChromeBar}
        onToggleChromeBar={() => setShowChromeBar(!showChromeBar)}
        onReload={() => window.location.reload()}
      />

      {/* 2. Modern Shopify Polaris Top Bar (#1A1A1A) */}
      <header className="w-full bg-[#1A1A1A] text-white h-13 flex items-center justify-between px-4 shrink-0 z-20 border-b border-black/30">
        <div className="flex items-center gap-3">
          {/* Shopify Bag Icon */}
          <div className="w-7 h-7 rounded-lg bg-[#96BF48] flex items-center justify-center text-slate-950 font-black text-xs shadow-xs">
            <ShoppingBag size={15} className="fill-slate-950 text-slate-950" />
          </div>

          {/* Store Switcher */}
          <div className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded-md cursor-pointer transition-colors">
            <span className="font-bold text-xs text-white tracking-tight">{shopifyData.storeName}</span>
            <span className="px-1.5 py-0.2 rounded bg-white/15 text-[10px] text-white/80 font-medium">
              Shopify Plus
            </span>
            <ChevronDown size={13} className="text-white/60" />
          </div>
        </div>

        {/* Center Search Input */}
        <div className="w-80 md:w-96 hidden sm:flex items-center gap-2 bg-[#2B2B2B] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 shadow-inner">
          <Search size={14} className="text-white/40" />
          <span className="text-white/40 truncate text-xs">Search (Ctrl+K)</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Bell Notifications */}
          <div className="p-1.5 hover:bg-white/10 rounded-md text-white/80 cursor-pointer">
            <Bell size={16} />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/15 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              SS
            </div>
            <span className="text-xs font-medium text-white/90 hidden md:inline">Sardar Samiullah</span>
          </div>
        </div>
      </header>

      {/* 3. Main Content: Left Polaris Sidebar + Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Polaris Sidebar */}
        <aside className="w-60 bg-[#EBECEF] border-r border-[#D2D5D8] hidden md:flex flex-col py-3 px-2 gap-0.5 shrink-0 text-xs text-[#202223] font-medium select-none">
          <div className="px-3 py-1.5 rounded-lg hover:bg-white/60 cursor-pointer text-[#4A4C4E] flex items-center gap-2.5">
            <span>Home</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg hover:bg-white/60 cursor-pointer text-[#4A4C4E] flex items-center justify-between">
            <span>Orders</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#D2D5D8] text-[10px] font-bold">14</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg hover:bg-white/60 cursor-pointer text-[#4A4C4E] flex items-center gap-2.5">
            <span>Products</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg hover:bg-white/60 cursor-pointer text-[#4A4C4E] flex items-center gap-2.5">
            <span>Customers</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg hover:bg-white/60 cursor-pointer text-[#4A4C4E] flex items-center gap-2.5">
            <span>Content</span>
          </div>

          {/* Analytics (ACTIVE TAB) */}
          <div className="px-3 py-2 rounded-lg bg-white shadow-2xs font-bold text-[#202223] flex items-center justify-between border border-[#D2D5D8]/50 my-0.5">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008060]" />
              Analytics
            </span>
            <span className="text-[10px] text-emerald-700 font-bold">LIVE</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg hover:bg-white/60 cursor-pointer text-[#4A4C4E] flex items-center gap-2.5">
            <span>Marketing</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg hover:bg-white/60 cursor-pointer text-[#4A4C4E] flex items-center gap-2.5">
            <span>Discounts</span>
          </div>

          <div className="pt-3 mt-2 border-t border-[#D2D5D8] text-[11px] font-bold text-slate-500 px-3 uppercase tracking-wider">
            Sales Channels
          </div>
          <div className="px-3 py-1.5 rounded-lg hover:bg-white/60 cursor-pointer text-[#4A4C4E] flex items-center justify-between">
            <span>Online Store</span>
            <ExternalLink size={12} className="text-slate-400" />
          </div>
          <div className="px-3 py-1.5 rounded-lg hover:bg-white/60 cursor-pointer text-[#4A4C4E] flex items-center gap-2.5">
            <span>Point of Sale</span>
          </div>

          <div className="mt-auto px-3 py-2 rounded-lg hover:bg-white/60 cursor-pointer text-[#4A4C4E] flex items-center gap-2">
            <Settings size={14} className="text-slate-500" />
            <span>Settings</span>
          </div>
        </aside>

        {/* Main Analytics Content Container */}
        <main className="flex-1 overflow-y-auto bg-[#F1F2F4] p-4 sm:p-7 space-y-5 max-w-[1600px] mx-auto w-full">
          {/* Header & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
            <div className="space-y-0.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#202223] tracking-tight">Analytics</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Auto-refreshing live data • Updated just now</span>
              </div>
            </div>

            {/* Date filter & Compare buttons */}
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-white border border-[#D2D5D8] rounded-lg p-0.5 flex items-center shadow-2xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveDateTab('today')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeDateTab === 'today' ? 'bg-[#F1F2F4] text-[#202223] font-bold' : 'text-slate-600'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDateTab('7days')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeDateTab === '7days' ? 'bg-[#F1F2F4] text-[#202223] font-bold' : 'text-slate-600'
                  }`}
                >
                  Last 7 days
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDateTab('30days')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeDateTab === '30days' ? 'bg-[#F1F2F4] text-[#202223] font-bold' : 'text-slate-600'
                  }`}
                >
                  Last 30 days
                </button>
              </div>

              {/* Date String Badge */}
              <div className="bg-white border border-[#D2D5D8] rounded-lg px-3 py-1.5 flex items-center gap-2 font-medium text-slate-700 shadow-2xs">
                <Calendar size={13} className="text-slate-500" />
                <span>{shopifyData.dateRange}</span>
              </div>
            </div>
          </div>

          {/* Top Live View Beacon Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#0B251E] to-[#12382D] text-white p-4 rounded-xl border border-emerald-500/30 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping absolute" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 relative" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-white">Live View</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                    Store Active
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80">Real-time visitors currently browsing your checkout funnel</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight transition-all">
                {liveVisitors}
              </span>
              <span className="text-xs text-emerald-200 font-medium">visitors right now</span>
            </div>
          </div>

          {/* Core Analytics Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Total Sales Card (With Interactive Hourly/Daily Area Chart) */}
            <div className="bg-white rounded-xl p-5 border border-[#D2D5D8] shadow-2xs space-y-3 lg:col-span-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <span>Total sales</span>
                    <HelpCircle size={12} className="text-slate-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#202223] mt-1 tracking-tight">
                    {formatCurrency(shopifyData.totalSales)}{' '}
                    <span className="text-sm font-sans font-normal text-slate-500">{shopifyData.currency}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <TrendingUp size={13} />
                  <span>↑ {shopifyData.totalSalesChangePct}%</span>
                </div>
              </div>

              {/* Realistic Sales Spline Chart */}
              <div className="w-full h-44 pt-3 relative">
                <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="shopifySalesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#008060" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#008060" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#F1F2F4" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#F1F2F4" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F2F4" strokeDasharray="3 3" />
                  <line x1="0" y1="130" x2="500" y2="130" stroke="#E1E3E5" />

                  {/* Shaded Area */}
                  <path
                    d="M 10 115 C 60 100, 100 120, 150 70 C 200 20, 240 85, 290 35 C 340 -5, 390 45, 430 20 C 460 5, 480 30, 490 25 L 490 130 L 10 130 Z"
                    fill="url(#shopifySalesGrad)"
                  />

                  {/* Spline Curve */}
                  <path
                    d="M 10 115 C 60 100, 100 120, 150 70 C 200 20, 240 85, 290 35 C 340 -5, 390 45, 430 20 C 460 5, 480 30, 490 25"
                    fill="none"
                    stroke="#008060"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Peak Marker Dot */}
                  <circle cx="340" cy="18" r="4.5" fill="#008060" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>12:00 AM</span>
                  <span>4:00 AM</span>
                  <span>8:00 AM</span>
                  <span>12:00 PM</span>
                  <span>4:00 PM</span>
                  <span>8:00 PM</span>
                  <span>11:59 PM</span>
                </div>
              </div>
            </div>

            {/* 2. Online Store Conversion Rate */}
            <div className="bg-white rounded-xl p-5 border border-[#D2D5D8] shadow-2xs space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-600">Online store conversion rate</div>
                  <div className="text-2xl font-extrabold font-mono text-[#202223] mt-1 tracking-tight">
                    {shopifyData.conversionRate.toFixed(2)}%
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ↑ {shopifyData.conversionRateChangePct}%
                </div>
              </div>

              {/* Conversion Funnel Breakdown */}
              <div className="space-y-2.5 pt-1 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Added to cart</span>
                    <span className="font-mono font-semibold">{shopifyData.addedToCartPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#008060]" style={{ width: `${shopifyData.addedToCartPct * 8}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Reached checkout</span>
                    <span className="font-mono font-semibold">{shopifyData.reachedCheckoutPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#008060]" style={{ width: `${shopifyData.reachedCheckoutPct * 8}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Sessions converted</span>
                    <span className="font-mono font-bold text-emerald-700">{shopifyData.conversionRate}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600" style={{ width: `${shopifyData.conversionRate * 8}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Total Orders */}
            <div className="bg-white rounded-xl p-5 border border-[#D2D5D8] shadow-2xs space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="text-xs font-semibold text-slate-600">Total orders</div>
                <div className="text-xs font-bold text-emerald-700">↑ {shopifyData.ordersChangePct}%</div>
              </div>
              <div className="text-2xl font-extrabold font-mono text-[#202223]">
                {shopifyData.orders.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">Fulfilled orders across Pakistan & GCC</p>
            </div>

            {/* 4. Average Order Value (AOV) */}
            <div className="bg-white rounded-xl p-5 border border-[#D2D5D8] shadow-2xs space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="text-xs font-semibold text-slate-600">Average order value</div>
                <div className="text-xs font-bold text-emerald-700">↑ 12%</div>
              </div>
              <div className="text-2xl font-extrabold font-mono text-[#202223]">
                {formatCurrency(shopifyData.aov)}{' '}
                <span className="text-xs font-sans font-normal text-slate-500">{shopifyData.currency}</span>
              </div>
              <p className="text-[11px] text-slate-400">High bundle uptake & post-purchase upsells</p>
            </div>

            {/* 5. Online Store Sessions */}
            <div className="bg-white rounded-xl p-5 border border-[#D2D5D8] shadow-2xs space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="text-xs font-semibold text-slate-600">Online store sessions</div>
                <div className="text-xs font-bold text-emerald-700">↑ {shopifyData.sessionsChangePct}%</div>
              </div>
              <div className="text-2xl font-extrabold font-mono text-[#202223]">
                {shopifyData.sessions.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">Unique visitors driven by TikTok & Meta Ads</p>
            </div>
          </div>

          {/* Bottom Grid: Traffic Sources & Top Winning Products */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
            {/* Traffic Sources (4 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-[#D2D5D8] shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-[#202223]">Sales by traffic referrer</h3>

              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00C9A7]" /> TikTok Ads
                    </span>
                    <span className="font-mono font-bold">{shopifyData.referrerTikTokPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00C9A7]" style={{ width: `${shopifyData.referrerTikTokPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" /> Facebook / Instagram Ads
                    </span>
                    <span className="font-mono font-bold">{shopifyData.referrerMetaPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1877F2]" style={{ width: `${shopifyData.referrerMetaPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Direct & Organic
                    </span>
                    <span className="font-mono font-bold">{shopifyData.referrerDirectPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400" style={{ width: `${shopifyData.referrerDirectPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Products (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-[#D2D5D8] shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-[#202223]">Top products by units sold</h3>

              <div className="divide-y divide-[#E1E3E5] text-xs">
                {shopifyData.topProducts.map(prod => (
                  <div key={prod.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 truncate hover:text-[#008060] cursor-pointer">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {prod.unitsSold} units sold
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono font-bold text-slate-900">
                      {formatCurrency(prod.revenue)} {shopifyData.currency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Discrete Hidden Controller Trigger (Tiny 4% opacity dot in bottom right) */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        title="Open Simulator Controller (Shortcut: Ctrl + Shift + S or ~)"
        className="fixed bottom-2 right-2 w-5 h-5 rounded-full bg-black/5 hover:bg-black/60 text-transparent hover:text-white flex items-center justify-center transition-all z-40 cursor-pointer"
      >
        <Settings size={12} />
      </button>

      {/* Hidden Controller Drawer Modal */}
      <SimulatorControllerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activePlatform="shopify"
        tiktokData={tiktokData}
        setTiktokData={setTiktokData}
        shopifyData={shopifyData}
        setShopifyData={setShopifyData}
        showChromeBar={showChromeBar}
        setShowChromeBar={setShowChromeBar}
      />
    </div>
  );
}
