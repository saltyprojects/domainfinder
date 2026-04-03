'use client';

import { useState, useCallback } from 'react';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];

const DOH_PROVIDERS = [
  { id: 'google', name: 'Google', icon: '🔵', url: 'https://dns.google/resolve', color: '#4285f4' },
  { id: 'cloudflare', name: 'Cloudflare', icon: '🟠', url: 'https://cloudflare-dns.com/dns-query', color: '#f6821f' },
  { id: 'quad9', name: 'Quad9', icon: '🟣', url: 'https://dns.quad9.org:5053/dns-query', color: '#7b68ee' },
  { id: 'adguard', name: 'AdGuard', icon: '🟢', url: 'https://dns.adguard-dns.com/dns-query', color: '#68bc71' },
  { id: 'mullvad', name: 'Mullvad', icon: '🟡', url: 'https://dns.mullvad.net/dns-query', color: '#ffd800' },
];

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

async function queryDoH(provider, domain, type) {
  const start = performance.now();
  try {
    const params = new URLSearchParams({ name: domain, type });
    const res = await fetch(`${provider.url}?${params}`, {
      headers: { Accept: 'application/dns-json' },
    });
    const elapsed = Math.round(performance.now() - start);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      provider: provider.id,
      name: provider.name,
      icon: provider.icon,
      color: provider.color,
      time: elapsed,
      status: data.Status,
      dnssec: data.AD === true,
      truncated: data.TC === true,
      answers: data.Answer || [],
      authority: data.Authority || [],
      error: null,
    };
  } catch (err) {
    const elapsed = Math.round(performance.now() - start);
    return {
      provider: provider.id,
      name: provider.name,
      icon: provider.icon,
      color: provider.color,
      time: elapsed,
      status: -1,
      dnssec: false,
      truncated: false,
      answers: [],
      authority: [],
      error: err.message,
    };
  }
}

const STATUS_NAMES = {
  0: 'NOERROR',
  1: 'FORMERR',
  2: 'SERVFAIL',
  3: 'NXDOMAIN',
  4: 'NOTIMP',
  5: 'REFUSED',
};

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '16px',
};

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  width: '100%',
};

const btnStyle = {
  background: '#8b5cf6',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.2s',
  whiteSpace: 'nowrap',
};

export default function DohTesterTool() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [selectedProviders, setSelectedProviders] = useState(DOH_PROVIDERS.map(p => p.id));
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleProvider = useCallback((id) => {
    setSelectedProviders(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  }, []);

  const handleQuery = useCallback(async () => {
    const d = cleanDomain(domain);
    if (!d) return;
    if (selectedProviders.length === 0) return;

    setLoading(true);
    setResults(null);

    const providers = DOH_PROVIDERS.filter(p => selectedProviders.includes(p.id));
    const allResults = await Promise.all(
      providers.map(p => queryDoH(p, d, recordType))
    );

    setResults({ domain: d, type: recordType, providers: allResults, timestamp: new Date().toISOString() });
    setLoading(false);
  }, [domain, recordType, selectedProviders]);

  const fastest = results?.providers?.filter(r => !r.error)?.sort((a, b) => a.time - b.time)?.[0];
  const maxTime = results?.providers ? Math.max(...results.providers.map(r => r.time)) : 0;

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Input */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '6px' }}>Domain</label>
            <input
              type="text"
              placeholder="example.com"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuery()}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: '0 0 140px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '6px' }}>Record Type</label>
            <select
              value={recordType}
              onChange={e => setRecordType(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {RECORD_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleQuery}
              disabled={loading || !domain.trim() || selectedProviders.length === 0}
              style={{ ...btnStyle, opacity: loading || !domain.trim() ? 0.6 : 1 }}
            >
              {loading ? 'Querying…' : 'Test Resolvers'}
            </button>
          </div>
        </div>

        {/* Provider selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px' }}>DoH Providers</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {DOH_PROVIDERS.map(p => {
              const active = selectedProviders.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProvider(p.id)}
                  style={{
                    background: active ? `${p.color}22` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? p.color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    padding: '8px 14px',
                    color: active ? '#fff' : '#888',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {p.icon} {p.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div>
          {/* Speed comparison bar chart */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
              ⚡ Response Time Comparison
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {results.providers
                .sort((a, b) => a.time - b.time)
                .map(r => (
                  <div key={r.provider} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '120px', fontSize: '0.9rem', color: '#ccc', flexShrink: 0 }}>
                      {r.icon} {r.name}
                    </span>
                    <div style={{ flex: 1, position: 'relative', height: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${maxTime > 0 ? Math.max((r.time / maxTime) * 100, 5) : 5}%`,
                          background: r.error ? '#ef4444' : (fastest && r.provider === fastest.provider ? '#22c55e' : r.color),
                          borderRadius: '6px',
                          transition: 'width 0.5s ease',
                          opacity: 0.7,
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#fff',
                      }}>
                        {r.error ? 'Error' : `${r.time}ms`}
                      </span>
                    </div>
                    {fastest && r.provider === fastest.provider && !r.error && (
                      <span style={{ fontSize: '0.75rem', background: '#22c55e22', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        FASTEST
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Individual provider results */}
          {results.providers.map(r => (
            <div key={r.provider} style={{ ...cardStyle, borderColor: r.error ? '#ef444444' : `${r.color}44` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{r.icon}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{r.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    background: r.error ? '#ef444422' : r.status === 0 ? '#22c55e22' : '#f59e0b22',
                    color: r.error ? '#ef4444' : r.status === 0 ? '#22c55e' : '#f59e0b',
                    fontWeight: 600,
                  }}>
                    {r.error ? 'ERROR' : STATUS_NAMES[r.status] || `STATUS ${r.status}`}
                  </span>
                  <span style={{ fontSize: '0.8rem', padding: '3px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
                    {r.time}ms
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    background: r.dnssec ? '#8b5cf622' : 'rgba(255,255,255,0.05)',
                    color: r.dnssec ? '#8b5cf6' : '#666',
                    fontWeight: 600,
                  }}>
                    {r.dnssec ? '🔒 DNSSEC' : 'No DNSSEC'}
                  </span>
                  {r.truncated && (
                    <span style={{ fontSize: '0.8rem', padding: '3px 10px', borderRadius: '4px', background: '#f59e0b22', color: '#f59e0b' }}>
                      Truncated
                    </span>
                  )}
                </div>
              </div>

              {r.error ? (
                <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>❌ {r.error}</p>
              ) : r.answers.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px', color: '#9ca3af', fontWeight: 600 }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '8px 12px', color: '#9ca3af', fontWeight: 600 }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '8px 12px', color: '#9ca3af', fontWeight: 600 }}>TTL</th>
                        <th style={{ textAlign: 'left', padding: '8px 12px', color: '#9ca3af', fontWeight: 600 }}>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.answers.map((a, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '8px 12px', color: '#ccc', fontFamily: 'monospace' }}>{a.name}</td>
                          <td style={{ padding: '8px 12px', color: '#8b5cf6', fontWeight: 600 }}>{a.type}</td>
                          <td style={{ padding: '8px 12px', color: '#9ca3af' }}>{a.TTL}s</td>
                          <td style={{ padding: '8px 12px', color: '#fff', fontFamily: 'monospace', wordBreak: 'break-all' }}>{a.data}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>No records returned</p>
              )}
            </div>
          ))}

          {/* Summary */}
          <div style={{ ...cardStyle, background: 'rgba(139,92,246,0.05)', borderColor: 'rgba(139,92,246,0.2)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>📊 Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Domain</span>
                <p style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>{results.domain}</p>
              </div>
              <div>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Record Type</span>
                <p style={{ color: '#8b5cf6', fontWeight: 600 }}>{results.type}</p>
              </div>
              <div>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Fastest Resolver</span>
                <p style={{ color: '#22c55e', fontWeight: 600 }}>{fastest ? `${fastest.icon} ${fastest.name} (${fastest.time}ms)` : 'N/A'}</p>
              </div>
              <div>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>DNSSEC Validated</span>
                <p style={{ fontWeight: 600, color: results.providers.some(r => r.dnssec) ? '#8b5cf6' : '#666' }}>
                  {results.providers.filter(r => r.dnssec).length} / {results.providers.length} providers
                </p>
              </div>
              <div>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Consistent Results</span>
                <p style={{ fontWeight: 600, color: (() => {
                  const sets = results.providers
                    .filter(r => !r.error && r.answers.length > 0)
                    .map(r => JSON.stringify(r.answers.map(a => a.data).sort()));
                  const unique = new Set(sets);
                  return unique.size <= 1 ? '#22c55e' : '#f59e0b';
                })() }}>
                  {(() => {
                    const sets = results.providers
                      .filter(r => !r.error && r.answers.length > 0)
                      .map(r => JSON.stringify(r.answers.map(a => a.data).sort()));
                    const unique = new Set(sets);
                    return unique.size <= 1 ? '✅ All agree' : `⚠️ ${unique.size} different results`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
