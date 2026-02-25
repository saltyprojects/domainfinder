'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  const [searchActive, setSearchActive] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState({ height: '100dvh' });

  useEffect(() => {
    const update = () => {
      const vv = window.visualViewport;
      if (vv) {
        // Use visualViewport height and compensate for any scroll offset
        // iOS Safari scrolls the visual viewport when keyboard opens
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

    // Prevent touch-move on the document to stop iOS overscroll
    const preventScroll = (e) => {
      // Allow scroll inside elements that need it (results list)
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
      {/* Nav — always visible */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px 24px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ 
            fontSize: '1.3rem', 
            fontWeight: 900, 
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--text) 0%, var(--green) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            DomyDomains
          </span>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--green)',
            background: 'var(--green-dim)',
            padding: '4px 8px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Beta
          </div>
        </div>
      </nav>

      {/* Main content area */}
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

      {/* Footer — hidden when search is active */}
      {!searchActive && (
        <footer style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 24px',
          flexShrink: 0,
          borderTop: '1px solid var(--border)',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
          background: 'var(--bg)',
        }}>
          <span>© 2026 DomyDomains</span>
          <div style={{ 
            width: '1px', 
            height: '12px', 
            background: 'var(--border)' 
          }} />
          <span>Built for domain hunters 🎯</span>
        </footer>
      )}
    </div>
  );
}
