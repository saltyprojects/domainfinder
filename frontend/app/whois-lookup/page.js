import Link from 'next/link';
import ToolSchema from '../components/ToolSchema';

export const metadata = {
  title: 'WHOIS Lookup Guide 2026 — Check Domain Ownership & History | DomyDomains',
  description: 'Learn how to use WHOIS lookup to check domain ownership, registration dates, expiration, and history. Free WHOIS tools and privacy tips for domain buyers.',
  keywords: 'whois lookup, domain ownership, check domain owner, domain registration history, whois search, domain expiration, whois privacy, domain history',
  alternates: { canonical: '/whois-lookup' },
  openGraph: {
    title: 'WHOIS Lookup Guide 2026 — Check Domain Ownership & History',
    description: 'Everything you need to know about WHOIS lookups: check ownership, find expiring domains, and protect your privacy.',
    url: 'https://domydomains.com/whois-lookup',
  },
};

const WHOIS_TOOLS = [
  { name: 'ICANN Lookup', url: 'https://lookup.icann.org', desc: 'Official ICANN WHOIS tool. The most authoritative source for domain registration data.', free: true },
  { name: 'who.is', url: 'https://who.is', desc: 'Clean interface with DNS records, server info, and historical WHOIS data.', free: true },
  { name: 'Whois.com', url: 'https://www.whois.com/whois', desc: 'Simple lookup with registrar details, nameservers, and expiration dates.', free: true },
  { name: 'DomainTools', url: 'https://whois.domaintools.com', desc: 'Advanced WHOIS with historical records, reverse lookups, and monitoring. Pro features paid.', free: false },
  { name: 'ViewDNS.info', url: 'https://viewdns.info', desc: 'WHOIS plus reverse IP, DNS propagation, port scanner, and more.', free: true },
];

const WHOIS_FIELDS = [
  { field: 'Domain Name', desc: 'The registered domain (e.g., example.com)' },
  { field: 'Registrar', desc: 'The company where the domain was registered (e.g., Namecheap, GoDaddy)' },
  { field: 'Registration Date', desc: 'When the domain was first registered — older domains often have more SEO authority' },
  { field: 'Expiration Date', desc: 'When the registration expires — expired domains can be re-registered' },
  { field: 'Updated Date', desc: 'Last time the WHOIS record was modified' },
  { field: 'Name Servers', desc: 'DNS servers handling the domain — tells you where it\'s hosted' },
  { field: 'Registrant Contact', desc: 'Domain owner info (often hidden by privacy protection)' },
  { field: 'Status Codes', desc: 'Domain status flags like clientTransferProhibited, serverHold, redemptionPeriod' },
];

const USE_CASES = [
  { title: 'Check if a domain is truly available', emoji: '🔍', text: 'Before buying, verify ownership status. Some domains appear available but are in a redemption period or pending delete.' },
  { title: 'Find expiring domains', emoji: '⏰', text: 'Monitor WHOIS expiration dates to catch valuable domains when they drop. Expired domains with backlinks and traffic are gold.' },
  { title: 'Research before buying premium domains', emoji: '💎', text: 'Check registration history, age, and previous ownership. Older domains with clean history are more valuable for SEO.' },
  { title: 'Verify domain seller legitimacy', emoji: '🛡️', text: 'Before buying from a marketplace, verify the seller actually owns the domain via WHOIS records.' },
  { title: 'Investigate spam or phishing sites', emoji: '⚠️', text: 'WHOIS data can help identify who\'s behind suspicious domains targeting your brand.' },
  { title: 'Check competitor domains', emoji: '📊', text: 'See when competitors registered their domains, what registrar they use, and when domains expire.' },
];

const PRIVACY_TIPS = [
  { tip: 'Enable WHOIS privacy protection', detail: 'Most registrars offer free WHOIS privacy that replaces your personal info with proxy data. Always enable it.' },
  { tip: 'Use a registrar with free privacy', detail: 'Namecheap, Cloudflare, Porkbun, and Google Domains all include WHOIS privacy at no extra cost.' },
  { tip: 'Use a business address', detail: 'If you can\'t use privacy protection (some TLDs don\'t allow it), use a business address instead of your home address.' },
  { tip: 'Know the GDPR impact', detail: 'Since GDPR (2018), most European registrars redact personal data from WHOIS by default. Many global registrars followed suit.' },
];

export default function WhoisLookupPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <ToolSchema name="WHOIS Lookup Guide" description="Learn how to use WHOIS lookup to check domain ownership, registration dates, expiration, and history." url="/whois-lookup" />
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 12, color: '#fff' }}>
          🔎 WHOIS Lookup Guide
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: '#aaa', maxWidth: 620, margin: '0 auto' }}>
          Find out who owns any domain, when it was registered, and when it expires. Essential knowledge for domain buyers.
        </p>
        <Link href="/" style={{ display: 'inline-block', marginTop: 20, padding: '12px 28px', background: '#7c3aed', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          Search Available Domains →
        </Link>
      </div>

      {/* What is WHOIS */}
      <div style={{ marginBottom: 40, background: '#f8f7ff', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12, color: '#fff' }}>What is WHOIS?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: 12 }}>
          WHOIS (pronounced &quot;who is&quot;) is a public database that stores registration information for every domain name on the internet. When someone registers a domain, their contact details, registration dates, and nameserver information are recorded in the WHOIS database.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7 }}>
          Think of it like a phone book for the internet — it tells you who owns a domain, where it was registered, and when it expires. WHOIS data is maintained by domain registrars and accessible through lookup tools.
        </p>
      </div>

      {/* WHOIS Fields */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#fff' }}>📋 What WHOIS Records Contain</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {WHOIS_FIELDS.map((f) => (
            <div key={f.field} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: '#fafafa', borderRadius: 8, alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700, color: '#7c3aed', minWidth: 160, fontSize: '0.9rem' }}>{f.field}</span>
              <span style={{ color: '#bbb', fontSize: '0.88rem' }}>{f.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#fff' }}>🎯 Why Use WHOIS Lookup?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
          {USE_CASES.map((uc) => (
            <div key={uc.title} style={{ background: '#f0fdf4', borderRadius: 10, padding: 16, border: '1px solid #bbf7d0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6, color: '#166534' }}>{uc.emoji} {uc.title}</h3>
              <p style={{ fontSize: '0.84rem', color: '#15803d', lineHeight: 1.6, margin: 0 }}>{uc.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Free Tools */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#fff' }}>🛠️ Best WHOIS Lookup Tools</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {WHOIS_TOOLS.map((t) => (
            <div key={t.name} style={{ background: '#1a1a2e', borderRadius: 10, padding: 16, border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4, color: '#fff' }}>
                  {t.name} {t.free ? <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 4, marginLeft: 6 }}>FREE</span> : <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 4, marginLeft: 6 }}>FREEMIUM</span>}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#aaa', margin: 0 }}>{t.desc}</p>
              </div>
              <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>Visit →</a>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div style={{ marginBottom: 40, background: '#fef3c7', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16, color: '#92400e' }}>🔒 WHOIS Privacy Protection</h2>
        <p style={{ color: '#78350f', lineHeight: 1.7, marginBottom: 16 }}>
          When you register a domain, your name, email, phone, and address become part of the public WHOIS record — unless you enable privacy protection. Here&apos;s how to stay safe:
        </p>
        <div style={{ display: 'grid', gap: 12 }}>
          {PRIVACY_TIPS.map((p) => (
            <div key={p.tip} style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 8, padding: 14 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4, color: '#92400e' }}>{p.tip}</h3>
              <p style={{ fontSize: '0.84rem', color: '#78350f', margin: 0, lineHeight: 1.5 }}>{p.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Status Codes */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12, color: '#fff' }}>🏷️ Common Domain Status Codes</h2>
        <p style={{ color: '#aaa', marginBottom: 16, lineHeight: 1.6 }}>WHOIS records include EPP status codes that tell you exactly what state a domain is in:</p>
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            { code: 'clientTransferProhibited', meaning: 'Transfer locked by registrar — standard protection against unauthorized transfers' },
            { code: 'serverTransferProhibited', meaning: 'Transfer locked by registry — usually during disputes or legal holds' },
            { code: 'redemptionPeriod', meaning: 'Domain expired and is in a 30-day grace period before deletion — can be recovered for a fee' },
            { code: 'pendingDelete', meaning: 'Domain will be deleted and available for registration in 5 days' },
            { code: 'active / ok', meaning: 'Domain is registered and functioning normally — no restrictions' },
            { code: 'clientHold', meaning: 'Domain suspended by registrar — won\'t resolve in DNS (often due to non-payment)' },
          ].map((s) => (
            <div key={s.code} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: '#f9fafb', borderRadius: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <code style={{ fontWeight: 700, color: '#7c3aed', fontSize: '0.85rem', minWidth: 220 }}>{s.code}</code>
              <span style={{ color: '#bbb', fontSize: '0.85rem', flex: 1, minWidth: 200 }}>{s.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '32px 20px', background: '#f8f7ff', borderRadius: 12 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, color: '#fff' }}>Ready to find your domain?</h2>
        <p style={{ color: '#aaa', marginBottom: 16 }}>Search 400+ extensions and check availability instantly.</p>
        <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: '#7c3aed', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem' }}>
          Search Domains Free →
        </Link>
      </div>

      {/* Internal Links */}
      <div style={{ marginTop: 40, padding: '20px 0', borderTop: '1px solid #eee', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        <Link href="/domain-extensions" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>📚 Extensions Guide</Link>
        <Link href="/domain-pricing" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>💵 Pricing Guide</Link>
        <Link href="/domain-generator" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>⚡ Name Generator</Link>
        <Link href="/premium-domains" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>💎 Premium Domains</Link>
        <Link href="/about" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>ℹ️ About Us</Link>
      </div>
    </div>
  );
}
