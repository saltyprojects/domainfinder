'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const REGISTRARS = [
  { name: 'Dynadot', url: (d) => `https://www.anrdoezrs.net/click-101695072-12589558?url=${encodeURIComponent('https://www.dynadot.com/domain/search?domain=' + d)}` },
  { name: 'GoDaddy', url: (d) => `https://www.godaddy.com/domainsearch/find?domainToCheck=${d}` },
  { name: 'Cloudflare', url: (d) => `https://www.cloudflare.com/products/registrar/` },
  { name: 'Porkbun', url: (d) => `https://porkbun.com/checkout/search?domain=${d}` },
];

export function DomainDetail({ domain }) {
  const [availability, setAvailability] = useState(null);
  const [whois, setWhois] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(true);
  const [loadingWhois, setLoadingWhois] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseName = domain.includes('.') ? domain.split('.')[0] : domain;
  const hasTld = domain.includes('.');

  // Check availability
  useEffect(() => {
    setLoadingAvail(true);
    fetch(`${API_BASE}/api/search/?q=${encodeURIComponent(baseName)}`)
      .then(r => r.json())
      .then(data => {
        setAvailability(data.results || []);
        // If specific domain requested, load WHOIS for taken ones
        if (hasTld) {
          const match = data.results?.find(r => r.full_domain === domain);
          if (match && !match.available) {
            setLoadingWhois(true);
            fetch(`${API_BASE}/api/whois/?domain=${encodeURIComponent(domain)}`)
              .then(r => r.json())
              .then(setWhois)
              .finally(() => setLoadingWhois(false));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAvail(false));
  }, [domain, baseName, hasTld]);

  // Load suggestions
  useEffect(() => {
    fetch(`${API_BASE}/api/suggestions/?q=${encodeURIComponent(baseName)}`)
      .then(r => r.json())
      .then(data => setSuggestions((data.suggestions || []).filter(s => s.available).slice(0, 12)))
      .catch(() => {});
  }, [baseName]);

  const copyDomain = () => {
    navigator.clipboard.writeText(domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shareDomain = () => {
    if (navigator.share) {
      navigator.share({ title: `${domain} on DomyDomains`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const currentResult = hasTld ? availability?.find(r => r.full_domain === domain) : null;
  const available = availability?.filter(r => r.available) || [];
  const taken = availability?.filter(r => !r.available) || [];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
        <Link href="/" style={{ color: 'var(--green)' }}>🌐 DomyDomains</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span>{domain}</span>
      </div>

      {/* Domain header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{domain}</h1>
          {currentResult && (
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
              background: currentResult.available ? 'var(--green-dim)' : 'var(--red-dim)',
              color: currentResult.available ? 'var(--green)' : 'var(--red)',
            }}>
              {currentResult.available ? '✓ Available' : '✗ Taken'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button onClick={copyDomain} style={{
            padding: '8px 16px', background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer',
          }}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button onClick={shareDomain} style={{
            padding: '8px 16px', background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer',
          }}>
            🔗 Share
          </button>
        </div>
      </div>

      {loadingAvail && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '52px' }} />
          ))}
        </div>
      )}

      {/* Register at section (for available domains) */}
      {currentResult?.available && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Register at</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {REGISTRARS.map(reg => (
              <a key={reg.name} href={reg.url(domain)} target="_blank" rel="noopener noreferrer" style={{
                padding: '14px 18px', background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.15)',
                borderRadius: 'var(--radius)', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem',
                color: 'var(--green)', transition: 'background 0.15s',
              }}>
                {reg.name} →
              </a>
            ))}
          </div>
          {currentResult.price && (
            <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Starting from <strong>${currentResult.price.toFixed(2)}</strong>/yr
            </p>
          )}
        </section>
      )}

      {/* WHOIS section */}
      {(loadingWhois || whois) && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>WHOIS Intelligence</h2>
          {loadingWhois ? (
            <div className="skeleton" style={{ height: '120px' }} />
          ) : whois && !whois.error ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
              {whois.expiring_soon && (
                <div style={{
                  padding: '8px 12px', background: 'rgba(255,180,0,0.15)', border: '1px solid rgba(255,180,0,0.3)',
                  borderRadius: '6px', marginBottom: '12px', fontSize: '0.85rem', color: '#ffb400', fontWeight: 500,
                }}>
                  ⚡ This domain expires soon — snipe opportunity!
                </div>
              )}
              {[
                ['Registrar', whois.registrar],
                ['Registered', whois.registered_date],
                ['Expires', whois.expiry_date],
                ['Updated', whois.updated_date],
                ['Nameservers', whois.nameservers?.join(', ')],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                  borderBottom: '1px solid var(--border)', fontSize: '0.9rem',
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>WHOIS data unavailable.</p>
          )}
        </section>
      )}

      {/* All TLDs */}
      {!loadingAvail && availability && availability.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>
            All TLDs for <strong>{baseName}</strong>
          </h2>
          {available.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              {available.map(r => (
                <div key={r.full_domain} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'var(--green-dim)',
                  border: '1px solid rgba(34,197,94,0.15)', borderRadius: 'var(--radius)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
                    <Link href={`/domain/${r.full_domain}`} style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {r.full_domain}
                    </Link>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {r.price && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>${r.price.toFixed(2)}</span>}
                    <a href={`${(() => { const AFFILIATE_URL='https://www.anrdoezrs.net/click-101695072-12589558'; return `${AFFILIATE_URL}?url=${encodeURIComponent('https://www.dynadot.com/domain/search?domain='+r.full_domain)}`; })()}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ padding: '6px 14px', background: 'var(--green)', color: '#000', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                      Register →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          {taken.length > 0 && (
            <>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Taken</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {taken.map(r => (
                  <div key={r.full_domain} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)' }} />
                      <Link href={`/domain/${r.full_domain}`} style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                        {r.full_domain}
                      </Link>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Taken</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>💡 Similar available names</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestions.map(s => (
              <Link key={s.full_domain} href={`/domain/${s.full_domain}`} style={{
                padding: '8px 14px', background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.15)',
                borderRadius: '20px', fontSize: '0.85rem', color: 'var(--green)', fontWeight: 500,
              }}>
                {s.full_domain}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to search */}
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <Link href={`/?q=${encodeURIComponent(baseName)}`} style={{
          padding: '12px 24px', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '12px', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)',
        }}>
          ← Back to search
        </Link>
      </div>
    </div>
  );
}
