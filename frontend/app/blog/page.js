'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StaticPage } from '../components/StaticPage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BlogIndex() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/seo-articles/`)
      .then(r => r.json())
      .then(data => {
        // Filter to only published articles with body content, or all with body if none published
        const withBody = (Array.isArray(data) ? data : data.results || []).filter(a => a.body);
        setArticles(withBody);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      )}
    </StaticPage>
  );
}
