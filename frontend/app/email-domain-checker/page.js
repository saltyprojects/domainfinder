import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import EmailDomainChecker from './EmailDomainChecker';

export const metadata = {
  title: 'Email Domain Checker — Check MX, SPF, DKIM & DMARC Records | DomyDomains',
  description: 'Check any domain\'s email configuration including MX records, SPF, DKIM, and DMARC settings. Free email domain checker with security scoring and provider detection.',
  keywords: 'email domain checker, MX record lookup, SPF checker, DKIM checker, DMARC checker, email security, email authentication, mail server check, email deliverability',
  alternates: { canonical: '/email-domain-checker' },
  openGraph: {
    title: 'Email Domain Checker — Check MX, SPF, DKIM & DMARC Records',
    description: 'Check any domain\'s email configuration including MX records, SPF, DKIM, and DMARC settings. Free email security scoring tool.',
    url: 'https://domydomains.com/email-domain-checker',
  },
};

export default function EmailDomainCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Email Domain Checker"
        description="Check any domain's email configuration including MX records, SPF, DKIM, and DMARC settings. Free email domain checker with security scoring and provider detection."
        url="/email-domain-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Email Domain Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Check any domain's email configuration — MX records, SPF, DKIM, and DMARC authentication.
        Identify your email provider, spot security gaps, and get an email health score.
      </p>

      <EmailDomainChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is Email Domain Authentication?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Email authentication is a set of DNS-based protocols that verify the identity of email senders
            and protect domains from spoofing, phishing, and spam. When properly configured, these records
            tell receiving mail servers how to handle messages claiming to come from your domain.
          </p>
          <p style={{ marginTop: '12px' }}>
            Without proper email authentication, anyone can send emails pretending to be from your domain.
            This puts your brand reputation at risk and can lead to your legitimate emails landing in spam
            folders. Our free email domain checker analyzes four critical DNS records that form the backbone
            of email security.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Email Authentication Records Explained</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            {
              icon: '📬',
              title: 'MX Records',
              full: 'Mail Exchange Records',
              desc: 'MX records tell the internet which mail servers accept email for your domain. Without MX records, your domain cannot receive any email. Multiple MX records with different priorities provide failover.',
              example: 'example.com → 10 mail.example.com',
            },
            {
              icon: '🛡️',
              title: 'SPF Record',
              full: 'Sender Policy Framework',
              desc: 'SPF specifies which IP addresses and mail servers are authorized to send email on behalf of your domain. Receiving servers check SPF to detect forged sender addresses.',
              example: 'v=spf1 include:_spf.google.com ~all',
            },
            {
              icon: '✍️',
              title: 'DKIM Record',
              full: 'DomainKeys Identified Mail',
              desc: 'DKIM adds a digital signature to outgoing emails. The receiving server verifies this signature against a public key in your DNS records, confirming the message wasn\'t altered in transit.',
              example: 'selector._domainkey.example.com → v=DKIM1; p=...',
            },
            {
              icon: '🔒',
              title: 'DMARC Record',
              full: 'Domain-based Message Authentication',
              desc: 'DMARC ties SPF and DKIM together, telling receivers what to do when authentication fails — none (monitor), quarantine (flag), or reject (block). It also provides reporting.',
              example: 'v=DMARC1; p=reject; rua=mailto:reports@example.com',
            },
          ].map(item => (
            <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '4px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>{item.full}</p>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '12px' }}>{item.desc}</p>
              <div style={{ background: '#0a0a0a', padding: '8px 12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#8b5cf6', wordBreak: 'break-all' }}>
                {item.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Email Security Matters</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Email remains the primary attack vector for cybercrime. Over 90% of cyberattacks begin with
            a phishing email, and business email compromise (BEC) costs organizations billions every year.
            Proper domain email authentication is your first line of defense.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '20px' }}>
            {[
              { stat: '3.4B', label: 'phishing emails sent daily worldwide' },
              { stat: '$2.7B', label: 'lost to BEC attacks in 2023 alone' },
              { stat: '75%', label: 'of domains lack a DMARC reject policy' },
              { stat: '10x', label: 'more likely to land in inbox with full auth' },
            ].map(s => (
              <div key={s.label} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6', marginBottom: '6px' }}>{s.stat}</div>
                <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Improve Your Email Security Score</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            {
              step: '1',
              title: 'Set Up SPF Records',
              desc: 'Add a TXT record listing your authorized mail servers. For Google Workspace: v=spf1 include:_spf.google.com ~all. For Microsoft 365: v=spf1 include:spf.protection.outlook.com ~all.',
            },
            {
              step: '2',
              title: 'Enable DKIM Signing',
              desc: 'Generate DKIM keys through your email provider and publish the public key as a DNS TXT record. Most providers like Google and Microsoft have built-in DKIM setup wizards.',
            },
            {
              step: '3',
              title: 'Deploy DMARC Gradually',
              desc: 'Start with p=none to monitor, then move to p=quarantine, and finally p=reject. Use rua= to receive aggregate reports so you can identify legitimate senders before enforcing.',
            },
            {
              step: '4',
              title: 'Monitor and Maintain',
              desc: 'Regularly check your email authentication records. Review DMARC reports to catch unauthorized senders. Update SPF when you add new email services or marketing platforms.',
            },
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', gap: '16px', background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <div style={{
                minWidth: '40px', height: '40px', borderRadius: '50%', background: '#8b5cf620',
                color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '1.1rem', border: '1px solid #8b5cf640',
              }}>
                {item.step}
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          {
            q: 'What does this email domain checker test?',
            a: 'Our tool checks four critical DNS records: MX records (mail servers), SPF (authorized senders), DKIM (email signatures), and DMARC (authentication policy). It also detects your email provider and calculates a security score.',
          },
          {
            q: 'Can I check any domain\'s email configuration?',
            a: 'Yes. Email authentication records are public DNS records, so anyone can check them. This is by design — receiving mail servers need to access these records to verify incoming emails.',
          },
          {
            q: 'Why does my domain show no DKIM record?',
            a: 'DKIM records use selectors (like "google" or "selector1") that vary by provider. Our tool checks common selectors, but your domain may use a custom one. Check your email provider\'s documentation for your specific DKIM selector.',
          },
          {
            q: 'What DMARC policy should I use?',
            a: 'Start with p=none to collect reports without affecting delivery. Once you\'re confident all legitimate email passes authentication, move to p=quarantine, then p=reject for maximum protection.',
          },
          {
            q: 'How does email authentication affect deliverability?',
            a: 'Properly configured SPF, DKIM, and DMARC significantly improve email deliverability. Major providers like Gmail and Outlook prioritize authenticated email and are increasingly rejecting unauthenticated messages.',
          },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Protect Your Domain's Email Reputation</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
          Properly configured email authentication protects your brand from phishing and improves deliverability.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/dns-lookup" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Full DNS Lookup →
          </a>
          <a href="/ssl-checker" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            SSL Certificate Checker
          </a>
        </div>
      </section>
    </StaticPage>
  );
}
