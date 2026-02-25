import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 20px',
      minHeight: '100vh',
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '8px' }}>
        🌐 BestDomain
      </h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
        Find your perfect domain — instantly
      </p>
      <SearchDomains />
    </main>
  );
}
