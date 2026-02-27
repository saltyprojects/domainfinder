import Link from 'next/link';

export const metadata = {
  title: 'Domain Value Estimator Guide 2026 — How Much Is a Domain Worth? | DomyDomains',
  description: 'Learn how to estimate domain name value. Understand the factors that determine domain worth: length, keywords, TLD, backlinks, traffic, and brandability.',
  keywords: 'domain value, domain appraisal, how much is a domain worth, domain name value, domain price estimate, domain valuation, domain worth checker',
  alternates: { canonical: '/domain-value' },
  openGraph: {
    title: 'Domain Value Estimator Guide 2026 — How Much Is a Domain Worth?',
    description: 'Understand what makes a domain valuable and how to estimate its worth before buying or selling.',
    url: 'https://domydomains.com/domain-value',
  },
};

const VALUE_FACTORS = [
  { factor: 'Domain Length', weight: 'Very High', emoji: '📏', desc: 'Shorter domains are exponentially more valuable. A 3-letter .com can be worth $10,000–$1M+. Each extra character reduces value significantly.', examples: 'ai.com ($5M+) vs artificialintelligence.com ($5K)' },
  { factor: 'Extension (TLD)', weight: 'Very High', emoji: '🌐', desc: '.com is king — worth 5-20x more than other TLDs for the same name. .ai and .io are premium tech TLDs. Country codes vary wildly.', examples: 'brand.com ($50K) vs brand.xyz ($500)' },
  { factor: 'Keywords', weight: 'High', emoji: '🔑', desc: 'Domains containing high-value commercial keywords (insurance, loans, crypto, AI) command premium prices due to SEO and advertising value.', examples: 'insurance.com ($35.6M), crypto.com ($12M)' },
  { factor: 'Brandability', weight: 'High', emoji: '✨', desc: 'Easy to say, spell, and remember. Made-up but catchy words (like Google, Zappos) are highly valuable. Avoid hyphens, numbers, and double letters.', examples: 'zoom.com, stripe.com, notion.so' },
  { factor: 'Backlinks & SEO', weight: 'Medium-High', emoji: '🔗', desc: 'Domains with existing backlinks from authoritative sites carry SEO value. Domain authority (DA) directly impacts search rankings.', examples: 'DA 50+ domain = $5K-$50K premium' },
  { factor: 'Traffic', weight: 'Medium', emoji: '📊', desc: 'Domains receiving organic search traffic or type-in traffic are more valuable. Monthly visitors translate directly to revenue potential.', examples: '10K monthly visitors = $5K-$20K value add' },
  { factor: 'Age', weight: 'Medium', emoji: '📅', desc: 'Older domains have more trust with search engines. A domain registered in 2000 carries more weight than one from 2024.', examples: '20+ year old domains get ~10-20% premium' },
  { factor: 'Search Volume', weight: 'Medium', emoji: '🔍', desc: 'Exact-match domains for high search volume keywords are valuable. "best laptops" gets 100K+ monthly searches.', examples: 'High volume keyword domains: $10K-$500K' },
];

const PRICE_RANGES = [
  { range: '$1 – $50', label: 'Standard Registration', color: '#22c55e', desc: 'New registration of available domains. Most .com domains cost $8-12/yr. Premium TLDs like .ai cost $50-80/yr.' },
  { range: '$50 – $500', label: 'Low Premium', color: '#84cc16', desc: 'Slightly premium names — short phrases, minor keywords, less common TLDs. Often available through registrar premium lists.' },
  { range: '$500 – $5,000', label: 'Mid-Range Premium', color: '#eab308', desc: 'Good brandable names, moderate keywords, 5-7 letter .coms. The sweet spot for startups and small businesses.' },
  { range: '$5,000 – $50,000', label: 'High Premium', color: '#f97316', desc: 'Short .coms (4-5 letters), strong keywords, established domains with backlinks and traffic. Serious business domains.' },
  { range: '$50,000 – $500,000', label: 'Ultra Premium', color: '#ef4444', desc: '3-4 letter .coms, category-defining keywords, domains with significant traffic. Major brand acquisitions.' },
  { range: '$500,000+', label: 'Trophy Domains', color: '#dc2626', desc: 'Single-word .coms, top commercial keywords. The rarest domains on the internet. Most are never sold.' },
];

const APPRAISAL_TOOLS = [
  { name: 'GoDaddy Appraisal', url: 'https://www.godaddy.com/domain-value-appraisal', desc: 'Free AI-powered valuations based on comparable sales, SEO metrics, and keyword data.', reliability: 'Good' },
  { name: 'Estibot', url: 'https://www.estibot.com', desc: 'Industry standard for automated domain appraisals. Uses machine learning on millions of sales.', reliability: 'Very Good' },
  { name: 'NameBio', url: 'https://namebio.com', desc: 'Historical domain sales database. Search actual sale prices of comparable domains.', reliability: 'Excellent (real data)' },
  { name: 'Sedo', url: 'https://sedo.com/search/searchresult.php4', desc: 'Major domain marketplace with appraisal service. See asking prices for similar domains.', reliability: 'Good' },
];

const RECENT_SALES = [
  { domain: 'insurance.com', price: '$35.6M', year: '2010', why: 'Single-word .com, highest-value commercial keyword' },
  { domain: 'crypto.com', price: '$12M', year: '2018', why: 'Perfect keyword match for booming industry' },
  { domain: 'voice.com', price: '$30M', year: '2019', why: 'Short, single-word .com with broad application' },
  { domain: 'cars.com', price: '$872M', year: '2014', why: 'Category-defining domain with massive traffic' },
  { domain: 'nft.com', price: '$15M', year: '2022', why: 'Perfect keyword for emerging market' },
  { domain: 'sex.com', price: '$13M', year: '2010', why: 'Extremely high type-in traffic' },
];

export default function DomainValuePage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 12, color: '#fff' }}>
          💰 Domain Value Guide
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: '#aaa', maxWidth: 620, margin: '0 auto' }}>
          How much is a domain name worth? Learn the factors that determine domain value and how to estimate prices before buying or selling.
        </p>
        <Link href="/" style={{ display: 'inline-block', marginTop: 20, padding: '12px 28px', background: '#7c3aed', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          Search Available Domains →
        </Link>
      </div>

      {/* Value Factors */}
      <div style={{ marginBottom: 44 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#fff' }}>🎯 What Determines Domain Value?</h2>
        <div style={{ display: 'grid', gap: 14 }}>
          {VALUE_FACTORS.map((f) => (
            <div key={f.factor} style={{ background: '#f8f7ff', borderRadius: 10, padding: 18, border: '1px solid #e8e5f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>{f.emoji} {f.factor}</h3>
                <span style={{ fontSize: '0.78rem', background: '#7c3aed', color: '#fff', padding: '2px 10px', borderRadius: 12, fontWeight: 600 }}>Impact: {f.weight}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#bbb', lineHeight: 1.6, margin: '0 0 6px' }}>{f.desc}</p>
              <p style={{ fontSize: '0.8rem', color: '#7c3aed', margin: 0, fontStyle: 'italic' }}>Example: {f.examples}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Price Ranges */}
      <div style={{ marginBottom: 44 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#fff' }}>📊 Domain Price Ranges</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {PRICE_RANGES.map((p) => (
            <div key={p.range} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: '#fafafa', borderRadius: 10, borderLeft: `4px solid ${p.color}`, alignItems: 'flex-start' }}>
              <div style={{ minWidth: 140 }}>
                <div style={{ fontWeight: 800, color: p.color, fontSize: '1rem' }}>{p.range}</div>
                <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: 600 }}>{p.label}</div>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#bbb', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notable Sales */}
      <div style={{ marginBottom: 44, background: '#fef3c7', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16, color: '#92400e' }}>🏆 Notable Domain Sales</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {RECENT_SALES.map((s) => (
            <div key={s.domain} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{s.domain}</div>
              <div style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1.1rem', margin: '4px 0' }}>{s.price} <span style={{ fontSize: '0.75rem', color: '#999', fontWeight: 500 }}>({s.year})</span></div>
              <p style={{ fontSize: '0.8rem', color: '#78350f', margin: 0 }}>{s.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Appraisal Tools */}
      <div style={{ marginBottom: 44 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#fff' }}>🛠️ Domain Appraisal Tools</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {APPRAISAL_TOOLS.map((t) => (
            <div key={t.name} style={{ background: '#1a1a2e', borderRadius: 10, padding: 16, border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4, color: '#fff' }}>
                  {t.name} <span style={{ fontSize: '0.75rem', background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: 4, marginLeft: 6 }}>Reliability: {t.reliability}</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#aaa', margin: 0 }}>{t.desc}</p>
              </div>
              <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>Visit →</a>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Valuation Checklist */}
      <div style={{ marginBottom: 44, background: '#f0fdf4', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16, color: '#166534' }}>✅ Quick Domain Valuation Checklist</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {[
            { q: 'Is it a .com?', yes: '+5-20x value over other TLDs', no: 'Still valuable if .ai, .io, or .co' },
            { q: 'Is it under 6 characters?', yes: 'Significantly more valuable', no: 'Longer names need strong keywords or brand' },
            { q: 'Does it contain commercial keywords?', yes: 'Higher advertising and SEO value', no: 'Brandability can compensate' },
            { q: 'Is it easy to say and spell?', yes: 'High brandability premium', no: 'May limit viral/word-of-mouth potential' },
            { q: 'Does it have existing backlinks?', yes: 'Immediate SEO advantage', no: 'Requires building authority from scratch' },
            { q: 'Is the domain aged (5+ years)?', yes: 'Search engines trust it more', no: 'Not a dealbreaker for great names' },
          ].map((item) => (
            <div key={item.q} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#166534', marginBottom: 6 }}>{item.q}</div>
              <div style={{ fontSize: '0.82rem', color: '#15803d', marginBottom: 3 }}>✅ Yes: {item.yes}</div>
              <div style={{ fontSize: '0.82rem', color: '#aaa' }}>❌ No: {item.no}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '32px 20px', background: '#f8f7ff', borderRadius: 12 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, color: '#fff' }}>Find undervalued domains</h2>
        <p style={{ color: '#aaa', marginBottom: 16 }}>Search 400+ extensions and discover available domains before they&apos;re taken.</p>
        <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: '#7c3aed', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem' }}>
          Search Domains Free →
        </Link>
      </div>

      {/* Internal Links */}
      <div style={{ marginTop: 40, padding: '20px 0', borderTop: '1px solid #eee', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        <Link href="/domain-pricing" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>💵 Pricing Guide</Link>
        <Link href="/whois-lookup" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>🔎 WHOIS Lookup</Link>
        <Link href="/domain-extensions" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>📚 Extensions Guide</Link>
        <Link href="/premium-domains" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>💎 Premium Domains</Link>
        <Link href="/about" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>ℹ️ About Us</Link>
      </div>
    </div>
  );
}
