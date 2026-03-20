import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainHistory from './DomainHistory';

export const metadata = {
  title: 'Domain History Lookup — Registration Timeline, Status & Infrastructure | DomyDomains',
  description: 'Look up any domain\'s complete history including registration date, expiration, modification timeline, status codes, registrar info, and current DNS infrastructure. Free domain history checker.',
  keywords: 'domain history lookup, domain history checker, domain registration date, domain timeline, domain age, domain status codes, whois history, domain registrar, domain ownership history, domain expiration',
  alternates: { canonical: '/domain-history' },
  openGraph: {
    title: 'Domain History Lookup — Registration Timeline, Status & Infrastructure',
    description: 'Look up any domain\'s complete history: registration date, modifications, status codes, registrar, nameservers, and more. Free browser-based tool.',
    url: 'https://domydomains.com/domain-history',
  },
};

export default function DomainHistoryPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain History Lookup"
        description="Look up any domain's complete history including registration date, expiration, modification timeline, status codes, registrar info, and current DNS infrastructure."
        url="/domain-history"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain History Lookup
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Explore any domain's complete lifecycle — from its original registration date to its current infrastructure.
        View the full timeline, status codes, registrar info, nameservers, and DNS records.
      </p>

      <DomainHistory />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is Domain History?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Domain history refers to the complete record of events and changes associated with a domain name
            since it was first registered. This includes the original registration date, subsequent renewals
            and modifications, transfers between registrars, changes in nameservers, and updates to contact
            information. Understanding a domain's history is essential for domain investors, security researchers,
            SEO professionals, and anyone evaluating the trustworthiness of a website.
          </p>
          <p style={{ marginTop: '12px' }}>
            Our free domain history lookup tool queries RDAP (Registration Data Access Protocol) — the modern
            replacement for WHOIS — to retrieve structured, machine-readable data directly from domain registries.
            Combined with live DNS queries, it provides a comprehensive snapshot of any domain's past and present state.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Domain History Matters</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            {
              icon: '💰',
              title: 'Domain Investing',
              desc: 'Older domains with clean histories command higher prices. A domain registered in 1998 with continuous ownership signals stability and brand authority. Investors use history to gauge resale value and spot expired premium names.',
            },
            {
              icon: '🔍',
              title: 'SEO & Due Diligence',
              desc: 'Search engines consider domain age as one of many trust signals. Before buying an existing domain, check its history for past penalties, spam usage, or ownership gaps that could affect rankings.',
            },
            {
              icon: '🛡️',
              title: 'Security Research',
              desc: 'Domain status codes reveal security posture — transfer locks, client holds, and redemption periods all tell a story. Recently registered domains with frequent changes may indicate malicious intent.',
            },
            {
              icon: '📋',
              title: 'Trademark & Legal',
              desc: 'Registration dates establish prior use in trademark disputes. Domain history can prove when a brand name was first claimed online, which matters in UDRP proceedings and cybersquatting cases.',
            },
          ].map(item => (
            <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding Domain Status Codes</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Every registered domain has one or more EPP (Extensible Provisioning Protocol) status codes that
            describe its current state. These codes are set by either the domain registrar ("client" codes)
            or the registry ("server" codes) and control what actions can be performed on the domain.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginTop: '16px' }}>
          {[
            { code: 'ok / active', meaning: 'Domain is in normal status with no pending operations or restrictions.' },
            { code: 'clientTransferProhibited', meaning: 'Domain cannot be transferred to another registrar. This is a common security measure.' },
            { code: 'serverDeleteProhibited', meaning: 'Registry-level lock preventing accidental or unauthorized deletion.' },
            { code: 'pendingDelete', meaning: 'Domain is scheduled for deletion and will become available for registration again.' },
            { code: 'redemptionPeriod', meaning: 'Domain has expired and entered a recovery window. The original owner can still reclaim it.' },
            { code: 'clientHold', meaning: 'Domain is suspended by the registrar, often due to non-payment or policy violations.' },
          ].map(item => (
            <div key={item.code} style={{ background: '#111', borderRadius: '10px', padding: '14px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#8b5cf6', marginBottom: '6px', fontWeight: 600 }}>{item.code}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5 }}>{item.meaning}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>RDAP vs WHOIS: The Modern Approach</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            This tool uses RDAP (Registration Data Access Protocol), the official replacement for the legacy
            WHOIS protocol. RDAP provides structured JSON responses, supports HTTPS for secure queries, offers
            standardized error handling, and includes internationalization support. Unlike WHOIS, RDAP responses
            are consistent across registries, making automated parsing reliable.
          </p>
          <p style={{ marginTop: '12px' }}>
            ICANN has mandated that all gTLD registries and registrars support RDAP. While WHOIS still works
            for many domains, RDAP is the authoritative source for registration data going forward. Our tool
            queries RDAP endpoints directly in your browser — no server-side processing, no data stored, completely private.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          {
            q: 'What information does the domain history lookup show?',
            a: 'Our tool displays the complete domain lifecycle: original registration date, last modification date, expiration date, registrar name, EPP status codes, nameservers, A records (IP addresses), and MX records (mail servers). All data is presented in a visual timeline format.',
          },
          {
            q: 'How far back does domain history go?',
            a: 'RDAP provides data from the current registration period. For domains that have been continuously registered, this typically includes the original registration date. However, if a domain was deleted and re-registered, RDAP shows only the most recent registration period.',
          },
          {
            q: 'Can I see who owns a domain?',
            a: 'Due to GDPR and privacy regulations, most domain registrations now use privacy protection. RDAP respects these privacy settings, so personal registrant data is usually redacted. You can still see the registrar, registration dates, and technical infrastructure.',
          },
          {
            q: 'Is domain age important for SEO?',
            a: 'Domain age is one of many factors search engines consider. An older domain is not automatically ranked higher, but established domains with consistent history tend to have more backlinks and trust. A brand new domain with great content can still rank well.',
          },
          {
            q: 'What does it mean if a domain is in redemption period?',
            a: 'A domain in redemption period has expired and passed through the grace period. The original registrant can still recover it by paying a redemption fee (usually $80-200+). After the redemption period ends (typically 30 days), the domain enters pending delete and becomes available for anyone to register.',
          },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Explore More Domain Tools</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
          Combine domain history with our other free tools for complete domain intelligence.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/domain-age-checker" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Domain Age Checker →
          </a>
          <a href="/whois-lookup" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            WHOIS Lookup
          </a>
          <a href="/dns-lookup" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            DNS Lookup
          </a>
        </div>
      </section>
    </StaticPage>
  );
}
