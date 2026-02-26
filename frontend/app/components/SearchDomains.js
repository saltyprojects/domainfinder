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
        padding: '0 8px',
        height: '40px',
        borderRadius: '6px',
        textDecoration: 'none',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#141414'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: available ? '#22c55e' : '#ef4444',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: '0.9rem', fontWeight: 450,
          color: '#e5e5e5',
        }}>
          {full_domain}
        </span>
      </div>
      {/* Split button */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#1a1a1a',
        borderRadius: '6px',
        overflow: 'hidden',
        height: '30px',
        flexShrink: 0,
      }}>
        <span style={{
          padding: '0 10px',
          fontSize: '0.75rem', fontWeight: 600,
          color: available ? '#22c55e' : '#666',
          lineHeight: '30px',
        }}>
          {available ? 'Continue' : 'Lookup'}
        </span>
        <div style={{
          width: '1px', height: '14px',
          background: '#333',
        }} />
        <span style={{
          padding: '0 8px',
          fontSize: '0.65rem',
          color: '#444',
          lineHeight: '30px',
        }}>▾</span>
      </div>
    </a>
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

  // ===== INACTIVE: Hero =====
  if (!active) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        maxWidth: '680px',
        padding: '0 24px',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 6vw, 3rem)',
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          marginBottom: '12px',
          color: '#fff',
        }}>
          Domain name search
        </h1>
        <p style={{
          fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
          color: '#9ca3af',
          textAlign: 'center',
          marginBottom: '32px',
          lineHeight: 1.6,
          maxWidth: '420px',
        }}>
          Find available domains instantly across 20+ extensions
        </p>
        {/* Search box container like IDS */}
        <div style={{
          width: '100%',
          background: '#141414',
          borderRadius: '16px',
          padding: '4px',
          border: '1px solid #222',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={activateSearch}
            onChange={handleChange}
            placeholder="Start typing here..."
            style={{
              width: '100%',
              padding: '18px 20px',
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
    );
  }

  // ===== ACTIVE: Results =====
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '680px',
      flex: 1,
      minHeight: 0,
      boxSizing: 'border-box',
    }}>
      {/* Scrollable results */}
      <div data-scrollable style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 8px',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}>
        {/* Primary result — large domain in status color */}
        {primary && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              fontSize: 'clamp(1.4rem, 4.5vw, 1.8rem)',
              fontWeight: 700,
              color: primary.available ? '#22c55e' : '#ef4444',
              letterSpacing: '-0.03em',
              marginBottom: '10px',
              lineHeight: 1.2,
            }}>
              {primary.full_domain}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <a
                href={`${REGISTRAR_URL}${encodeURIComponent(primary.full_domain)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '0.82rem', fontWeight: 600,
                  textDecoration: 'none',
                  background: primary.available ? '#22c55e' : '#dc2626',
                  color: primary.available ? '#000' : '#fff',
                  minHeight: '40px', boxSizing: 'border-box',
                }}
              >
                {primary.available ? 'Continue' : 'Lookup'} →
              </a>
              <a
                href={`${REGISTRAR_URL}${encodeURIComponent(primary.full_domain)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '0.82rem', fontWeight: 500, color: '#999',
                  textDecoration: 'none',
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  minHeight: '40px', boxSizing: 'border-box',
                }}
              >
                Namecheap →
              </a>
            </div>
          </div>
        )}

        {/* Status legend + section header */}
        {results.length > 0 && !loading && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '4px', padding: '4px 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                Domain extensions
              </span>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>
                ({takenCount > 0 ? `${takenCount} taken` : `${availableCount} available`})
              </span>
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: '0.7rem', color: '#22c55e' }}>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>Taken</span>
              </div>
            </div>
          </div>
        )}

        {/* Extension rows */}
        <div style={{ margin: '0 -12px' }}>
          {rest.map(r => <DomainRow key={r.full_domain} result={r} />)}
        </div>

        {/* Loading skeleton */}
        {loading && results.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '48px', borderRadius: '8px' }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && results.length === 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flex: 1, minHeight: '160px', color: '#666', fontSize: '0.9rem',
          }}>
            Start typing to search domains...
          </div>
        )}
      </div>

      {/* Bottom search bar */}
      <div style={{
        padding: '8px 12px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        borderTop: '1px solid #1e1e1e',
        background: '#000',
        flexShrink: 0,
      }}>
        {loading && progress.total > 0 && (
          <div style={{ marginBottom: '6px' }}>
            <div style={{ height: '2px', background: '#1e1e1e', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{
                width: `${(progress.done / progress.total) * 100}%`,
                height: '100%', background: '#22c55e', transition: 'width 0.1s',
              }} />
            </div>
          </div>
        )}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#141414',
          borderRadius: '10px',
          border: '1px solid #222',
          padding: '0 4px',
        }}>
          <input
            ref={bottomInputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search domains..."
            style={{
              flex: 1,
              padding: '11px 12px',
              fontSize: '0.9rem',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onKeyDown={(e) => { if (e.key === 'Escape') clear(); }}
          />
          <button onClick={clear} style={{
            background: '#2a2a2a', border: 'none', color: '#888',
            width: '28px', height: '28px', borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', minHeight: 'auto', minWidth: 'auto',
            flexShrink: 0,
          }}>✕</button>
        </div>
      </div>
    </div>
  );
}
