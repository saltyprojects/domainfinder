import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import StartupNameGenerator from './StartupNameGenerator';

export const metadata = {
  title: 'Startup Name Generator — Create SaaS, AI & Fintech Company Names | DomyDomains',
  description: 'Generate brandable startup names for SaaS, AI, fintech & more. Check .com availability instantly. Free startup name generator with modern naming styles.',
  keywords: 'startup name generator, SaaS company names, fintech startup names, AI company names, business name generator, company name ideas, startup branding',
  alternates: { canonical: '/startup-name-generator' },
  openGraph: {
    title: 'Startup Name Generator — Create SaaS, AI & Fintech Company Names',
    description: 'Generate brandable startup names for any industry. Modern naming styles like coined words, compound names, and metaphors. Check .com availability.',
    url: 'https://domydomains.com/startup-name-generator',
  },
};

export default function StartupNameGeneratorPage() {
  return (
    <StaticPage>
      <ToolSchema 
        name="Startup Name Generator" 
        description="Generate brandable startup names for SaaS, AI, fintech and other industries. Check .com availability instantly with modern naming styles."
        url="/startup-name-generator" 
      />
      
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Startup Name Generator
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Generate brandable startup names perfect for SaaS, fintech, AI, and tech companies. 
        Create memorable names using modern naming conventions with instant .com availability checking.
      </p>

      <StartupNameGenerator />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Startup Names Matter</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Your startup name is your first impression and brand foundation:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Investor Appeal:</strong> VCs notice memorable, professional names that signal scale and ambition.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Domain Availability:</strong> Securing the .com is crucial for credibility and growth.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>User Trust:</strong> Modern, brandable names build immediate trust with early adopters.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Trademark Safety:</strong> Unique coined words are easier to trademark than generic terms.</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Startup Naming Strategies</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { 
              title: 'Coined Words', 
              desc: 'Invented names that sound familiar but are unique',
              examples: 'Spotify, Klarna, Figma, Canva',
              best: 'Perfect for global brands, easy to trademark'
            },
            { 
              title: 'Compound Names', 
              desc: 'Combine two meaningful words into one', 
              examples: 'Salesforce, Airbnb, LinkedIn, Facebook',
              best: 'Descriptive while remaining brandable'
            },
            { 
              title: 'Suffix Magic', 
              desc: 'Add -ify, -ly, -io to create modern sounds',
              examples: 'Shopify, Grammarly, Notion.so',
              best: 'Tech-savvy, scalable, venture-ready'
            },
            { 
              title: 'Short & Punchy', 
              desc: 'Brief, powerful names under 6 characters',
              examples: 'Bolt, Stripe, Zoom, Slack',
              best: 'Mobile-first, easy to remember and type'
            },
            { 
              title: 'Metaphors', 
              desc: 'Names that suggest strength, growth, or motion',
              examples: 'Asana, Notion, Atlas, Beacon',
              best: 'Emotional connection, vision-driven'
            },
            { 
              title: 'Action Words', 
              desc: 'Verbs that imply movement and results',
              examples: 'Zoom, Snap, Build, Launch',
              best: 'Clear value proposition, action-oriented'
            },
          ].map(strategy => (
            <div key={strategy.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: '#8b5cf6' }}>{strategy.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '12px' }}>{strategy.desc}</p>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Examples:</div>
                <div style={{ fontSize: '0.85rem', color: '#22c55e' }}>{strategy.examples}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Best for:</div>
                <div style={{ fontSize: '0.85rem', color: '#ccc' }}>{strategy.best}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Industry-Specific Naming Tips</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {[
              { industry: 'SaaS / Software', tips: 'Focus on workflow, productivity, and scale. Avoid overly technical terms.' },
              { industry: 'Fintech', tips: 'Convey trust, security, and innovation. Traditional finance meets modern tech.' },
              { industry: 'AI / ML', tips: 'Balance intelligence with approachability. Avoid cliché "neural" or "brain" terms.' },
              { industry: 'HealthTech', tips: 'Emphasize care, precision, and human connection. Stay professional but warm.' },
              { industry: 'DevTools', tips: 'Developer-friendly, technical accuracy, and efficiency. Can be more literal.' },
              { industry: 'Consumer Social', tips: 'Friendly, memorable, and easy to say. Think viral potential.' },
            ].map(tip => (
              <div key={tip.industry} style={{ background: '#111', padding: '16px', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#22c55e', marginBottom: '6px' }}>{tip.industry}</h4>
                <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.5, margin: 0 }}>{tip.tips}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Startup Name Checklist</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Before finalizing your startup name, verify these essentials:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>🌐 Domain & Digital</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '6px' }}>.com domain available</li>
                <li style={{ marginBottom: '6px' }}>Social media handles free</li>
                <li style={{ marginBottom: '6px' }}>Google search results clean</li>
                <li style={{ marginBottom: '6px' }}>App store name available</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>⚖️ Legal & Trademark</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '6px' }}>USPTO trademark search</li>
                <li style={{ marginBottom: '6px' }}>Business registration check</li>
                <li style={{ marginBottom: '6px' }}>Similar company names</li>
                <li style={{ marginBottom: '6px' }}>International trademark conflicts</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>👥 User Experience</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '6px' }}>Easy to pronounce</li>
                <li style={{ marginBottom: '6px' }}>Correct spelling intuitive</li>
                <li style={{ marginBottom: '6px' }}>Works globally (no offensive meanings)</li>
                <li style={{ marginBottom: '6px' }}>Sounds professional in meetings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { 
            q: 'How important is getting the .com domain for my startup?', 
            a: 'Critical for credibility. 99% of successful tech companies use .com. Users expect it, investors prefer it, and it prevents confusion. If .com isn\'t available, consider rebranding rather than settling for alternatives.' 
          },
          { 
            q: 'Should my startup name describe what we do?', 
            a: 'Not necessarily. The best startup names are brandable rather than descriptive. Google, Apple, and Amazon don\'t describe their products. Focus on memorability and availability over literal meaning.' 
          },
          { 
            q: 'How do I know if my startup name will scale globally?', 
            a: 'Test pronunciation with non-native English speakers, check for negative meanings in major languages, and ensure it works in key markets. Avoid slang, idioms, or culturally specific references.' 
          },
          { 
            q: 'What if my preferred name is trademarked?', 
            a: 'Do NOT use it. Trademark infringement can destroy startups. Always do a comprehensive USPTO search and consider hiring a trademark attorney for valuable names. Prevention is much cheaper than litigation.' 
          },
          { 
            q: 'Should I include keywords like "AI" or "Tech" in my startup name?', 
            a: 'Generally no. Keywords date your company and limit pivot options. "Uber" is better than "RideShareTech." Focus on brandable names that can evolve with your business.' 
          },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Ready to launch your startup?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Once you have the perfect name, search for premium domains or get a full domain analysis.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Search domains →
          </a>
          <a href="/domain-value" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            Domain valuation
          </a>
        </div>
      </section>
    </StaticPage>
  );
}