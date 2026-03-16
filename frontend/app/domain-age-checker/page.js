import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainAgeChecker from './DomainAgeChecker';

export const metadata = {
  title: 'Domain Age Checker — Check When Any Domain Was Registered | DomyDomains',
  description: 'Check the age of any domain instantly. See registration date, domain age in years/months/days, expiration, registrar info, and nameservers for free.',
  keywords: 'domain age checker, domain registration date, how old is domain, domain age tool, WHOIS age, domain history, SEO domain age',
  alternates: { canonical: '/domain-age-checker' },
  openGraph: {
    title: 'Domain Age Checker — Check When Any Domain Was Registered',
    description: 'Find out exactly when any domain was registered and how old it is. Free domain age lookup tool.',
    url: 'https://domydomains.com/domain-age-checker',
  },
};

export default function DomainAgeCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema 
        name="Domain Age Checker" 
        description="Check the age of any domain instantly. See registration date, domain age, expiration, and registrar info."
        url="/domain-age-checker" 
      />
      
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Age Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Find out exactly when any domain was registered and how old it is. Check domain age, registration date, 
        expiration, registrar info, and nameservers instantly.
      </p>

      <DomainAgeChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Domain Age Matters</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Domain age is a crucial factor in SEO and domain valuation:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>SEO Authority:</strong> Older domains often rank higher in search results due to accumulated trust and backlinks.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Trust Signals:</strong> Visitors perceive older domains as more established and trustworthy.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Domain Value:</strong> Age is a key factor in premium domain pricing — older domains command higher prices.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Historical Context:</strong> Knowing registration date helps identify if a domain had previous owners or uses.</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Our Tool Shows You</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Registration Date', desc: 'Exact date when the domain was first registered', icon: '📅' },
            { title: 'Domain Age', desc: 'Precise age in years, months, and days', icon: '⏰' },
            { title: 'Expiration Date', desc: 'When the current registration expires', icon: '⚠️' },
            { title: 'Registrar Info', desc: 'Company where the domain is registered', icon: '🏢' },
            { title: 'Name Servers', desc: 'DNS servers hosting the domain', icon: '🌐' },
            { title: 'Domain Status', desc: 'Current status codes and restrictions', icon: '🔒' },
          ].map(item => (
            <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Domain Age and SEO</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>While Google has stated that domain age isn't a direct ranking factor, older domains often perform better in search results for several reasons:</p>
          
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e', marginTop: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '12px' }}>Age-Related SEO Benefits</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { factor: 'Link Accumulation', detail: 'Older domains have more time to acquire natural backlinks' },
                { factor: 'Trust Signals', detail: 'Search engines trust domains that have been around longer' },
                { factor: 'Content History', detail: 'Aged domains may have indexed content and established topical authority' },
                { factor: 'Spam Filtering', detail: 'Older domains are less likely to be flagged as spam' },
              ].map(b => (
                <div key={b.factor} style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontWeight: 600, color: '#22c55e', minWidth: '140px' }}>{b.factor}:</span>
                  <span style={{ color: '#ccc' }}>{b.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding Domain Age Data</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '20px', marginBottom: '8px' }}>Registration vs. Creation Date</h3>
          <p>The registration date shows when the domain was first registered in its current form. However, some domains may have been transferred between registrars, which can affect the displayed date.</p>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '20px', marginBottom: '8px' }}>Expired vs. Active Domains</h3>
          <p>If a domain shows as expired, it may be in a grace period where the owner can still renew it, or it may become available for registration by anyone after the redemption period ends.</p>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '20px', marginBottom: '8px' }}>Privacy Protection Impact</h3>
          <p>Due to GDPR and privacy regulations, some WHOIS data may be redacted. Our tool shows all publicly available information while respecting privacy requirements.</p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'How accurate is domain age data?', a: 'Our tool uses official WHOIS and RDAP data from domain registrars and registries, which is the most accurate source available. The registration date shown is when the domain was first registered in the global DNS system.' },
          { q: 'Why do some domains show limited information?', a: 'Due to GDPR and privacy laws, many domains now have redacted WHOIS information. We show all publicly available data while respecting privacy requirements.' },
          { q: 'What if a domain appears to have multiple registration dates?', a: 'This can happen when domains are transferred between registrars or restored after expiration. The creation date typically shows the first registration.' },
          { q: 'How often is domain age data updated?', a: 'We query live WHOIS data each time you search, so information is real-time and current.' },
          { q: 'Can I check the age of any domain extension?', a: 'Yes, our tool works with all major domain extensions including .com, .net, .org, country codes, and new gTLDs like .io, .ai, etc.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Looking for available domains?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Search across 400+ extensions and register instantly with our domain search tool.</p>
        <a href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
          Search available domains →
        </a>
      </section>
    </StaticPage>
  );
}