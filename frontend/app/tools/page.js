'use client';

import { AppShell } from '../components/AppShell';

const TOOLS = [
  { href: '/domain-age-checker', name: 'Domain Age Checker', desc: 'Find out when any domain was first registered', icon: '📅' },
  { href: '/dns-lookup', name: 'DNS Lookup', desc: 'Query A, AAAA, MX, NS, TXT, and CNAME records', icon: '🔍' },
  { href: '/domain-expiration', name: 'Domain Expiration Checker', desc: 'Check when a domain expires via RDAP', icon: '⏰' },
  { href: '/domain-availability', name: 'Domain Availability Checker', desc: 'Check if a domain name is available to register', icon: '✅' },
  { href: '/random-domain-generator', name: 'Random Domain Generator', desc: 'Generate creative, brandable domain name ideas', icon: '🎲' },
  { href: '/brand-name-generator', name: 'Brand Name Generator', desc: 'Create unique business & brand names by industry', icon: '✨' },
  { href: '/startup-name-generator', name: 'Startup Name Generator', desc: 'Generate fundable startup names for SaaS, AI, fintech & more', icon: '🚀' },
  { href: '/domain-value', name: 'Domain Value Estimator', desc: 'Estimate how much a domain name is worth', icon: '💰' },
  { href: '/domain-length-checker', name: 'Domain Length Checker', desc: 'Analyze character count, typeability, memorability & brandability', icon: '📏' },
  { href: '/tld-comparison', name: 'TLD Comparison Tool', desc: 'Compare domain extensions: .com, .io, .ai, .dev & 50+ more', icon: '🌐' },
  { href: '/bulk-domain-checker', name: 'Bulk Domain Checker', desc: 'Check availability of multiple domains at once with export', icon: '📊' },
  { href: '/ssl-checker', name: 'SSL Certificate Checker', desc: 'Check HTTPS security, certificate expiry & validity', icon: '🔒' },
  { href: '/email-domain-checker', name: 'Email Domain Checker', desc: 'Check MX, SPF, DKIM & DMARC email authentication records', icon: '📧' },
];

export default function Tools() {
  return (
    <AppShell>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          Free Domain Tools
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px' }}>
          All tools run entirely in your browser — no sign-up, no limits, completely free.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {TOOLS.map(tool => (
            <a key={tool.href} href={tool.href} style={{
              background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px',
              textDecoration: 'none', color: '#fff', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#8b5cf6'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{tool.icon}</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{tool.name}</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{tool.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
