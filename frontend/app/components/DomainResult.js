'use client';

const REGISTRAR_URL = 'https://www.namecheap.com/domains/registration/results/?domain=';

export function DomainResult({ result }) {
  const { full_domain, tld, available } = result;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 18px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: available ? 'var(--green)' : 'var(--red)',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '1rem', fontWeight: 500 }}>
          {full_domain}
        </span>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          background: 'var(--border)',
          padding: '2px 8px',
          borderRadius: '4px',
        }}>
          .{tld}
        </span>
      </div>

      {available ? (
        <a
          href={`${REGISTRAR_URL}${encodeURIComponent(full_domain)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '8px 16px',
            background: 'var(--green)',
            color: '#000',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          Register
        </a>
      ) : (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Taken
        </span>
      )}
    </div>
  );
}
