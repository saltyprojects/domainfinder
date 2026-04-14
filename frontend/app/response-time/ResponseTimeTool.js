'use client';

import { useState, useCallback } from 'react';

function cleanUrl(input) {
  let u = input.trim();
  if (!u.startsWith('http://') && !u.startsWith('https://')) u = 'https://' + u;
  try {
    const url = new URL(u);
    return url.origin;
  } catch {
    return null;
  }
}

function extractDomain(url) {
  try { return new URL(url).hostname; } catch { return url; }
}

function formatMs(ms) {
  if (ms < 1) return '<1 ms';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function ratingFromMs(ms) {
  if (ms < 200) return { label: 'Excellent', color: '#22c55e', emoji: '🟢' };
  if (ms < 500) return { label: 'Good', color: '#84cc16', emoji: '🟡' };
  if (ms < 1000) return { label: 'Fair', color: '#f59e0b', emoji: '🟠' };
  if (ms < 3000) return { label: 'Slow', color: '#ef4444', emoji: '🔴' };
  return { label: 'Very Slow', color: '#dc2626', emoji: '🔴' };
}

function gradeFromAvg(ms) {
  if (ms < 200) return 'A';
  if (ms < 500) return 'B';
  if (ms < 1000) return 'C';
  if (ms < 3000) return 'D';
  return 'F';
}

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '16px',
};

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '1rem',
  padding: '14px 16px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const btnStyle = {
  background: '#8b5cf6',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '14px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  whiteSpace: 'nowrap',
};

async function measureDnsTime(domain) {
  const start = performance.now();
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
      headers: { Accept: 'application/dns-json' },
    });
    const data = await res.json();
    const elapsed = performance.now() - start;
    const ips = (data.Answer || []).filter(r => r.type === 1).map(r => r.data);
    return { time: elapsed, ips, success: true };
  } catch (err) {
    return { time: performance.now() - start, ips: [], success: false, error: err.message };
  }
}

async function measureHttpTime(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  const start = performance.now();
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
      cache: 'no-store',
    });
    const elapsed = performance.now() - start;
    clearTimeout(timeout);
    return {
      time: elapsed,
      status: res.type === 'opaque' ? 'Reachable (opaque)' : `${res.status}`,
      success: true,
      type: res.type,
    };
  } catch (err) {
    clearTimeout(timeout);
    const elapsed = performance.now() - start;
    if (err.name === 'AbortError') {
      return { time: elapsed, status: 'Timeout', success: false, error: 'Request timed out (15s)' };
    }
    return { time: elapsed, status: 'Error', success: false, error: err.message };
  }
}

export default function ResponseTimeTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const [pingCount, setPingCount] = useState(3);

  const runTest = useCallback(async () => {
    const cleanedUrl = cleanUrl(url);
    if (!cleanedUrl) {
      setError('Please enter a valid URL or domain name.');
      return;
    }
    const domain = extractDomain(cleanedUrl);
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Step 1: DNS Resolution
      setProgress('Resolving DNS…');
      const dns = await measureDnsTime(domain);

      // Step 2: Multiple HTTP pings
      const pings = [];
      for (let i = 0; i < pingCount; i++) {
        setProgress(`Testing connection ${i + 1} of ${pingCount}…`);
        const result = await measureHttpTime(cleanedUrl);
        pings.push(result);
        // Small delay between pings
        if (i < pingCount - 1) await new Promise(r => setTimeout(r, 300));
      }

      const successPings = pings.filter(p => p.success);
      const times = successPings.map(p => p.time);

      const avg = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : null;
      const min = times.length > 0 ? Math.min(...times) : null;
      const max = times.length > 0 ? Math.max(...times) : null;
      const jitter = times.length > 1 ? max - min : 0;

      // Calculate percentile (P95 approximation for small samples)
      const sorted = [...times].sort((a, b) => a - b);
      const p95 = sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.95)] : null;

      const grade = avg !== null ? gradeFromAvg(avg) : 'F';
      const rating = avg !== null ? ratingFromMs(avg) : ratingFromMs(99999);

      setResults({
        url: cleanedUrl,
        domain,
        dns,
        pings,
        stats: { avg, min, max, jitter, p95, successCount: successPings.length, totalCount: pings.length },
        grade,
        rating,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress('');
    }
  }, [url, pingCount]);

  const gradeColor = results?.grade === 'A' ? '#22c55e' : results?.grade === 'B' ? '#84cc16' : results?.grade === 'C' ? '#f59e0b' : results?.grade === 'D' ? '#ef4444' : '#dc2626';

  return (
    <div>
      {/* Input */}
      <div style={{ ...cardStyle, display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Enter URL or domain (e.g. google.com)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runTest()}
            style={inputStyle}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ color: '#9ca3af', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Pings:</label>
          <select
            value={pingCount}
            onChange={e => setPingCount(parseInt(e.target.value))}
            style={{
              ...inputStyle,
              width: 'auto',
              padding: '14px 12px',
              cursor: 'pointer',
              appearance: 'auto',
            }}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
        <button onClick={runTest} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Testing…' : 'Test Response Time'}
        </button>
      </div>

      {/* Progress */}
      {loading && progress && (
        <div style={{ ...cardStyle, borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.05)', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{
              width: '20px', height: '20px', border: '3px solid rgba(139,92,246,0.3)',
              borderTopColor: '#8b5cf6', borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ color: '#a78bfa' }}>{progress}</span>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ ...cardStyle, borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
          <p style={{ color: '#f87171', margin: 0 }}>❌ {error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Overall Grade */}
          <div style={{ ...cardStyle, borderColor: gradeColor, background: `${gradeColor}08` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '16px',
                background: `${gradeColor}20`, border: `2px solid ${gradeColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 800, color: gradeColor,
              }}>
                {results.grade}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                  {results.rating.emoji} {results.rating.label} — {results.domain}
                </h3>
                <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                  Average response: {results.stats.avg !== null ? formatMs(results.stats.avg) : 'N/A'} · {results.stats.successCount}/{results.stats.totalCount} successful pings
                </p>
                <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.8rem' }}>
                  Tested at {new Date(results.timestamp).toLocaleString()} from your browser
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Average', value: results.stats.avg, icon: '📊' },
              { label: 'Fastest', value: results.stats.min, icon: '⚡' },
              { label: 'Slowest', value: results.stats.max, icon: '🐢' },
              { label: 'Jitter', value: results.stats.jitter, icon: '📉' },
              { label: 'P95', value: results.stats.p95, icon: '📈' },
              { label: 'DNS Lookup', value: results.dns.time, icon: '🔍' },
            ].map((stat, i) => {
              const r = stat.value !== null ? ratingFromMs(stat.value) : null;
              return (
                <div key={i} style={{
                  ...cardStyle, textAlign: 'center', padding: '16px',
                  marginBottom: 0,
                }}>
                  <span style={{ fontSize: '1.3rem' }}>{stat.icon}</span>
                  <p style={{
                    fontSize: '1.4rem', fontWeight: 700, margin: '8px 0 4px',
                    color: r ? r.color : '#6b7280',
                    fontFamily: 'ui-monospace, monospace',
                  }}>
                    {stat.value !== null ? formatMs(stat.value) : 'N/A'}
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* DNS Resolution */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', marginTop: '32px' }}>
            🔍 DNS Resolution
          </h3>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>{results.dns.success ? '✅' : '❌'}</span>
              <span style={{ fontWeight: 600 }}>
                {results.dns.success ? `Resolved in ${formatMs(results.dns.time)}` : 'DNS resolution failed'}
              </span>
            </div>
            {results.dns.ips.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {results.dns.ips.map((ip, i) => (
                  <span key={i} style={{
                    background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem',
                    fontFamily: 'ui-monospace, monospace',
                  }}>{ip}</span>
                ))}
              </div>
            )}
            {results.dns.error && (
              <p style={{ color: '#f87171', fontSize: '0.85rem', margin: '8px 0 0' }}>{results.dns.error}</p>
            )}
          </div>

          {/* Individual Pings */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', marginTop: '32px' }}>
            📡 Individual Pings
          </h3>
          {results.pings.map((ping, i) => {
            const r = ratingFromMs(ping.time);
            const barWidth = results.stats.max > 0 ? (ping.time / results.stats.max) * 100 : 0;
            return (
              <div key={i} style={{
                ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px',
                padding: '14px 20px',
              }}>
                <span style={{ color: '#6b7280', fontWeight: 600, minWidth: '28px', fontSize: '0.85rem' }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: '4px',
                    height: '8px', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '4px',
                      background: ping.success ? r.color : '#ef4444',
                      width: `${barWidth}%`,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
                <span style={{
                  fontFamily: 'ui-monospace, monospace', fontWeight: 600,
                  color: ping.success ? r.color : '#ef4444',
                  minWidth: '80px', textAlign: 'right', fontSize: '0.9rem',
                }}>
                  {formatMs(ping.time)}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', minWidth: '80px' }}>
                  {ping.status}
                </span>
              </div>
            );
          })}

          {/* Recommendations */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', marginTop: '32px' }}>
            💡 Analysis &amp; Tips
          </h3>
          <div style={cardStyle}>
            <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
              {results.stats.avg !== null && results.stats.avg < 200 && (
                <li>✅ <strong>Excellent response time!</strong> This website responds very quickly from your location.</li>
              )}
              {results.stats.avg !== null && results.stats.avg >= 200 && results.stats.avg < 500 && (
                <li>👍 <strong>Good response time.</strong> Performance is within acceptable range for most users.</li>
              )}
              {results.stats.avg !== null && results.stats.avg >= 500 && results.stats.avg < 1000 && (
                <li>⚠️ <strong>Fair response time.</strong> Users may notice some delay. Consider a CDN or server closer to your visitors.</li>
              )}
              {results.stats.avg !== null && results.stats.avg >= 1000 && (
                <li>🔴 <strong>Slow response time.</strong> This could hurt user experience and SEO rankings. Consider optimizing server performance, using a CDN, or checking for server-side bottlenecks.</li>
              )}
              {results.stats.jitter > 200 && (
                <li>📉 <strong>High jitter detected ({formatMs(results.stats.jitter)}).</strong> Response times vary significantly between requests, which may indicate server load fluctuations or network instability.</li>
              )}
              {results.stats.jitter <= 50 && results.stats.jitter > 0 && (
                <li>✅ <strong>Low jitter ({formatMs(results.stats.jitter)}).</strong> Response times are very consistent, indicating stable server performance.</li>
              )}
              {results.dns.time > 200 && (
                <li>⚠️ <strong>Slow DNS resolution ({formatMs(results.dns.time)}).</strong> Consider using a faster DNS provider or enabling DNS prefetching.</li>
              )}
              {results.dns.time <= 100 && results.dns.success && (
                <li>✅ <strong>Fast DNS resolution ({formatMs(results.dns.time)}).</strong> Domain resolves quickly.</li>
              )}
              <li>💡 <strong>Note:</strong> These measurements are from your browser to the target server. Results vary by location, network conditions, and time of day. Browser security restrictions (CORS) mean we measure the full round-trip including TLS negotiation.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
