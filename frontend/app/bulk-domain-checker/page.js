import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import BulkDomainChecker from './BulkDomainChecker';

export const metadata = {
  title: 'Bulk Domain Checker — Check Multiple Domains Availability at Once | DomyDomains',
  description: 'Check availability of multiple domains at once. Bulk domain availability checker with export options. Save time checking domain lists in batch.',
  keywords: 'bulk domain checker, multiple domain check, domain availability batch, bulk domain search, check domain list, domain batch checker',
  alternates: { canonical: '/bulk-domain-checker' },
  openGraph: {
    title: 'Bulk Domain Checker — Check Multiple Domains Availability at Once',
    description: 'Check availability of multiple domains simultaneously. Bulk domain availability checker with export and filtering options.',
    url: 'https://domydomains.com/bulk-domain-checker',
  },
};

export default function BulkDomainCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema 
        name="Bulk Domain Checker" 
        description="Check availability of multiple domains at once. Bulk domain availability checker with export options for efficient domain research."
        url="/bulk-domain-checker" 
      />
      
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Bulk Domain Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Check the availability of multiple domains at once. Perfect for domain investors, agencies, 
        and businesses researching domain portfolios or backup options.
      </p>

      <BulkDomainChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Use Bulk Domain Checking</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Bulk domain checking saves time and improves domain research efficiency:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Time Efficiency:</strong> Check hundreds of domains in minutes instead of hours.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Portfolio Management:</strong> Monitor large domain portfolios for expiration and availability.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Competitor Research:</strong> Analyze competitor domain strategies and find opportunities.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Brand Protection:</strong> Secure multiple variations of your brand name across TLDs.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Investment Research:</strong> Identify valuable expired or expiring domains for acquisition.</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common Use Cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { 
              title: '🏢 Brand Protection', 
              desc: 'Check all variations and TLD versions of your brand name',
              examples: 'mycompany.com, mycompany.net, mycompany.io, my-company.com'
            },
            { 
              title: '💼 Domain Investment', 
              desc: 'Research expired domains and find valuable opportunities',
              examples: 'Short domains, keyword-rich names, brandable variations'
            },
            { 
              title: '🎯 Campaign Domains', 
              desc: 'Secure multiple domains for marketing campaigns',
              examples: 'Event domains, product launch URLs, regional variations'
            },
            { 
              title: '🔍 Competitor Analysis', 
              desc: 'Monitor competitor domain strategies and variations',
              examples: 'Similar names, typosquatting protection, market research'
            },
            { 
              title: '🌐 Multi-TLD Strategy', 
              desc: 'Check name availability across different extensions',
              examples: '.com, .io, .ai, .app variations of the same name'
            },
            { 
              title: '📊 Portfolio Audit', 
              desc: 'Audit existing domain portfolios for renewal priorities',
              examples: 'Expiration tracking, value assessment, drop monitoring'
            },
          ].map(useCase => (
            <div key={useCase.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: '#8b5cf6' }}>{useCase.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '12px' }}>{useCase.desc}</p>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Examples:</div>
                <div style={{ fontSize: '0.85rem', color: '#22c55e' }}>{useCase.examples}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Input Format Guide</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Our bulk checker supports various input formats for maximum flexibility:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#22c55e', marginBottom: '12px' }}>✅ Supported Formats</h3>
              <div style={{ fontSize: '0.9rem', color: '#ccc', fontFamily: 'monospace', lineHeight: 1.6 }}>
                example.com<br />
                https://example.com<br />
                www.example.com<br />
                example<br />
                example.io<br />
                subdomain.example.com
              </div>
            </div>
            
            <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b', marginBottom: '12px' }}>⚠️ Auto-Cleaned</h3>
              <div style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: 1.6 }}>
                • Protocols (http://, https://) are removed<br />
                • www. prefixes are stripped<br />
                • Trailing slashes are removed<br />
                • Whitespace is trimmed<br />
                • Duplicates are filtered out
              </div>
            </div>
          </div>
          
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e', marginTop: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '12px' }}>💡 Pro Tips</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#ccc' }}>
              <li style={{ marginBottom: '8px' }}>Paste one domain per line for best results</li>
              <li style={{ marginBottom: '8px' }}>Include full domains with extensions (.com, .io, etc.)</li>
              <li style={{ marginBottom: '8px' }}>Mix different TLDs to compare availability</li>
              <li style={{ marginBottom: '8px' }}>Use the export feature to save results for later analysis</li>
              <li style={{ marginBottom: '8px' }}>Filter results by availability status to focus on actionable domains</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding Domain Status</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Domain availability checking returns several possible statuses:</p>
          
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {[
              { 
                status: 'Available', 
                color: '#22c55e',
                icon: '✅',
                meaning: 'Domain is available for registration',
                action: 'Register immediately through a domain registrar'
              },
              { 
                status: 'Registered', 
                color: '#ef4444',
                icon: '❌', 
                meaning: 'Domain is currently owned and active',
                action: 'Consider alternatives or contact owner for acquisition'
              },
              { 
                status: 'Reserved', 
                color: '#f59e0b',
                icon: '🔒',
                meaning: 'Domain is reserved by registry (premium or restricted)',
                action: 'May be available at premium pricing or with restrictions'
              },
              { 
                status: 'Parked', 
                color: '#3b82f6',
                icon: '🅿️',
                meaning: 'Domain is registered but not actively used',
                action: 'Owner might be open to selling - research ownership'
              },
              { 
                status: 'Expired', 
                color: '#f59e0b',
                icon: '⏳',
                meaning: 'Domain has expired but may still be in grace/redemption period',
                action: 'Monitor for drop date or contact registrar for acquisition'
              }
            ].map(item => (
              <div key={item.status} style={{ 
                background: '#111', 
                padding: '16px 20px', 
                borderRadius: '8px', 
                border: `1px solid ${item.color}40`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px'
              }}>
                <div style={{ 
                  fontSize: '1.2rem',
                  minWidth: '24px',
                  marginTop: '2px'
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 600, 
                    color: item.color, 
                    marginBottom: '4px' 
                  }}>
                    {item.status}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '6px' }}>
                    {item.meaning}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>
                    <strong>Action:</strong> {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Domain Research Strategy</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '20px', marginBottom: '8px' }}>Building Your Domain List</h3>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '6px' }}>Start with your primary brand name across major TLDs (.com, .net, .org)</li>
            <li style={{ marginBottom: '6px' }}>Include common variations (plurals, hyphens, abbreviations)</li>
            <li style={{ marginBottom: '6px' }}>Add industry-specific TLDs (.tech, .ai, .io for tech companies)</li>
            <li style={{ marginBottom: '6px' }}>Consider geographical variations (.us, .uk, .ca for local presence)</li>
            <li style={{ marginBottom: '6px' }}>Include defensive registrations (common misspellings)</li>
          </ul>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '20px', marginBottom: '8px' }}>Prioritizing Results</h3>
          <div style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e', marginTop: '12px' }}>
            <ol style={{ paddingLeft: '20px', margin: 0, color: '#ccc' }}>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#22c55e' }}>High Priority:</strong> .com version of your main brand</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#f59e0b' }}>Medium Priority:</strong> Industry TLDs and major variations</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#8b5cf6' }}>Low Priority:</strong> Defensive registrations and creative variations</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#666' }}>Monitor Only:</strong> Expensive or restricted domains for future consideration</li>
            </ol>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { 
            q: 'How many domains can I check at once?', 
            a: 'Our bulk checker can handle up to 1000 domains per batch. For larger lists, break them into smaller chunks for optimal performance and accuracy.'
          },
          { 
            q: 'How accurate is bulk domain availability checking?', 
            a: 'We use the same real-time DNS queries as individual checks. Accuracy is very high, but for critical domains, we recommend double-checking individual results before registration.'
          },
          { 
            q: 'Can I check domains across different registrars?', 
            a: 'Domain availability is universal - if a domain is registered, it\'s unavailable regardless of registrar. Our tool checks global DNS records for the most accurate status.'
          },
          { 
            q: 'What export formats are supported?', 
            a: 'Results can be exported as CSV files with columns for domain name, availability status, and check timestamp. This format works with Excel, Google Sheets, and most analysis tools.'
          },
          { 
            q: 'Why might some domains show as "Unknown" status?', 
            a: 'This typically occurs with newly created TLDs, restricted domains, or temporary DNS issues. Try rechecking individual domains or contact the registry for clarification.'
          },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Ready to register your available domains?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Once you've found available domains, secure them quickly before someone else does.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Register domains →
          </a>
          <a href="/domain-value" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            Value estimator
          </a>
        </div>
      </section>
    </StaticPage>
  );
}