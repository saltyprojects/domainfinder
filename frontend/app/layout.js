import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'DomyDomains - Find Your Perfect Domain',
  description: 'Instantly search domain availability across all TLDs',
};

export default function RootLayout({ children }) {
  const gtag = process.env.NEXT_PUBLIC_GOOGLE_TAG;

  return (
    <html lang="en">
      <head>
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
