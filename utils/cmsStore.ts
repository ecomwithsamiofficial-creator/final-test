// Central CMS Data Store & Schema Definitions

export interface CmsContentSchema {
  marquee: {
    is_active: boolean;
    items: string[];
  };
  hero: {
    badge: string;
    title_line1: string;
    title_highlight: string;
    subtitle: string;
    video_url: string;
    video_title: string;
    original_price: string;
    current_price: string;
    seats_left: number;
    cta_text: string;
    top_pill_badge?: string;
    program_badge?: string;
    video_header?: string;
    video_badge?: string;
    video_thumbnail?: string;
    trusted_text?: string;
  };
  stats: {
    training_hours: string;
    lectures_count: string;
    access_type: string;
    mentorship_type: string;
  };
  mentor: {
    name: string;
    title: string;
    image: string;
    tag: string;
    badge: string;
    bio: string;
    benefits: string[];
    stat1_value: string;
    stat1_label: string;
    stat2_value: string;
    stat2_label: string;
    stat3_value: string;
    stat3_label: string;
    quote?: string;
    story?: string;
    students_count?: string;
    primary_markets?: string;
    access_badge?: string;
  };
  bonuses: {
    tag: string;
    title: string;
    highlight_value: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
      value: string;
    }[];
  };
  why_dropshipping: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
  what_you_get: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
  who_is_this_for: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      highlight?: string;
      desc: string;
    }[];
  };
  video_reviews: {
    enabled?: boolean;
    badge: string;
    title: string;
    subtitle: string;
    items: {
      headline: string;
      author: string;
      result: string;
      market: string;
      videoUrl: string;
      stars: number;
    }[];
  };
  options_comparison: {
    badge?: string;
    title?: string;
    subtitle?: string;
    diy_badge?: string;
    diy_title: string;
    diy_subtitle?: string;
    diy_points: string[];
    sami_badge?: string;
    sami_title: string;
    sami_subtitle?: string;
    sami_points: string[];
  };
  cost_of_waiting: {
    badge?: string;
    title: string;
    subtitle: string;
    banner_text?: string;
    cards: {
      label: string;
      title: string;
      desc: string;
    }[];
  };
  final_cta: {
    badge: string;
    title: string;
    title_highlight: string;
    subtitle: string;
    cta_text: string;
    guarantee_text: string;
  };
  footer: {
    disclaimer: string;
    copyright: string;
  };
  faqs: {
    q: string;
    a: string;
  }[];
  testimonials: {
    name: string;
    city: string;
    sales: string;
    orders: string;
    quote: string;
    market: string;
    initials: string;
  }[];
  payment_methods: {
    id: string;
    name: string;
    accountTitle: string;
    accountNumber: string;
    badge: string;
    iban?: string;
  }[];
  contact: {
    phone: string;
    email: string;
    location?: string;
    headOffice?: string;
    regionalOffice?: string;
    whatsappGreeting: string;
  };
  pixels: {
    meta_pixel_id: string;
    tiktok_pixel_id: string;
    ga4_measurement_id: string;
    snapchat_pixel_id: string;
    custom_head_code: string;
  };
  theme?: {
    active_preset?: string;
    active_theme?: string; // backward compatibility
    custom_colors?: ThemeCustomColors;
  };
  screenshot_reviews?: {
    badge: string;
    title: string;
    subtitle: string;
    images: string[];
  };
  homepage_proof_wall?: {
    badge: string;
    title: string;
    subtitle: string;
    images: string[];
  };
  success_page?: {
    badge: string;
    title_line1: string;
    title_highlight: string;
    subtitle: string;
    stat1_value: string;
    stat1_label: string;
    stat2_value: string;
    stat2_label: string;
    stat3_value: string;
    stat3_label: string;
    stat4_value: string;
    stat4_label: string;
    section_badge: string;
    section_title: string;
    section_subtitle: string;
  };
  checkout_page?: {
    badge: string;
    title: string;
    subtitle: string;
    timer_heading: string;
    timer_hours: number;
    timer_minutes: number;
    timer_seconds: number;
    timer_anchor_time?: number;
    seats_left_text: string;
    seats_filled_percent: number;
    trust_badge1: string;
    trust_badge2: string;
    trust_badge3: string;
  };
  about_page?: {
    tag: string;
    hero_title: string;
    hero_subtitle: string;
    story_tag: string;
    story_quote: string;
    story_text: string;
    benefits: string[];
    why_learn_title: string;
    why_learn_subtitle: string;
    why_learn_cards: {
      id?: string;
      title: string;
      desc: string;
      icon?: string;
    }[];
  };
  refund_policy?: {
    guarantee_days: number;
    badge: string;
    hero_title: string;
    hero_subtitle: string;
    effective_date: string;
    not_marketplaces_title: string;
    not_marketplaces_badge: string;
    not_marketplaces_text: string;
    mistake_enrollment_warning: string;
    sami_roadmap_title: string;
    sami_roadmap_text: string;
    no_refund_title: string;
    no_refund_points: string[];
    criteria_title: string;
    criteria_course_completion: string;
    drm_tracker_notice: string;
    criteria_products_hunting: string;
    criteria_proof_text: string;
    criteria_proof_points: string[];
    criteria_zero_sales: string;
    criteria_timely_request: string;
    claim_steps_title: string;
    claim_steps: { step: number; title: string; desc: string }[];
    audit_time: string;
    payout_time: string;
    deactivation_notice: string;
  };
  homepage_curriculum?: {
    tag?: string;
    title?: string;
    subtitle?: string;
    modules: {
      id: string;
      title: string;
      lessons: string[];
    }[];
  };
  why_different?: {
    is_active: boolean;
    title: string;
    subtitle: string;
    cards: {
      number: string;
      title: string;
      desc: string;
    }[];
  };
  signature_framework?: {
    is_active: boolean;
    badge?: string;
    eyebrow?: string;
    title: string;
    subtitle?: string;
    description: string;
    highlight_tag?: string;
    cta_text?: string;
    step1_title?: string;
    step1_desc?: string;
    step2_title?: string;
    step2_desc?: string;
    step3_title?: string;
    step3_desc?: string;
    order_booster_title?: string;
    order_booster_desc?: string;
  };
}

export interface ThemeCustomColors {
  primary: string;
  primary_hover: string;
  secondary: string;
  dark_card: string;
  dark_bg: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  tag: string;
  colors: ThemeCustomColors;
}

export const DEFAULT_THEME_COLORS: ThemeCustomColors = {
  primary: '#00A0DF',
  primary_hover: '#008AC2',
  secondary: '#0074A6',
  dark_card: '#111827',
  dark_bg: '#0B0F19'
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default Tech Cyan',
    tag: 'Signature Brand',
    colors: {
      primary: '#00A0DF',
      primary_hover: '#008AC2',
      secondary: '#0074A6',
      dark_card: '#111827',
      dark_bg: '#0B0F19'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Royal Sunset Orange',
    tag: 'High-Conversion Ecom',
    colors: {
      primary: '#FF6B00',
      primary_hover: '#E05E00',
      secondary: '#FFA043',
      dark_card: '#121318',
      dark_bg: '#08090C'
    }
  },
  {
    id: 'emerald-luxury',
    name: 'Dubai Emerald & Gold',
    tag: 'GCC Wealth & Prestige',
    colors: {
      primary: '#10B981',
      primary_hover: '#059669',
      secondary: '#F59E0B',
      dark_card: '#0C1A14',
      dark_bg: '#06120E'
    }
  },
  {
    id: 'cyber-violet',
    name: 'Neon Cyber Violet',
    tag: 'Cyberpunk Purple',
    colors: {
      primary: '#8B5CF6',
      primary_hover: '#7C3AED',
      secondary: '#EC4899',
      dark_card: '#140E26',
      dark_bg: '#0B0716'
    }
  },
  {
    id: 'crimson-ruby',
    name: 'Crimson Ruby & Black',
    tag: 'Bold Luxury Red',
    colors: {
      primary: '#EF4444',
      primary_hover: '#DC2626',
      secondary: '#F87171',
      dark_card: '#180C0E',
      dark_bg: '#0F0608'
    }
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold & Charcoal',
    tag: 'VIP Elite Gold',
    colors: {
      primary: '#EAB308',
      primary_hover: '#CA8A04',
      secondary: '#F59E0B',
      dark_card: '#16140D',
      dark_bg: '#0D0C07'
    }
  }
];

export function generateThemeCss(colors?: Partial<ThemeCustomColors>): string {
  const c = { ...DEFAULT_THEME_COLORS, ...(colors || {}) };

  const hexToRgb = (hex: string) => {
    if (!hex || typeof hex !== 'string') return '0, 160, 223';
    const clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
      const r = parseInt(clean[0] + clean[0], 16);
      const g = parseInt(clean[1] + clean[1], 16);
      const b = parseInt(clean[2] + clean[2], 16);
      return `${r}, ${g}, ${b}`;
    }
    if (clean.length >= 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return isNaN(r) ? '0, 160, 223' : `${r}, ${g}, ${b}`;
    }
    return '0, 160, 223';
  };

  const primaryRgb = hexToRgb(c.primary);
  const secRgb = hexToRgb(c.secondary || c.primary_hover);

  return `
    :root, [data-theme] {
      --primary: ${c.primary} !important;
      --primary-hover: ${c.primary_hover} !important;
      --primary-dark: ${c.primary_hover} !important;
      --primary-glow: rgba(${primaryRgb}, 0.45) !important;
      --primary-rgb: ${primaryRgb} !important;
      --theme-accent: ${c.primary} !important;
      --theme-secondary: ${c.secondary} !important;
      --dark-bg: ${c.dark_bg} !important;
      --dark-card: ${c.dark_card} !important;
    }
    .text-\\[\\#00A0DF\\], .text-\\[\\#00a0df\\] { color: var(--primary) !important; }
    .bg-\\[\\#00A0DF\\], .bg-\\[\\#00a0df\\] { background-color: var(--primary) !important; }
    .border-\\[\\#00A0DF\\], .border-\\[\\#00a0df\\] { border-color: var(--primary) !important; }
    .hover\\:bg-\\[\\#008ac2\\]:hover, .hover\\:bg-\\[\\#008ec7\\]:hover, .hover\\:bg-\\[\\#008bc2\\]:hover { background-color: var(--primary-hover) !important; }
    .hover\\:text-\\[\\#00A0DF\\]:hover, .hover\\:text-\\[\\#00a0df\\]:hover { color: var(--primary) !important; }
    .hover\\:border-\\[\\#00A0DF\\]:hover, .hover\\:border-\\[\\#00a0df\\]:hover { border-color: var(--primary) !important; }
    .fill-\\[\\#00A0DF\\], .fill-\\[\\#00a0df\\] { fill: var(--primary) !important; }
    [class*="bg-\\[\\#00A0DF\\]\\/"], [class*="bg-\\[\\#00a0df\\]\\/"] { background-color: rgba(${primaryRgb}, 0.15) !important; }
    [class*="border-\\[\\#00A0DF\\]\\/"], [class*="border-\\[\\#00a0df\\]\\/"] { border-color: rgba(${primaryRgb}, 0.3) !important; }
    [class*="text-\\[\\#00A0DF\\]\\/"], [class*="text-\\[\\#00a0df\\]\\/"] { color: rgba(${primaryRgb}, 0.85) !important; }
    [class*="shadow-\\[\\#00A0DF\\]"], [class*="shadow-\\[\\#00a0df\\]"] { --tw-shadow-color: rgba(${primaryRgb}, 0.35) !important; }
    [class*="from-\\[\\#00A0DF\\]"], [class*="from-\\[\\#00a0df\\]"] { --tw-gradient-from: ${c.primary} var(--tw-gradient-from-position) !important; }
    [class*="to-\\[\\#00A0DF\\]"], [class*="to-\\[\\#00a0df\\]"] { --tw-gradient-to: ${c.secondary || c.primary_hover} var(--tw-gradient-to-position) !important; }
    ::selection { background-color: ${c.primary} !important; color: #FFFFFF !important; }
  `;
}

export const defaultCmsContent: CmsContentSchema = {
  marquee: {
    is_active: true,
    items: [
      '🔥 RAMADAN SPECIAL 88% DISCOUNT &bull; PKR 3,799 ONLY FOR LIFETIME ACCESS',
      '⚡ 1,200+ SUCCESSFUL STUDENTS TRAINED ACROSS PAKISTAN, UAE & SAUDI ARABIA',
      '🚀 2026 UPDATED GCC SCALING BLUEPRINT WITH DIRECT DUBAI SUPPLIERS',
      '💬 DIRECT 1-ON-1 WHATSAPP MENTORSHIP WITH MENTOR SAMI INCLUDED'
    ]
  },
  hero: {
    badge: '',
    top_pill_badge: 'Pakistan’s Premier E-commerce Mentorship',
    title_line1: 'Learn Local Dropshipping and Build Your Own Brand ',
    title_highlight: 'And Grow Your Business From Pakistan',
    subtitle: '',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    video_title: '',
    program_badge: 'Ecominion Program ',
    video_header: 'Watch this 128 seconds of video to learn how easy it is',
    video_badge: 'Watch 128s Video',
    video_thumbnail: '',
    trusted_text: 'Trusted by 350+ Students',
    original_price: 'PKR 14,999',
    current_price: 'PKR 3,799',
    seats_left: 12,
    cta_text: 'YES! I WANT TO LEARN THIS'
  },
  stats: {
    training_hours: '15+ Hours',
    lectures_count: '36 Lectures',
    access_type: 'Lifetime Access',
    mentorship_type: 'Direct WhatsApp Support'
  },
  mentor: {
    name: 'Sardar Samiullah',
    title: 'Founder & E-Commerce Agency Director',
    image: '/mentor-profile.png',
    tag: 'YOUR MENTOR',
    badge: 'E-Commerce Agency Director',
    bio: 'Founder of Ecom With Sami. Active e-commerce business operator and agency director with over 1,200+ students mentored.',
    benefits: [
      'Lifetime WhatsApp support',
      'Private Facebook community',
      'Private WhatsApp community',
      'Smooth, guided journey'
    ],
    stat1_value: '1,200+',
    stat1_label: 'Students mentored',
    stat2_value: 'Abbottabad / Global',
    stat2_label: 'Agency Base',
    stat3_value: 'Lifetime',
    stat3_label: 'Access & support',
    quote: 'Start with Low-Risk Dropshipping, Master White Label, and Build Long-Term Private Label Equity.',
    story: 'When I started in e-commerce, the real turning point was realizing that dropshipping is just the testing ground — the real long-term wealth is built by converting winning products into white label and scaling sustainable private label brands.\n\nFrom Abbottabad, Pakistan, I built a dedicated e-commerce agency with a professional team managing media buying, supply chains, and store conversions. I designed this mentorship specifically so beginners can start with low risk, validate winners with dropshipping, transition to custom white label packaging, and eventually scale into private label brands across Pakistan, UAE, Saudi Arabia, and global markets.\n\nOur mission is straightforward: provide real-world screen walkthroughs, tested ad blueprints, verified supplier contacts, and direct 1-on-1 mentorship whenever you get stuck.',
    students_count: '1,200+',
    primary_markets: 'Pakistan, UAE & Saudi Arabia (KSA)',
    access_badge: 'Verified Mentor & Coach'
  },
  bonuses: {
    tag: 'EXCLUSIVE POWER BONUSES',
    title: 'Get 6 Game-Changing Bonuses Worth Over',
    highlight_value: 'Rs 30,000 Free',
    subtitle: 'When you enroll today for PKR 3,799, you get all software tools, supplier contacts, and ad blueprints completely free of charge.',
    items: [
      {
        title: 'Verified UAE & Saudi Arabia Suppliers Directory',
        desc: 'Direct WhatsApp contacts of trusted wholesale suppliers in Dubai (Deira), Sharjah, and Riyadh with 24-48 hours COD delivery.',
        value: 'Rs 10,000 Value'
      },
      {
        title: 'High-Converting Premium Shopify Theme (ZIP)',
        desc: 'The exact custom-coded, ultra-fast converting theme used on our 7-figure stores. Clean, mobile-first design with 1-click upsells.',
        value: 'Rs 8,500 Value'
      },
      {
        title: 'Ready-to-Use Facebook & TikTok Ads Blueprint',
        desc: 'Pre-written ad copy templates, campaign testing structures, targeting setups, and hook scripts in Arabic & English.',
        value: 'Rs 5,000 Value'
      },
      {
        title: 'E-Commerce P&L Margin & Profit Calculator (Excel)',
        desc: 'Track advertising spend, product cost, shipping courier fees, COD delivery rates, and net profit margins automatically.',
        value: 'Rs 3,000 Value'
      },
      {
        title: 'Winning Product Hunt Checklist & Spy Prompts',
        desc: '15-point criteria checklist to discover untapped winning products with high profit margins before your competitors do.',
        value: 'Rs 2,500 Value'
      },
      {
        title: 'Direct WhatsApp Mentorship Desk Access',
        desc: 'Private direct WhatsApp assistance for account verification, ad troubleshooting, pixel errors, and scaling questions.',
        value: 'Priceless'
      }
    ]
  },
  why_dropshipping: {
    badge: 'WHY UAE & KSA MARKETS',
    title: 'Why GCC Dropshipping is the #1 Opportunity in 2026',
    subtitle: 'Unlike saturated western markets or low-margin local markets, UAE and Saudi Arabia offer high purchasing power and low ad costs.',
    items: [
      {
        title: 'High Purchasing Power (Dirhams & Riyals)',
        desc: 'Customers in Dubai and Riyadh spend heavily online. Average order value (AOV) is 3x to 5x higher than local Pakistani stores.'
      },
      {
        title: 'Cheap TikTok & Facebook Ad Costs (High ROAS)',
        desc: 'Ad impressions and clicks cost significantly less compared to USA/UK, allowing high 4x-10x Return On Ad Spend.'
      },
      {
        title: 'No Need to Buy Inventory Upfront (Zero Stock Risk)',
        desc: 'Local wholesale warehouses in UAE fulfill orders directly via Cash-on-Delivery (COD). You only pay after the customer pays!'
      },
      {
        title: 'Operate 100% from Pakistan with Laptop & Internet',
        desc: 'You manage store setup, marketing, and customer support remotely from home while couriers handle local delivery in UAE/KSA.'
      }
    ]
  },
  what_you_get: {
    badge: 'WHAT YOU GET',
    title: 'WHAT YOU’LL MASTER INSIDE ECOMINION',
    subtitle: 'Not just videos. You’ll learn the systems behind building, testing and scaling an e-commerce business.',
    items: [
      {
        title: 'WINNING PRODUCT RESEARCH',
        desc: 'Learn how to identify, validate and test products before putting your budget behind them.'
      },
      {
        title: 'STORE DESIGN & CRO',
        desc: 'Build a Shopify store designed to earn trust, improve conversions and turn visitors into customers.'
      },
      {
        title: 'META & TIKTOK ADS',
        desc: 'Learn campaign setup, creative testing, pixel, tracking and scaling across the two major paid platforms.'
      },
      {
        title: 'PIXEL, DATA & SCALING',
        desc: 'Understand the data behind your campaigns, make better decisions and learn how to scale what works.'
      }
    ]
  },
  why_different: {
    is_active: true,
    title: 'WHY ECOMINION IS DIFFERENT',
    subtitle: 'Because we’re not teaching you to copy a product. We’re teaching you to understand the business behind it.',
    cards: [
      {
        number: '01',
        title: 'PRACTICAL FROM DAY ONE',
        desc: 'No unnecessary theory. Learn through actual e-commerce workflows, decisions and practical execution.'
      },
      {
        number: '02',
        title: 'PAKISTAN-FIRST',
        desc: 'Understand the local market, local selling environment and fundamentals before trying to expand internationally.'
      },
      {
        number: '03',
        title: 'SYSTEMS, NOT SHORTCUTS',
        desc: 'Product research, CRO, pixel, ads, testing, data and scaling — learn how the pieces work together.'
      },
      {
        number: '04',
        title: 'BEYOND THE FIRST SALE',
        desc: 'The goal isn’t simply to get one order. Learn what happens after the first sale and how to build a repeatable system.'
      }
    ]
  },
  signature_framework: {
    is_active: true,
    badge: 'SIGNATURE FRAMEWORK',
    eyebrow: 'SIGNATURE FRAMEWORK',
    title: 'THE 3-SHIFT SCALING FORMULA™',
    subtitle: '(That Is Also Called The Order Booster System)',
    description: 'My proprietary 24-hour marketing & campaign shift strategy designed to maximize ad efficiency, boost confirmed daily orders, and scale profitability systematically.',
    highlight_tag: 'PROPRIETARY 24-HOUR MARKETING STRATEGY',
    cta_text: 'ENROLL NOW & GET THE 3S SYSTEM →'
  },
  who_is_this_for: {
    badge: 'PERFECT FOR YOU IF…',
    title: 'Who Is This For?',
    subtitle: 'No matter where you’re starting from, this program meets you there.',
    items: [
      {
        title: 'If You’re a Complete',
        highlight: 'Beginner',
        desc: 'No idea how to start? I’ll guide you step by step. By the end, you’ll have a fully working Shopify store and a clear roadmap to your first sale.'
      },
      {
        title: 'If You’re',
        highlight: 'Struggling With Ads',
        desc: 'Confused by Facebook or TikTok ads? Learn to create high-converting campaigns, target the right audience, and scale your sales the right way.'
      },
      {
        title: 'If You’re a',
        highlight: 'Business Owner',
        desc: 'Want to add a profitable eCommerce stream? Learn to find winning products, source reliable UAE & KSA suppliers, and automate your store.'
      },
      {
        title: 'Ready to',
        highlight: 'Master Store Management',
        desc: 'Start dropshipping with minimal investment while getting lifetime mentorship and proven strategies to grow your online business skills.'
      },
      {
        title: 'If You’re Already',
        highlight: 'Running a Store',
        desc: 'Struggling to scale or manage campaigns? Learn advanced scaling techniques, automation tools, and ad strategies to reach the next level.'
      },
      {
        title: 'If You’re a',
        highlight: 'Freelancer or Side Hustler',
        desc: 'Add dropshipping to your skillset and earn extra income online. Learn product research, ad mastery, and store management to start fast.'
      }
    ]
  },
  video_reviews: {
    enabled: true,
    badge: 'REAL STUDENT RESULTS',
    title: 'Hear What Our Students Are Saying',
    subtitle: 'Real student video reviews sharing their experience, support, and results after joining Ecom With Sami.',
    items: [
      {
        stars: 5,
        headline: '“Total beginners are now getting AED 1,000–1,500 in daily sales.”',
        author: 'Ali Raza — Lahore',
        result: 'AED 1,500 / Day',
        market: 'UAE Market',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“After getting mentorship and watching the course, I made €662 in sales within 6 days.”',
        author: 'Raza Ali — Karachi',
        result: '€662 in 6 Days',
        market: 'GCC & Global',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“AED 5,000 in sales and 56 orders within 5 days with supplier help.”',
        author: 'Hamza Tariq — Islamabad',
        result: 'AED 5,000 / Week',
        market: 'UAE Dropship',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“Students say the course is very easy to understand and follow on mobile.”',
        author: 'Zainab Bibi — Faisalabad',
        result: 'PKR 480,000 / Mo',
        market: 'Saudi & UAE',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“26 orders and AED 2,500 in sales with the direct help of Mentor Sami.”',
        author: 'Usman Ghani — Rawalpindi',
        result: 'AED 2,500 Sales',
        market: 'UAE Market',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“AED 1,485 in sales in just 3 days while working from home.”',
        author: 'Bilal Farooq — Multan',
        result: 'SAR 3,485 Profit',
        market: 'Saudi Market',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“I tried many courses before, but Sami’s practical GCC supplier list made all the difference.”',
        author: 'Farhan Sheikh — Peshawar',
        result: 'SAR 6,100 / 10 Days',
        market: 'KSA Market',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  options_comparison: {
    badge: 'YOUR CHOICE',
    title: 'Now You Have 2 Options Left',
    subtitle: 'One keeps you stuck. The other moves you forward.',
    diy_badge: 'OPTION 01',
    diy_title: 'Do It Yourself',
    diy_subtitle: 'The slow, frustrating road',
    diy_points: [
      'Keep guessing what works and what doesn’t',
      'Watch others grow while you’re still “figuring it out”',
      'Waste months testing random tips',
      'Lose motivation before you see any results'
    ],
    sami_badge: 'OPTION 02',
    sami_title: 'Join the Ecommestry Program',
    sami_subtitle: 'The proven, guided shortcut',
    sami_points: [
      'Learn what truly drives profitable stores — step by step',
      'Follow a tested system instead of guesswork',
      'Get structured guidance that reduces costly mistakes',
      'Lifetime support to guide you the whole journey'
    ]
  },
  cost_of_waiting: {
    badge: '⏳ BEFORE YOU CLOSE THIS PAGE',
    title: 'What Does Waiting Really Cost You?',
    subtitle: 'The price isn\'t just the course fee. It\'s everything that stays exactly the same if nothing changes today.',
    banner_text: '🎯 This isn\'t just a course decision. It\'s a decision about where you\'ll be 6 months from now.',
    cards: [
      {
        label: '3 MONTHS FROM NOW',
        title: 'Still Stuck at "Someday"',
        desc: 'You\'re still watching free videos, still saving posts, still telling yourself you\'ll start next month. Same questions, zero progress.'
      },
      {
        label: '1 YEAR FROM NOW',
        title: 'Watching Others Move Ahead',
        desc: 'People who started today will already have a live store and real experience. You\'ll be watching their wins thinking "I could have done that too."'
      },
      {
        label: 'EXPENSIVE GUESSING',
        title: 'Money Lost to Trial & Error',
        desc: 'Most beginners burn a big chunk of ad budget testing blindly — with little to show for it. A proven system saves you from paying that "tuition".'
      },
      {
        label: 'RISING COMPETITION',
        title: 'Late Entry = Harder Game',
        desc: 'E-commerce grows every year. The longer you wait, the more crowded the market gets — and the harder it is to stand out as a beginner.'
      },
      {
        label: 'WASTED MONTHS',
        title: 'The Slow, Lonely Route',
        desc: 'Figuring it all out alone can take 6–12 months of confusion. With a clear step-by-step roadmap, you skip the guesswork and move with confidence.'
      },
      {
        label: 'THE REAL MATH',
        title: 'Course Fee vs. The Cost',
        desc: 'The course costs less than what most beginners waste on a single failed ad test. The real question isn\'t "can I afford it?" — it\'s "can I afford another year of standing still?"'
      }
    ]
  },
  final_cta: {
    badge: 'JOIN 1,200+ STUDENTS',
    title: 'Take the First Step Toward a',
    title_highlight: 'Profitable Dropshipping Business',
    subtitle: 'Thousands of beginners across UAE & KSA markets have already started. Today it\'s your turn.',
    cta_text: 'YES! I WANT TO LEARN THIS',
    guarantee_text: '14-day money-back guarantee • Lifetime access & support'
  },
  footer: {
    disclaimer: 'Results are not guaranteed and will vary based on individual effort, market conditions, and other factors. Every person is different, and your level of success depends on your experience, dedication, and hard work.',
    copyright: 'Ecom With Sami. All rights reserved.'
  },
  faqs: [
    {
      q: 'Do I need any previous technical experience to join?',
      a: 'No prior coding or e-commerce experience is required. The course starts from absolute basics (Shopify store setup from scratch) to advanced scaling.'
    },
    {
      q: 'Can I do this business while living in Pakistan?',
      a: 'Yes, 100%. Over 90% of our students run their UAE and Saudi Arabia stores directly from Pakistan using their laptop or mobile phone.'
    },
    {
      q: 'How much budget is needed after enrolling?',
      a: 'Since you do not need to buy inventory in advance (COD model), you only need around PKR 10,000 to PKR 15,000 for domain and testing ads.'
    },
    {
      q: 'How do I access the LMS classroom after payment?',
      a: 'As soon as you submit the enrollment form with your receipt, your login credentials will be generated and you can log in at /login.'
    },
    {
      q: 'How do I get help if I get stuck?',
      a: 'You receive direct WhatsApp mentorship support where mentor Sami and his senior team assist with ad accounts and store reviews.'
    }
  ],
  testimonials: [
    {
      name: 'Hamza Tariq',
      city: 'Lahore',
      sales: 'AED 8,920 in 14 Days',
      orders: '42 Delivered Orders',
      quote: 'Sami bhai ke verified supplier directory ne meri life badal di. Pehle scam supplier se loss hoa tha, ab daily orders ship ho rahe hain!',
      market: 'UAE Market',
      initials: 'HT'
    },
    {
      name: 'Bilal Ahmad',
      city: 'Karachi',
      sales: 'SAR 12,450 in 3 Weeks',
      orders: '68 Orders',
      quote: 'TikTok ads strategy jo module 4 mein sikhayi hai wo 100% working hai. 5.8 ROAS mila mujhe pehle hi campaign mein.',
      market: 'Saudi Arabia',
      initials: 'BA'
    },
    {
      name: 'Usman Ghani',
      city: 'Islamabad',
      sales: 'AED 4,850 First Week',
      orders: '24 Orders',
      quote: 'Rs 3,799 mein itna practical aur updated content koi nahi deta Pakistan mein. Highly recommended!',
      market: 'UAE Market',
      initials: 'UG'
    }
  ],
  payment_methods: [
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Instant Transfer'
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Instant Transfer'
    },
    {
      id: 'meezan',
      name: 'Meezan Bank Ltd',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '01010101010101',
      iban: 'PK00MEZN0001010101010101',
      badge: 'Direct Bank Transfer'
    },
    {
      id: 'sadapay',
      name: 'SadaPay',
      accountTitle: 'SHAFAQ IJAZ',
      accountNumber: '03019492803',
      badge: 'Fast & Zero Fees'
    }
  ],
  contact: {
    phone: '0333-0093269',
    email: 'ecomwithsamiofficial@gmail.com',
    location: 'Abbottabad, Khyber Pakhtunkhwa, Pakistan',
    headOffice: 'Abbottabad, Khyber Pakhtunkhwa, Pakistan',
    regionalOffice: '',
    whatsappGreeting: 'Salam Mentor Sami! I want to get complete details about your E-Commerce & Dropshipping Masterclass.'
  },
  pixels: {
    meta_pixel_id: '',
    tiktok_pixel_id: '',
    ga4_measurement_id: '',
    snapchat_pixel_id: '',
    custom_head_code: ''
  },
  theme: {
    active_preset: 'default',
    active_theme: 'default',
    custom_colors: { ...DEFAULT_THEME_COLORS }
  },
  screenshot_reviews: {
    badge: 'REAL STUDENT RESULTS',
    title: 'Join 1,200+ Happy Students',
    subtitle: 'Real, unedited screenshots from our students — results & feedback.',
    images: []
  },
  homepage_proof_wall: {
    badge: 'STUDENT RESULTS',
    title: 'Students Success',
    subtitle: 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.',
    images: []
  },
  success_page: {
    badge: 'VERIFIED STUDENT PROOF',
    title_line1: 'Real Students. Real Stores.',
    title_highlight: 'Real Results.',
    subtitle: 'Explore real earnings screenshots, case studies, and reviews from over 1,200 students who joined the Ecom With Sami mentorship.',
    stat1_value: '1,200+',
    stat1_label: 'Total Students',
    stat2_value: '89%',
    stat2_label: 'First Sale in 14 Days',
    stat3_value: '4.9 / 5.0',
    stat3_label: 'Student Rating',
    stat4_value: 'PKR 3,799',
    stat4_label: 'One-Time Fee',
    section_badge: 'STUDENT PROOF',
    section_title: 'Featured Case Studies & Results',
    section_subtitle: 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.'
  },
  checkout_page: {
    badge: 'OFFICIAL ENROLLMENT • 88% DISCOUNT APPLIED',
    title: 'E-Commerce Brand Mentorship by Sardar Samiullah',
    subtitle: 'Get lifetime access to 9 comprehensive video modules, verified suppliers directory & WhatsApp mentorship.',
    timer_heading: 'Discount Offer Ends In:',
    timer_hours: 2,
    timer_minutes: 27,
    timer_seconds: 38,
    timer_anchor_time: 1773100000000,
    seats_left_text: 'Only 12 seats left at this price',
    seats_filled_percent: 88,
    trust_badge1: 'Lifetime Access',
    trust_badge2: 'Instant LMS Activation',
    trust_badge3: '1,200+ Students'
  },
  homepage_curriculum: {
    tag: 'COMPLETE COURSE CURRICULUM',
    title: 'Everything You Get Inside the Course',
    subtitle: 'From beginner dropshipping to white label and private label scaling, step by step.',
    modules: [
      {
        id: 'mod_1',
        title: 'Module 1: E-Commerce Business Fundamentals & The 4-Stage Scaling Roadmap',
        lessons: [
          '1.1 E-Commerce Overview: Dropshipping, White Label & Private Label Differences',
          '1.2 Mindset, Capital Requirements & Operating Remotely from Pakistan',
          '1.3 Market Selection: Pakistan Domestic vs UAE (AED) vs Saudi Arabia (SAR)'
        ]
      },
      {
        id: 'mod_2',
        title: 'Module 2: High-Converting Shopify Store Architecture',
        lessons: [
          '2.1 Shopify Account Creation & Partner Store Architecture',
          '2.2 Installing the Free High-Converting Custom Theme',
          '2.3 1-Click Fast COD Form & WhatsApp Confirmation Funnel',
          '2.4 Currency Converters & Multi-Language Optimization'
        ]
      },
      {
        id: 'mod_3',
        title: 'Module 3: Winning Product Hunting & Validation Criteria',
        lessons: [
          '3.1 The 15-Point Winning Product Matrix for High Profit Margins',
          '3.2 Spying on Competitors via TikTok Ads Library & Ad Spy Tools',
          '3.3 Product Margin & Break-Even ROAS Calculation Formula'
        ]
      },
      {
        id: 'mod_4',
        title: 'Module 4: Verified Suppliers & Sourcing Framework',
        lessons: [
          '4.1 How to Source Winning Products from Verified Local & Global Suppliers',
          '4.2 Utilizing the Private Verified Suppliers Directory Included in Course',
          '4.3 Handling Stock Availability, Quality Checks & Packaging Standards'
        ]
      },
      {
        id: 'mod_5',
        title: 'Module 5: TikTok Ads Mastery & The 3-Shift Scaling Formula™',
        lessons: [
          '5.1 Creating TikTok Agency Ad Accounts Without Bans',
          '5.2 TikTok Pixel & Events API Setup via Google Tag Manager',
          '5.3 The CBO Testing Framework (The 3-Shift Scaling Formula™ & Order Booster System)',
          '5.4 High-Converting UGC Video Ad Scripts & Hook Formulas'
        ]
      },
      {
        id: 'mod_6',
        title: 'Module 6: Meta (Facebook & Instagram) Ads Scaling Engine',
        lessons: [
          '6.1 Meta Business Manager Verification & Pixel Setup',
          '6.2 Advantage+ Shopping Campaigns vs Manual Broad Targeting',
          '6.3 Retargeting Sequences & Dynamic Product Ads (DPA)',
          '6.4 Scaling Winning Ad Sets to 5-Figure Daily Revenue Safely'
        ]
      },
      {
        id: 'mod_7',
        title: 'Module 7: Courier Logistics, COD Remittance & Return Rate (RTO) Control',
        lessons: [
          '7.1 Courier Onboarding & Setup with Verified Delivery Partners',
          '7.2 Tracking COD Remittances & Withdrawing PKR to Pakistani Banks',
          '7.3 WhatsApp Order Confirmation Flows to Slash Cancellations & RTO'
        ]
      },
      {
        id: 'mod_8',
        title: 'Module 8: Transitioning to White Label, Private Label & International Scaling',
        lessons: [
          '8.1 When and How to Transition from Dropshipping into White Label',
          '8.2 Custom Branded Packaging, Unboxing Experience & Local Warehousing',
          '8.3 Building Brand Equity, Trademark Registration & Enterprise Valuation',
          '8.4 Financial Management, P&L Spreadsheet Mastery & VA Team Hiring',
          '8.5 Expanding Tested Brands into UAE, Saudi Arabia (GCC) & Global Markets'
        ]
      }
    ]
  },
  about_page: {
    tag: 'YOUR MENTOR',
    hero_title: 'Empowering 1,200+ Students to Build Real E-Commerce Brands',
    hero_subtitle: 'From beginner dropshipping to white label and private label scaling. Learn the proven framework from active agency operators.',
    story_tag: 'MY STORY & PHILOSOPHY',
    story_quote: "Start with Low-Risk Dropshipping, Master White Label, and Build Long-Term Private Label Equity.",
    story_text: "When I started in e-commerce, the real turning point was realizing that dropshipping is just the testing ground — the real long-term wealth is built by converting winning products into white label and scaling sustainable private label brands.\n\nFrom Abbottabad, Pakistan, I built a dedicated e-commerce agency with a professional team managing media buying, supply chains, and store conversions. I designed this mentorship specifically so beginners can start with low risk, validate winners with dropshipping, transition to custom white label packaging, and eventually scale into private label brands across Pakistan, UAE, Saudi Arabia, and global markets.\n\nOur mission is straightforward: provide real-world screen walkthroughs, tested ad blueprints, verified supplier contacts, and direct 1-on-1 mentorship whenever you get stuck.",
    benefits: [
      'Dropshipping to Private Label Scaling Formula',
      '100% Practical Screen Walkthroughs',
      'Verified Local & International Suppliers Lists',
      'Lifetime WhatsApp Mentorship (9AM-5PM)',
      'Weekly Live Campaign & Pixel Audits'
    ],
    why_learn_title: 'Why Learn With Ecom With Sami?',
    why_learn_subtitle: 'Here is what sets our training apart from generic online courses.',
    why_learn_cards: [
      {
        id: 'card_1',
        title: 'Zero Fluff, 100% Practical',
        desc: 'Every lecture is recorded with live store setups, real ad accounts, and actual campaigns spending budget.',
        icon: 'award'
      },
      {
        id: 'card_2',
        title: 'Complete 4-Stage Brand Roadmap',
        desc: 'Learn how to start with zero-inventory dropshipping, advance into white label, and build durable private label brands.',
        icon: 'globe'
      },
      {
        id: 'card_3',
        title: 'Dedicated Agency & Student Support',
        desc: 'Direct 1-on-1 access to Sardar Samiullah and our professional agency team for store reviews and ad guidance.',
        icon: 'users'
      }
    ]
  },
  refund_policy: {
    guarantee_days: 10,
    badge: '10-DAY CONDITIONAL MONEY-BACK GUARANTEE',
    hero_title: '10-Day Conditional Refund Policy',
    hero_subtitle: 'Read Carefully Before Enrolling. Action-Based, Transparent, & Zero-Gimmick Policy.',
    effective_date: 'Effective Date: January 1, 2026 • Last Updated: October 2026',
    not_marketplaces_title: 'Strictly Dropshipping to Brand Mentorship (NOT Amazon / eBay / Etsy)',
    not_marketplaces_badge: 'CRITICAL MENTORSHIP CLARIFICATION',
    not_marketplaces_text: 'We are 100% committed to your real practical e-commerce success. This mentorship teaches Shopify Store Architecture, High-Margin Winning Product Hunting, Meta & TikTok Paid Ads Scaling, and Direct Verified Supplier Sourcing.\n\nThis program is STRICTLY a Dropshipping, White Label & Private Label E-Commerce Training. It is NOT an Amazon FBA, eBay, or Etsy marketplace course.',
    mistake_enrollment_warning: 'By enrolling, you confirm that you have reviewed the curriculum and understand the nature of the training. Enrolling by mistake, misunderstanding the course type, or claiming "I assumed this was an Amazon, eBay, or Etsy course" does NOT qualify for a refund under any circumstances.',
    sami_roadmap_title: 'Mentor Sami’s Real Step-by-Step E-Commerce Roadmap',
    sami_roadmap_text: 'Our proven blueprint starts beginners locally in Pakistan with Local Dropshipping on a low testing budget. This guarantees minimum risk, keeps student capital safe, and builds instant practical confidence.\n\nOnce students start seeing positive ROAS and consistent orders, we guide them step by step to transition into White Label custom branding, Private Label enterprise equity, and scaling into GCC (UAE AED & Saudi Arabia SAR) and international global markets. This takes a beginner from scratch to a professional multi-market brand owner.',
    no_refund_title: 'No Instant or No-Action Refunds (Strictly Enforced)',
    no_refund_points: [
      'You enroll and request a refund without watching the full course curriculum.',
      'You enroll and do not implement the practical store setup and ad strategies taught.',
      'You claim "I thought this was an Amazon, eBay, or Etsy course".',
      'You claim "I enrolled by mistake" or "my family member paid by accident".',
      'You request a refund immediately after receiving login credentials.',
      'You change your mind, lack personal time, or claim lack of interest.'
    ],
    criteria_title: '10-Day Refund Eligibility Criteria (ALL Must Be Met)',
    criteria_course_completion: 'You must watch and complete 100% of all video modules, exercises, and assignments within 10 calendar days of enrollment.',
    drm_tracker_notice: '⚠️ AUTOMATED LMS LIVE TRACKER & DRM MONITORING: Our student portal features an active DRM Live Watch Tracker that automatically logs your exact watch duration, playback completion percentage, and lesson progress in our database. False claims of completing the course will be verified directly against system logs.',
    criteria_products_hunting: 'You must research, launch, and test at least 10 to 15 products on your live store using the 15-Point Product Matrix and testing framework taught in the course. Testing only 1 to 3 products does NOT qualify.',
    criteria_proof_text: 'You must provide concrete, verifiable proof of full implementation, including:',
    criteria_proof_points: [
      'Live store links to at least 10–15 published product listings with custom copy and pricing.',
      'Complete store analytics dashboard screenshots covering the full 10-day period.',
      'Meta or TikTok Ads Manager campaign screenshots showing ad spend and testing data.',
      'Completed Product Hunting Excel / Google Sheet checklist following course criteria.'
    ],
    criteria_zero_sales: 'If after 10 full days of active, verified, and consistent implementation you have generated zero sales despite applying all optimization and supplier strategies, you qualify to submit a refund request.',
    criteria_timely_request: 'Your request must be submitted within exactly 10 calendar days from the purchase timestamp. Late requests cannot be considered.',
    claim_steps_title: 'How to Submit a Refund Claim (4 Steps)',
    claim_steps: [
      { step: 1, title: 'Contact Official Support Desk', desc: 'Message our official WhatsApp support number or billing email with the subject: "Refund Request – Ecom With Sami".' },
      { step: 2, title: 'Submit Verification & TRX Details', desc: 'Provide your full registered name, phone number, login email, and Bank / JazzCash / EasyPaisa payment receipt screenshot.' },
      { step: 3, title: 'Submit All Required Proof & Checklist', desc: 'Attach links to your 10–15 store products, ad manager screenshots, and store analytics covering the 10-day testing timeframe.' },
      { step: 4, title: 'Audit & Direct Payout Transfer', desc: 'Our senior audit team verifies your LMS DRM watch logs and store implementation within 7 business days. Approved refunds are transferred within 7–10 business days directly to your nominated Pakistani bank, JazzCash, or EasyPaisa account.' }
    ],
    audit_time: '7 business days',
    payout_time: '7–10 business days',
    deactivation_notice: 'Upon refund approval, your Student LMS Portal access, course certificates, and 1-on-1 WhatsApp mentorship desk access will be permanently deactivated.'
  }
};

let inMemoryCmsStore: CmsContentSchema = { ...defaultCmsContent };

export function getCmsContent(): CmsContentSchema {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('sami_cms_content');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          inMemoryCmsStore = { ...inMemoryCmsStore, ...parsed };
        }
      }
    } catch (e) {}
  }
  return inMemoryCmsStore;
}

export function updateCmsContent(patch: Partial<CmsContentSchema>): CmsContentSchema {
  inMemoryCmsStore = {
    ...inMemoryCmsStore,
    ...patch
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('sami_cms_content', JSON.stringify(inMemoryCmsStore));
    } catch (e) {}
  }
  return inMemoryCmsStore;
}

