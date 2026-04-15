import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DnsExportTool from './DnsExportTool';

export const metadata = {
  title: 'DNS Record Export Tool — Export DNS Records to Zone File, CSV & JSON | DomyDomains',
  description: 'Free DNS record export tool. Fetch all DNS records for any domain and export them as a BIND zone file, CSV spreadsheet, or JSON. Export A, AAAA, MX, NS, TXT, CNAME, SOA, CAA, SRV, and PTR records instantly.',
  keywords: 'DNS export, export DNS records, DNS zone file, BIND zone file export, DNS to CSV, DNS to JSON, download DNS records, DNS record backup, zone file generator, DNS record dump',
  alternates: { canonical: '/dns-export' },
  openGraph: {
    title: 'DNS Record Export Tool — Export DNS Records to Zone File, CSV & JSON',
    description: 'Fetch all DNS records for any domain and download them as a BIND zone file, CSV, or JSON. Free, instant, no sign-up required.',
    url: 'https://domydomains.com/dns-export',
  },
};

export default function DnsExportPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="DNS Record Export Tool"
        description="Export all DNS records for any domain as a BIND zone file, CSV spreadsheet, or JSON. Fetch A, AAAA, MX, NS, TXT, CNAME, SOA, CAA, SRV, and PTR records and download them in your preferred format."
        url="/dns-export"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        DNS Record Export Tool
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Export all DNS records for any domain as a BIND zone file, CSV spreadsheet, or JSON document.
        Fetch A, AAAA, MX, NS, TXT, CNAME, SOA, CAA, SRV, and PTR records — then download or copy instantly.
      </p>

      <DnsExportTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is a DNS Record Export?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A DNS record export is a snapshot of all the Domain Name System records configured for a domain.
          DNS records are the instructions that tell the internet how to route traffic to your website,
          where to deliver email, which SSL certificate authorities are authorized, and more. Exporting
          these records into a structured format — like a BIND zone file, CSV, or JSON — gives you a
          portable, human-readable backup of your domain&apos;s configuration that you can store, share,
          or import into another DNS provider.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          This tool queries Google&apos;s public DNS API (dns.google) directly from your browser, fetching
          ten different record types simultaneously. No data is sent to our servers — everything happens
          client-side. You can export DNS records for any publicly resolvable domain without signing up
          or paying anything.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Export DNS Records?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Domain Migration:</strong> When moving a domain between registrars
          or DNS hosting providers, an exported zone file ensures you can recreate every record exactly as it was.
          Without an export, you risk missing critical records like TXT verification entries, CAA policies, or
          SRV records that power specific services. A BIND zone file can often be imported directly into providers
          like Cloudflare, AWS Route 53, Google Cloud DNS, and DigitalOcean.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Backup and Documentation:</strong> Even if you&apos;re not migrating,
          keeping a periodic export of your DNS records is smart infrastructure hygiene. If someone accidentally
          deletes or modifies a record, you have a reference to restore from. CSV exports are especially useful
          for documentation — they open in any spreadsheet application, making it easy to audit records across
          multiple domains or share configurations with your team.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Automation and Scripting:</strong> The JSON export format is designed
          for developers and DevOps engineers who need to parse DNS data programmatically. Feed it into scripts
          that compare configurations across environments, validate that production and staging domains match,
          or generate Terraform or Pulumi infrastructure-as-code definitions from existing DNS setups.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Security Auditing:</strong> Exporting DNS records lets you review
          your entire DNS footprint in one view. Check that SPF, DKIM, and DMARC records are present in your
          TXT records. Verify that CAA records restrict which certificate authorities can issue SSL certificates.
          Confirm that no unexpected CNAME or A records point to decommissioned servers — a common source of
          subdomain takeover vulnerabilities.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Export Formats Explained</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>BIND Zone File:</strong> The industry-standard format for DNS records,
          used by BIND (Berkeley Internet Name Domain), the most widely deployed DNS server software. Zone files
          use a tab-separated format with the record name, TTL, class (IN), record type, and data. Most DNS
          providers accept zone file imports, making this the best format for migrations.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>CSV (Comma-Separated Values):</strong> A universal spreadsheet format.
          Open DNS exports in Excel, Google Sheets, or LibreOffice to sort, filter, and analyze records. CSV is
          ideal for non-technical stakeholders who need to review DNS configurations or for bulk comparisons
          across multiple domains.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7 }}>
          <strong style={{ color: '#fff' }}>JSON (JavaScript Object Notation):</strong> The go-to format for
          developers. JSON exports are structured, nested by record type, and easy to parse in any programming
          language. Use JSON exports to build automated DNS monitoring, generate infrastructure-as-code, or
          feed into CI/CD pipelines that validate DNS configuration before deployment.
        </p>
      </section>
    </StaticPage>
  );
}
