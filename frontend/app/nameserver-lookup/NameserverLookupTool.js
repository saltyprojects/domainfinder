'use client';

import { useState } from 'react';

export default function NameserverLookupTool() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const cleanDomain = (input) => {
    return input.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  };

  const resolveNS = async (nameserver) => {
    const ips = { ipv4: [], ipv6: [] };
    try {
      const [aRes, aaaaRes] = await Promise.all([
        fetch(`https://dns.google/resolve?name=${encodeURIComponent(nameserver)}&type=A`).then(r => r.json()),
        fetch(`https://dns.google/resolve?name=${encodeURIComponent(nameserver)}&type=AAAA`).then(r => r.json()),
      ]);
      if (aRes.Answer) ips.ipv4 = aRes.Answer.map(r => r.data);
      if (aaaaRes.Answer) ips.ipv6 = aaaaRes.Answer.map(r => r.data);
    } catch {}
    return ips;
  };

  const detectProvider = (ns) => {
    const n = ns.toLowerCase();
    const providers = [
      { pattern: /cloudflare/, name: 'Cloudflare', icon: '☁️' },
      { pattern: /awsdns/, name: 'AWS Route 53', icon: '🟠' },
      { pattern: /google/, name: 'Google Cloud DNS', icon: '🔵' },
      { pattern: /azure-dns/, name: 'Microsoft Azure DNS', icon: '🟦' },
      { pattern: /digitalocean/, name: 'DigitalOcean', icon: '🌊' },
      { pattern: /nsone|ns1\./, name: 'NS1 (IBM)', icon: '🔷' },
      { pattern: /dnsimple/, name: 'DNSimple', icon: '💎' },
      { pattern: /domaincontrol|godaddy|secureserver/, name: 'GoDaddy', icon: '🟢' },
      { pattern: /registrar-servers|namecheap/, name: 'Namecheap', icon: '🧡' },
      { pattern: /name-services|enom/, name: 'Enom', icon: '📋' },
      { pattern: /hetzner/, name: 'Hetzner', icon: '🔴' },
      { pattern: /linode|akamai/, name: 'Akamai/Linode', icon: '🔵' },
      { pattern: /vultr/, name: 'Vultr', icon: '🔷' },
      { pattern: /hover/, name: 'Hover', icon: '🟣' },
      { pattern: /dnspark/, name: 'DNS Park', icon: '🏞️' },
      { pattern: /dnsmadeeasy/, name: 'DNS Made Easy', icon: '✅' },
      { pattern: /vercel-dns/, name: 'Vercel', icon: '▲' },
      { pattern: /netlify/, name: 'Netlify', icon: '🌐' },
      { pattern: /hostgator/, name: 'HostGator', icon: '🐊' },
      { pattern: /bluehost/, name: 'Bluehost', icon: '🔵' },
      { pattern: /dreamhost/, name: 'DreamHost', icon: '🌙' },
      { pattern: /siteground/, name: 'SiteGround', icon: '🟣' },
    ];
    for (const p of providers) {
      if (p.pattern.test(n)) return { name: p.name, icon: p.icon };
    }
    return { name: 'Custom / Other', icon: '🔧' };
  };

  const lookup = async () => {
    const clean = cleanDomain(domain);
    if (!clean || !clean.includes('.')) {
      setError('Please enter a valid domain name (e.g., example.com)');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Get NS records
      const nsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=NS`);
      if (!nsRes.ok) throw new Error(`DNS query failed (HTTP ${nsRes.status})`);
      const nsData = await nsRes.json();

      if (!nsData.Answer || nsData.Answer.length === 0) {
        setError(`No nameserver records found for ${clean}. The domain may not exist or has no NS records.`);
        setLoading(false);
        return;
      }

      // Get SOA record for additional info
      const soaRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=SOA`);
      const soaData = await soaRes.json();
      let soaInfo = null;
      if (soaData.Answer && soaData.Answer.length > 0) {
        const parts = soaData.Answer[0].data.split(' ');
        soaInfo = {
          primaryNS: parts[0],
          adminEmail: parts[1]?.replace(/\./, '@').replace(/\.$/, ''),
          serial: parts[2],
          refresh: parts[3],
          retry: parts[4],
          expire: parts[5],
          minTTL: parts[6],
        };
      }

      // Get nameserver details
      const nameservers = nsData.Answer
        .filter(r => r.type === 2) // NS record type
        .map(r => r.data.replace(/\.$/, ''));

      const nsDetails = await Promise.all(
        nameservers.map(async (ns) => {
          const ips = await resolveNS(ns);
          const provider = detectProvider(ns);
          return { hostname: ns, ...ips, provider };
        })
      );

      setResults({
        domain: clean,
        nameservers: nsDetails,
        soaInfo,
        nsCount: nsDetails.length,
        ttl: nsData.Answer[0]?.TTL,
      });
    } catch (err) {
      setError(err.message || 'Lookup failed. Please try again.');
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    lookup();
  };

  const formatSeconds = (s) => {
    const num = parseInt(s);
    if (isNaN(num)) return s;
    if (num >= 86400) return `${Math.floor(num / 86400)}d ${Math.floor((num % 86400) / 3600)}h`;
    if (num >= 3600) return `${Math.floor(num / 3600)}h ${Math.floor((num % 3600) / 60)}m`;
    return `${Math.floor(num / 60)}m`;
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain (e.g., google.com)"
          style={{
            flex: 1, minWidth: '250px', padding: '14px 16px', fontSize: '1rem',
            background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px',
            color: '#fff', outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
          onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
        />
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
          {loading ? 'Looking up…' : 'Lookup NS'}
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
          {/* Summary Card */}
          <div style={{
            background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px',
            padding: '20px', marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Domain</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#8b5cf6' }}>{results.domain}</div>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{results.nsCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>Nameservers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{results.ttl ? formatSeconds(results.ttl) : '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>TTL</div>
                </div>
              </div>
            </div>
          </div>

          {/* Nameserver Cards */}
          <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
            {results.nameservers.map((ns, i) => (
              <div key={ns.hostname} style={{
                background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', background: '#8b5cf6', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>NS {i + 1}</span>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', fontFamily: 'ui-monospace, monospace' }}>{ns.hostname}</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#1a1a2e', padding: '4px 10px', borderRadius: '6px',
                  }}>
                    <span>{ns.provider.icon}</span>
                    <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{ns.provider.name}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {ns.ipv4.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IPv4</div>
                      {ns.ipv4.map(ip => (
                        <div key={ip} style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem', color: '#4ade80', lineHeight: 1.6 }}>{ip}</div>
                      ))}
                    </div>
                  )}
                  {ns.ipv6.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IPv6</div>
                      {ns.ipv6.map(ip => (
                        <div key={ip} style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', color: '#60a5fa', lineHeight: 1.6, wordBreak: 'break-all' }}>{ip}</div>
                      ))}
                    </div>
                  )}
                  {ns.ipv4.length === 0 && ns.ipv6.length === 0 && (
                    <div style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>Could not resolve IP addresses</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SOA Record */}
          {results.soaInfo && (
            <div style={{
              background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#8b5cf6' }}>SOA Record (Start of Authority)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {[
                  { label: 'Primary NS', value: results.soaInfo.primaryNS?.replace(/\.$/, '') },
                  { label: 'Admin Email', value: results.soaInfo.adminEmail },
                  { label: 'Serial', value: results.soaInfo.serial },
                  { label: 'Refresh', value: formatSeconds(results.soaInfo.refresh) },
                  { label: 'Retry', value: formatSeconds(results.soaInfo.retry) },
                  { label: 'Expire', value: formatSeconds(results.soaInfo.expire) },
                  { label: 'Min TTL', value: formatSeconds(results.soaInfo.minTTL) },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                    <div style={{ fontSize: '0.85rem', color: '#ccc', fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' }}>{item.value || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
