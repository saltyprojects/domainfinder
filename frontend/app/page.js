import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
    }}>
      {/* Nav — always visible */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          🌐 DomyDomains
        </span>
      </nav>

      {/* Main — takes remaining height, search lives inside */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <SearchDomains />
      </div>

      {/* Footer — always visible */}
      <footer style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 16px',
        flexShrink: 0,
        borderTop: '1px solid var(--border)',
        fontSize: '0.75rem',
        color: 'var(--text-dim)',
      }}>
        © 2026 DomyDomains
      </footer>
    </div>
  );
}
