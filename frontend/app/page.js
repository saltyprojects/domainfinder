'use client';

import { useState, useEffect } from 'react';
import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  const [searchActive, setSearchActive] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState({ height: '100dvh' });

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
        justifyContent: 'center',
        height: '48px',
        flexShrink: 0,
        borderBottom: '1px solid #1e1e1e',
        background: '#000',
        zIndex: 10,
      }}>
        <span style={{
          fontSize: '0.9rem', fontWeight: 700,
          letterSpacing: '-0.01em', color: '#fff',
        }}>
          DomyDomains
        </span>
      </nav>

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        position: 'relative',
        minHeight: 0,
      }}>
        <SearchDomains onActiveChange={setSearchActive} />
      </div>

      {/* Footer */}
      {!searchActive && (
        <footer style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 16px',
          flexShrink: 0,
          borderTop: '1px solid #1e1e1e',
          fontSize: '0.7rem',
          color: '#444',
          background: '#000',
        }}>
          domydomains.com
        </footer>
      )}
    </div>
  );
}
