'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StaticPage from '../../components/StaticPage';
import { useParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function renderMarkdown(text) {
  const lines = text.trim().split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '32px', marginBottom: '12px', color: '#fff' }}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontSize: '1.15rem', fontWeight: 600, marginTop: '24px', marginBottom: '8px', color: '#ddd' }}>{line.slice(4)}</h3>);
    } else if (line.startsWith('# ')) {
      // skip title — we render it separately
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(<li key={i} style={{ marginBottom: '4px' }}>{inlineFormat(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: '20px', color: '#aaa', lineHeight: 1.8, marginBottom: '16px' }}>{items}</ul>);
      continue;
    } else if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(<li key={i} style={{ marginBottom: '4px' }}>{inlineFormat(lines[i].replace(/^\d+\.\s/, ''))}</li>);
        i++;
      }
      elements.push(<ol key={`ol-${i}`} style={{ paddingLeft: '20px', color: '#aaa', lineHeight: 1.8, marginBottom: '16px' }}>{items}</ol>);
      continue;
    } else if (line.startsWith('|')) {
      while (i < lines.length && lines[i].startsWith('|')) i++;
      continue;
    } else if (line.trim() === '') {
      // skip
    } else {
      elements.push(<p key={i} style={{ color: '#aaa', lineHeight: 1.8, marginBottom: '16px', fontSize: '1rem' }}>{inlineFormat(line)}</p>);
    }
    i++;
  }
  return elements;
}

function inlineFormat(text) {
  const parts = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
    let firstMatch = null;
    let firstIdx = remaining.length;
    if (boldMatch && boldMatch.index < firstIdx) { firstMatch = 'bold'; firstIdx = boldMatch.index; }
    if (linkMatch && linkMatch.index < firstIdx) { firstMatch = 'link'; firstIdx = linkMatch.index; }
    if (!firstMatch) { parts.push(remaining); break; }
    if (firstIdx > 0) parts.push(remaining.slice(0, firstIdx));
    if (firstMatch === 'bold') {
      parts.push(<strong key={key++} style={{ color: '#fff', fontWeight: 600 }}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(firstIdx + boldMatch[0].length);
    } else {
      parts.push(<a key={key++} href={linkMatch[2]} style={{ color: '#8b5cf6', textDecoration: 'underline' }}>{linkMatch[1]}</a>);
      remaining = remaining.slice(firstIdx + linkMatch[0].length);
    }
  }
  return parts;
}

export default function BlogPost() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/seo-articles/`)
      .then(r => r.json())
      .then(data => {
        const articles = Array.isArray(data) ? data : data.results || [];
        const found = articles.find(a => a.slug === params.slug);
        setArticle(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return <StaticPage title="Loading..."><p style={{ color: '#888' }}>Loading...</p></StaticPage>;
  }

  if (!article) {
    return (
      <StaticPage title="Not Found">
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Article Not Found</h1>
        <Link href="/blog" style={{ color: '#8b5cf6' }}>← Back to Blog</Link>
      </StaticPage>
    );
  }

  return (
    <StaticPage title={`${article.title} — DomyDomains Blog`} description={article.content_summary}>
      <nav style={{ marginBottom: '32px', fontSize: '0.85rem', color: '#888' }}>
        <Link href="/" style={{ color: '#8b5cf6' }}>🌐 DomyDomains</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link href="/blog" style={{ color: '#8b5cf6' }}>Blog</Link>
      </nav>

      <article style={{ maxWidth: '720px' }}>
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: '#888', marginBottom: '16px' }}>
          {article.published_date && <span>{new Date(article.published_date).toLocaleDateString()}</span>}
          {article.target_keywords && <><span>·</span><span>{article.target_keywords.split(',')[0]}</span></>}
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '32px' }}>
          {article.title}
        </h1>
        <div>{renderMarkdown(article.body)}</div>
      </article>

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
