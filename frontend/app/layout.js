import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'DomyDomains — Find Your Perfect Domain Name Instantly',
  description:
    'Search domain availability across 20+ TLDs, check social handles, and compare prices — all in one free tool. Find, compare, and register your ideal domain.',
  metadataBase: new URL('https://domydomains.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'DomyDomains — Find Your Perfect Domain Name Instantly',
    description:
      'Search domain availability across 20+ TLDs, check social handles, and compare prices — all in one free tool.',
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
    title: 'DomyDomains — Find Your Perfect Domain Name Instantly',
    description:
      'Search domain availability across 20+ TLDs, check social handles, and compare prices — all free.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  const gtag = process.env.NEXT_PUBLIC_GOOGLE_TAG;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'DomyDomains',
    url: 'https://domydomains.com',
    description:
      'Search domain availability across 20+ TLDs, check social handles, and compare prices.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

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
