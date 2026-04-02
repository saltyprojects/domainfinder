import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainKeywordExtractor from './DomainKeywordExtractor';

export const metadata = {
  title: 'Domain Keyword Extractor — Extract Keywords from Domain Names | DomyDomains',
  description: 'Free domain keyword extractor tool. Break down any domain name into its component keywords, analyze word structure, identify brandable vs dictionary words, and export results as CSV.',
  keywords: 'domain keyword extractor, extract keywords from domain, domain name keywords, domain word splitter, domain name analyzer, domain name breakdown, domain SEO keywords, domain name parser',
  alternates: { canonical: '/domain-keywords' },
  openGraph: {
    title: 'Domain Keyword Extractor — Extract Keywords from Domain Names',
    description: 'Break down any domain name into keywords. Analyze word structure, identify brandable terms, and understand what makes a domain name tick.',
    url: 'https://domydomains.com/domain-keywords',
  },
};

export default function DomainKeywordsPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Keyword Extractor"
        description="Extract and analyze keywords from any domain name. Break down concatenated domains into component words, identify brandable vs dictionary terms, and export results."
        url="/domain-keywords"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Keyword Extractor
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Extract meaningful keywords from any domain name. Break down concatenated names into their component words,
        identify dictionary terms vs. brandable inventions, and understand the structure behind any domain — all processed
        instantly in your browser.
      </p>

      <DomainKeywordExtractor />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Extract Keywords from Domain Names?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          Every domain name tells a story through its keywords. Whether you&#39;re evaluating a domain for purchase,
          analyzing competitor URLs, or optimizing your own brand presence, understanding the keywords embedded in
          a domain name is essential. Our domain keyword extractor uses intelligent word segmentation to break down
          even the most tightly concatenated domain names — like &quot;techstartupfinder&quot; into &quot;tech,&quot;
          &quot;startup,&quot; and &quot;finder.&quot;
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          Domain keyword analysis is a key part of domain valuation. Domains built from high-value dictionary
          words — especially short, common keywords — tend to command higher prices and perform better in search
          results. Exact-match domains (EMDs) that contain a target keyword still carry SEO weight, and understanding
          which keywords are present helps you assess a domain&#39;s organic search potential.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How the Keyword Extractor Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🔤', title: 'Word Segmentation', desc: 'Our algorithm matches domain characters against a curated dictionary of 300+ common words used in domain names, splitting concatenated strings into meaningful keywords.' },
            { icon: '🏷️', title: 'Word Classification', desc: 'Each extracted segment is classified as a dictionary keyword, number, brand/unique term, or fragment — helping you understand the composition of any domain name.' },
            { icon: '📊', title: 'Visual Breakdown', desc: 'See how keywords stack up in a visual structure bar that shows the proportional length of each word in the domain name. Great for comparing domain compositions.' },
            { icon: '📋', title: 'Bulk Analysis & CSV Export', desc: 'Analyze up to 50 domains at once and export the results as a CSV file. Perfect for domain portfolio analysis, competitor research, or due diligence on bulk purchases.' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Use Cases for Domain Keyword Analysis</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Domain Investors:</strong> Quickly scan domain portfolios to identify which names contain
          high-value keywords. Domains with popular search terms embedded in them — like &quot;insurance,&quot; &quot;finance,&quot; or
          &quot;cloud&quot; — tend to have higher resale value.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>SEO Professionals:</strong> Analyze competitor domains to understand their keyword targeting
          strategy. Identify exact-match and partial-match domains in your niche. Understanding the keyword composition of
          ranking domains can inform your own domain acquisition strategy.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Brand Builders:</strong> Determine whether a domain reads as a dictionary-word combination
          or a unique brandable name. The tool classifies unknown segments as &quot;brand/unique&quot; terms, helping you
          distinguish between keyword-rich domains and invented brand names like &quot;Spotify&quot; or &quot;Zillow.&quot;
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { q: 'Can this tool extract keywords from any domain?', a: 'Yes — the tool works with any domain name regardless of TLD. It strips the extension and analyzes the second-level domain for keyword content. It handles hyphens, numbers, underscores, and concatenated words.' },
            { q: 'How accurate is the word segmentation?', a: 'Our dictionary covers 300+ common domain keywords across tech, business, marketing, and general categories. For domains built from standard English words, accuracy is very high. Invented brand names are correctly flagged as unique terms.' },
            { q: 'Is this free to use?', a: 'Completely free with no limits. All processing happens in your browser — no data is sent to any server. You can analyze up to 50 domains per batch and export results as CSV.' },
          ].map(item => (
            <div key={item.q} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>{item.q}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
