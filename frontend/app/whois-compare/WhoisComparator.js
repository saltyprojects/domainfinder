'use client';

import { useState, useCallback } from 'react';

const RDAP_BOOTSTRAP = 'https://rdap.org/domain/';

function extractField(rdap, fieldName) {
  if (!rdap) return '—';
  switch (fieldName) {
    case 'name': return rdap.ldhName || rdap.unicodeName || '—';
    case 'handle': return rdap.handle || '—';
    case 'status': return rdap.status?.join(', ') || '—';
    case 'registrar': {
      const entity = rdap.entities?.find(e => e.roles?.includes('registrar'));
      return entity?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || entity?.handle || '—';
    }
    case 'registrant': {
      const entity = rdap.entities?.find(e => e.roles?.includes('registrant'));
      return entity?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'Redacted / Privacy Protected';
    }
    case 'registered': {
      const evt = rdap.events?.find(e => e.eventAction === 'registration');
      return evt?.eventDate ? new Date(evt.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
    }
    case 'expires': {
      const evt = rdap.events?.find(e => e.eventAction === 'expiration');
      return evt?.eventDate ? new Date(evt.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
    }
    case 'updated': {
      const evt = rdap.events?.find(e => e.eventAction === 'last changed');
      return evt?.eventDate ? new Date(evt.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
    }
    case 'nameservers': {
      return rdap.nameservers?.map(ns => ns.ldhName).join(', ') || '—';
    }
    case 'dnssec': {
      if (rdap.secureDNS?.delegationSigned) return '✅ Signed';
      if (rdap.secureDNS?.delegationSigned === false) return '❌ Unsigned';
      return '—';
    }
    case 'age': {
      const evt = rdap.events?.find(e => e.eventAction === 'registration');
      if (!evt?.eventDate) return '—';
      const ms = Date.now() - new Date(evt.eventDate).getTime();
      const years = Math.floor(ms / (365.25 * 86400000));
      const days = Math.floor((ms % (365.25 * 86400000)) / 86400000);
      return years > 0 ? `${years} year${years !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}` : `${days} day${days !== 1 ? 's' : ''}`;
    }
    case 'daysUntilExpiry': {
      const evt = rdap.events?.find(e => e.eventAction === 'expiration');
      if (!evt?.eventDate) return '—';
      const days = Math.ceil((new Date(evt.eventDate).getTime() - Date.now()) / 86400000);
      if (days < 0) return `Expired ${Math.abs(days)} days ago`;
      return `${days} days`;
    }
    default: return '—';
  }
}

const FIELDS = [
  { key: 'name', label: 'Domain Name' },
  { key: 'registrar', label: 'Registrar' },
  { key: 'registrant', label: 'Registrant' },
  { key: 'status', label: 'Status' },
  { key: 'registered', label: 'Registration Date' },
  { key: 'expires', label: 'Expiration Date' },
  { key: 'updated', label: 'Last Updated' },
  { key: 'age', label: 'Domain Age' },
  { key: 'daysUntilExpiry', label: 'Days Until Expiry' },
  { key: 'nameservers', label: 'Nameservers' },
  { key: 'dnssec', label: 'DNSSEC' },
  { key: 'handle', label: 'Registry Handle' },
];

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  return d;
}

export default function WhoisComparator() {
  const [domain1, setDomain1] = useState('');
  const [domain2, setDomain2] = useState('');
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRdap = useCallback(async (domain) => {
    const res = await fetch(`${RDAP_BOOTSTRAP}${encodeURIComponent(domain)}`, {
      headers: { Accept: 'application/rdap+json' },
    });
    if (!res.ok) throw new Error(`RDAP lookup failed for ${domain} (HTTP ${res.status})`);
    return res.json();
  }, []);

  const handleCompare = useCallback(async (e) => {
    e.preventDefault();
    const d1 = cleanDomain(domain1);
    const d2 = cleanDomain(domain2);
    if (!d1 || !d2) { setError('Please enter two domain names.'); return; }
    if (d1 === d2) { setError('Please enter two different domains to compare.'); return; }

    setError('');
    setLoading(true);
    setData1(null);
    setData2(null);

    try {
      const [r1, r2] = await Promise.allSettled([fetchRdap(d1), fetchRdap(d2)]);
      if (r1.status === 'rejected' && r2.status === 'rejected') {
        setError('Could not fetch WHOIS data for either domain. Make sure both domains are registered.');
      } else {
        if (r1.status === 'fulfilled') setData1(r1.value);
        else setError(`Could not fetch data for ${d1}.`);
        if (r2.status === 'fulfilled') setData2(r2.value);
        else setError(prev => prev ? `${prev} Could not fetch data for ${d2}.` : `Could not fetch data for ${d2}.`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [domain1, domain2, fetchRdap]);

  const inputStyle = {
    flex: 1, minWidth: 0, padding: '12px 16px', background: '#111', border: '1px solid #2a2a2a',
    borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none',
  };

  const diffHighlight = (val1, val2) => {
    if (!val1 || !val2 || val1 === '—' || val2 === '—') return {};
    return val1 !== val2 ? { color: '#fbbf24' } : { color: '#4ade80' };
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={handleCompare} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <input
          type="text" placeholder="First domain (e.g. google.com)"
          value={domain1} onChange={e => setDomain1(e.target.value)}
          style={inputStyle}
        />
        <span style={{ display: 'flex', alignItems: 'center', color: '#666', fontWeight: 700, fontSize: '1.1rem' }}>vs</span>
        <input
          type="text" placeholder="Second domain (e.g. bing.com)"
          value={domain2} onChange={e => setDomain2(e.target.value)}
          style={inputStyle}
        />
        <button
          type="submit" disabled={loading}
          style={{
            padding: '12px 28px', background: '#8b5cf6', color: '#fff', border: 'none',
            borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Comparing…' : 'Compare WHOIS'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '12px 16px', background: '#1c1017', border: '1px solid #7f1d1d', borderRadius: '10px', color: '#fca5a5', marginBottom: '24px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {(data1 || data2) && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #2a2a2a', color: '#8b5cf6', fontWeight: 700, minWidth: '140px' }}>Field</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #2a2a2a', color: '#8b5cf6', fontWeight: 700 }}>{cleanDomain(domain1) || 'Domain 1'}</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #2a2a2a', color: '#8b5cf6', fontWeight: 700 }}>{cleanDomain(domain2) || 'Domain 2'}</th>
              </tr>
            </thead>
            <tbody>
              {FIELDS.map(({ key, label }) => {
                const v1 = extractField(data1, key);
                const v2 = extractField(data2, key);
                return (
                  <tr key={key} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '10px 16px', color: '#9ca3af', fontWeight: 600 }}>{label}</td>
                    <td style={{ padding: '10px 16px', color: '#ccc', wordBreak: 'break-word', ...diffHighlight(v1, v2) }}>{v1}</td>
                    <td style={{ padding: '10px 16px', color: '#ccc', wordBreak: 'break-word', ...diffHighlight(v1, v2) }}>{v2}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '12px' }}>
            🟢 Green = same value &nbsp;&nbsp; 🟡 Yellow = different value
          </p>
        </div>
      )}
    </div>
  );
}
