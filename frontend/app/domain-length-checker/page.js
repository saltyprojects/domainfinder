import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainLengthChecker from './DomainLengthChecker';

export const metadata = {
  title: 'Domain Name Length Checker — Analyze Character Count & Quality | DomyDomains',
  description: 'Free domain name length checker tool. Analyze character count, typeability, memorability, and brandability scores. Bulk check up to 50 domains at once. Compare against top brands.',
  keywords: 'domain name length checker, domain character count, domain length analysis, domain name length, short domain names, domain name quality, domain typeability, domain brandability, bulk domain length checker',
  alternates: { canonical: '/domain-length-checker' },
  openGraph: {
    title: 'Domain Name Length Checker — Analyze Character Count & Quality',
    description: 'Analyze domain name length, typeability, memorability, and brandability. Compare against top brands. Bulk check up to 50 domains.',
    url: 'https://domydomains.com/domain-length-checker',
  },
};

export default function DomainLengthCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Name Length Checker"
        description="Analyze domain name length, typeability, memorability, and brandability scores. Bulk check up to 50 domains at once."
        url="/domain-length-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Name Length Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Analyze any domain name&apos;s character count, typeability, memorability, and brandability scores.
        Compare your domain against industry leaders or bulk-check up to 50 domains at once.
      </p>

      <DomainLengthChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Domain Name Length Matters</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p style={{ marginBottom: '16px' }}>
            Domain name length is one of the most important factors in choosing a web address. Research consistently shows that
            shorter domain names are easier to remember, faster to type, and generate higher click-through rates in search
            results. The average domain sold for over $10,000 on aftermarket platforms is just 7 characters long, and every
            two-letter .com domain has been registered since the 1990s.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Beyond pure character count, domain name quality depends on typeability (how easy it is to type without errors),
            memorability (how well someone can recall it after hearing it once), and brandability (how well it works as a
            company or product identity). A 6-letter domain with unusual letter combinations might score worse than a clean
            8-letter domain name.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Domain Length Tiers</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { range: '1–5 characters', tier: 'Premium', color: '#22c55e', desc: 'Ultra-short, highly valuable. Most are taken or sell for thousands. Examples: x.com, bit.ly, go.com.', icon: '💎' },
            { range: '6–8 characters', tier: 'Excellent', color: '#22c55e', desc: 'Sweet spot for branding. Easy to remember and type. Think: google, amazon, stripe, github.', icon: '🏆' },
            { range: '9–12 characters', tier: 'Good', color: '#eab308', desc: 'Average domain length on the internet. Still very usable. Examples: instagram, salesforce.', icon: '👍' },
            { range: '13–15 characters', tier: 'Fair', color: '#f97316', desc: 'Getting long. May be harder to type on mobile. Consider abbreviations or alternate names.', icon: '⚠️' },
            { range: '16+ characters', tier: 'Long', color: '#ef4444', desc: 'Difficult to remember and type. High typo rate. Consider a shorter alternative for better results.', icon: '📏' },
          ].map(item => (
            <div key={item.range} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{item.range}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.color, background: `${item.color}15`, padding: '2px 8px', borderRadius: '4px' }}>{item.tier}</span>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Tips for Choosing the Right Domain Length</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Aim for 6–10 Characters', desc: 'This is the sweet spot. Long enough to be brandable but short enough to be memorable and easy to type on any device.', icon: '🎯' },
            { title: 'Avoid Hyphens & Numbers', desc: 'They hurt typeability and memorability. "best-deals-4u.com" is much harder to share verbally than "topdeals.com".', icon: '🚫' },
            { title: 'Test the Radio Test', desc: 'Say your domain out loud. If someone can hear it and type it correctly on the first try, it passes. Length plays a big role here.', icon: '📻' },
            { title: 'Check All TLD Options', desc: 'A longer .com might lose to a shorter .io or .co. "myapp.io" (5 chars) could outperform "myapplication.com" (13 chars).', icon: '🔄' },
            { title: 'Consider Mobile Users', desc: 'Over 60% of web traffic is mobile. Shorter domains are much easier to type on phone keyboards with fewer errors.', icon: '📱' },
            { title: 'Think About Social Media', desc: 'Short domains perform better in tweets, bios, and profiles where character counts are limited or space is at a premium.', icon: '📣' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Domain Length Statistics</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p style={{ marginBottom: '16px' }}>
            According to industry data, the average .com domain name is about 12 characters long. However, the most successful
            brands on the internet consistently choose shorter names. Of the top 100 websites globally, the average domain name
            length is just 6.5 characters. This isn&apos;t a coincidence — shorter domains correlate with higher direct traffic,
            better brand recall, and fewer typo-related lost visitors.
          </p>
          <p>
            Premium short domains (5 characters or fewer) are extremely valuable in the aftermarket. Three-letter .com domains
            regularly sell for $50,000–$500,000, while four-letter .com domains typically range from $1,000–$50,000 depending
            on the letter combination. Even in newer TLDs like .io and .ai, shorter names command significant premiums.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'What is the ideal domain name length?', a: 'The ideal domain name is 6–10 characters long. This range balances memorability, typeability, and brandability. Most of the world\'s top websites fall in this range.' },
          { q: 'Does domain length affect SEO?', a: 'Domain length itself isn\'t a direct Google ranking factor, but shorter domains tend to get more direct traffic, higher click-through rates, and are easier to build brand authority around — all of which indirectly help SEO.' },
          { q: 'What is the maximum domain name length?', a: 'The maximum length for a domain name label (the part before the TLD) is 63 characters, and the total domain name including TLD can be up to 253 characters. However, anything over 15 characters is impractical.' },
          { q: 'How does this tool calculate scores?', a: 'Typeability measures keyboard complexity (letter patterns, hyphens, numbers). Memorability evaluates recall ease (length, pronounceability). Brandability assesses commercial viability (uniqueness, simplicity). All scores range from 0–100.' },
          { q: 'Can I check multiple domains at once?', a: 'Yes! Switch to Bulk Check mode to analyze up to 50 domains at once. Results are sorted by length and include all quality scores for easy comparison.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>More Domain Tools</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Check availability, lookup DNS records, and generate domain name ideas with our free tools.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/domain-availability" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            Domain Availability Checker
          </a>
          <a href="/dns-lookup" style={{ display: 'inline-block', background: '#333', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            DNS Lookup Tool
          </a>
          <a href="/tools" style={{ display: 'inline-block', background: '#333', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            All Free Tools
          </a>
        </div>
      </section>
    </StaticPage>
  );
}
