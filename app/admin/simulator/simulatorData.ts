export interface TikTokAdGroup {
  id: string;
  name: string;
  on: boolean;
  status: 'Active' | 'Paused' | 'In Review' | 'Not delivering';
  adGroupId: string;
  budget: string;
  amountSpent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpa: number;
  roas: number;
}

export interface TikTokData {
  accountName: string;
  currency: string;
  dateRange: string;
  availableBalance: number;
  todaySpend: number;
  activeAdGroupsCount: number;
  partiallyDeliveringCount: number;
  notDeliveringCount: number;
  // Performance card summary
  spend: number;
  spendChangePct: number;
  impressions: number;
  impressionsChangePct: number;
  ctr: number;
  ctrChangePct: number;
  conversions: number;
  conversionsChangePct: number;
  // Audience
  audienceAndroidPct: number;
  audienceIosPct: number;
  // Ad Groups list
  adGroups: TikTokAdGroup[];
}

export interface ShopifyProduct {
  id: string;
  name: string;
  image: string;
  unitsSold: number;
  revenue: number;
}

export interface ShopifyData {
  storeName: string;
  currency: string;
  dateRange: string;
  totalSales: number;
  totalSalesChangePct: number;
  sessions: number;
  sessionsChangePct: number;
  orders: number;
  ordersChangePct: number;
  conversionRate: number;
  conversionRateChangePct: number;
  aov: number;
  returningCustomerRate: number;
  liveVisitorsMin: number;
  liveVisitorsMax: number;
  addedToCartPct: number;
  reachedCheckoutPct: number;
  topProducts: ShopifyProduct[];
  referrerTikTokPct: number;
  referrerMetaPct: number;
  referrerDirectPct: number;
}

export const defaultTikTokData: TikTokData = {
  accountName: 'add acc 2 uae',
  currency: 'PKR',
  dateRange: 'Oct 11, 2026 – Oct 18, 2026',
  availableBalance: 1733.25,
  todaySpend: 2.57,
  activeAdGroupsCount: 1,
  partiallyDeliveringCount: 0,
  notDeliveringCount: 0,
  spend: 4328.98,
  spendChangePct: -32,
  impressions: 30854,
  impressionsChangePct: -14,
  ctr: 1.57,
  ctrChangePct: 1,
  conversions: 24,
  conversionsChangePct: 9,
  audienceAndroidPct: 95,
  audienceIosPct: 5,
  adGroups: [
    {
      id: '1',
      name: 'Morning Winner',
      on: true,
      status: 'Paused',
      adGroupId: '1878102392463521',
      budget: '1,050.00 PKR Daily',
      amountSpent: 2450.50,
      impressions: 18450,
      clicks: 342,
      ctr: 1.85,
      conversions: 16,
      cpa: 153.15,
      roas: 4.85
    },
    {
      id: '2',
      name: 'Copy 1 of Ad group 20260917050839',
      on: false,
      status: 'Paused',
      adGroupId: '1876847745934449',
      budget: '-',
      amountSpent: 980.20,
      impressions: 6200,
      clicks: 98,
      ctr: 1.58,
      conversions: 5,
      cpa: 196.04,
      roas: 3.65
    },
    {
      id: '3',
      name: 'Ad group 20260917050839',
      on: false,
      status: 'Paused',
      adGroupId: '1876580785305730',
      budget: '1,050.00 PKR',
      amountSpent: 898.28,
      impressions: 6204,
      clicks: 86,
      ctr: 1.39,
      conversions: 3,
      cpa: 299.42,
      roas: 2.80
    }
  ]
};

export const defaultShopifyData: ShopifyData = {
  storeName: 'Sami Official Store',
  currency: 'PKR',
  dateRange: 'Oct 11, 2026 – Oct 18, 2026',
  totalSales: 4892450,
  totalSalesChangePct: 38,
  sessions: 42850,
  sessionsChangePct: 24,
  orders: 1684,
  ordersChangePct: 35,
  conversionRate: 3.93,
  conversionRateChangePct: 0.6,
  aov: 2905,
  returningCustomerRate: 21.4,
  liveVisitorsMin: 14,
  liveVisitorsMax: 22,
  addedToCartPct: 8.6,
  reachedCheckoutPct: 5.4,
  referrerTikTokPct: 72,
  referrerMetaPct: 21,
  referrerDirectPct: 7,
  topProducts: [
    {
      id: 'p1',
      name: 'Magnetic Wireless PowerBank 10,000mAh Fast Charge',
      image: 'https://images.unsplash.com/photo-1609592426867-b50259b32bc6?w=120&auto=format&fit=crop&q=60',
      unitsSold: 742,
      revenue: 2151800
    },
    {
      id: 'p2',
      name: 'Portable 6-Blade Blender Pro USB Rechargeable',
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=120&auto=format&fit=crop&q=60',
      unitsSold: 512,
      revenue: 1484800
    },
    {
      id: 'p3',
      name: 'Salon Ceramic Negative Ion Hair Styler & Dryer',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=60',
      unitsSold: 430,
      revenue: 1255850
    }
  ]
};
