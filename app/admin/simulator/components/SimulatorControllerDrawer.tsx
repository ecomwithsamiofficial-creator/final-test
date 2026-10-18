'use client';

import React, { useState } from 'react';
import { X, Sparkles, Save, RotateCcw, Plus, Trash2, Check, Sliders, Eye, EyeOff } from 'lucide-react';
import { TikTokData, ShopifyData, defaultTikTokData, defaultShopifyData } from '../simulatorData';

interface SimulatorControllerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePlatform: 'tiktok' | 'shopify';
  tiktokData: TikTokData;
  setTiktokData: React.Dispatch<React.SetStateAction<TikTokData>>;
  shopifyData: ShopifyData;
  setShopifyData: React.Dispatch<React.SetStateAction<ShopifyData>>;
  showChromeBar: boolean;
  setShowChromeBar: (show: boolean) => void;
}

export function SimulatorControllerDrawer({
  isOpen,
  onClose,
  activePlatform,
  tiktokData,
  setTiktokData,
  shopifyData,
  setShopifyData,
  showChromeBar,
  setShowChromeBar,
}: SimulatorControllerDrawerProps) {
  const [tab, setTab] = useState<'tiktok' | 'shopify' | 'presets'>(activePlatform);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSaveToLocalStorage = () => {
    try {
      localStorage.setItem('sami_sim_tiktok', JSON.stringify(tiktokData));
      localStorage.setItem('sami_sim_shopify', JSON.stringify(shopifyData));
      localStorage.setItem('sami_sim_chrome_bar', String(showChromeBar));
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const applyPreset = (type: 'massive_scale' | 'winning_test' | 'starter') => {
    if (type === 'massive_scale') {
      setShopifyData(prev => ({
        ...prev,
        totalSales: 9480200,
        orders: 3120,
        sessions: 78500,
        conversionRate: 3.97,
        aov: 3038,
        totalSalesChangePct: 74,
      }));
      setTiktokData(prev => ({
        ...prev,
        spend: 184500.0,
        impressions: 489000,
        conversions: 840,
        spendChangePct: 45,
        conversionsChangePct: 82,
        availableBalance: 45800.0,
        adGroups: [
          {
            id: '1',
            name: '🏆 SCALE_WINNER_CBO_BROAD_V1',
            on: true,
            status: 'Active',
            adGroupId: '1878901239841209',
            budget: '25,000.00 PKR Daily',
            amountSpent: 78920.0,
            impressions: 210400,
            clicks: 4210,
            ctr: 2.0,
            conversions: 412,
            cpa: 191.55,
            roas: 5.2,
          },
          {
            id: '2',
            name: '🎯 RETARGETING_ATC_7DAYS_SCALE',
            on: true,
            status: 'Active',
            adGroupId: '1878901239841210',
            budget: '10,000.00 PKR Daily',
            amountSpent: 31200.0,
            impressions: 89400,
            clicks: 2140,
            ctr: 2.39,
            conversions: 186,
            cpa: 167.74,
            roas: 5.8,
          },
          {
            id: '3',
            name: '⚡ CREATIVE_TESTING_HOOKS_3',
            on: true,
            status: 'Active',
            adGroupId: '1878901239841211',
            budget: '5,000.00 PKR Daily',
            amountSpent: 14200.0,
            impressions: 42000,
            clicks: 790,
            ctr: 1.88,
            conversions: 64,
            cpa: 221.87,
            roas: 3.9,
          },
        ],
      }));
    } else if (type === 'winning_test') {
      setShopifyData(prev => ({
        ...prev,
        totalSales: 2150000,
        orders: 740,
        sessions: 19400,
        conversionRate: 3.81,
        aov: 2905,
      }));
      setTiktokData(prev => ({
        ...prev,
        spend: 42500.0,
        impressions: 112000,
        conversions: 194,
        availableBalance: 12400.0,
      }));
    } else {
      setTiktokData(defaultTikTokData);
      setShopifyData(defaultShopifyData);
    }
    handleSaveToLocalStorage();
  };

  const updateTikTokField = (key: keyof TikTokData, value: any) => {
    setTiktokData(prev => ({ ...prev, [key]: value }));
  };

  const updateShopifyField = (key: keyof ShopifyData, value: any) => {
    setShopifyData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateAdGroup = (idx: number, field: string, val: any) => {
    setTiktokData(prev => {
      const copy = [...prev.adGroups];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, adGroups: copy };
    });
  };

  const handleAddAdGroup = () => {
    setTiktokData(prev => ({
      ...prev,
      adGroups: [
        ...prev.adGroups,
        {
          id: String(Date.now()),
          name: `New Ad Group ${prev.adGroups.length + 1}`,
          on: true,
          status: 'Active',
          adGroupId: `187${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
          budget: '1,500.00 PKR Daily',
          amountSpent: 1200,
          impressions: 8500,
          clicks: 160,
          ctr: 1.88,
          conversions: 8,
          cpa: 150,
          roas: 4.2,
        },
      ],
    }));
  };

  const handleDeleteAdGroup = (idx: number) => {
    setTiktokData(prev => {
      const copy = [...prev.adGroups];
      copy.splice(idx, 1);
      return { ...prev, adGroups: copy };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-full bg-[#111318] text-slate-200 border-l border-white/10 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#171A21]">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-[#00C9A7]" />
            <span className="font-bold text-sm text-white">Live Dashboard Simulator Control Room</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 bg-[#0E1015] px-3 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('tiktok')}
            className={`px-3 py-2 rounded-t-lg transition-colors ${
              tab === 'tiktok' ? 'bg-[#171A21] text-[#00C9A7] border-t-2 border-[#00C9A7]' : 'text-slate-400 hover:text-white'
            }`}
          >
            TikTok Ads Settings
          </button>
          <button
            type="button"
            onClick={() => setTab('shopify')}
            className={`px-3 py-2 rounded-t-lg transition-colors ${
              tab === 'shopify' ? 'bg-[#171A21] text-[#96BF48] border-t-2 border-[#96BF48]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shopify Settings
          </button>
          <button
            type="button"
            onClick={() => setTab('presets')}
            className={`px-3 py-2 rounded-t-lg transition-colors ${
              tab === 'presets' ? 'bg-[#171A21] text-amber-400 border-t-2 border-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Quick Presets
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
          {tab === 'presets' && (
            <div className="space-y-3">
              <div className="text-slate-400 text-xs">
                Pick a ready-made high-hype preset for your video case study:
              </div>

              <div
                onClick={() => applyPreset('massive_scale')}
                className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-sm">🔥 9.4 Million PKR Scale (Winning Store)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">ROAS 5.2x</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Shopify: PKR 9,480,200 Sales | 3,120 Orders | TikTok Spend: PKR 184,500 with CBO & Retargeting winning campaigns.
                </p>
              </div>

              <div
                onClick={() => applyPreset('winning_test')}
                className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400 text-sm">🚀 2.15 Million PKR Winning Product</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">ROAS 3.8x</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Shopify: PKR 2,150,000 Sales | 740 Orders | TikTok: PKR 42,500 Spend | 194 Conversions.
                </p>
              </div>

              <div
                onClick={() => applyPreset('starter')}
                className="p-3.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 text-sm">🔄 Reset to Exact Screenshots State</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono text-[10px]">Default</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Restores the exact values from your uploaded screenshots (PKR 4,328.98 Spend, 24 Conversions, etc.).
                </p>
              </div>

              {/* Fake Chrome Frame Toggle */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="font-bold text-white text-xs block">Screen Recording Mode:</span>
                <button
                  type="button"
                  onClick={() => setShowChromeBar(!showChromeBar)}
                  className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                    showChromeBar
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-700 bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {showChromeBar ? <Eye size={14} /> : <EyeOff size={14} />}
                    Fake Chrome Browser Frame (Tab + URL)
                  </span>
                  <span>{showChromeBar ? 'VISIBLE' : 'HIDDEN (Full F11 Mode)'}</span>
                </button>
              </div>
            </div>
          )}

          {tab === 'tiktok' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Account Dropdown Name</label>
                  <input
                    type="text"
                    value={tiktokData.accountName}
                    onChange={e => updateTikTokField('accountName', e.target.value)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Currency Code</label>
                  <input
                    type="text"
                    value={tiktokData.currency}
                    onChange={e => updateTikTokField('currency', e.target.value)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Available Balance</label>
                  <input
                    type="number"
                    value={tiktokData.availableBalance}
                    onChange={e => updateTikTokField('availableBalance', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Today's Spend</label>
                  <input
                    type="number"
                    value={tiktokData.todaySpend}
                    onChange={e => updateTikTokField('todaySpend', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Date Range String</label>
                <input
                  type="text"
                  value={tiktokData.dateRange}
                  onChange={e => updateTikTokField('dateRange', e.target.value)}
                  className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Total Spend</label>
                  <input
                    type="number"
                    value={tiktokData.spend}
                    onChange={e => updateTikTokField('spend', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Spend Change % (e.g. -32)</label>
                  <input
                    type="number"
                    value={tiktokData.spendChangePct}
                    onChange={e => updateTikTokField('spendChangePct', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Impressions</label>
                  <input
                    type="number"
                    value={tiktokData.impressions}
                    onChange={e => updateTikTokField('impressions', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Total Conversions</label>
                  <input
                    type="number"
                    value={tiktokData.conversions}
                    onChange={e => updateTikTokField('conversions', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Ad Groups Manager */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Campaigns / Ad Groups Rows</span>
                  <button
                    type="button"
                    onClick={handleAddAdGroup}
                    className="flex items-center gap-1 text-[11px] text-[#00C9A7] hover:underline"
                  >
                    <Plus size={12} /> Add Row
                  </button>
                </div>

                <div className="space-y-3">
                  {tiktokData.adGroups.map((ag, idx) => (
                    <div key={ag.id} className="p-2.5 rounded-lg border border-white/10 bg-[#161920] space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={ag.name}
                          onChange={e => handleUpdateAdGroup(idx, 'name', e.target.value)}
                          className="flex-1 bg-[#1A1D24] border border-white/10 rounded px-2 py-1 text-white font-semibold text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteAdGroup(idx)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete row"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <label className="text-slate-400 block text-[10px]">Budget</label>
                          <input
                            type="text"
                            value={ag.budget}
                            onChange={e => handleUpdateAdGroup(idx, 'budget', e.target.value)}
                            className="w-full bg-[#1A1D24] border border-white/10 rounded px-1.5 py-1 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block text-[10px]">Spend ({tiktokData.currency})</label>
                          <input
                            type="number"
                            value={ag.amountSpent}
                            onChange={e => handleUpdateAdGroup(idx, 'amountSpent', parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#1A1D24] border border-white/10 rounded px-1.5 py-1 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block text-[10px]">Conversions</label>
                          <input
                            type="number"
                            value={ag.conversions}
                            onChange={e => handleUpdateAdGroup(idx, 'conversions', parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#1A1D24] border border-white/10 rounded px-1.5 py-1 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <label className="text-slate-400 block text-[10px]">Status</label>
                          <select
                            value={ag.status}
                            onChange={e => handleUpdateAdGroup(idx, 'status', e.target.value)}
                            className="w-full bg-[#1A1D24] border border-white/10 rounded px-1.5 py-1 text-white text-[11px]"
                          >
                            <option value="Active">Active</option>
                            <option value="Paused">Paused</option>
                            <option value="In Review">In Review</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-400 block text-[10px]">Toggle Switch</label>
                          <select
                            value={ag.on ? '1' : '0'}
                            onChange={e => handleUpdateAdGroup(idx, 'on', e.target.value === '1')}
                            className="w-full bg-[#1A1D24] border border-white/10 rounded px-1.5 py-1 text-white text-[11px]"
                          >
                            <option value="1">ON (Green)</option>
                            <option value="0">OFF (Gray)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-400 block text-[10px]">ROAS</label>
                          <input
                            type="number"
                            step="0.01"
                            value={ag.roas}
                            onChange={e => handleUpdateAdGroup(idx, 'roas', parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#1A1D24] border border-white/10 rounded px-1.5 py-1 text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'shopify' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Store Name</label>
                  <input
                    type="text"
                    value={shopifyData.storeName}
                    onChange={e => updateShopifyField('storeName', e.target.value)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Date Range</label>
                  <input
                    type="text"
                    value={shopifyData.dateRange}
                    onChange={e => updateShopifyField('dateRange', e.target.value)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Total Sales ({shopifyData.currency})</label>
                  <input
                    type="number"
                    value={shopifyData.totalSales}
                    onChange={e => updateShopifyField('totalSales', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Sales Growth % (e.g. +38%)</label>
                  <input
                    type="number"
                    value={shopifyData.totalSalesChangePct}
                    onChange={e => updateShopifyField('totalSalesChangePct', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Total Orders</label>
                  <input
                    type="number"
                    value={shopifyData.orders}
                    onChange={e => updateShopifyField('orders', parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Sessions</label>
                  <input
                    type="number"
                    value={shopifyData.sessions}
                    onChange={e => updateShopifyField('sessions', parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Conversion %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shopifyData.conversionRate}
                    onChange={e => updateShopifyField('conversionRate', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Live Visitors Min</label>
                  <input
                    type="number"
                    value={shopifyData.liveVisitorsMin}
                    onChange={e => updateShopifyField('liveVisitorsMin', parseInt(e.target.value) || 10)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Live Visitors Max</label>
                  <input
                    type="number"
                    value={shopifyData.liveVisitorsMax}
                    onChange={e => updateShopifyField('liveVisitorsMax', parseInt(e.target.value) || 25)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 bg-[#171A21] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            Close Drawer
          </button>

          <button
            type="button"
            onClick={handleSaveToLocalStorage}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            {savedToast ? (
              <>
                <Check size={14} /> Saved & Applied!
              </>
            ) : (
              <>
                <Save size={14} /> Save & Apply
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
