import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import WhoisComparator from './WhoisComparator';

export const metadata = {
  title: 'WHOIS Compare — Side-by-Side Domain WHOIS Comparison Tool | DomyDomains',
  description: 'Free WHOIS comparator tool. Compare WHOIS records for two domains side by side — registrar, registration date, expiration, nameservers, domain age, DNSSEC status, and more.',
  keywords: 'whois compare, whois comparison tool, compare domain whois, domain comparison, compare two domains, whois side by side, domain registrar comparison, domain age comparison, whois diff, compare domain registration',
  alternates: { canonical: '/whois-compare' },
  openGraph: {
    title: 'WHOIS Compare — Side-by-Side Domain WHOIS Comparison',
    description: 'Compare WHOIS records for two domains side by side. See differences in registrar, age, expiration, nameservers, and more — free and instant.',
    url: 'https://domydomains.com/whois-compare',
  },
};

export default function WhoisComparePage() {
  return (
    <StaticPage>
      <ToolSchema
        name="WHOIS Compare Tool"
        description="Compare WHOIS records for two domains side by side. See registrar, registration date, expiration, nameservers, domain age, DNSSEC, and more."
        url="/whois-compare"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        WHOIS Compare Tool
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Compare WHOIS records for two domains side by side. Instantly see differences in registrar,
        registration date, expiration, domain age, nameservers, DNSSEC status, and more — all from your browser.
      </p>

      <WhoisComparator />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Compare WHOIS Records?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          Comparing WHOIS records for two domains is a powerful technique used by domain investors,
          SEO professionals, brand managers, and security researchers. A side-by-side WHOIS comparison
          lets you quickly spot differences in registration details, ownership patterns, and infrastructure
          choices between domains — information that would take much longer to analyze by looking at
          individual WHOIS lookups one at a time.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          Domain investors frequently compare WHOIS data when evaluating two similar domains for purchase.
          By comparing registration dates, you can instantly see which domain is older — older domains
          generally carry more SEO authority and trust. Comparing expiration dates tells you whether
          one domain might be about to drop, creating a buying opportunity. And comparing registrars
          reveals whether both domains are managed in the same place, which can indicate common ownership.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Use Cases for WHOIS Comparison</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {[
            { icon: '💰', title: 'Domain Investment Decisions', desc: 'Compare two domains you\'re considering buying. See which is older, which expires sooner, and which registrar each uses to make smarter investment choices.' },
            { icon: '🔍', title: 'Competitor Analysis', desc: 'Compare your domain against a competitor\'s. Discover differences in hosting infrastructure, domain age, and security configuration.' },
            { icon: '🛡️', title: 'Brand Protection', desc: 'Compare a suspicious domain to your legitimate one. Different registrars, recent registration dates, and mismatched nameservers can indicate cybersquatting or phishing.' },
            { icon: '📊', title: 'SEO Research', desc: 'Domain age and DNSSEC status are SEO signals. Quickly compare these factors between competing domains to understand ranking advantages.' },
            { icon: '🔀', title: 'Migration Planning', desc: 'Before migrating from one domain to another, compare both records to understand current configurations and plan the transition.' },
            { icon: '🕵️', title: 'Fraud Detection', desc: 'Comparing WHOIS records can reveal whether two seemingly different domains share the same registrant, nameservers, or registrar — a common phishing pattern.' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding the Comparison Fields</h2>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            { field: 'Registrar', desc: 'The company where the domain is registered. Matching registrars between two domains may suggest common ownership.' },
            { field: 'Registration Date', desc: 'When the domain was first registered. Older domains typically have more authority and trust.' },
            { field: 'Expiration Date', desc: 'When the registration expires. Domains nearing expiration may be available for purchase soon.' },
            { field: 'Domain Age', desc: 'Calculated time since first registration. A key factor in domain valuation and SEO strength.' },
            { field: 'Nameservers', desc: 'DNS servers managing the domain. Shared nameservers between two domains can indicate the same hosting provider or owner.' },
            { field: 'DNSSEC', desc: 'Whether the domain uses DNS Security Extensions. Signed domains have better security posture.' },
            { field: 'Status Codes', desc: 'Registry status flags. Codes like clientTransferProhibited indicate the domain is locked, while redemptionPeriod means it\'s in recovery.' },
          ].map(item => (
            <div key={item.field} style={{ display: 'flex', gap: '12px', padding: '12px 16px', background: '#0a0a0a', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
              <span style={{ color: '#8b5cf6', fontWeight: 600, minWidth: '140px', fontSize: '0.85rem' }}>{item.field}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How This Tool Works</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          This WHOIS comparison tool uses the RDAP (Registration Data Access Protocol) — the modern,
          standardized replacement for the legacy WHOIS protocol. RDAP returns structured JSON data
          directly from domain registries, making it more reliable and consistent than traditional
          WHOIS text parsing. All lookups happen directly in your browser; no data is sent to our servers.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8 }}>
          Simply enter two domain names and click &ldquo;Compare WHOIS.&rdquo; The tool fetches RDAP
          records for both domains simultaneously and displays them in a color-coded comparison table.
          Green cells indicate matching values, while yellow cells highlight differences — making it
          easy to spot what&apos;s different at a glance.
        </p>
      </section>
    </StaticPage>
  );
}
