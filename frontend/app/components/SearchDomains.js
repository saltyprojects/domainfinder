'use client';

import { useState, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const REGISTRAR_URL = 'https://www.namecheap.com/domains/registration/results/?domain=';

function DomainRow({ result }) {
  const { full_domain, available } = result;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '13px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: available ? 'var(--green)' : 'var(--red)',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: '1rem', fontWeight: 500,
          color: available ? 'var(--text)' : 'var(--text-muted)',
        }}>
          {full_domain}
        </span>
      </div>
      <a
        href={`${REGISTRAR_URL}${encodeURIComponent(full_domain)}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          padding: '6px 20px',
          background: available ? 'var(--green)' : 'var(--surface-hover)',
          color: available ? '#000' : 'var(--text-muted)',
          borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600,
          textDecoration: 'none', flexShrink: 0,
          border: available ? 'none' : '1px solid var(--border)',
        }}
      >
        {available ? 'Register' : 'Lookup'}
      </a>
    </div>
  );
}

export function SearchDomains({ onActiveChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const inputRef = useRef(null);
  const bottomInputRef = useRef(null);
  const eventSourceRef = useRef(null);

  const doSearch = (q) => {
    const trimmed = q.trim().toLowerCase().split('.')[0];
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      return;
    }

    if (eventSourceRef.current) eventSourceRef.current.close();
    setLoading(true);
    setResults([]);
    setProgress({ done: 0, total: 0 });

    const eventSource = new EventSource(
      `${API_BASE}/api/search/stream/?q=${encodeURIComponent(trimmed)}`
    );
    eventSourceRef.current = eventSource;
    let received = [];

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'start') {
          setProgress({ done: 0, total: data.total });
        } else if (data.type === 'result') {
          received = [...received, data];
          setResults([...received]);
          setProgress(p => ({ ...p, done: p.done + 1 }));
        } else if (data.type === 'done') {
          eventSource.close();
          setLoading(false);
        }
      } catch (e) {}
    };

    eventSource.onerror = () => {
      eventSource.close();
      if (received.length === 0) {
        fetch(`${API_BASE}/api/search/?q=${encodeURIComponent(trimmed)}`)
          .then(r => r.json())
          .then(data => { setResults(data.results || []); setLoading(false); })
          .catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    };
  };

  const debounceRef = useRef(null);
  const handleChange = (e) => {
    const val = e.target.value.toLowerCase();
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const activateSearch = () => {
    if (!active) {
      setActive(true);
      onActiveChange?.(true);
      setTimeout(() => bottomInputRef.current?.focus(), 50);
    }
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setActive(false);
    onActiveChange?.(false);
    if (eventSourceRef.current) eventSourceRef.current.close();
  };

  // Sort: .com first, then TLD priority
  const tldOrder = ['com','net','org','io','dev','ai','app','co','me','xyz','tech','info','biz','cloud','design','blog','shop','site','store','online'];
  const sorted = [...results].sort((a, b) => {
    const ai = tldOrder.indexOf(a.tld);
    const bi = tldOrder.indexOf(b.tld);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const primary = sorted.find(r => r.tld === 'com') || sorted[0];
  const rest = sorted.filter(r => r !== primary);

  // ===== INACTIVE STATE: Hero + centered search =====
  if (!active) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        maxWidth: '640px',
        padding: '0 20px',
        boxSizing: 'border-box',
      }}>
        {/* Hero Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'clamp(40px, 8vw, 60px)',
          maxWidth: '580px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            marginBottom: 'clamp(16px, 3vw, 24px)',
            background: 'linear-gradient(135deg, var(--text) 0%, var(--green) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Find the perfect domain for your next big idea
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            fontWeight: 500,
          }}>
            Search across 20+ extensions and secure your brand identity instantly
          </p>
        </div>

        {/* Enhanced Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '520px' }}>
          <div style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            pointerEvents: 'none',
            zIndex: 1,
          }}>
            🔍
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={activateSearch}
            onChange={handleChange}
            placeholder="Enter your dream domain name..."
            style={{
              width: '100%', 
              padding: '20px 50px', 
              fontSize: '1.1rem',
              background: 'var(--surface)', 
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', 
              color: 'var(--text)', 
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--green)';
              e.target.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          />
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            pointerEvents: 'none',
          }}>
            Press Enter
          </div>
        </div>

        {/* Feature Hints */}
        <div style={{
          display: 'flex',
          gap: 'clamp(20px, 4vw, 32px)',
          marginTop: 'clamp(32px, 6vw, 48px)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { icon: '⚡', label: 'Instant Results' },
            { icon: '🌍', label: '20+ Extensions' },
            { icon: '✨', label: 'Smart Suggestions' },
          ].map(({ icon, label }, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}>
              <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== ACTIVE STATE: Results + bottom search =====
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '600px',
      flex: 1,
      minHeight: 0,
      boxSizing: 'border-box',
    }}>
      {/* Scrollable results area */}
      <div data-scrollable style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 8px',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}>
        {/* Primary result */}
        {primary && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              fontWeight: 800,
              color: primary.available ? 'var(--green)' : 'var(--red)',
              marginBottom: '10px',
            }}>
              {primary.full_domain}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={`${REGISTRAR_URL}${encodeURIComponent(primary.full_domain)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '10px 28px', borderRadius: '24px',
                  fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none',
                  background: primary.available ? 'var(--green)' : 'var(--surface-hover)',
                  color: primary.available ? '#000' : 'var(--text)',
                  border: primary.available ? 'none' : '1px solid var(--border)',
                }}
              >
                {primary.available ? 'Register' : 'Lookup'}
              </a>
              {!primary.available && (
                <span style={{
                  padding: '10px 20px', borderRadius: '24px',
                  fontSize: '0.85rem', color: 'var(--text-dim)',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                }}>
                  Taken
                </span>
              )}
            </div>
          </div>
        )}

        {/* Extensions list */}
        {rest.length > 0 && (
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-muted)' }}>
            Domain extensions
          </div>
        )}
        {rest.map(r => <DomainRow key={r.full_domain} result={r} />)}

        {/* Loading skeleton */}
        {loading && results.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '44px', borderRadius: '6px' }} />
            ))}
          </div>
        )}

        {/* Empty active state */}
        {!loading && results.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '40px', fontSize: '0.9rem' }}>
            Type a domain name to search
          </div>
        )}
      </div>

      {/* Bottom search bar */}
      <div style={{
        padding: '10px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
        flexShrink: 0,
      }}>
        {loading && progress.total > 0 && (
          <div style={{ marginBottom: '6px' }}>
            <div style={{ height: '2px', background: 'var(--border)', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{
                width: `${(progress.done / progress.total) * 100}%`,
                height: '100%', background: 'var(--green)', transition: 'width 0.15s',
              }} />
            </div>
          </div>
        )}
        <div style={{ position: 'relative' }}>
          <input
            ref={bottomInputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search domains..."
            style={{
              width: '100%', padding: '14px 40px 14px 16px', fontSize: '1rem',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', color: 'var(--text)', outline: 'none',
              boxSizing: 'border-box',
            }}
            onKeyDown={(e) => { if (e.key === 'Escape') clear(); }}
          />
          <button onClick={clear} style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'var(--surface-hover)', border: 'none', color: 'var(--text-muted)',
            width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', lineHeight: 1, minHeight: 'auto', minWidth: 'auto',
          }}>✕</button>
        </div>
      </div>
    </div>
  );
}
