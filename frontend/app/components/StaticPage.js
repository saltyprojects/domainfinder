'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const BUILD_SHA = process.env.NEXT_PUBLIC_BUILD_SHA || 'dev';
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || '';

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const NAV_LINKS = [
  { href: '/domain-extensions', label: 'Extensions' },
  { href: '/domain-generator', label: 'Generator' },
  { href: '/premium-domains', label: 'Premium' },
  { href: '/domain-pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export function StaticPage({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [ago, setAgo] = useState('');

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener('resize', update);
    setAgo(timeAgo(BUILD_TIME));
    return () => window.removeEventListener('resize', update);
  }, []);

  // Override body scroll lock for static pages
  useEffect(() => {
    document.body.style.position = 'static';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    return () => {
      document.body.style.position = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>
      {/* Nav — matches AppShell */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '48px', borderBottom: '1px solid #1e1e1e', padding: '0 16px',
        background: '#000', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src="/domy-mascot.png" alt="Domy" style={{ width: 26, height: 26, borderRadius: '50%' }} />
          {isDesktop && <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>DomyDomains</span>}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, position: 'relative' }}>
          {isDesktop ? (
            NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} style={{ fontSize: '0.78rem', color: '#999', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#999'}>
                {link.label}
              </a>
            ))
          ) : (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
              display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center',
            }}>
              <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? '#8b5cf6' : '#999', borderRadius: '1px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
              <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? 'transparent' : '#999', borderRadius: '1px', transition: 'all 0.2s' }} />
              <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? '#8b5cf6' : '#999', borderRadius: '1px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
            </button>
          )}
          {!isDesktop && menuOpen && (
            <div style={{
              position: 'absolute', top: '40px', right: 0,
              background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px',
              padding: '8px 0', minWidth: '160px', zIndex: 100,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}>
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                  display: 'block', padding: '10px 16px', fontSize: '0.85rem', color: '#ccc', textDecoration: 'none',
                }}>{link.label}</a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 16px 96px' }}>
        {children}
      </main>

      {/* Footer — matches AppShell */}
      <footer style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px', borderTop: '1px solid #1e1e1e', fontSize: '0.75rem', color: '#666', background: '#000',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? '24px' : '12px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: '#fff' }}>DomyDomains</span>
          {isDesktop && NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} style={{ color: '#888', textDecoration: 'none', fontSize: '0.7rem' }}>{link.label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: '#444', fontFamily: 'ui-monospace, monospace' }}>
          <span>{BUILD_SHA.slice(0, 7)}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>updated {ago}</span>
        </div>
      </footer>
    </div>
  );
}
