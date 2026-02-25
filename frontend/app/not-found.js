import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '20px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '6rem', marginBottom: '16px' }}>🏠❓</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
        This domain isn&apos;t in our neighborhood
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px' }}>
        Domy looked everywhere but couldn&apos;t find this page. Maybe try searching for a domain instead?
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 24px', background: 'var(--green)', color: '#000',
          borderRadius: '12px', fontWeight: 600, fontSize: '1rem',
        }}
      >
        ← Back to search
      </Link>
    </div>
  );
}
