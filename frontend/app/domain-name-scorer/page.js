import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainNameScorer from './DomainNameScorer';

export const metadata = {
  title: 'Domain Name Scorer — Rate & Analyze Any Domain Name | DomyDomains',
  description: 'Free domain name scoring tool. Rate any domain on brandability, memorability, pronounceability, length, TLD quality, and typability. Get an instant domain quality grade.',
  keywords: 'domain name scorer, domain name rating, domain name quality checker, domain score, domain name analyzer, rate domain name, domain brandability checker, domain name evaluation',
  alternates: { canonical: '/domain-name-scorer' },
  openGraph: {
    title: 'Domain Name Scorer — Rate & Analyze Any Domain Name',
    description: 'Score any domain name on brandability, memorability, pronounceability, and more. Get an instant quality grade from A+ to F.',
    url: 'https://domydomains.com/domain-name-scorer',
  },
};

export default function DomainNameScorerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Name Scorer"
        description="Rate and analyze any domain name on brandability, memorability, pronounceability, length, TLD quality, and typability."
        url="/domain-name-scorer"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Name Scorer
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Rate any domain name instantly. Get a comprehensive quality score based on brandability, memorability, 
        pronounceability, length, TLD quality, and typability — all analyzed right in your browser.
      </p>

      <DomainNameScorer />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How We Score Domain Names</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          Our domain name scorer evaluates six key factors that determine how effective a domain name will be 
          for building a brand, driving traffic, and creating lasting recognition. Each factor is scored from 
          0 to 100 and weighted based on its real-world importance. The result is an overall score and letter 
          grade that gives you an instant read on domain quality.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Brandability (22%)', desc: 'Can you build a brand around this name? Short, unique, pronounceable names with no numbers or hyphens score highest. Think Stripe, Notion, or Figma — names that feel like they could be a company.', icon: '💎' },
            { title: 'Length (20%)', desc: 'Shorter domains are more valuable. Ultra-short names (4 characters or fewer) score 100, while domains over 16 characters score poorly. The sweet spot is 4-8 characters for maximum impact.', icon: '📏' },
            { title: 'Pronounceability (18%)', desc: 'Can someone say this domain out loud? We analyze vowel-consonant patterns, consecutive consonant clusters, and whether the name follows natural syllable structures found in spoken language.', icon: '🗣️' },
            { title: 'Memorability (18%)', desc: 'Will people remember your domain after hearing it once? Short, pronounceable names without numbers or hyphens are the most memorable. Long or complex strings are quickly forgotten.', icon: '🧠' },
            { title: 'TLD Quality (12%)', desc: '.com remains king for credibility and SEO. Extensions like .ai and .io score well for tech brands. Obscure TLDs can hurt trust and make your domain harder to share verbally.', icon: '🌐' },
            { title: 'Typability (10%)', desc: 'How easy is the domain to type on a keyboard? Hyphens, numbers, uncommon letters (q, z, x), double letters, and excessive length all increase typing errors and reduce usability.', icon: '⌨️' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Makes a Great Domain Name?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          The best domain names share common traits that make them effective for both branding and marketing. 
          Whether you&apos;re launching a startup, building a personal brand, or investing in domains, understanding 
          these principles helps you choose names that perform well across every channel — from word-of-mouth 
          to search engines to podcast ads.
        </p>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { trait: 'Short & Concise', example: 'stripe.com, arc.dev', desc: 'Under 8 characters is ideal. Every extra character increases typing errors and reduces recall.' },
            { trait: 'Easy to Spell', example: 'notion.com, linear.app', desc: 'If you say the domain out loud, people should be able to type it correctly on the first try.' },
            { trait: 'No Hyphens or Numbers', example: 'figma.com, vercel.com', desc: 'Hyphens and numbers look unprofessional and are nearly impossible to communicate verbally.' },
            { trait: 'Memorable', example: 'spotify.com, canva.com', desc: 'The name should stick after one hearing. Unusual but pronounceable combinations work well.' },
            { trait: 'Strong TLD', example: '.com, .ai, .io', desc: '.com gives maximum credibility. .ai and .io work well for tech companies. Avoid obscure TLDs.' },
          ].map(item => (
            <div key={item.trait} style={{ background: '#111', borderRadius: '8px', padding: '16px', border: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '4px' }}>{item.trait}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#ccc', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
                <div style={{ minWidth: '150px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>Examples:</div>
                  <div style={{ fontSize: '0.85rem', color: '#999', fontFamily: 'ui-monospace, monospace' }}>{item.example}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Domain Name Grading Scale</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          Your domain receives a letter grade from A+ to F based on the weighted overall score. Here&apos;s what 
          each grade means for your domain&apos;s potential:
        </p>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            { grade: 'A+ (90-100)', desc: 'Exceptional domain. Short, brandable, memorable, and on a premium TLD. These domains are rare and often sell for thousands.', color: '#4ade80' },
            { grade: 'A (80-89)', desc: 'Excellent domain. Strong in most categories with no major weaknesses. Great for building a serious brand.', color: '#4ade80' },
            { grade: 'B (70-79)', desc: 'Good domain. Solid overall with minor areas for improvement. Works well for most business purposes.', color: '#a3e635' },
            { grade: 'C (60-69)', desc: 'Average domain. Functional but has noticeable weaknesses. Consider improvements or alternatives.', color: '#fbbf24' },
            { grade: 'D (50-59)', desc: 'Below average. Multiple issues with length, pronounceability, or branding. Not ideal for a primary brand.', color: '#f97316' },
            { grade: 'F (Below 50)', desc: 'Poor domain choice. Significant problems across multiple factors. Strongly recommend finding an alternative.', color: '#ef4444' },
          ].map(item => (
            <div key={item.grade} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px 16px', background: '#111', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
              <span style={{ fontWeight: 700, color: item.color, fontSize: '0.95rem', minWidth: '80px', fontFamily: 'ui-monospace, monospace' }}>{item.grade}</span>
              <span style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.6 }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { q: 'How accurate is the domain name score?', a: 'Our scorer uses algorithmic analysis based on established branding and linguistic principles. It evaluates objective factors like length, character composition, and TLD quality. While no automated tool can fully capture subjective brand appeal, our scores align well with domain industry valuations and branding best practices.' },
            { q: 'Does a low score mean the domain is bad?', a: 'Not necessarily. Some successful brands have domain names that would score lower on automated tests (think "flickr.com" dropping a vowel). The score is a guideline — use it alongside your own judgment about brand fit and audience expectations.' },
            { q: 'Why does .com score highest for TLD?', a: '.com remains the most trusted and widely recognized TLD. Users instinctively type .com, and it carries inherent credibility. While .ai and .io are excellent for tech brands, .com is still the safest bet for broad consumer trust.' },
            { q: 'Can I compare multiple domains?', a: 'Yes! Simply score each domain one at a time and compare the results. Look at both the overall score and individual category scores to understand each domain\'s strengths and weaknesses.' },
          ].map((faq, i) => (
            <div key={i} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: '#e5e5e5' }}>{faq.q}</h3>
              <p style={{ color: '#999', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
