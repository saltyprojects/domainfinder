import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainExpirationChecker from './DomainExpirationChecker';

export const metadata = {
  title: 'Domain Expiration Checker — Check When Domains Expire | DomyDomains',
  description: 'Check domain expiration dates instantly. See when any domain expires, days until expiration, and monitor valuable domains for potential availability.',
  keywords: 'domain expiration checker, domain expiry date, when does domain expire, domain monitoring, expired domains, domain expiration lookup',
  alternates: { canonical: '/domain-expiration' },
  openGraph: {
    title: 'Domain Expiration Checker — Check When Domains Expire',
    description: 'Find out when any domain expires and how many days are left. Perfect for domain monitoring and expired domain hunting.',
    url: 'https://domydomains.com/domain-expiration',
  },
};

export default function DomainExpirationPage() {
  return (
    <StaticPage>
      <ToolSchema 
        name="Domain Expiration Checker" 
        description="Check domain expiration dates instantly. See when any domain expires and days until expiration."
        url="/domain-expiration" 
      />
      
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Expiration Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Check when any domain expires and how many days are left until expiration. Perfect for monitoring 
        competitor domains, tracking renewals, and finding soon-to-expire domains.
      </p>

      <DomainExpirationChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Check Domain Expiration?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Monitor Valuable Domains', desc: 'Track when desirable domains might become available if owners forget to renew.', icon: '👁️' },
            { title: 'Avoid Losing Your Domains', desc: 'Keep track of your own domain renewal dates to prevent accidental expiration.', icon: '🔒' },
            { title: 'Research Competitors', desc: 'See when competitor domains expire to understand their domain strategy.', icon: '🔍' },
            { title: 'Domain Investment', desc: 'Find potentially valuable domains that might not be renewed by current owners.', icon: '💰' },
            { title: 'Plan Purchases', desc: 'Set alerts for domains you want if they become available after expiration.', icon: '📅' },
            { title: 'Due Diligence', desc: 'Check expiration dates before buying premium domains to ensure they\'re not about to expire.', icon: '📊' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding Domain Expiration Process</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>When a domain expires, it doesn't immediately become available. Here's the typical process:</p>
          
          <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
            {[
              { 
                stage: 'Grace Period (0-45 days)', 
                desc: 'Domain expires but owner can still renew at normal price. Website may stop working.',
                status: 'expired',
                color: '#f59e0b'
              },
              { 
                stage: 'Redemption Period (30-40 days)', 
                desc: 'Owner can still recover domain but at a much higher redemption fee ($100-200).',
                status: 'redemption',
                color: '#ef4444'
              },
              { 
                stage: 'Pending Delete (5 days)', 
                desc: 'Domain is scheduled for deletion. Cannot be recovered by original owner.',
                status: 'pending delete',
                color: '#dc2626'
              },
              { 
                stage: 'Available for Registration', 
                desc: 'Domain is deleted and becomes available for anyone to register again.',
                status: 'available',
                color: '#22c55e'
              },
            ].map(stage => (
              <div key={stage.stage} style={{ 
                background: '#111', 
                borderRadius: '8px', 
                padding: '20px', 
                border: '1px solid #1e1e1e',
                borderLeft: `4px solid ${stage.color}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: stage.color, margin: 0 }}>
                    {stage.stage}
                  </h3>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: `${stage.color}20`,
                    color: stage.color,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}>
                    {stage.status}
                  </span>
                </div>
                <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Domain Monitoring Strategies</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '12px' }}>
              🎯 Pro Tips for Domain Monitoring
            </h3>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Set calendar reminders:</strong> Add expiration dates to your calendar 60-90 days before expiry</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Use domain monitoring services:</strong> Tools like DomainTools or NameJet can alert you to expiring domains</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Check multiple sources:</strong> WHOIS data can vary between registrars, so verify with multiple tools</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Understand time zones:</strong> Expiration times are often in UTC, so account for time differences</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Monitor competitor domains:</strong> Track when valuable competitor domains might become available</li>
            </ul>
          </div>
          
          <div style={{ background: '#0f1419', borderRadius: '12px', padding: '24px', border: '1px solid #ef444420' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ef4444', marginBottom: '12px' }}>
              ⚠️ Important Considerations
            </h3>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>Most valuable domains have auto-renewal enabled and rarely expire accidentally</li>
              <li style={{ marginBottom: '8px' }}>Domain catching services compete for expired domains, making manual registration difficult</li>
              <li style={{ marginBottom: '8px' }}>Always verify expiration data with multiple sources before making decisions</li>
              <li style={{ marginBottom: '8px' }}>Some domains may be renewed at the last minute even if they appear expired</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Best Practices for Domain Renewal</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              { tip: 'Enable Auto-Renewal', detail: 'Set up automatic renewal to prevent accidental domain loss. This is the #1 way to avoid expiration issues.', icon: '🔄' },
              { tip: 'Update Contact Information', detail: 'Keep your registrar contact info current so you receive renewal notices and important updates.', icon: '📧' },
              { tip: 'Renew for Multiple Years', detail: 'Register domains for 2-10 years to reduce renewal frequency and potential oversight.', icon: '📅' },
              { tip: 'Use a Business Credit Card', detail: 'Link renewals to a business card that won\'t expire soon and has automatic payment enabled.', icon: '💳' },
              { tip: 'Set Manual Reminders', detail: 'Even with auto-renewal, set calendar reminders to review and confirm renewals.', icon: '⏰' },
              { tip: 'Monitor Domain Portfolio', detail: 'Use domain management tools to track all your domains and their expiration dates in one place.', icon: '📊' },
            ].map(tip => (
              <div key={tip.tip} style={{ background: '#111', borderRadius: '8px', padding: '16px', border: '1px solid #1e1e1e' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>{tip.icon}</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                      {tip.tip}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#ccc', margin: 0, lineHeight: 1.6 }}>
                      {tip.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Happens When Domains Expire</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Domain expiration can have serious consequences for businesses:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {[
              { impact: 'Website Goes Down', severity: 'Critical', desc: 'Visitors see error pages, losing traffic and sales immediately' },
              { impact: 'Email Stops Working', severity: 'Critical', desc: 'Business email becomes unreachable, disrupting communication' },
              { impact: 'SEO Rankings Drop', severity: 'High', desc: 'Search engines may deindex the site, losing organic traffic' },
              { impact: 'Brand Damage', severity: 'High', desc: 'Customers lose trust when they can\'t reach your business online' },
              { impact: 'Recovery Costs', severity: 'Medium', desc: 'Redemption fees ($100-200+) and potential legal costs if domain is taken' },
              { impact: 'Lost Revenue', severity: 'Critical', desc: 'Every hour offline means lost sales, leads, and customer inquiries' },
            ].map(impact => (
              <div key={impact.impact} style={{ 
                background: '#111', 
                borderRadius: '8px', 
                padding: '16px', 
                border: '1px solid #1e1e1e',
                borderTop: `3px solid ${impact.severity === 'Critical' ? '#ef4444' : impact.severity === 'High' ? '#f59e0b' : '#6b7280'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                    {impact.impact}
                  </h3>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: impact.severity === 'Critical' ? '#ef444420' : impact.severity === 'High' ? '#f59e0b20' : '#6b728020',
                    color: impact.severity === 'Critical' ? '#ef4444' : impact.severity === 'High' ? '#f59e0b' : '#6b7280',
                    fontWeight: 600,
                  }}>
                    {impact.severity.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#ccc', margin: 0, lineHeight: 1.5 }}>
                  {impact.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'How accurate are domain expiration dates?', a: 'Expiration dates come from WHOIS records and are generally accurate, but can vary slightly between sources. Always verify critical information with the domain registrar.' },
          { q: 'Can I register a domain immediately after it expires?', a: 'No, expired domains go through grace periods and redemption phases before becoming available. This process typically takes 75-80 days total.' },
          { q: 'Why do some domains show different expiration dates?', a: 'Different WHOIS servers may show slightly different data, and some registrars update records at different times. Check multiple sources for important domains.' },
          { q: 'What\'s the best way to monitor multiple domains?', a: 'Use domain portfolio management tools or set up calendar reminders for each domain\'s expiration date minus 60-90 days.' },
          { q: 'Can expired domains be recovered?', a: 'Yes, during the grace and redemption periods, though redemption fees are expensive ($100-200+). After the delete phase, they become available to anyone.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Need more domain tools?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Check domain age, availability, and generate domain names with our other tools.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/domain-age-checker" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            Domain Age Checker
          </a>
          <a href="/domain-availability" style={{ display: 'inline-block', background: '#333', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            Check Availability
          </a>
        </div>
      </section>
    </StaticPage>
  );
}