'use client';

import { useState, useEffect } from 'react';
import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  const [searchActive, setSearchActive] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(null);

  useEffect(() => {
    // Use visualViewport API to get the REAL visible area
    // This correctly accounts for iOS keyboard, address bar, etc.
    const update = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        setViewportHeight(window.innerHeight);
      }
    };

    update();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', update);
      window.visualViewport.addEventListener('scroll', update);
    }
    window.addEventListener('resize', update);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', update);
        window.visualViewport.removeEventListener('scroll', update);
      }
      window.removeEventListener('resize', update);
    };
  }, []);

  // Also reset scroll position on iOS when keyboard opens
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', resetScroll);
      return () => window.visualViewport.removeEventListener('resize', resetScroll);
    }
  }, []);

  const h = viewportHeight ? `${viewportHeight}px` : '100dvh';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: h,
      maxHeight: h,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
    }}>
      {/* Nav — always visible */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          🌐 DomyDomains
        </span>
      </nav>

      {/* Main — takes remaining height, search lives inside */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        minHeight: 0,
      }}>
        <SearchDomains onActiveChange={setSearchActive} />
      </div>

      {/* Footer — hidden when search is active (saves space for keyboard) */}
      {!searchActive && (
        <footer style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 16px',
          flexShrink: 0,
          borderTop: '1px solid var(--border)',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
        }}>
          © 2026 DomyDomains
        </footer>
      )}
    </div>
  );
}
