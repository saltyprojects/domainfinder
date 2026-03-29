'use client';

import { useState, useRef } from 'react';

const STATUS_COLORS = {
  200: '#22c55e',
  201: '#22c55e',
  301: '#f59e0b',
  302: '#f97316',
  303: '#f97316',
  307: '#f97316',
  308: '#f59e0b',
  404: '#ef4444',
  500: '#ef4444',
  503: '#ef4444',
};

function getStatusColor(code) {
  return STATUS_COLORS[code] || (code >= 200 && code < 300 ? '#22c55e' : code >= 300 && code < 400 ? '#f59e0b' : '#ef4444');
}

function getStatusLabel(code) {
  const labels = {
    200: 'OK', 201: 'Created', 301: 'Moved Permanently', 302: 'Found',
    303: 'See Other', 307: 'Temporary Redirect', 308: 'Permanent Redirect',
    404: 'Not Found', 500: 'Server Error', 503: 'Service Unavailable',
  };
  return labels[code] || `HTTP ${code}`;
}

function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function normalizeUrl(input) {
  let url = input.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  try {
    return new URL(url).href;
  } catch {
    return null;
  }
}

async function traceRedirects(url) {
  const chain = [];
  let currentUrl = url;
  const visited = new Set();
  let loopDetected = false;

  for (let i = 0; i < 15; i++) {
    if (visited.has(currentUrl)) {
      loopDetected = true;
      chain.push({ url: currentUrl, status: null, statusText: 'Redirect Loop Detected', isLoop: true });
      break;
    }
    visited.add(currentUrl);

    try {
      const res = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual',
        signal: AbortSignal.timeout(8000),
      });

      const status = res.status;
      const location = res.headers.get('location');

      chain.push({
        url: currentUrl,
        status,
        statusText: getStatusLabel(status),
        location: location || null,
        server: res.headers.get('server') || null,
        contentType: res.headers.get('content-type') || null,
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
    } catch (err) {
      // For CORS-blocked requests, try a DNS-based approach
      chain.push({
        url: currentUrl,
        status: null,
        statusText: err.name === 'TimeoutError' ? 'Timeout' : 'CORS Blocked / Unreachable',
        error: true,
      });
      break;
    }
  }

  return { chain, loopDetected };
}

function RedirectChainVisual({ result, index }) {
  const { inputUrl, chain, loopDetected, error } = result;

  if (error) {
    return (
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '0.85rem', color: '#ef4444', marginBottom: '8px' }}>❌ Error tracing: {inputUrl}</div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.75rem', background: '#1a1a2e', color: '#8b5cf6', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
          #{index + 1}
        </span>
        <span style={{ fontSize: '0.85rem', color: '#ccc', fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' }}>
          {inputUrl}
        </span>
        {loopDetected && (
          <span style={{ fontSize: '0.7rem', background: '#3b1111', color: '#ef4444', padding: '2px 8px', borderRadius: '4px' }}>
            ⚠ LOOP
          </span>
        )}
      </div>

      <div style={{ position: 'relative', paddingLeft: '20px' }}>
        {/* Vertical connector line */}
        <div style={{
          position: 'absolute', left: '9px', top: '12px',
          bottom: chain.length > 1 ? '12px' : '12px',
          width: '2px', background: '#2a2a2a',
          display: chain.length > 1 ? 'block' : 'none',
        }} />

        {chain.map((hop, i) => {
          const isLast = i === chain.length - 1;
          const statusColor = hop.isLoop ? '#ef4444' : hop.error ? '#666' : getStatusColor(hop.status);

          return (
            <div key={i} style={{ position: 'relative', marginBottom: isLast ? 0 : '16px', paddingLeft: '20px' }}>
              {/* Node dot */}
              <div style={{
                position: 'absolute', left: '-11px', top: '8px',
                width: '12px', height: '12px', borderRadius: '50%',
                background: statusColor, border: '2px solid #111',
                zIndex: 1,
              }} />

              <div style={{
                background: isLast && !hop.error && !hop.isLoop ? '#0a1a0a' : '#0a0a0a',
                border: `1px solid ${isLast && !hop.error && !hop.isLoop ? '#1a3a1a' : '#1e1e1e'}`,
                borderRadius: '8px', padding: '12px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  {hop.status && (
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 700, color: statusColor,
                      background: `${statusColor}15`, padding: '2px 8px', borderRadius: '4px',
                      fontFamily: 'ui-monospace, monospace',
                    }}>
                      {hop.status}
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: '#999' }}>{hop.statusText}</span>
                  {hop.server && (
                    <span style={{ fontSize: '0.65rem', color: '#555', fontFamily: 'ui-monospace, monospace' }}>
                      via {hop.server}
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '0.8rem', color: '#ccc', fontFamily: 'ui-monospace, monospace',
                  wordBreak: 'break-all', lineHeight: 1.5,
                }}>
                  {hop.url}
                </div>
                {hop.location && (
                  <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px' }}>
                    → Redirects to: <span style={{ color: '#8b5cf6' }}>{hop.location}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div style={{
        display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '12px',
        borderTop: '1px solid #1e1e1e', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '0.75rem', color: '#666' }}>
          Hops: <strong style={{ color: '#ccc' }}>{chain.length - 1}</strong>
        </span>
        <span style={{ fontSize: '0.75rem', color: '#666' }}>
          Final: <strong style={{ color: chain[chain.length - 1]?.error ? '#ef4444' : '#22c55e' }}>
            {extractDomain(chain[chain.length - 1]?.url || inputUrl)}
          </strong>
        </span>
        {chain.some(h => h.status === 301 || h.status === 308) && (
          <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>⚡ Has permanent redirects</span>
        )}
        {chain.some(h => h.status === 302 || h.status === 307) && (
          <span style={{ fontSize: '0.75rem', color: '#f97316' }}>🔄 Has temporary redirects</span>
        )}
      </div>
    </div>
  );
}

export default function RedirectMapperTool() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const abortRef = useRef(false);

  const handleTrace = async () => {
    const urls = input
      .split(/[\n,]+/)
      .map(u => normalizeUrl(u))
      .filter(Boolean);

    if (urls.length === 0) return;

    setLoading(true);
    setResults([]);
    setProgress({ current: 0, total: urls.length });
    abortRef.current = false;

    const allResults = [];

    for (let i = 0; i < urls.length; i++) {
      if (abortRef.current) break;

      setProgress({ current: i + 1, total: urls.length });

      try {
        const { chain, loopDetected } = await traceRedirects(urls[i]);
        allResults.push({ inputUrl: urls[i], chain, loopDetected });
      } catch (err) {
        allResults.push({ inputUrl: urls[i], error: err.message });
      }

      setResults([...allResults]);
    }

    setLoading(false);
  };

  const handleStop = () => {
    abortRef.current = true;
  };

  const totalRedirects = results.reduce((sum, r) => sum + (r.chain ? r.chain.length - 1 : 0), 0);
  const loops = results.filter(r => r.loopDetected).length;
  const permanent = results.filter(r => r.chain?.some(h => h.status === 301 || h.status === 308)).length;
  const temporary = results.filter(r => r.chain?.some(h => h.status === 302 || h.status === 307)).length;

  const handleExport = () => {
    if (results.length === 0) return;
    let csv = 'Input URL,Hop #,URL,Status,Status Text,Redirects To\n';
    results.forEach(r => {
      if (r.chain) {
        r.chain.forEach((hop, i) => {
          csv += `"${r.inputUrl}",${i + 1},"${hop.url}",${hop.status || ''},"${hop.statusText}","${hop.location || ''}"\n`;
        });
      }
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'redirect-map.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: '#999', marginBottom: '8px' }}>
          Enter URLs or domains (one per line, or comma-separated)
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'example.com\nhttp://old-site.com\nwww.test.org\nblog.example.com, shop.example.com'}
          rows={6}
          style={{
            width: '100%', padding: '14px', borderRadius: '10px',
            border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#fff',
            fontSize: '0.9rem', fontFamily: 'ui-monospace, monospace',
            lineHeight: 1.6, resize: 'vertical', outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = '#8b5cf6'}
          onBlur={e => e.target.style.borderColor = '#2a2a2a'}
        />
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleTrace}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 28px', borderRadius: '10px', border: 'none',
              background: loading ? '#333' : '#8b5cf6', color: '#fff',
              fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? `Mapping ${progress.current}/${progress.total}...` : '🗺️ Map Redirects'}
          </button>
          {loading && (
            <button
              onClick={handleStop}
              style={{
                padding: '12px 20px', borderRadius: '10px', border: '1px solid #ef4444',
                background: 'transparent', color: '#ef4444',
                fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Stop
            </button>
          )}
          {results.length > 0 && !loading && (
            <button
              onClick={handleExport}
              style={{
                padding: '12px 20px', borderRadius: '10px', border: '1px solid #2a2a2a',
                background: 'transparent', color: '#999',
                fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              📥 Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Summary stats */}
      {results.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px', marginBottom: '24px',
        }}>
          {[
            { label: 'URLs Traced', value: results.length, color: '#8b5cf6' },
            { label: 'Total Redirects', value: totalRedirects, color: '#f59e0b' },
            { label: 'Permanent (301/308)', value: permanent, color: '#f59e0b' },
            { label: 'Temporary (302/307)', value: temporary, color: '#f97316' },
            { label: 'Loops Detected', value: loops, color: loops > 0 ? '#ef4444' : '#22c55e' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px',
              padding: '16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {results.map((result, i) => (
        <RedirectChainVisual key={i} result={result} index={i} />
      ))}
    </div>
  );
}
