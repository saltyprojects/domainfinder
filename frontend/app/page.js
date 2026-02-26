'use client';

import { useState, useEffect } from 'react';
import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  const [searchActive, setSearchActive] = useState(false);
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
      
      // Update desktop detection
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
        {/* Left: Brand + Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{
            fontSize: '0.9rem', fontWeight: 700,
            letterSpacing: '-0.01em', color: '#fff',
          }}>
            DomyDomains
          </span>
          
          {/* Desktop Navigation Items */}
          {isDesktop && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}>
              <a href="/" style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#fff',
                textDecoration: 'none',
                padding: '8px 0',
              }}>
                Search
              </a>
              <a href="/extensions" style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#888',
                textDecoration: 'none',
                padding: '8px 0',
              }}>
                Extensions
              </a>
              <a href="/tools" style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#888',
                textDecoration: 'none',
                padding: '8px 0',
              }}>
                Tools
              </a>
            </div>
          )}
        </div>

        {/* Right: Desktop Controls */}
        {isDesktop && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <button style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#888',
              padding: '6px 8px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}>
              ☾
            </button>
            <button style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#888',
              padding: '6px 8px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}>
              ⚙
            </button>
          </div>
        )}
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
