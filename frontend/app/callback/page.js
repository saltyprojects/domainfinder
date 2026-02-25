export const metadata = { title: 'Auth Callback — DomyDomains' };

export default function Callback() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>✅ Authorized</h1>
      <p style={{ color: 'var(--text-muted)' }}>You can close this window.</p>
    </main>
  );
}
