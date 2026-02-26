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
            <a href="/privacy" style={{ color: '#888', textDecoration: 'none', fontSize: '0.7rem' }}>Privacy</a>
            <a href="/terms" style={{ color: '#888', textDecoration: 'none', fontSize: '0.7rem' }}>Terms</a>
            <a href="/trademark" style={{ color: '#888', textDecoration: 'none', fontSize: '0.7rem' }}>Trademark</a>
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

export function AppShell({ children, hideFooter = false, searchActive = false }) {
  const [layoutStyle, setLayoutStyle] = useState({ height: '100dvh' });
  const [isDesktop, setIsDesktop] = useState(false);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="/" style={{
            fontSize: '0.9rem', fontWeight: 700,
            letterSpacing: '-0.01em', color: '#fff',
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <img src="/domy-mascot.png" alt="Domy" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
            DomyDomains
          </a>
          {isDesktop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <a href="/" style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff', textDecoration: 'none' }}>Search</a>
              <a href="/extensions" style={{ fontSize: '0.85rem', fontWeight: 500, color: '#888', textDecoration: 'none' }}>Extensions</a>
              <a href="/tools" style={{ fontSize: '0.85rem', fontWeight: 500, color: '#888', textDecoration: 'none' }}>Tools</a>
            </div>
          )}
        </div>
        {isDesktop && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '6px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>☾</button>
            <button style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '6px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>⚙</button>
          </div>
        )}
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
