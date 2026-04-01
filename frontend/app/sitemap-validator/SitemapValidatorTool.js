'use client';

import { useState } from 'react';

function cleanUrl(input) {
  let u = input.trim();
  if (!u) return '';
  // If just a domain, assume /sitemap.xml
  if (!u.includes('/') || u.match(/^[a-z0-9.-]+\.[a-z]{2,}$/i)) {
    u = u.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    return `https://${u}/sitemap.xml`;
  }
  if (!u.startsWith('http')) u = 'https://' + u;
  return u;
}

function formatDate(str) {
  if (!str) return '—';
  try {
    return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return str; }
}

function parseXml(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    return { error: 'Invalid XML: ' + (parseError.textContent || 'parse error').slice(0, 200) };
  }
  return { doc };
}

function analyzeSitemap(text, url) {
  const { doc, error } = parseXml(text);
  if (error) return { error, warnings: [], urls: [], sitemaps: [], type: 'unknown' };

  const warnings = [];
  const root = doc.documentElement;
  const rootTag = root.tagName.replace(/^.*:/, '');

  // Check for namespace
  const ns = root.getAttribute('xmlns');
  if (!ns || !ns.includes('sitemaps.org')) {
    warnings.push('Missing or invalid XML namespace. Should be xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  }

  // Check XML declaration
  if (!text.trimStart().startsWith('<?xml')) {
    warnings.push('Missing XML declaration (<?xml version="1.0" encoding="UTF-8"?>)');
  }

  // Sitemap index
  if (rootTag === 'sitemapindex') {
    const sitemapEls = doc.querySelectorAll('sitemap');
    const sitemaps = [];
    sitemapEls.forEach(el => {
      const loc = el.querySelector('loc')?.textContent?.trim() || '';
      const lastmod = el.querySelector('lastmod')?.textContent?.trim() || '';
      if (!loc) warnings.push('Found <sitemap> entry without <loc>');
      sitemaps.push({ loc, lastmod });
    });
    if (sitemaps.length === 0) warnings.push('Sitemap index contains no <sitemap> entries');
    return { type: 'index', sitemaps, urls: [], warnings, rawSize: text.length };
  }

  // Regular sitemap
  if (rootTag === 'urlset') {
    const urlEls = doc.querySelectorAll('url');
    const urls = [];
    const freqCounts = {};
    let withLastmod = 0;
    let withPriority = 0;
    let withChangefreq = 0;
    let oldestMod = null;
    let newestMod = null;
    const duplicates = new Set();
    const seen = new Set();

    urlEls.forEach(el => {
      const loc = el.querySelector('loc')?.textContent?.trim() || '';
      const lastmod = el.querySelector('lastmod')?.textContent?.trim() || '';
      const changefreq = el.querySelector('changefreq')?.textContent?.trim() || '';
      const priority = el.querySelector('priority')?.textContent?.trim() || '';

      if (!loc) {
        warnings.push('Found <url> entry without <loc>');
      } else if (seen.has(loc)) {
        duplicates.add(loc);
      } else {
        seen.add(loc);
      }

      if (lastmod) {
        withLastmod++;
        try {
          const d = new Date(lastmod);
          if (isNaN(d.getTime())) {
            warnings.push(`Invalid lastmod date: "${lastmod}" for ${loc}`);
          } else {
            if (!oldestMod || d < oldestMod) oldestMod = d;
            if (!newestMod || d > newestMod) newestMod = d;
          }
        } catch {}
      }
      if (changefreq) {
        withChangefreq++;
        freqCounts[changefreq] = (freqCounts[changefreq] || 0) + 1;
        const valid = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
        if (!valid.includes(changefreq.toLowerCase())) {
          warnings.push(`Invalid changefreq "${changefreq}" for ${loc}`);
        }
      }
      if (priority) {
        withPriority++;
        const p = parseFloat(priority);
        if (isNaN(p) || p < 0 || p > 1) {
          warnings.push(`Invalid priority "${priority}" for ${loc} (must be 0.0-1.0)`);
        }
      }

      // Check for non-canonical URLs
      if (loc && loc.includes('?')) {
        warnings.push(`URL contains query parameters: ${loc}`);
      }

      urls.push({ loc, lastmod, changefreq, priority });
    });

    if (duplicates.size > 0) {
      warnings.push(`Found ${duplicates.size} duplicate URL(s)`);
    }
    if (urls.length > 50000) {
      warnings.push(`Sitemap exceeds 50,000 URL limit (found ${urls.length.toLocaleString()})`);
    }
    if (text.length > 50 * 1024 * 1024) {
      warnings.push('Sitemap exceeds 50MB uncompressed size limit');
    }

    return {
      type: 'urlset',
      urls,
      sitemaps: [],
      warnings,
      rawSize: text.length,
      stats: {
        total: urls.length,
        withLastmod,
        withPriority,
        withChangefreq,
        duplicates: duplicates.size,
        freqCounts,
        oldestMod: oldestMod?.toISOString(),
        newestMod: newestMod?.toISOString(),
      },
    };
  }

  return { error: `Unexpected root element: <${rootTag}>. Expected <urlset> or <sitemapindex>.`, warnings: [], urls: [], sitemaps: [], type: 'unknown' };
}

const cardStyle = {
  background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px', marginBottom: '16px',
};
const labelStyle = { fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' };
const valueStyle = { fontSize: '1.3rem', fontWeight: 700, color: '#fff' };

export default function SitemapValidatorTool() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');
  const [urlPage, setUrlPage] = useState(0);

  const PER_PAGE = 50;

  async function handleSubmit(e) {
    e.preventDefault();
    const url = cleanUrl(input);
    if (!url) return;
    setLoading(true);
    setError('');
    setResult(null);
    setTab('overview');
    setUrlPage(0);

    try {
      // Try fetching via public CORS proxies
      let text = null;
      const proxies = [
        (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
        (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
      ];

      for (const proxy of proxies) {
        try {
          const res = await fetch(proxy(url), { signal: AbortSignal.timeout(15000) });
          if (res.ok) {
            text = await res.text();
            if (text && text.includes('<')) break;
          }
        } catch {}
        text = null;
      }

      if (!text) {
        setError('Could not fetch the sitemap. Make sure the URL is correct and the file is publicly accessible.');
        return;
      }

      const analysis = analyzeSitemap(text, url);
      if (analysis.error) {
        setError(analysis.error);
        return;
      }

      setResult({ ...analysis, url, fetchedAt: new Date().toISOString() });
    } catch (err) {
      setError(err.message || 'Failed to fetch sitemap');
    } finally {
      setLoading(false);
    }
  }

  const tabs = ['overview', 'urls', 'warnings', 'raw'];

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="example.com or https://example.com/sitemap.xml"
          style={{
            flex: 1, minWidth: '250px', padding: '12px 16px', borderRadius: '10px',
            border: '1px solid #333', background: '#111', color: '#fff',
            fontSize: '0.95rem', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#8b5cf6'}
          onBlur={e => e.target.style.borderColor = '#333'}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 24px', borderRadius: '10px', border: 'none',
            background: loading ? '#333' : '#8b5cf6', color: '#fff',
            fontWeight: 600, fontSize: '0.95rem', cursor: loading ? 'wait' : 'pointer',
            transition: 'background 0.2s', whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Validating…' : 'Validate Sitemap'}
        </button>
      </form>

      {error && (
        <div style={{ ...cardStyle, borderColor: '#ef4444', background: '#1a0a0a' }}>
          <p style={{ color: '#f87171', margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {result && (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); if (t === 'urls') setUrlPage(0); }}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid',
                  borderColor: tab === t ? '#8b5cf6' : '#333',
                  background: tab === t ? '#8b5cf620' : 'transparent',
                  color: tab === t ? '#8b5cf6' : '#999',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {t === 'warnings' ? `Warnings (${result.warnings.length})` :
                 t === 'urls' && result.type === 'index' ? `Sitemaps (${result.sitemaps.length})` :
                 t === 'urls' ? `URLs (${result.urls.length.toLocaleString()})` : t}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {tab === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <div style={cardStyle}>
                  <div style={labelStyle}>Type</div>
                  <div style={valueStyle}>{result.type === 'index' ? '📋 Index' : '📄 Urlset'}</div>
                </div>
                <div style={cardStyle}>
                  <div style={labelStyle}>{result.type === 'index' ? 'Child Sitemaps' : 'URLs Found'}</div>
                  <div style={valueStyle}>{result.type === 'index' ? result.sitemaps.length : result.stats?.total.toLocaleString()}</div>
                </div>
                <div style={cardStyle}>
                  <div style={labelStyle}>File Size</div>
                  <div style={valueStyle}>{(result.rawSize / 1024).toFixed(1)} KB</div>
                </div>
                <div style={cardStyle}>
                  <div style={labelStyle}>Warnings</div>
                  <div style={{ ...valueStyle, color: result.warnings.length > 0 ? '#f59e0b' : '#22c55e' }}>
                    {result.warnings.length}
                  </div>
                </div>
              </div>

              {result.type === 'urlset' && result.stats && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                    <div style={cardStyle}>
                      <div style={labelStyle}>Has Lastmod</div>
                      <div style={valueStyle}>{Math.round((result.stats.withLastmod / result.stats.total) * 100)}%</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{result.stats.withLastmod} of {result.stats.total}</div>
                    </div>
                    <div style={cardStyle}>
                      <div style={labelStyle}>Has Changefreq</div>
                      <div style={valueStyle}>{Math.round((result.stats.withChangefreq / result.stats.total) * 100)}%</div>
                    </div>
                    <div style={cardStyle}>
                      <div style={labelStyle}>Has Priority</div>
                      <div style={valueStyle}>{Math.round((result.stats.withPriority / result.stats.total) * 100)}%</div>
                    </div>
                    <div style={cardStyle}>
                      <div style={labelStyle}>Duplicates</div>
                      <div style={{ ...valueStyle, color: result.stats.duplicates > 0 ? '#ef4444' : '#22c55e' }}>
                        {result.stats.duplicates}
                      </div>
                    </div>
                  </div>

                  {(result.stats.oldestMod || result.stats.newestMod) && (
                    <div style={{ ...cardStyle, display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                      {result.stats.oldestMod && (
                        <div>
                          <div style={labelStyle}>Oldest Lastmod</div>
                          <div style={{ color: '#fff', fontWeight: 600 }}>{formatDate(result.stats.oldestMod)}</div>
                        </div>
                      )}
                      {result.stats.newestMod && (
                        <div>
                          <div style={labelStyle}>Newest Lastmod</div>
                          <div style={{ color: '#fff', fontWeight: 600 }}>{formatDate(result.stats.newestMod)}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {Object.keys(result.stats.freqCounts).length > 0 && (
                    <div style={cardStyle}>
                      <div style={labelStyle}>Changefreq Distribution</div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {Object.entries(result.stats.freqCounts).sort((a,b) => b[1]-a[1]).map(([freq, count]) => (
                          <div key={freq} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{freq}</span>
                            <span style={{ color: '#888', fontSize: '0.85rem' }}>{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Health Score */}
              {result.type === 'urlset' && result.stats && (() => {
                let score = 100;
                if (result.warnings.length > 0) score -= Math.min(result.warnings.length * 5, 30);
                if (result.stats.duplicates > 0) score -= 10;
                if (result.stats.withLastmod / result.stats.total < 0.5) score -= 15;
                if (result.stats.total > 50000) score -= 20;
                if (result.rawSize > 50 * 1024 * 1024) score -= 20;
                score = Math.max(0, Math.min(100, score));
                const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
                return (
                  <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color }}>{score}</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>Health Score</div>
                      <div style={{ color: '#888', fontSize: '0.85rem' }}>
                        {score >= 80 ? 'Your sitemap looks healthy and well-structured.' :
                         score >= 50 ? 'Some issues found — review the warnings tab.' :
                         'Significant issues detected — fix warnings for better crawling.'}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {/* URLs / Sitemaps Tab */}
          {tab === 'urls' && (
            <div style={cardStyle}>
              {result.type === 'index' ? (
                <>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontWeight: 600 }}>#</th>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontWeight: 600 }}>Sitemap URL</th>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontWeight: 600 }}>Last Modified</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.sitemaps.map((s, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ padding: '8px', color: '#666' }}>{i + 1}</td>
                            <td style={{ padding: '8px', color: '#8b5cf6', wordBreak: 'break-all' }}>{s.loc}</td>
                            <td style={{ padding: '8px', color: '#999' }}>{formatDate(s.lastmod)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontWeight: 600 }}>#</th>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontWeight: 600 }}>URL</th>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontWeight: 600 }}>Lastmod</th>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontWeight: 600 }}>Freq</th>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontWeight: 600 }}>Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.urls.slice(urlPage * PER_PAGE, (urlPage + 1) * PER_PAGE).map((u, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ padding: '8px', color: '#666' }}>{urlPage * PER_PAGE + i + 1}</td>
                            <td style={{ padding: '8px', color: '#ccc', wordBreak: 'break-all', maxWidth: '400px' }}>{u.loc}</td>
                            <td style={{ padding: '8px', color: '#999', whiteSpace: 'nowrap' }}>{formatDate(u.lastmod)}</td>
                            <td style={{ padding: '8px', color: '#999' }}>{u.changefreq || '—'}</td>
                            <td style={{ padding: '8px', color: '#999' }}>{u.priority || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {result.urls.length > PER_PAGE && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px', alignItems: 'center' }}>
                      <button
                        onClick={() => setUrlPage(p => Math.max(0, p - 1))}
                        disabled={urlPage === 0}
                        style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #333', background: '#1a1a1a', color: urlPage === 0 ? '#444' : '#fff', cursor: urlPage === 0 ? 'default' : 'pointer', fontSize: '0.85rem' }}
                      >← Prev</button>
                      <span style={{ color: '#888', fontSize: '0.85rem' }}>
                        {urlPage * PER_PAGE + 1}–{Math.min((urlPage + 1) * PER_PAGE, result.urls.length)} of {result.urls.length.toLocaleString()}
                      </span>
                      <button
                        onClick={() => setUrlPage(p => p + 1)}
                        disabled={(urlPage + 1) * PER_PAGE >= result.urls.length}
                        style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #333', background: '#1a1a1a', color: (urlPage + 1) * PER_PAGE >= result.urls.length ? '#444' : '#fff', cursor: (urlPage + 1) * PER_PAGE >= result.urls.length ? 'default' : 'pointer', fontSize: '0.85rem' }}
                      >Next →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Warnings Tab */}
          {tab === 'warnings' && (
            <div style={cardStyle}>
              {result.warnings.length === 0 ? (
                <p style={{ color: '#22c55e', margin: 0 }}>✅ No warnings — your sitemap looks clean!</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {result.warnings.map((w, i) => (
                    <li key={i} style={{ color: '#f59e0b', marginBottom: '8px', fontSize: '0.9rem', lineHeight: 1.6 }}>{w}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Raw Tab */}
          {tab === 'raw' && (
            <div style={cardStyle}>
              <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }}>
                Fetched from: <span style={{ color: '#8b5cf6' }}>{result.url}</span>
              </p>
              <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>
                Size: {(result.rawSize / 1024).toFixed(1)} KB • Type: {result.type} • Analyzed: {formatDate(result.fetchedAt)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
