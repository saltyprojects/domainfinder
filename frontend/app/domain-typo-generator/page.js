import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainTypoGenerator from './DomainTypoGenerator';

export const metadata = {
  title: 'Domain Typo Generator — Find Typosquatting Domains & Protect Your Brand | DomyDomains',
  description: 'Generate domain name typos to find typosquatting threats. Free domain typo generator detects missing characters, fat-finger errors, homoglyphs, vowel swaps, wrong TLDs, and more.',
  keywords: 'domain typo generator, typosquatting checker, domain name typos, typo domain finder, brand protection domains, domain squatting checker, doppelganger domains, homoglyph domains',
  alternates: { canonical: '/domain-typo-generator' },
  openGraph: {
    title: 'Domain Typo Generator — Find Typosquatting & Lookalike Domains',
    description: 'Generate hundreds of typo domain variations to protect your brand from typosquatting. Free browser-based tool with CSV export.',
    url: 'https://domydomains.com/domain-typo-generator',
  },
};

export default function DomainTypoGeneratorPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Typo Generator"
        description="Generate domain name typo variations to detect typosquatting threats. Finds missing characters, key swaps, homoglyphs, wrong TLDs, and more."
        url="/domain-typo-generator"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Typo Generator
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Enter any domain name to generate hundreds of typo variations — misspellings, fat-finger errors, 
        homoglyphs, and lookalike domains. Protect your brand from typosquatting attacks.
      </p>

      <DomainTypoGenerator />

      <section style={{ marginTop: '48px', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is Typosquatting?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Typosquatting — also called URL hijacking or domain mimicry — is when someone registers a domain name 
            that is a common misspelling or visual lookalike of a legitimate brand. When users accidentally type 
            the wrong URL or click a deceptive link, they land on the typosquatter's site instead of the real one.
          </p>
          <p style={{ marginTop: '16px' }}>
            Typosquatting domains are used for phishing attacks, ad revenue from misdirected traffic, selling 
            counterfeit goods, distributing malware, or simply holding domains for ransom. Major brands like 
            Google, Amazon, and Facebook have thousands of typosquatting variants registered against them.
          </p>
          <p style={{ marginTop: '16px' }}>
            This tool helps you proactively identify potential typosquatting domains so you can register defensive 
            domains, monitor for abuse, or take action against infringers through UDRP proceedings.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Types of Typos Generated</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { icon: '⌫', title: 'Missing Character', desc: 'Omitting one letter at a time — "gogle.com" instead of "google.com". The most common typing mistake people make.', color: '#ef4444' },
            { icon: '🔀', title: 'Swapped Characters', desc: 'Adjacent letters reversed — "gogole.com" instead of "google.com". Happens when typing too fast.', color: '#f59e0b' },
            { icon: '⌨️', title: 'Wrong Key (Fat-Finger)', desc: 'Hitting a neighboring key — "googke.com" instead of "google.com". Based on QWERTY keyboard layout.', color: '#f97316' },
            { icon: '🔤', title: 'Doubled Letter', desc: 'Accidentally pressing a key twice — "gooogle.com". Common on mobile keyboards with predictive text.', color: '#eab308' },
            { icon: '👁️', title: 'Homoglyph Substitution', desc: 'Visually similar characters — "g00gle.com" using zeros, or "paypa1.com" using the number 1. Hard to spot.', color: '#ec4899' },
            { icon: '🅰️', title: 'Vowel Swap', desc: 'Swapping one vowel for another — "goagle.com" or "guugle.com". Exploits spelling uncertainty.', color: '#06b6d4' },
            { icon: '🌐', title: 'Wrong TLD', desc: 'Using a different extension — "google.net" or "google.co" instead of "google.com". Very common mistake.', color: '#8b5cf6' },
            { icon: '➖', title: 'Hyphen Variations', desc: 'Adding or removing hyphens — "goo-gle.com" or removing existing hyphens. Changes the domain subtly.', color: '#6366f1' },
          ].map(item => (
            <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: item.color, margin: 0 }}>{item.title}</h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Protect Your Brand from Typosquatting</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { step: '1', title: 'Register Defensive Domains', desc: 'Use this tool to identify the most likely typos of your brand domain, then register the highest-risk variants before squatters do. Focus on single-character omissions and common TLD alternatives.' },
              { step: '2', title: 'Monitor for New Registrations', desc: 'Set up domain monitoring alerts through services like DomainTools or SecurityTrails to get notified when new domains similar to yours are registered.' },
              { step: '3', title: 'Implement DMARC for Email', desc: 'Typosquatters often use lookalike domains for phishing emails. DMARC, SPF, and DKIM authentication helps receiving mail servers identify and block spoofed emails from typosquatting domains.' },
              { step: '4', title: 'File UDRP Complaints', desc: 'If someone has registered a typo of your trademarked domain and is using it in bad faith, you can file a Uniform Domain-Name Dispute-Resolution Policy (UDRP) complaint through ICANN-accredited providers like WIPO.' },
              { step: '5', title: 'Use SSL Certificate Transparency', desc: 'Monitor Certificate Transparency logs for SSL certificates issued to domains similar to yours. This can reveal typosquatting domains being set up for phishing before they become active.' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: '16px', background: '#111', borderRadius: '10px', padding: '16px', border: '1px solid #1e1e1e' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: '#8b5cf620',
                  color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                }}>{item.step}</div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'What is a domain typo generator used for?', a: 'A domain typo generator creates variations of a domain name based on common typing mistakes, visual similarities, and keyboard layout errors. Security professionals use it to identify potential typosquatting threats. Brand owners use it to find defensive domains to register. Penetration testers use it to assess phishing risks.' },
          { q: 'How many typo variations are generated?', a: 'For a typical domain name, this tool generates between 200 and 1,000+ variations depending on the domain length and character composition. Longer domains produce more variations. The tool covers 11 different typo categories including missing characters, wrong keys, homoglyphs, and TLD substitutions.' },
          { q: 'Is this tool free?', a: 'Yes, completely free with no limits. The tool runs entirely in your browser — no data is sent to any server. You can export results to CSV for further analysis.' },
          { q: 'Can I check if the typo domains are registered?', a: 'This tool generates the typo variations. To check if they\'re registered, you can export the list as CSV and use our Bulk Domain Checker tool to look up availability, or check individual domains with the Domain Availability Checker.' },
          { q: 'What are homoglyph attacks?', a: 'Homoglyph attacks use characters that look visually identical or very similar — like replacing the letter "l" with the number "1", or "o" with "0". In certain fonts, these substitutions are nearly impossible to spot, making them especially dangerous for phishing.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>More Domain Tools</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Check domain availability, DNS records, SSL certificates, and more — all free.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/bulk-domain-checker" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Bulk Domain Checker →
          </a>
          <a href="/domain-availability" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            Availability Checker
          </a>
          <a href="/tools" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            All Tools
          </a>
        </div>
      </section>
    </StaticPage>
  );
}
