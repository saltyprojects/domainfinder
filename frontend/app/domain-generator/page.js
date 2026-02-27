import Link from 'next/link';

export const metadata = {
  title: 'Domain Name Generator — Creative Domain Ideas | DomyDomains',
  description: 'Generate creative domain name ideas instantly. Our domain name generator suggests hundreds of brandable names using prefixes, suffixes, and word combinations.',
  keywords: 'domain name generator, domain name ideas, creative domain names, brandable domains, domain suggestions, business name generator',
  alternates: { canonical: '/domain-generator' },
  openGraph: {
    title: 'Domain Name Generator — Creative Domain Ideas',
    description: 'Generate creative domain name ideas instantly with our free tool.',
    url: 'https://domydomains.com/domain-generator',
  },
};

const TIPS = [
  { title: 'Keep it short', desc: 'The best domain names are 6-14 characters. Short names are easier to type, remember, and share.', icon: '✂️' },
  { title: 'Make it brandable', desc: 'Avoid hyphens and numbers. Choose names that sound like a brand — unique, pronounceable, and memorable.', icon: '💎' },
  { title: 'Use word combinations', desc: 'Combine two short words: SnapChat, YouTube, FaceBook. Compound names are memorable and available.', icon: '🔗' },
  { title: 'Try prefixes & suffixes', desc: 'Add "get", "try", "go", "my", "the" before your keyword, or "hub", "lab", "hq", "app" after it.', icon: '🧩' },
  { title: 'Check pronunciation', desc: 'Say your domain name out loud. If people can\'t spell it after hearing it once, pick something simpler.', icon: '🗣️' },
  { title: 'Explore new TLDs', desc: 'If .com is taken, try .io, .ai, .dev, or .co. Modern TLDs are accepted and often more available.', icon: '🌐' },
];

const EXAMPLES = [
  { keyword: 'cloud', results: ['trycloud.com', 'cloudhq.io', 'getcloud.ai', 'mycloudapp.dev', 'cloudlabs.co'] },
  { keyword: 'pixel', results: ['gopixel.io', 'pixelstudio.design', 'mypixel.app', 'pixelhub.dev', 'thepixel.ai'] },
  { keyword: 'bloom', results: ['getbloom.com', 'bloomlab.io', 'trybloom.co', 'bloomhq.ai', 'mybloom.app'] },
];

export default function DomainGenerator() {
  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', height: '48px', borderBottom: '1px solid #1e1e1e', padding: '0 16px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src="/domy-mascot.png" alt="Domy" style={{ width: 26, height: 26, borderRadius: '50%' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>DomyDomains</span>
        </Link>
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 16px 96px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          Domain Name Generator
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '48px', maxWidth: '700px' }}>
          Coming up with the perfect domain name is hard. Our generator creates hundreds of creative, 
          brandable domain suggestions from a single keyword — and checks availability instantly.
        </p>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {[
              { step: '1', title: 'Enter a keyword', desc: 'Type your business idea, niche, or any word.' },
              { step: '2', title: 'We generate names', desc: 'Our algorithm creates variations using prefixes, suffixes, and word combos.' },
              { step: '3', title: 'Check & register', desc: 'See instant availability and register with one click.' },
            ].map(s => (
              <div key={s.step} style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>{s.step}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>{s.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Example Generations</h2>
          {EXAMPLES.map(ex => (
            <div key={ex.keyword} style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>Keyword: <strong style={{ color: '#8b5cf6' }}>{ex.keyword}</strong></div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {ex.results.map(r => (
                  <span key={r} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '8px 14px', fontSize: '0.9rem', color: '#22c55e' }}>{r}</span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Tips for Choosing a Domain Name</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {TIPS.map(tip => (
              <div key={tip.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{tip.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>{tip.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px' }}>Why Domain Names Matter for Your Business</h2>
          <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
            <p>Your domain name is your digital identity. It&apos;s the first thing people see and the last thing they remember. A great domain name can:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Build instant credibility</strong> — A professional domain signals legitimacy to visitors.</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Improve SEO</strong> — Keyword-rich domains can help search engine rankings.</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Drive word-of-mouth</strong> — Short, memorable names get shared more often.</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Protect your brand</strong> — Registering your brand domain prevents others from taking it.</li>
            </ul>
          </div>
        </section>

        <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Try our domain generator</h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Type any keyword and get hundreds of creative domain suggestions instantly.</p>
          <Link href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Generate domain names →
          </Link>
        </section>
      </main>
    </div>
  );
}
