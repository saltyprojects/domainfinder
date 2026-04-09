import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import TxtRecordLookupTool from './TxtRecordLookupTool';

export const metadata = {
  title: 'TXT Record Lookup — Check All Domain TXT Records (SPF, DKIM, DMARC, Verification) | DomyDomains',
  description: 'Free TXT record lookup tool. Check all TXT records for any domain, including SPF, DKIM, DMARC, BIMI, MTA-STS, and third-party verification tokens (Google, Microsoft, Facebook, Apple, Stripe, and more). Instant DNS query via Google DNS.',
  keywords: 'txt record lookup, dns txt record, txt record checker, spf lookup, dkim lookup, dmarc lookup, bimi record, mta-sts lookup, domain verification token, google site verification, microsoft 365 verification, check txt records, dns txt query, txt record finder, email authentication records',
  alternates: { canonical: '/txt-record-lookup' },
  openGraph: {
    title: 'TXT Record Lookup — Check All Domain TXT Records Instantly',
    description: 'Lookup and categorize every TXT record on any domain: SPF, DKIM, DMARC, BIMI, verification tokens, and more. Free and instant.',
    url: 'https://domydomains.com/txt-record-lookup',
  },
};

export default function TxtRecordLookupPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="TXT Record Lookup Tool"
        description="Free TXT record lookup and analyzer. Query every TXT record on any domain and automatically categorize them: SPF, DKIM, DMARC, BIMI, MTA-STS, TLS-RPT, and third-party verification tokens from Google, Microsoft, Apple, Facebook, Stripe, and more."
        url="/txt-record-lookup"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        TXT Record Lookup
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '720px' }}>
        Check every TXT record on any domain in one click. Our tool automatically parses and categorizes SPF, DKIM,
        DMARC, BIMI, MTA-STS records, plus verification tokens from services like Google, Microsoft 365, Facebook,
        Apple, Stripe, Atlassian, and dozens more.
      </p>

      <TxtRecordLookupTool />

      <section style={{ marginBottom: '48px', marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Are DNS TXT Records?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A TXT (text) record is a type of DNS record that lets domain administrators attach arbitrary text data
          to a domain name. Originally designed to store human-readable notes about a domain, TXT records have
          evolved into one of the most important and heavily used record types in modern DNS. Today, they power
          the bulk of email authentication, service ownership verification, and a growing list of security
          standards that keep domains and their users safe.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Our TXT record lookup tool queries Google&apos;s public DNS-over-HTTPS resolver and then parses every
          returned record, color-coding each by category so you can see at a glance which standards a domain
          implements — and which are missing. No login, no rate limits, no cost.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What TXT Records Reveal About a Domain</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Running a TXT record lookup is one of the fastest ways to audit a domain&apos;s email posture and its
          SaaS footprint. The records you&apos;ll typically find include:
        </p>
        <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>SPF (v=spf1)</strong> — The Sender Policy Framework record lists which mail servers are allowed
          to send email on behalf of the domain. A missing or misconfigured SPF record dramatically increases the risk
          of spoofed email and delivery failures.</li>
          <li><strong>DMARC (v=DMARC1)</strong> — Published at <code>_dmarc.yourdomain.com</code>, DMARC tells receiving
          mail servers what to do with messages that fail SPF or DKIM checks, and where to send aggregate reports.</li>
          <li><strong>DKIM (v=DKIM1)</strong> — Published under a selector like <code>selector1._domainkey</code>,
          DKIM records contain the public key receivers use to cryptographically verify that an email was actually
          signed by the sending domain.</li>
          <li><strong>BIMI, MTA-STS, TLS-RPT</strong> — Newer email security standards that govern logo display,
          required TLS for SMTP, and TLS failure reporting. Their presence is a strong signal of a mature email program.</li>
          <li><strong>Verification tokens</strong> — Short tokens like <code>google-site-verification=...</code> or
          <code>facebook-domain-verification=...</code> prove to third-party services that the owner of the domain
          also controls the account on the other side. They effectively reveal which SaaS platforms a domain is
          actively integrated with.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Use This TXT Record Checker</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Enter any domain — with or without <code>https://</code> or <code>www.</code> — and click Lookup. The
          tool will query the root domain for TXT records, then automatically check common subdomains like
          <code> _dmarc</code>, <code>_mta-sts</code>, and <code>_smtp._tls</code> where email-related records
          live. Each record is displayed with a category badge, a plain-English description, and, where relevant,
          a parsed breakdown (for example, SPF mechanisms are listed separately so you can see exactly which IPs
          and include-domains are authorized).
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Because the lookup runs directly in your browser against Google&apos;s public resolver, results are
          live and uncached on our side. This makes the tool ideal for troubleshooting: if you&apos;ve just updated
          a DNS record, a fresh lookup will show it as soon as the authoritative name servers propagate.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common TXT Record Troubleshooting</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A few patterns account for most TXT record problems. Watch for: <strong>multiple SPF records</strong>
          on a single host (SPF requires exactly one — multiple records will cause a permerror), <strong>overly
          long SPF chains</strong> that exceed the 10-lookup limit, <strong>unquoted or malformed DMARC policies</strong>,
          and <strong>stale verification tokens</strong> from services you no longer use. Cleaning up old tokens
          improves security posture by reducing the attack surface for unused integrations.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          When in doubt, use this tool alongside our <a href="/spf-generator" style={{ color: '#8b5cf6' }}>SPF generator</a>,
          <a href="/dmarc-generator" style={{ color: '#8b5cf6' }}> DMARC generator</a>, and
          <a href="/dkim-generator" style={{ color: '#8b5cf6' }}> DKIM generator</a> to fix any gaps you discover.
        </p>
      </section>
    </StaticPage>
  );
}
