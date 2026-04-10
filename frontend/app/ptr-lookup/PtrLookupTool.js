'use client';

import { useState, useCallback } from 'react';

function isIPv4(str) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(str) && str.split('.').every(p => parseInt(p) <= 255);
}

function isIPv6(str) {
  return /^[0-9a-fA-F:]+$/.test(str) && str.includes(':');
}

function ipv4ToArpa(ip) {
  return ip.split('.').reverse().join('.') + '.in-addr.arpa';
}

function expandIPv6(ip) {
  // Expand :: notation
  let parts = ip.split(':');
  if (ip.includes('::')) {
    const idx = parts.indexOf('');
    const before = parts.slice(0, idx).filter(Boolean);
    const after = parts.slice(idx + 1).filter(Boolean);
    const missing = 8 - before.length - after.length;
    parts = [...before, ...Array(missing).fill('0000'), ...after];
  }
  return parts.map(p => p.padStart(4, '0')).join(':');
}

function ipv6ToArpa(ip) {
  const expanded = expandIPv6(ip);
  const nibbles = expanded.replace(/:/g, '').split('').reverse().join('.');
  return nibbles + '.ip6.arpa';
}

function cleanInput(input) {
  return input.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
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

const COMMON_EXAMPLES = [
  { ip: '8.8.8.8', label: 'Google DNS' },
  { ip: '1.1.1.1', label: 'Cloudflare DNS' },
  { ip: '208.67.222.222', label: 'OpenDNS' },
  { ip: '9.9.9.9', label: 'Quad9 DNS' },
];

export default function PtrLookupTool() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const lookupPTR = useCallback(async (ipOverride) => {
    const raw = cleanInput(ipOverride || input);
    if (!raw) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let ip = raw;
      let resolvedFrom = null;

      // If input is a hostname, resolve it to an IP first
      if (!isIPv4(raw) && !isIPv6(raw)) {
        const resolveUrl = `https://dns.google/resolve?name=${encodeURIComponent(raw)}&type=A`;
        const resolveRes = await fetch(resolveUrl, { headers: { Accept: 'application/dns-json' } });
        if (!resolveRes.ok) throw new Error(`Failed to resolve hostname (HTTP ${resolveRes.status})`);
        const resolveData = await resolveRes.json();
        const aRecords = (resolveData.Answer || []).filter(r => r.type === 1);
        if (aRecords.length === 0) throw new Error(`Could not resolve "${raw}" to an IP address`);
        ip = aRecords[0].data;
        resolvedFrom = raw;
      }

      // Build the arpa domain
      let arpa;
      let ipVersion;
      if (isIPv4(ip)) {
        arpa = ipv4ToArpa(ip);
        ipVersion = 'IPv4';
      } else if (isIPv6(ip)) {
        arpa = ipv6ToArpa(ip);
        ipVersion = 'IPv6';
      } else {
        throw new Error('Invalid IP address format');
      }

      // Query PTR record
      const ptrUrl = `https://dns.google/resolve?name=${encodeURIComponent(arpa)}&type=PTR`;
      const ptrRes = await fetch(ptrUrl, { headers: { Accept: 'application/dns-json' } });
      if (!ptrRes.ok) throw new Error(`PTR lookup failed (HTTP ${ptrRes.status})`);
      const ptrData = await ptrRes.json();

      const ptrRecords = (ptrData.Answer || []).filter(r => r.type === 12);

      // Also try to get additional info — look up the hostnames in PTR records
      const hostnames = [];
      for (const ptr of ptrRecords) {
        const hostname = ptr.data.replace(/\.$/, '');
        // Forward-confirm: resolve the hostname back to check if it matches
        let forwardMatch = false;
        try {
          const fwdUrl = `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`;
          const fwdRes = await fetch(fwdUrl, { headers: { Accept: 'application/dns-json' } });
          if (fwdRes.ok) {
            const fwdData = await fwdRes.json();
            const fwdRecords = (fwdData.Answer || []).filter(r => r.type === 1);
            forwardMatch = fwdRecords.some(r => r.data === ip);
          }
        } catch {
          // Forward lookup failed, that's ok
        }
        hostnames.push({
          hostname,
          ttl: ptr.TTL,
          forwardConfirmed: forwardMatch,
          raw: ptr.data,
        });
      }

      setResults({
        ip,
        ipVersion,
        arpa,
        resolvedFrom,
        hostnames,
        status: ptrData.Status,
        found: ptrRecords.length > 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [input]);

  return (
    <div>
      {/* Input */}
      <div style={{ ...cardStyle, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Enter IP address or hostname (e.g. 8.8.8.8 or google.com)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookupPTR()}
            style={inputStyle}
          />
        </div>
        <button onClick={() => lookupPTR()} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Looking up…' : 'PTR Lookup'}
        </button>
      </div>

      {/* Quick examples */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <span style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: '32px' }}>Try:</span>
        {COMMON_EXAMPLES.map(ex => (
          <button
            key={ex.ip}
            onClick={() => { setInput(ex.ip); lookupPTR(ex.ip); }}
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '6px',
              color: '#a78bfa',
              padding: '4px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {ex.ip} <span style={{ color: '#6b7280' }}>({ex.label})</span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ ...cardStyle, borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
          <p style={{ color: '#f87171', margin: 0 }}>❌ {error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Summary */}
          <div style={{
            ...cardStyle,
            borderColor: results.found ? '#22c55e' : '#f59e0b',
            background: results.found ? 'rgba(34,197,94,0.05)' : 'rgba(245,158,11,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>{results.found ? '✅' : '⚠️'}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                  {results.found ? 'PTR Record Found' : 'No PTR Record Found'}
                </h3>
                <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                  {results.found
                    ? `${results.hostnames.length} hostname${results.hostnames.length !== 1 ? 's' : ''} mapped to ${results.ip}`
                    : `No reverse DNS record exists for ${results.ip}`}
                </p>
              </div>
            </div>
          </div>

          {/* Details card */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>📋 Lookup Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', fontSize: '0.9rem' }}>
              <span style={{ color: '#9ca3af' }}>IP Address:</span>
              <span style={{ color: '#fff', fontFamily: 'ui-monospace, monospace' }}>{results.ip}</span>

              <span style={{ color: '#9ca3af' }}>IP Version:</span>
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>{results.ipVersion}</span>

              {results.resolvedFrom && (
                <>
                  <span style={{ color: '#9ca3af' }}>Resolved From:</span>
                  <span style={{ color: '#fff', fontFamily: 'ui-monospace, monospace' }}>{results.resolvedFrom}</span>
                </>
              )}

              <span style={{ color: '#9ca3af' }}>ARPA Domain:</span>
              <span style={{ color: '#fff', fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' }}>{results.arpa}</span>

              <span style={{ color: '#9ca3af' }}>DNS Status:</span>
              <span style={{ color: results.status === 0 ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>
                {results.status === 0 ? 'NOERROR' : results.status === 3 ? 'NXDOMAIN' : `Status ${results.status}`}
              </span>
            </div>
          </div>

          {/* PTR Records */}
          {results.hostnames.length > 0 && (
            <>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', marginTop: '32px' }}>
                🔄 Reverse DNS Hostnames
              </h3>
              {results.hostnames.map((h, idx) => (
                <div key={idx} style={{
                  ...cardStyle,
                  borderColor: h.forwardConfirmed ? '#22c55e' : '#f59e0b',
                  background: h.forwardConfirmed ? 'rgba(34,197,94,0.03)' : 'rgba(245,158,11,0.03)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.2rem' }}>🌐</span>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'ui-monospace, monospace', color: '#fff' }}>
                      {h.hostname}
                    </span>
                    <span style={{
                      background: h.forwardConfirmed ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)',
                      color: h.forwardConfirmed ? '#22c55e' : '#f59e0b',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}>
                      {h.forwardConfirmed ? 'FCrDNS VERIFIED ✓' : 'FCrDNS MISMATCH'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#9ca3af' }}>
                    <span>TTL: {h.ttl}s</span>
                    <span>Raw: {h.raw}</span>
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                    {h.forwardConfirmed
                      ? `Forward-confirmed reverse DNS (FCrDNS) passed — ${h.hostname} resolves back to ${results.ip}.`
                      : `Forward confirmation failed — ${h.hostname} does not resolve back to ${results.ip}. This may indicate a misconfiguration.`}
                  </p>
                </div>
              ))}
            </>
          )}

          {/* No PTR advice */}
          {!results.found && (
            <div style={{ ...cardStyle, borderColor: '#f59e0b', background: 'rgba(245,158,11,0.05)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>💡 Why No PTR Record?</h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '8px' }}>
                Many IP addresses do not have PTR records configured. PTR records must be set by the owner of the IP
                address block (typically the hosting provider or ISP), not the domain owner. Common reasons for missing PTR records:
              </p>
              <ul style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
                <li>Shared hosting — the hosting provider may not configure individual PTR records</li>
                <li>CDN or proxy IP — services like Cloudflare use their own PTR records</li>
                <li>Dynamic/residential IPs — ISPs often don&apos;t set PTR records for consumer connections</li>
                <li>Simply not configured — the IP owner hasn&apos;t set one up</li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
