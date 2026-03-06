import Link from 'next/link';
import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';

export const metadata = {
  title: 'Domain Pricing Guide 2026 — How Much Does a Domain Cost? | DomyDomains',
  description: 'Complete domain pricing guide for 2026. Compare costs for .com, .ai, .io, .dev and 400+ extensions. Learn about registration, renewal, and premium domain pricing.',
  keywords: 'domain pricing, domain cost, how much does a domain cost, domain registration price, cheap domains, premium domain pricing, domain renewal cost',
  alternates: { canonical: '/domain-pricing' },
  openGraph: {
    title: 'Domain Pricing Guide 2026 — How Much Does a Domain Cost?',
    description: 'Compare domain costs across 400+ extensions. Find affordable domains and understand premium pricing.',
    url: 'https://domydomains.com/domain-pricing',
  },
};

const PRICING_TIERS = [
  {
    tier: 'Budget-Friendly',
    range: '$1 – $10/year',
    emoji: '💰',
    tlds: [
      { ext: '.xyz', reg: '$1-2', renewal: '$10', notes: 'Used by Google (abc.xyz). Great first-year deals.' },
      { ext: '.online', reg: '$1-3', renewal: '$25', notes: 'Modern alternative for any website.' },
      { ext: '.site', reg: '$1-3', renewal: '$20', notes: 'Straightforward and affordable.' },
      { ext: '.shop', reg: '$2-5', renewal: '$10', notes: 'Perfect for e-commerce stores.' },
      { ext: '.blog', reg: '$3-5', renewal: '$15', notes: 'Built for content creators.' },
      { ext: '.info', reg: '$3-5', renewal: '$15', notes: 'Established extension for informational sites.' },
    ],
  },
  {
    tier: 'Standard',
    range: '$8 – $20/year',
    emoji: '⭐',
    tlds: [
      { ext: '.com', reg: '$8-12', renewal: '$12-15', notes: 'The gold standard. Most trusted TLD worldwide.' },
      { ext: '.net', reg: '$10-15', renewal: '$15', notes: 'Reliable .com alternative since 1985.' },
      { ext: '.org', reg: '$9-12', renewal: '$12', notes: 'Trusted by nonprofits and communities.' },
      { ext: '.dev', reg: '$12-15', renewal: '$15', notes: 'Google-backed, requires HTTPS.' },
      { ext: '.app', reg: '$12-15', renewal: '$15', notes: 'For mobile and web applications.' },
      { ext: '.me', reg: '$15-20', renewal: '$20', notes: 'Personal brands and portfolios.' },
    ],
  },
  {
    tier: 'Premium Extensions',
    range: '$25 – $80/year',
    emoji: '🔥',
    tlds: [
      { ext: '.co', reg: '$25-30', renewal: '$30', notes: 'Startup favorite. Short and professional.' },
      { ext: '.io', reg: '$30-50', renewal: '$50', notes: 'Tech startup standard. High demand.' },
      { ext: '.ai', reg: '$50-80', renewal: '$80', notes: 'Hottest TLD in 2026. AI/ML industry standard.' },
      { ext: '.tech', reg: '$5-40', renewal: '$40', notes: 'Prices vary widely by registrar.' },
      { ext: '.design', reg: '$10-30', renewal: '$30', notes: 'Niche creative extension.' },
      { ext: '.cloud', reg: '$10-20', renewal: '$20', notes: 'SaaS and cloud computing.' },
    ],
  },
];

const REGISTRAR_COMPARISON = [
  { name: 'Namecheap', comPrice: '$8.88', pros: 'Free WhoisGuard, low prices', bestFor: 'Budget buyers' },
  { name: 'Cloudflare', comPrice: '$8.57', pros: 'At-cost pricing, no markup', bestFor: 'Transparency seekers' },
  { name: 'Google Domains (Squarespace)', comPrice: '$12.00', pros: 'Simple UI, free privacy', bestFor: 'Google ecosystem users' },
  { name: 'GoDaddy', comPrice: '$11.99', pros: 'Largest selection, frequent sales', bestFor: 'First-time buyers (watch renewal prices)' },
  { name: 'Porkbun', comPrice: '$9.73', pros: 'Low prices, free WHOIS privacy', bestFor: 'Value-conscious developers' },
];

const TIPS = [
  { title: 'Watch renewal prices', icon: '⚠️', text: 'Many registrars offer cheap first-year pricing but charge 2-5x more on renewal. Always check the renewal price before buying.' },
  { title: 'Enable auto-renewal', icon: '🔄', text: 'Losing a domain because you forgot to renew is one of the most common (and costly) mistakes. Enable auto-renewal immediately.' },
  { title: 'Buy for multiple years', icon: '📅', text: 'Some registrars offer discounts for multi-year registrations. It also signals to Google that you\'re serious about your domain.' },
  { title: 'Don\'t overpay for privacy', icon: '🔒', text: 'WHOIS privacy should be free or very cheap. Namecheap, Cloudflare, and Porkbun all include it at no cost.' },
  { title: 'Compare before buying', icon: '🔍', text: 'Price differences between registrars can be $5-20/year for the same domain. A few minutes of comparison shopping pays off.' },
  { title: 'Consider total cost of ownership', icon: '💡', text: 'Factor in registration + renewal + privacy + DNS management. Some "cheap" registrars cost more long-term.' },
];

export default function DomainPricingPage() {
  return (
    <StaticPage>
      <ToolSchema name="Domain Pricing Guide" description="Complete domain pricing guide for 2026. Compare costs for .com, .ai, .io, .dev and 400+ extensions." url="/domain-pricing" />
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Pricing Guide
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '48px', maxWidth: '700px' }}>
        How much does a domain really cost? Compare prices across 400+ extensions and find the best deals.
      </p>

      {PRICING_TIERS.map((tier) => (
        <section key={tier.tier} style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>
            {tier.emoji} {tier.tier} <span style={{ color: '#8b5cf6', fontSize: '1rem', fontWeight: 500 }}>({tier.range})</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {tier.tlds.map((tld) => (
              <div key={tld.ext} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#8b5cf6' }}>{tld.ext}</span>
                  <span style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 600 }}>{tld.reg}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0 0 4px', lineHeight: 1.5 }}>{tld.notes}</p>
                <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>Renewal: {tld.renewal}/yr</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>🏪 Registrar Price Comparison (.com)</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #8b5cf6' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#fff' }}>Registrar</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#fff' }}>.com Price</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#fff' }}>Key Benefit</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#fff' }}>Best For</th>
              </tr>
            </thead>
            <tbody>
              {REGISTRAR_COMPARISON.map((r) => (
                <tr key={r.name} style={{ borderBottom: '1px solid #1e1e1e' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#fff' }}>{r.name}</td>
                  <td style={{ padding: '10px 12px', color: '#8b5cf6', fontWeight: 600 }}>{r.comPrice}/yr</td>
                  <td style={{ padding: '10px 12px', color: '#9ca3af' }}>{r.pros}</td>
                  <td style={{ padding: '10px 12px', color: '#9ca3af' }}>{r.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: '48px', background: '#111', borderRadius: '16px', padding: '24px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>💎 What About Premium Domains?</h2>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '12px' }}>
          Premium domains are pre-registered names sold at a markup — typically <strong style={{ color: '#fff' }}>$50 to $50,000+</strong> depending on length, keywords, and brandability.
        </p>
        <ul style={{ color: '#9ca3af', lineHeight: 1.8, paddingLeft: '20px' }}>
          <li><strong style={{ color: '#fff' }}>Length:</strong> Shorter = more expensive. 3-letter .coms can be $10,000+</li>
          <li><strong style={{ color: '#fff' }}>Keywords:</strong> High-value keywords (insurance, crypto, AI) drive prices up</li>
          <li><strong style={{ color: '#fff' }}>Extension:</strong> .com premiums are highest, followed by .ai and .io</li>
          <li><strong style={{ color: '#fff' }}>Existing traffic:</strong> Domains with backlinks and SEO history cost more</li>
        </ul>
        <Link href="/premium-domains" style={{ display: 'inline-block', marginTop: '12px', color: '#8b5cf6', fontWeight: 600, textDecoration: 'none' }}>
          Browse Premium Domains →
        </Link>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>🧠 Domain Buying Tips</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {TIPS.map((tip) => (
            <div key={tip.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: '#22c55e' }}>
                {tip.icon} {tip.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{tip.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Ready to find your domain?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Search 400+ extensions and find the perfect domain at the best price.</p>
        <Link href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
          Search domains →
        </Link>
      </section>
    </StaticPage>
  );
}
