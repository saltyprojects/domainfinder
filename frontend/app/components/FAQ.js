'use client';

import { useState } from 'react';

const faqs = [
  { q: 'Is DomyDomains free?', a: 'Yes! Searching domains, checking social handles, and generating name ideas are completely free. No account needed.' },
  { q: 'Do you sell domains?', a: 'We don\'t sell domains directly. We help you find and compare the best option, then link you to trusted registrars like Namecheap, GoDaddy, and Cloudflare where you can register.' },
  { q: 'How many TLDs do you check?', a: 'We check 20+ popular TLDs including .com, .io, .co, .dev, .app, .net, .org, and many more — all in real time.' },
  { q: 'Is the social handle check accurate?', a: 'We check username availability on X (Twitter), Instagram, TikTok, GitHub, and LinkedIn in real time. Results are accurate at the moment of search.' },
  { q: 'How does price comparison work?', a: 'We\'re rolling out registrar price comparison soon. You\'ll be able to see first-year and renewal prices side by side across major registrars.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid var(--border)',
        padding: '20px 0',
        cursor: 'pointer',
      }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{q}</h3>
        <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </div>
      {open && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '12px', marginBottom: 0 }}>
          {a}
        </p>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" style={{ padding: '60px 16px', maxWidth: '700px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '8px' }}>
        Frequently asked <span style={{ color: 'var(--green)' }}>questions</span>
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px', fontSize: '0.95rem' }}>
        Everything you need to know about DomyDomains.
      </p>
      <div>
        {faqs.map((f) => <FAQItem key={f.q} {...f} />)}
      </div>
    </section>
  );
}
