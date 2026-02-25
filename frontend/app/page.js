import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          🌐 DomyDomains
        </span>
      </nav>

      {/* Main — takes remaining height */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        <SearchDomains />
      </div>
    </div>
  );
}
