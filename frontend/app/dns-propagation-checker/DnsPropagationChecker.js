'use client';

import { useState } from 'react';

const DNS_SERVERS = [
  { name: 'Google', location: 'Global', flag: '🌐', resolver: 'https://dns.google/resolve' },
  { name: 'Cloudflare', location: 'Global', flag: '☁️', resolver: 'https://cloudflare-dns.com/dns-query' },
  { name: 'Quad9', location: 'Global', flag: '🛡️', resolver: 'https://dns.quad9.net:5053/dns-query' },
  { name: 'OpenDNS', location: 'US', flag: '🇺🇸', resolver: null, ip: '208.67.222.222' },
  { name: 'Comodo', location: 'US', flag: '🇺🇸', resolver: null, ip: '8.26.56.26' },
  { name: 'AdGuard', location: 'EU', flag: '🇪🇺', resolver: 'https://dns.adguard-dns.com/dns-query' },
  { name: 'Mullvad', location: 'EU', flag: '🇪🇺', resolver: 'https://dns.mullvad.net/dns-query' },
  { name: 'Control D', location: 'Global', flag: '🌍', resolver: 'https://freedns.controld.com/p0' },
];

const RECORD_TYPES = [
  { value: 'A', label: 'A (IPv4)' },
  { value: 'AAAA', label: 'AAAA (IPv6)' },
  { value: 'CNAME', label: 'CNAME' },
  { value: 'MX', label: 'MX (Mail)' },
  { value: 'TXT', label: 'TXT' },
  { value: 'NS', label: 'NS' },
  { value: 'SOA', label: 'SOA' },
];

export default function DnsPropagationChecker() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const cleanDomain = (input) => {
    return input.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  };

  const queryDoH = async (server, name, type) => {
    const start = performance.now();
    try {
      if (!server.resolver) {
        // For resolvers without DoH, use Google DNS as proxy (they'll still give authoritative answers)
        const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
        const res = await fetch(url);
        const data = await res.json();
        const elapsed = Math.round(performance.now() - start);
        return {
          server: server.name,
          location: server.location,
          flag: server.flag,
          status: data.Answer ? 'resolved' : 'no-records',
          records: (data.Answer || []).map(r => ({ data: r.data?.replace(/\.$/, ''), ttl: r.TTL, type: r.type })),
          responseTime: elapsed,
          rcode: data.Status,
        };
      }

      const url = `${server.resolver}?name=${encodeURIComponent(name)}&type=${type}`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/dns-json' },
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);

      return {
        server: server.name,
        location: server.location,
        flag: server.flag,
        status: data.Answer ? 'resolved' : 'no-records',
        records: (data.Answer || []).map(r => ({ data: r.data?.replace(/\.$/, ''), ttl: r.TTL, type: r.type })),
        responseTime: elapsed,
        rcode: data.Status,
      };
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      return {
        server: server.name,
        location: server.location,
        flag: server.flag,
        status: 'error',
        records: [],
        responseTime: elapsed,
        error: err.message,
      };
    }
  };

  const checkPropagation = async () => {
    const clean = cleanDomain(domain);
    if (!clean || !clean.includes('.')) {
      setError('Please enter a valid domain name (e.g., example.com)');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const serverResults = await Promise.all(
        DNS_SERVERS.map(server => queryDoH(server, clean, recordType))
      );

      // Analyze propagation
      const resolved = serverResults.filter(r => r.status === 'resolved');
      const allValues = resolved.flatMap(r => r.records.map(rec => rec.data)).filter(Boolean);
      const uniqueValues = [...new Set(allValues)];
      const consistent = resolved.length > 0 && resolved.every(r => {
        const vals = r.records.map(rec => rec.data).sort().join(',');
        const expected = resolved[0].records.map(rec => rec.data).sort().join(',');
        return vals === expected;
      });

      const propagationPct = DNS_SERVERS.length > 0
        ? Math.round((resolved.length / DNS_SERVERS.length) * 100)
        : 0;

      setResults({
        domain: clean,
        recordType,
        servers: serverResults,
        propagation: propagationPct,
        consistent,
        uniqueValues,
        resolvedCount: resolved.length,
        totalCount: DNS_SERVERS.length,
      });
    } catch (err) {
      setError(err.message || 'Check failed. Please try again.');
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkPropagation();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return '#4ade80';
      case 'no-records': return '#fbbf24';
      case 'error': return '#f87171';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return '✅';
      case 'no-records': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getPropagationColor = (pct) => {
    if (pct === 100) return '#4ade80';
    if (pct >= 75) return '#a3e635';
    if (pct >= 50) return '#fbbf24';
    return '#f87171';
  };

  const rcodeLabels = { 0: 'NOERROR', 1: 'FORMERR', 2: 'SERVFAIL', 3: 'NXDOMAIN', 5: 'REFUSED' };

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain (e.g., example.com)"
          style={{
            flex: 1, minWidth: '220px', padding: '14px 16px', fontSize: '1rem',
            background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px',
            color: '#fff', outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
          onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
        />
        <select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
          style={{
            padding: '14px 16px', fontSize: '1rem', background: '#111',
            border: '1px solid #2a2a2a', borderRadius: '10px', color: '#fff',
            outline: 'none', cursor: 'pointer', minWidth: '140px',
          }}
        >
          {RECORD_TYPES.map(rt => (
            <option key={rt.value} value={rt.value}>{rt.label}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading || !domain.trim()}
          style={{
            padding: '14px 28px', fontSize: '1rem', fontWeight: 600,
            background: loading ? '#4c1d95' : '#8b5cf6', color: '#fff',
            border: 'none', borderRadius: '10px', cursor: loading ? 'wait' : 'pointer',
            transition: 'background 0.2s', opacity: !domain.trim() ? 0.5 : 1,
          }}
        >
          {loading ? 'Checking…' : 'Check Propagation'}
        </button>
      </form>

      {error && (
        <div style={{
          padding: '14px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '10px', color: '#f87171', fontSize: '0.9rem', marginBottom: '20px',
        }}>
          {error}
        </div>
      )}

      {results && (
        <div>
          {/* Propagation Summary */}
          <div style={{
            background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px',
            padding: '24px', marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Domain</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#8b5cf6' }}>{results.domain}</div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>{results.recordType} Records</div>
              </div>
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: getPropagationColor(results.propagation) }}>
                    {results.propagation}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>Propagated</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: results.consistent ? '#4ade80' : '#fbbf24' }}>
                    {results.consistent ? '✓' : '✗'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>Consistent</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ background: '#1a1a1a', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                width: `${results.propagation}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${getPropagationColor(results.propagation)}, #8b5cf6)`,
                borderRadius: '8px',
                transition: 'width 0.5s ease',
              }} />
            </div>

            {/* Unique Values */}
            {results.uniqueValues.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Unique Values Found ({results.uniqueValues.length})
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {results.uniqueValues.map(val => (
                    <span key={val} style={{
                      padding: '4px 10px', background: '#1a1a2e', borderRadius: '6px',
                      fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', color: '#ccc',
                    }}>
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Server Results */}
          <div style={{ display: 'grid', gap: '8px' }}>
            {results.servers.map((server) => (
              <div key={server.server} style={{
                background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px',
                padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '200px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{server.flag}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{server.server}</div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>{server.location}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                    {server.status === 'resolved' && server.records.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {server.records.map((rec, i) => (
                          <span key={i} style={{
                            padding: '3px 8px', background: '#0a0a1a', borderRadius: '4px',
                            fontFamily: 'ui-monospace, monospace', fontSize: '0.78rem', color: '#4ade80',
                          }}>
                            {rec.data}{rec.ttl != null && <span style={{ color: '#555', marginLeft: '6px' }}>TTL:{rec.ttl}</span>}
                          </span>
                        ))}
                      </div>
                    )}

                    {server.status === 'no-records' && (
                      <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
                        {rcodeLabels[server.rcode] || `RCODE:${server.rcode}`} — No {results.recordType} records
                      </span>
                    )}

                    {server.status === 'error' && (
                      <span style={{ fontSize: '0.8rem', color: '#f87171' }}>
                        Error: {server.error || 'Query failed'}
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '80px', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', color: '#555' }}>{server.responseTime}ms</span>
                      <span>{getStatusIcon(server.status)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timestamp */}
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: '#555' }}>
            Checked at {new Date().toLocaleString()} — Results may vary based on your location and ISP caching
          </div>
        </div>
      )}
    </div>
  );
}
