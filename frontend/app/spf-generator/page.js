import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import SpfGeneratorTool from './SpfGeneratorTool';

export const metadata = {
  title: 'Free SPF Record Generator — Create SPF TXT Records for Email Authentication | DomyDomains',
  description: 'Generate SPF (Sender Policy Framework) records for your domain in seconds. Select your email provider (Google Workspace, Microsoft 365, Zoho) and sending services (SendGrid, Mailchimp) to create a valid SPF TXT record.',
  keywords: 'SPF record generator, SPF record creator, create SPF record, SPF TXT record, email authentication, sender policy framework, SPF for Google Workspace, SPF for Microsoft 365, prevent email spoofing, email security',
  alternates: { canonical: '/spf-generator' },
  openGraph: {
    title: 'Free SPF Record Generator — Create SPF TXT Records for Email Authentication',
    description: 'Build a valid SPF record for your domain. Select email providers and sending services, set enforcement policy, and copy the ready-to-use TXT record.',
    url: 'https://domydomains.com/spf-generator',
  },
};

export default function SpfGeneratorPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="SPF Record Generator"
        description="Generate SPF (Sender Policy Framework) TXT records for email authentication. Select email providers and sending services, configure enforcement policy, and get a ready-to-use DNS record."
        url="/spf-generator"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        SPF Record Generator
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Create a valid SPF (Sender Policy Framework) record for your domain. Select your email provider and
        any third-party sending services, choose an enforcement policy, and copy the ready-to-use TXT record
        to add to your DNS — all free and instant.
      </p>

      <SpfGeneratorTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is an SPF Record?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          SPF (Sender Policy Framework) is an email authentication standard defined in{' '}
          <strong style={{ color: '#8b5cf6' }}>RFC 7208</strong>. It allows domain owners to specify which
          mail servers and IP addresses are authorized to send email on behalf of their domain. SPF records
          are published as TXT records in DNS, and receiving mail servers check them to verify that incoming
          messages actually come from an authorized source.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Without an SPF record, anyone can forge the "From" address on an email to appear as if it came
          from your domain. This is called <strong style={{ color: '#fff' }}>email spoofing</strong> and
          is one of the most common tactics used in phishing attacks. SPF is the first line of defense
          in the email authentication triad of <strong style={{ color: '#8b5cf6' }}>SPF</strong>,{' '}
          <strong style={{ color: '#8b5cf6' }}>DKIM</strong>, and{' '}
          <strong style={{ color: '#8b5cf6' }}>DMARC</strong>.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How SPF Records Work</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { step: '1', title: 'Email Sent', desc: 'Your mail server or sending service (e.g., SendGrid) sends an email from your domain.', color: '#8b5cf6' },
            { step: '2', title: 'DNS Lookup', desc: 'The receiving server queries DNS for a TXT record at your domain containing "v=spf1".', color: '#3b82f6' },
            { step: '3', title: 'IP Check', desc: 'The receiving server checks if the sending IP matches any authorized source listed in the SPF record.', color: '#22c55e' },
            { step: '4', title: 'Pass or Fail', desc: 'If the IP matches, SPF passes. If not, the enforcement policy (~all, -all) determines what happens.', color: '#eab308' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>SPF Record Syntax Explained</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Mechanism</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Example</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                { mech: 'v=spf1', example: 'v=spf1', meaning: 'Required version tag — must be the first term in every SPF record' },
                { mech: 'include:', example: 'include:_spf.google.com', meaning: 'Authorize all IPs in another domain\'s SPF record (counts as 1 DNS lookup)' },
                { mech: 'ip4:', example: 'ip4:203.0.113.0/24', meaning: 'Authorize a specific IPv4 address or CIDR range (no DNS lookup cost)' },
                { mech: 'ip6:', example: 'ip6:2001:db8::/32', meaning: 'Authorize a specific IPv6 address or CIDR range (no DNS lookup cost)' },
                { mech: 'a', example: 'a', meaning: 'Authorize the IP(s) that the domain\'s A record resolves to' },
                { mech: 'mx', example: 'mx', meaning: 'Authorize the IP(s) of the domain\'s MX mail servers' },
                { mech: '~all', example: '~all', meaning: 'Soft fail — mark unauthorized email as suspicious but still deliver' },
                { mech: '-all', example: '-all', meaning: 'Hard fail — reject unauthorized email entirely' },
              ].map(row => (
                <tr key={row.mech} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '10px 12px', color: '#8b5cf6', fontFamily: 'ui-monospace, monospace', fontWeight: 500 }}>{row.mech}</td>
                  <td style={{ padding: '10px 12px', color: '#ccc', fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem' }}>{row.example}</td>
                  <td style={{ padding: '10px 12px', color: '#999' }}>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>The 10 DNS Lookup Limit</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          One of the most common SPF mistakes is exceeding the <strong style={{ color: '#ef4444' }}>10 DNS lookup limit</strong>.
          According to RFC 7208, receiving servers must abort SPF evaluation after 10 DNS-querying mechanisms
          (include, a, mx, ptr, exists, redirect). If your record exceeds this limit, SPF returns a "permerror"
          result and your emails may be rejected or marked as spam.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Each <code style={{ color: '#8b5cf6' }}>include:</code> mechanism counts as one lookup, and the included
          record may itself contain more includes — all of which count toward your total. Our generator tracks
          your top-level lookup count in real time so you stay within the limit. If you need to authorize many
          services, consider using <code style={{ color: '#8b5cf6' }}>ip4:</code> and{' '}
          <code style={{ color: '#8b5cf6' }}>ip6:</code> mechanisms instead, which do not consume DNS lookups.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              q: 'Should I use ~all (soft fail) or -all (hard fail)?',
              a: 'Start with ~all (soft fail) while testing. Once you\'ve confirmed all legitimate sending sources are included, switch to -all (hard fail) for maximum protection. Most organizations use ~all because hard fail can cause delivery issues if any authorized source is accidentally omitted.'
            },
            {
              q: 'Can I have multiple SPF records on one domain?',
              a: 'No! A domain must have exactly one SPF TXT record. Having multiple SPF records causes a "permerror" and breaks email authentication entirely. If you need to authorize multiple services, combine them all into a single record using multiple include: mechanisms.'
            },
            {
              q: 'Is SPF enough to prevent email spoofing?',
              a: 'SPF alone is not enough. SPF only checks the envelope sender (MAIL FROM), not the visible "From" header that recipients see. For complete protection, you need all three: SPF, DKIM (cryptographic signing), and DMARC (policy enforcement). Together they form a robust email authentication framework.'
            },
            {
              q: 'How long does it take for SPF changes to take effect?',
              a: 'SPF record changes propagate based on the TTL (Time To Live) of your DNS records, typically 1–48 hours. During propagation, some receiving servers may still see the old record. Set a lower TTL before making changes to speed up propagation.'
            },
            {
              q: 'What happens if I exceed the 10 DNS lookup limit?',
              a: 'If your SPF record requires more than 10 DNS lookups (counting nested includes), receiving servers will return a "permerror" result. This means SPF evaluation fails, and depending on the receiver\'s DMARC policy, your emails may be rejected or sent to spam. Use ip4/ip6 mechanisms (which don\'t count as lookups) or SPF flattening services to stay under the limit.'
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
