import Link from 'next/link';
import { StaticPage } from '../components/StaticPage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const metadata = {
  title: 'Domain Name Blog — Tips, Guides & Industry News | DomyDomains',
  description: 'Expert domain name tips, buying guides, TLD comparisons, and industry news. Learn how to choose, value, and register the perfect domain name for your business.',
  alternates: { canonical: '/blog' },
};

export default async function BlogIndex({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  let articles = [];
  let totalPages = 1;
  let hasNext = false;
  let hasPrev = false;

  try {
    const res = await fetch(`${API_BASE}/api/seo-articles/?page=${page}&page_size=10`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    if (data.results) {
      articles = data.results;
      hasNext = !!data.next;
      hasPrev = !!data.previous;
      totalPages = Math.ceil(data.count / 10);
    } else {
      articles = Array.isArray(data) ? data : [];
    }
  } catch (e) {}

  return (
    <StaticPage>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Blog
      </h1>
      <p style={{ color: '#aaa', fontSize: '1.05rem', marginBottom: '48px' }}>
        Domain name tips, guides, and insights.
      </p>

      {articles.length === 0 ? (
        <p style={{ color: '#888' }}>No articles yet. Check back soon!</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {articles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  padding: '24px', background: '#1a1a2e', border: '1px solid #333',
                  borderRadius: '12px', transition: 'border-color 0.2s',
                }}>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                    {article.published_date && <span>{new Date(article.published_date).toLocaleDateString()}</span>}
                    {article.target_keywords && <><span>·</span><span>{article.target_keywords.split(',')[0]}</span></>}
                  </div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>
                    {article.title}
                  </h2>
                  <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {article.content_summary}
                  </p>
                </article>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '48px' }}>
              {hasPrev && (
                <Link href={`/blog?page=${page - 1}`} style={{
                  padding: '10px 20px', borderRadius: '8px', border: '1px solid #333',
                  background: '#1a1a2e', color: '#fff', fontSize: '0.9rem', textDecoration: 'none',
                }}>← Newer</Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <Link key={n} href={`/blog?page=${n}`} style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
                  border: n === page ? '1px solid #8b5cf6' : '1px solid #333',
                  background: n === page ? 'rgba(139,92,246,0.15)' : 'transparent',
                  color: n === page ? '#8b5cf6' : '#888', textDecoration: 'none',
                }}>{n}</Link>
              ))}
              {hasNext && (
                <Link href={`/blog?page=${page + 1}`} style={{
                  padding: '10px 20px', borderRadius: '8px', border: '1px solid #333',
                  background: '#1a1a2e', color: '#fff', fontSize: '0.9rem', textDecoration: 'none',
                }}>Older →</Link>
              )}
            </div>
          )}
        </>
      )}
    </StaticPage>
  );
}
