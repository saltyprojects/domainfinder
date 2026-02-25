import Link from 'next/link';
import { posts } from '../../content/posts';

export const metadata = {
  title: 'Blog — DomyDomains',
  description: 'Domain name tips, guides, and insights to help you find and register the perfect domain.',
  openGraph: {
    title: 'Blog — DomyDomains',
    description: 'Domain name tips, guides, and insights.',
  },
};

export default function BlogIndex() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <nav style={{ marginBottom: '32px' }}>
        <Link href="/" style={{ fontSize: '1.2rem', fontWeight: 700 }}>🌐 DomyDomains</Link>
      </nav>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Blog
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '48px' }}>
        Domain name tips, guides, and insights.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
            <article style={{
              padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', transition: 'border-color 0.2s',
            }}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>
                {post.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {post.description}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
