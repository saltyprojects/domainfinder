import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainCompareTool from './DomainCompareTool';

export const metadata = {
  title: 'Domain Comparison Tool — Compare Two Domains Side by Side | DomyDomains',
  description: 'Free domain comparison tool. Compare two domains side by side — registration age, registrar, DNS records, nameservers, email security (SPF, DMARC), and overall configuration grade.',
  keywords: 'domain comparison tool, compare domains, domain vs domain, compare two domains, domain side by side comparison, domain DNS compare, domain age comparison, registrar comparison, domain analysis tool',
  alternates: { canonical: '/domain-compare' },
  openGraph: {
    title: 'Domain Comparison Tool — Compare Two Domains Side by Side',
    description: 'Compare two domains head-to-head. See registration details, DNS records, nameservers, email security, and configuration grades in one view.',
    url: 'https://domydomains.com/domain-compare',
  },
};

export default function DomainComparePage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Comparison Tool"
        description="Compare two domains side by side. View registration age, registrar, DNS records, nameservers, email security configuration (SPF, DMARC), and get an overall configuration grade for each domain."
        url="/domain-compare"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Comparison Tool
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Compare two domains head-to-head. See registration details, DNS configuration, nameservers,
        email security setup, and an overall configuration grade — all in a single side-by-side view.
      </p>

      <DomainCompareTool />

      <section style={{ marginBottom: '48px', marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Compare Domains?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Domain comparison is an essential step in competitive analysis, acquisition decisions, and infrastructure
          auditing. Whether you&apos;re evaluating a competitor&apos;s domain against your own, choosing between
          two domains to purchase, or comparing DNS configurations across related properties, a side-by-side view
          reveals differences that would take multiple tools and many minutes to piece together manually.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Our domain comparison tool queries RDAP (Registration Data Access Protocol) for WHOIS-level registration
          data — including registrar, creation date, expiration date, and domain status — and simultaneously
          queries Google&apos;s public DNS resolver for A records, NS records, MX records, TXT records, and email
          security configurations (SPF and DMARC). All data is fetched client-side from your browser using free
          public APIs, with no server costs or rate limits to worry about.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What This Tool Compares</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          The comparison covers three major categories. <strong>Registration details</strong> include the
          registrar name, creation date, domain age, expiration date, last update time, and EPP status codes.
          Older domains often carry more authority in search engines, and knowing when a competitor&apos;s domain
          expires can inform acquisition strategies.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong>DNS records</strong> show A records (IP addresses), nameservers, MX (mail) records, and TXT
          record counts. This reveals which hosting provider, CDN, or DNS service each domain uses. Shared
          nameservers between domains can indicate common ownership, while MX records show email infrastructure
          choices — whether it&apos;s Google Workspace, Microsoft 365, or a custom mail server.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong>Email security</strong> checks for SPF (Sender Policy Framework) and DMARC (Domain-based
          Message Authentication, Reporting and Conformance) records. These are critical for preventing email
          spoofing and phishing. Domains missing SPF or DMARC are vulnerable to impersonation — a red flag
          when evaluating domain quality or vetting a potential business partner&apos;s technical maturity.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding the Configuration Grade</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Each domain receives a grade from A to D based on six configuration checks: valid registration data,
          SPF record presence, DMARC record presence, configured mail servers, at least two nameservers (for
          redundancy), and active A records pointing to a live server. An &quot;A&quot; grade means five or more
          checks pass — indicating a well-configured, production-ready domain. A &quot;D&quot; grade suggests
          the domain may be parked, newly registered, or poorly maintained.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          This grading system provides a quick at-a-glance quality indicator, but context matters. A brand-new
          domain won&apos;t have the age score of an established one, and a domain used purely for redirects
          may intentionally lack MX records. Use the detailed comparison data alongside the grade to draw
          accurate conclusions about each domain&apos;s purpose and quality.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common Use Cases</h2>
        <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>Competitive analysis</strong> — Compare your domain&apos;s DNS and security setup against competitors to identify gaps or advantages.</li>
          <li><strong>Domain acquisition</strong> — Evaluate two potential purchases side by side to see which has a stronger registration history and infrastructure.</li>
          <li><strong>Migration planning</strong> — Compare your old domain and new domain to ensure DNS records and email security are properly replicated.</li>
          <li><strong>Infrastructure auditing</strong> — Compare domains within your own portfolio to ensure consistent configuration standards across all properties.</li>
          <li><strong>Due diligence</strong> — When evaluating a business or partnership, compare their domain against known benchmarks to assess technical credibility.</li>
        </ul>
      </section>
    </StaticPage>
  );
}
