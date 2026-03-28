import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DmarcGeneratorTool from './DmarcGeneratorTool';

export const metadata = {
  title: 'Free DMARC Record Generator — Create DMARC Policies for Email Security | DomyDomains',
  description: 'Generate DMARC (Domain-based Message Authentication, Reporting & Conformance) records for your domain. Configure policies, alignment, and reporting to prevent email spoofing and phishing attacks.',
  keywords: 'DMARC record generator, DMARC policy generator, create DMARC record, DMARC TXT record, email authentication, domain email security, prevent email spoofing, DMARC p=reject, DMARC reports, email phishing protection',
  alternates: { canonical: '/dmarc-generator' },
  openGraph: {
    title: 'Free DMARC Record Generator — Create DMARC Policies for Email Security',
    description: 'Build a valid DMARC record for your domain. Set enforcement policy, configure SPF/DKIM alignment, enable aggregate and forensic reports, and copy the ready-to-use TXT record.',
    url: 'https://domydomains.com/dmarc-generator',
  },
};

export default function DmarcGeneratorPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="DMARC Record Generator"
        description="Generate DMARC (Domain-based Message Authentication, Reporting & Conformance) TXT records for email security. Configure policies, alignment, reporting, and gradual rollout — free and instant."
        url="/dmarc-generator"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        DMARC Record Generator
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Create a valid DMARC record for your domain in seconds. Choose your enforcement policy,
        set up aggregate and forensic reporting, configure SPF and DKIM alignment, and copy the
        ready-to-use TXT record for your DNS — completely free.
      </p>

      <DmarcGeneratorTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is DMARC?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          DMARC (Domain-based Message Authentication, Reporting &amp; Conformance) is an email authentication
          protocol defined in <strong style={{ color: '#8b5cf6' }}>RFC 7489</strong>. It builds on top of
          SPF and DKIM to give domain owners control over what happens when an email fails authentication
          checks. Without DMARC, even if you have SPF and DKIM configured, receiving mail servers have no
          clear instruction on whether to deliver, quarantine, or reject unauthenticated messages.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          DMARC solves this by letting you publish a policy in DNS that tells receiving servers exactly how
          to handle emails that fail SPF and/or DKIM alignment. It also provides a reporting mechanism so
          you can monitor who is sending email on behalf of your domain — both legitimate services and
          potential attackers trying to spoof your identity.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Major email providers including <strong style={{ color: '#fff' }}>Google</strong>,{' '}
          <strong style={{ color: '#fff' }}>Microsoft</strong>, <strong style={{ color: '#fff' }}>Yahoo</strong>,
          and <strong style={{ color: '#fff' }}>Apple</strong> all enforce DMARC policies. In 2024, Google
          and Yahoo began requiring DMARC records for bulk senders, making it essential for any organization
          that sends email at scale.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How DMARC Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { step: '1', title: 'Email Arrives', desc: 'A receiving server gets an email claiming to be from your domain and checks SPF and DKIM.', color: '#8b5cf6' },
            { step: '2', title: 'Alignment Check', desc: 'DMARC verifies that the domain in the visible "From" header aligns with SPF and/or DKIM authenticated domains.', color: '#3b82f6' },
            { step: '3', title: 'Policy Applied', desc: 'If alignment fails, the receiving server checks your DMARC policy (none/quarantine/reject) and acts accordingly.', color: '#22c55e' },
            { step: '4', title: 'Report Sent', desc: 'The receiving server sends aggregate XML reports to your specified rua address so you can monitor authentication results.', color: '#eab308' },
          ].map(item => (
            <div key={item.step} style={{
              background: '#111', borderRadius: '10px', padding: '16px',
              border: '1px solid #1e1e1e', borderTop: `3px solid ${item.color}`,
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: item.color, marginBottom: '4px' }}>Step {item.step}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{item.title}</div>
              <p style={{ fontSize: '0.8rem', color: '#999', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>DMARC Record Tags Explained</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Tag</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Example</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Required</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tag: 'v', example: 'v=DMARC1', req: 'Yes', meaning: 'Version tag — must be DMARC1 and appear first in the record' },
                { tag: 'p', example: 'p=reject', req: 'Yes', meaning: 'Policy for the domain: none (monitor), quarantine (spam), or reject (block)' },
                { tag: 'sp', example: 'sp=quarantine', req: 'No', meaning: 'Policy for subdomains — defaults to the main domain policy if omitted' },
                { tag: 'pct', example: 'pct=50', req: 'No', meaning: 'Percentage of emails the policy applies to (1-100, default 100)' },
                { tag: 'rua', example: 'rua=mailto:reports@example.com', req: 'No*', meaning: 'Aggregate report destination — strongly recommended for visibility' },
                { tag: 'ruf', example: 'ruf=mailto:forensic@example.com', req: 'No', meaning: 'Forensic (failure) report destination — detailed per-message reports' },
                { tag: 'adkim', example: 'adkim=s', req: 'No', meaning: 'DKIM alignment mode: r (relaxed, default) or s (strict)' },
                { tag: 'aspf', example: 'aspf=s', req: 'No', meaning: 'SPF alignment mode: r (relaxed, default) or s (strict)' },
                { tag: 'fo', example: 'fo=1', req: 'No', meaning: 'Failure reporting options: 0 (all fail), 1 (any fail), d (DKIM), s (SPF)' },
                { tag: 'ri', example: 'ri=3600', req: 'No', meaning: 'Aggregate report interval in seconds (default 86400 = 24 hours)' },
              ].map(row => (
                <tr key={row.tag} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '10px 12px', color: '#8b5cf6', fontFamily: 'ui-monospace, monospace', fontWeight: 500 }}>{row.tag}</td>
                  <td style={{ padding: '10px 12px', color: '#ccc', fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem' }}>{row.example}</td>
                  <td style={{ padding: '10px 12px', color: row.req === 'Yes' ? '#22c55e' : '#666' }}>{row.req}</td>
                  <td style={{ padding: '10px 12px', color: '#999' }}>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>SPF, DKIM, and DMARC: The Email Authentication Triad</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Email authentication relies on three complementary protocols working together. <strong style={{ color: '#8b5cf6' }}>SPF</strong> verifies
          that the sending server&apos;s IP address is authorized by the domain owner. <strong style={{ color: '#8b5cf6' }}>DKIM</strong> adds
          a cryptographic signature to outgoing emails, allowing recipients to verify the message hasn&apos;t been
          tampered with. <strong style={{ color: '#8b5cf6' }}>DMARC</strong> ties them together by checking that the
          visible &quot;From&quot; domain aligns with what SPF and DKIM authenticated, and defines what to do when
          alignment fails.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Think of it this way: SPF checks the envelope return address, DKIM checks the letter&apos;s seal, and DMARC
          checks that both match the name on the letterhead. All three are needed for comprehensive email
          security. Our <a href="/spf-generator" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>SPF Record Generator</a> can
          help you set up SPF, and this tool handles the DMARC side.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              q: 'Should I start with p=none or p=reject?',
              a: 'Always start with p=none (monitor mode) and set up aggregate reporting (rua). This lets you see who is sending email from your domain without affecting delivery. After 2–4 weeks of monitoring, gradually move to quarantine and then reject. Jumping straight to p=reject can block legitimate email from services you forgot to authorize with SPF/DKIM.'
            },
            {
              q: 'What are DMARC aggregate reports (rua)?',
              a: 'Aggregate reports are daily XML files sent to your rua address by receiving mail servers. They show which IPs sent email from your domain, whether SPF and DKIM passed or failed, and what percentage of emails passed DMARC alignment. Free tools like Google Postmaster Tools, Postmark DMARC, and DMARC Analyzer can parse these reports into human-readable dashboards.'
            },
            {
              q: 'What\'s the difference between relaxed and strict alignment?',
              a: 'Relaxed alignment (default) allows organizational domain matching — an email signed by mail.example.com passes DMARC for example.com. Strict alignment requires exact domain matching — mail.example.com would NOT pass for example.com. Most organizations should use relaxed alignment unless they have specific security requirements.'
            },
            {
              q: 'Can I have DMARC without SPF or DKIM?',
              a: 'DMARC requires at least one of SPF or DKIM to be set up and aligned. However, for best results, you should have both. DMARC passes if either SPF or DKIM alignment succeeds — so having both provides redundancy. If SPF fails (e.g., forwarded email), DKIM can still pass and vice versa.'
            },
            {
              q: 'Why are Google and Yahoo requiring DMARC?',
              a: 'Starting February 2024, Google and Yahoo require bulk senders (5,000+ emails/day) to have a DMARC record with at least p=none. This is part of their push to reduce spam and phishing. Even if you\'re not a bulk sender, having DMARC improves your email deliverability and protects your domain reputation.'
            },
            {
              q: 'Where do I add the DMARC record in DNS?',
              a: 'DMARC records are published as TXT records at _dmarc.yourdomain.com. For example, if your domain is example.com, you add a TXT record with the host/name "_dmarc" and the generated DMARC record as the value. Note: this is different from SPF, which goes on the root domain (@).'
            },
          ].map(faq => (
            <div key={faq.q} style={{
              background: '#111', borderRadius: '10px', padding: '16px 20px',
              border: '1px solid #1e1e1e',
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{faq.q}</h3>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
