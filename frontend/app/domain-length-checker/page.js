import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainLengthChecker from './DomainLengthChecker';

export const metadata = {
  title: 'Domain Length Checker — Analyze Character Count, SEO & Branding Impact | DomyDomains',
  description: 'Check domain name length for SEO, memorability and branding. Analyze character count, typeability, and compare with famous domains. Free domain length analysis.',
  keywords: 'domain length checker, domain name length, SEO domain length, brandable domain length, character count, domain analysis, memorable domains',
  alternates: { canonical: '/domain-length-checker' },
  openGraph: {
    title: 'Domain Length Checker — Analyze Character Count, SEO & Branding Impact',
    description: 'Analyze domain name length for optimal branding, SEO, and memorability. Check character count and get expert recommendations.',
    url: 'https://domydomains.com/domain-length-checker',
  },
};

export default function DomainLengthCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema 
        name="Domain Length Checker" 
        description="Analyze domain name length for SEO, memorability and branding impact. Check character count, typeability, and compare with famous domains."
        url="/domain-length-checker" 
      />
      
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Length Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Analyze your domain name length for optimal branding, SEO, and memorability. 
        Get detailed character analysis and compare with successful domains.
      </p>

      <DomainLengthChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Domain Length Matters</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Domain length significantly impacts your brand's success:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Memorability:</strong> Shorter domains are easier to remember and recall.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Typeability:</strong> Less typing means fewer errors and faster access.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Mobile-Friendly:</strong> Critical for mobile users with small keyboards.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Word of Mouth:</strong> Shorter domains spread more easily in conversations.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Branding:</strong> Fits better on business cards, ads, and merchandise.</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Domain Length Guidelines</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { 
              range: '1-6 Characters', 
              rating: 'Excellent',
              color: '#22c55e',
              examples: 'Go.com, FB.com, X.com, Zoom.com',
              notes: 'Premium length. Extremely memorable, easy to type, perfect for mobile. Most valuable.'
            },
            { 
              range: '7-10 Characters', 
              rating: 'Very Good',
              color: '#22c55e', 
              examples: 'Google.com, Apple.com, Nike.com',
              notes: 'Excellent balance of brevity and brandability. Still very memorable and mobile-friendly.'
            },
            { 
              range: '11-15 Characters', 
              rating: 'Good',
              color: '#f59e0b',
              examples: 'Microsoft.com, Facebook.com',
              notes: 'Acceptable for established brands. Can work if the name is highly brandable.'
            },
            { 
              range: '16-20 Characters', 
              rating: 'Acceptable',
              color: '#f59e0b',
              examples: 'Stackoverflow.com',
              notes: 'Getting long. Only works with exceptional branding or specific industry needs.'
            },
            { 
              range: '21+ Characters', 
              rating: 'Too Long',
              color: '#ef4444',
              examples: 'Usually keyword-stuffed domains',
              notes: 'Avoid. Difficult to remember, type, and brand. Poor user experience.'
            }
          ].map(guideline => (
            <div key={guideline.range} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>{guideline.range}</h3>
                <span style={{ 
                  background: `${guideline.color}20`, 
                  color: guideline.color, 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  border: `1px solid ${guideline.color}40`
                }}>
                  {guideline.rating}
                </span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '12px' }}>{guideline.notes}</p>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                <strong>Examples:</strong> {guideline.examples}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Famous Domain Lengths</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Learn from the most successful brands and their domain lengths:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#22c55e', marginBottom: '12px' }}>Tech Giants (4-9 chars)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Meta.com', length: '4', note: 'Rebranded from Facebook' },
                  { name: 'X.com', length: '1', note: 'Ultimate in brevity' },
                  { name: 'Apple.com', length: '5', note: 'Perfect brandable length' },
                  { name: 'Google.com', length: '6', note: 'Memorable made-up word' },
                  { name: 'Amazon.com', length: '6', note: 'Strong metaphor' }
                ].map(domain => (
                  <div key={domain.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{domain.name}</span>
                    <span style={{ color: '#22c55e', fontSize: '0.8rem' }}>{domain.length} chars</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b', marginBottom: '12px' }}>Successful Longer Names (10-15 chars)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Microsoft.com', length: '9', note: 'Compound word' },
                  { name: 'Instagram.com', length: '9', note: 'Instant + telegram' },
                  { name: 'Salesforce.com', length: '10', note: 'Descriptive compound' },
                  { name: 'Shopify.com', length: '7', note: 'Shop + -ify suffix' },
                  { name: 'LinkedIn.com', length: '8', note: 'Link + -ed suffix' }
                ].map(domain => (
                  <div key={domain.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{domain.name}</span>
                    <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>{domain.length} chars</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Mobile & Typing Considerations</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Modern domain considerations for mobile-first world:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {[
              {
                title: '📱 Mobile Keyboards',
                tips: 'Shorter domains reduce mobile typing errors. Users make 2.3x more errors on domains over 12 characters on mobile.'
              },
              {
                title: '🗣️ Voice Search',
                tips: 'Short, phonetically clear domains work better with Siri, Alexa, and Google Assistant. Avoid complex spelling.'
              },
              {
                title: '💬 Social Sharing',
                tips: 'Shorter domains leave more room for content in social media posts with character limits (Twitter, SMS).'
              },
              {
                title: '🎯 Brand Recall',
                tips: 'Users remember 90% of domains under 8 characters vs. 60% of domains over 15 characters in usability studies.'
              }
            ].map(consideration => (
              <div key={consideration.title} style={{ background: '#111', padding: '16px', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '8px' }}>{consideration.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.5, margin: 0 }}>{consideration.tips}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>SEO & Domain Length</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '20px', marginBottom: '8px' }}>Search Engine Guidelines</h3>
          <p>Google and other search engines prefer user-friendly domains:</p>
          
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e', marginTop: '16px' }}>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { factor: 'User Experience', detail: 'Short domains improve click-through rates in search results' },
                { factor: 'Brandability', detail: 'Search engines favor brandable over keyword-stuffed domains' },
                { factor: 'Direct Navigation', detail: 'Users are more likely to type short domains directly' },
                { factor: 'Link Building', detail: 'Other sites prefer linking to memorable, short domains' }
              ].map(factor => (
                <div key={factor.factor} style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontWeight: 600, color: '#22c55e', minWidth: '120px', fontSize: '0.9rem' }}>{factor.factor}:</span>
                  <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{factor.detail}</span>
                </div>
              ))}
            </div>
          </div>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '20px', marginBottom: '8px' }}>Length vs. Keywords</h3>
          <p>While keywords in domains have minimal SEO value in 2024, shorter branded domains often perform better because they:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li style={{ marginBottom: '6px' }}>Generate more direct traffic</li>
            <li style={{ marginBottom: '6px' }}>Have higher brand search volume</li>
            <li style={{ marginBottom: '6px' }}>Earn more natural backlinks</li>
            <li style={{ marginBottom: '6px' }}>Create stronger brand signals</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { 
            q: 'What\'s the ideal domain length for a new business?', 
            a: '6-10 characters is the sweet spot for most businesses. It\'s short enough to be memorable and easy to type, but long enough to create a brandable name. Companies like Google (6), Stripe (6), and Notion (6) exemplify this range.' 
          },
          { 
            q: 'Are 3-letter domains worth the premium price?', 
            a: 'For the right business, yes. Three-letter domains (like AWS.com or BMW.com) are extremely valuable for large brands due to their memorability and typing ease. However, they often cost $100K+ and may not suit all business types.' 
          },
          { 
            q: 'Should I use hyphens to make my domain shorter?', 
            a: 'Generally no. Hyphens make domains harder to communicate verbally ("dash" or "hyphen") and users often forget them. A slightly longer domain without hyphens is usually better than a shorter hyphenated one.' 
          },
          { 
            q: 'How does domain length affect email addresses?', 
            a: 'Shorter domains create cleaner email addresses. Compare john@verylongcompanyname.com vs john@acme.com. Shorter email addresses look more professional and are easier to share on business cards.' 
          },
          { 
            q: 'Do longer domains hurt mobile SEO?', 
            a: 'Not directly, but they can hurt user experience on mobile devices. Users are more likely to mistype longer domains on mobile keyboards, leading to higher bounce rates and lost traffic.' 
          },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Need help choosing the perfect domain length?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Find available short domains or get professional domain advice for your brand.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Search short domains →
          </a>
          <a href="/premium-domains" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            Premium domains
          </a>
        </div>
      </section>
    </StaticPage>
  );
}