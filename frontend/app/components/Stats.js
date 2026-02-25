const stats = [
  { value: '20+', label: 'TLDs checked' },
  { value: '<1s', label: 'Search speed' },
  { value: '5', label: 'Social platforms' },
  { value: 'Free', label: 'Forever' },
];

export function Stats() {
  return (
    <section style={{
      padding: '48px 20px',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        textAlign: 'center',
      }}>
        {stats.map((s) => (
          <div key={s.label}>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--green)',
              letterSpacing: '-0.02em',
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: '0.8rem',
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
