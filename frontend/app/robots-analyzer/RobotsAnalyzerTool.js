'use client';

import { useState } from 'react';

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

function parseRobotsTxt(text) {
  const lines = text.split('\n');
  const groups = [];
  let current = null;
  const sitemaps = [];
  const crawlDelays = [];
  const errors = [];
  let lineNum = 0;

  for (const raw of lines) {
    lineNum++;
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) {
      errors.push({ line: lineNum, text: raw.trim(), reason: 'Missing colon — not a valid directive' });
      continue;
    }

    const directive = line.substring(0, colonIdx).trim().toLowerCase();
    const value = line.substring(colonIdx + 1).trim();

    if (directive === 'user-agent') {
      if (current && (current.rules.length > 0 || current.agents.length > 1)) {
        groups.push(current);
        current = { agents: [value], rules: [] };
      } else if (current) {
        current.agents.push(value);
      } else {
        current = { agents: [value], rules: [] };
      }
    } else if (directive === 'allow' || directive === 'disallow') {
      if (!current) {
        current = { agents: ['*'], rules: [] };
      }
      current.rules.push({ type: directive, path: value });
    } else if (directive === 'sitemap') {
      sitemaps.push(value);
    } else if (directive === 'crawl-delay') {
      const delay = parseFloat(value);
      if (!isNaN(delay)) {
        crawlDelays.push({ agent: current ? current.agents[current.agents.length - 1] : '*', delay });
      }
    } else {
      // Unknown directive — not necessarily an error, just note it
    }
  }
  if (current) groups.push(current);

  return { groups, sitemaps, crawlDelays, errors, totalLines: lines.length };
}

function getStats(parsed) {
  const stats = {
    totalGroups: parsed.groups.length,
    totalRules: parsed.groups.reduce((s, g) => s + g.rules.length, 0),
    allowRules: parsed.groups.reduce((s, g) => s + g.rules.filter(r => r.type === 'allow').length, 0),
    disallowRules: parsed.groups.reduce((s, g) => s + g.rules.filter(r => r.type === 'disallow').length, 0),
    sitemapCount: parsed.sitemaps.length,
    agents: [...new Set(parsed.groups.flatMap(g => g.agents))],
    blocksAll: false,
    allowsAll: false,
    emptyDisallows: 0,
    wildcardRules: 0,
  };

  for (const g of parsed.groups) {
    for (const r of g.rules) {
      if (r.type === 'disallow' && r.path === '/') {
        if (g.agents.includes('*')) stats.blocksAll = true;
      }
      if (r.type === 'disallow' && r.path === '') {
        stats.emptyDisallows++;
      }
      if (r.path.includes('*') || r.path.includes('$')) {
        stats.wildcardRules++;
      }
    }
  }

  if (stats.totalRules === 0 || (stats.disallowRules === 0 && stats.emptyDisallows > 0)) {
    stats.allowsAll = true;
  }

  return stats;
}

function getInsights(parsed, stats) {
  const insights = [];

  if (stats.blocksAll) {
    insights.push({ type: 'warning', icon: '🚫', text: 'This site blocks ALL crawlers with "Disallow: /". Search engines cannot index this site.' });
  }
  if (stats.allowsAll && !stats.blocksAll) {
    insights.push({ type: 'success', icon: '✅', text: 'This site allows all crawlers — no restrictive rules found.' });
  }
  if (stats.sitemapCount === 0) {
    insights.push({ type: 'info', icon: '📋', text: 'No sitemap declared in robots.txt. Consider adding a Sitemap directive to help search engines discover your pages.' });
  } else {
    insights.push({ type: 'success', icon: '🗺️', text: `${stats.sitemapCount} sitemap${stats.sitemapCount > 1 ? 's' : ''} declared — good for discoverability.` });
  }
  if (parsed.crawlDelays.length > 0) {
    insights.push({ type: 'info', icon: '⏱️', text: `Crawl-delay directive found. Note: Google ignores crawl-delay; use Google Search Console instead.` });
  }
  if (stats.wildcardRules > 0) {
    insights.push({ type: 'info', icon: '🃏', text: `${stats.wildcardRules} rule${stats.wildcardRules > 1 ? 's' : ''} use wildcards (* or $). Only Google and Bing fully support wildcard patterns.` });
  }
  if (parsed.errors.length > 0) {
    insights.push({ type: 'warning', icon: '⚠️', text: `${parsed.errors.length} syntax error${parsed.errors.length > 1 ? 's' : ''} found in the file.` });
  }
  if (stats.agents.includes('Googlebot') || stats.agents.includes('googlebot')) {
    insights.push({ type: 'info', icon: '🔍', text: 'Specific rules for Googlebot detected. Google will follow these instead of the wildcard (*) rules.' });
  }
  if (stats.agents.includes('GPTBot') || stats.agents.includes('gptbot')) {
    insights.push({ type: 'info', icon: '🤖', text: 'AI bot (GPTBot) rules detected. This site manages AI crawler access.' });
  }
  if (stats.agents.includes('CCBot') || stats.agents.includes('ccbot')) {
    insights.push({ type: 'info', icon: '🤖', text: 'CCBot rules detected — this affects Common Crawl and some AI training data access.' });
  }

  return insights;
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: '#1a1a2e',
  border: '1px solid #333',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '1rem',
};

const buttonStyle = {
  padding: '14px 32px',
  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
};

const cardStyle = {
  background: '#1a1a2e',
  borderRadius: '12px',
  border: '1px solid #2a2a4a',
  padding: '20px',
  marginBottom: '16px',
};

export default function RobotsAnalyzerTool() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [showRaw, setShowRaw] = useState(false);
  const [tab, setTab] = useState('overview');

  async function analyze() {
    const d = cleanDomain(domain);
    if (!d) { setError('Please enter a domain'); return; }
    setLoading(true);
    setError('');
    setRawText('');
    setParsed(null);
    setStats(null);
    setInsights([]);

    try {
      // Try fetching robots.txt via multiple CORS proxies
      const urls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://${d}/robots.txt`)}`,
        `https://api.codetabs.com/v1/proxy?quest=https://${d}/robots.txt`,
      ];

      let text = null;
      for (const url of urls) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
          if (res.ok) {
            const t = await res.text();
            // Basic check — robots.txt should contain text directives, not HTML
            if (t && !t.trim().startsWith('<!DOCTYPE') && !t.trim().startsWith('<html')) {
              text = t;
              break;
            }
          }
        } catch { /* try next */ }
      }

      if (!text) {
        setError(`Could not fetch robots.txt for ${d}. The site may not have one, or CORS restrictions prevented access.`);
        setLoading(false);
        return;
      }

      setRawText(text);
      const p = parseRobotsTxt(text);
      setParsed(p);
      const s = getStats(p);
      setStats(s);
      setInsights(getInsights(p, s));
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="Enter domain (e.g., google.com)"
          style={{ ...inputStyle, flex: 1, minWidth: '250px' }}
        />
        <button onClick={analyze} disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Analyzing…' : 'Analyze Robots.txt'}
        </button>
      </div>

      {error && (
        <div style={{ ...cardStyle, borderColor: '#ef4444', color: '#f87171', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {parsed && stats && (
        <>
          {/* Insights */}
          <div style={{ marginBottom: '24px' }}>
            {insights.map((ins, i) => (
              <div key={i} style={{
                ...cardStyle,
                borderColor: ins.type === 'warning' ? '#f59e0b' : ins.type === 'success' ? '#22c55e' : '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                marginBottom: '8px',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{ins.icon}</span>
                <span style={{ color: '#e2e8f0' }}>{ins.text}</span>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'User-Agents', value: stats.agents.length, icon: '🤖' },
              { label: 'Total Rules', value: stats.totalRules, icon: '📏' },
              { label: 'Allow', value: stats.allowRules, icon: '✅' },
              { label: 'Disallow', value: stats.disallowRules, icon: '🚫' },
              { label: 'Sitemaps', value: stats.sitemapCount, icon: '🗺️' },
              { label: 'Lines', value: parsed.totalLines, icon: '📄' },
            ].map((s, i) => (
              <div key={i} style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>{s.value}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {['overview', 'rules', 'sitemaps', 'raw'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: tab === t ? '#8b5cf6' : '#333',
                  background: tab === t ? '#8b5cf622' : 'transparent',
                  color: tab === t ? '#8b5cf6' : '#9ca3af',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {t === 'raw' ? 'Raw File' : t}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {tab === 'overview' && (
            <div>
              {parsed.groups.map((group, gi) => (
                <div key={gi} style={{ ...cardStyle }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {group.agents.map((a, ai) => (
                      <span key={ai} style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        background: a === '*' ? '#8b5cf622' : '#1e3a5f',
                        color: a === '*' ? '#8b5cf6' : '#60a5fa',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        fontFamily: 'monospace',
                      }}>
                        {a === '*' ? 'All bots (*)' : a}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', color: '#9ca3af', fontSize: '0.85rem' }}>
                    <span>✅ {group.rules.filter(r => r.type === 'allow').length} allow</span>
                    <span>•</span>
                    <span>🚫 {group.rules.filter(r => r.type === 'disallow').length} disallow</span>
                  </div>
                </div>
              ))}
              {parsed.groups.length === 0 && (
                <div style={cardStyle}>
                  <p style={{ color: '#9ca3af' }}>No user-agent groups found. This robots.txt may be empty or only contain sitemaps.</p>
                </div>
              )}
            </div>
          )}

          {/* Rules Tab */}
          {tab === 'rules' && (
            <div>
              {parsed.groups.map((group, gi) => (
                <div key={gi} style={{ ...cardStyle }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px', color: '#e2e8f0' }}>
                    🤖 {group.agents.join(', ')}
                  </h3>
                  {group.rules.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No rules — all paths allowed</p>
                  ) : (
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {group.rules.map((r, ri) => (
                        <div key={ri} style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '6px 0',
                          borderBottom: ri < group.rules.length - 1 ? '1px solid #2a2a4a' : 'none',
                        }}>
                          <span style={{
                            color: r.type === 'allow' ? '#22c55e' : '#ef4444',
                            fontWeight: 600,
                            minWidth: '80px',
                          }}>
                            {r.type === 'allow' ? '✅ Allow' : '🚫 Disallow'}
                          </span>
                          <span style={{ color: '#e2e8f0', wordBreak: 'break-all' }}>
                            {r.path || '(empty — allows all)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {parsed.errors.length > 0 && (
                <div style={{ ...cardStyle, borderColor: '#f59e0b' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px', color: '#f59e0b' }}>⚠️ Syntax Errors</h3>
                  {parsed.errors.map((e, i) => (
                    <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #2a2a4a', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      <span style={{ color: '#9ca3af' }}>Line {e.line}:</span>{' '}
                      <span style={{ color: '#f87171' }}>{e.text}</span>
                      <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{e.reason}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sitemaps Tab */}
          {tab === 'sitemaps' && (
            <div style={cardStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: '12px', color: '#e2e8f0' }}>🗺️ Declared Sitemaps</h3>
              {parsed.sitemaps.length === 0 ? (
                <p style={{ color: '#9ca3af' }}>No sitemaps declared in robots.txt. Consider adding:<br />
                  <code style={{ color: '#8b5cf6' }}>Sitemap: https://yourdomain.com/sitemap.xml</code>
                </p>
              ) : (
                parsed.sitemaps.map((s, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: i < parsed.sitemaps.length - 1 ? '1px solid #2a2a4a' : 'none' }}>
                    <a href={s} target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6', wordBreak: 'break-all', textDecoration: 'none' }}>
                      {s}
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Raw Tab */}
          {tab === 'raw' && (
            <div style={cardStyle}>
              <pre style={{
                background: '#0f0f1a',
                padding: '16px',
                borderRadius: '8px',
                overflow: 'auto',
                maxHeight: '500px',
                color: '#e2e8f0',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
                {rawText}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
