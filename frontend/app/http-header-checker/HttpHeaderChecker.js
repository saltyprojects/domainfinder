'use client';

import { useState, useRef } from 'react';

function cleanUrl(input) {
  let d = input.trim().toLowerCase();
  if (!d.startsWith('http://') && !d.startsWith('https://')) d = 'https://' + d;
  try {
    const u = new URL(d);
    return { url: u.href, hostname: u.hostname };
  } catch {
    return null;
  }
}

const SECURITY_HEADERS = [
  { name: 'Strict-Transport-Security', key: 'strict-transport-security', desc: 'Enforces HTTPS connections, preventing downgrade attacks and cookie hijacking.', severity: 'high' },
  { name: 'Content-Security-Policy', key: 'content-security-policy', desc: 'Controls which resources the browser can load, mitigating XSS and data injection attacks.', severity: 'high' },
  { name: 'X-Content-Type-Options', key: 'x-content-type-options', desc: 'Prevents browsers from MIME-type sniffing, reducing exposure to drive-by download attacks.', severity: 'medium' },
  { name: 'X-Frame-Options', key: 'x-frame-options', desc: 'Prevents the page from being loaded in iframes, protecting against clickjacking attacks.', severity: 'medium' },
  { name: 'X-XSS-Protection', key: 'x-xss-protection', desc: 'Legacy XSS filter for older browsers. Modern CSP is preferred but this provides defense-in-depth.', severity: 'low' },
  { name: 'Referrer-Policy', key: 'referrer-policy', desc: 'Controls how much referrer info is sent with requests, protecting user privacy.', severity: 'medium' },
  { name: 'Permissions-Policy', key: 'permissions-policy', desc: 'Controls which browser features (camera, mic, geolocation) the page can use.', severity: 'medium' },
  { name: 'Cross-Origin-Opener-Policy', key: 'cross-origin-opener-policy', desc: 'Isolates the browsing context, protecting against Spectre-like cross-origin attacks.', severity: 'low' },
  { name: 'Cross-Origin-Resource-Policy', key: 'cross-origin-resource-policy', desc: 'Controls which origins can embed this resource, preventing unauthorized use.', severity: 'low' },
];

const HEADER_CATEGORIES = {
  security: ['strict-transport-security', 'content-security-policy', 'x-content-type-options', 'x-frame-options', 'x-xss-protection', 'referrer-policy', 'permissions-policy', 'cross-origin-opener-policy', 'cross-origin-resource-policy', 'cross-origin-embedder-policy'],
  caching: ['cache-control', 'expires', 'etag', 'last-modified', 'age', 'vary'],
  server: ['server', 'x-powered-by', 'via', 'x-served-by', 'x-cache'],
  content: ['content-type', 'content-length', 'content-encoding', 'content-language', 'content-disposition'],
  cors: ['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers', 'access-control-max-age', 'access-control-expose-headers'],
};

function categorizeHeader(name) {
  const lower = name.toLowerCase();
  for (const [cat, keys] of Object.entries(HEADER_CATEGORIES)) {
    if (keys.includes(lower)) return cat;
  }
  return 'other';
}

const CATEGORY_COLORS = {
  security: '#8b5cf6',
  caching: '#f59e0b',
  server: '#3b82f6',
  content: '#22c55e',
  cors: '#ec4899',
  other: '#6b7280',
};

const CATEGORY_LABELS = {
  security: 'Security',
  caching: 'Caching',
  server: 'Server',
  content: 'Content',
  cors: 'CORS',
  other: 'Other',
};

export default function HttpHeaderChecker() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const abortRef = useRef(null);

  async function checkHeaders(e) {
    e.preventDefault();
    const parsed = cleanUrl(input);
    if (!parsed) {
      setResult({ error: 'Invalid URL or domain name. Try something like example.com' });
      return;
    }

    setLoading(true);
    setResult(null);

    const { url, hostname } = parsed;
    const headers = new Map();
    let fetchMethod = null;
    let statusCode = null;
    let statusText = null;
    let responseTime = null;
    let corsBlocked = false;

    // Try regular fetch first (works for CORS-enabled sites)
    const start = performance.now();
    try {
      abortRef.current = new AbortController();
      const timeout = setTimeout(() => abortRef.current?.abort(), 12000);
      const res = await fetch(url, {
        method: 'HEAD',
        signal: abortRef.current.signal,
        cache: 'no-store',
        redirect: 'follow',
      });
      clearTimeout(timeout);
      responseTime = performance.now() - start;
      statusCode = res.status;
      statusText = res.statusText;
      fetchMethod = 'HEAD';

      res.headers.forEach((value, key) => {
        headers.set(key.toLowerCase(), value);
      });
    } catch {
      // HEAD failed, try GET
      try {
        abortRef.current = new AbortController();
        const timeout = setTimeout(() => abortRef.current?.abort(), 12000);
        const res = await fetch(url, {
          signal: abortRef.current.signal,
          cache: 'no-store',
          redirect: 'follow',
        });
        clearTimeout(timeout);
        responseTime = performance.now() - start;
        statusCode = res.status;
        statusText = res.statusText;
        fetchMethod = 'GET';

        res.headers.forEach((value, key) => {
          headers.set(key.toLowerCase(), value);
        });
      } catch {
        corsBlocked = true;
        responseTime = performance.now() - start;
      }
    }

    // DNS lookup via dns.google for additional info
    let dnsData = null;
    try {
      const dnsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`);
      const dnsJson = await dnsRes.json();
      if (dnsJson.Answer && dnsJson.Answer.length > 0) {
        dnsData = {
          ip: dnsJson.Answer.filter(a => a.type === 1).map(a => a.data),
          ttl: dnsJson.Answer[0]?.TTL,
        };
      }
    } catch {}

    // Build header list
    const headerList = [];
    headers.forEach((value, key) => {
      headerList.push({ name: key, value, category: categorizeHeader(key) });
    });
    headerList.sort((a, b) => a.name.localeCompare(b.name));

    // Security audit
    const securityAudit = SECURITY_HEADERS.map(sh => ({
      ...sh,
      present: headers.has(sh.key),
      value: headers.get(sh.key) || null,
    }));
    const secScore = Math.round((securityAudit.filter(s => s.present).length / securityAudit.length) * 100);

    setResult({
      url,
      hostname,
      headers: headerList,
      headerCount: headerList.length,
      statusCode,
      statusText,
      fetchMethod,
      responseTime,
      corsBlocked,
      dns: dnsData,
      securityAudit,
      securityScore: secScore,
    });

    setLoading(false);
  }

  const filteredHeaders = result?.headers?.filter(h => activeTab === 'all' || h.category === activeTab) || [];

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={checkHeaders} style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter domain or URL (e.g. google.com)"
          style={{
            flex: 1, minWidth: '260px', padding: '14px 16px', fontSize: '1rem',
            background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px',
            color: '#fff', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#8b5cf6'}
          onBlur={e => e.target.style.borderColor = '#2a2a2a'}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '14px 28px', fontSize: '1rem', fontWeight: 600,
            background: loading ? '#555' : '#8b5cf6', color: '#fff',
            border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Checking…' : 'Check Headers'}
        </button>
      </form>

      {result?.error && (
        <div style={{ background: '#111', border: '1px solid #ef444440', borderRadius: '12px', padding: '20px', color: '#ef4444' }}>
          {result.error}
        </div>
      )}

      {result && !result.error && (
        <>
          {/* Summary bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px',
            marginBottom: '24px',
          }}>
            <div style={{ background: '#111', borderRadius: '10px', padding: '16px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Status</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: result.corsBlocked ? '#f59e0b' : result.statusCode < 400 ? '#22c55e' : '#ef4444' }}>
                {result.corsBlocked ? 'CORS Blocked' : `${result.statusCode} ${result.statusText}`}
              </div>
            </div>
            <div style={{ background: '#111', borderRadius: '10px', padding: '16px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Headers Found</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{result.headerCount}</div>
            </div>
            <div style={{ background: '#111', borderRadius: '10px', padding: '16px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Response Time</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: result.responseTime < 500 ? '#22c55e' : result.responseTime < 2000 ? '#f59e0b' : '#ef4444' }}>
                {result.responseTime ? `${Math.round(result.responseTime)}ms` : '—'}
              </div>
            </div>
            <div style={{ background: '#111', borderRadius: '10px', padding: '16px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Security Score</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: result.securityScore >= 70 ? '#22c55e' : result.securityScore >= 40 ? '#f59e0b' : '#ef4444' }}>
                {result.corsBlocked ? '—' : `${result.securityScore}%`}
              </div>
            </div>
          </div>

          {result.dns && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {result.dns.ip?.map((ip, i) => (
                <span key={i} style={{ padding: '4px 12px', borderRadius: '8px', background: '#1a1a2e', color: '#8b5cf6', fontSize: '0.85rem', fontFamily: 'ui-monospace, monospace', border: '1px solid #8b5cf630' }}>
                  {ip}
                </span>
              ))}
            </div>
          )}

          {result.corsBlocked && (
            <div style={{ background: '#111', border: '1px solid #f59e0b40', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b', margin: 0 }}>CORS Restricted</h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 12px' }}>
                This website blocks cross-origin requests, so HTTP headers cannot be read from the browser. 
                This is actually a good security practice. To view all headers, use the command line:
              </p>
              <code style={{ display: 'block', background: '#0a0a0a', borderRadius: '8px', padding: '12px 16px', color: '#8b5cf6', fontSize: '0.85rem', fontFamily: 'ui-monospace, monospace', overflowX: 'auto' }}>
                curl -I {result.url}
              </code>
            </div>
          )}

          {/* Headers table with category tabs */}
          {result.headerCount > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>Response Headers</h3>
              
              {/* Category tabs */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {['all', ...Object.keys(CATEGORY_LABELS)].map(tab => {
                  const count = tab === 'all' ? result.headers.length : result.headers.filter(h => h.category === tab).length;
                  if (tab !== 'all' && count === 0) return null;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                        border: `1px solid ${activeTab === tab ? '#8b5cf6' : '#2a2a2a'}`,
                        background: activeTab === tab ? '#8b5cf620' : '#111',
                        color: activeTab === tab ? '#8b5cf6' : '#999',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {tab === 'all' ? 'All' : CATEGORY_LABELS[tab]} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Headers list */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e1e1e' }}>
                {filteredHeaders.map((h, i) => (
                  <div key={h.name} style={{
                    display: 'grid', gridTemplateColumns: 'minmax(180px, 280px) 1fr',
                    borderBottom: i < filteredHeaders.length - 1 ? '1px solid #1e1e1e' : 'none',
                    background: i % 2 === 0 ? '#0a0a0a' : '#111',
                  }}>
                    <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: CATEGORY_COLORS[h.category],
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', fontFamily: 'ui-monospace, monospace' }}>
                        {h.name}
                      </span>
                    </div>
                    <div style={{
                      padding: '10px 14px', fontSize: '0.82rem', color: '#9ca3af',
                      fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all', lineHeight: 1.5,
                      borderLeft: '1px solid #1e1e1e',
                    }}>
                      {h.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Audit */}
          {!result.corsBlocked && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>
                Security Header Audit
                <span style={{
                  marginLeft: '12px', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem',
                  background: result.securityScore >= 70 ? '#22c55e20' : result.securityScore >= 40 ? '#f59e0b20' : '#ef444420',
                  color: result.securityScore >= 70 ? '#22c55e' : result.securityScore >= 40 ? '#f59e0b' : '#ef4444',
                }}>
                  {result.securityScore}% — {result.securityScore >= 70 ? 'Good' : result.securityScore >= 40 ? 'Needs Improvement' : 'Poor'}
                </span>
              </h3>
              
              <div style={{ display: 'grid', gap: '8px' }}>
                {result.securityAudit.map(sh => (
                  <div key={sh.key} style={{
                    display: 'grid', gridTemplateColumns: '28px 1fr', gap: '12px',
                    background: '#111', borderRadius: '10px', padding: '14px 16px',
                    border: `1px solid ${sh.present ? '#22c55e' : '#ef4444'}20`,
                  }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: sh.present ? '#22c55e20' : '#ef444420',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', flexShrink: 0,
                    }}>
                      {sh.present ? '✓' : '✗'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: sh.present ? '#fff' : '#999', fontFamily: 'ui-monospace, monospace' }}>
                          {sh.name}
                        </span>
                        <span style={{
                          padding: '1px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 600,
                          background: sh.severity === 'high' ? '#ef444420' : sh.severity === 'medium' ? '#f59e0b20' : '#3b82f620',
                          color: sh.severity === 'high' ? '#ef4444' : sh.severity === 'medium' ? '#f59e0b' : '#3b82f6',
                          textTransform: 'uppercase',
                        }}>
                          {sh.severity}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.5, margin: 0 }}>{sh.desc}</p>
                      {sh.present && sh.value && (
                        <div style={{
                          marginTop: '6px', padding: '6px 10px', background: '#0a0a0a', borderRadius: '6px',
                          fontSize: '0.75rem', color: '#22c55e', fontFamily: 'ui-monospace, monospace',
                          wordBreak: 'break-all', lineHeight: 1.4,
                        }}>
                          {sh.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
