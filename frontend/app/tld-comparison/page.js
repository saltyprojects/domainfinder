import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import TldComparison from './TldComparison';

export const metadata = {
  title: 'TLD Comparison Tool — Compare .com, .io, .ai & 50+ Extensions | DomyDomains',
  description: 'Compare domain extensions side by side. See pricing, popularity, SEO impact, and best use cases for .com, .io, .ai, .dev, .co and more TLDs.',
  keywords: 'TLD comparison, domain extensions, .com vs .io, .ai domains, domain TLD guide, best domain extension, TLD pricing, domain extension SEO',
  alternates: { canonical: '/tld-comparison' },
  openGraph: {
    title: 'TLD Comparison Tool — Compare .com, .io, .ai & 50+ Extensions',
    description: 'Compare domain extensions side by side. See pricing, popularity, SEO impact, and best use cases for all major TLDs.',
    url: 'https://domydomains.com/tld-comparison',
  },
};

export default function TldComparisonPage() {
  return (
    <StaticPage>
      <ToolSchema 
        name="TLD Comparison Tool" 
        description="Compare domain extensions side by side. See pricing, popularity, SEO impact, and best use cases for .com, .io, .ai, .dev, .co and 50+ more TLDs."
        url="/tld-comparison" 
      />
      
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        TLD Comparison Tool
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Compare domain extensions side by side to make the best choice for your brand. 
        Analyze pricing, popularity, SEO impact, and industry fit across 50+ TLDs.
      </p>

      <TldComparison />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding Domain Extensions</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Your domain extension (TLD) significantly impacts your brand perception, SEO, and cost:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Brand Trust:</strong> .com still commands the most trust and recall globally.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Industry Signaling:</strong> .tech, .ai, .dev communicate your industry focus.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Geographic Targeting:</strong> Country TLDs help with local SEO and trust.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Cost Variation:</strong> Premium TLDs can cost 10x more than .com annually.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Availability:</strong> Newer TLDs offer more short name options.</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>TLD Categories Explained</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { 
              title: 'Generic TLDs (.com, .net, .org)', 
              desc: 'Original internet extensions with universal acceptance',
              best: 'Any business or personal use',
              examples: '.com, .net, .org, .info',
              trust: '95%'
            },
            { 
              title: 'Country Code (.us, .uk, .de)', 
              desc: 'National domains that boost local SEO and trust',
              best: 'Local businesses, government, country-specific services',
              examples: '.us, .uk, .de, .ca, .au',
              trust: '90%'
            },
            { 
              title: 'New Generic (.io, .ai, .app)', 
              desc: 'Modern extensions launched after 2012',
              best: 'Tech startups, specific industries, creative branding',
              examples: '.io, .ai, .app, .dev, .tech',
              trust: '75%'
            },
            { 
              title: 'Branded (.google, .apple)', 
              desc: 'Company-owned extensions for exclusive use',
              best: 'Large corporations with trademark control',
              examples: '.google, .apple, .amazon',
              trust: '85%'
            },
            { 
              title: 'Specialty (.museum, .edu)', 
              desc: 'Restricted domains for specific organizations',
              best: 'Educational institutions, museums, non-profits',
              examples: '.edu, .gov, .museum, .coop',
              trust: '90%'
            },
            { 
              title: 'Geographic (.nyc, .london)', 
              desc: 'City and region-specific domains',
              best: 'Local businesses, tourism, city services',
              examples: '.nyc, .london, .tokyo, .paris',
              trust: '70%'
            },
          ].map(category => (
            <div key={category.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: '#8b5cf6' }}>{category.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '12px' }}>{category.desc}</p>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Best for:</div>
                <div style={{ fontSize: '0.85rem', color: '#ccc' }}>{category.best}</div>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Examples:</div>
                <div style={{ fontSize: '0.85rem', color: '#22c55e' }}>{category.examples}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>User Trust:</div>
                <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600 }}>{category.trust}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>SEO Impact by TLD</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '20px', marginBottom: '8px' }}>Search Engine Treatment</h3>
          <p>Google officially treats all TLDs equally, but real-world factors create differences:</p>
          
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e', marginTop: '16px' }}>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { tld: '.com, .net, .org', impact: 'No penalty', detail: 'Standard treatment, highest user trust and click-through rates' },
                { tld: 'Country codes (.uk, .de)', impact: 'Local boost', detail: 'Better rankings in their country, may rank lower globally' },
                { tld: 'New gTLDs (.io, .ai)', impact: 'Equal treatment', detail: 'Same SEO power, but lower user trust may reduce CTR' },
                { tld: 'Spam-prone TLDs (.tk, .ml)', impact: 'Potential penalty', detail: 'Some are flagged more aggressively due to spam history' }
              ].map(seo => (
                <div key={seo.tld} style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontWeight: 600, color: '#22c55e', minWidth: '140px', fontSize: '0.9rem' }}>{seo.tld}:</span>
                  <span style={{ fontWeight: 600, color: '#f59e0b', minWidth: '100px', fontSize: '0.9rem' }}>{seo.impact}</span>
                  <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{seo.detail}</span>
                </div>
              ))}
            </div>
          </div>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '20px', marginBottom: '8px' }}>Click-Through Rate Impact</h3>
          <p>User behavior significantly affects SEO performance through CTR:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li style={{ marginBottom: '6px' }}>.com domains have ~15% higher CTR than new gTLDs</li>
            <li style={{ marginBottom: '6px' }}>Country codes perform well in their target regions</li>
            <li style={{ marginBottom: '6px' }}>Industry TLDs (.tech, .ai) work well for tech audiences</li>
            <li style={{ marginBottom: '6px' }}>Unknown or "spammy" TLDs see lower click-through rates</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Choosing the Right TLD</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>🎯 Business Goals</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}><strong>Global brand:</strong> .com first choice</li>
                <li style={{ marginBottom: '8px' }}><strong>Local business:</strong> Country code TLD</li>
                <li style={{ marginBottom: '8px' }}><strong>Tech startup:</strong> .io, .ai, .dev, .app</li>
                <li style={{ marginBottom: '8px' }}><strong>Non-profit:</strong> .org or country code</li>
                <li style={{ marginBottom: '8px' }}><strong>Portfolio/personal:</strong> .me, .name, or .com</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>💰 Budget Considerations</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}><strong>Budget-friendly:</strong> .com, .net, .org (~$12/year)</li>
                <li style={{ marginBottom: '8px' }}><strong>Mid-range:</strong> .io, .co (~$35-60/year)</li>
                <li style={{ marginBottom: '8px' }}><strong>Premium:</strong> .ai, .crypto (~$60-200/year)</li>
                <li style={{ marginBottom: '8px' }}><strong>Expensive:</strong> .app, .dev (~$20-50/year)</li>
                <li style={{ marginBottom: '8px' }}><strong>Variable:</strong> Country codes (wide range)</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>👥 Target Audience</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}><strong>General public:</strong> Stick with .com</li>
                <li style={{ marginBottom: '8px' }}><strong>Tech-savvy users:</strong> New gTLDs acceptable</li>
                <li style={{ marginBottom: '8px' }}><strong>Local customers:</strong> Country code builds trust</li>
                <li style={{ marginBottom: '8px' }}><strong>B2B/enterprise:</strong> .com preferred</li>
                <li style={{ marginBottom: '8px' }}><strong>Creative industries:</strong> Unique TLDs can work</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common TLD Mistakes</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            { 
              mistake: 'Choosing TLD for SEO keywords', 
              why: 'Keywords in TLD provide minimal SEO benefit and can look spammy',
              better: 'Focus on a memorable, brandable domain with any reputable TLD'
            },
            { 
              mistake: 'Picking the cheapest option', 
              why: 'Very cheap TLDs often have poor reputation and high renewal costs',
              better: 'Consider total cost of ownership including renewals and reputation'
            },
            { 
              mistake: 'Ignoring user expectations', 
              why: 'Users automatically add .com and may not find your site',
              better: 'If possible, also register the .com version to redirect'
            },
            { 
              mistake: 'Choosing based on trends', 
              why: 'Trendy TLDs may lose appeal over time',
              better: 'Pick TLDs that align with your long-term brand strategy'
            },
          ].map((mistake, i) => (
            <div key={i} style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ef4444', marginBottom: '8px' }}>
                ❌ {mistake.mistake}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '10px' }}>{mistake.why}</p>
              <p style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>
                ✅ {mistake.better}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { 
            q: 'Does the domain extension affect SEO rankings?', 
            a: 'Google treats all TLDs equally in their algorithm, but user behavior differences can indirectly affect SEO. .com domains typically have higher click-through rates, which can positively impact rankings over time.'
          },
          { 
            q: 'Should I buy multiple TLD versions of my domain?', 
            a: 'If budget allows and you\'re serious about your brand, yes. At minimum, secure the .com version. This prevents competitors from capitalizing on your brand and captures users who type .com by default.'
          },
          { 
            q: 'Are newer TLDs like .ai and .io worth the premium cost?', 
            a: 'For tech companies and startups, yes. They can enhance brand identity and signal industry focus. However, ensure your target audience understands and trusts the extension before committing.'
          },
          { 
            q: 'What\'s the difference between .com and .co?', 
            a: '.com is a generic TLD while .co is Colombia\'s country code that\'s marketed globally. .co is shorter to type but .com has universal recognition. .co renewal rates are typically higher than .com.'
          },
          { 
            q: 'Can I change my TLD later without hurting SEO?', 
            a: 'Yes, but it requires careful planning. You\'ll need proper 301 redirects, updating all links, and notifying search engines. Expect a temporary ranking dip during the transition period.'
          },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Ready to register your perfect domain?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Search for available domains across all major TLDs or explore premium options.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Search all TLDs →
          </a>
          <a href="/domain-extensions" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            Browse extensions
          </a>
        </div>
      </section>
    </StaticPage>
  );
}