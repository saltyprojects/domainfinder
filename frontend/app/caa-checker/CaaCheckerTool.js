'use client';

import { useState, useCallback } from 'react';

const WELL_KNOWN_CAS = {
  'letsencrypt.org': { name: "Let's Encrypt", color: '#2c5aa0' },
  'digicert.com': { name: 'DigiCert', color: '#0073b7' },
  'sectigo.com': { name: 'Sectigo (Comodo)', color: '#00a651' },
  'comodoca.com': { name: 'Comodo CA', color: '#00a651' },
  'globalsign.com': { name: 'GlobalSign', color: '#e5243b' },
  'godaddy.com': { name: 'GoDaddy', color: '#1bdbdb' },
  'amazon.com': { name: 'Amazon Trust Services', color: '#ff9900' },
  'amazonaws.com': { name: 'AWS Certificate Manager', color: '#ff9900' },
  'google.com': { name: 'Google Trust Services', color: '#4285f4' },
  'googletrust.com': { name: 'Google Trust Services', color: '#4285f4' },
  'pki.goog': { name: 'Google Trust Services', color: '#4285f4' },
  'microsoft.com': { name: 'Microsoft', color: '#00a4ef' },
  'buypass.com': { name: 'Buypass', color: '#00467f' },
  'ssl.com': { name: 'SSL.com', color: '#1a73e8' },
  'entrust.net': { name: 'Entrust', color: '#c8102e' },
  'usertrust.com': { name: 'UserTrust (Sectigo)', color: '#00a651' },
  'trust-provider.com': { name: 'Trust Provider', color: '#6b7280' },
  'zerossl.com': { name: 'ZeroSSL', color: '#4f46e5' },
};

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

function parseCaaValue(data) {
  // CAA record data from dns.google is in format: flag tag "value"
  // e.g. '0 issue "letsencrypt.org"' or '0 iodef "mailto:admin@example.com"'
  const match = data.match(/^(\d+)\s+(issue|issuewild|iodef|contactemail|contactphone)\s+"?([^"]*)"?$/i);
  if (!match) return { flag: 0, tag: 'unknown', value: data };
  return { flag: parseInt(match[1], 10), tag: match[2].toLowerCase(), value: match[3] };
}

function getCAInfo(value) {
  const lower = value.toLowerCase();
  for (const [domain, info] of Object.entries(WELL_KNOWN_CAS)) {
    if (lower.includes(domain)) return info;
  }
  return { name: value, color: '#6b7280' };
}

const TAG_DESCRIPTIONS = {
  issue: 'Authorizes a CA to issue standard (non-wildcard) certificates for this domain.',
  issuewild: 'Authorizes a CA to issue wildcard certificates (*.domain) for this domain.',
  iodef: 'Specifies a URL or email where CAs should report policy violations.',
  contactemail: 'Contact email for the domain administrator (RFC 8657).',
  contactphone: 'Contact phone for the domain administrator (RFC 8657).',
};

const TAG_ICONS = {
  issue: '🔒',
  issuewild: '🌐',
  iodef: '📧',
  contactemail: '📬',
  contactphone: '📞',
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

export default function CaaCheckerTool() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [checkedDomains, setCheckedDomains] = useState([]);

  const checkCAA = useCallback(async () => {
    const d = cleanDomain(domain);
    if (!d) return;
    setLoading(true);
    setError(null);
    setResults(null);

    // Check the domain and all parent domains for CAA records
    const parts = d.split('.');
    const domainsToCheck = [];
    for (let i = 0; i < parts.length - 1; i++) {
      domainsToCheck.push(parts.slice(i).join('.'));
    }

    const allResults = [];
    let foundAt = null;

    try {
      for (const checkDomain of domainsToCheck) {
        const url = `https://dns.google/resolve?name=${encodeURIComponent(checkDomain)}&type=CAA`;
        const res = await fetch(url, { headers: { Accept: 'application/dns-json' } });
        if (!res.ok) throw new Error(`DNS query failed (HTTP ${res.status})`);
        const data = await res.json();

        if (data.Status === 3) {
          // NXDOMAIN
          allResults.push({ domain: checkDomain, status: 'nxdomain', records: [] });
          continue;
        }

        const caaRecords = (data.Answer || []).filter(r => r.type === 257);
        allResults.push({
          domain: checkDomain,
          status: caaRecords.length > 0 ? 'found' : 'empty',
          records: caaRecords.map(r => ({
            ...parseCaaValue(r.data),
            ttl: r.TTL,
            raw: r.data,
          })),
        });

        if (caaRecords.length > 0 && !foundAt) {
          foundAt = checkDomain;
        }
      }

      setCheckedDomains(domainsToCheck);
      setResults({ domain: d, hierarchy: allResults, foundAt });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [domain]);

  const hasIssue = results?.hierarchy?.some(h => h.records.some(r => r.tag === 'issue'));
  const hasIssuewild = results?.hierarchy?.some(h => h.records.some(r => r.tag === 'issuewild'));
  const hasIodef = results?.hierarchy?.some(h => h.records.some(r => r.tag === 'iodef'));
  const totalRecords = results?.hierarchy?.reduce((sum, h) => sum + h.records.length, 0) || 0;

  return (
    <div>
      {/* Input */}
      <div style={{ ...cardStyle, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Enter domain name (e.g. google.com)"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && checkCAA()}
            style={inputStyle}
          />
        </div>
        <button onClick={checkCAA} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Checking…' : 'Check CAA Records'}
        </button>
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
          <div style={{ ...cardStyle, borderColor: results.foundAt ? '#22c55e' : '#f59e0b', background: results.foundAt ? 'rgba(34,197,94,0.05)' : 'rgba(245,158,11,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>{results.foundAt ? '✅' : '⚠️'}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                  {results.foundAt ? 'CAA Records Found' : 'No CAA Records Found'}
                </h3>
                <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                  {results.foundAt
                    ? `${totalRecords} CAA record${totalRecords !== 1 ? 's' : ''} found at ${results.foundAt}`
                    : `No CAA records exist for ${results.domain} or any parent domain. Any CA can issue certificates.`}
                </p>
              </div>
            </div>

            {results.foundAt && (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#9ca3af' }}>issue: </span>
                  <span style={{ color: hasIssue ? '#22c55e' : '#f87171', fontWeight: 600 }}>
                    {hasIssue ? 'Configured' : 'Not set'}
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#9ca3af' }}>issuewild: </span>
                  <span style={{ color: hasIssuewild ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>
                    {hasIssuewild ? 'Configured' : 'Not set'}
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#9ca3af' }}>iodef: </span>
                  <span style={{ color: hasIodef ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>
                    {hasIodef ? 'Configured' : 'Not set'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Hierarchy */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', marginTop: '32px' }}>
            🔍 Domain Hierarchy Check
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '16px' }}>
            CAs walk up the domain hierarchy to find CAA records. The first level with CAA records determines the policy.
          </p>

          {results.hierarchy.map((level) => (
            <div key={level.domain} style={{
              ...cardStyle,
              borderColor: level.status === 'found' ? '#8b5cf6' : 'rgba(255,255,255,0.08)',
              background: level.status === 'found' ? 'rgba(139,92,246,0.05)' : cardStyle.background,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: level.records.length > 0 ? '16px' : 0 }}>
                <span style={{ fontSize: '1.2rem' }}>
                  {level.status === 'found' ? '🟢' : level.status === 'nxdomain' ? '🔴' : '⚪'}
                </span>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '1rem', fontFamily: 'ui-monospace, monospace' }}>{level.domain}</span>
                  <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#9ca3af' }}>
                    {level.status === 'found' ? `${level.records.length} record${level.records.length !== 1 ? 's' : ''}` :
                     level.status === 'nxdomain' ? 'NXDOMAIN' : 'No CAA records'}
                  </span>
                  {level.domain === results.foundAt && (
                    <span style={{
                      marginLeft: '8px', background: '#8b5cf6', color: '#fff', fontSize: '0.7rem',
                      padding: '2px 8px', borderRadius: '4px', fontWeight: 600,
                    }}>ACTIVE POLICY</span>
                  )}
                </div>
              </div>

              {level.records.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {level.records.map((record, idx) => {
                    const caInfo = (record.tag === 'issue' || record.tag === 'issuewild') ? getCAInfo(record.value) : null;
                    return (
                      <div key={idx} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span>{TAG_ICONS[record.tag] || '📋'}</span>
                          <span style={{
                            background: 'rgba(139,92,246,0.2)', color: '#a78bfa',
                            padding: '2px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                            fontFamily: 'ui-monospace, monospace',
                          }}>{record.tag}</span>
                          {record.flag > 0 && (
                            <span style={{
                              background: 'rgba(239,68,68,0.2)', color: '#f87171',
                              padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                            }}>critical (flag={record.flag})</span>
                          )}
                          <span style={{ color: '#ccc', fontFamily: 'ui-monospace, monospace', fontSize: '0.9rem' }}>
                            {record.value || '(empty — denies all)'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#9ca3af' }}>
                          {caInfo && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: caInfo.color, display: 'inline-block' }} />
                              {caInfo.name}
                            </span>
                          )}
                          <span>TTL: {record.ttl}s</span>
                        </div>
                        <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                          {TAG_DESCRIPTIONS[record.tag] || 'Unknown tag type.'}
                          {record.tag === 'issue' && !record.value && ' An empty issue tag means NO CA is authorized to issue certificates.'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Recommendations */}
          {!results.foundAt && (
            <div style={{ ...cardStyle, borderColor: '#f59e0b', background: 'rgba(245,158,11,0.05)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>💡 Recommendation: Add CAA Records</h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '12px' }}>
                Without CAA records, any Certificate Authority can issue SSL/TLS certificates for your domain.
                Adding CAA records restricts certificate issuance to only your authorized CAs, reducing the risk
                of unauthorized certificate issuance.
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px 16px', fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem', color: '#a78bfa', lineHeight: 1.8 }}>
                <div style={{ color: '#6b7280', marginBottom: '4px' }}>; Example CAA records for your DNS:</div>
                <div>{results.domain}. IN CAA 0 issue &quot;letsencrypt.org&quot;</div>
                <div>{results.domain}. IN CAA 0 issuewild &quot;letsencrypt.org&quot;</div>
                <div>{results.domain}. IN CAA 0 iodef &quot;mailto:admin@{results.domain}&quot;</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
