'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StaticPage } from '../components/StaticPage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BlogIndex() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/seo-articles/?page=${page}&page_size=10`)
      .then(r => r.json())
      .then(data => {
        // Handle both paginated and unpaginated responses
        if (data.results) {
          setArticles(data.results);
          setHasNext(!!data.next);
          setHasPrev(!!data.previous);
          setTotalPages(Math.ceil(data.count / 10));
        } else {
          const withBody = Array.isArray(data) ? data : [];
          setArticles(withBody);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <StaticPage title="Blog — DomyDomains" description="Domain name tips, guides, and insights.">
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Blog
      </h1>
      <p style={{ color: '#aaa', fontSize: '1.05rem', marginBottom: '48px' }}>
        Domain name tips, guides, and insights.
      </p>

      {loading ? (
        <p style={{ color: '#888' }}>Loading articles...</p>
      ) : articles.length === 0 ? (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '48px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!hasPrev}
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: '1px solid #333',
                  background: hasPrev ? '#1a1a2e' : 'transparent', color: hasPrev ? '#fff' : '#555',
                  cursor: hasPrev ? 'pointer' : 'default', fontSize: '0.9rem',
                }}
              >
                ← Newer
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
                    border: n === page ? '1px solid #8b5cf6' : '1px solid #333',
                    background: n === page ? 'rgba(139,92,246,0.15)' : 'transparent',
                    color: n === page ? '#8b5cf6' : '#888',
                    cursor: 'pointer',
                  }}>
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasNext}
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: '1px solid #333',
                  background: hasNext ? '#1a1a2e' : 'transparent', color: hasNext ? '#fff' : '#555',
                  cursor: hasNext ? 'pointer' : 'default', fontSize: '0.9rem',
                }}
              >
                Older →
              </button>
            </div>
          )}
        </>
      )}
    </StaticPage>
  );
}
