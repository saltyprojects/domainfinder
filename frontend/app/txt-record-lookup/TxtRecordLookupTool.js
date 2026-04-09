'use client';

import { useState, useCallback } from 'react';

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

const VERIFICATION_PATTERNS = [
  { match: /^google-site-verification=/i, name: 'Google Site Verification', icon: '🔍', color: '#4285f4', desc: 'Verifies domain ownership for Google Search Console / Workspace.' },
  { match: /^MS=/, name: 'Microsoft 365', icon: '🪟', color: '#00a4ef', desc: 'Microsoft 365 / Office 365 domain verification.' },
  { match: /^facebook-domain-verification=/i, name: 'Facebook Domain Verification', icon: '📘', color: '#1877f2', desc: 'Meta / Facebook business domain verification.' },
  { match: /^apple-domain-verification=/i, name: 'Apple Domain Verification', icon: '🍎', color: '#a2aaad', desc: 'Apple Pay merchant domain verification.' },
  { match: /^stripe-verification=/i, name: 'Stripe Verification', icon: '💳', color: '#635bff', desc: 'Stripe Apple Pay domain verification.' },
  { match: /^atlassian-domain-verification=/i, name: 'Atlassian Verification', icon: '🅰️', color: '#0052cc', desc: 'Atlassian (Jira/Confluence) domain verification.' },
  { match: /^docusign=/i, name: 'DocuSign', icon: '✍️', color: '#ffcc22', desc: 'DocuSign domain verification.' },
  { match: /^adobe-idp-site-verification=/i, name: 'Adobe IdP', icon: '🅰️', color: '#fa0f00', desc: 'Adobe Identity Provider verification.' },
  { match: /^adobe-sign-verification=/i, name: 'Adobe Sign', icon: '✍️', color: '#fa0f00', desc: 'Adobe Sign domain verification.' },
  { match: /^zoom-verification=/i, name: 'Zoom', icon: '📹', color: '#2d8cff', desc: 'Zoom meetings domain verification.' },
  { match: /^cisco-ci-domain-verification=/i, name: 'Cisco', icon: '🌐', color: '#1ba0d7', desc: 'Cisco WebEx domain verification.' },
  { match: /^pinterest-site-verification=/i, name: 'Pinterest', icon: '📌', color: '#e60023', desc: 'Pinterest domain verification.' },
  { match: /^miro-verification=/i, name: 'Miro', icon: '🎨', color: '#ffd02f', desc: 'Miro domain verification.' },
  { match: /^webexdomainverification\./i, name: 'WebEx', icon: '📹', color: '#1ba0d7', desc: 'Cisco WebEx verification token.' },
  { match: /^_globalsign-domain-verification=/i, name: 'GlobalSign', icon: '🔒', color: '#e5243b', desc: 'GlobalSign certificate domain verification.' },
  { match: /^ahrefs-site-verification_/i, name: 'Ahrefs', icon: '📊', color: '#ff6000', desc: 'Ahrefs site verification.' },
  { match: /^yandex-verification:/i, name: 'Yandex', icon: '🔍', color: '#ff0000', desc: 'Yandex Webmaster verification.' },
  { match: /^mailru-verification:/i, name: 'Mail.ru', icon: '📧', color: '#168de2', desc: 'Mail.ru verification.' },
  { match: /^brave-ledger-verification=/i, name: 'Brave Rewards', icon: '🦁', color: '#fb542b', desc: 'Brave Rewards creator verification.' },
  { match: /^onetrust-domain-verification=/i, name: 'OneTrust', icon: '🛡️', color: '#005b9f', desc: 'OneTrust privacy domain verification.' },
  { match: /^loaderio=/i, name: 'Loader.io', icon: '⚡', color: '#41b883', desc: 'Loader.io load testing verification.' },
];

function categorize(value) {
  const v = value.trim();
  if (/^v=spf1/i.test(v)) return { type: 'SPF', icon: '📨', color: '#10b981', desc: 'Sender Policy Framework — authorizes mail servers to send email for this domain.' };
  if (/^v=DKIM1/i.test(v)) return { type: 'DKIM', icon: '🔐', color: '#8b5cf6', desc: 'DomainKeys Identified Mail — public key used to cryptographically verify email signatures.' };
  if (/^v=DMARC1/i.test(v)) return { type: 'DMARC', icon: '🛡️', color: '#ef4444', desc: 'Domain-based Message Authentication, Reporting & Conformance — email authentication policy.' };
  if (/^v=BIMI1/i.test(v)) return { type: 'BIMI', icon: '🖼️', color: '#f59e0b', desc: 'Brand Indicators for Message Identification — logo display in supporting email clients.' };
  if (/^v=TLSRPTv1/i.test(v)) return { type: 'TLS-RPT', icon: '📡', color: '#06b6d4', desc: 'TLS Reporting — destination for SMTP TLS error reports (RFC 8460).' };
  if (/^v=STSv1/i.test(v)) return { type: 'MTA-STS', icon: '🔒', color: '#06b6d4', desc: 'SMTP MTA Strict Transport Security — requires TLS for email delivery.' };

  for (const p of VERIFICATION_PATTERNS) {
    if (p.match.test(v)) return { type: p.name, icon: p.icon, color: p.color, desc: p.desc, verification: true };
  }

  // Detect generic verification-style records
  if (/verification|site-verification/i.test(v)) {
    return { type: 'Verification (Generic)', icon: '✅', color: '#6b7280', desc: 'A domain verification token from a third-party service.' };
  }

  return { type: 'Generic TXT', icon: '📄', color: '#6b7280', desc: 'A general-purpose TXT record. Could be configuration data, a verification token, or human-readable info.' };
}

function parseSpf(value) {
  const parts = value.split(/\s+/).slice(1); // skip v=spf1
  const mechanisms = [];
  for (const p of parts) {
    if (!p) continue;
    let qualifier = '+';
    let mech = p;
    if (/^[+\-~?]/.test(p)) {
      qualifier = p[0];
      mech = p.slice(1);
    }
    mechanisms.push({ qualifier, mech });
  }
  return mechanisms;
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
  whiteSpace: 'nowrap',
};

const QUALIFIER_LABELS = {
  '+': { label: 'PASS', color: '#10b981' },
  '-': { label: 'FAIL', color: '#ef4444' },
  '~': { label: 'SOFTFAIL', color: '#f59e0b' },
  '?': { label: 'NEUTRAL', color: '#6b7280' },
};

export default function TxtRecordLookupTool() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const lookup = useCallback(async () => {
    const d = cleanDomain(domain);
    if (!d) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const url = `https://dns.google/resolve?name=${encodeURIComponent(d)}&type=TXT`;
      const res = await fetch(url, { headers: { Accept: 'application/dns-json' } });
      if (!res.ok) throw new Error(`DNS query failed (HTTP ${res.status})`);
      const data = await res.json();

      if (data.Status === 3) {
        throw new Error(`Domain ${d} does not exist (NXDOMAIN).`);
      }

      const records = (data.Answer || [])
        .filter(r => r.type === 16)
        .map(r => {
          // TXT records may be split into multiple quoted strings; concatenate.
          const value = r.data.replace(/^"(.*)"$/s, '$1').replace(/"\s+"/g, '');
          return {
            value,
            ttl: r.TTL,
            ...categorize(value),
          };
        });

      setResults({ domain: d, records });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [domain]);

  const counts = results ? results.records.reduce((acc, r) => {
    const key = r.type;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}) : {};

  const categories = ['all', 'Email', 'Verification', 'Other'];
  const filteredRecords = results ? results.records.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'Email') return ['SPF', 'DKIM', 'DMARC', 'BIMI', 'TLS-RPT', 'MTA-STS'].includes(r.type);
    if (filter === 'Verification') return r.verification || r.type === 'Verification (Generic)';
    if (filter === 'Other') return r.type === 'Generic TXT';
    return true;
  }) : [];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

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
            onKeyDown={e => e.key === 'Enter' && lookup()}
            style={inputStyle}
          />
        </div>
        <button onClick={lookup} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Looking up…' : 'Lookup TXT Records'}
        </button>
      </div>

      {error && (
        <div style={{ ...cardStyle, borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
          <p style={{ color: '#f87171', margin: 0 }}>❌ {error}</p>
        </div>
      )}

      {results && (
        <>
          {/* Summary */}
          <div style={{ ...cardStyle, borderColor: results.records.length > 0 ? '#22c55e' : '#f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>{results.records.length > 0 ? '✅' : 'ℹ️'}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                  {results.records.length} TXT record{results.records.length !== 1 ? 's' : ''} for {results.domain}
                </h3>
                <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                  Categorized and parsed for SPF, DKIM, DMARC, and verification tokens.
                </p>
              </div>
            </div>

            {results.records.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                {Object.entries(counts).map(([type, count]) => (
                  <div key={type} style={{
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '6px',
                    padding: '4px 12px',
                    fontSize: '0.8rem',
                    color: '#c4b5fd',
                    fontWeight: 600,
                  }}>
                    {type}: {count}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter tabs */}
          {results.records.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    background: filter === cat ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                    border: '1px solid ' + (filter === cat ? '#8b5cf6' : 'rgba(255,255,255,0.1)'),
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  {cat === 'all' ? 'All Records' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Records */}
          {filteredRecords.map((r, i) => (
            <div key={i} style={{ ...cardStyle, borderColor: r.color, background: `${r.color}0d` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.5rem' }}>{r.icon}</span>
                <span style={{
                  background: r.color,
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}>{r.type}</span>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>TTL: {r.ttl}s</span>
                <button
                  onClick={() => copyToClipboard(r.value)}
                  style={{
                    marginLeft: 'auto',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#9ca3af',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                  }}
                >
                  📋 Copy
                </button>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.85rem',
                color: '#e5e7eb',
                wordBreak: 'break-all',
                marginBottom: '8px',
              }}>
                {r.value}
              </div>

              <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '8px 0 0', lineHeight: 1.6 }}>
                {r.desc}
              </p>

              {/* SPF parsed view */}
              {r.type === 'SPF' && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '8px' }}>SPF Mechanisms:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {parseSpf(r.value).map((m, idx) => {
                      const ql = QUALIFIER_LABELS[m.qualifier] || QUALIFIER_LABELS['+'];
                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                          <span style={{
                            background: ql.color,
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            minWidth: '60px',
                            textAlign: 'center',
                          }}>{ql.label}</span>
                          <code style={{ color: '#a78bfa', fontFamily: 'ui-monospace, monospace' }}>{m.mech}</code>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DMARC parsed view */}
              {r.type === 'DMARC' && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '8px' }}>DMARC Tags:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {r.value.split(';').map(t => t.trim()).filter(Boolean).map((tag, idx) => (
                      <code key={idx} style={{
                        background: 'rgba(239,68,68,0.15)',
                        color: '#fca5a5',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontFamily: 'ui-monospace, monospace',
                      }}>{tag}</code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {results.records.length === 0 && (
            <div style={{ ...cardStyle, textAlign: 'center', color: '#9ca3af' }}>
              No TXT records found for this domain.
            </div>
          )}
        </>
      )}
    </div>
  );
}
