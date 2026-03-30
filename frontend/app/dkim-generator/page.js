import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DkimGeneratorTool from './DkimGeneratorTool';

export const metadata = {
  title: 'Free DKIM Record Generator & Checker — Create DKIM DNS Records | DomyDomains',
  description: 'Generate and validate DKIM (DomainKeys Identified Mail) records for your domain. Look up existing DKIM records by selector, build new TXT records with your public key, and get step-by-step setup instructions for Google Workspace, Microsoft 365, and more.',
  keywords: 'DKIM record generator, DKIM checker, DKIM lookup, create DKIM record, DKIM TXT record, DKIM selector, email authentication, DomainKeys Identified Mail, DKIM setup, DKIM key generator, email security, domain email signing',
  alternates: { canonical: '/dkim-generator' },
  openGraph: {
    title: 'Free DKIM Record Generator & Checker — Create DKIM DNS Records',
    description: 'Generate DKIM TXT records for email authentication. Look up existing DKIM records, build new ones with your RSA public key, and get setup guides for popular email providers.',
    url: 'https://domydomains.com/dkim-generator',
  },
};

export default function DkimGeneratorPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="DKIM Record Generator"
        description="Generate and validate DKIM (DomainKeys Identified Mail) TXT records for email authentication. Look up existing records by selector, build new DKIM records with your public key, and get provider-specific setup instructions."
        url="/dkim-generator"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        DKIM Record Generator
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Generate and validate DKIM (DomainKeys Identified Mail) records for your domain. Look up existing
        DKIM records by selector, create new TXT records with your RSA public key, and follow step-by-step
        instructions for Google Workspace, Microsoft 365, SendGrid, and other providers — all free and instant.
      </p>

      <DkimGeneratorTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is DKIM?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          DKIM (DomainKeys Identified Mail) is an email authentication standard defined in{' '}
          <strong style={{ color: '#8b5cf6' }}>RFC 6376</strong>. It allows a sending mail server to
          cryptographically sign outgoing messages so that receiving servers can verify the email was
          actually sent by the domain owner and wasn't tampered with in transit. DKIM uses public-key
          cryptography: the sending server signs with a private key, and the public key is published
          in DNS as a TXT record so anyone can verify the signature.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          While <strong style={{ color: '#8b5cf6' }}>SPF</strong> verifies which servers are allowed
          to send email for a domain, DKIM verifies that the message content hasn't been modified. Together
          with <strong style={{ color: '#8b5cf6' }}>DMARC</strong>, these three standards form the
          foundation of modern email authentication. Without DKIM, your emails are more likely to be
          flagged as spam or phishing, especially by major providers like Gmail and Outlook.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How DKIM Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { step: '1', title: 'Key Pair Generated', desc: 'You generate an RSA key pair. The private key stays on your mail server; the public key goes into DNS as a TXT record.', color: '#8b5cf6' },
            { step: '2', title: 'Email Signed', desc: 'When sending an email, your mail server creates a cryptographic hash of certain headers and the body, then signs it with the private key.', color: '#3b82f6' },
            { step: '3', title: 'Signature Added', desc: 'The signature is added as a DKIM-Signature header to the email, including the selector and domain for key lookup.', color: '#22c55e' },
            { step: '4', title: 'Receiver Verifies', desc: 'The receiving server queries DNS for the DKIM public key using the selector, then verifies the signature matches the email content.', color: '#eab308' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>DKIM Record Anatomy</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Tag</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Example</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tag: 'v=', example: 'v=DKIM1', meaning: 'Version — must be DKIM1 (required)' },
                { tag: 'k=', example: 'k=rsa', meaning: 'Key type — RSA is the standard; ed25519 is emerging' },
                { tag: 'p=', example: 'p=MIIBIjAN...', meaning: 'Public key in base64 — the RSA public key data (required)' },
                { tag: 't=', example: 't=y', meaning: 'Testing flag — "y" means testing mode, receivers won\'t reject failures' },
                { tag: 't=', example: 't=s', meaning: 'Strict flag — the "i=" domain must exactly match "d=" (no subdomains)' },
                { tag: 'h=', example: 'h=sha256', meaning: 'Hash algorithm — sha256 (recommended) or sha1 (deprecated)' },
                { tag: 's=', example: 's=email', meaning: 'Service type — "email" or "*" for all services' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '10px 12px', color: '#8b5cf6', fontFamily: 'ui-monospace, monospace', fontWeight: 500 }}>{row.tag}</td>
                  <td style={{ padding: '10px 12px', color: '#ccc', fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem' }}>{row.example}</td>
                  <td style={{ padding: '10px 12px', color: '#999' }}>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>DKIM Selectors Explained</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A <strong style={{ color: '#fff' }}>DKIM selector</strong> is a text string added to the DNS record name
          to allow multiple DKIM keys on the same domain. The full DNS lookup name is{' '}
          <code style={{ color: '#8b5cf6' }}>selector._domainkey.yourdomain.com</code>. Selectors are useful
          when you have multiple mail systems (e.g., Google Workspace for corporate email and SendGrid for
          marketing) — each system gets its own selector and key pair.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          When an email arrives with a DKIM signature, the receiving server reads the <code style={{ color: '#8b5cf6' }}>s=</code> tag
          (selector) and <code style={{ color: '#8b5cf6' }}>d=</code> tag (domain) from the DKIM-Signature header
          to know exactly where to look up the public key. This means you can rotate keys by creating a new
          selector, publishing its key, switching your signing, and then removing the old selector — all without
          any downtime.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>1024-bit vs 2048-bit Keys</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          DKIM supports RSA keys of various sizes, but the two most common are <strong style={{ color: '#eab308' }}>1024-bit</strong> and{' '}
          <strong style={{ color: '#22c55e' }}>2048-bit</strong>. As of 2024, 2048-bit keys are the industry
          standard recommended by Google, Microsoft, and most email security experts. A 1024-bit key can be
          broken with sufficient computing resources and is considered increasingly risky.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          The main challenge with 2048-bit keys is DNS TXT record size limits. A 2048-bit public key is about
          400 characters long, which exceeds the 255-character limit of a single TXT string. Most DNS providers
          handle this automatically by splitting the value into multiple quoted strings that get concatenated.
          If your DNS provider doesn't support this, you may need to use a 1024-bit key or a CNAME-based
          DKIM setup through your email provider.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              q: 'How do I find my domain\'s DKIM selector?',
              a: 'Most email providers use a specific selector. Google Workspace uses "google", Microsoft 365 uses "selector1" and "selector2", SendGrid uses "s1" and "s2". You can also find it by viewing the full headers of a sent email — look for the DKIM-Signature header and the "s=" tag contains your selector.'
            },
            {
              q: 'Can I have multiple DKIM records on one domain?',
              a: 'Yes! Unlike SPF (which allows only one record), you can have as many DKIM records as you need — each with a different selector. This is essential when using multiple email services. Each service gets its own selector and key pair, and they all coexist peacefully in DNS.'
            },
            {
              q: 'What\'s the difference between DKIM, SPF, and DMARC?',
              a: 'SPF specifies which servers can send email for your domain. DKIM proves the email content hasn\'t been tampered with using cryptographic signatures. DMARC ties them together with a policy that tells receivers what to do when SPF or DKIM fails. All three are needed for complete email authentication.'
            },
            {
              q: 'How often should I rotate DKIM keys?',
              a: 'Best practice is to rotate DKIM keys every 6-12 months. To rotate without downtime: create a new selector with a new key pair, start signing with the new key, wait for DNS propagation and for old signatures to expire (a week or two), then remove the old selector. Some providers like Microsoft 365 handle rotation automatically.'
            },
            {
              q: 'Why is my DKIM check failing even though the record exists?',
              a: 'Common causes include: the public key in DNS doesn\'t match the private key used for signing, the TXT record has formatting issues (extra spaces or line breaks), the DNS record hasn\'t fully propagated, the key size exceeds TXT record limits and wasn\'t split correctly, or the "t=y" testing flag is still set in production.'
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
