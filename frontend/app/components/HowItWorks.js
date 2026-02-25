const steps = [
  { num: '1', icon: '🔍', title: 'Search', desc: 'Type any name and instantly see availability across 20+ TLDs.' },
  { num: '2', icon: '⚖️', title: 'Compare', desc: 'Check social handles, view WHOIS data, and compare registrar prices.' },
  { num: '3', icon: '🚀', title: 'Register', desc: 'Click through to your preferred registrar and secure your domain.' },
];

export function HowItWorks() {
  return (
    <section style={{ padding: '80px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '48px' }}>
        How it <span style={{ color: 'var(--green)' }}>works</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
        {steps.map((s) => (
          <div key={s.num} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{s.icon}</div>
            <div style={{
              display: 'inline-block',
              width: '32px', height: '32px', lineHeight: '32px',
              borderRadius: '50%',
              background: 'var(--green)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.9rem',
              marginBottom: '12px',
            }}>
              {s.num}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '8px' }}>{s.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
