'use client';

import { useState, useRef } from 'react';

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  if (!d.startsWith('http://') && !d.startsWith('https://')) d = 'https://' + d;
  try {
    const u = new URL(d);
    return { url: u.origin, hostname: u.hostname };
  } catch {
    return null;
  }
}

function formatMs(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export default function WebsiteStatusChecker() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  async function checkSite(e) {
    e.preventDefault();
    const parsed = cleanDomain(input);
    if (!parsed) {
      setResults([{ hostname: input, status: 'error', message: 'Invalid URL or domain name', responseTime: null, timestamp: new Date().toISOString() }]);
      return;
    }

    setLoading(true);
    const { url, hostname } = parsed;
    const entry = { hostname, url, status: 'checking', message: 'Checking...', responseTime: null, timestamp: new Date().toISOString(), dns: null, headers: null };
    setResults(prev => [entry, ...prev.slice(0, 9)]);

    // Method 1: DNS check via dns.google
    let dnsOk = false;
    let dnsData = null;
    try {
      const dnsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`);
      const dnsJson = await dnsRes.json();
      if (dnsJson.Answer && dnsJson.Answer.length > 0) {
        dnsOk = true;
        dnsData = {
          ip: dnsJson.Answer.filter(a => a.type === 1).map(a => a.data),
          ttl: dnsJson.Answer[0]?.TTL,
        };
      } else if (dnsJson.Status === 3) {
        // NXDOMAIN
        dnsData = { error: 'Domain does not exist (NXDOMAIN)' };
      } else {
        dnsData = { error: 'No A records found' };
      }
    } catch {
      dnsData = { error: 'DNS lookup failed' };
    }

    // Method 2: HTTP reachability via no-cors fetch + timing
    let httpStatus = 'unknown';
    let responseTime = null;
    let httpError = null;

    const start = performance.now();
    try {
      abortRef.current = new AbortController();
      const timeout = setTimeout(() => abortRef.current?.abort(), 15000);
      const res = await fetch(url, {
        mode: 'no-cors',
        signal: abortRef.current.signal,
        cache: 'no-store',
      });
      clearTimeout(timeout);
      responseTime = performance.now() - start;
      // no-cors returns opaque response (status 0) on success
      httpStatus = 'reachable';
    } catch (err) {
      responseTime = performance.now() - start;
      if (err.name === 'AbortError') {
        httpStatus = 'timeout';
        httpError = 'Request timed out after 15 seconds';
      } else {
        httpStatus = 'unreachable';
        httpError = err.message || 'Connection failed';
      }
    }

    // Method 3: Try HTTPS head via cors-friendly check (favicon)
    let faviconOk = false;
    try {
      await new Promise((resolve, reject) => {
        const img = new Image();
        const t = setTimeout(() => { img.src = ''; reject(); }, 8000);
        img.onload = () => { clearTimeout(t); resolve(); };
        img.onerror = () => { clearTimeout(t); reject(); };
        img.src = `${url}/favicon.ico?_t=${Date.now()}`;
      });
      faviconOk = true;
    } catch {
      // Favicon not found or blocked — not conclusive
    }

    // Determine overall status
    let status, message, statusColor;
    if (dnsData?.error === 'Domain does not exist (NXDOMAIN)') {
      status = 'down';
      message = 'Domain does not exist — DNS returns NXDOMAIN';
      statusColor = '#ef4444';
    } else if (httpStatus === 'reachable') {
      status = 'up';
      message = 'Website is reachable';
      statusColor = '#22c55e';
    } else if (httpStatus === 'timeout') {
      status = 'slow';
      message = 'Website timed out — server may be overloaded';
      statusColor = '#f59e0b';
    } else if (dnsOk && httpStatus === 'unreachable') {
      status = 'down';
      message = 'DNS resolves but website is not responding';
      statusColor = '#ef4444';
    } else {
      status = 'down';
      message = httpError || 'Website appears to be down';
      statusColor = '#ef4444';
    }

    const updatedEntry = {
      hostname,
      url,
      status,
      message,
      statusColor,
      responseTime,
      timestamp: new Date().toISOString(),
      dns: dnsData,
      faviconOk,
    };

    setResults(prev => [updatedEntry, ...prev.filter(r => r !== entry).slice(0, 9)]);
    setLoading(false);
  }

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={checkSite} style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
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
          {loading ? 'Checking…' : 'Check Status'}
        </button>
      </form>

      {results.map((r, i) => (
        <div key={`${r.hostname}-${r.timestamp}-${i}`} style={{
          background: '#111', border: `1px solid ${r.statusColor || '#2a2a2a'}40`,
          borderRadius: '12px', padding: '24px', marginBottom: '16px',
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '14px', height: '14px', borderRadius: '50%',
                background: r.statusColor || '#666',
                boxShadow: r.status === 'up' ? '0 0 8px #22c55e80' : 'none',
                animation: r.status === 'checking' ? 'pulse 1.5s infinite' : 'none',
              }} />
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{r.hostname}</span>
                <span style={{
                  marginLeft: '12px', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                  background: `${r.statusColor || '#666'}20`, color: r.statusColor || '#666',
                  border: `1px solid ${r.statusColor || '#666'}40`,
                  textTransform: 'uppercase',
                }}>
                  {r.status === 'up' ? '● Online' : r.status === 'down' ? '● Offline' : r.status === 'slow' ? '● Slow' : r.status === 'checking' ? '● Checking' : '● Error'}
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>
              {new Date(r.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Message */}
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: '0 0 16px' }}>{r.message}</p>

          {/* Details grid */}
          {r.status !== 'checking' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {r.responseTime != null && (
                <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Response Time</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: r.responseTime < 500 ? '#22c55e' : r.responseTime < 2000 ? '#f59e0b' : '#ef4444' }}>
                    {formatMs(r.responseTime)}
                  </div>
                </div>
              )}

              {r.dns && !r.dns.error && r.dns.ip?.length > 0 && (
                <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IP Address</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', fontFamily: 'ui-monospace, monospace' }}>
                    {r.dns.ip.slice(0, 2).join(', ')}
                  </div>
                </div>
              )}

              {r.dns?.ttl != null && (
                <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DNS TTL</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{r.dns.ttl}s</div>
                </div>
              )}

              <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Protocol</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                  {r.url?.startsWith('https') ? '🔒 HTTPS' : '⚠️ HTTP'}
                </div>
              </div>

              {r.dns?.error && (
                <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '14px', gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DNS Status</div>
                  <div style={{ fontSize: '0.9rem', color: '#ef4444' }}>{r.dns.error}</div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
