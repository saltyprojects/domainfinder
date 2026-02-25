'use client';

const REGISTRAR_URL = 'https://www.namecheap.com/domains/registration/results/?domain=';

export function DomainResult({ result, onCopy, copied }) {
  const { full_domain, tld, available, price, currency } = result;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: available ? 'var(--green-dim)' : 'var(--surface)',
      border: `1px solid ${available ? 'rgba(34, 197, 94, 0.15)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      transition: 'background 0.15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: available ? 'var(--green)' : 'var(--red)',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: '0.95rem',
          fontWeight: available ? 600 : 400,
          color: available ? 'var(--text)' : 'var(--text-muted)',
        }}>
          {full_domain}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Copy button */}
        <button
          onClick={(e) => { e.stopPropagation(); onCopy?.(); }}
          title="Copy domain"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.8rem', color: copied ? 'var(--green)' : 'var(--text-dim)',
            padding: '4px 6px', borderRadius: '4px', transition: 'color 0.15s',
          }}
        >
          {copied ? '✓' : '📋'}
        </button>

        {available ? (
          <>
            {price && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                ${price.toFixed(2)}
              </span>
            )}
            <a
              href={`${REGISTRAR_URL}${encodeURIComponent(full_domain)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '6px 16px', background: 'var(--green)', color: '#000',
                borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                transition: 'opacity 0.15s', textDecoration: 'none',
              }}
            >
              Register →
            </a>
          </>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Taken</span>
        )}
      </div>
    </div>
  );
}
