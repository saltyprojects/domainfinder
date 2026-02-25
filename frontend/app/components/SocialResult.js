'use client';

const PLATFORM_ICONS = {
  github: '🐙',
  instagram: '📷',
  linkedin: '💼',
  tiktok: '🎵',
  twitter: '𝕏',
};

export function SocialResult({ result }) {
  const { platform, display_name, url, available } = result;
  const icon = PLATFORM_ICONS[platform] || '🔗';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: available === true ? 'var(--green)' : available === false ? 'var(--red)' : 'var(--text-muted)',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{display_name}</span>
      </div>

      {available === true ? (
        <span style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600 }}>
          Available
        </span>
      ) : available === false ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
        >
          Taken ↗
        </a>
      ) : (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Unknown
        </span>
      )}
    </div>
  );
}
