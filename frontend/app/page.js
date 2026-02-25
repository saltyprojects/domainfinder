import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px',
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          🌐 DomyDomains
        </span>
      </nav>

      {/* Main content - centers vertically when no results */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 16px 24px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <SearchDomains />
      </div>
    </div>
  );
}
