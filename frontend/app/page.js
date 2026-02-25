import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  return (
    <>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 16px',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          🌐 DomyDomains
        </span>
      </nav>

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 16px 32px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: '16px',
          maxWidth: '700px',
          width: '100%',
        }}>
          Find your perfect<br />
          <span style={{ color: 'var(--green)' }}>domain name</span>
        </h1>

        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          color: 'var(--text-muted)',
          textAlign: 'center',
          maxWidth: '450px',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}>
          Instant availability check across 20+ TLDs.
        </p>

        <SearchDomains />
      </main>

      <footer style={{
        padding: '48px 16px',
        borderTop: '1px solid var(--border)',
        marginTop: '80px',
        textAlign: 'center',
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>🌐 DomyDomains</span>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '4px' }}>
          Free domain search tool
        </p>
      </footer>
    </>
  );
}
