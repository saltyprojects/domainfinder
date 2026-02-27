import Link from 'next/link';
import { StaticPage } from '../components/StaticPage';

export const metadata = {
  title: 'About DomyDomains — The Fastest Domain Search Tool',
  description: 'DomyDomains is the fastest domain name search engine on the internet. Search 400+ domain extensions instantly. Built for speed, simplicity, and developers.',
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <StaticPage>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <img src="/domy-mascot.png" alt="Domy mascot" style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))' }} />
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>About DomyDomains</h1>
          <p style={{ fontSize: '1.1rem', color: '#8b5cf6', fontWeight: 500 }}>The fastest domain search tool on the internet.</p>
        </div>

        <div style={{ color: '#9ca3af', lineHeight: 1.9, fontSize: '1.05rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Our Mission</h2>
          <p>We believe finding the perfect domain name should be instant and effortless. That&apos;s why we built DomyDomains — a domain search engine that shows results as you type, across <strong style={{ color: '#22c55e' }}>400+ domain extensions</strong>.</p>

          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginTop: '36px', marginBottom: '12px' }}>How We&apos;re Different</h2>
          <p>Most domain search tools make you click &ldquo;Search&rdquo; and wait. We show results as you type — every keystroke triggers a live availability check across hundreds of TLDs simultaneously.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '24px 0' }}>
            {[
              { number: '400+', label: 'Domain extensions' },
              { number: '<1s', label: 'Average response time' },
              { number: '50', label: 'Concurrent DNS workers' },
              { number: '0', label: 'Cost to use' },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#111', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6' }}>{stat.number}</div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginTop: '36px', marginBottom: '12px' }}>Our Technology</h2>
          <p>DomyDomains uses <strong style={{ color: '#fff' }}>direct DNS resolution</strong> for the fastest possible availability checks — no slow third-party APIs. Our backend runs 50 concurrent workers that resolve domains in parallel, giving you results in milliseconds.</p>
          <p>The frontend is built with <strong style={{ color: '#fff' }}>Next.js</strong> for instant page loads and server-side rendering. The backend runs on <strong style={{ color: '#fff' }}>Django REST Framework</strong>, battle-tested and scalable.</p>

          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginTop: '36px', marginBottom: '12px' }}>Features</h2>
          <ul style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Domain Search</strong> — Instantly check availability across 400+ TLDs</li>
            <li style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Domain Extensions</strong> — Browse and compare all available TLDs</li>
            <li style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Name Generator</strong> — Get creative domain name suggestions from any keyword</li>
            <li style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Premium Domains</strong> — Discover aftermarket domains with existing value</li>
          </ul>

          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginTop: '36px', marginBottom: '12px' }}>Meet Domy</h2>
          <p>Domy is our mascot — a friendly purple house with a magnifying glass, always helping you find your perfect domain. Domy represents what we stand for: making domain search feel like home. 🏠</p>

          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginTop: '36px', marginBottom: '12px' }}>Connect With Us</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
            {[
              { label: '𝕏 Twitter', url: 'https://x.com/domydomains' },
              { label: '📸 Instagram', url: 'https://instagram.com/domydomains' },
              { label: '💼 LinkedIn', url: 'https://linkedin.com/company/domydomains' },
            ].map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '10px 16px', color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '48px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Why We Built DomyDomains</h2>
          <div style={{ color: '#9ca3af', lineHeight: 1.9, fontSize: '1.05rem' }}>
            <p>We were tired of slow domain search tools that make you click &ldquo;Search&rdquo; and wait seconds for each query. We wanted something that feels like Google — type and see results instantly.</p>
            <p>So we built DomyDomains from scratch with one goal: <strong style={{ color: '#fff' }}>be the fastest domain search on the internet</strong>. No bloat, no upsells, no 10-second loading spinners. Just instant results across 400+ extensions.</p>
            <p>We use DNS resolution directly instead of third-party APIs, which means our availability checks are as fast as physically possible — limited only by the speed of light to DNS servers worldwide.</p>
          </div>
        </div>

        <div style={{ marginTop: '48px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Explore Our Tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { href: '/domain-extensions', icon: '🧩', title: 'Extensions Guide', desc: '400+ TLDs explained' },
              { href: '/domain-generator', icon: '⚡', title: 'Name Generator', desc: 'Creative domain ideas' },
              { href: '/premium-domains', icon: '💎', title: 'Premium Domains', desc: 'Aftermarket marketplace' },
              { href: '/domain-pricing', icon: '💰', title: 'Pricing Guide', desc: 'Compare registrar costs' },
            ].map(tool => (
              <a key={tool.href} href={tool.href} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e', textDecoration: 'none', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{tool.icon}</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{tool.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{tool.desc}</div>
              </a>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '48px', background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Ready to find your domain?</h2>
          <Link href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Start searching →
          </Link>
        </div>
    </StaticPage>
  );
}
