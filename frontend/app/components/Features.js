const features = [
  {
    icon: '⚡',
    title: 'Instant Results',
    desc: 'See domain availability across 20+ TLDs as you type. No waiting, no page reloads.',
  },
  {
    icon: '🤖',
    title: 'Name Generator',
    desc: 'Get 50+ brandable domain name ideas instantly — prefixes, suffixes, mashups, and more.',
  },
  {
    icon: '📱',
    title: 'Social Handle Check',
    desc: 'Verify matching usernames on X, Instagram, TikTok, GitHub, and LinkedIn — all at once.',
  },
  {
    icon: '💰',
    title: 'Price Comparison',
    desc: 'Compare prices across top registrars. Find the cheapest deal — including renewal costs.',
    badge: 'Coming Soon',
  },
  {
    icon: '🔍',
    title: 'WHOIS Intelligence',
    desc: 'See who owns a taken domain, when it expires, and if it\'s available on aftermarkets.',
    badge: 'Coming Soon',
  },
  {
    icon: '🛡️',
    title: 'Trademark Check',
    desc: 'Avoid legal trouble. We check your domain against trademark databases before you buy.',
    badge: 'Coming Soon',
  },
];

export function Features() {
  return (
    <section id="features" style={{
      padding: '80px 20px',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 700,
        textAlign: 'center',
        letterSpacing: '-0.02em',
        marginBottom: '8px',
      }}>
        Everything you need to find the <span style={{ color: 'var(--green)' }}>perfect domain</span>
      </h2>
      <p style={{
        textAlign: 'center',
        color: 'var(--text-muted)',
        marginBottom: '48px',
        fontSize: '1rem',
      }}>
        More than just a search box — a complete domain intelligence platform.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
      }}>
        {features.map((f) => (
          <div key={f.title} style={{
            padding: '28px 24px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            transition: 'border-color 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{f.title}</h3>
              {f.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '2px 8px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  color: 'var(--purple)',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {f.badge}
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
