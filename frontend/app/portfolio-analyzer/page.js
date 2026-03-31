import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import PortfolioAnalyzer from './PortfolioAnalyzer';

export const metadata = {
  title: 'Domain Portfolio Analyzer — Score & Evaluate Your Domain Collection | DomyDomains',
  description: 'Free domain portfolio analyzer. Evaluate your entire domain collection at once — get quality scores, TLD distribution, age analysis, expiration alerts, and actionable recommendations. Export to CSV.',
  keywords: 'domain portfolio analyzer, domain portfolio tool, domain collection analyzer, domain portfolio management, bulk domain scorer, domain portfolio review, domain investment analysis, domain portfolio quality',
  alternates: { canonical: '/portfolio-analyzer' },
  openGraph: {
    title: 'Domain Portfolio Analyzer — Score & Evaluate Your Domain Collection',
    description: 'Analyze your entire domain portfolio at once. Get quality scores, TLD distribution, age breakdown, expiration alerts, and export to CSV — all free in your browser.',
    url: 'https://domydomains.com/portfolio-analyzer',
  },
};

export default function PortfolioAnalyzerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Portfolio Analyzer"
        description="Analyze and score your entire domain portfolio. Get quality grades, TLD distribution, age analysis, expiration alerts, and CSV export."
        url="/portfolio-analyzer"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Portfolio Analyzer
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Analyze your entire domain collection in one go. Get quality scores, TLD distribution, age breakdown,
        expiration alerts, and personalized recommendations — all processed in your browser.
      </p>

      <PortfolioAnalyzer />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Analyze Your Domain Portfolio?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          Whether you own five domains or five hundred, understanding the overall quality and composition of your 
          domain portfolio is essential for making smart renewal, acquisition, and divestment decisions. A domain 
          portfolio analyzer gives you the bird&apos;s-eye view that individual WHOIS lookups simply cannot provide.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          Domain investors use portfolio analysis to identify underperforming assets that drain renewal budgets, 
          spot expiring domains that need urgent attention, and understand TLD concentration risk. Businesses use 
          it to evaluate brand protection coverage and ensure all their digital properties meet quality standards. 
          Our free analyzer handles both use cases by combining algorithmic quality scoring with real-time RDAP 
          registration data.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What the Analyzer Measures</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Quality Scoring', desc: 'Each domain receives a score from 0-100 based on length, brandability, pronounceability, and TLD quality. The portfolio gets an aggregate grade so you can see overall health at a glance.', icon: '📊' },
            { title: 'TLD Distribution', desc: 'See how your domains are spread across extensions like .com, .io, .ai, and others. Over-concentration in a single TLD or too few .com domains can signal risk in your portfolio strategy.', icon: '🌐' },
            { title: 'Age & Registration', desc: 'Using live RDAP data, we pull registration dates to calculate domain age. Older domains often carry more authority and resale value, while newly registered ones may need time to mature.', icon: '📅' },
            { title: 'Expiration Alerts', desc: 'Instantly see which domains expire within 90 days. Missing a renewal can mean losing a valuable domain to drop-catchers or squatters. This feature helps you stay ahead of deadlines.', icon: '⚠️' },
            { title: 'Brandability Analysis', desc: 'How well does each domain work as a brand name? We evaluate character composition, hyphen and number usage, length efficiency, and uniqueness to gauge real-world branding potential.', icon: '💎' },
            { title: 'CSV Export', desc: 'Download your complete analysis as a CSV file for use in spreadsheets, domain management tools, or investor reports. Track portfolio changes over time by comparing exports.', icon: '📥' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Portfolio Management Best Practices</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          Smart portfolio management is about maximizing value while minimizing carrying costs. Not every domain 
          in your portfolio deserves the same level of investment. Here are the key principles:
        </p>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { tip: 'Audit Quarterly', desc: 'Run your portfolio through the analyzer at least once per quarter. Track score trends, catch expiring domains early, and identify domains that no longer serve your strategy.' },
            { tip: 'Divest Low Performers', desc: 'Domains scoring below 50 (F grade) rarely justify renewal fees unless they have specific keyword or brand value. Consider selling, letting them expire, or redirecting to stronger domains.' },
            { tip: 'Diversify TLDs Strategically', desc: 'While .com should be the backbone of most portfolios, targeted TLD diversification (.ai for AI companies, .io for developer tools) can protect brand identity across emerging markets.' },
            { tip: 'Set Renewal Reminders', desc: 'Use the expiration data from this tool to set calendar reminders 60+ days before expiry. Auto-renewal is ideal for core domains, but you should manually review others before paying.' },
            { tip: 'Track Value Over Time', desc: 'Export CSV data monthly and track how individual domain scores and ages change. Aging domains with improving scores are appreciating assets worth holding.' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#111', borderRadius: '8px', padding: '16px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '4px' }}>{item.tip}</h3>
              <p style={{ fontSize: '0.9rem', color: '#ccc', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { q: 'How many domains can I analyze at once?', a: 'You can enter up to 50 domains per analysis. Each domain is scored locally and checked against RDAP servers for registration data. For larger portfolios, run multiple batches and combine the CSV exports.' },
            { q: 'Is the analysis accurate for all TLDs?', a: 'Quality scoring works for all TLDs since it analyzes the domain name itself. However, RDAP data availability varies — most major TLDs (.com, .net, .org, .io, .ai) have good RDAP coverage, while some newer or country-code TLDs may return limited data.' },
            { q: 'Does this tool check if domains are registered?', a: 'This tool is designed for domains you already own or are evaluating. It checks RDAP for registration data but doesn\'t perform availability checks. Use our Bulk Domain Checker for availability testing.' },
            { q: 'How is the portfolio grade calculated?', a: 'Each domain receives an individual score (0-100) based on length, brandability, pronounceability, and TLD quality. The portfolio grade is the average of all individual scores, mapped to a letter grade from A+ to F.' },
            { q: 'Is my domain data stored anywhere?', a: 'No. All analysis runs entirely in your browser. Your domain list is never sent to our servers — only standard RDAP queries are made to public registration databases, which is the same data anyone can access.' },
          ].map((faq, i) => (
            <div key={i} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: '#e5e5e5' }}>{faq.q}</h3>
              <p style={{ color: '#999', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
