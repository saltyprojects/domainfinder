'use client';

import { useState, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const REGISTRAR_URL = 'https://www.namecheap.com/domains/registration/results/?domain=';

function DomainRow({ result }) {
  const { full_domain, available } = result;
  return (
    <a
      href={`${REGISTRAR_URL}${encodeURIComponent(full_domain)}`}
      target="_blank" rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'background 0.15s',
        background: 'transparent',
        minHeight: '48px',
        boxSizing: 'border-box',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: available ? 'var(--green)' : 'var(--red)',
          flexShrink: 0,
          opacity: available ? 1 : 0.5,
        }} />
        <span style={{
          fontSize: '0.9rem', fontWeight: 500,
          color: available ? 'var(--text)' : 'var(--text-muted)',
          letterSpacing: '-0.01em',
        }}>
          {full_domain}
        </span>
      </div>
      <span style={{
        fontSize: '0.75rem', fontWeight: 500,
        color: available ? 'var(--green)' : 'var(--text-dim)',
        flexShrink: 0,
        letterSpacing: '0.01em',
      }}>
        {available ? 'Register →' : 'Taken'}
      </span>
    </a>
  );
}

function PrimaryResult({ result }) {
  if (!result) return null;
  const { full_domain, available } = result;

  return (
    <div style={{
      padding: '20px',
      marginBottom: '12px',
      borderRadius: '16px',
      background: available
        ? 'rgba(34,197,94,0.06)'
        : 'rgba(239,68,68,0.04)',
      border: `1px solid ${available
        ? 'rgba(34,197,94,0.12)'
        : 'rgba(239,68,68,0.08)'}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '8px',
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: available ? 'var(--green)' : 'var(--red)',
        }} />
        <span style={{
          fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: available ? 'var(--green)' : 'var(--red)',
        }}>
          {available ? 'Available' : 'Taken'}
        </span>
      </div>
      <div style={{
        fontSize: 'clamp(1.3rem, 4.5vw, 1.6rem)',
        fontWeight: 700,
        color: 'var(--text)',
        letterSpacing: '-0.03em',
        marginBottom: '16px',
        lineHeight: 1.2,
      }}>
        {full_domain}
      </div>
      <a
        href={`${REGISTRAR_URL}${encodeURIComponent(full_domain)}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '10px 20px',
          borderRadius: '10px',
          fontSize: '0.82rem', fontWeight: 600,
          textDecoration: 'none',
          background: available ? 'var(--green)' : 'var(--surface)',
          color: available ? '#000' : 'var(--text-muted)',
          border: available ? 'none' : '1px solid var(--border)',
          minHeight: '44px',
          boxSizing: 'border-box',
        }}
      >
        {available ? 'Register this domain →' : 'View on Namecheap →'}
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
        maxWidth: '480px',
        padding: '0 24px',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 5.5vw, 2.2rem)',
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: '-0.03em',
          marginBottom: '8px',
          color: 'var(--text)',
        }}>
          Find available<br />domain names
        </h1>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: '24px',
          lineHeight: 1.5,
        }}>
          Instant results across 20+ extensions
        </p>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={activateSearch}
            onChange={handleChange}
            placeholder="Enter a domain name..."
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '0.95rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
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
      maxWidth: '560px',
      flex: 1,
      minHeight: 0,
      boxSizing: 'border-box',
    }}>
      {/* Scrollable results */}
      <div data-scrollable style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px 8px',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}>
        <PrimaryResult result={primary} />

        {/* Stats */}
        {results.length > 0 && !loading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '4px', padding: '4px 4px',
          }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600,
              color: 'var(--text-dim)', textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Extensions
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {availableCount > 0 && <span style={{ color: 'var(--green)' }}>{availableCount} available</span>}
              {availableCount > 0 && takenCount > 0 && ' · '}
              {takenCount > 0 && <span>{takenCount} taken</span>}
            </span>
          </div>
        )}

        {/* Extension rows */}
        <div style={{ margin: '0 -16px' }}>
          {rest.map(r => <DomainRow key={r.full_domain} result={r} />)}
        </div>

        {/* Loading */}
        {loading && results.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '48px', borderRadius: '12px' }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && results.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', flex: 1, minHeight: '160px',
            color: 'var(--text-dim)',
          }}>
            <span style={{ fontSize: '0.85rem' }}>Type a domain name to search</span>
          </div>
        )}
      </div>

      {/* Bottom search bar */}
      <div style={{
        padding: '8px 16px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
        flexShrink: 0,
      }}>
        {loading && progress.total > 0 && (
          <div style={{ marginBottom: '6px' }}>
            <div style={{
              height: '2px', background: 'var(--border)',
              borderRadius: '1px', overflow: 'hidden',
            }}>
              <div style={{
                width: `${(progress.done / progress.total) * 100}%`,
                height: '100%', background: 'var(--green)',
                transition: 'width 0.1s',
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
              width: '100%',
              padding: '12px 40px 12px 14px',
              fontSize: '0.9rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onKeyDown={(e) => { if (e.key === 'Escape') clear(); }}
          />
          <button onClick={clear} style={{
            position: 'absolute', right: '10px', top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--surface-hover)', border: 'none',
            color: 'var(--text-muted)',
            width: '28px', height: '28px', borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', lineHeight: 1,
            minHeight: 'auto', minWidth: 'auto',
          }}>✕</button>
        </div>
      </div>
    </div>
  );
}
