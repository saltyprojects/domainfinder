import Link from 'next/link';
import { StaticPage } from '../../components/StaticPage';
import BlogArticle from './BlogArticle';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_BASE}/api/seo-articles/${slug}/`, { next: { revalidate: 300 } });
    if (!res.ok) return { title: 'Article Not Found — DomyDomains' };
    const article = await res.json();
    return {
      title: `${article.title} — DomyDomains Blog`,
      description: article.content_summary || article.title,
      alternates: { canonical: `/blog/${slug}` },
    };
  } catch {
    return { title: 'Article Not Found — DomyDomains' };
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  let article = null;

  try {
    const res = await fetch(`${API_BASE}/api/seo-articles/${slug}/`, { next: { revalidate: 300 } });
    if (res.ok) article = await res.json();
  } catch {}

  if (!article) {
    return (
      <StaticPage>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Article Not Found</h1>
        <Link href="/blog" style={{ color: '#8b5cf6' }}>← Back to Blog</Link>
      </StaticPage>
    );
  }

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.content_summary || article.title,
    datePublished: article.published_date || new Date().toISOString(),
    dateModified: article.updated_date || article.published_date || new Date().toISOString(),
    author: { '@type': 'Organization', name: 'DomyDomains', url: 'https://domydomains.com' },
    publisher: {
      '@type': 'Organization',
      name: 'DomyDomains',
      logo: { '@type': 'ImageObject', url: 'https://domydomains.com/android-chrome-512x512.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://domydomains.com/blog/${slug}` },
    url: `https://domydomains.com/blog/${slug}`,
  };

  return (
    <StaticPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <nav style={{ marginBottom: '32px', fontSize: '0.85rem', color: '#888' }}>
        <Link href="/" style={{ color: '#8b5cf6' }}>🌐 DomyDomains</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link href="/blog" style={{ color: '#8b5cf6' }}>Blog</Link>
      </nav>

      <BlogArticle article={article} />

      <div style={{ marginTop: '48px', padding: '24px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#fff' }}>Ready to find your perfect domain?</p>
        <Link href="/" style={{
          display: 'inline-block', padding: '12px 24px', background: '#8b5cf6', color: '#fff',
          borderRadius: '12px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
        }}>
          Search Now — Free →
        </Link>
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link href="/blog" style={{ color: '#888', fontSize: '0.9rem' }}>← Back to all posts</Link>
      </div>
    </StaticPage>
  );
}
