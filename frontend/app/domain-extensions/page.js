import Link from 'next/link';
import { StaticPage } from '../components/StaticPage';

export const metadata = {
  title: 'Domain Extensions Guide 2026 — All TLDs Explained | DomyDomains',
  description: 'Complete guide to 400+ domain extensions (TLDs). Learn about .com, .ai, .io, .dev and hundreds more. Find the perfect extension for your website.',
  keywords: 'domain extensions, TLD guide, domain TLDs, .com, .ai, .io, .dev, .net, .org, domain extension list',
  alternates: { canonical: '/domain-extensions' },
  openGraph: {
    title: 'Domain Extensions Guide 2026 — All TLDs Explained',
    description: 'Complete guide to 400+ domain extensions. Find the perfect TLD for your website.',
    url: 'https://domydomains.com/domain-extensions',
  },
};

const POPULAR_TLDS = [
  { ext: '.com', desc: 'The most popular and trusted domain extension worldwide. Ideal for any website or business.', price: '$8-12/yr', category: 'Generic' },
  { ext: '.net', desc: 'Originally for network organizations, now widely used as an alternative to .com.', price: '$10-15/yr', category: 'Generic' },
  { ext: '.org', desc: 'Traditionally for nonprofits and organizations. Trusted and established.', price: '$9-12/yr', category: 'Generic' },
  { ext: '.ai', desc: 'The hottest TLD in tech. Perfect for AI startups, machine learning projects, and tech brands.', price: '$50-80/yr', category: 'Tech' },
  { ext: '.io', desc: 'Popular with tech startups and SaaS companies. Short, memorable, and tech-forward.', price: '$30-50/yr', category: 'Tech' },
  { ext: '.dev', desc: 'Google-backed TLD for developers. Requires HTTPS. Great for portfolios and tools.', price: '$12-15/yr', category: 'Tech' },
  { ext: '.app', desc: 'Perfect for mobile apps and web applications. Also requires HTTPS.', price: '$12-15/yr', category: 'Tech' },
  { ext: '.co', desc: 'Short alternative to .com. Popular with startups and companies.', price: '$25-30/yr', category: 'Business' },
  { ext: '.xyz', desc: 'Modern and affordable. Used by Google (abc.xyz) and popular with Gen Z.', price: '$1-10/yr', category: 'Generic' },
  { ext: '.me', desc: 'Great for personal brands, portfolios, and about-me pages.', price: '$15-20/yr', category: 'Personal' },
  { ext: '.shop', desc: 'Perfect for e-commerce stores and online retail businesses.', price: '$2-10/yr', category: 'Business' },
  { ext: '.tech', desc: 'Ideal for technology companies, blogs, and services.', price: '$5-40/yr', category: 'Tech' },
  { ext: '.cloud', desc: 'Popular for cloud computing, SaaS, and hosting services.', price: '$10-20/yr', category: 'Tech' },
  { ext: '.design', desc: 'Made for designers, agencies, and creative professionals.', price: '$10-30/yr', category: 'Creative' },
  { ext: '.blog', desc: 'Purpose-built for blogs and content creators.', price: '$3-15/yr', category: 'Creative' },
  { ext: '.store', desc: 'Another great option for e-commerce and online shops.', price: '$2-10/yr', category: 'Business' },
  { ext: '.gg', desc: 'Popular in gaming communities. Originally for Guernsey.', price: '$40-60/yr', category: 'Gaming' },
  { ext: '.tv', desc: 'Perfect for streaming, video content, and media companies.', price: '$25-35/yr', category: 'Media' },
];

const CATEGORIES = {
  'Tech': { color: '#8b5cf6', icon: '💻' },
  'Generic': { color: '#22c55e', icon: '🌐' },
  'Business': { color: '#3b82f6', icon: '🏢' },
  'Personal': { color: '#ec4899', icon: '👤' },
  'Creative': { color: '#f59e0b', icon: '🎨' },
  'Gaming': { color: '#ef4444', icon: '🎮' },
  'Media': { color: '#06b6d4', icon: '📺' },
};

export default function DomainExtensions() {
  return (
    <StaticPage>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          Domain Extensions Guide
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '48px', maxWidth: '700px' }}>
          Understanding domain extensions (TLDs) is crucial for choosing the right domain name. 
          We support <strong style={{ color: '#22c55e' }}>400+ extensions</strong> — here&apos;s everything you need to know about the most popular ones.
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}>
          {Object.entries(CATEGORIES).map(([cat, { color, icon }]) => (
            <span key={cat} style={{ background: `${color}15`, border: `1px solid ${color}40`, borderRadius: '20px', padding: '6px 14px', fontSize: '0.8rem', color }}>
              {icon} {cat}
            </span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {POPULAR_TLDS.map(tld => {
            const cat = CATEGORIES[tld.category] || CATEGORIES.Generic;
            return (
              <div key={tld.ext} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: cat.color }}>{tld.ext}</span>
                  <span style={{ fontSize: '0.75rem', color: '#666', background: '#1a1a1a', padding: '3px 8px', borderRadius: '4px' }}>{tld.price}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{tld.desc}</p>
                <div style={{ marginTop: '12px' }}>
                  <Link href={`/?q=example`} style={{ fontSize: '0.75rem', color: '#8b5cf6', textDecoration: 'none' }}>
                    Search {tld.ext} domains →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <section style={{ marginTop: '64px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px' }}>How to Choose the Right Domain Extension</h2>
          <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
            <p>Choosing the right domain extension can impact your brand perception, SEO, and memorability. Here are key factors to consider:</p>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px' }}>1. Industry Relevance</h3>
            <p>Tech companies gravitate toward <strong style={{ color: '#8b5cf6' }}>.ai</strong>, <strong style={{ color: '#8b5cf6' }}>.io</strong>, and <strong style={{ color: '#8b5cf6' }}>.dev</strong>. E-commerce businesses prefer <strong style={{ color: '#3b82f6' }}>.shop</strong> or <strong style={{ color: '#3b82f6' }}>.store</strong>. When your TLD matches your industry, visitors immediately understand what you do.</p>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px' }}>2. Trust & Recognition</h3>
            <p><strong style={{ color: '#22c55e' }}>.com</strong> remains the most trusted extension. If your target audience is non-technical, .com should be your first choice. For tech-savvy audiences, newer TLDs like .ai and .io carry significant credibility.</p>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px' }}>3. Availability & Price</h3>
            <p>Premium TLDs like .ai can cost $50-80/year, while newer extensions like .xyz start at just $1/year. Use our <Link href="/" style={{ color: '#8b5cf6' }}>domain search tool</Link> to check availability across all 400+ extensions instantly.</p>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px' }}>4. SEO Impact</h3>
            <p>Google treats all TLDs equally for ranking purposes. However, .com domains tend to get higher click-through rates in search results due to user familiarity. The best strategy is to pick a memorable, brandable name regardless of extension.</p>
          </div>
        </section>

        <section style={{ marginTop: '64px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px' }}>Country Code TLDs (ccTLDs)</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.8, marginBottom: '24px' }}>
            Country code TLDs are two-letter extensions assigned to specific countries. Some have become popular globally:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
            {[
              { ext: '.uk', country: 'United Kingdom' }, { ext: '.de', country: 'Germany' },
              { ext: '.fr', country: 'France' }, { ext: '.jp', country: 'Japan' },
              { ext: '.au', country: 'Australia' }, { ext: '.ca', country: 'Canada' },
              { ext: '.in', country: 'India' }, { ext: '.br', country: 'Brazil' },
              { ext: '.it', country: 'Italy' }, { ext: '.es', country: 'Spain' },
              { ext: '.nl', country: 'Netherlands' }, { ext: '.se', country: 'Sweden' },
            ].map(({ ext, country }) => (
              <div key={ext} style={{ background: '#111', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>{ext}</span>
                <span style={{ color: '#666', fontSize: '0.85rem' }}>{country}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '64px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px' }}>New TLDs Worth Watching in 2026</h2>
          <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
            <p>The domain landscape is constantly evolving. Here are the newest and most exciting TLDs gaining traction:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginTop: '16px' }}>
              {[
                { ext: '.ai', trend: '🔥 Hottest', note: 'AI/ML startups' },
                { ext: '.app', trend: '📱 Growing', note: 'Mobile & web apps' },
                { ext: '.dev', trend: '👨‍💻 Developer fave', note: 'Dev tools & portfolios' },
                { ext: '.xyz', trend: '🚀 Gen Z pick', note: 'Modern & affordable' },
                { ext: '.io', trend: '💼 Startup staple', note: 'Tech companies' },
                { ext: '.gg', trend: '🎮 Gaming boom', note: 'Gaming & esports' },
              ].map(t => (
                <div key={t.ext} style={{ background: '#111', borderRadius: '8px', padding: '16px', border: '1px solid #1e1e1e' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#8b5cf6' }}>{t.ext}</div>
                  <div style={{ fontSize: '0.8rem', color: '#22c55e', marginTop: '4px' }}>{t.trend}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>{t.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginTop: '64px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>Frequently Asked Questions</h2>
          {[
            { q: 'What is a domain extension (TLD)?', a: 'A TLD (Top-Level Domain) is the last part of a domain name, like .com, .org, or .ai. It helps categorize websites and can signal the purpose or region of a site.' },
            { q: 'Does my domain extension affect SEO?', a: 'Google treats all TLDs equally for ranking. However, .com domains tend to get higher click-through rates because users trust them more. Choose a TLD that fits your brand rather than optimizing for SEO.' },
            { q: 'Can I change my domain extension later?', a: 'You can register a new domain with a different extension, but you\'ll need to set up redirects and may lose some SEO equity. It\'s best to choose the right extension from the start.' },
            { q: 'Why are some TLDs more expensive?', a: 'Pricing depends on the registry operator. Country-code TLDs and premium extensions like .ai charge more because of limited supply and high demand. Generic TLDs like .xyz are cheap because registries want volume.' },
            { q: 'What\'s the difference between gTLDs and ccTLDs?', a: 'gTLDs (generic TLDs) like .com, .org, .net are open to anyone. ccTLDs (country-code TLDs) like .uk, .de, .jp are tied to specific countries, though many are available globally.' },
            { q: 'How many domain extensions exist?', a: 'There are over 1,500 TLDs as of 2026, including traditional ones (.com, .net), new gTLDs (.app, .dev, .ai), and country codes (.uk, .de). DomyDomains supports 400+ of the most popular ones.' },
          ].map((faq, i) => (
            <div key={i} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: i < 5 ? '1px solid #1e1e1e' : 'none' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{faq.q}</h3>
              <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </section>

        <section style={{ marginTop: '64px', background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Ready to find your domain?</h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Search 400+ extensions instantly with DomyDomains.</p>
          <Link href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Start searching →
          </Link>
        </section>
    </StaticPage>
  );
}
