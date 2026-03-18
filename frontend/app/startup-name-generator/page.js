import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import StartupNameGenerator from './StartupNameGenerator';

export const metadata = {
  title: 'Startup Name Generator — Free Company Name Ideas for Founders | DomyDomains',
  description: 'Generate creative startup names for SaaS, fintech, AI, and more. Choose naming style (coined words, -ify/-ly, compound names), check .com availability instantly. 100% free.',
  keywords: 'startup name generator, company name generator, startup name ideas, SaaS name generator, tech company names, business name ideas, YC startup names, free startup naming tool',
  alternates: { canonical: '/startup-name-generator' },
  openGraph: {
    title: 'Startup Name Generator — Free Company Name Ideas for Founders',
    description: 'Generate creative startup names by category and naming style. Check .com domain availability instantly.',
    url: 'https://domydomains.com/startup-name-generator',
  },
};

export default function StartupNameGeneratorPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Startup Name Generator"
        description="Generate creative startup names for SaaS, fintech, AI, and more. Choose naming style, check .com availability instantly."
        url="/startup-name-generator"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Startup Name Generator
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Your startup name is the first thing investors, customers, and the world will remember about your company.
        Generate unique, fundable startup names tailored to your industry — from SaaS to AI to climate tech —
        then instantly check if the .com domain is available.
      </p>

      <StartupNameGenerator />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Startup Naming Styles Explained</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Coined Words', desc: 'Invented words that don\'t exist in the dictionary. Think Spotify, Klarna, Twilio. They\'re highly trademarkable and memorable because they have no prior associations.', icon: '🧪', examples: 'Spotify, Klarna, Zillow' },
            { title: 'Compound Names', desc: 'Two real words merged together to create new meaning. This style makes your product\'s value immediately clear while remaining distinctive and searchable.', icon: '🔗', examples: 'Salesforce, Airbnb, Facebook' },
            { title: '-ify / -ly / -io Suffixes', desc: 'Adding startup-friendly suffixes to meaningful root words. This naming convention has become synonymous with tech startups and immediately signals a modern, digital product.', icon: '✨', examples: 'Shopify, Grammarly, Figma' },
            { title: 'Short & Punchy', desc: 'Three-to-six letter names that are quick to say, easy to type, and impossible to forget. The gold standard for consumer-facing products and developer tools.', icon: '⚡', examples: 'Bolt, Stripe, Zoom' },
            { title: 'Metaphors', desc: 'Borrowing meaning from existing concepts — mountains suggest scale, phoenixes suggest rebirth. Metaphorical names create instant emotional connections without being literal.', icon: '🏔️', examples: 'Asana, Notion, Slack' },
            { title: 'Action Words', desc: 'Verbs that describe what your product does. Action names feel dynamic and make your value proposition part of the brand itself.', icon: '🚀', examples: 'Zoom, Snap, Canva' },
          ].map(item => (
            <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0, marginBottom: '8px' }}>{item.desc}</p>
              <p style={{ color: '#8b5cf6', fontSize: '0.8rem', margin: 0 }}>Examples: {item.examples}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Name Your Startup</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Naming a startup is both art and strategy. The best startup names are short enough to fit on a
            business card, distinctive enough to trademark, and clear enough that people understand what you
            do — or at least want to learn more. Unlike naming an established corporation, startup naming
            favors speed, memorability, and domain availability.
          </p>
          <p>
            <strong style={{ color: '#fff' }}>Start with your category.</strong> A fintech startup and a social
            app need fundamentally different naming energy. Financial products need names that convey trust and
            stability (Vault, Sterling, Apex), while social products benefit from warm, inviting names (Hive,
            Circle, Gather). Select your startup category first to ground the generator in the right vocabulary.
          </p>
          <p>
            <strong style={{ color: '#fff' }}>Choose a naming style that fits your brand.</strong> If you
            want to build a developer tool, short punchy names (Bolt, Vercel, Deno) signal that your product
            is fast and efficient. If you&apos;re building a SaaS platform, compound names (Salesforce, HubSpot,
            Basecamp) communicate breadth and reliability. Each naming style carries its own psychological
            weight.
          </p>
          <p>
            <strong style={{ color: '#fff' }}>Always check the .com.</strong> In 2026, your domain name still
            matters enormously. Investors Google you before taking the meeting. Customers type your name into
            their browser. If your .com is taken by a parked page or competitor, you&apos;re starting with a
            handicap. Our tool checks .com availability instantly using Google&apos;s public DNS API.
          </p>
          <p>
            <strong style={{ color: '#fff' }}>Validate before you commit.</strong> Once you have a shortlist,
            check the USPTO trademark database, search social media handles, and say the name out loud 50 times.
            Does it feel right? Can you picture it on a pitch deck? If yes, you&apos;ve found your name.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Naming Tips by Startup Category</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p><strong style={{ color: '#fff' }}>SaaS / Software:</strong> The best SaaS names are simple, scalable, and hint at what the platform does. Avoid overly literal names that limit pivots — Slack started as a gaming company. Favor coined words or compound names that feel professional yet modern.</p>
          <p><strong style={{ color: '#fff' }}>AI / Machine Learning:</strong> AI startups benefit from names that sound intelligent without being intimidating. Metaphorical names (Anthropic, Cohere, Perplexity) work well because they suggest depth without being overly technical. Avoid clichéd robot references.</p>
          <p><strong style={{ color: '#fff' }}>Fintech:</strong> Financial products need names that inspire trust above all else. Classical and strong names (Apex, Vault, Forge) outperform trendy ones. Your customers are trusting you with their money — the name should reflect that gravity.</p>
          <p><strong style={{ color: '#fff' }}>GreenTech / Climate:</strong> Climate startups can lean into nature-inspired metaphors (Terra, Leaf, Bloom) but should avoid sounding like another greenwashing campaign. The most effective climate startup names balance purpose with professionalism.</p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            { q: 'How is this different from a brand name generator?', a: 'Our startup name generator is specifically designed for tech startups and venture-backed companies. The naming styles (coined words, -ify/-ly suffixes, compound names) mirror patterns used by successful startups like Spotify, Shopify, and Salesforce.' },
            { q: 'Is this startup name generator free?', a: 'Yes, completely free with no limits. Generate as many startup names as you want, check .com domain availability, and save your favorites — no account required.' },
            { q: 'Can I trademark a generated name?', a: 'Generated names are algorithmically created and available for you to use. However, always check the USPTO trademark database (or your country\'s equivalent) before filing to ensure no conflicts exist with existing marks.' },
            { q: 'Why does .com availability matter for startups?', a: 'Investors and customers expect startups to own their .com domain. A matching .com signals professionalism and makes you easier to find. It\'s also critical for SEO and email credibility.' },
            { q: 'What makes a good startup name?', a: 'The best startup names are short (ideally under 8 characters), easy to spell and pronounce, unique enough to trademark, and available as a .com domain. They should also sound modern and be free of negative connotations in major languages.' },
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
