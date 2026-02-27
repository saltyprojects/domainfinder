import Link from 'next/link';
import { StaticPage } from '../components/StaticPage';

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
    <StaticPage>
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

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px' }}>Popular Domain Name Patterns</h2>
          <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
            <p>Studying successful brands reveals common naming patterns you can use:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px', marginTop: '16px' }}>
              {[
                { pattern: 'Verb + Noun', examples: 'ScanLines, DropBox, SoundCloud', desc: 'Action-oriented, implies what the product does' },
                { pattern: 'Misspelling', examples: 'Lyft, Tumblr, Fiverr', desc: 'Unique and memorable, easy to trademark' },
                { pattern: 'Two Syllables', examples: 'Google, Apple, Stripe', desc: 'Short, punchy, easy to say and remember' },
                { pattern: 'Prefix + Word', examples: 'Instagram, Intercom, Outreach', desc: 'Familiar root word with a twist' },
                { pattern: 'Compound Word', examples: 'Facebook, Snapchat, WordPress', desc: 'Two words combined into one brand' },
                { pattern: 'Made-up Word', examples: 'Spotify, Zillow, Hulu', desc: 'Completely original, no competition for the name' },
              ].map(p => (
                <div key={p.pattern} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '6px' }}>{p.pattern}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#22c55e', marginBottom: '6px' }}>{p.examples}</div>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>Frequently Asked Questions</h2>
          {[
            { q: 'How does a domain name generator work?', a: 'Domain name generators take your keyword and create variations by adding prefixes (get, try, my, go), suffixes (hub, lab, hq, app), and combining words. Our generator also checks availability in real-time.' },
            { q: 'Should I use a .com or a newer TLD?', a: 'If your target audience is mainstream consumers, .com is still king. For tech-savvy audiences, .io, .ai, and .dev carry credibility. Use our generator to check availability across all extensions.' },
            { q: 'How long should a domain name be?', a: 'Aim for 6-14 characters. Shorter is better for memorability, but a slightly longer brandable name beats a short generic one. Avoid anything over 20 characters.' },
            { q: 'Can I use hyphens or numbers in my domain?', a: 'Technically yes, but it\'s strongly discouraged. Hyphens are hard to communicate verbally, and numbers cause confusion (is it "5" or "five"?). Stick to letters only.' },
            { q: 'What if my dream domain is taken?', a: 'Try variations with prefixes/suffixes, explore alternative TLDs, or consider buying the domain on the aftermarket. Check our premium domains page for available pre-owned names.' },
          ].map((faq, i) => (
            <div key={i} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{faq.q}</h3>
              <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </section>

        <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Try our domain generator</h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Type any keyword and get hundreds of creative domain suggestions instantly.</p>
          <Link href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Generate domain names →
          </Link>
        </section>
    </StaticPage>
  );
}
