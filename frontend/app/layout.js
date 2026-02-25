import './globals.css';

export const metadata = {
  title: 'BestDomain - Find Your Perfect Domain',
  description: 'Instantly search domain availability across all TLDs',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
