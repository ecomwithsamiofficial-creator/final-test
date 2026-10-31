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
        url: 'https://ecomwithsami.com/og-image.jpg?v=sami2026_cinematic_v2',
        width: 1200,
        height: 630,
        alt: 'Sardar Samiullah - Ecom With Sami',
      },
      {
        url: 'https://ecomwithsami.com/mentor-profile.png?v=sami2026_mentor_v1',
        width: 600,
        height: 600,
        alt: 'Sardar Samiullah - Ecom With Sami',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecom With Sami | Sardar Samiullah',
    description: 'Official e-commerce mentorship by Sardar Samiullah (Abbottabad, Pakistan). Complete step-by-step framework from dropshipping to private label brands.',
    images: ['https://ecomwithsami.com/og-image.jpg?v=sami2026_cinematic_v2'],
    creator: '@ecomwithsami',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png?v=sami2026_cinematic_v2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=sami2026_cinematic_v2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico?v=sami2026_cinematic_v2', sizes: 'any' },
      { url: '/icon.png?v=sami2026_cinematic_v2', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico?v=sami2026_cinematic_v2',
    apple: [
      { url: '/apple-icon.png?v=sami2026_cinematic_v2', sizes: '180x180', type: 'image/png' },
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
  let metaPixelId = '2449386688923586';

  try {
    const cms = await dbGetCmsSettings();
    if (cms?.pixels?.meta_pixel_id && cms.pixels.meta_pixel_id.trim()) {
      metaPixelId = cms.pixels.meta_pixel_id.trim();
    }
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
        {/* Explicit Social Sharing & OpenGraph Meta Tags for Instagram, WhatsApp, Facebook, iMessage */}
        <meta property="og:image" content="https://ecomwithsami.com/og-image.jpg?v=sami2026_cinematic_v2" />
        <meta property="og:image:secure_url" content="https://ecomwithsami.com/og-image.jpg?v=sami2026_cinematic_v2" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Sardar Samiullah - Ecom With Sami" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://ecomwithsami.com/og-image.jpg?v=sami2026_cinematic_v2" />

        {/* Immediate Browser Tab Favicon Invalidation (Cache Busting) */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=sami2026_cinematic_v2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=sami2026_cinematic_v2" />
        <link rel="shortcut icon" href="/favicon.ico?v=sami2026_cinematic_v2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png?v=sami2026_cinematic_v2" />
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
        {/* Meta Pixel Code (Official) */}
        <script
          id="meta-pixel-init"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('set', 'autoConfig', false, '${metaPixelId}');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
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
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
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
