'use client';

import { useState, useCallback } from 'react';

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

function extractRegistrantInfo(rdap) {
  const info = {
    registrant: null,
    admin: null,
    tech: null,
    abuse: null,
    registrar: null,
    registrarUrl: null,
    nameservers: [],
    status: [],
    events: {},
    rawEntities: [],
  };

  // Extract events
  if (rdap.events) {
    for (const ev of rdap.events) {
      if (ev.eventAction && ev.eventDate) {
        info.events[ev.eventAction] = ev.eventDate;
      }
    }
  }

  // Extract status
  if (rdap.status) {
    info.status = rdap.status;
  }

  // Extract nameservers
  if (rdap.nameservers) {
    info.nameservers = rdap.nameservers.map(ns => ns.ldhName || ns.unicodeName || '').filter(Boolean);
  }

  // Extract entities (registrant, admin, tech, abuse, registrar)
  if (rdap.entities) {
    for (const entity of rdap.entities) {
      const roles = entity.roles || [];
      const parsed = parseEntity(entity);

      if (roles.includes('registrar')) {
        info.registrar = parsed.name || parsed.org || entity.handle;
        if (entity.links) {
          const selfLink = entity.links.find(l => l.rel === 'self');
          if (selfLink) info.registrarUrl = selfLink.href;
        }
        // Check for abuse contact within registrar entity
        if (entity.entities) {
          for (const sub of entity.entities) {
            const subRoles = sub.roles || [];
            if (subRoles.includes('abuse')) {
              const abuseParsed = parseEntity(sub);
              info.abuse = abuseParsed;
            }
          }
        }
      }

      if (roles.includes('registrant')) {
        info.registrant = parsed;
      }
      if (roles.includes('administrative')) {
        info.admin = parsed;
      }
      if (roles.includes('technical')) {
        info.tech = parsed;
      }
      if (roles.includes('abuse') && !info.abuse) {
        info.abuse = parsed;
      }

      info.rawEntities.push({ roles, ...parsed });
    }
  }

  return info;
}

function parseEntity(entity) {
  const result = {
    handle: entity.handle || null,
    name: null,
    org: null,
    email: null,
    phone: null,
    address: null,
    country: null,
  };

  if (entity.vcardArray && entity.vcardArray[1]) {
    const vcard = entity.vcardArray[1];
    for (const field of vcard) {
      const [type, , , value] = field;
      if (type === 'fn') result.name = value;
      if (type === 'org') result.org = Array.isArray(value) ? value[0] : value;
      if (type === 'email') result.email = value;
      if (type === 'tel') result.phone = value;
      if (type === 'adr') {
        if (Array.isArray(value)) {
          const parts = value.filter(v => v && typeof v === 'string');
          if (parts.length > 0) result.address = parts.join(', ');
          // Last element is often country
          const last = value[value.length - 1];
          if (last && typeof last === 'string' && last.length <= 3) result.country = last;
        }
      }
    }
  }

  return result;
}

function isRedacted(val) {
  if (!val) return true;
  const lower = val.toLowerCase();
  return lower.includes('redacted') || lower.includes('privacy') ||
    lower.includes('data protected') || lower.includes('not disclosed') ||
    lower.includes('whoisguard') || lower.includes('withheld') ||
    lower.includes('contact privacy') || lower.includes('domains by proxy') ||
    lower.includes('private registration') || lower === 'n/a';
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '10px',
  border: '1px solid #2a2a2a',
  background: '#111',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const btnStyle = {
  padding: '14px 32px',
  borderRadius: '10px',
  border: 'none',
  background: '#8b5cf6',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background 0.2s',
};

const cardStyle = {
  background: '#111',
  border: '1px solid #1e1e1e',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '16px',
};

const labelStyle = {
  fontSize: '0.75rem',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 600,
  marginBottom: '4px',
};

const valStyle = {
  fontSize: '1rem',
  color: '#e5e7eb',
  wordBreak: 'break-all',
};

const redactedStyle = {
  fontSize: '1rem',
  color: '#ef4444',
  fontStyle: 'italic',
};

function ContactCard({ title, icon, data }) {
  if (!data) return null;
  const fields = [
    { label: 'Name', value: data.name },
    { label: 'Organization', value: data.org },
    { label: 'Email', value: data.email },
    { label: 'Phone', value: data.phone },
    { label: 'Address', value: data.address },
    { label: 'Country', value: data.country },
    { label: 'Handle', value: data.handle },
  ].filter(f => f.value);

  if (fields.length === 0) return null;

  const allRedacted = fields.every(f => isRedacted(f.value));

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{icon}</span> {title}
        {allRedacted && (
          <span style={{ fontSize: '0.75rem', background: '#7f1d1d', color: '#fca5a5', padding: '2px 8px', borderRadius: '6px', fontWeight: 500 }}>
            Privacy Protected
          </span>
        )}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {fields.map(f => (
          <div key={f.label}>
            <div style={labelStyle}>{f.label}</div>
            <div style={isRedacted(f.value) ? redactedStyle : valStyle}>{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrivacyBadge({ info }) {
  const hasRegistrant = info.registrant && !Object.values(info.registrant).every(v => !v || isRedacted(v));
  const level = hasRegistrant ? 'exposed' : 'protected';

  const configs = {
    exposed: { bg: '#7f1d1d', color: '#fca5a5', label: '⚠️ Registrant Info Exposed', desc: 'WHOIS/RDAP data contains identifiable registrant information.' },
    protected: { bg: '#14532d', color: '#86efac', label: '🔒 Privacy Protected', desc: 'Registrant details are redacted or hidden behind a privacy service.' },
  };

  const c = configs[level];
  return (
    <div style={{ ...cardStyle, borderColor: level === 'exposed' ? '#7f1d1d' : '#14532d' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{ background: c.bg, color: c.color, padding: '4px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
          {c.label}
        </span>
      </div>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>{c.desc}</p>
    </div>
  );
}

export default function ReverseWhoisTool() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('single'); // 'single' or 'multi'
  const [multiInput, setMultiInput] = useState('');
  const [multiResults, setMultiResults] = useState(null);

  const lookupSingle = useCallback(async () => {
    const domain = cleanDomain(input);
    if (!domain) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch(`https://rdap.org/domain/${domain}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error(`Domain "${domain}" not found in RDAP. It may not be registered or the TLD may not support RDAP.`);
        throw new Error(`RDAP lookup failed (HTTP ${res.status}). Try again in a moment.`);
      }
      const data = await res.json();
      const info = extractRegistrantInfo(data);
      setResults({ domain, info, raw: data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const lookupMulti = useCallback(async () => {
    const domains = multiInput
      .split(/[\n,]+/)
      .map(d => cleanDomain(d))
      .filter(Boolean)
      .slice(0, 20);

    if (domains.length === 0) return;
    setLoading(true);
    setError(null);
    setMultiResults(null);

    const all = [];
    for (const domain of domains) {
      try {
        const res = await fetch(`https://rdap.org/domain/${domain}`);
        if (res.ok) {
          const data = await res.json();
          const info = extractRegistrantInfo(data);
          all.push({ domain, info, status: 'ok' });
        } else {
          all.push({ domain, info: null, status: 'error', error: `HTTP ${res.status}` });
        }
      } catch {
        all.push({ domain, info: null, status: 'error', error: 'Network error' });
      }
      // Small delay to be polite to API
      await new Promise(r => setTimeout(r, 300));
    }

    // Group by registrant/org
    const groups = {};
    for (const r of all) {
      if (!r.info) {
        const key = '__error__';
        if (!groups[key]) groups[key] = { label: 'Lookup Failed', domains: [] };
        groups[key].domains.push(r);
        continue;
      }
      const reg = r.info.registrant;
      const key = reg
        ? (reg.org || reg.name || reg.email || r.info.registrar || 'Unknown').toLowerCase().replace(/redacted.*|privacy.*|not disclosed.*/gi, 'Privacy Protected')
        : (r.info.registrar || 'Unknown');
      if (!groups[key]) groups[key] = { label: key, domains: [] };
      groups[key].domains.push(r);
    }

    setMultiResults({ domains: all, groups });
    setLoading(false);
  }, [multiInput]);

  return (
    <div>
      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { key: 'single', label: '🔍 Single Domain Lookup' },
          { key: 'multi', label: '📋 Multi-Domain Compare' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setMode(tab.key)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: `1px solid ${mode === tab.key ? '#8b5cf6' : '#2a2a2a'}`,
              background: mode === tab.key ? 'rgba(139,92,246,0.15)' : '#111',
              color: mode === tab.key ? '#a78bfa' : '#9ca3af',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === 'single' ? (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && lookupSingle()}
                placeholder="Enter domain name (e.g. example.com)"
                style={inputStyle}
              />
            </div>
            <button
              onClick={lookupSingle}
              disabled={loading || !input.trim()}
              style={{ ...btnStyle, opacity: loading || !input.trim() ? 0.5 : 1 }}
            >
              {loading ? 'Looking up…' : 'Lookup WHOIS'}
            </button>
          </div>

          {error && (
            <div style={{ ...cardStyle, borderColor: '#7f1d1d', color: '#fca5a5' }}>
              ⚠️ {error}
            </div>
          )}

          {results && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>
                WHOIS Data for <span style={{ color: '#8b5cf6' }}>{results.domain}</span>
              </h2>

              <PrivacyBadge info={results.info} />

              {/* Summary Card */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>📋 Domain Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {results.info.registrar && (
                    <div>
                      <div style={labelStyle}>Registrar</div>
                      <div style={valStyle}>{results.info.registrar}</div>
                    </div>
                  )}
                  {results.info.events.registration && (
                    <div>
                      <div style={labelStyle}>Registered</div>
                      <div style={valStyle}>{new Date(results.info.events.registration).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  )}
                  {results.info.events.expiration && (
                    <div>
                      <div style={labelStyle}>Expires</div>
                      <div style={valStyle}>{new Date(results.info.events.expiration).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  )}
                  {results.info.events['last changed'] && (
                    <div>
                      <div style={labelStyle}>Last Updated</div>
                      <div style={valStyle}>{new Date(results.info.events['last changed']).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  )}
                  {results.info.nameservers.length > 0 && (
                    <div>
                      <div style={labelStyle}>Nameservers</div>
                      <div style={valStyle}>{results.info.nameservers.join(', ')}</div>
                    </div>
                  )}
                  {results.info.status.length > 0 && (
                    <div>
                      <div style={labelStyle}>Status Codes</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {results.info.status.map(s => (
                          <span key={s} style={{ background: '#1e1e1e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#9ca3af' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ContactCard title="Registrant Contact" icon="👤" data={results.info.registrant} />
              <ContactCard title="Administrative Contact" icon="🏢" data={results.info.admin} />
              <ContactCard title="Technical Contact" icon="🔧" data={results.info.tech} />
              <ContactCard title="Abuse Contact" icon="🚨" data={results.info.abuse} />

              {/* Related Domain Search Tips */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>💡 Find Related Domains</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  {results.info.registrant && !isRedacted(results.info.registrant.org) ? (
                    <>
                      This domain is registered to <strong style={{ color: '#e5e7eb' }}>{results.info.registrant.org || results.info.registrant.name}</strong>.
                      Use the <strong>Multi-Domain Compare</strong> tab to check if other domains share the same registrant.
                    </>
                  ) : (
                    <>
                      This domain uses WHOIS privacy protection — registrant details are hidden.
                      Try the <strong>Multi-Domain Compare</strong> tab to check if suspected related domains share the same registrar, nameservers, or registration patterns.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '12px' }}>
            Enter up to 20 domains (one per line or comma-separated) to compare registrant info and find related domains.
          </p>
          <textarea
            value={multiInput}
            onChange={e => setMultiInput(e.target.value)}
            placeholder={'example.com\nexample.net\nexample.org\nanotherdomain.com'}
            rows={6}
            style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical', marginBottom: '12px' }}
          />
          <button
            onClick={lookupMulti}
            disabled={loading || !multiInput.trim()}
            style={{ ...btnStyle, opacity: loading || !multiInput.trim() ? 0.5 : 1, marginBottom: '24px' }}
          >
            {loading ? 'Looking up domains…' : 'Compare Registrants'}
          </button>

          {error && (
            <div style={{ ...cardStyle, borderColor: '#7f1d1d', color: '#fca5a5' }}>
              ⚠️ {error}
            </div>
          )}

          {multiResults && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>
                Results for {multiResults.domains.length} Domain{multiResults.domains.length !== 1 ? 's' : ''}
              </h2>

              {/* Grouped by registrant */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>👥 Grouped by Registrant / Organization</h3>
                {Object.entries(multiResults.groups).map(([key, group]) => (
                  <div key={key} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #1e1e1e' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#a78bfa', marginBottom: '8px' }}>
                      {group.label} ({group.domains.length} domain{group.domains.length !== 1 ? 's' : ''})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {group.domains.map(d => (
                        <span key={d.domain} style={{
                          background: d.status === 'ok' ? '#1e1e1e' : '#7f1d1d',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          color: d.status === 'ok' ? '#e5e7eb' : '#fca5a5',
                        }}>
                          {d.domain}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                      {['Domain', 'Registrar', 'Registrant/Org', 'Registered', 'Expires', 'Nameservers'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {multiResults.domains.map(d => (
                      <tr key={d.domain} style={{ borderBottom: '1px solid #1e1e1e' }}>
                        <td style={{ padding: '10px 12px', color: '#8b5cf6', fontWeight: 600 }}>{d.domain}</td>
                        {d.info ? (
                          <>
                            <td style={{ padding: '10px 12px', color: '#e5e7eb' }}>{d.info.registrar || '—'}</td>
                            <td style={{ padding: '10px 12px', color: d.info.registrant && !isRedacted(d.info.registrant.org || d.info.registrant.name) ? '#e5e7eb' : '#ef4444' }}>
                              {d.info.registrant ? (d.info.registrant.org || d.info.registrant.name || 'Redacted') : '—'}
                            </td>
                            <td style={{ padding: '10px 12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                              {d.info.events.registration ? new Date(d.info.events.registration).toLocaleDateString() : '—'}
                            </td>
                            <td style={{ padding: '10px 12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                              {d.info.events.expiration ? new Date(d.info.events.expiration).toLocaleDateString() : '—'}
                            </td>
                            <td style={{ padding: '10px 12px', color: '#9ca3af', fontSize: '0.8rem' }}>
                              {d.info.nameservers.slice(0, 2).join(', ') || '—'}
                            </td>
                          </>
                        ) : (
                          <td colSpan={5} style={{ padding: '10px 12px', color: '#ef4444' }}>Lookup failed: {d.error}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Match Indicators */}
              {(() => {
                const ok = multiResults.domains.filter(d => d.info);
                if (ok.length < 2) return null;

                const registrars = new Set(ok.map(d => d.info.registrar).filter(Boolean));
                const nsGroups = ok.map(d => d.info.nameservers.sort().join(','));
                const uniqueNs = new Set(nsGroups.filter(Boolean));

                const matches = [];
                if (registrars.size === 1) matches.push({ label: 'Same Registrar', detail: [...registrars][0], icon: '🏷️' });
                if (uniqueNs.size === 1 && [...uniqueNs][0]) matches.push({ label: 'Same Nameservers', detail: ok[0].info.nameservers.join(', '), icon: '🗂️' });

                if (matches.length === 0) return null;
                return (
                  <div style={{ ...cardStyle, borderColor: '#14532d', marginTop: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>🔗 Relationship Indicators</h3>
                    {matches.map(m => (
                      <div key={m.label} style={{ marginBottom: '8px' }}>
                        <span style={{ marginRight: '8px' }}>{m.icon}</span>
                        <strong style={{ color: '#e5e7eb' }}>{m.label}:</strong>
                        <span style={{ color: '#9ca3af', marginLeft: '8px' }}>{m.detail}</span>
                      </div>
                    ))}
                    <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '12px', marginBottom: 0 }}>
                      Matching registrar or nameservers may indicate domains are managed by the same owner.
                    </p>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}
