export const metadata = { title: 'Terms of Service — DomyDomains' };

export default function Terms() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px' }}>Terms of Service</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Last updated: February 25, 2026</p>

      <Section title="1. Acceptance of Terms">
        By accessing and using DomyDomains (domydomains.com), you agree to these Terms of Service. If you do not agree, do not use the service.
      </Section>

      <Section title="2. Description of Service">
        DomyDomains provides domain name search, availability checking, name suggestions, and related tools. We are not a domain registrar — we link to third-party registrars where you can purchase domains.
      </Section>

      <Section title="3. Use of Service">
        You agree to use DomyDomains only for lawful purposes. You may not abuse, overload, or interfere with the service. Automated access is subject to rate limits.
      </Section>

      <Section title="4. Affiliate Links">
        DomyDomains contains affiliate links to domain registrars. We may earn a commission when you purchase a domain through these links at no additional cost to you.
      </Section>

      <Section title="5. Accuracy">
        Domain availability results are provided as-is and may not be 100% accurate in real-time. Always verify availability directly with the registrar before purchasing.
      </Section>

      <Section title="6. Limitation of Liability">
        DomyDomains is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of the service.
      </Section>

      <Section title="7. Changes">
        We may update these terms at any time. Continued use of the service constitutes acceptance of updated terms.
      </Section>

      <Section title="8. Contact">
        Questions? Email us at hello@domydomains.com
      </Section>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>{children}</p>
    </div>
  );
}
