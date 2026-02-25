const stats = [
  { value: '20+', label: 'TLDs checked' },
  { value: '<1s', label: 'Search speed' },
  { value: '5', label: 'Social platforms' },
  { value: 'Free', label: 'Forever' },
];

export function Stats() {
  return (
    <section style={{
      padding: '32px 16px',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        textAlign: 'center',
      }}>
        {stats.map((s) => (
          <div key={s.label}>
            <div style={{
              fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
              fontWeight: 800,
              color: 'var(--green)',
              letterSpacing: '-0.02em',
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '4px',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
