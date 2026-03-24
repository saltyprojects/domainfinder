'use client';

import { useState, useRef } from 'react';

function cleanUrl(input) {
  let d = input.trim();
  if (!d.startsWith('http://') && !d.startsWith('https://')) d = 'https://' + d;
  try {
    const u = new URL(d);
    return u.href;
  } catch {
    return null;
  }
}

const STATUS_COLORS = {
  '200': '#22c55e',
  '301': '#f59e0b',
  '302': '#f59e0b',
  '303': '#f59e0b',
  '307': '#f59e0b',
  '308': '#f59e0b',
  '404': '#ef4444',
  '500': '#ef4444',
  '502': '#ef4444',
  '503': '#ef4444',
};

const STATUS_LABELS = {
  '200': 'OK',
  '201': 'Created',
  '301': 'Moved Permanently',
  '302': 'Found (Temporary)',
  '303': 'See Other',
  '307': 'Temporary Redirect',
  '308': 'Permanent Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '403': 'Forbidden',
  '404': 'Not Found',
  '500': 'Internal Server Error',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
};

function getStatusColor(code) {
  if (code >= 200 && code < 300) return '#22c55e';
  if (code >= 300 && code < 400) return '#f59e0b';
  if (code >= 400) return '#ef4444';
  return '#9ca3af';
}

function getRedirectType(code) {
  if (code === 301 || code === 308) return 'permanent';
  if (code === 302 || code === 303 || code === 307) return 'temporary';
  return null;
}

export default function UrlRedirectChecker() {
  const [url, setUrl] = useState('');
  const [chain, setChain] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  async function traceRedirects() {
    const cleaned = cleanUrl(url);
    if (!cleaned) {
      setError('Please enter a valid URL.');
      return;
    }

    setLoading(true);
    setError('');
    setChain(null);

    const hops = [];
    let currentUrl = cleaned;
    const maxRedirects = 20;
    const visited = new Set();

    try {
      for (let i = 0; i < maxRedirects; i++) {
        if (visited.has(currentUrl)) {
          hops.push({
            url: currentUrl,
            status: null,
            statusText: 'Redirect Loop Detected',
            isLoop: true,
          });
          break;
        }
        visited.add(currentUrl);

        const controller = new AbortController();
        abortRef.current = controller;

        // Use opaque redirect to capture each hop
        let response;
        try {
          response = await fetch(currentUrl, {
            method: 'HEAD',
            redirect: 'manual',
            signal: controller.signal,
            mode: 'cors',
          });
        } catch {
          // CORS blocks most cross-origin HEAD requests with redirect:manual
          // Fall back to a free redirect-following API
          try {
            const apiUrl = `https://dns.google/resolve?name=${encodeURIComponent(new URL(currentUrl).hostname)}&type=A`;
            const dnsResp = await fetch(apiUrl);
            const dnsData = await dnsResp.json();
            const resolves = dnsData.Answer && dnsData.Answer.length > 0;

            // Try using the allorigins proxy to check redirects
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(currentUrl)}`;
            const proxyResp = await fetch(proxyUrl, {
              method: 'GET',
              redirect: 'follow',
              signal: controller.signal,
            });

            const finalUrl = proxyResp.url;
            const responseUrl = proxyResp.headers.get('x-final-url') || finalUrl;

            // If the proxy changed the URL, record it
            if (i === 0) {
              hops.push({
                url: currentUrl,
                status: proxyResp.status === 200 && responseUrl !== proxyUrl ? 301 : proxyResp.status,
                statusText: proxyResp.status === 200 ? 'OK' : proxyResp.statusText,
                headers: {},
                ip: resolves ? (dnsData.Answer.find(a => a.type === 1)?.data || null) : null,
              });

              if (responseUrl !== proxyUrl && responseUrl !== currentUrl) {
                hops.push({
                  url: responseUrl,
                  status: 200,
                  statusText: 'OK (Final Destination)',
                  headers: {},
                });
              }
            }
            break;
          } catch {
            // Last resort: use fetch with follow to get final URL
            try {
              const followResp = await fetch(currentUrl, {
                method: 'GET',
                redirect: 'follow',
                signal: controller.signal,
              });

              hops.push({
                url: currentUrl,
                status: currentUrl !== followResp.url ? 301 : followResp.status,
                statusText: currentUrl !== followResp.url ? 'Redirected' : 'OK',
                headers: {},
              });

              if (followResp.url !== currentUrl) {
                hops.push({
                  url: followResp.url,
                  status: followResp.status,
                  statusText: 'OK (Final Destination)',
                  headers: {},
                });
              }
              break;
            } catch (fetchErr) {
              hops.push({
                url: currentUrl,
                status: null,
                statusText: 'Unable to reach — CORS/network block',
                isError: true,
              });
              break;
            }
          }
        }

        const status = response.status;
        const location = response.headers.get('location');
        const headers = {};
        response.headers.forEach((v, k) => { headers[k] = v; });

        hops.push({
          url: currentUrl,
          status,
          statusText: STATUS_LABELS[String(status)] || response.statusText,
          headers,
          location,
          redirectType: getRedirectType(status),
        });

        if (status >= 300 && status < 400 && location) {
          // Resolve relative redirects
          try {
            currentUrl = new URL(location, currentUrl).href;
          } catch {
            currentUrl = location;
          }
        } else {
          break;
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to trace redirects. The URL may be unreachable or blocking requests.');
      }
    }

    if (hops.length > 0) {
      setChain(hops);
    }

    setLoading(false);
  }

  const totalRedirects = chain ? chain.filter(h => h.status >= 300 && h.status < 400).length : 0;
  const hasPermanent = chain ? chain.some(h => h.redirectType === 'permanent') : false;
  const hasTemporary = chain ? chain.some(h => h.redirectType === 'temporary') : false;
  const hasLoop = chain ? chain.some(h => h.isLoop) : false;
  const finalHop = chain ? chain[chain.length - 1] : null;

  const inputStyle = {
    flex: 1,
    padding: '14px 18px',
    background: '#111',
    border: '1px solid #222',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    minWidth: 0,
  };
  const btnStyle = {
    padding: '14px 28px',
    background: '#8b5cf6',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    opacity: loading ? 0.6 : 1,
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && traceRedirects()}
          placeholder="Enter URL (e.g., http://example.com)"
          style={inputStyle}
        />
        <button onClick={traceRedirects} disabled={loading} style={btnStyle}>
          {loading ? 'Tracing…' : 'Trace Redirects'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', background: '#1c0c0c', border: '1px solid #ef4444', borderRadius: '10px', color: '#ef4444', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {chain && (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: totalRedirects === 0 ? '#22c55e' : totalRedirects > 3 ? '#ef4444' : '#f59e0b' }}>
                {totalRedirects}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>Total Redirects</div>
            </div>
            <div style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                {chain.length}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>Total Hops</div>
            </div>
            <div style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: hasLoop ? '#ef4444' : '#22c55e', marginTop: '6px' }}>
                {hasLoop ? '⚠️ Loop' : finalHop?.status >= 200 && finalHop?.status < 400 ? '✅ OK' : '❌ Error'}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>Final Status</div>
            </div>
            <div style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e', textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: hasPermanent ? '#f59e0b' : hasTemporary ? '#f59e0b' : '#22c55e', marginTop: '6px' }}>
                {hasPermanent && hasTemporary ? '301 + 302' : hasPermanent ? '301' : hasTemporary ? '302' : 'None'}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>Redirect Type</div>
            </div>
          </div>

          {/* Redirect Chain Visual */}
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Redirect Chain</h2>
          <div style={{ position: 'relative', paddingLeft: '30px' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: '11px',
              top: '12px',
              bottom: '12px',
              width: '2px',
              background: 'linear-gradient(to bottom, #8b5cf6, #6d28d9)',
              borderRadius: '2px',
            }} />

            {chain.map((hop, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: i < chain.length - 1 ? '24px' : 0 }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  top: '14px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: hop.isLoop ? '#ef4444' : hop.isError ? '#ef4444' : i === chain.length - 1 ? '#22c55e' : '#8b5cf6',
                  border: '2px solid #0a0a0a',
                  zIndex: 1,
                }} />

                <div style={{
                  background: '#111',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `1px solid ${hop.isLoop || hop.isError ? '#ef4444' : i === chain.length - 1 ? '#1a3a1a' : '#1e1e1e'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>
                      Hop {i + 1}
                    </span>
                    {hop.status && (
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: getStatusColor(hop.status) + '20',
                        color: getStatusColor(hop.status),
                      }}>
                        {hop.status} {hop.statusText}
                      </span>
                    )}
                    {hop.redirectType && (
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: hop.redirectType === 'permanent' ? '#f59e0b20' : '#3b82f620',
                        color: hop.redirectType === 'permanent' ? '#f59e0b' : '#3b82f6',
                      }}>
                        {hop.redirectType === 'permanent' ? '🔒 Permanent' : '🔄 Temporary'}
                      </span>
                    )}
                    {hop.isLoop && (
                      <span style={{ padding: '2px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: '#ef444420', color: '#ef4444' }}>
                        ⚠️ Loop Detected
                      </span>
                    )}
                    {i === chain.length - 1 && !hop.isLoop && !hop.isError && (
                      <span style={{ padding: '2px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: '#22c55e20', color: '#22c55e' }}>
                        ✅ Final Destination
                      </span>
                    )}
                  </div>

                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: '#e5e7eb',
                    wordBreak: 'break-all',
                    padding: '10px 14px',
                    background: '#0a0a0a',
                    borderRadius: '8px',
                    marginTop: '8px',
                  }}>
                    {hop.url}
                  </div>

                  {hop.location && (
                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#9ca3af' }}>
                      <span style={{ color: '#8b5cf6', fontWeight: 600 }}>Location:</span>{' '}
                      <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{hop.location}</span>
                    </div>
                  )}

                  {hop.ip && (
                    <div style={{ marginTop: '4px', fontSize: '0.8rem', color: '#9ca3af' }}>
                      <span style={{ color: '#8b5cf6', fontWeight: 600 }}>IP:</span> {hop.ip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SEO Recommendations */}
          {totalRedirects > 0 && (
            <div style={{ marginTop: '32px', background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>💡 SEO Recommendations</h3>
              <ul style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '0.95rem', paddingLeft: '20px' }}>
                {totalRedirects > 2 && (
                  <li style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#ef4444' }}>Too many redirects.</strong> More than 2 redirects in a chain can slow down page load and dilute link equity. Try to reduce to a single redirect.
                  </li>
                )}
                {hasTemporary && (
                  <li style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#f59e0b' }}>Temporary redirect detected (302/307).</strong> If this is a permanent URL change, use a 301 redirect instead. Search engines may not pass full link equity with temporary redirects.
                  </li>
                )}
                {hasPermanent && (
                  <li style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#22c55e' }}>Permanent redirect (301/308).</strong> Good — this properly signals search engines that the URL has moved permanently.
                  </li>
                )}
                {hasLoop && (
                  <li style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#ef4444' }}>Redirect loop detected!</strong> This means the URL redirects back to itself, creating an infinite loop. Search engines cannot crawl this URL and users will see an error.
                  </li>
                )}
                <li>
                  Always update internal links to point directly to the final destination URL to avoid unnecessary redirects.
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
