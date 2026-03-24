import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainBlacklistChecker from './DomainBlacklistChecker';

export const metadata = {
  title: 'Domain Blacklist Checker — Check If Your Domain Is Blacklisted | DomyDomains',
  description: 'Free domain blacklist checker tool. Check your domain and IP against 14+ major DNS blacklists including Spamhaus, SURBL, URIBL, SpamCop, and Barracuda. Protect your email deliverability and domain reputation.',
  keywords: 'domain blacklist checker, blacklist check, dns blacklist lookup, dnsbl checker, spamhaus check, is my domain blacklisted, email blacklist checker, ip blacklist check, rbl check, domain reputation checker, spam blacklist test, surbl check, uribl check',
  alternates: { canonical: '/domain-blacklist-checker' },
  openGraph: {
    title: 'Domain Blacklist Checker — Check If Your Domain Is Blacklisted',
    description: 'Check your domain against 14+ major DNS blacklists instantly. Detect spam listings, protect email deliverability, and monitor domain reputation. Free browser-based tool.',
    url: 'https://domydomains.com/domain-blacklist-checker',
  },
};

export default function DomainBlacklistCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Blacklist Checker"
        description="Check your domain and IP against 14+ major DNS blacklists including Spamhaus, SURBL, URIBL, SpamCop, and Barracuda. Detect spam listings and protect email deliverability. Free browser-based tool."
        url="/domain-blacklist-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Blacklist Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Instantly check if your domain or IP address appears on major DNS blacklists (DNSBLs).
        We scan 14 of the most widely-used blacklists to help you monitor your domain reputation
        and ensure your emails reach the inbox.
      </p>

      <DomainBlacklistChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Are DNS Blacklists?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            DNS-based Blackhole Lists (DNSBLs) are real-time databases that track domains and IP addresses known to
            send spam, host malware, or engage in other malicious activities. Email servers around the world consult
            these lists when deciding whether to accept or reject incoming messages. If your domain or sending IP
            appears on one of these lists, your emails may be silently dropped or sent to spam folders — even if
            you are sending legitimate messages.
          </p>
          <p style={{ marginTop: '16px' }}>
            Blacklists are maintained by organizations like Spamhaus, SURBL, URIBL, SpamCop, and Barracuda Networks.
            Each list has its own criteria for adding and removing entries. Some focus on the domain name itself
            (domain-based blacklists like Spamhaus DBL), while others track IP addresses (IP-based blacklists like
            Spamhaus ZEN). Being listed on even one major blacklist can significantly impact your ability to
            communicate via email.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Check Your Domain for Blacklists?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Regular blacklist monitoring is essential for any business that relies on email communication. Here are
            the most common reasons domains end up on blacklists — and why you should check regularly:
          </p>
          <ul style={{ marginTop: '12px', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#fff' }}>Compromised accounts:</strong> A hacked email account or web server
              can send thousands of spam messages before you notice, getting your domain blacklisted within hours.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#fff' }}>Shared hosting:</strong> If you share an IP address with a spammer
              on the same hosting provider, their actions can get your IP blacklisted even if you did nothing wrong.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#fff' }}>Missing email authentication:</strong> Without proper SPF, DKIM, and
              DMARC records, spammers can forge emails that appear to come from your domain, damaging your reputation.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#fff' }}>Poor list hygiene:</strong> Sending emails to outdated or purchased
              lists with high bounce rates can trigger spam traps and result in blacklisting.
            </li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Get Delisted from a Blacklist</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            If our tool finds your domain on a blacklist, don&apos;t panic. Most blacklists have a straightforward
            removal process. First, identify and fix the root cause — whether it&apos;s a compromised account,
            misconfigured mail server, or malware on your website. Then visit the blacklist operator&apos;s website
            to submit a delisting request. Most lists like Spamhaus provide a self-service lookup and removal tool.
          </p>
          <p style={{ marginTop: '16px' }}>
            After delisting, implement preventative measures: configure SPF, DKIM, and DMARC records, use strong
            passwords, keep your software updated, and monitor your domain reputation regularly. This tool makes it
            easy to run periodic checks — bookmark it and check weekly to catch issues early before they impact
            your email deliverability.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Blacklists We Check</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {[
            { name: 'Spamhaus DBL', desc: 'The most authoritative domain blocklist, used by major ISPs worldwide.' },
            { name: 'Spamhaus ZEN', desc: 'Combined IP blocklist covering known spam sources, exploits, and policy blocks.' },
            { name: 'SURBL Multi', desc: 'Identifies domains appearing in unsolicited messages (spam URI detection).' },
            { name: 'URIBL Black', desc: 'Tracks domains found in the body of spam emails.' },
            { name: 'SpamCop', desc: 'Community-driven real-time blocklist based on user spam reports.' },
            { name: 'Barracuda BRBL', desc: 'Maintained by Barracuda Networks, widely used in enterprise email filtering.' },
          ].map((bl, i) => (
            <div key={i} style={{
              background: '#111', borderRadius: '10px', padding: '16px',
              border: '1px solid #2a2a2a',
            }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>{bl.name}</h3>
              <p style={{ color: '#888', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{bl.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
