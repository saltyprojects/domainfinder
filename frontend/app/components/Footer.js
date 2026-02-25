export function Footer() {
  return (
    <footer style={{
      padding: '48px 20px',
      borderTop: '1px solid var(--border)',
      marginTop: '40px',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>🌐 DomyDomains</span>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>
            Find your perfect domain — instantly.
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '24px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="mailto:hello@domydomains.com">Contact</a>
        </div>
      </div>
    </footer>
  );
}
