import Link from 'next/link';
import { EmbedGenerator } from './EmbedGenerator';

export const metadata = {
  title: 'Embed Domain Search Widget — DomyDomains',
  description: 'Add a free domain search widget to your website. Check .com availability with a simple embed.',
};

export default function EmbedPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <nav style={{ marginBottom: '32px' }}>
        <Link href="/" style={{ fontSize: '1.2rem', fontWeight: 700 }}>🌐 DomyDomains</Link>
      </nav>

      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Embed Domain Search
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '32px' }}>
        Add a free domain availability checker to your website. Customize colors and copy the embed code.
      </p>

      <EmbedGenerator />
    </div>
  );
}
