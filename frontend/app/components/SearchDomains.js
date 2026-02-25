'use client';

import { useState, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const REGISTRAR_URL = 'https://www.namecheap.com/domains/registration/results/?domain=';

function DomainRow({ result, index }) {
  const { full_domain, tld, available } = result;
  return (
    <div
      className="fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        margin: '0 -16px',
        borderRadius: '10px',
        transition: 'background 0.15s',
        cursor: 'pointer',
        animationDelay: `${index * 30}ms`,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: available ? 'var(--green)' : 'var(--red)',
          flexShrink: 0,
          boxShadow: available ? '0 0 6px var(--green)' : 'none',
        }} />
        <div style={{ minWidth: 0 }}>
          <span style={{
            fontSize: '0.95rem', fontWeight: 500,
            color: available ? 'var(--text)' : 'var(--text-muted)',
          }}>
            {full_domain}
          </span>
        </div>
      </div>
      <a
        href={`${REGISTRAR_URL}${encodeURIComponent(full_domain)}`}
        target="_blank" rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        style={{
          padding: '6px 16px',
          background: available ? 'var(--green)' : 'transparent',
          color: available ? '#000' : 'var(--text-dim)',
          borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
          textDecoration: 'none', flexShrink: 0,
          border: available ? 'none' : '1px solid var(--border)',
          transition: 'all 0.15s',
        }}
      >
        {available ? 'Register' : 'View'}
      </a>
    </div>
  );
}

function PrimaryResult({ result }) {
  if (!result) return null;
  const { full_domain, available } = result;

  return (
    <div className="fade-in" style={{
      padding: '20px',
      margin: '0 -4px 16px',
      borderRadius: '16px',
      background: available ? 'var(--green-dim)' : 'var(--red-dim)',
      border: `1px solid ${available ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.1)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: available ? 'var(--green)' : 'var(--red)',
          boxShadow: available ? '0 0 8px var(--green)' : '0 0 8px var(--red)',
        }} />
        <span style={{
          fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: available ? 'var(--green)' : 'var(--red)',
        }}>
          {available ? 'Available' : 'Taken'}
        </span>
      </div>
      <div style={{
        fontSize: 'clamp(1.4rem, 5vw, 1.8rem)',
        fontWeight: 800,
        color: 'var(--text)',
        letterSpacing: '-0.03em',
        marginBottom: '14px',
      }}>
        {full_domain}
      </div>
      <a
        href={`${REGISTRAR_URL}${encodeURIComponent(full_domain)}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '10px 24px', borderRadius: '10px',
          fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none',
          background: available ? 'var(--green)' : 'var(--surface-hover)',
          color: available ? '#000' : 'var(--text)',
          border: available ? 'none' : '1px solid var(--border)',
          transition: 'transform 0.1s',
        }}
      >
        {available ? 'Register this domain →' : 'Check availability →'}
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

  const tldOrder = ['com','net','org','io','dev','ai','app','co','me','xyz','tech','info','biz','cloud','design','blog','shop','site','store','online'];
  const sorted = [...results].sort((a, b) => {
    const ai = tldOrder.indexOf(a.tld);
    const bi = tldOrder.indexOf(b.tld);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const primary = sorted.find(r => r.tld === 'com') || sorted[0];
  const rest = sorted.filter(r => r !== primary);
  const availableCount = results.filter(r => r.available).length;
  const takenCount = results.filter(r => !r.available).length;

  // ===== INACTIVE STATE =====
  if (!active) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        maxWidth: '520px',
        padding: '0 24px',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.15,
          letterSpacing: '-0.04em',
          marginBottom: '10px',
          color: 'var(--text)',
        }}>
          Is your domain<br />name available?
        </h1>
        <p style={{
          fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
          color: 'var(--text-dim)',
          textAlign: 'center',
          marginBottom: '28px',
          lineHeight: 1.5,
        }}>
          Search across 20+ extensions instantly
        </p>
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{
            position: 'absolute', left: '16px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-dim)',
            fontSize: '1rem', pointerEvents: 'none',
          }}>⌕</div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={activateSearch}
            onChange={handleChange}
            placeholder="Search for a domain name..."
            style={{
              width: '100%', padding: '16px 18px 16px 42px', fontSize: '1rem',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '14px', color: 'var(--text)', outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = 'var(--text-dim)';
            }}
            onMouseLeave={e => {
              if (document.activeElement !== e.target)
                e.target.style.borderColor = 'var(--border)';
            }}
          />
        </div>
        <div style={{
          display: 'flex', gap: '6px', marginTop: '16px', flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {['.com', '.io', '.dev', '.ai', '.app'].map(tld => (
            <span key={tld} style={{
              fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-dim)',
              background: 'var(--surface)', padding: '4px 10px',
              borderRadius: '6px', border: '1px solid var(--border)',
            }}>{tld}</span>
          ))}
        </div>
      </div>
    );
  }

  // ===== ACTIVE STATE =====
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
        padding: '16px 20px 8px',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}>
        {/* Primary result */}
        <PrimaryResult result={primary} />

        {/* Stats bar */}
        {results.length > 0 && !loading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '8px', padding: '0 4px',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>
              Extensions
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            {availableCount > 0 && (
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--green)' }}>
                {availableCount} available
              </span>
            )}
            {takenCount > 0 && (
              <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-dim)' }}>
                {takenCount} taken
              </span>
            )}
          </div>
        )}

        {/* Extensions list */}
        {rest.map((r, i) => <DomainRow key={r.full_domain} result={r} index={i} />)}

        {/* Loading skeleton */}
        {loading && results.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton" style={{
                height: '48px', borderRadius: '10px',
                animationDelay: `${i * 100}ms`,
              }} />
            ))}
          </div>
        )}

        {/* Empty active state */}
        {!loading && results.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', flex: 1, minHeight: '200px',
            color: 'var(--text-dim)', gap: '8px',
          }}>
            <span style={{ fontSize: '2rem', opacity: 0.3 }}>⌕</span>
            <span style={{ fontSize: '0.85rem' }}>Type a domain name to search</span>
          </div>
        )}
      </div>

      {/* Bottom search bar */}
      <div style={{
        padding: '10px 16px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
        flexShrink: 0,
      }}>
        {loading && progress.total > 0 && (
          <div style={{ marginBottom: '6px' }}>
            <div style={{ height: '2px', background: 'var(--border)', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{
                width: `${(progress.done / progress.total) * 100}%`,
                height: '100%', background: 'var(--green)',
                transition: 'width 0.1s',
                boxShadow: '0 0 8px var(--green)',
              }} />
            </div>
          </div>
        )}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-dim)',
            fontSize: '0.9rem', pointerEvents: 'none',
          }}>⌕</div>
          <input
            ref={bottomInputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search domains..."
            style={{
              width: '100%', padding: '12px 40px 12px 38px', fontSize: '0.95rem',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', color: 'var(--text)', outline: 'none',
              boxSizing: 'border-box',
            }}
            onKeyDown={(e) => { if (e.key === 'Escape') clear(); }}
          />
          <button onClick={clear} style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'var(--surface-hover)', border: 'none', color: 'var(--text-muted)',
            width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', lineHeight: 1, minHeight: 'auto', minWidth: 'auto',
            transition: 'background 0.15s',
          }}>✕</button>
        </div>
      </div>
    </div>
  );
}
