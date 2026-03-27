import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import MxRecordTool from './MxRecordTool';

export const metadata = {
  title: 'MX Record Checker — Look Up Mail Server Records for Any Domain | DomyDomains',
  description: 'Free MX record lookup tool. Check mail exchange records, detect email providers (Google Workspace, Microsoft 365, Zoho), and verify SPF/DMARC email security for any domain.',
  keywords: 'MX record checker, MX lookup, mail exchange records, email server lookup, check MX records, email provider detector, SPF checker, DMARC checker, domain email setup',
  alternates: { canonical: '/mx-record-checker' },
  openGraph: {
    title: 'MX Record Checker — Look Up Mail Server Records for Any Domain',
    description: 'Instantly check MX records, detect email providers, and verify email security (SPF & DMARC) for any domain.',
    url: 'https://domydomains.com/mx-record-checker',
  },
};

export default function MxRecordCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="MX Record Checker"
        description="Look up MX (mail exchange) records for any domain. Detect email providers and verify SPF/DMARC email security configuration."
        url="/mx-record-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        MX Record Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Look up MX (mail exchange) records for any domain. See which mail servers handle email delivery,
        identify the email provider, and check SPF and DMARC security settings — all instantly and free.
      </p>

      <MxRecordTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Are MX Records?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          MX (Mail Exchange) records are DNS records that specify which mail servers are responsible for
          receiving email on behalf of a domain. When someone sends an email to <em>you@example.com</em>,
          the sending mail server queries the MX records for <em>example.com</em> to find out where to
          deliver the message. Without properly configured MX records, your domain cannot receive email.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Each MX record has two components: a <strong style={{ color: '#8b5cf6' }}>priority value</strong> (lower
          numbers = higher priority) and a <strong style={{ color: '#8b5cf6' }}>mail server hostname</strong>.
          When multiple MX records exist, sending servers try the lowest-priority (highest preference)
          server first, falling back to higher-priority servers if the primary is unavailable. This
          redundancy ensures email delivery even during server outages.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How MX Priority Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { priority: '0–10', role: 'Primary Server', desc: 'The main mail server that handles all incoming email. Most traffic goes here.', color: '#22c55e' },
            { priority: '10–20', role: 'Secondary Server', desc: 'Backup server used when the primary is down or unreachable.', color: '#eab308' },
            { priority: '20–50', role: 'Backup Server', desc: 'Third-level backup, typically used for disaster recovery scenarios.', color: '#f97316' },
            { priority: '50+', role: 'Low Priority', desc: 'Last resort server. Rarely used under normal operating conditions.', color: '#ef4444' },
          ].map(item => (
            <div key={item.priority} style={{
              background: '#111', borderRadius: '10px', padding: '16px',
              border: '1px solid #1e1e1e', borderTop: `3px solid ${item.color}`,
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: item.color, marginBottom: '4px' }}>{item.priority}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{item.role}</div>
              <p style={{ fontSize: '0.8rem', color: '#999', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Check MX Records?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🔧', title: 'Troubleshoot Email Delivery', desc: 'Emails not arriving? Check if MX records are correctly configured and pointing to the right mail servers.' },
            { icon: '🔒', title: 'Verify Email Security', desc: 'Our tool also checks SPF and DMARC records to ensure your domain is protected against email spoofing and phishing.' },
            { icon: '🏢', title: 'Identify Email Providers', desc: 'Instantly detect whether a domain uses Google Workspace, Microsoft 365, Zoho, or other email providers.' },
            { icon: '🔄', title: 'Email Migration Planning', desc: 'Before switching email providers, document current MX records to plan a smooth migration with zero downtime.' },
            { icon: '🕵️', title: 'Competitive Research', desc: 'Discover what email infrastructure competitors and prospects use — useful for sales intelligence and marketing.' },
            { icon: '✅', title: 'Verify Domain Setup', desc: 'After purchasing a new domain, confirm that MX records are set up correctly before sending business emails.' },
          ].map(item => (
            <div key={item.title} style={{
              background: '#111', borderRadius: '12px', padding: '20px',
              border: '1px solid #1e1e1e',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common Email Providers & Their MX Records</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Provider</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Typical MX Record Pattern</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Priority</th>
              </tr>
            </thead>
            <tbody>
              {[
                { provider: 'Google Workspace', pattern: 'aspmx.l.google.com', priority: '1, 5, 10' },
                { provider: 'Microsoft 365', pattern: '*.mail.protection.outlook.com', priority: '0, 10' },
                { provider: 'Zoho Mail', pattern: 'mx.zoho.com', priority: '10, 20, 50' },
                { provider: 'Fastmail', pattern: 'in1-smtp.messagingengine.com', priority: '10, 20' },
                { provider: 'ProtonMail', pattern: 'mail.protonmail.ch', priority: '5, 10' },
                { provider: 'Yahoo/AOL', pattern: '*.yahoodns.net', priority: '1, 5' },
              ].map(row => (
                <tr key={row.provider} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '10px 12px', color: '#fff', fontWeight: 500 }}>{row.provider}</td>
                  <td style={{ padding: '10px 12px', color: '#8b5cf6', fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem' }}>{row.pattern}</td>
                  <td style={{ padding: '10px 12px', color: '#999' }}>{row.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              q: 'What happens if a domain has no MX records?',
              a: 'If a domain has no MX records, email sent to that domain will typically bounce. Some sending servers may fall back to the domain\'s A record as a last resort, but this behavior is not guaranteed and is unreliable.'
            },
            {
              q: 'Can I have multiple MX records for one domain?',
              a: 'Yes! In fact, it\'s best practice to have at least two MX records with different priorities. This provides redundancy — if the primary mail server goes down, email is routed to the backup server automatically.'
            },
            {
              q: 'What is the difference between MX and A records?',
              a: 'A records map a domain to an IP address (used for websites), while MX records specifically direct email traffic to designated mail servers. They serve different purposes and are configured independently.'
            },
            {
              q: 'How long does it take for MX record changes to propagate?',
              a: 'MX record changes typically propagate within 1–48 hours depending on the TTL (Time To Live) value set on the record. During this period, some emails may still route to the old server.'
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
