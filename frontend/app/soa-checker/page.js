import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import SoaCheckerTool from './SoaCheckerTool';

export const metadata = {
  title: 'SOA Record Checker — Check Start of Authority DNS Records | DomyDomains',
  description: 'Free SOA record checker tool. Look up Start of Authority (SOA) DNS records for any domain. View primary nameserver, admin email, serial number, refresh/retry/expire timers, and get configuration recommendations.',
  keywords: 'SOA record checker, SOA record lookup, start of authority record, SOA DNS record, check SOA record, DNS SOA lookup, domain SOA check, nameserver SOA, zone authority record, DNS zone configuration',
  alternates: { canonical: '/soa-checker' },
  openGraph: {
    title: 'SOA Record Checker — Check Start of Authority DNS Records',
    description: 'Look up SOA DNS records for any domain. View primary nameserver, admin contact, serial number, zone timers, and get a configuration grade with recommendations.',
    url: 'https://domydomains.com/soa-checker',
  },
};

export default function SoaCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="SOA Record Checker"
        description="Check Start of Authority (SOA) DNS records for any domain. View the primary nameserver, admin email, serial number, refresh, retry, expire, and minimum TTL values with configuration analysis and grading."
        url="/soa-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        SOA Record Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Look up the Start of Authority (SOA) record for any domain. View the primary nameserver, admin contact,
        serial number, and all zone timing parameters — with a configuration grade and actionable recommendations.
      </p>

      <SoaCheckerTool />

      <section style={{ marginBottom: '48px', marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is a SOA Record?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          The Start of Authority (SOA) record is one of the most fundamental DNS record types. Every DNS zone must
          have exactly one SOA record, and it defines the authoritative information about that zone — including
          the primary nameserver, the responsible administrator&apos;s email address, and a set of timing parameters
          that control how DNS data is synchronized between primary and secondary nameservers.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          The SOA record is defined in <strong>RFC 1035</strong> and is automatically created when a DNS zone is
          set up. It plays a critical role in DNS operations: secondary nameservers use the SOA serial number to
          determine whether their zone data is up to date, and the timing parameters control how often they check
          for updates, how long they retry on failure, and when they consider their cached data expired.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding SOA Record Fields</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A SOA record contains seven fields, each serving a specific purpose in zone management:
        </p>
        <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>MNAME (Primary NS)</strong> — The hostname of the primary authoritative nameserver for the zone. This is the server that holds the master copy of zone data.</li>
          <li><strong>RNAME (Admin Email)</strong> — The email address of the zone administrator, encoded in DNS format where the first dot replaces the @ symbol (e.g., admin.example.com = admin@example.com).</li>
          <li><strong>Serial Number</strong> — A version number for the zone. Best practice is the YYYYMMDDNN format, where NN is a daily revision counter. Secondary servers compare this to their cached serial to detect changes.</li>
          <li><strong>Refresh</strong> — How often (in seconds) secondary nameservers should check the primary for zone updates. Typical values range from 1 hour to 12 hours.</li>
          <li><strong>Retry</strong> — How long a secondary waits before retrying after a failed refresh attempt. Should always be less than the refresh interval.</li>
          <li><strong>Expire</strong> — The maximum time a secondary will continue serving zone data without successfully refreshing from the primary. After this time, the zone is considered invalid. RFC 1912 recommends 2–4 weeks.</li>
          <li><strong>Minimum TTL</strong> — Since RFC 2308, this field defines the negative caching TTL — how long DNS resolvers cache NXDOMAIN (domain not found) responses. Typical values are 1–3 hours.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Check SOA Records?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Checking a domain&apos;s SOA record reveals important information about its DNS infrastructure and
          configuration quality. Misconfigured SOA timing parameters can cause DNS propagation delays, secondary
          server synchronization failures, or excessive DNS traffic. A too-low expire time can cause outages if
          the primary nameserver goes down temporarily, while a too-high refresh interval means DNS changes take
          longer to propagate.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          The serial number format also provides operational insight. The widely-used YYYYMMDDNN convention tells
          you when the zone was last modified and how many revisions were made that day. This is particularly useful
          for troubleshooting DNS issues — if a zone serial hasn&apos;t changed in months, it may indicate the zone
          is unmanaged or that changes are being made without incrementing the serial properly.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Our SOA checker queries Google&apos;s public DNS resolver (dns.google) to retrieve the SOA record,
          parses all seven fields, checks values against RFC recommendations, and provides a configuration grade
          from A to D with specific recommendations for improvement. It also fetches NS records to give you a
          complete picture of the domain&apos;s authoritative DNS setup.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>SOA Record Best Practices</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          For optimal DNS operations, follow these SOA configuration guidelines based on RFC 1912 and industry
          best practices: set your refresh between 1–12 hours depending on how frequently you update DNS records.
          Keep retry shorter than refresh (typically 15–30 minutes). Set expire to 2–4 weeks to handle extended
          primary server outages. Use a negative caching TTL of 1–3 hours as recommended by RFC 2308 — too low
          increases resolver load, too high delays recovery from mistyped domains.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Always use the YYYYMMDDNN serial number format for human-readable version tracking. Ensure your MNAME
          points to an actual, reachable nameserver, and keep your RNAME email address current so DNS operators
          can contact you about zone issues. Many managed DNS providers (Cloudflare, Route 53, Google Cloud DNS)
          handle these settings automatically, but it&apos;s still worth auditing them periodically with this tool.
        </p>
      </section>
    </StaticPage>
  );
}
