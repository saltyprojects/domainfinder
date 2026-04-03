import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DohTesterTool from './DohTesterTool';

export const metadata = {
  title: 'DNS over HTTPS (DoH) Tester — Test & Compare DoH Resolvers | DomyDomains',
  description: 'Free DNS over HTTPS tester. Query multiple DoH providers (Google, Cloudflare, Quad9, NextDNS, AdGuard) side by side. Compare response times, results, and DNSSEC validation across resolvers.',
  keywords: 'DNS over HTTPS, DoH tester, DoH resolver test, DNS over HTTPS test, compare DoH providers, Cloudflare DNS test, Google DNS test, Quad9 test, encrypted DNS, secure DNS lookup, DoH speed test',
  alternates: { canonical: '/doh-tester' },
  openGraph: {
    title: 'DNS over HTTPS (DoH) Tester — Test & Compare DoH Resolvers',
    description: 'Test and compare DNS over HTTPS resolvers side by side. Query Google, Cloudflare, Quad9, and more — compare speeds, results, and DNSSEC validation instantly.',
    url: 'https://domydomains.com/doh-tester',
  },
};

export default function DohTesterPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="DNS over HTTPS (DoH) Tester"
        description="Test and compare DNS over HTTPS resolvers. Query multiple DoH providers side by side to compare response times, DNS results, and DNSSEC validation status."
        url="/doh-tester"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        DNS over HTTPS (DoH) Tester
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Test and compare DNS over HTTPS resolvers side by side. Query Google, Cloudflare, Quad9, and other
        DoH providers to compare response times, DNS results, and DNSSEC validation — all from your browser.
      </p>

      <DohTesterTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is DNS over HTTPS (DoH)?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          DNS over HTTPS (DoH) is a protocol that encrypts DNS queries by sending them over HTTPS connections
          instead of plain-text UDP. Traditional DNS queries are unencrypted, meaning anyone on your network — your
          ISP, a public Wi-Fi operator, or a malicious actor — can see which websites you&apos;re visiting. DoH
          prevents this by wrapping DNS lookups in the same encryption used for secure web browsing.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Major browsers like Chrome, Firefox, Edge, and Safari now support DoH natively. When enabled, your
          browser sends DNS queries directly to a trusted DoH resolver instead of using your network&apos;s default
          DNS server. This improves privacy, prevents DNS manipulation, and can even improve performance if your
          ISP&apos;s DNS servers are slow or unreliable.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Test DoH Resolvers?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Not all DoH resolvers are created equal. Different providers offer different features: some prioritize
          speed, others focus on security with DNSSEC validation, and some include built-in malware or ad blocking.
          Testing resolvers helps you choose the best one for your needs. Response time varies based on your
          geographic location, so a resolver that&apos;s fast for someone in Europe may be slower in Asia.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          This tool queries multiple DoH providers simultaneously from your browser, giving you a real-world
          comparison of how each resolver performs from your exact location. You can compare response times, verify
          that all resolvers return the same DNS records, and check which providers validate DNSSEC signatures. If
          one resolver returns different results than the others, it could indicate DNS filtering, censorship, or a
          configuration issue worth investigating.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Comparing Popular DoH Providers</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Google Public DNS (dns.google):</strong> One of the most widely used
          public DNS services globally. Offers fast resolution with DNSSEC validation. Logs queries for diagnostic
          purposes but deletes personally identifiable information within 48 hours.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Cloudflare DNS (1.1.1.1):</strong> Known for speed and privacy.
          Cloudflare commits to never selling user data and purges all DNS logs within 24 hours. Consistently
          ranks among the fastest public DNS resolvers worldwide with DNSSEC support.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Quad9 (dns.quad9.org):</strong> A nonprofit DNS service that blocks
          known malicious domains using threat intelligence feeds. Quad9 does not log user IP addresses and
          validates DNSSEC. Ideal for users who want built-in security without installing additional software.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>AdGuard DNS:</strong> Focuses on ad and tracker blocking at the DNS
          level. Queries to known advertising and tracking domains are blocked before they reach your device.
          Available in both standard and family-safe filtering modes.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How This Tool Works</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Enter any domain name and select a DNS record type (A, AAAA, MX, TXT, NS, CNAME, or SOA). The tool
          sends your query to multiple DoH resolvers simultaneously using the JSON API format defined in RFC 8484.
          Each query is timed from your browser, giving you an accurate picture of real-world latency from your
          location. Results are displayed side by side so you can instantly compare responses, TTL values, and
          DNSSEC validation status across all providers.
        </p>
      </section>
    </StaticPage>
  );
}
