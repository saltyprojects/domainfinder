import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import ReverseWhoisTool from './ReverseWhoisTool';

export const metadata = {
  title: 'Reverse WHOIS Lookup — Find Related Domains by Registrant | DomyDomains',
  description: 'Free reverse WHOIS lookup tool. Find domains owned by the same registrant, organization, or entity. Compare WHOIS data across multiple domains to discover ownership patterns and related domain portfolios.',
  keywords: 'reverse whois lookup, reverse whois search, find domains by owner, whois registrant search, domain owner lookup, who owns this domain, reverse domain lookup, domain registrant finder, find related domains, domain portfolio discovery, whois reverse search, domain ownership checker',
  alternates: { canonical: '/reverse-whois' },
  openGraph: {
    title: 'Reverse WHOIS Lookup — Find Related Domains by Registrant',
    description: 'Find domains owned by the same registrant or organization. Compare WHOIS data across multiple domains to discover ownership patterns.',
    url: 'https://domydomains.com/reverse-whois',
  },
};

export default function ReverseWhoisPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Reverse WHOIS Lookup Tool"
        description="Free reverse WHOIS lookup tool. Search for domains by registrant name, organization, or email. Compare WHOIS records across multiple domains to find ownership connections and discover related domain portfolios."
        url="/reverse-whois"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Reverse WHOIS Lookup
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Discover who owns a domain and find related domains registered by the same entity.
        Look up registrant details via RDAP or compare multiple domains to uncover ownership patterns.
      </p>

      <ReverseWhoisTool />

      <div style={{ marginTop: '64px', maxWidth: '760px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>
          What Is a Reverse WHOIS Lookup?
        </h2>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '16px' }}>
          A reverse WHOIS lookup lets you find domains connected to a specific registrant, organization, or contact email.
          While a standard WHOIS query reveals who owns a single domain, a reverse WHOIS search works the other direction —
          starting from an owner&apos;s identity to discover their entire domain portfolio. This is invaluable for brand protection,
          competitive intelligence, fraud investigation, and due diligence when acquiring domains.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>
          How Does This Tool Work?
        </h2>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '16px' }}>
          Our reverse WHOIS lookup queries the Registration Data Access Protocol (RDAP), the modern successor to traditional
          WHOIS. RDAP provides structured, machine-readable registration data directly from domain registries.
          In <strong>Single Domain</strong> mode, enter any domain to see its full registrant contact details, registrar information,
          registration dates, nameservers, and EPP status codes. The tool also indicates whether the domain uses WHOIS privacy
          protection, so you know if the registrant&apos;s identity is publicly exposed or shielded.
        </p>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '16px' }}>
          In <strong>Multi-Domain Compare</strong> mode, enter up to 20 domains to analyze ownership patterns across them.
          The tool groups domains by registrant organization or name, compares registrars and nameservers, and highlights
          relationship indicators. If multiple domains share the same registrar, nameservers, or registrant info, it&apos;s a
          strong signal they&apos;re managed by the same entity.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>
          Use Cases for Reverse WHOIS
        </h2>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong>Brand Protection:</strong> Companies use reverse WHOIS to find domains that may infringe on their trademarks.
          By identifying all domains registered by a suspected cybersquatter, you can take action against the entire portfolio rather
          than playing whack-a-mole with individual domains.
        </p>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong>Competitive Analysis:</strong> Discover what domains your competitors have registered. This can reveal upcoming
          product launches, market expansions, or defensive registrations. The multi-domain compare feature makes it easy to verify
          if a cluster of domains belongs to the same company.
        </p>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong>Fraud Investigation:</strong> Security researchers and investigators use reverse WHOIS to map out networks of
          domains used in phishing, spam, or malware campaigns. Shared registration details across suspicious domains are a red flag.
        </p>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong>Domain Acquisition:</strong> When you want to buy a domain, understanding the owner&apos;s portfolio helps you
          negotiate. If they own hundreds of similar domains, they&apos;re likely a domain investor with different expectations
          than a small business owner.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>
          WHOIS Privacy and GDPR
        </h2>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '16px' }}>
          Since GDPR took effect in 2018, most registrars automatically redact personal information from WHOIS records for
          domains registered by individuals in the EU. Many registrars now apply privacy protection globally. Our tool clearly
          flags when data is redacted, so you know what&apos;s available. Even when personal details are hidden, you can still
          compare registrars, nameservers, creation dates, and status codes to identify related domains.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>
          RDAP vs Traditional WHOIS
        </h2>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '0' }}>
          This tool uses RDAP rather than legacy WHOIS port 43. RDAP returns structured JSON data with consistent formatting
          across registries, supports HTTPS for secure queries, includes standardized contact roles (registrant, admin, tech, abuse),
          and provides vCard-formatted contact information. All lookups happen directly in your browser — no server-side processing,
          no data logging, and no rate limiting beyond what the public RDAP servers enforce.
        </p>
      </div>
    </StaticPage>
  );
}
