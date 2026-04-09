'use client';

import { useState, useCallback } from 'react';

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('?')[0].split('#')[0];
  return d;
}

const cardStyle = {
  background: 'rgba(139,92,246,0.06)',
  border: '1px solid rgba(139,92,246,0.18)',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '14px',
};

const labelStyle = { color: '#9ca3af', fontSize: '0.85rem', marginBottom: '4px' };
const valueStyle = { color: '#fff', fontSize: '1.05rem', fontWeight: 600 };

function InfoRow({ label, value, link }) {
  if (!value) return null;
  return (
    <div style={cardStyle}>
      <div style={labelStyle}>{label}</div>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ ...valueStyle, color: '#8b5cf6', textDecoration: 'none' }}>
          {value} ↗
        </a>
      ) : (
        <div style={valueStyle}>{value}</div>
      )}
    </div>
  );
}

export default function RegistrarDetectorTool() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const detect = useCallback(async () => {
    const d = cleanDomain(domain);
    if (!d || !d.includes('.')) {
      setError('Please enter a valid domain name.');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);

    try {
      // Try RDAP first — the modern replacement for WHOIS
      const rdapRes = await fetch(`https://rdap.org/domain/${encodeURIComponent(d)}`);
      if (!rdapRes.ok) throw new Error(`RDAP returned ${rdapRes.status}`);
      const data = await rdapRes.json();

      // Extract registrar info from entities
      let registrar = null;
      let registrarUrl = null;
      let registrarIanaId = null;
      let abuseContact = null;

      if (data.entities && Array.isArray(data.entities)) {
        for (const entity of data.entities) {
          const roles = entity.roles || [];
          if (roles.includes('registrar')) {
            // Name from vcardArray or publicIds
            if (entity.vcardArray) {
              const vcard = entity.vcardArray[1] || [];
              for (const field of vcard) {
                if (field[0] === 'fn') registrar = field[3];
                if (field[0] === 'url') registrarUrl = field[3];
              }
            }
            if (!registrar && entity.handle) registrar = entity.handle;
            if (entity.publicIds) {
              for (const pid of entity.publicIds) {
                if (pid.type === 'IANA Registrar ID') registrarIanaId = pid.identifier;
              }
            }
            // Look for abuse contact in nested entities
            if (entity.entities) {
              for (const sub of entity.entities) {
                if ((sub.roles || []).includes('abuse') && sub.vcardArray) {
                  const vcard = sub.vcardArray[1] || [];
                  for (const field of vcard) {
                    if (field[0] === 'email') abuseContact = field[3];
                    if (field[0] === 'tel' && !abuseContact) abuseContact = field[3];
                  }
                }
              }
            }
            // Also check links for registrar URL
            if (!registrarUrl && entity.links) {
              for (const link of entity.links) {
                if (link.rel === 'self' || link.href) {
                  registrarUrl = registrarUrl || link.href;
                }
              }
            }
          }
        }
      }

      // Fallback: check remarks/links at top level
      if (!registrar && data.remarks) {
        for (const remark of data.remarks) {
          if (remark.title && remark.title.toLowerCase().includes('registrar')) {
            registrar = remark.description ? remark.description.join(' ') : remark.title;
          }
        }
      }

      // Extract dates
      const events = data.events || [];
      let registrationDate = null;
      let expirationDate = null;
      let lastUpdated = null;
      for (const ev of events) {
        if (ev.eventAction === 'registration') registrationDate = ev.eventDate;
        if (ev.eventAction === 'expiration') expirationDate = ev.eventDate;
        if (ev.eventAction === 'last changed' || ev.eventAction === 'last update of RDAP database') lastUpdated = ev.eventDate;
      }

      // Extract nameservers
      const nameservers = (data.nameservers || []).map(ns => ns.ldhName || ns.unicodeName || '').filter(Boolean);

      // Extract status
      const statuses = data.status || [];

      // Domain name
      const domainName = data.ldhName || data.unicodeName || d;

      // Registry (from links or port43)
      const port43 = data.port43 || null;

      setResult({
        domain: domainName,
        registrar: registrar || 'Unknown',
        registrarUrl,
        registrarIanaId,
        abuseContact,
        registrationDate,
        expirationDate,
        lastUpdated,
        nameservers,
        statuses,
        port43,
      });
    } catch (err) {
      // Fallback: try dns.google for basic NS info
      try {
        const nsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(d)}&type=NS`);
        const nsData = await nsRes.json();
        const nsList = (nsData.Answer || []).map(a => a.data).filter(Boolean);
        if (nsList.length > 0) {
          // Guess registrar from nameservers
          const nsHost = nsList[0].toLowerCase();
          let guessedRegistrar = 'Could not detect (RDAP unavailable for this TLD)';
          const nsMap = {
            'domaincontrol.com': 'GoDaddy',
            'registrar-servers.com': 'Namecheap',
            'cloudflare.com': 'Cloudflare Registrar',
            'name-services.com': 'Enom / Tucows',
            'google': 'Google Domains / Squarespace',
            'awsdns': 'Amazon Route 53',
            'digitalocean': 'DigitalOcean',
            'hover.com': 'Hover',
            'dynect': 'Dyn (Oracle)',
            'nsone': 'NS1 (IBM)',
            'porkbun': 'Porkbun',
            'vercel': 'Vercel DNS',
            'netlify': 'Netlify DNS',
            'dreamhost': 'DreamHost',
            'hostgator': 'HostGator',
            'bluehost': 'Bluehost',
            'siteground': 'SiteGround',
            'wix': 'Wix',
            'squarespace': 'Squarespace',
            'shopify': 'Shopify',
          };
          for (const [key, val] of Object.entries(nsMap)) {
            if (nsHost.includes(key)) { guessedRegistrar = `${val} (estimated from nameservers)`; break; }
          }
          setResult({
            domain: d,
            registrar: guessedRegistrar,
            registrarUrl: null,
            registrarIanaId: null,
            abuseContact: null,
            registrationDate: null,
            expirationDate: null,
            lastUpdated: null,
            nameservers: nsList,
            statuses: [],
            port43: null,
            fallback: true,
          });
        } else {
          setError(`Could not find registrar information for "${d}". The domain may not be registered or RDAP data is unavailable for this TLD.`);
        }
      } catch {
        setError(`Could not find registrar information for "${d}". The domain may not be registered or RDAP data is unavailable for this TLD.`);
      }
    } finally {
      setLoading(false);
    }
  }, [domain]);

  const formatDate = (iso) => {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return iso; }
  };

  const statusDescriptions = {
    'client transfer prohibited': 'Transfer locked by registrant',
    'server transfer prohibited': 'Transfer locked by registry',
    'client delete prohibited': 'Deletion locked by registrant',
    'server delete prohibited': 'Deletion locked by registry',
    'client update prohibited': 'Updates locked by registrant',
    'server update prohibited': 'Updates locked by registry',
    'client hold': 'Domain on hold by registrar',
    'server hold': 'Domain on hold by registry',
    'active': 'Domain is active and resolving',
    'inactive': 'Domain is registered but not resolving',
    'ok': 'No pending operations or prohibitions',
    'auto renew period': 'In auto-renewal grace period',
    'redemption period': 'Domain expired, in redemption',
    'pending delete': 'Scheduled for deletion',
    'pending transfer': 'Transfer in progress',
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && detect()}
          placeholder="Enter a domain (e.g. example.com)"
          style={{
            flex: 1,
            padding: '14px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(139,92,246,0.3)',
            background: 'rgba(0,0,0,0.3)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <button
          onClick={detect}
          disabled={loading}
          style={{
            padding: '14px 28px',
            borderRadius: '10px',
            border: 'none',
            background: loading ? '#4c1d95' : '#8b5cf6',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Detecting…' : 'Detect Registrar'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '14px 18px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          <div style={{ ...cardStyle, background: 'rgba(139,92,246,0.12)', borderColor: 'rgba(139,92,246,0.35)', textAlign: 'center', padding: '28px' }}>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '6px' }}>Registrar for</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{result.domain}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6' }}>{result.registrar}</div>
            {result.fallback && (
              <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '8px' }}>
                ⚠ RDAP data unavailable — registrar estimated from nameservers
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px', marginTop: '14px' }}>
            <InfoRow label="IANA Registrar ID" value={result.registrarIanaId} />
            <InfoRow label="Registrar Website" value={result.registrarUrl} link={result.registrarUrl} />
            <InfoRow label="Abuse Contact" value={result.abuseContact} />
            <InfoRow label="WHOIS Server" value={result.port43} />
            <InfoRow label="Registration Date" value={formatDate(result.registrationDate)} />
            <InfoRow label="Expiration Date" value={formatDate(result.expirationDate)} />
            <InfoRow label="Last Updated" value={formatDate(result.lastUpdated)} />
          </div>

          {result.nameservers.length > 0 && (
            <div style={cardStyle}>
              <div style={labelStyle}>Nameservers</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {result.nameservers.map((ns, i) => (
                  <span key={i} style={{
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#c4b5fd',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                  }}>
                    {ns}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.statuses.length > 0 && (
            <div style={cardStyle}>
              <div style={labelStyle}>Domain Status Flags</div>
              <div style={{ marginTop: '8px' }}>
                {result.statuses.map((status, i) => {
                  const normalized = status.replace(/\s+/g, ' ').toLowerCase().replace(/(^| )epp /g, '$1').trim();
                  const desc = statusDescriptions[normalized] || '';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: i < result.statuses.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <span style={{
                        background: status.includes('prohibited') || status.includes('hold') ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                        color: status.includes('prohibited') || status.includes('hold') ? '#fca5a5' : '#86efac',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '0.82rem',
                        fontFamily: 'monospace',
                      }}>
                        {status}
                      </span>
                      {desc && <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{desc}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
