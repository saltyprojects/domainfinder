import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import BrandNameGenerator from './BrandNameGenerator';

export const metadata = {
  title: 'Brand Name Generator — Free Business Name Ideas | DomyDomains',
  description: 'Generate unique, memorable brand names for your business, startup, or product. Choose industry and style, check .com availability instantly. 100% free.',
  keywords: 'brand name generator, business name generator, company name ideas, startup name generator, brand name ideas, free name generator, business naming tool',
  alternates: { canonical: '/brand-name-generator' },
  openGraph: {
    title: 'Brand Name Generator — Free Business Name Ideas',
    description: 'Generate creative, brandable business names instantly. Pick your industry and style, then check domain availability.',
    url: 'https://domydomains.com/brand-name-generator',
  },
};

export default function BrandNameGeneratorPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Brand Name Generator"
        description="Generate unique, memorable brand names for your business, startup, or product. Choose industry and style, check .com availability instantly."
        url="/brand-name-generator"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Brand Name Generator
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Finding the perfect brand name is one of the most important decisions for any business. Use our free
        generator to create unique, memorable names tailored to your industry and style — then check if the
        .com domain is available instantly.
      </p>

      <BrandNameGenerator />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Makes a Great Brand Name?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Memorable', desc: 'The best brand names stick in your mind after hearing them once. Short, rhythmic names with clear sounds are easiest to remember.', icon: '🧠' },
            { title: 'Easy to Spell', desc: 'If customers can\'t spell your brand, they can\'t find you online. Avoid unusual spellings that create confusion.', icon: '✏️' },
            { title: 'Unique', desc: 'Stand out from competitors with a distinctive name. Check trademark databases to avoid legal conflicts.', icon: '⭐' },
            { title: 'Scalable', desc: 'Choose a name that won\'t limit your growth. Avoid being too specific about one product or location.', icon: '📈' },
            { title: 'Domain Available', desc: 'In today\'s digital world, your brand name needs a matching .com domain. Check availability before committing.', icon: '🌐' },
            { title: 'Emotionally Resonant', desc: 'Great names evoke feelings. Think about the emotions you want customers to associate with your brand.', icon: '💜' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Use This Brand Name Generator</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p><strong style={{ color: '#fff' }}>Step 1: Choose Your Industry</strong> — Select the industry closest to your business. This determines the vocabulary and tone of generated names. A tech startup needs different naming conventions than a luxury fashion brand.</p>
          <p><strong style={{ color: '#fff' }}>Step 2: Pick a Style</strong> — Your brand&apos;s personality matters. Modern and minimal works for SaaS products, while playful and fun suits consumer apps. Luxurious styling fits premium products and services.</p>
          <p><strong style={{ color: '#fff' }}>Step 3: Add a Keyword (Optional)</strong> — If you have a core concept in mind, enter it as a keyword. The generator will incorporate it into name combinations, blending your idea with creative variations.</p>
          <p><strong style={{ color: '#fff' }}>Step 4: Generate &amp; Explore</strong> — Hit generate to see 24 unique name ideas. Favorite the ones you love, check .com domain availability, and copy names to your shortlist. Generate multiple times for fresh batches.</p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Brand Naming Tips by Industry</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p><strong style={{ color: '#fff' }}>Technology:</strong> Tech brands often use short, coined words (Stripe, Slack, Figma). These names are easy to trademark and feel innovative. Consider combining syllables from words that describe your product&apos;s benefit.</p>
          <p><strong style={{ color: '#fff' }}>Health &amp; Wellness:</strong> This space favors names that evoke vitality, nature, and trust. Words rooted in Latin or Greek (Vita, Bio) signal credibility while feeling approachable.</p>
          <p><strong style={{ color: '#fff' }}>Finance:</strong> Financial brands need names that project stability and authority. Strong, grounded words like Summit, Apex, and Sterling inspire confidence.</p>
          <p><strong style={{ color: '#fff' }}>E-Commerce:</strong> Online retail brands benefit from names that suggest speed, convenience, and excitement. Action words like Flash, Snap, and Swift create urgency.</p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            { q: 'Is this brand name generator really free?', a: 'Yes, 100% free with no limits. Generate as many names as you want, check domain availability, and save your favorites — all without signing up or paying.' },
            { q: 'Can I use these names for my business?', a: 'Yes! Names generated here are created algorithmically and you\'re free to use them. However, we recommend checking trademark databases (like USPTO) before registering a business name to avoid conflicts.' },
            { q: 'How does the domain availability check work?', a: 'We use Google\'s public DNS API to check if a .com domain resolves. If it doesn\'t (NXDOMAIN), the domain is likely available. For 100% certainty, verify with a domain registrar.' },
            { q: 'Why should my brand name match my domain?', a: 'Brand-domain consistency builds trust and makes you easier to find online. When your brand name IS your domain, customers can find your website intuitively.' },
          ].map(item => (
            <div key={item.q} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>{item.q}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
