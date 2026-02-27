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
    'The fastest domain search tool on the internet. Search 400+ domain extensions instantly. Find available domains, generate creative names, and discover premium domains for sale.',
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
  const gtag = process.env.NEXT_PUBLIC_GOOGLE_TAG;

  const jsonLd = [
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
        {gtag && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gtag}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
