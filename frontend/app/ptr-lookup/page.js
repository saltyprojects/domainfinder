import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import PtrLookupTool from './PtrLookupTool';

export const metadata = {
  title: 'PTR Record Lookup — Free Reverse DNS Lookup Tool | DomyDomains',
  description: 'Free PTR record lookup tool. Perform reverse DNS lookups for any IP address. Find the hostname associated with an IP, verify forward-confirmed reverse DNS (FCrDNS), and check ARPA records.',
  keywords: 'PTR record lookup, reverse DNS lookup, rDNS lookup, PTR record checker, reverse IP lookup, ARPA record, in-addr.arpa, ip6.arpa, forward confirmed reverse DNS, FCrDNS, reverse DNS checker, IP to hostname',
  alternates: { canonical: '/ptr-lookup' },
  openGraph: {
    title: 'PTR Record Lookup — Free Reverse DNS Lookup Tool',
    description: 'Look up PTR records for any IP address. Perform reverse DNS lookups, verify FCrDNS, and inspect ARPA domain records.',
    url: 'https://domydomains.com/ptr-lookup',
  },
};

export default function PtrLookupPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="PTR Record Lookup"
        description="Perform reverse DNS (rDNS) lookups for any IP address. Find the hostname mapped to an IP via PTR records, verify forward-confirmed reverse DNS (FCrDNS), and inspect ARPA domain records."
        url="/ptr-lookup"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        PTR Record Lookup
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Perform reverse DNS lookups for any IP address. Enter an IPv4 or IPv6 address (or a hostname) to find the
        associated PTR record and verify forward-confirmed reverse DNS (FCrDNS).
      </p>

      <PtrLookupTool />

      <section style={{ marginBottom: '48px', marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is a PTR Record?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A PTR (Pointer) record is a type of DNS record that maps an IP address to a hostname — the reverse of what
          an A record does. While an A record answers &quot;what IP address does this domain point to?&quot;, a PTR record
          answers &quot;what hostname is associated with this IP address?&quot; This process is called <strong>reverse DNS
          lookup</strong> (rDNS).
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          PTR records are stored under special ARPA domains. For IPv4 addresses, the IP octets are reversed and
          appended to <code style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>in-addr.arpa</code>. For
          example, the PTR record for <strong>8.8.8.8</strong> lives at <code style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>8.8.8.8.in-addr.arpa</code>. IPv6
          addresses use <code style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>ip6.arpa</code> with each nibble expanded and reversed.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is Forward-Confirmed Reverse DNS (FCrDNS)?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Forward-confirmed reverse DNS (FCrDNS) is a verification technique that checks whether an IP address and its
          PTR hostname are consistent. The check works in two steps: first, look up the PTR record for the IP to get a
          hostname; second, look up the A or AAAA record for that hostname to see if it resolves back to the original IP.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          If both directions match, the IP passes FCrDNS. This is significant because PTR records alone can claim any
          hostname — only FCrDNS proves that the hostname owner acknowledges the IP. Many email servers use FCrDNS as
          a spam filtering criterion: messages from IPs that fail FCrDNS are more likely to be flagged as spam.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Are PTR Records Important?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          PTR records play a critical role in several areas of internet infrastructure and security:
        </p>
        <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>Email deliverability</strong> — Most major email providers (Gmail, Outlook, Yahoo) check PTR records when receiving mail. An IP without a valid PTR record, or one that fails FCrDNS, will often have its email rejected or sent to spam.</li>
          <li><strong>Server identification</strong> — PTR records help identify which server or service is using a particular IP address, useful for troubleshooting network issues.</li>
          <li><strong>Security auditing</strong> — During security investigations, reverse DNS lookups help identify the operator of a suspicious IP address.</li>
          <li><strong>Logging and monitoring</strong> — Many logging systems automatically perform rDNS lookups to show human-readable hostnames instead of raw IP addresses in access logs.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Set Up PTR Records</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Unlike most DNS records, PTR records cannot be set through your domain registrar or regular DNS provider.
          Because PTR records are tied to IP address blocks (not domain names), they must be configured by whoever
          controls the IP address — typically your hosting provider or ISP. Most cloud providers (AWS, Google Cloud,
          DigitalOcean, Hetzner) offer a way to set PTR records through their control panel or API.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          When setting up a PTR record for email sending, make sure the PTR hostname resolves back to the same IP
          (FCrDNS) and matches either your server&apos;s HELO/EHLO hostname or your domain name. A well-configured PTR
          record is one of the fundamental requirements for reliable email delivery alongside SPF, DKIM, and DMARC.
        </p>
      </section>
    </StaticPage>
  );
}
