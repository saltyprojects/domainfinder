'use client';

import { useState } from 'react';

function parseInput(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('?')[0].split(':')[0];
  return d;
}

function isIP(str) {
  // IPv4
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(str)) {
    return str.split('.').every(n => parseInt(n) <= 255);
  }
  // IPv6
  if (str.includes(':')) return /^[0-9a-f:]+$/i.test(str);
  return false;
}

export default function ReverseIPLookup() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function lookup(e) {
    e.preventDefault();
    const target = parseInput(input);
    if (!target) {
      setError('Please enter a valid domain name or IP address.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let ip = target;
      let forwardHostname = null;

      // If it's a domain, resolve to IP first
      if (!isIP(target)) {
        forwardHostname = target;
        const dnsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(target)}&type=A`);
        const dnsData = await dnsRes.json();
        if (dnsData.Answer && dnsData.Answer.length > 0) {
          const aRecord = dnsData.Answer.find(a => a.type === 1);
          if (aRecord) {
            ip = aRecord.data;
          } else {
            throw new Error('No A record found for this domain.');
          }
        } else {
          throw new Error('Could not resolve domain to an IP address.');
        }
      }

      // Reverse DNS lookup (PTR record)
      const parts = ip.split('.').reverse();
      const ptrName = parts.join('.') + '.in-addr.arpa';
      const ptrRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(ptrName)}&type=PTR`);
      const ptrData = await ptrRes.json();
      const ptrRecords = (ptrData.Answer || []).filter(a => a.type === 12).map(a => a.data.replace(/\.$/, ''));

      // Get additional DNS info for the IP
      const [aRes, aaaaRes, mxRes, nsRes, txtRes] = await Promise.all([
        forwardHostname ? fetch(`https://dns.google/resolve?name=${encodeURIComponent(forwardHostname)}&type=A`).then(r => r.json()) : Promise.resolve(null),
        forwardHostname ? fetch(`https://dns.google/resolve?name=${encodeURIComponent(forwardHostname)}&type=AAAA`).then(r => r.json()) : Promise.resolve(null),
        forwardHostname ? fetch(`https://dns.google/resolve?name=${encodeURIComponent(forwardHostname)}&type=MX`).then(r => r.json()) : Promise.resolve(null),
        forwardHostname ? fetch(`https://dns.google/resolve?name=${encodeURIComponent(forwardHostname)}&type=NS`).then(r => r.json()) : Promise.resolve(null),
        forwardHostname ? fetch(`https://dns.google/resolve?name=${encodeURIComponent(forwardHostname)}&type=TXT`).then(r => r.json()) : Promise.resolve(null),
      ]);

      // Try to identify hosting provider from PTR
      let hostingProvider = 'Unknown';
      const allPtrs = ptrRecords.join(' ').toLowerCase();
      const providers = [
        { pattern: /cloudflare/i, name: 'Cloudflare' },
        { pattern: /amazonaws|aws|ec2|compute\.amazonaws/i, name: 'Amazon Web Services (AWS)' },
        { pattern: /google|goog|1e100/i, name: 'Google Cloud' },
        { pattern: /azure|microsoft/i, name: 'Microsoft Azure' },
        { pattern: /digitalocean/i, name: 'DigitalOcean' },
        { pattern: /linode|akamai/i, name: 'Akamai / Linode' },
        { pattern: /hetzner/i, name: 'Hetzner' },
        { pattern: /ovh/i, name: 'OVH' },
        { pattern: /vultr/i, name: 'Vultr' },
        { pattern: /godaddy|secureserver/i, name: 'GoDaddy' },
        { pattern: /hostgator/i, name: 'HostGator' },
        { pattern: /bluehost|unified/i, name: 'Bluehost' },
        { pattern: /namecheap/i, name: 'Namecheap' },
        { pattern: /shopify/i, name: 'Shopify' },
        { pattern: /squarespace/i, name: 'Squarespace' },
        { pattern: /vercel/i, name: 'Vercel' },
        { pattern: /netlify/i, name: 'Netlify' },
        { pattern: /railway/i, name: 'Railway' },
        { pattern: /render/i, name: 'Render' },
        { pattern: /fastly/i, name: 'Fastly' },
      ];
      for (const p of providers) {
        if (p.pattern.test(allPtrs)) { hostingProvider = p.name; break; }
      }

      // IP class info
      const firstOctet = parseInt(ip.split('.')[0]);
      let ipClass = 'Unknown';
      if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'Class A';
      else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
      else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
      else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
      else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'Class E (Reserved)';

      const isPrivate = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(ip) || ip === '127.0.0.1';

      setResult({
        ip,
        forwardHostname,
        ptrRecords,
        hostingProvider,
        ipClass,
        isPrivate,
        aRecords: aRes?.Answer?.filter(a => a.type === 1).map(a => a.data) || [],
        aaaaRecords: aaaaRes?.Answer?.filter(a => a.type === 28).map(a => a.data) || [],
        mxRecords: mxRes?.Answer?.filter(a => a.type === 15).map(a => ({ priority: parseInt(a.data.split(' ')[0]), host: a.data.split(' ')[1]?.replace(/\.$/, '') })) || [],
        nsRecords: nsRes?.Answer?.filter(a => a.type === 2).map(a => a.data.replace(/\.$/, '')) || [],
        txtRecords: txtRes?.Answer?.filter(a => a.type === 16).map(a => a.data) || [],
      });
    } catch (err) {
      setError(err.message || 'Lookup failed. Please check the input and try again.');
    } finally {
      setLoading(false);
    }
  }

  const cardStyle = { background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' };
  const labelStyle = { fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' };
  const valueStyle = { fontSize: '1rem', color: '#fff', fontWeight: 600, wordBreak: 'break-all' };
  const tagStyle = (color) => ({
    display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem',
    fontWeight: 600, background: `${color}20`, color, marginRight: '6px', marginBottom: '6px',
  });

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={lookup} style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter domain or IP address (e.g., google.com or 8.8.8.8)"
          style={{
            flex: 1, minWidth: '260px', padding: '14px 18px', borderRadius: '10px',
            border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#fff',
            fontSize: '1rem', outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 32px', borderRadius: '10px', border: 'none',
            background: loading ? '#6b7280' : '#8b5cf6', color: '#fff',
            fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Looking up…' : 'Lookup'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#ef444420', border: '1px solid #ef4444', borderRadius: '10px', padding: '14px 18px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main IP Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={cardStyle}>
              <div style={labelStyle}>IP Address</div>
              <div style={valueStyle}>{result.ip}</div>
            </div>
            {result.forwardHostname && (
              <div style={cardStyle}>
                <div style={labelStyle}>Hostname</div>
                <div style={valueStyle}>{result.forwardHostname}</div>
              </div>
            )}
            <div style={cardStyle}>
              <div style={labelStyle}>IP Class</div>
              <div style={valueStyle}>{result.ipClass}</div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Type</div>
              <div style={{ ...valueStyle, color: result.isPrivate ? '#f59e0b' : '#22c55e' }}>
                {result.isPrivate ? '🔒 Private' : '🌐 Public'}
              </div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Hosting Provider</div>
              <div style={{ ...valueStyle, color: result.hostingProvider !== 'Unknown' ? '#8b5cf6' : '#6b7280' }}>
                {result.hostingProvider}
              </div>
            </div>
          </div>

          {/* PTR Records */}
          <div style={{ ...cardStyle, borderTop: '3px solid #8b5cf6' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>
              🔄 Reverse DNS (PTR Records)
            </h3>
            {result.ptrRecords.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.ptrRecords.map((ptr, i) => (
                  <span key={i} style={tagStyle('#8b5cf6')}>{ptr}</span>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>No PTR records found. The IP owner has not configured reverse DNS.</p>
            )}
          </div>

          {/* DNS Records (if domain was provided) */}
          {result.forwardHostname && (
            <>
              {result.aRecords.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#fff' }}>A Records (IPv4)</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result.aRecords.map((r, i) => <span key={i} style={tagStyle('#22c55e')}>{r}</span>)}
                  </div>
                </div>
              )}
              {result.aaaaRecords.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#fff' }}>AAAA Records (IPv6)</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result.aaaaRecords.map((r, i) => <span key={i} style={tagStyle('#3b82f6')}>{r}</span>)}
                  </div>
                </div>
              )}
              {result.nsRecords.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#fff' }}>NS Records (Nameservers)</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result.nsRecords.map((r, i) => <span key={i} style={tagStyle('#f59e0b')}>{r}</span>)}
                  </div>
                </div>
              )}
              {result.mxRecords.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#fff' }}>MX Records (Mail Servers)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {result.mxRecords.sort((a, b) => a.priority - b.priority).map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ ...tagStyle('#ef4444'), minWidth: '35px', textAlign: 'center' }}>{r.priority}</span>
                        <span style={{ color: '#e5e7eb', fontSize: '0.9rem', fontFamily: 'ui-monospace, monospace' }}>{r.host}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.txtRecords.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#fff' }}>TXT Records</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.txtRecords.map((r, i) => (
                      <div key={i} style={{ background: '#0a0a0a', borderRadius: '8px', padding: '10px 14px', border: '1px solid #1e1e1e' }}>
                        <code style={{ color: '#9ca3af', fontSize: '0.8rem', wordBreak: 'break-all', fontFamily: 'ui-monospace, monospace' }}>{r}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
