import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import WhoisPrivacyChecker from './WhoisPrivacyChecker';

export const metadata = {
  title: 'WHOIS Privacy Checker — Is Your Domain Info Exposed? Free Privacy Scan | DomyDomains',
  description: 'Check if your domain WHOIS information is protected or publicly exposed. Free WHOIS privacy checker detects privacy services, redacted fields, and exposed personal data.',
  keywords: 'whois privacy checker, domain privacy check, whois protection, domain privacy status, whois guard checker, domain privacy protection, is my whois private, check whois privacy, domain information exposure',
  alternates: { canonical: '/whois-privacy-checker' },
  openGraph: {
    title: 'WHOIS Privacy Checker — Is Your Domain Information Exposed?',
    description: 'Instantly check if your domain WHOIS data is protected or publicly visible. Detects privacy services, exposed emails, phone numbers, and addresses.',
    url: 'https://domydomains.com/whois-privacy-checker',
  },
};

export default function WhoisPrivacyCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="WHOIS Privacy Checker"
        description="Check if your domain WHOIS information is protected or publicly exposed. Detects privacy services, redacted fields, and exposed personal data."
        url="/whois-privacy-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        WHOIS Privacy Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Is your domain registration information publicly visible? Check any domain to see if WHOIS privacy 
        protection is enabled, which fields are redacted, and whether personal data like email, phone, 
        or address is exposed to the public internet.
      </p>

      <WhoisPrivacyChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is WHOIS Privacy Protection?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            When you register a domain name, ICANN (the Internet Corporation for Assigned Names and Numbers) 
            requires your contact information to be stored in a public database called WHOIS. This database 
            was originally designed to help identify domain owners for legitimate purposes, but it also means 
            anyone can look up the name, email address, phone number, and physical address associated with any domain.
          </p>
          <p style={{ marginTop: '16px' }}>
            WHOIS privacy protection — also called domain privacy, WHOIS guard, or ID protection — replaces 
            your personal contact details with generic information from a proxy service. Instead of showing 
            your real name and address, the WHOIS record displays the privacy service&apos;s contact details, 
            shielding your identity from spammers, scammers, data harvesters, and anyone else searching 
            the public WHOIS database.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How This Tool Works</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Our WHOIS privacy checker runs entirely in your browser using the public RDAP (Registration Data 
            Access Protocol) system, the modern replacement for traditional WHOIS. When you enter a domain, 
            the tool performs a multi-step analysis:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '20px' }}>
            {[
              { icon: '🔍', title: 'RDAP Query', desc: 'Fetches the domain\'s registration data from the authoritative RDAP server, retrieving all contact entities and status codes.' },
              { icon: '🛡️', title: 'Privacy Detection', desc: 'Scans for known privacy services like WhoisGuard, Domains By Proxy, and Contact Privacy. Also detects GDPR redaction markers.' },
              { icon: '📊', title: 'Exposure Analysis', desc: 'Checks each contact field (name, email, phone, address) to determine if it contains real personal data or is properly redacted.' },
              { icon: '💯', title: 'Privacy Score', desc: 'Calculates a 0-100 privacy score based on whether protection is active, what service is used, and how many sensitive fields remain exposed.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>{item.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why WHOIS Privacy Matters</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Leaving your WHOIS information unprotected exposes you to real risks. Here are the most common threats domain owners face when their registration data is public:</p>
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {[
              { threat: 'Spam & Phishing', desc: 'Spammers scrape WHOIS databases for email addresses and phone numbers. An exposed domain registration leads to unsolicited emails, robocalls, and targeted phishing attacks.', severity: 'High' },
              { threat: 'Identity Theft', desc: 'Your full name, address, and contact details in WHOIS records give identity thieves a starting point. Combined with other public data, this can lead to fraud and impersonation.', severity: 'High' },
              { threat: 'Domain Hijacking', desc: 'Attackers use exposed registrant details for social engineering attacks against your registrar. They may impersonate you to transfer your domain to their account.', severity: 'Critical' },
              { threat: 'Competitive Intelligence', desc: 'Competitors can identify your other domains, business structure, and portfolio by searching WHOIS records linked to your name or organization.', severity: 'Medium' },
              { threat: 'Harassment & Stalking', desc: 'Your physical address in WHOIS records makes you findable. For individuals and small businesses running websites from home, this creates personal safety risks.', severity: 'High' },
              { threat: 'Legal Targeting', desc: 'Exposed contact details make it easier for trademark trolls and litigious parties to target domain owners with legal threats, even for legitimate websites.', severity: 'Medium' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', background: '#111', borderRadius: '10px', padding: '16px', border: '1px solid #1e1e1e' }}>
                <div style={{ minWidth: '60px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                    background: item.severity === 'Critical' ? '#ef444420' : item.severity === 'High' ? '#f59e0b20' : '#8b5cf620',
                    color: item.severity === 'Critical' ? '#ef4444' : item.severity === 'High' ? '#f59e0b' : '#8b5cf6',
                    border: `1px solid ${item.severity === 'Critical' ? '#ef4444' : item.severity === 'High' ? '#f59e0b' : '#8b5cf6'}40`,
                  }}>{item.severity}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{item.threat}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>WHOIS Privacy vs GDPR Redaction</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Since the European Union&apos;s General Data Protection Regulation (GDPR) took effect in May 2018, 
            many registrars automatically redact personal information from WHOIS records for domains registered 
            by individuals. This means even without purchasing domain privacy as an add-on service, your personal 
            data may be hidden — but the level of redaction varies significantly between registrars and TLDs.
          </p>
          <p style={{ marginTop: '16px' }}>
            Our tool detects both paid privacy services (like WhoisGuard and Domains By Proxy) and GDPR-based 
            redaction. The privacy score accounts for the type and completeness of protection, giving you a 
            clear picture of your actual exposure level regardless of how the privacy was implemented.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'Is WHOIS privacy the same as domain privacy?', a: 'Yes. WHOIS privacy, domain privacy, ID protection, and WHOIS guard all refer to the same concept — hiding your personal contact information from public WHOIS/RDAP records by replacing it with a proxy service\'s details.' },
          { q: 'Does WHOIS privacy affect my domain ownership?', a: 'No. Privacy protection only changes the publicly visible contact information. Your registrar\'s internal records still show you as the owner, and your rights to the domain are unaffected. You can still transfer, renew, and manage your domain normally.' },
          { q: 'Is WHOIS privacy free?', a: 'Many modern registrars include free WHOIS privacy with every domain registration, including Cloudflare, Namecheap, and Google Domains. Some registrars like GoDaddy charge extra for it. Additionally, GDPR regulations have led to automatic redaction for many EU-based registrations.' },
          { q: 'Can someone still find the real owner of a domain with privacy?', a: 'With a court order or legitimate legal process, registrars and privacy services may be required to reveal the actual registrant. For everyday lookups and data scraping, however, your real information stays hidden.' },
          { q: 'Does this tool store my search data?', a: 'No. Everything runs in your browser. No queries or results are sent to or stored on our servers. The RDAP lookup goes directly from your browser to the public RDAP servers.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>More domain security tools</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Check SSL certificates, DNS records, domain expiration, and more — all free.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/ssl-checker" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            SSL Checker →
          </a>
          <a href="/domain-history" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            Domain History
          </a>
          <a href="/tools" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            All Tools
          </a>
        </div>
      </section>
    </StaticPage>
  );
}
