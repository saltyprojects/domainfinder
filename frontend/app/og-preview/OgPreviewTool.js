'use client';

import { useState } from 'react';

const PROXY = 'https://api.allorigins.win/raw?url=';

function extractMetaTags(html) {
  const meta = {};
  // OG tags
  const ogRe = /<meta\s+[^>]*property=["']og:([^"']+)["'][^>]*content=["']([^"']*)["'][^>]*\/?>/gi;
  let m;
  while ((m = ogRe.exec(html))) meta['og:' + m[1]] = m[2];
  // reverse attribute order
  const ogRe2 = /<meta\s+[^>]*content=["']([^"']*)["'][^>]*property=["']og:([^"']+)["'][^>]*\/?>/gi;
  while ((m = ogRe2.exec(html))) { if (!meta['og:' + m[2]]) meta['og:' + m[2]] = m[1]; }
  // Twitter tags
  const twRe = /<meta\s+[^>]*name=["']twitter:([^"']+)["'][^>]*content=["']([^"']*)["'][^>]*\/?>/gi;
  while ((m = twRe.exec(html))) meta['twitter:' + m[1]] = m[2];
  const twRe2 = /<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:([^"']+)["'][^>]*\/?>/gi;
  while ((m = twRe2.exec(html))) { if (!meta['twitter:' + m[2]]) meta['twitter:' + m[2]] = m[1]; }
  // title tag
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) meta['_title'] = titleMatch[1].trim();
  // meta description
  const descRe = /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*\/?>/i;
  const descMatch = html.match(descRe);
  if (descMatch) meta['_description'] = descMatch[1];
  const descRe2 = /<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*\/?>/i;
  const descMatch2 = html.match(descRe2);
  if (!meta['_description'] && descMatch2) meta['_description'] = descMatch2[1];
  // canonical
  const canRe = /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*\/?>/i;
  const canMatch = html.match(canRe);
  if (canMatch) meta['_canonical'] = canMatch[1];
  return meta;
}

function getDomain(url) {
  try { return new URL(url).hostname; } catch { return url; }
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

const card = { background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden' };
const cardLabel = { fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em' };

function FacebookPreview({ meta, url }) {
  const title = meta['og:title'] || meta['_title'] || 'No title found';
  const desc = meta['og:description'] || meta['_description'] || '';
  const image = meta['og:image'] || '';
  const domain = getDomain(meta['og:url'] || url);
  return (
    <div>
      <div style={cardLabel}>Facebook / LinkedIn</div>
      <div style={card}>
        {image && (
          <div style={{ width: '100%', aspectRatio: '1.91/1', background: '#1a1a1a', overflow: 'hidden' }}>
            <img src={image} alt="OG" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
        )}
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '4px' }}>{domain}</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e5e5e5', lineHeight: 1.3, marginBottom: '4px' }}>{truncate(title, 70)}</div>
          <div style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.4 }}>{truncate(desc, 160)}</div>
        </div>
      </div>
    </div>
  );
}

function TwitterPreview({ meta, url }) {
  const cardType = meta['twitter:card'] || 'summary';
  const title = meta['twitter:title'] || meta['og:title'] || meta['_title'] || 'No title found';
  const desc = meta['twitter:description'] || meta['og:description'] || meta['_description'] || '';
  const image = meta['twitter:image'] || meta['og:image'] || '';
  const domain = getDomain(meta['og:url'] || url);
  const isLarge = cardType === 'summary_large_image';
  return (
    <div>
      <div style={cardLabel}>𝕏 (Twitter){isLarge ? ' — Large Image' : ' — Summary'}</div>
      <div style={{ ...card, display: isLarge ? 'block' : 'flex', flexDirection: 'row' }}>
        {isLarge ? (
          <>
            {image && (
              <div style={{ width: '100%', aspectRatio: '2/1', background: '#1a1a1a', overflow: 'hidden' }}>
                <img src={image} alt="Card" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}
            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.3 }}>{truncate(title, 70)}</div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>{domain}</div>
            </div>
          </>
        ) : (
          <>
            {image && (
              <div style={{ width: '130px', minHeight: '130px', background: '#1a1a1a', flexShrink: 0, overflow: 'hidden' }}>
                <img src={image} alt="Card" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}
            <div style={{ padding: '12px 16px', flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e5e5e5', lineHeight: 1.3, marginBottom: '4px' }}>{truncate(title, 70)}</div>
              <div style={{ fontSize: '0.8rem', color: '#999', lineHeight: 1.4, marginBottom: '4px' }}>{truncate(desc, 120)}</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>{domain}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DiscordPreview({ meta, url }) {
  const title = meta['og:title'] || meta['_title'] || 'No title found';
  const desc = meta['og:description'] || meta['_description'] || '';
  const image = meta['og:image'] || '';
  const siteName = meta['og:site_name'] || getDomain(url);
  const color = meta['theme-color'] || '#8b5cf6';
  return (
    <div>
      <div style={cardLabel}>Discord</div>
      <div style={{ ...card, borderLeft: `4px solid ${color}`, display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}>{siteName}</div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#5b9bd5', marginBottom: '6px', lineHeight: 1.3 }}>{truncate(title, 80)}</div>
        {desc && <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.4, marginBottom: image ? '12px' : 0 }}>{truncate(desc, 200)}</div>}
        {image && (
          <div style={{ maxWidth: '300px', borderRadius: '8px', overflow: 'hidden', marginTop: '4px' }}>
            <img src={image} alt="Embed" style={{ width: '100%', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>
    </div>
  );
}

function SlackPreview({ meta, url }) {
  const title = meta['og:title'] || meta['_title'] || 'No title found';
  const desc = meta['og:description'] || meta['_description'] || '';
  const image = meta['og:image'] || '';
  const siteName = meta['og:site_name'] || getDomain(url);
  return (
    <div>
      <div style={cardLabel}>Slack</div>
      <div style={{ ...card, borderLeft: '4px solid #555', padding: '12px 16px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ccc', marginBottom: '4px' }}>{siteName}</div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#5b9bd5', marginBottom: '6px' }}>{truncate(title, 80)}</div>
        {desc && <div style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.4, marginBottom: image ? '12px' : 0 }}>{truncate(desc, 200)}</div>}
        {image && (
          <div style={{ maxWidth: '360px', borderRadius: '4px', overflow: 'hidden' }}>
            <img src={image} alt="Preview" style={{ width: '100%', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>
    </div>
  );
}

function TagsTable({ meta }) {
  const entries = Object.entries(meta).filter(([k]) => !k.startsWith('_'));
  const fallbacks = Object.entries(meta).filter(([k]) => k.startsWith('_'));
  if (entries.length === 0 && fallbacks.length === 0) return null;
  const row = { display: 'flex', padding: '8px 0', borderBottom: '1px solid #1a1a1a', gap: '12px', fontSize: '0.85rem' };
  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Detected Meta Tags ({entries.length + fallbacks.length})</h3>
      <div style={{ ...card, padding: '16px' }}>
        {entries.map(([k, v]) => (
          <div key={k} style={row}>
            <code style={{ color: '#8b5cf6', minWidth: '180px', flexShrink: 0, wordBreak: 'break-all' }}>{k}</code>
            <span style={{ color: '#ccc', wordBreak: 'break-all' }}>{v}</span>
          </div>
        ))}
        {fallbacks.length > 0 && (
          <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#666' }}>
            <strong>Fallbacks:</strong>
            {fallbacks.map(([k, v]) => (
              <div key={k} style={row}>
                <code style={{ color: '#666', minWidth: '180px', flexShrink: 0 }}>{k.replace('_', '')}</code>
                <span style={{ color: '#999', wordBreak: 'break-all' }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreCard({ meta }) {
  const checks = [
    { label: 'og:title', ok: !!meta['og:title'], tip: 'Add og:title for better social sharing' },
    { label: 'og:description', ok: !!meta['og:description'], tip: 'Add og:description for link previews' },
    { label: 'og:image', ok: !!meta['og:image'], tip: 'Add og:image (1200×630px recommended)' },
    { label: 'og:url', ok: !!meta['og:url'], tip: 'Add og:url with canonical URL' },
    { label: 'og:type', ok: !!meta['og:type'], tip: 'Add og:type (website, article, etc.)' },
    { label: 'og:site_name', ok: !!meta['og:site_name'], tip: 'Add og:site_name for brand attribution' },
    { label: 'twitter:card', ok: !!meta['twitter:card'], tip: 'Add twitter:card (summary or summary_large_image)' },
    { label: 'twitter:title', ok: !!meta['twitter:title'], tip: 'Add twitter:title for X/Twitter cards' },
    { label: 'twitter:description', ok: !!meta['twitter:description'], tip: 'Add twitter:description for X/Twitter' },
    { label: 'twitter:image', ok: !!meta['twitter:image'] || !!meta['og:image'], tip: 'Add twitter:image or og:image' },
  ];
  const score = Math.round((checks.filter(c => c.ok).length / checks.length) * 100);
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';
  return (
    <div style={{ ...card, padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `4px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{score}%</span>
        </div>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Social Media Readiness</div>
          <div style={{ fontSize: '0.85rem', color: '#999' }}>{checks.filter(c => c.ok).length}/{checks.length} tags present</div>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '8px' }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: c.ok ? '#22c55e' : '#ef4444', fontSize: '1rem' }}>{c.ok ? '✓' : '✗'}</span>
            <code style={{ color: c.ok ? '#ccc' : '#999' }}>{c.label}</code>
            {!c.ok && <span style={{ color: '#666', fontSize: '0.8rem' }}>— {c.tip}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OgPreviewTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState(null);
  const [fetchedUrl, setFetchedUrl] = useState('');
  const [tab, setTab] = useState('previews');

  async function handleSubmit(e) {
    e.preventDefault();
    let u = url.trim();
    if (!u) return;
    if (!u.startsWith('http')) u = 'https://' + u;
    setLoading(true);
    setError('');
    setMeta(null);
    try {
      const res = await fetch(PROXY + encodeURIComponent(u));
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const html = await res.text();
      const tags = extractMetaTags(html);
      if (Object.keys(tags).length === 0) {
        setError('No meta tags found. The page may block fetching or have no OG tags.');
        return;
      }
      // Resolve relative og:image
      if (tags['og:image'] && tags['og:image'].startsWith('/')) {
        try {
          const origin = new URL(u).origin;
          tags['og:image'] = origin + tags['og:image'];
        } catch {}
      }
      setMeta(tags);
      setFetchedUrl(u);
    } catch (err) {
      setError('Could not fetch page. The site may block proxied requests. Try another URL.');
    } finally {
      setLoading(false);
    }
  }

  const input = {
    width: '100%', padding: '14px 16px', background: '#111', border: '1px solid #2a2a2a',
    borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none',
  };
  const btn = {
    padding: '14px 32px', background: '#8b5cf6', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap',
  };
  const tabBtn = (active) => ({
    padding: '8px 20px', background: active ? '#8b5cf6' : '#1a1a1a', color: active ? '#fff' : '#999',
    border: '1px solid ' + (active ? '#8b5cf6' : '#2a2a2a'), borderRadius: '8px', cursor: 'pointer',
    fontSize: '0.85rem', fontWeight: 600,
  });

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter any URL — e.g. github.com" style={{ ...input, flex: 1, minWidth: '240px' }} />
        <button type="submit" disabled={loading} style={btn}>
          {loading ? 'Fetching…' : 'Preview'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#1a0a0a', border: '1px solid #7f1d1d', borderRadius: '10px', padding: '16px', color: '#fca5a5', marginBottom: '24px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {meta && (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button onClick={() => setTab('previews')} style={tabBtn(tab === 'previews')}>Previews</button>
            <button onClick={() => setTab('score')} style={tabBtn(tab === 'score')}>Score</button>
            <button onClick={() => setTab('tags')} style={tabBtn(tab === 'tags')}>Raw Tags</button>
            <button onClick={() => setTab('code')} style={tabBtn(tab === 'code')}>Copy Code</button>
          </div>

          {tab === 'previews' && (
            <div style={{ display: 'grid', gap: '32px' }}>
              <FacebookPreview meta={meta} url={fetchedUrl} />
              <TwitterPreview meta={meta} url={fetchedUrl} />
              <DiscordPreview meta={meta} url={fetchedUrl} />
              <SlackPreview meta={meta} url={fetchedUrl} />
            </div>
          )}

          {tab === 'score' && <ScoreCard meta={meta} />}
          {tab === 'tags' && <TagsTable meta={meta} />}
          {tab === 'code' && <CodeBlock meta={meta} url={fetchedUrl} />}
        </>
      )}
    </div>
  );
}

function CodeBlock({ meta, url }) {
  const [copied, setCopied] = useState(false);
  const lines = [];
  lines.push('<!-- Open Graph -->');
  if (meta['og:title']) lines.push(`<meta property="og:title" content="${meta['og:title']}" />`);
  if (meta['og:description']) lines.push(`<meta property="og:description" content="${meta['og:description']}" />`);
  if (meta['og:image']) lines.push(`<meta property="og:image" content="${meta['og:image']}" />`);
  if (meta['og:url']) lines.push(`<meta property="og:url" content="${meta['og:url']}" />`);
  if (meta['og:type']) lines.push(`<meta property="og:type" content="${meta['og:type']}" />`);
  if (meta['og:site_name']) lines.push(`<meta property="og:site_name" content="${meta['og:site_name']}" />`);
  lines.push('');
  lines.push('<!-- Twitter Card -->');
  lines.push(`<meta name="twitter:card" content="${meta['twitter:card'] || 'summary_large_image'}" />`);
  if (meta['twitter:title'] || meta['og:title']) lines.push(`<meta name="twitter:title" content="${meta['twitter:title'] || meta['og:title']}" />`);
  if (meta['twitter:description'] || meta['og:description']) lines.push(`<meta name="twitter:description" content="${meta['twitter:description'] || meta['og:description']}" />`);
  if (meta['twitter:image'] || meta['og:image']) lines.push(`<meta name="twitter:image" content="${meta['twitter:image'] || meta['og:image']}" />`);
  const code = lines.join('\n');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recommended Meta Tags</h3>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ padding: '6px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#ccc', cursor: 'pointer', fontSize: '0.8rem' }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px', overflow: 'auto', fontSize: '0.8rem', color: '#ccc', lineHeight: 1.6 }}>
        {code}
      </pre>
    </div>
  );
}
