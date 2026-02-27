import Link from 'next/link';

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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 12, color: '#1a1a2e' }}>
          💵 Domain Pricing Guide 2026
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#666', maxWidth: 600, margin: '0 auto' }}>
          How much does a domain really cost? Compare prices across 400+ extensions and find the best deals.
        </p>
        <Link href="/" style={{ display: 'inline-block', marginTop: 20, padding: '12px 28px', background: '#7c3aed', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          Search Available Domains →
        </Link>
      </div>

      {/* Pricing Tiers */}
      {PRICING_TIERS.map((tier) => (
        <div key={tier.tier} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#1a1a2e' }}>
            {tier.emoji} {tier.tier} <span style={{ color: '#7c3aed', fontSize: '1rem', fontWeight: 500 }}>({tier.range})</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {tier.tlds.map((tld) => (
              <div key={tld.ext} style={{ background: '#f8f7ff', borderRadius: 10, padding: 16, border: '1px solid #e8e5f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#7c3aed' }}>{tld.ext}</span>
                  <span style={{ fontSize: '0.85rem', color: '#444', fontWeight: 600 }}>{tld.reg}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#666', margin: '0 0 4px' }}>{tld.notes}</p>
                <p style={{ fontSize: '0.75rem', color: '#999', margin: 0 }}>Renewal: {tld.renewal}/yr</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Registrar Comparison */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#1a1a2e' }}>
          🏪 Registrar Price Comparison (.com)
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #7c3aed' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#1a1a2e' }}>Registrar</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#1a1a2e' }}>.com Price</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#1a1a2e' }}>Key Benefit</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#1a1a2e' }}>Best For</th>
              </tr>
            </thead>
            <tbody>
              {REGISTRAR_COMPARISON.map((r) => (
                <tr key={r.name} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: '10px 12px', color: '#7c3aed', fontWeight: 600 }}>{r.comPrice}/yr</td>
                  <td style={{ padding: '10px 12px', color: '#666' }}>{r.pros}</td>
                  <td style={{ padding: '10px 12px', color: '#666' }}>{r.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Domains Section */}
      <div style={{ marginBottom: 40, background: '#fef3c7', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 12, color: '#92400e' }}>
          💎 What About Premium Domains?
        </h2>
        <p style={{ color: '#78350f', lineHeight: 1.7, marginBottom: 12 }}>
          Premium domains are pre-registered names sold at a markup — typically <strong>$50 to $50,000+</strong> depending on length, keywords, and brandability. Short .com domains (3-4 letters) and keyword-rich names command the highest prices.
        </p>
        <p style={{ color: '#78350f', lineHeight: 1.7, marginBottom: 12 }}>
          Factors that affect premium domain pricing:
        </p>
        <ul style={{ color: '#78350f', lineHeight: 1.8, paddingLeft: 20 }}>
          <li><strong>Length:</strong> Shorter = more expensive. 3-letter .coms can be $10,000+</li>
          <li><strong>Keywords:</strong> High-value keywords (insurance, crypto, AI) drive prices up</li>
          <li><strong>Extension:</strong> .com premiums are highest, followed by .ai and .io</li>
          <li><strong>Existing traffic:</strong> Domains with backlinks and SEO history cost more</li>
          <li><strong>Brandability:</strong> Easy to say, spell, and remember = premium price</li>
        </ul>
        <Link href="/premium-domains" style={{ display: 'inline-block', marginTop: 12, color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
          Browse Premium Domains →
        </Link>
      </div>

      {/* Tips */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#1a1a2e' }}>
          🧠 Domain Buying Tips
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {TIPS.map((tip) => (
            <div key={tip.title} style={{ background: '#f0fdf4', borderRadius: 10, padding: 16, border: '1px solid #bbf7d0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6, color: '#166534' }}>
                {tip.icon} {tip.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#15803d', lineHeight: 1.6, margin: 0 }}>{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '32px 20px', background: '#f8f7ff', borderRadius: 12 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }}>Ready to find your domain?</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>Search 400+ extensions and find the perfect domain at the best price.</p>
        <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: '#7c3aed', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem' }}>
          Search Domains Free →
        </Link>
      </div>

      {/* Internal Links */}
      <div style={{ marginTop: 40, padding: '20px 0', borderTop: '1px solid #eee', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        <Link href="/domain-extensions" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>📚 Extensions Guide</Link>
        <Link href="/domain-generator" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>⚡ Name Generator</Link>
        <Link href="/premium-domains" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>💎 Premium Domains</Link>
        <Link href="/about" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>ℹ️ About Us</Link>
      </div>
    </div>
  );
}
