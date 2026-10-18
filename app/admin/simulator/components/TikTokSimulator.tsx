'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  RotateCcw, 
  Calendar, 
  HelpCircle, 
  Bell, 
  Plus, 
  Columns, 
  Layers, 
  FileText, 
  Folder, 
  Check, 
  Sliders,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Play,
  TrendingDown,
  TrendingUp,
  Settings
} from 'lucide-react';
import { TikTokData, defaultTikTokData, defaultShopifyData } from '../simulatorData';
import { SimulatedChromeBar } from './SimulatedChromeBar';
import { SimulatorControllerDrawer } from './SimulatorControllerDrawer';

export function TikTokSimulator() {
  const [tiktokData, setTiktokData] = useState<TikTokData>(defaultTikTokData);
  const [shopifyData, setShopifyData] = useState(defaultShopifyData);
  const [activeNav, setActiveNav] = useState<'home' | 'campaigns'>('campaigns');
  const [hierarchyTab, setHierarchyTab] = useState<'campaign' | 'adgroup' | 'ad'>('adgroup');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showChromeBar, setShowChromeBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>(['1']);
  const [selectAll, setSelectAll] = useState(false);

  // Performance tab in Overview
  const [perfTab, setPerfTab] = useState<'graph' | 'data'>('graph');
  const [top5Toggle, setTop5Toggle] = useState(false);
  const [checkedMetrics, setCheckedMetrics] = useState({
    spend: true,
    impressions: true,
    ctr: false,
    conversions: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sami_sim_tiktok');
      if (stored) {
        setTiktokData(JSON.parse(stored));
      }
      const storedShopify = localStorage.getItem('sami_sim_shopify');
      if (storedShopify) {
        setShopifyData(JSON.parse(storedShopify));
      }
      const storedChrome = localStorage.getItem('sami_sim_chrome_bar');
      if (storedChrome !== null) {
        setShowChromeBar(storedChrome === 'true');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  const toggleRowSelect = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      setSelectedRows(tiktokData.adGroups.map(a => a.id));
      setSelectAll(true);
    }
  };

  const toggleAdGroupSwitch = (id: string) => {
    setTiktokData(prev => ({
      ...prev,
      adGroups: prev.adGroups.map(ag =>
        ag.id === id ? { ...ag, on: !ag.on, status: !ag.on ? 'Active' : 'Paused' } : ag
      ),
    }));
  };

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F0F2F5] text-[#161823] flex flex-col font-sans select-none overflow-x-hidden">
      {/* 1. Optional Fake Chrome Browser Frame */}
      <SimulatedChromeBar
        url="ads.tiktok.com/i18n/manage/adgroup?aadvid=7658050158954364946&navigate_from=dashboard"
        tabTitle="Advertising on TikTok | TikTok Ads Manager"
        favicon="tiktok"
        showChromeBar={showChromeBar}
        onToggleChromeBar={() => setShowChromeBar(!showChromeBar)}
        onReload={() => window.location.reload()}
      />

      {/* 2. TikTok Top Navigation Bar (Dark Header #12131A) */}
      <header className="w-full bg-[#12131A] text-white h-12 flex items-center justify-between px-3 shrink-0 z-20 border-b border-black/40">
        <div className="flex items-center gap-3">
          {/* 9 Dots App Launcher */}
          <button type="button" className="p-1 hover:bg-white/10 rounded-md text-white/80">
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
              <circle cx="2" cy="2" r="1.5" />
              <circle cx="8" cy="2" r="1.5" />
              <circle cx="14" cy="2" r="1.5" />
              <circle cx="2" cy="8" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="14" cy="8" r="1.5" />
              <circle cx="2" cy="14" r="1.5" />
              <circle cx="8" cy="14" r="1.5" />
              <circle cx="14" cy="14" r="1.5" />
            </svg>
          </button>

          {/* User Green Circular Avatar */}
          <div className="w-6 h-6 rounded-full bg-[#00C9A7] text-[#12131A] font-black text-xs flex items-center justify-center">
            S
          </div>

          {/* TikTok Ads Manager Logo */}
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-sm text-white">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.38a6.37 6.37 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.75a8.28 8.28 0 0 0 4.84 1.54V6.84a4.83 4.83 0 0 1-.93-.15Z" />
            </svg>
            <span className="font-semibold text-[13px] tracking-normal">TikTok</span>
            <span className="text-[13px] font-normal text-white/90">Ads Manager</span>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="w-72 md:w-96 hidden sm:flex items-center gap-2 bg-[#21242D] border border-white/10 rounded-md px-2.5 py-1 text-xs text-white/70">
          <Search size={13} className="text-white/50" />
          <span className="text-white/40 truncate text-[11px]">Search pages, tools, or help articles</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Account Dropdown */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#21242D] hover:bg-[#2B2F3A] rounded border border-white/10 text-xs text-white cursor-pointer">
            <span className="truncate max-w-[120px] font-medium text-[11px]">{tiktokData.accountName}</span>
            <ChevronDown size={12} className="text-white/60" />
          </div>

          {/* Bell Icon with Red Badge */}
          <div className="relative cursor-pointer p-1 text-white/80 hover:text-white">
            <Bell size={16} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#FE2C55] rounded-full text-[9px] font-bold flex items-center justify-center text-white">
              6
            </span>
          </div>

          {/* Help Circle */}
          <div className="cursor-pointer text-white/80 hover:text-white p-1">
            <HelpCircle size={16} />
          </div>
        </div>
      </header>

      {/* 3. Main Body: Left Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Narrow icon navigation) */}
        <aside className="w-12 bg-white border-r border-[#E5E7EB] flex flex-col items-center py-2.5 gap-1 shrink-0 z-10 shadow-xs">
          {/* Home Icon */}
          <button
            type="button"
            onClick={() => setActiveNav('home')}
            title="Dashboard Overview"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              activeNav === 'home'
                ? 'bg-[#E8F8F5] text-[#00C9A7]'
                : 'text-[#505463] hover:bg-[#F3F4F6] hover:text-[#161823]'
            }`}
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
              <path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z" />
            </svg>
          </button>

          {/* Campaigns Icon */}
          <button
            type="button"
            onClick={() => setActiveNav('campaigns')}
            title="Campaigns"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              activeNav === 'campaigns'
                ? 'bg-[#E8F8F5] text-[#00C9A7]'
                : 'text-[#505463] hover:bg-[#F3F4F6] hover:text-[#161823]'
            }`}
          >
            <Layers size={17} />
          </button>

          {/* Tools / Assets */}
          <button
            type="button"
            title="Assets"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#505463] hover:bg-[#F3F4F6]"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
              <rect x="2" y="2" width="5" height="5" rx="1" />
              <rect x="9" y="2" width="5" height="5" rx="1" />
              <rect x="2" y="9" width="5" height="5" rx="1" />
              <rect x="9" y="9" width="5" height="5" rx="1" />
            </svg>
          </button>

          {/* Analytics */}
          <button
            type="button"
            title="Analytics"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#505463] hover:bg-[#F3F4F6]"
          >
            <FileText size={16} />
          </button>

          {/* Billing / Wallet */}
          <button
            type="button"
            title="Billing"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#505463] hover:bg-[#F3F4F6]"
          >
            <svg viewBox="0 0 18 18" className="w-4 h-4 fill-current">
              <rect x="2" y="4" width="14" height="10" rx="2" />
              <line x1="2" y1="8" x2="16" y2="8" stroke="white" strokeWidth="2" />
            </svg>
          </button>

          {/* Profile / Account */}
          <button
            type="button"
            title="User Profile"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#505463] hover:bg-[#F3F4F6]"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0H3Z" />
            </svg>
          </button>

          {/* More ... */}
          <button
            type="button"
            title="More"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#505463] hover:bg-[#F3F4F6] mt-auto"
          >
            <span className="font-black text-sm tracking-widest">...</span>
          </button>
        </aside>

        {/* 4. Main Scrollable Container */}
        <main className="flex-1 overflow-y-auto bg-[#F6F7FB] flex flex-col">
          {/* ======================================================== */}
          {/* VIEW A: CAMPAIGNS TAB (SCREENSHOT 1 EXACT REPLICA)      */}
          {/* ======================================================== */}
          {activeNav === 'campaigns' && (
            <div className="p-4 sm:p-6 space-y-3.5 max-w-[1920px] mx-auto w-full">
              {/* Header: Title + Create Button */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-[#161823] tracking-tight">Campaigns</h1>
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <button
                      type="button"
                      className="px-4 py-1.5 bg-[#00C9A7] hover:bg-[#00B596] text-white text-xs font-semibold rounded-md flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Plus size={14} className="stroke-[3]" />
                      <span>Create</span>
                      <ChevronDown size={13} className="ml-1" />
                    </button>
                    <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-[#7052FF] text-white text-[9px] font-bold rounded-full uppercase tracking-tighter">
                      New
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter and Tool Bar */}
              <div className="bg-white rounded-lg p-2.5 border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
                {/* Search Bar */}
                <div className="flex-1 min-w-[280px] flex items-center gap-2 bg-[#F6F7FB] border border-[#E5E7EB] rounded-md px-3 py-1.5 text-slate-500">
                  <Search size={13} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search & filter (/) | Tips: Filter by metrics using the table headings"
                    className="w-full bg-transparent outline-none text-[#161823] text-xs placeholder:text-slate-400"
                  />
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 text-slate-700 shrink-0">
                  {/* Date Range Picker */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] rounded-md bg-white hover:bg-slate-50 cursor-pointer font-medium text-xs">
                    <span>{tiktokData.dateRange}</span>
                    <Calendar size={13} className="text-slate-500" />
                  </div>

                  {/* Custom Columns */}
                  <div className="flex items-center gap-1 px-2.5 py-1.5 border border-[#E5E7EB] rounded-md bg-white hover:bg-slate-50 cursor-pointer text-xs">
                    <Columns size={13} className="text-slate-500" />
                    <div className="flex flex-col text-left leading-tight">
                      <span className="font-semibold text-[11px]">Custom columns</span>
                      <span className="text-[9px] text-slate-400">Default Columns</span>
                    </div>
                    <ChevronDown size={12} className="ml-1 text-slate-400" />
                  </div>

                  {/* Breakdown */}
                  <div className="flex items-center gap-1 px-3 py-1.5 border border-[#E5E7EB] rounded-md bg-white hover:bg-slate-50 cursor-pointer text-xs font-medium">
                    <Layers size={13} className="text-slate-500" />
                    <span>Breakdown</span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </div>

                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={() => {}}
                    className="p-1.5 border border-[#E5E7EB] rounded-md bg-white hover:bg-slate-50 text-slate-600"
                    title="Refresh data"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* Hierarchy Tabs: Campaign | Ad group | Ad */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-3 pt-2 rounded-t-lg">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {/* Campaign Tab */}
                  <button
                    type="button"
                    onClick={() => setHierarchyTab('campaign')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                      hierarchyTab === 'campaign'
                        ? 'bg-[#E8F8F5] text-[#00C9A7]'
                        : 'text-slate-600 hover:text-[#161823]'
                    }`}
                  >
                    <Folder size={13} />
                    <span>Campaign</span>
                    <span className="text-[10px] text-slate-400">1 selected</span>
                  </button>

                  {/* Ad Group Tab (Active in Screenshot) */}
                  <button
                    type="button"
                    onClick={() => setHierarchyTab('adgroup')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
                      hierarchyTab === 'adgroup'
                        ? 'bg-[#E8F8F5] text-[#00C9A7]'
                        : 'text-slate-600 hover:text-[#161823]'
                    }`}
                  >
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
                      <rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span>Ad group</span>
                  </button>

                  {/* Ad Tab */}
                  <button
                    type="button"
                    onClick={() => setHierarchyTab('ad')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                      hierarchyTab === 'ad'
                        ? 'bg-[#E8F8F5] text-[#00C9A7]'
                        : 'text-slate-600 hover:text-[#161823]'
                    }`}
                  >
                    <FileText size={13} />
                    <span>Ad</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#161823]">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-slate-500">
                      <path d="M2 3h12v10H2z" />
                    </svg>
                    <span className="font-medium text-[11px]">View report</span>
                    <span className="px-1 py-0.2 bg-[#7052FF] text-white text-[8px] font-bold rounded-full uppercase">
                      New
                    </span>
                  </div>
                  <span className="cursor-pointer text-slate-400 hover:text-[#161823] font-bold">... More</span>
                </div>
              </div>

              {/* Table Container */}
              <div className="bg-white border-x border-b border-[#E5E7EB] rounded-b-lg shadow-2xs overflow-hidden">
                {/* Horizontal scroll wrapper */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAFBFD] text-slate-600 font-semibold border-b border-[#E5E7EB] text-[11px]">
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleToggleSelectAll}
                            className="rounded border-gray-300 text-[#00C9A7] focus:ring-0 cursor-pointer"
                          />
                        </th>
                        <th className="p-3 w-16">On/off</th>
                        {/* Sticky Name column */}
                        <th className="p-3 min-w-[260px] sticky left-0 bg-[#FAFBFD] z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                          Name
                        </th>
                        <th className="p-3 min-w-[120px]">
                          <div className="flex items-center gap-1">
                            <span>Status</span>
                            <span className="px-1 py-0.2 bg-[#7052FF] text-white text-[8px] font-bold rounded-full uppercase">
                              New
                            </span>
                          </div>
                        </th>
                        <th className="p-3 min-w-[160px]">Ad group ID</th>
                        <th className="p-3 min-w-[140px]">Budget</th>
                        <th className="p-3 min-w-[130px]">Amount spent</th>
                        <th className="p-3 min-w-[120px]">Impressions</th>
                        <th className="p-3 min-w-[100px]">Clicks</th>
                        <th className="p-3 min-w-[90px]">CTR</th>
                        <th className="p-3 min-w-[110px]">Conversions</th>
                        <th className="p-3 min-w-[120px]">Cost per Result</th>
                        <th className="p-3 min-w-[100px]">ROAS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-slate-800">
                      {/* Row 0: Draft Ad Groups Notification Banner */}
                      <tr className="bg-[#FAFAFA] text-slate-600 text-[11px]">
                        <td className="p-3 text-center">
                          <input type="checkbox" className="rounded border-gray-300" disabled />
                        </td>
                        <td colSpan={12} className="p-3">
                          <div className="flex items-center gap-2 cursor-pointer hover:text-[#161823]">
                            <ChevronRight size={13} className="text-slate-500" />
                            <span className="font-semibold text-slate-700">You have 2 draft ad groups</span>
                          </div>
                        </td>
                      </tr>

                      {/* Main Ad Groups Data Rows */}
                      {tiktokData.adGroups.map(ag => {
                        const isSelected = selectedRows.includes(ag.id);
                        return (
                          <tr
                            key={ag.id}
                            className={`hover:bg-[#F8F9FA] transition-colors ${
                              isSelected ? 'bg-[#F2FBF9]' : ''
                            }`}
                          >
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleRowSelect(ag.id)}
                                className="rounded border-gray-300 text-[#00C9A7] focus:ring-0 cursor-pointer"
                              />
                            </td>

                            {/* Toggle switch */}
                            <td className="p-3">
                              <button
                                type="button"
                                onClick={() => toggleAdGroupSwitch(ag.id)}
                                className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                                  ag.on ? 'bg-[#00C9A7]' : 'bg-[#D1D5DB]'
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                                    ag.on ? 'left-4' : 'left-0.5'
                                  }`}
                                />
                              </button>
                            </td>

                            {/* Sticky Name Column */}
                            <td className="p-3 sticky left-0 bg-white z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">
                                  <Folder size={14} />
                                </span>
                                <span className="font-medium text-[#161823] hover:text-[#00C9A7] cursor-pointer">
                                  {ag.name}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    ag.status === 'Active' ? 'bg-[#00C9A7]' : 'bg-slate-400'
                                  }`}
                                />
                                <span className="text-slate-700 text-[11px] font-medium">{ag.status}</span>
                              </div>
                            </td>

                            {/* Ad group ID */}
                            <td className="p-3 font-mono text-[11px] text-slate-600">{ag.adGroupId}</td>

                            {/* Budget */}
                            <td className="p-3">
                              <div className="leading-tight">
                                <span className="font-medium text-slate-800">{ag.budget}</span>
                              </div>
                            </td>

                            {/* Amount Spent */}
                            <td className="p-3 font-mono font-medium text-slate-800">
                              {formatNumber(ag.amountSpent)} {tiktokData.currency}
                            </td>

                            {/* Impressions */}
                            <td className="p-3 font-mono text-slate-700">{ag.impressions.toLocaleString()}</td>

                            {/* Clicks */}
                            <td className="p-3 font-mono text-slate-700">{ag.clicks.toLocaleString()}</td>

                            {/* CTR */}
                            <td className="p-3 font-mono text-slate-700">{ag.ctr.toFixed(2)}%</td>

                            {/* Conversions */}
                            <td className="p-3 font-mono font-bold text-slate-900">{ag.conversions}</td>

                            {/* Cost per Result */}
                            <td className="p-3 font-mono text-slate-700">
                              {formatNumber(ag.cpa)} {tiktokData.currency}
                            </td>

                            {/* ROAS */}
                            <td className="p-3 font-mono font-bold text-emerald-600">{ag.roas.toFixed(2)}</td>
                          </tr>
                        );
                      })}

                      {/* Total of 3 ads Summary Row */}
                      <tr className="bg-[#FAFBFD] font-semibold text-slate-700 text-[11px] border-t border-[#E5E7EB]">
                        <td className="p-3 text-center">-</td>
                        <td className="p-3">-</td>
                        <td className="p-3 sticky left-0 bg-[#FAFBFD] z-10">
                          <span className="flex items-center gap-1 text-slate-600">
                            Total of {tiktokData.adGroups.length} ads <HelpCircle size={11} className="text-slate-400" />
                          </span>
                        </td>
                        <td className="p-3">-</td>
                        <td className="p-3">-</td>
                        <td className="p-3">-</td>
                        <td className="p-3 font-mono text-slate-900">
                          {formatNumber(
                            tiktokData.adGroups.reduce((acc, a) => acc + a.amountSpent, 0)
                          )}{' '}
                          {tiktokData.currency}
                        </td>
                        <td className="p-3 font-mono">
                          {tiktokData.adGroups.reduce((acc, a) => acc + a.impressions, 0).toLocaleString()}
                        </td>
                        <td className="p-3 font-mono">
                          {tiktokData.adGroups.reduce((acc, a) => acc + a.clicks, 0).toLocaleString()}
                        </td>
                        <td className="p-3 font-mono">-</td>
                        <td className="p-3 font-mono text-slate-900 font-bold">
                          {tiktokData.adGroups.reduce((acc, a) => acc + a.conversions, 0)}
                        </td>
                        <td className="p-3 font-mono">-</td>
                        <td className="p-3 font-mono text-emerald-600 font-bold">
                          {(
                            tiktokData.adGroups.reduce((acc, a) => acc + a.roas, 0) /
                            (tiktokData.adGroups.length || 1)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Bottom Pagination */}
                <div className="flex items-center justify-between p-3 border-t border-[#E5E7EB] bg-white text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Showing 1 to {tiktokData.adGroups.length} of {tiktokData.adGroups.length} entries</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button type="button" className="p-1 border border-gray-200 rounded text-slate-400 cursor-not-allowed">
                        <ChevronLeft size={13} />
                      </button>
                      <span className="px-2 py-0.5 rounded border border-[#00C9A7] bg-[#E8F8F5] text-[#00C9A7] font-bold text-xs">
                        1
                      </span>
                      <button type="button" className="p-1 border border-gray-200 rounded text-slate-400 cursor-not-allowed">
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 border border-gray-200 px-2 py-1 rounded text-xs cursor-pointer">
                      <span>200/page</span>
                      <ChevronDown size={11} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW B: OVERVIEW TAB (SCREENSHOT 2 EXACT REPLICA)        */}
          {/* ======================================================== */}
          {activeNav === 'home' && (
            <div className="p-4 sm:p-6 space-y-4 max-w-[1920px] mx-auto w-full">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-[#161823] tracking-tight">
                  Welcome to Ads Manager
                </h1>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 bg-white border border-[#E5E7EB] rounded-md font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <FileText size={13} />
                    <span>Log</span>
                  </button>
                  <button
                    type="button"
                    className="px-4 py-1.5 bg-[#00C9A7] hover:bg-[#00B596] text-white font-semibold rounded-md flex items-center gap-1 shadow-xs transition-colors"
                  >
                    Create ad
                  </button>
                </div>
              </div>

              {/* Recommendations Card */}
              <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-[#161823]">Recommendations</span>
                  <a href="#all" className="text-xs text-slate-500 hover:text-[#00C9A7] flex items-center gap-1">
                    <span>View all recommendations</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg bg-[#FAFBFD] border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-pink-400 p-0.5 flex items-center justify-center shrink-0 shadow-xs">
                    <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                      <span className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-pink-500" />
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-xs text-[#161823]">Measurement</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Capture unmeasured sales by tracking purchase intent directly through customer feedback.
                    </p>
                    <div className="pt-1">
                      <button
                        type="button"
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Set up now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Left Summary / Right Performance Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left 4 Cols: Account Overview + Ad Group Status */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Account Overview */}
                  <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-2xs space-y-3">
                    <h3 className="font-bold text-sm text-[#161823]">Account overview</h3>
                    <div className="flex items-baseline justify-between pt-1">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <span>Available balance</span>
                          <HelpCircle size={12} />
                        </div>
                        <div className="text-lg font-bold font-mono text-[#161823]">
                          {formatNumber(tiktokData.availableBalance)} <span className="text-xs font-sans text-slate-500 font-normal">{tiktokData.currency}</span>
                        </div>
                      </div>
                      <a href="#viewmore" className="text-xs text-[#00C9A7] font-medium hover:underline">
                        View more
                      </a>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Today's spend</span>
                      <span className="font-mono font-medium text-slate-800">
                        {formatNumber(tiktokData.todaySpend)} {tiktokData.currency}
                      </span>
                    </div>
                  </div>

                  {/* Ad Group Status */}
                  <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-2xs space-y-3">
                    <h3 className="font-bold text-sm text-[#161823]">Ad group status</h3>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                            {tiktokData.activeAdGroupsCount}
                          </span>
                          <span className="font-medium text-slate-700">Active</span>
                        </div>
                        <span className="text-slate-400 hover:text-slate-600 cursor-pointer flex items-center gap-0.5 text-[11px]">
                          View details <ChevronRight size={12} />
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold text-[10px]">
                            {tiktokData.partiallyDeliveringCount}
                          </span>
                          <span className="font-medium text-slate-700">Partially delivering</span>
                        </div>
                        <span className="text-slate-400 hover:text-slate-600 cursor-pointer flex items-center gap-0.5 text-[11px]">
                          View details <ChevronRight size={12} />
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                            {tiktokData.notDeliveringCount}
                          </span>
                          <span className="font-medium text-slate-700">Not delivering</span>
                        </div>
                        <span className="text-slate-400 hover:text-slate-600 cursor-pointer flex items-center gap-0.5 text-[11px]">
                          View details <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 8 Cols: Performance Card with Exact Dual-Axis Spline Chart */}
                <div className="lg:col-span-8 bg-white rounded-lg p-4 sm:p-5 border border-[#E5E7EB] shadow-2xs space-y-4">
                  {/* Card Header & Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-sm text-[#161823]">Performance</h3>
                      <div className="flex items-center bg-slate-100 p-0.5 rounded-md text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setPerfTab('graph')}
                          className={`px-3 py-1 rounded transition-colors ${
                            perfTab === 'graph' ? 'bg-white shadow-2xs text-[#161823]' : 'text-slate-500'
                          }`}
                        >
                          Graph
                        </button>
                        <button
                          type="button"
                          onClick={() => setPerfTab('data')}
                          className={`px-3 py-1 rounded transition-colors ${
                            perfTab === 'data' ? 'bg-white shadow-2xs text-[#161823]' : 'text-slate-500'
                          }`}
                        >
                          Data
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      {/* Date Range */}
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <span>{tiktokData.dateRange}</span>
                        <span className="text-[10px] text-slate-400 font-mono">UTC+05:00</span>
                        <Calendar size={13} className="text-slate-400 ml-1" />
                      </div>

                      {/* Top 5 Campaigns Toggle */}
                      <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                        <span className="text-[11px] text-slate-500">View top 5 campaigns</span>
                        <button
                          type="button"
                          onClick={() => setTop5Toggle(!top5Toggle)}
                          className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                            top5Toggle ? 'bg-[#00C9A7]' : 'bg-[#D1D5DB]'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                              top5Toggle ? 'left-3.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Chart and Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                    {/* Left Metrics Selector (4 Cols) */}
                    <div className="md:col-span-4 space-y-2 text-xs">
                      {/* Spend Selector */}
                      <div className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-400 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            Spend <ChevronDown size={11} className="text-slate-400" />
                          </span>
                          <input
                            type="checkbox"
                            checked={checkedMetrics.spend}
                            onChange={() =>
                              setCheckedMetrics(prev => ({ ...prev, spend: !prev.spend }))
                            }
                            className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-bold font-mono text-sm text-[#161823]">
                            {formatNumber(tiktokData.spend)} <span className="text-[10px] font-sans font-normal text-slate-500">{tiktokData.currency}</span>
                          </span>
                          <span className="text-[11px] font-bold text-red-500 flex items-center">
                            ↓ {Math.abs(tiktokData.spendChangePct)}%
                          </span>
                        </div>
                      </div>

                      {/* Impressions Selector */}
                      <div className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-400 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            Impressions <ChevronDown size={11} className="text-slate-400" />
                          </span>
                          <input
                            type="checkbox"
                            checked={checkedMetrics.impressions}
                            onChange={() =>
                              setCheckedMetrics(prev => ({ ...prev, impressions: !prev.impressions }))
                            }
                            className="rounded text-slate-900 focus:ring-0 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-bold font-mono text-sm text-[#161823]">
                            {tiktokData.impressions.toLocaleString()}
                          </span>
                          <span className="text-[11px] font-bold text-red-500 flex items-center">
                            ↓ {Math.abs(tiktokData.impressionsChangePct)}%
                          </span>
                        </div>
                      </div>

                      {/* CTR Selector */}
                      <div className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-400 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            CTR (destination) <ChevronDown size={11} className="text-slate-400" />
                          </span>
                          <input
                            type="checkbox"
                            checked={checkedMetrics.ctr}
                            onChange={() =>
                              setCheckedMetrics(prev => ({ ...prev, ctr: !prev.ctr }))
                            }
                            className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-bold font-mono text-sm text-[#161823]">
                            {tiktokData.ctr.toFixed(2)}%
                          </span>
                          <span className="text-[11px] font-bold text-emerald-500 flex items-center">
                            ↑ {tiktokData.ctrChangePct}%
                          </span>
                        </div>
                      </div>

                      {/* Conversions Selector */}
                      <div className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-400 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            Conversions <ChevronDown size={11} className="text-slate-400" />
                          </span>
                          <input
                            type="checkbox"
                            checked={checkedMetrics.conversions}
                            onChange={() =>
                              setCheckedMetrics(prev => ({ ...prev, conversions: !prev.conversions }))
                            }
                            className="rounded text-purple-600 focus:ring-0 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-bold font-mono text-sm text-[#161823]">
                            {tiktokData.conversions}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-500 flex items-center">
                            ↑ {tiktokData.conversionsChangePct}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Spline Chart (8 Cols) */}
                    <div className="md:col-span-8 flex flex-col justify-between min-h-[260px] relative">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
                        <span>Spend (PKR)</span>
                        <span>Impressions</span>
                      </div>

                      {/* SVG Spline Chart */}
                      <div className="w-full h-48 relative my-2">
                        <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                          <defs>
                            {/* Blue gradient fill for spend */}
                            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                            </linearGradient>
                            {/* Purple gradient fill for impressions */}
                            <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.12" />
                              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F3F5" strokeDasharray="3 3" />
                          <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F3F5" strokeDasharray="3 3" />
                          <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F3F5" strokeDasharray="3 3" />
                          <line x1="0" y1="160" x2="500" y2="160" stroke="#E5E7EB" />

                          {/* 1. Purple Area & Spline: Impressions */}
                          {checkedMetrics.impressions && (
                            <>
                              <path
                                d="M 10 70 C 70 75, 120 155, 180 158 C 240 160, 280 45, 330 45 C 370 45, 410 48, 440 145 C 465 158, 485 160, 490 160 L 490 160 L 10 160 Z"
                                fill="url(#impGrad)"
                              />
                              <path
                                d="M 10 70 C 70 75, 120 155, 180 158 C 240 160, 280 45, 330 45 C 370 45, 410 48, 440 145 C 465 158, 485 160, 490 160"
                                fill="none"
                                stroke="#818CF8"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </>
                          )}

                          {/* 2. Deep Blue Area & Spline: Spend (Matches Screenshot 2 peak curve) */}
                          {checkedMetrics.spend && (
                            <>
                              <path
                                d="M 10 60 C 80 80, 140 155, 200 158 C 260 160, 290 35, 335 35 C 370 35, 400 60, 440 158 L 490 160 L 490 160 L 10 160 Z"
                                fill="url(#spendGrad)"
                              />
                              <path
                                d="M 10 60 C 80 80, 140 155, 200 158 C 260 160, 290 35, 335 35 C 370 35, 400 60, 440 158 L 490 160"
                                fill="none"
                                stroke="#2563EB"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              {/* Peak dot with tooltip indicator */}
                              <circle cx="335" cy="35" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                            </>
                          )}
                        </svg>
                      </div>

                      {/* X-Axis Dates */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                        <span>2026-10-12</span>
                        <span>2026-10-13</span>
                        <span>2026-10-14</span>
                        <span>2026-10-15</span>
                        <span>2026-10-16</span>
                        <span>2026-10-17</span>
                        <span>2026-10-18</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Cards: Insights & Updates */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Insights (8 Cols) */}
                <div className="lg:col-span-8 bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-2xs space-y-3">
                  <h3 className="font-bold text-sm text-[#161823]">Insights</h3>

                  {/* Top Ads */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-700">Your top ads</span>
                      <a href="#analysis" className="text-xs text-[#00C9A7] hover:underline">
                        View analysis
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Consider concentrating your budget on high-performing videos that deliver more results to your campaign objectives.
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-24 h-24 rounded-lg bg-slate-900 relative overflow-hidden group cursor-pointer border border-slate-200 shadow-xs">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                          alt="Top Winning Ad Creative"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-white/90 text-[#161823] flex items-center justify-center pl-0.5 shadow-md">
                            <Play size={12} className="fill-current" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                          Winning Creative #1
                        </span>
                        <div className="font-semibold text-slate-800">UGC Pakistani Lifestyle Hook Video</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Spend: 1,840 PKR | Conversions: 14 | ROAS: 5.4x
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reached Audience */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="font-semibold text-xs text-slate-700">Reached audience</span>
                    <div className="grid grid-cols-4 gap-2 pt-1 text-xs">
                      <div className="p-2.5 rounded bg-slate-50 space-y-0.5">
                        <span className="text-[10px] text-slate-400">Android</span>
                        <div className="text-sm font-bold font-mono text-[#161823]">
                          {tiktokData.audienceAndroidPct}%
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-500">↑ 5%</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 space-y-0.5">
                        <span className="text-[10px] text-slate-400">iOS</span>
                        <div className="text-sm font-bold font-mono text-[#161823]">
                          {tiktokData.audienceIosPct}%
                        </div>
                        <span className="text-[10px] font-semibold text-red-500">↓ 23%</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 space-y-0.5">
                        <span className="text-[10px] text-slate-400">iPad</span>
                        <div className="text-sm font-bold font-mono text-[#161823]">0%</div>
                        <span className="text-[10px] font-semibold text-red-500">↓ 99%</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 space-y-0.5">
                        <span className="text-[10px] text-slate-400">Unknown</span>
                        <div className="text-sm font-bold font-mono text-[#161823]">0%</div>
                        <span className="text-[10px] font-semibold text-red-500">↓ 100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Updates (4 Cols) */}
                <div className="lg:col-span-4 bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#161823]">Updates</h3>
                      <span className="text-[11px] text-slate-400">1 / 5</span>
                    </div>

                    <div className="rounded-lg overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-3 flex flex-col items-center text-center">
                      <div className="w-16 h-12 bg-white rounded-md shadow-xs flex items-center justify-center mb-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check size={12} className="text-emerald-600" />
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800">TikTok Pangle is now TikTok Ad Network</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Access millions of premium app audiences across Pakistan & UAE with advanced placement optimization.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      className="w-full py-1.5 bg-white border border-gray-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Discrete Hidden Controller Trigger (Tiny 4% opacity dot in bottom right, invisible on camera) */}
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
        activePlatform="tiktok"
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
