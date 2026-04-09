import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import RegistrarDetectorTool from './RegistrarDetectorTool';

export const metadata = {
  title: 'Domain Registrar Detector — Find Which Registrar a Domain Uses | DomyDomains',
  description: 'Free domain registrar detector tool. Instantly identify the registrar, IANA ID, WHOIS server, nameservers, and domain status flags for any domain name using live RDAP data. No signup required.',
  keywords: 'domain registrar detector, which registrar is my domain, find domain registrar, domain registrar lookup, registrar checker, who is my registrar, domain registrar finder, RDAP lookup, IANA registrar ID, domain transfer registrar, identify domain registrar, registrar identification tool',
  alternates: { canonical: '/registrar-detector' },
  openGraph: {
    title: 'Domain Registrar Detector — Identify Any Domain\'s Registrar Instantly',
    description: 'Find out which registrar manages any domain name. See IANA ID, abuse contacts, nameservers, expiration dates, and status flags — all from live RDAP data.',
    url: 'https://domydomains.com/registrar-detector',
  },
};

export default function RegistrarDetectorPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Registrar Detector"
        description="Free domain registrar identification tool. Detects the registrar, IANA ID, WHOIS server, nameservers, registration and expiration dates, and EPP status codes for any domain using live RDAP queries."
        url="/registrar-detector"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Registrar Detector
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '720px' }}>
        Find out which registrar manages any domain name. Enter a domain below to instantly see its registrar,
        IANA ID, WHOIS server, nameservers, registration dates, and EPP status flags — all queried live from
        the global RDAP network.
      </p>

      <RegistrarDetectorTool />

      <section style={{ marginBottom: '48px', marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is a Domain Registrar?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A domain registrar is an ICANN-accredited company authorized to sell and manage domain name registrations.
          When you &quot;buy&quot; a domain, you&apos;re actually leasing it from a registry (like Verisign for .com)
          through a registrar that acts as the intermediary. Popular registrars include GoDaddy, Namecheap,
          Cloudflare Registrar, Google Domains (now Squarespace), Porkbun, and Hover. Each registrar is assigned
          a unique IANA Registrar ID that appears in WHOIS and RDAP records, making it possible to definitively
          identify which company manages a given domain.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Knowing a domain&apos;s registrar is essential for domain transfers, dispute resolution, reporting abuse,
          and verifying ownership chains. It&apos;s also useful competitive intelligence — if you&apos;re researching
          a domain you want to acquire, knowing the registrar tells you where to initiate the transfer process or
          where the current owner manages their DNS.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How This Tool Detects Domain Registrars</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Our registrar detector uses RDAP (Registration Data Access Protocol), the modern, structured replacement
          for the aging WHOIS protocol. When you enter a domain, the tool queries the global RDAP network — starting
          from the IANA bootstrap registry, which routes the request to the correct TLD registry&apos;s RDAP server.
          The response contains machine-readable JSON with the registrar entity, its IANA ID, vCard contact details,
          and links to the registrar&apos;s own RDAP endpoint.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          For TLDs that don&apos;t yet support RDAP, the tool falls back to a nameserver-based heuristic. Many
          registrars use distinctive nameserver domains — for example, <code>domaincontrol.com</code> is GoDaddy,
          <code>registrar-servers.com</code> is Namecheap, and <code>cloudflare.com</code> nameservers indicate
          Cloudflare. While not as precise as RDAP (a domain can use third-party DNS), this fallback still provides
          useful guidance for most domains.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding Domain Status Flags (EPP Codes)</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Every registered domain carries one or more Extensible Provisioning Protocol (EPP) status codes that
          control what actions can be performed on it. These flags are set by either the registrar (client-side)
          or the registry (server-side) and serve as the domain&apos;s permission system. Common codes include:
        </p>
        <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>clientTransferProhibited</strong> — The registrant has locked the domain to prevent unauthorized
          transfers. This is the most common protection and is enabled by default at most registrars.</li>
          <li><strong>serverTransferProhibited</strong> — The registry itself has locked transfers, typically during
          a dispute or the first 60 days after registration.</li>
          <li><strong>clientDeleteProhibited / serverDeleteProhibited</strong> — Prevents accidental or malicious
          deletion of the domain.</li>
          <li><strong>redemptionPeriod</strong> — The domain has expired and entered a grace period where the
          original registrant can still recover it, usually for an additional fee.</li>
          <li><strong>pendingDelete</strong> — The domain is scheduled for release back to the public pool.</li>
        </ul>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          If you&apos;re planning to acquire or transfer a domain, checking these status flags first saves time.
          A domain with <code>serverTransferProhibited</code> cannot be transferred until the registry lifts the
          lock, regardless of what the current registrant does.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>When to Use a Registrar Detector</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          There are several practical scenarios where knowing a domain&apos;s registrar matters:
        </p>
        <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>Domain acquisition:</strong> Before making an offer on a domain, knowing the registrar
          helps you understand the transfer process and whether escrow services like Escrow.com or Dan.com are
          natively supported.</li>
          <li><strong>Domain transfers:</strong> To transfer a domain, you need to unlock it at the current registrar
          and obtain an authorization code. Knowing which registrar holds the domain tells you exactly where to go.</li>
          <li><strong>Abuse reporting:</strong> If a domain is being used for phishing or spam, the registrar&apos;s
          abuse contact (shown by this tool) is the correct place to file a complaint.</li>
          <li><strong>Competitive research:</strong> Identifying where competitors register their domains can reveal
          their infrastructure choices and DNS provider preferences.</li>
          <li><strong>Expiration monitoring:</strong> Paired with our <a href="/domain-watchlist" style={{ color: '#8b5cf6' }}>Domain Watchlist</a> tool,
          registrar detection helps you track domains approaching expiration at specific registrars.</li>
        </ul>
        <p style={{ color: '#ccc', lineHeight: 1.7 }}>
          For a deeper dive into a domain&apos;s DNS setup, combine this tool with our <a href="/dns-lookup" style={{ color: '#8b5cf6' }}>DNS Lookup</a>,
          <a href="/nameserver-lookup" style={{ color: '#8b5cf6' }}> Nameserver Lookup</a>, and
          <a href="/domain-history" style={{ color: '#8b5cf6' }}> Domain History</a> tools.
        </p>
      </section>
    </StaticPage>
  );
}
