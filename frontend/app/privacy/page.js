export const metadata = { title: 'Privacy Policy — DomyDomains' };

export default function Privacy() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Last updated: February 25, 2026</p>

      <Section title="1. Information We Collect">
        DomyDomains does not require account creation. We may collect anonymized usage data such as search queries and page views to improve the service. We do not collect personal information unless you voluntarily provide it (e.g., contacting us via email).
      </Section>

      <Section title="2. Cookies">
        We may use essential cookies for service functionality. We do not use tracking cookies or third-party advertising cookies.
      </Section>

      <Section title="3. Third-Party Links">
        DomyDomains contains links to third-party domain registrars. These sites have their own privacy policies. We are not responsible for their practices.
      </Section>

      <Section title="4. Affiliate Partners">
        We partner with domain registrars through affiliate programs. When you click a registrar link, the registrar may collect information according to their own privacy policy. We do not share your data with affiliates.
      </Section>

      <Section title="5. Data Security">
        We implement reasonable security measures to protect the service. No method of transmission over the internet is 100% secure.
      </Section>

      <Section title="6. Children">
        DomyDomains is not directed at children under 13. We do not knowingly collect information from children.
      </Section>

      <Section title="7. Changes">
        We may update this policy at any time. Changes are effective when posted on this page.
      </Section>

      <Section title="8. Contact">
        Questions about privacy? Email us at hello@domydomains.com
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
