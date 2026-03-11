import Script from 'next/script';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-content',
};

export const metadata = {
  title: 'DomyDomains — Instant Domain Name Search | 400+ TLDs',
  description:
    'The fastest domain search tool on the internet. Search 400+ domain extensions instantly. Find available domains, compare prices, and register in seconds.',
  keywords: 'domain search, domain name search, domain availability, domain checker, domain finder, TLD search, domain extensions, buy domain, register domain, domain generator',
  metadataBase: new URL('https://domydomains.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'DomyDomains — Instant Domain Name Search | 400+ TLDs',
    description:
      'The fastest domain search tool on the internet. Search 400+ domain extensions instantly.',
    url: 'https://domydomains.com',
    siteName: 'DomyDomains',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DomyDomains — Domain Search Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DomyDomains — Instant Domain Name Search | 400+ TLDs',
    description:
      'The fastest domain search tool. Search 400+ domain extensions instantly. Find and register domains.',
    site: '@domydomains',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  const gaTag = 'G-QV0XLGRGCK';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'DomyDomains',
      url: 'https://domydomains.com',
      logo: 'https://domydomains.com/android-chrome-512x512.png',
      description: 'The fastest domain search tool on the internet. Search 400+ domain extensions instantly.',
      sameAs: ['https://twitter.com/domydomains'],
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: 'https://domydomains.com' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DomyDomains',
      url: 'https://domydomains.com',
      description: 'The fastest domain search tool on the internet. Search 400+ domain extensions instantly.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '150' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'DomyDomains',
      url: 'https://domydomains.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://domydomains.com/?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
  ];

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaTag}`}
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaTag}');`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
