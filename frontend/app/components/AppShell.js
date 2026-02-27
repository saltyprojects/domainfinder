'use client';

import { useState, useEffect } from 'react';

const BUILD_SHA = process.env.NEXT_PUBLIC_BUILD_SHA || 'dev';
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || '';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function Footer({ isDesktop }) {
  const [ago, setAgo] = useState('');
  useEffect(() => {
    setAgo(timeAgo(BUILD_TIME));
    const interval = setInterval(() => setAgo(timeAgo(BUILD_TIME)), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      flexShrink: 0,
      borderTop: '1px solid #1e1e1e',
      fontSize: '0.75rem',
      color: '#666',
      background: '#000',
    }}>
      {/* Left side: Brand and links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isDesktop ? '24px' : '12px',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontWeight: 600, color: '#fff' }}>DomyDomains</span>
        {isDesktop && (
          <>
            <a href="/about" style={{ color: '#888', textDecoration: 'none', fontSize: '0.7rem' }}>About</a>
            <a href="/llms.txt" style={{ color: '#888', textDecoration: 'none', fontSize: '0.7rem' }}>llms.txt</a>
            <a href="https://x.com/domydomains" style={{ color: '#888', textDecoration: 'none', fontSize: '0.7rem' }}>𝕏</a>
          </>
        )}
      </div>

      {/* Right side: Build info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.65rem',
        color: '#444',
        fontFamily: 'ui-monospace, monospace',
      }}>
        <span>{BUILD_SHA.slice(0, 7)}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>updated {ago}</span>
      </div>
    </footer>
  );
}

const NAV_LINKS = [
  { href: '/domain-extensions', label: 'Extensions' },
  { href: '/domain-generator', label: 'Generator' },
  { href: '/premium-domains', label: 'Premium' },
  { href: '/domain-pricing', label: 'Pricing' },
  { href: '/whois-lookup', label: 'WHOIS' },
  { href: '/domain-value', label: 'Value' },
  { href: '/about', label: 'About' },
];

export function AppShell({ children, hideFooter = false, searchActive = false, activeTab = 'search', onTabChange }) {
  const [layoutStyle, setLayoutStyle] = useState({ height: '100dvh' });
  const [isDesktop, setIsDesktop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const vv = window.visualViewport;
      if (vv) {
        setLayoutStyle({
          height: `${vv.height}px`,
          transform: `translateY(${vv.offsetTop}px)`,
        });
      } else {
        setLayoutStyle({ height: `${window.innerHeight}px` });
      }
      setIsDesktop(window.innerWidth >= 768);
    };

    update();
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
    }
    window.addEventListener('resize', update);

    const preventScroll = (e) => {
      if (e.target.closest('[data-scrollable]')) return;
      if (e.target.closest('[data-landing-scroll]')) return;
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      if (vv) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
      window.removeEventListener('resize', update);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#000',
      ...layoutStyle,
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '48px',
        flexShrink: 0,
        borderBottom: '1px solid #1e1e1e',
        background: '#000',
        zIndex: 10,
        padding: '0 16px',
        maxWidth: '100vw',
        boxSizing: 'border-box',
      }}>
        {/* Left: Logo + Nav tabs (always visible, like IDS) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? '24px' : '0', flex: 1, minWidth: 0 }}>
          <a href="/" style={{
            fontSize: isDesktop ? '0.9rem' : '0',
            fontWeight: 700,
            letterSpacing: '-0.01em', color: '#fff',
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '6px',
            flexShrink: 0,
          }}>
            <img src="/domy-mascot.png" alt="Domy" style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
            {isDesktop && 'DomyDomains'}
          </a>
          {/* Tabs — only when search is active */}
          {searchActive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginLeft: isDesktop ? '0' : '4px', flex: 1 }}>
              {[
                { label: 'Search', icon: '🔍', id: 'search' },
                { label: 'Extensions', icon: '🧩', id: 'extensions' },
                { label: 'Generator', icon: '⚡', id: 'generator' },
                { label: 'Premium', icon: '💎', id: 'aftermarket' },
              ].map(tab => (
                <button key={tab.id} onClick={() => onTabChange?.(tab.id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  fontSize: isDesktop ? '0.8rem' : 'clamp(0.62rem, 1.8vw, 0.72rem)',
                  fontWeight: 500,
                  color: activeTab === tab.id ? '#fff' : '#666',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: isDesktop ? '6px 12px' : '6px 4px',
                  borderBottom: activeTab === tab.id ? '2px solid #8b5cf6' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  flex: isDesktop ? 'none' : 1,
                }}>
                  <span style={{ fontSize: isDesktop ? '0.82rem' : '0.7rem' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Desktop nav links / Mobile burger (hidden when search active on mobile) */}
        <div style={{ display: (searchActive && !isDesktop) ? 'none' : 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, position: 'relative' }}>
          {isDesktop ? (
            NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} style={{
                fontSize: '0.78rem', color: '#999', textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#999'}>
                {link.label}
              </a>
            ))
          ) : (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                width: '44px', height: '44px',
                display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? '#8b5cf6' : '#999', borderRadius: '1px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
              <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? 'transparent' : '#999', borderRadius: '1px', transition: 'all 0.2s' }} />
              <span style={{ display: 'block', width: '18px', height: '2px', background: menuOpen ? '#8b5cf6' : '#999', borderRadius: '1px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
            </button>
          )}

          {/* Mobile dropdown */}
          {!isDesktop && menuOpen && (
            <div style={{
              position: 'absolute', top: '40px', right: 0,
              background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px',
              padding: '8px 0', minWidth: '160px', zIndex: 100,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}>
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                  display: 'block', padding: '10px 16px',
                  fontSize: '0.85rem', color: '#ccc', textDecoration: 'none',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main */}
      <div
        data-landing-scroll={!searchActive ? '' : undefined}
        style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: searchActive ? 'hidden' : 'auto',
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
        minHeight: 0,
        touchAction: searchActive ? 'none' : 'pan-y',
      }}>
        {children}
      </div>

      {/* Footer */}
      {!hideFooter && <Footer isDesktop={isDesktop} />}
    </div>
  );
}
