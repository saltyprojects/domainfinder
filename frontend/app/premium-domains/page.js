import Link from 'next/link';
import { StaticPage } from '../components/StaticPage';

export const metadata = {
  title: 'Premium Domains for Sale — Aftermarket Domain Marketplace | DomyDomains',
  description: 'Discover premium domains for sale. Browse aftermarket domains with existing traffic, backlinks, and domain authority. Find undervalued domains for your business.',
  keywords: 'premium domains, domains for sale, aftermarket domains, buy domains, domain marketplace, domain investing, expired domains',
  alternates: { canonical: '/premium-domains' },
  openGraph: {
    title: 'Premium Domains for Sale — Aftermarket Marketplace',
    description: 'Discover premium domains with traffic, backlinks, and authority.',
    url: 'https://domydomains.com/premium-domains',
  },
};

export default function PremiumDomains() {
  return (
    <StaticPage>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          Premium Domains
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '48px', maxWidth: '700px' }}>
          Premium domains are pre-owned domain names available for purchase on the aftermarket. 
          They often come with existing traffic, backlinks, and brand value that new domains don&apos;t have.
        </p>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Why Buy a Premium Domain?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🚀', title: 'Instant Authority', desc: 'Premium domains often have years of history, backlinks, and domain authority that would take years to build from scratch.' },
              { icon: '🔍', title: 'SEO Advantage', desc: 'Domains with existing backlinks and traffic can give you a head start in search engine rankings.' },
              { icon: '💼', title: 'Brand Credibility', desc: 'A premium .com domain instantly makes your business look established and trustworthy.' },
              { icon: '📈', title: 'Investment Value', desc: 'Quality domain names appreciate over time. Many premium domains have 10-100x returns.' },
              { icon: '🎯', title: 'Exact Match', desc: 'Get the exact keyword domain for your industry — "shoes.com" is worth more than "mybestshoes.com".' },
              { icon: '⚡', title: 'Type-in Traffic', desc: 'Many premium domains receive direct traffic from people typing the domain directly into their browser.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How Premium Domain Pricing Works</h2>
          <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
            <p>Premium domain prices vary wildly — from $100 to millions. Factors that affect pricing:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
              {[
                { range: '$100 - $1,000', label: 'Starter', desc: 'Brandable names, newer TLDs' },
                { range: '$1,000 - $10,000', label: 'Mid-Range', desc: 'Short .com names, keyword domains' },
                { range: '$10,000 - $100,000', label: 'Premium', desc: 'High-value keywords, short .com' },
                { range: '$100,000+', label: 'Ultra Premium', desc: 'Single-word .com, category killers' },
              ].map(tier => (
                <div key={tier.label} style={{ background: '#111', borderRadius: '8px', padding: '16px', border: '1px solid #1e1e1e' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3b82f6', marginBottom: '4px' }}>{tier.range}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{tier.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{tier.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Where to Buy Premium Domains</h2>
          <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
            <p>Premium domains are sold through various marketplaces and registrars:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>Aftermarket Marketplaces</strong> — Sedo, Afternic, Dan.com, and Flippa list thousands of premium domains.</li>
              <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>Registrar Marketplaces</strong> — Namecheap, GoDaddy, and Dynadot have built-in premium listings.</li>
              <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>Expired Domain Auctions</strong> — Domains that aren&apos;t renewed go to auction, often at steep discounts.</li>
              <li style={{ marginBottom: '12px' }}><strong style={{ color: '#fff' }}>Private Sales</strong> — Contact the current owner directly via WHOIS or the domain&apos;s landing page.</li>
            </ul>
            <p style={{ marginTop: '16px' }}>
              Use <Link href="/" style={{ color: '#8b5cf6' }}>DomyDomains</Link> to search for available domains first — you might find a great name without paying premium prices.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px' }}>Famous Premium Domain Sales</h2>
          <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
            <p>Premium domains have sold for staggering amounts, proving their value as digital real estate:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginTop: '16px' }}>
              {[
                { domain: 'voice.com', price: '$30M', year: '2019' },
                { domain: 'insurance.com', price: '$35.6M', year: '2010' },
                { domain: 'hotels.com', price: '$11M', year: '2001' },
                { domain: 'fb.com', price: '$8.5M', year: '2010' },
                { domain: 'travel.com', price: '$11M', year: '2003' },
                { domain: 'fund.com', price: '$10M', year: '2008' },
                { domain: 'crypto.com', price: '$12M', year: '2018' },
                { domain: 'beer.com', price: '$7M', year: '2004' },
              ].map(s => (
                <div key={s.domain} style={{ background: '#111', borderRadius: '8px', padding: '14px', border: '1px solid #1e1e1e' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#3b82f6' }}>{s.domain}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#22c55e' }}>{s.price}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{s.year}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>Frequently Asked Questions</h2>
          {[
            { q: 'What makes a domain "premium"?', a: 'Premium domains are short, memorable, keyword-rich names that are already registered. They\'re sold on the aftermarket at prices above standard registration fees due to their brand value, traffic history, or SEO authority.' },
            { q: 'Are premium domains worth the investment?', a: 'For businesses where the domain IS the brand, absolutely. A premium .com can save millions in marketing costs by being instantly memorable. For side projects or startups, a creative new registration is often better.' },
            { q: 'How do I negotiate a premium domain price?', a: 'Research comparable sales on NameBio.com, start with an offer 30-50% below asking, be patient, and use escrow services like Escrow.com for safe transactions. Many sellers expect negotiation.' },
            { q: 'Can I find premium domains with DomyDomains?', a: 'Yes! Our search shows premium aftermarket listings alongside available domains. When you search for a name, we surface premium options with pricing from major marketplaces.' },
            { q: 'What\'s the difference between expired and premium domains?', a: 'Expired domains weren\'t renewed by their owner and go to auction. Premium domains are actively listed for sale by their owners at set prices. Expired domains can be great deals if they have existing backlinks.' },
          ].map((faq, i) => (
            <div key={i} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{faq.q}</h3>
              <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </section>

        <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Search premium & available domains</h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Find premium domains for sale alongside available domains — all in one search.</p>
          <Link href="/" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Search domains →
          </Link>
        </section>
    </StaticPage>
  );
}
