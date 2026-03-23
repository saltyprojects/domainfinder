import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import ReverseIPLookup from './ReverseIPLookup';

export const metadata = {
  title: 'Reverse IP Lookup — Find Hostnames & Hosting Provider | DomyDomains',
  description: 'Free reverse IP lookup tool. Enter any IP address or domain to find PTR records, reverse DNS hostnames, hosting provider, and full DNS details. No signup required.',
  keywords: 'reverse ip lookup, reverse dns lookup, PTR record checker, find hostname from ip, ip to domain, reverse ip search, hosting provider lookup, dns reverse lookup, ip address lookup, who is hosting this ip',
  alternates: { canonical: '/reverse-ip-lookup' },
  openGraph: {
    title: 'Reverse IP Lookup — Find Hostnames & Hosting Provider',
    description: 'Look up PTR records, reverse DNS hostnames, and identify hosting providers from any IP address or domain — completely free.',
    url: 'https://domydomains.com/reverse-ip-lookup',
  },
};

export default function ReverseIPLookupPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Reverse IP Lookup"
        description="Look up PTR records, reverse DNS hostnames, hosting provider, and full DNS details for any IP address or domain name. Uses Google DNS API for real-time lookups."
        url="/reverse-ip-lookup"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Reverse IP Lookup
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Enter an IP address or domain name to discover its reverse DNS records, identify the hosting provider, 
        and view a complete DNS profile. All lookups happen in your browser using public DNS — no data stored.
      </p>

      <ReverseIPLookup />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is a Reverse IP Lookup?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            A reverse IP lookup (also called reverse DNS or rDNS) is the process of resolving an IP address back 
            to a hostname. While standard DNS converts domain names into IP addresses (forward lookup), reverse 
            DNS does the opposite — it takes an IP address and returns the associated PTR (pointer) record, 
            revealing the hostname configured by the IP owner. This is done by querying the special 
            <code style={{ color: '#8b5cf6', background: '#8b5cf610', padding: '2px 6px', borderRadius: '4px' }}>in-addr.arpa</code> domain 
            for IPv4 addresses or <code style={{ color: '#8b5cf6', background: '#8b5cf610', padding: '2px 6px', borderRadius: '4px' }}>ip6.arpa</code> for IPv6.
          </p>
          <p style={{ marginTop: '16px' }}>
            Reverse DNS is a fundamental part of internet infrastructure used by email servers, security tools, 
            and network administrators. Email servers commonly perform reverse DNS checks to verify that sending 
            mail servers have properly configured PTR records — mail from IPs without reverse DNS is frequently 
            flagged as spam. Network administrators use reverse lookups to identify devices on their networks, 
            trace the source of suspicious traffic, and verify hosting configurations.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Reverse DNS Matters</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { icon: '📧', title: 'Email Deliverability', desc: 'Mail servers check PTR records to verify senders. Missing or mismatched reverse DNS can cause your emails to land in spam folders or be rejected entirely. All major email providers — Gmail, Outlook, Yahoo — perform rDNS checks.' },
            { icon: '🔒', title: 'Security & Forensics', desc: 'Reverse DNS helps trace suspicious IP addresses back to their owners. Security teams use it to identify the source of attacks, verify server identities, and detect spoofed connections. It is an essential step in incident response workflows.' },
            { icon: '🏢', title: 'Hosting Identification', desc: 'PTR records often reveal the hosting provider behind an IP address. Entries like "ec2-3-14-15-92.compute.amazonaws.com" immediately identify AWS hosting, helping you understand a website\'s infrastructure stack.' },
            { icon: '🌐', title: 'Network Administration', desc: 'Administrators use reverse DNS to identify devices on their networks, troubleshoot connectivity issues, and maintain accurate network inventories. PTR records make log files human-readable by replacing raw IPs with meaningful hostnames.' },
            { icon: '✅', title: 'Server Verification', desc: 'Forward-confirmed reverse DNS (FCrDNS) matches the PTR record to an A record, providing a strong identity verification. Many services require this for TLS certificate validation and secure communications.' },
            { icon: '📊', title: 'Analytics & Research', desc: 'When analyzing web server logs or traffic patterns, reverse DNS converts anonymous IP addresses into identifiable hostnames — revealing bots, crawlers, competitor research activity, and legitimate visitor origins.' },
          ].map(item => (
            <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How Reverse DNS Works</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { step: '1', title: 'IP Address Reversal', desc: 'The IP address octets are reversed and appended with ".in-addr.arpa". For example, 8.8.4.4 becomes 4.4.8.8.in-addr.arpa. This reversed format is how DNS organizes reverse lookup zones.' },
            { step: '2', title: 'PTR Query Sent', desc: 'A DNS query for the PTR record type is sent to the recursive resolver. The query travels through the DNS hierarchy — from root servers to the authority responsible for that IP block.' },
            { step: '3', title: 'Record Returned', desc: 'If a PTR record exists, the authoritative DNS server returns the hostname. For example, 4.4.8.8.in-addr.arpa might return "dns.google" as the PTR hostname.' },
            { step: '4', title: 'Verification (Optional)', desc: 'For Forward-Confirmed rDNS (FCrDNS), the returned hostname is resolved back to an IP address. If the IP matches the original query, the identity is verified — a strong trust signal used by mail servers.' },
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', gap: '16px', background: '#111', borderRadius: '10px', padding: '16px 20px', border: '1px solid #1e1e1e' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', background: '#8b5cf620',
                color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.95rem', flexShrink: 0,
              }}>
                {item.step}
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 4px', color: '#fff' }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'What is a PTR record?', a: 'A PTR (pointer) record is a DNS record that maps an IP address to a hostname — the reverse of an A record. PTR records are stored in special reverse lookup zones under the in-addr.arpa (IPv4) or ip6.arpa (IPv6) domains. They must be configured by the owner of the IP address block, typically the hosting provider or ISP.' },
          { q: 'Why does my IP have no PTR record?', a: 'Not all IPs have reverse DNS configured. PTR records must be explicitly set up by the IP block owner (usually your hosting provider). Residential ISPs and some cloud providers don\'t always configure PTR records by default. You can request one from your provider — it\'s especially important for mail servers.' },
          { q: 'Can reverse DNS reveal all domains on an IP?', a: 'No — reverse DNS only shows the PTR record configured by the IP owner, which is typically a single hostname. Shared hosting servers may host hundreds of domains on one IP, but PTR records won\'t list them all. For that, you\'d need certificate transparency logs or passive DNS databases.' },
          { q: 'Is reverse IP lookup the same as WHOIS?', a: 'No. Reverse IP lookup queries DNS PTR records to find hostnames associated with an IP. WHOIS queries registration databases to find the owner/registrant of an IP block or domain. They provide different but complementary information — rDNS tells you what the IP resolves to, WHOIS tells you who owns it.' },
          { q: 'How is this different from a regular DNS lookup?', a: 'Regular (forward) DNS resolves a domain name to an IP address using A or AAAA records. Reverse DNS does the opposite — it resolves an IP address back to a hostname using PTR records. Both are essential DNS operations, but they serve different purposes and query different record types.' },
          { q: 'Can I use reverse DNS for email authentication?', a: 'Yes — reverse DNS is a key part of email authentication. Receiving mail servers check that the sending IP has a valid PTR record matching the sending domain. This is one of several checks alongside SPF, DKIM, and DMARC. Emails from IPs without proper reverse DNS are much more likely to be flagged as spam.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 5 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>More domain tools</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Check DNS records, verify SSL certificates, find domain age, and more — all free.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/dns-lookup" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            DNS Lookup →
          </a>
          <a href="/nameserver-lookup" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            Nameserver Lookup
          </a>
          <a href="/tools" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            All Tools
          </a>
        </div>
      </section>
    </StaticPage>
  );
}
