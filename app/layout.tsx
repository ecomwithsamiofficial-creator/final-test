import type { Metadata } from 'next';
import './globals.css';
import { DynamicPixels, LiveVisitorTracker } from '@/components/tracking';
import { WhatsAppWidget } from '@/components/common';
import { StickyMobileCta } from '@/components/layout';
import { dbGetCmsSettings } from '@/lib/database';
import { generateThemeCss, DEFAULT_THEME_COLORS } from '@/utils/cmsStore';

import { JsonLd } from '@/components/seo/JsonLd';
import { AntiInspectShield } from '@/components/security/AntiInspectShield';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL('https://ecomwithsami.com'),
  title: 'Ecom With Sami | E-Commerce Mentorship by Sardar Samiullah',
  description: 'Official e-commerce mentorship by Sardar Samiullah (22-year-old agency director based in Abbottabad, Pakistan). Master the complete roadmap: from beginner dropshipping to white label and private label brand scaling. 1,200+ students trained.',
  applicationName: 'Ecom With Sami',
  authors: [{ name: 'Sardar Samiullah', url: 'https://ecomwithsami.com/about' }],
  creator: 'Sardar Samiullah',
  publisher: 'Ecom With Sami',
  keywords: [
    'Sardar Samiullah',
    'Sardar Samiullah Abbottabad',
    'Ecom With Sami',
    'Ecom With Sami Sardar Samiullah',
    'Shopify dropshipping Pakistan',
    'White label ecommerce Pakistan',
    'Private label brand scaling',
    'Sardar Samiullah e-commerce agency',
    'E-commerce mentorship Pakistan',
    'Shopify course in Urdu',
    'TikTok Ads Pakistan',
    'Sardar Samiullah mentor'
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Ecom With Sami | Sardar Samiullah',
    description: 'Official e-commerce mentorship by Sardar Samiullah (Abbottabad, Pakistan). Complete step-by-step framework from dropshipping to white label and private label brands. 1,200+ students trained.',
    url: 'https://ecomwithsami.com',
    siteName: 'Ecom With Sami',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/mentor-profile.png',
        width: 1200,
        height: 1200,
        alt: 'Sardar Samiullah - Ecom With Sami',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecom With Sami | Sardar Samiullah',
    description: 'Official e-commerce mentorship by Sardar Samiullah (Abbottabad, Pakistan). Complete step-by-step framework from dropshipping to private label brands.',
    images: ['/mentor-profile.png'],
    creator: '@ecomwithsami',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png?v=sami_v2026_october', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=sami_v2026_october', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico?v=sami_v2026_october', sizes: 'any' },
      { url: '/icon.png?v=sami_v2026_october', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico?v=sami_v2026_october',
    apple: [
      { url: '/apple-icon.png?v=sami_v2026_october', sizes: '180x180', type: 'image/png' },
    ],
  },
  category: 'education',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let activeTheme = 'default';
  let customColors = { ...DEFAULT_THEME_COLORS };

  try {
    const cms = await dbGetCmsSettings();
    if (cms?.theme) {
      if (cms.theme.active_preset) activeTheme = cms.theme.active_preset;
      else if (cms.theme.active_theme) activeTheme = cms.theme.active_theme;

      if (cms.theme.custom_colors) {
        customColors = { ...DEFAULT_THEME_COLORS, ...cms.theme.custom_colors };
      }
    }
  } catch (e) {}

  const dynamicCss = generateThemeCss(customColors);

  return (
    <html lang="en" data-theme={activeTheme} className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        {/* Fast Video & CDN Preconnect (Instant loading like LearnWithAfaq) */}
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        {/* Immediate Browser Tab Favicon Invalidation (Cache Busting) */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=sami2026" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=sami2026" />
        <link rel="shortcut icon" href="/favicon.ico?v=sami2026" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=sami2026" />
        <JsonLd />
        {/* Google tag (gtag.js) - Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FJBC4S9KM3" />
        <script
          id="google-analytics-tag"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FJBC4S9KM3');
            `,
          }}
        />
        <style id="sami-dynamic-theme" dangerouslySetInnerHTML={{ __html: dynamicCss }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t=localStorage.getItem('sami_active_theme')||(document.cookie.match(/sami_active_theme=([^;]+)/)||[])[1];
              if(t){document.documentElement.setAttribute('data-theme',t);}
              var raw=localStorage.getItem('sami_theme_css');
              if(raw){
                var el=document.getElementById('sami-dynamic-theme');
                if(el){el.innerHTML=raw;}
              }
            }catch(e){}})();`
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-[#00A0DF] selection:text-white">
        <AntiInspectShield />
        <DynamicPixels />
        <LiveVisitorTracker />
        {children}
        <WhatsAppWidget />
        <StickyMobileCta />
      </body>
    </html>
  );
}
