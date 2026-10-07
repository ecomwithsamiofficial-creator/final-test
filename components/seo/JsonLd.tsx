import React from 'react';

/**
 * Comprehensive Schema.org JSON-LD Structured Data
 * 
 * Implements Google-compliant structured data to trigger:
 * 1. Google Sitelinks (via SiteNavigationElement & ItemList)
 * 2. Google Sitelinks Searchbox (via WebSite & SearchAction)
 * 3. Knowledge Panel (via EducationalOrganization & Person)
 * 4. Rich Course Snippets (via Course & Offer)
 */
export function JsonLd() {
  const baseUrl = 'https://ecomwithsami.com';

  // 1. WebSite Schema with Sitelinks Searchbox
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Ecom With Sami',
    alternateName: [
      'Ecom With Sami',
      'Sardar Samiullah',
      'Sardar Samiullah Ecom',
      'Ecom With Sami Mentorship',
      'www.ecomwithsami.com'
    ],
    description: 'Master e-commerce from scratch with Sardar Samiullah: from beginner dropshipping to white label and private label brand scaling.',
    publisher: {
      '@id': `${baseUrl}/#organization`
    },
    inLanguage: ['ur-PK', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/blogs?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // 2. Person Schema (Explicit Personal Identity for Sardar Samiullah)
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: 'Sardar Samiullah',
    givenName: 'Sardar',
    familyName: 'Samiullah',
    alternateName: ['Mentor Sami', 'Sardar Samiullah Ecom', 'Samiullah'],
    jobTitle: 'Founder & E-Commerce Agency Director',
    description: 'Sardar Samiullah (22 years old, based in Abbottabad, Pakistan) is the founder of Ecom With Sami and director of a professional e-commerce agency. He has mentored 1,200+ students on building scalable e-commerce businesses—from beginner dropshipping to white label, private label, and international expansion.',
    url: `${baseUrl}/about`,
    image: `${baseUrl}/sami-logo.jpg`,
    homeLocation: {
      '@type': 'Place',
      name: 'Abbottabad, Khyber Pakhtunkhwa, Pakistan'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abbottabad',
      addressRegion: 'Khyber Pakhtunkhwa',
      addressCountry: 'PK'
    },
    worksFor: {
      '@id': `${baseUrl}/#organization`
    },
    knowsAbout: [
      'E-Commerce Brand Building',
      'Shopify Dropshipping',
      'White Label E-Commerce',
      'Private Label Scaling',
      'TikTok & Meta Media Buying',
      'Supply Chain Logistics',
      'E-Commerce Agency Management'
    ],
    sameAs: [
      'https://www.youtube.com/@ecomwithsami',
      'https://www.instagram.com/ecomwithsami',
      'https://www.tiktok.com/@ecomwithsami'
    ]
  };

  // 3. EducationalOrganization / Brand Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${baseUrl}/#organization`,
    name: 'Ecom With Sami',
    alternateName: ['Ecom With Sami Agency & Academy', 'EcomWithSami'],
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/sami-logo.jpg`,
      width: 800,
      height: 800,
      caption: 'Ecom With Sami Logo'
    },
    image: `${baseUrl}/sami-logo.jpg`,
    description: 'Premier e-commerce education and agency platform in Pakistan founded by Sardar Samiullah (Abbottabad). Specializing in teaching students to start with low-risk dropshipping, transition into white label, scale into private label brands, and expand internationally.',
    founder: {
      '@id': `${baseUrl}/#person`
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abbottabad',
      addressRegion: 'Khyber Pakhtunkhwa',
      addressCountry: 'PK'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+92-333-0093269',
        contactType: 'customer service',
        availableLanguage: ['Urdu', 'English'],
        areaServed: ['PK', 'AE', 'SA']
      }
    ],
    sameAs: [
      'https://www.youtube.com/@ecomwithsami',
      'https://www.instagram.com/ecomwithsami',
      'https://www.tiktok.com/@ecomwithsami'
    ]
  };

  // 4. SiteNavigationElement
  const siteNavigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Course Enrollment & Pricing',
        description: 'Complete E-Commerce Mentorship Program by Sardar Samiullah for PKR 3,799',
        url: `${baseUrl}/enrollment`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Student LMS Classroom',
        description: 'Access 9 HD video modules, curriculum, resources, and live student dashboard',
        url: `${baseUrl}/lms`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'About Sardar Samiullah',
        description: 'Meet mentor Sardar Samiullah (Abbottabad), learn our agency background and student track record',
        url: `${baseUrl}/about`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Recommended Apps & Tools',
        description: 'Shopify apps, Cash on Delivery automation, and store optimization tools',
        url: `${baseUrl}/apps`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'E-Commerce Guides & Blogs',
        description: 'Latest guides, product hunting strategies, and scaling tutorials',
        url: `${baseUrl}/blogs`
      },
      {
        '@type': 'SiteNavigationElement',
        position: 6,
        name: 'Student Help & Support',
        description: 'Official student help desk, ticket support, and WhatsApp query resolution',
        url: `${baseUrl}/support`
      }
    ]
  };

  // 5. Course Schema (Rich Educational Results)
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Ecom With Sami: Step-by-Step E-Commerce Brand Mentorship',
    description: 'Practical, step-by-step e-commerce training in Urdu by Sardar Samiullah. Covers the full journey across 9 comprehensive video modules: from beginner dropshipping and winning product hunting to white label transition, private label brand scaling, and international market expansion.',
    provider: {
      '@id': `${baseUrl}/#organization`
    },
    instructor: {
      '@id': `${baseUrl}/#person`
    },
    inLanguage: 'ur',
    educationalCredentialAwarded: 'Certificate of Course Completion',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'PT20H',
      inLanguage: 'ur'
    },
    offers: {
      '@type': 'Offer',
      price: '3799',
      priceCurrency: 'PKR',
      category: 'Paid',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/enrollment`,
      validFrom: '2026-01-01'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
    </>
  );
}
