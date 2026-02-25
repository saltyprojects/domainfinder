export const metadata = {
  title: 'BestDomain - Domain Finder',
  description: 'Find the best domain for your project',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
