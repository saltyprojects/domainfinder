const testimonials = [
  { name: 'Alex R.', role: 'Startup Founder', text: 'Found the perfect .io domain in seconds. The social handle check saved me hours of manual searching.', avatar: '👨‍💻' },
  { name: 'Sarah K.', role: 'Freelance Designer', text: 'I love that it checks social handles too. Launched my brand with matching domain + socials in one session.', avatar: '👩‍🎨' },
  { name: 'Marcus T.', role: 'Developer', text: 'Clean, fast, no bloat. Exactly what a domain search tool should be. Bookmarked immediately.', avatar: '🧑‍💻' },
];

export function Testimonials() {
  return (
    <section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '8px' }}>
        Loved by <span style={{ color: 'var(--green)' }}>builders</span>
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '48px', fontSize: '0.95rem' }}>
        See what people are saying about DomyDomains.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {testimonials.map((t) => (
          <div key={t.name} style={{
            padding: '24px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px', fontStyle: 'italic' }}>
              &ldquo;{t.text}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{t.avatar}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
