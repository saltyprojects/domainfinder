import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainAvailabilityChecker from './DomainAvailabilityChecker';

export const metadata = {
  title: 'Domain Availability Checker — Check if Domain Names are Available | DomyDomains',
  description: 'Check domain availability across 400+ extensions instantly. See which domains are available to register and which are taken with our free domain checker.',
  keywords: 'domain availability checker, check domain availability, domain name availability, available domains, domain search, register domain',
  alternates: { canonical: '/domain-availability' },
  openGraph: {
    title: 'Domain Availability Checker — Check 400+ Extensions',
    description: 'Check if your desired domain name is available across hundreds of extensions instantly.',
    url: 'https://domydomains.com/domain-availability',
  },
};

export default function DomainAvailabilityPage() {
  return (
    <StaticPage>
      <ToolSchema 
        name="Domain Availability Checker" 
        description="Check domain availability across 400+ extensions instantly. See which domains are available and which are taken."
        url="/domain-availability" 
      />
      
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Availability Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Check if your desired domain name is available across 400+ extensions. See instant availability 
        status and register available domains with one click.
      </p>

      <DomainAvailabilityChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How Domain Availability Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { step: '1', title: 'Real-time Check', desc: 'We query live domain registry data to check current availability status.', icon: '🔄' },
            { step: '2', title: 'Multiple Extensions', desc: 'Check .com, .net, .org, .io, .ai and hundreds of other extensions simultaneously.', icon: '🌐' },
            { step: '3', title: 'Instant Registration', desc: 'Available domains can be registered immediately through our partners.', icon: '⚡' },
          ].map(s => (
            <div key={s.step} style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{s.step}</div>
                <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>{s.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Most Popular Domain Extensions</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Different extensions serve different purposes. Here's what to consider:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {[
              { 
                category: 'Traditional Extensions',
                extensions: [
                  { ext: '.com', desc: 'Most trusted, best for businesses', popular: true },
                  { ext: '.net', desc: 'Great alternative to .com', popular: false },
                  { ext: '.org', desc: 'Perfect for organizations, nonprofits', popular: false },
                ]
              },
              { 
                category: 'Tech & Modern',
                extensions: [
                  { ext: '.io', desc: 'Popular with tech startups', popular: true },
                  { ext: '.ai', desc: 'Perfect for AI companies', popular: true },
                  { ext: '.dev', desc: 'Ideal for developers', popular: false },
                ]
              },
              { 
                category: 'Business & Professional',
                extensions: [
                  { ext: '.co', desc: 'Short, professional alternative', popular: false },
                  { ext: '.app', desc: 'Great for mobile apps', popular: false },
                  { ext: '.tech', desc: 'Technology companies', popular: false },
                ]
              },
            ].map(category => (
              <div key={category.category} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '12px' }}>
                  {category.category}
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {category.extensions.map(ext => (
                    <div key={ext.ext} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 600, 
                        color: ext.popular ? '#22c55e' : '#8b5cf6',
                        background: ext.popular ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)',
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        minWidth: '50px',
                        textAlign: 'center',
                      }}>
                        {ext.ext}
                      </code>
                      <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{ext.desc}</span>
                      {ext.popular && (
                        <span style={{ fontSize: '0.7rem', background: '#22c55e', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          HOT
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Domain Registration Tips</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { tip: 'Act Fast on Good Names', detail: 'Popular domain names get registered quickly. If you find a good available name, register it immediately.', icon: '⚡' },
              { tip: 'Consider Multiple Extensions', detail: 'If .com is taken, consider .io, .co, .ai, or other relevant extensions. Many successful brands use non-.com domains.', icon: '🎯' },
              { tip: 'Check Trademark Issues', detail: 'Before registering, ensure your domain doesn\'t infringe on existing trademarks to avoid legal issues.', icon: '⚖️' },
              { tip: 'Enable Privacy Protection', detail: 'Most registrars offer WHOIS privacy protection. Enable it to keep your personal information private.', icon: '🔒' },
              { tip: 'Register for Multiple Years', detail: 'Longer registration periods may help with SEO and ensure you don\'t accidentally lose the domain.', icon: '📅' },
              { tip: 'Set Auto-Renewal', detail: 'Enable auto-renewal to prevent accidental expiration. Losing a domain can be catastrophic for your business.', icon: '🔄' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding Domain Status</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Our availability checker shows real-time status for each domain:</p>
          
          <div style={{ display: 'grid', gap: '8px', marginTop: '16px' }}>
            {[
              { status: 'Available', color: '#22c55e', desc: 'Domain is available for immediate registration', action: 'Register now' },
              { status: 'Taken', color: '#ef4444', desc: 'Domain is already registered by someone else', action: 'Try variations or other extensions' },
              { status: 'Premium', color: '#f59e0b', desc: 'Available for purchase at a premium price from current owner', action: 'Contact seller or registrar' },
              { status: 'Reserved', color: '#8b5cf6', desc: 'Reserved by registry, not available for public registration', action: 'Try alternative names' },
            ].map(status => (
              <div key={status.status} style={{ 
                display: 'flex', 
                gap: '12px', 
                padding: '12px 16px', 
                background: '#111', 
                borderRadius: '8px', 
                border: '1px solid #1e1e1e',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: status.color,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontWeight: 600, color: status.color }}>{status.status}</span>
                </div>
                <span style={{ color: '#ccc', flex: 1, minWidth: '200px' }}>{status.desc}</span>
                <span style={{ fontSize: '0.85rem', color: '#888' }}>{status.action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'How accurate is the availability data?', a: 'We check real-time data from domain registries and registrars. The information is current as of the moment you search, but popular domains can be registered by others quickly.' },
          { q: 'Why do some domains show as premium?', a: 'Premium domains are valuable names that registries or current owners price higher than standard registration fees. They\'re available but cost more.' },
          { q: 'Can I reserve a domain without paying?', a: 'No, domain registration is immediate and requires payment. However, most registrars offer a short grace period if you need to cancel.' },
          { q: 'What if my desired .com is taken?', a: 'Consider alternative extensions like .io, .co, .ai, or .app. Many successful companies use non-.com domains. You can also try variations of your desired name.' },
          { q: 'How long does domain registration take?', a: 'Domain registration is typically instant. Once payment is processed, the domain is yours and usually becomes active within a few hours.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Ready to register your domain?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
          Our availability checker makes it easy to find and register the perfect domain name for your project.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Search Available Domains →
          </a>
          <a href="/domain-generator" style={{ display: 'inline-block', background: '#333', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Generate Domain Ideas
          </a>
        </div>
      </section>
    </StaticPage>
  );
}