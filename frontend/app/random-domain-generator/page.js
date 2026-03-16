import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import RandomDomainGenerator from './RandomDomainGenerator';

export const metadata = {
  title: 'Random Domain Name Generator — Creative Brandable Domain Ideas | DomyDomains',
  description: 'Generate random, creative domain names instantly. Get brandable domain suggestions with customizable options for style, length, and industry.',
  keywords: 'random domain generator, creative domain names, brandable domains, domain name ideas, automatic domain generator, unique domain names',
  alternates: { canonical: '/random-domain-generator' },
  openGraph: {
    title: 'Random Domain Name Generator — Creative Brandable Ideas',
    description: 'Generate unique, brandable domain names with our random domain generator. Perfect for startups and new projects.',
    url: 'https://domydomains.com/random-domain-generator',
  },
};

export default function RandomDomainGeneratorPage() {
  return (
    <StaticPage>
      <ToolSchema 
        name="Random Domain Name Generator" 
        description="Generate random, creative domain names instantly. Get brandable domain suggestions with customizable options."
        url="/random-domain-generator" 
      />
      
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Random Domain Generator
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Can't think of the perfect domain name? Let our random generator create unique, brandable domain 
        suggestions for you. Customize by style, industry, and length to find the perfect fit.
      </p>

      <RandomDomainGenerator />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Use a Random Domain Generator?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Beat Creative Block', desc: 'Stuck on naming? Random generation sparks new ideas you might never have considered.', icon: '💡' },
            { title: 'Discover Unique Names', desc: 'Find brandable names that stand out from obvious, generic domain choices.', icon: '✨' },
            { title: 'Explore Different Styles', desc: 'Generate tech-style, professional, fun, or abstract names to match your brand.', icon: '🎨' },
            { title: 'Save Time', desc: 'Get hundreds of name ideas instantly instead of brainstorming for hours.', icon: '⚡' },
            { title: 'Find Available Domains', desc: 'Check availability instantly and register your favorite generated names.', icon: '🔍' },
            { title: 'Inspire Variations', desc: 'Use generated names as starting points to create even better variations.', icon: '🚀' },
          ].map(item => (
            <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Domain Naming Styles</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Different industries and brand personalities call for different naming approaches:</p>
          
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {[
              {
                style: 'Tech & Startup',
                examples: 'Stripe, Slack, Zoom, Figma',
                characteristics: 'Short, punchy, modern. Often made-up words or creative spellings.',
                goodFor: 'Software, apps, tech startups, SaaS products'
              },
              {
                style: 'Professional & Corporate',
                examples: 'Microsoft, Goldman, Oracle, Accenture',
                characteristics: 'Sophisticated, trustworthy. Real words or combinations that convey expertise.',
                goodFor: 'Consulting, finance, law, healthcare, enterprise software'
              },
              {
                style: 'Creative & Fun',
                examples: 'Spotify, Netflix, Snapchat, TikTok',
                characteristics: 'Playful, memorable, unique. Often compound words or creative combinations.',
                goodFor: 'Entertainment, social media, lifestyle, creative services'
              },
              {
                style: 'Descriptive',
                examples: 'Facebook, WordPress, YouTube, LinkedIn',
                characteristics: 'Self-explanatory, describes what the product does clearly.',
                goodFor: 'New markets, educational products, clear value propositions'
              },
            ].map(style => (
              <div key={style.style} style={{ background: '#111', borderRadius: '8px', padding: '20px', border: '1px solid #1e1e1e' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '8px' }}>
                  {style.style}
                </h3>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666', marginRight: '8px' }}>Examples:</span>
                  <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>{style.examples}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '8px', lineHeight: 1.6 }}>
                  {style.characteristics}
                </p>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#666', marginRight: '8px' }}>Good for:</span>
                  <span style={{ fontSize: '0.85rem', color: '#f59e0b' }}>{style.goodFor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Tips for Evaluating Generated Names</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Not every generated name will be perfect. Here's how to evaluate your options:</p>
          
          <div style={{ display: 'grid', gap: '8px', marginTop: '16px' }}>
            {[
              { criteria: 'Easy to spell and pronounce', test: 'Can people spell it after hearing it once? Avoid confusing letter combinations.' },
              { criteria: 'Memorable and brandable', test: 'Does it stick in your mind? Would it look good on a business card or logo?' },
              { criteria: 'Appropriate for your industry', test: 'Does it convey the right tone? A playful name might not work for financial services.' },
              { criteria: 'Available across platforms', test: 'Check domain availability, social media handles, and trademark issues.' },
              { criteria: 'Future-proof', test: 'Will it still make sense if your business evolves or expands into new areas?' },
              { criteria: 'No negative associations', test: 'Google it. Check if it means something inappropriate in other languages.' },
            ].map((tip, i) => (
              <div key={i} style={{ background: '#111', borderRadius: '8px', padding: '16px', border: '1px solid #1e1e1e' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', background: '#8b5cf6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 600, color: '#fff', flexShrink: 0
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                      {tip.criteria}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#ccc', margin: 0, lineHeight: 1.6 }}>
                      {tip.test}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Making the Most of Generated Names</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '12px' }}>
              🎯 Pro Tips for Domain Generation
            </h3>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Generate in batches:</strong> Create 20-30 names at once, then evaluate them together</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Try different styles:</strong> Generate tech names, then professional ones, then creative ones</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Use as inspiration:</strong> Modify generated names to create something even better</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Check social handles:</strong> Ensure the name works across Twitter, Instagram, etc.</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Get feedback:</strong> Share your top picks with friends or potential customers</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Act quickly:</strong> Good domain names get registered fast — don't wait too long</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'How does the random domain generator work?', a: 'Our generator uses curated word lists and intelligent algorithms to combine words, prefixes, and suffixes in ways that create brandable domain names. All generation happens in your browser using JavaScript.' },
          { q: 'Are the generated domains available?', a: 'The generator creates name suggestions — you\'ll need to check availability separately. Use our domain availability checker or click "Check availability" on any generated name.' },
          { q: 'Can I customize the generation style?', a: 'Yes! You can choose from tech/startup style, professional, creative/fun, or abstract. You can also set preferences for name length and industry focus.' },
          { q: 'What if I don\'t like any of the generated names?', a: 'Try different style settings, generate more batches, or use the names as inspiration to create your own variations. Sometimes the perfect name is a slight modification of a generated one.' },
          { q: 'Should I register multiple variations of my chosen name?', a: 'Consider registering the most important extensions (.com, .io, .co) and protecting against typos, but don\'t go overboard. Focus on building one strong brand first.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Ready to find your perfect domain?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
          Generate creative domain ideas, then check availability and register instantly.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/domain-availability" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Check Availability
          </a>
          <a href="/" style={{ display: 'inline-block', background: '#333', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Domain Search
          </a>
        </div>
      </section>
    </StaticPage>
  );
}