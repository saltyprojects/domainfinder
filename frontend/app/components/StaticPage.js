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
  { href: '/domain-age-checker', label: 'Tools', isToolsMenu: true },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

const TOOLS_LINKS = [
  { href: '/domain-age-checker', label: 'Domain Age Checker' },
  { href: '/dns-lookup', label: 'DNS Lookup' },
  { href: '/domain-availability', label: 'Availability Checker' },
  { href: '/random-domain-generator', label: 'Random Generator' },
  { href: '/domain-expiration', label: 'Expiration Checker' },
  { href: '/brand-name-generator', label: 'Brand Name Generator' },
  { href: '/startup-name-generator', label: 'Startup Name Generator' },
  { href: '/domain-length-checker', label: 'Domain Length Checker' },
  { href: '/tld-comparison', label: 'TLD Comparison' },
  { href: '/bulk-domain-checker', label: 'Bulk Checker' },
  { href: '/ssl-checker', label: 'SSL Checker' },
  { href: '/email-domain-checker', label: 'Email Domain Checker' },
  { href: '/domain-history', label: 'Domain History' },
  { href: '/website-status', label: 'Website Status' },
  { href: '/domain-typo-generator', label: 'Domain Typo Generator' },
];

export function StaticPage({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
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
    // Override globals.css scroll lock for static pages
    const el = document.documentElement;
    const bd = document.body;
    el.style.overflow = 'auto';
    el.style.height = 'auto';
    el.style.overscrollBehavior = 'auto';
    bd.style.position = 'static';
    bd.style.inset = 'auto';
    bd.style.overflow = 'auto';
    bd.style.height = 'auto';
    bd.style.overscrollBehavior = 'auto';
    bd.style.touchAction = 'auto';
    return () => {
      el.style.overflow = '';
      el.style.height = '';
      el.style.overscrollBehavior = '';
      bd.style.position = '';
      bd.style.inset = '';
      bd.style.overflow = '';
      bd.style.height = '';
      bd.style.overscrollBehavior = '';
      bd.style.touchAction = '';
    };
  }, []);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', position: 'fixed', inset: 0, overflow: 'auto', zIndex: 50 }}>
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
            NAV_LINKS.map(link => 
              link.isToolsMenu ? (
                <div key="tools" style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                    style={{ 
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.78rem', color: '#999', transition: 'color 0.15s',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#999'}>
                    {link.label} ▾
                  </button>
                  {toolsMenuOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                      background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
                      padding: '8px 0', minWidth: '200px', zIndex: 100,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    }}>
                      {TOOLS_LINKS.map(tool => (
                        <a key={tool.href} href={tool.href} onClick={() => setToolsMenuOpen(false)} style={{
                          display: 'block', padding: '8px 16px', fontSize: '0.8rem', color: '#ccc', textDecoration: 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          {tool.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a key={link.href} href={link.href} style={{ fontSize: '0.78rem', color: '#999', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#999'}>
                  {link.label}
                </a>
              )
            )
          ) : (
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <span style={{ display: 'block', width: '18px', height: '2px', background: '#999', borderRadius: '1px', transition: 'all 0.3s', position: 'absolute', transform: menuOpen ? 'rotate(45deg)' : 'translateY(-5px)' }} />
              <span style={{ display: 'block', width: '18px', height: '2px', background: '#999', borderRadius: '1px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: '18px', height: '2px', background: '#999', borderRadius: '1px', transition: 'all 0.3s', position: 'absolute', transform: menuOpen ? 'rotate(-45deg)' : 'translateY(5px)' }} />
            </button>
          )}
          {!isDesktop && menuOpen && (
            <div style={{
              position: 'absolute', top: '40px', right: 0,
              background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px',
              padding: '8px 0', minWidth: '180px', zIndex: 100,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}>
              {NAV_LINKS.filter(link => !link.isToolsMenu).map(link => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                  display: 'block', padding: '10px 16px', fontSize: '0.85rem', color: '#ccc', textDecoration: 'none',
                }}>{link.label}</a>
              ))}
              <div style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Tools</div>
              {TOOLS_LINKS.map(tool => (
                <a key={tool.href} href={tool.href} onClick={() => setMenuOpen(false)} style={{
                  display: 'block', padding: '6px 24px', fontSize: '0.8rem', color: '#999', textDecoration: 'none',
                }}>{tool.label}</a>
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
          {isDesktop && [
            { href: '/about', label: 'About' },
            { href: '/llms.txt', label: 'llms.txt' },
            { href: 'https://x.com/domydomains', label: '𝕏' },
          ].map(link => (
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

export default StaticPage;
