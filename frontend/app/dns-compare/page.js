import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DnsCompareTool from './DnsCompareTool';

export const metadata = {
  title: 'DNS Record Comparison Tool — Compare DNS Records Side by Side | DomyDomains',
  description: 'Free DNS comparison tool. Compare A, AAAA, MX, NS, TXT, CNAME, and SOA records between two domains side by side. Spot differences in DNS configuration, email setup, hosting, and security records instantly.',
  keywords: 'DNS comparison, compare DNS records, DNS diff, domain DNS compare, DNS record comparison tool, compare MX records, compare nameservers, DNS side by side, domain comparison',
  alternates: { canonical: '/dns-compare' },
  openGraph: {
    title: 'DNS Record Comparison Tool — Compare DNS Records Side by Side',
    description: 'Compare DNS records between two domains side by side. Spot differences in A, AAAA, MX, NS, TXT, CNAME, and SOA records instantly — free and fast.',
    url: 'https://domydomains.com/dns-compare',
  },
};

export default function DnsComparePage() {
  return (
    <StaticPage>
      <ToolSchema
        name="DNS Record Comparison Tool"
        description="Compare DNS records between two domains side by side. Analyze A, AAAA, MX, NS, TXT, CNAME, and SOA records to spot differences in hosting, email, and security configuration."
        url="/dns-compare"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        DNS Record Comparison Tool
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Compare DNS records between two domains side by side. Analyze A, AAAA, MX, NS, TXT, CNAME, and SOA
        records to quickly spot differences in hosting, email configuration, and security setup.
      </p>

      <DnsCompareTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Compare DNS Records?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          DNS (Domain Name System) records are the backbone of how domains work on the internet. They control
          everything from where your website is hosted (A and AAAA records) to how email is routed (MX records),
          which security policies are enforced (TXT records for SPF, DKIM, and DMARC), and which DNS provider
          manages the domain (NS records). Comparing DNS records between two domains is an essential task for
          system administrators, DevOps teams, and domain managers.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A side-by-side DNS comparison helps you identify configuration differences that could explain why one
          domain works differently from another. For example, if you&apos;re migrating a domain to a new hosting
          provider, you can compare the old and new domain&apos;s records to ensure nothing was missed. If you manage
          multiple brands, comparing their DNS records helps you maintain consistency across properties — ensuring
          all domains have matching email authentication, security headers, and CDN configurations.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common Use Cases for DNS Comparison</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Domain Migration:</strong> When transferring a domain to a new registrar
          or DNS provider, comparing before and after records ensures no critical records were lost. Missing an MX
          record during migration can break email delivery. Missing a TXT record can disable SPF email authentication
          and cause your messages to land in spam folders.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Troubleshooting:</strong> When one domain works but another doesn&apos;t,
          comparing their DNS records quickly reveals the difference. Perhaps the broken domain is missing a CNAME
          record that the working domain has, or it points to a different IP address. This tool makes it easy to
          spot those differences at a glance.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Security Audits:</strong> Compare the security-related TXT records
          between your domains. Are all your domains protected with SPF, DKIM, and DMARC? Do they all use DNSSEC?
          A quick DNS comparison reveals gaps in your email security posture across different domains.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Competitive Analysis:</strong> Compare your domain&apos;s DNS setup with
          a competitor&apos;s. See which CDN or hosting provider they use, what email service they run, and whether
          they have advanced DNS configurations like CAA records or DNSSEC. This information is publicly available
          through DNS and can inform your own infrastructure decisions.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>DNS Record Types Explained</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          This tool compares seven core DNS record types. <strong style={{ color: '#fff' }}>A records</strong> map
          a domain to an IPv4 address, while <strong style={{ color: '#fff' }}>AAAA records</strong> map to IPv6
          addresses. <strong style={{ color: '#fff' }}>MX records</strong> specify mail servers and their priority.{' '}
          <strong style={{ color: '#fff' }}>NS records</strong> define the authoritative nameservers for the domain.{' '}
          <strong style={{ color: '#fff' }}>TXT records</strong> hold text data including SPF policies, domain
          verification tokens, and DKIM keys. <strong style={{ color: '#fff' }}>CNAME records</strong> create aliases
          pointing one domain to another. Finally, <strong style={{ color: '#fff' }}>SOA records</strong> contain
          zone authority information including the primary nameserver, admin email, serial number, and cache timers.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7 }}>
          All lookups are performed using Google&apos;s public DNS API (dns.google) directly from your browser.
          No data is sent to our servers, and you can compare as many domains as you like — completely free with
          no rate limits or sign-up required.
        </p>
      </section>
    </StaticPage>
  );
}
