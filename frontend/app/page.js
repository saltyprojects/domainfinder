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
      ...layoutStyle,
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: '52px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'var(--green)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 800, color: '#000',
          }}>D</div>
          <span style={{
            fontSize: '1rem', fontWeight: 700,
            letterSpacing: '-0.02em', color: 'var(--text)',
          }}>
            DomyDomains
          </span>
        </div>
        <div style={{
          fontSize: '0.7rem', fontWeight: 600,
          color: 'var(--green)', opacity: 0.7,
          letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          20+ TLDs
        </div>
      </nav>

      {/* Main */}
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

      {/* Footer */}
      {!searchActive && (
        <footer style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          padding: '12px 16px',
          flexShrink: 0,
          borderTop: '1px solid var(--border)',
          fontSize: '0.7rem',
          color: 'var(--text-dim)',
          background: 'var(--bg)',
          letterSpacing: '0.02em',
        }}>
          <span>© 2026 DomyDomains</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>Instant domain search</span>
        </footer>
      )}
    </div>
  );
}
