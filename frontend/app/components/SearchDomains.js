'use client';

import { useState, useRef, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const REGISTRAR_URL = 'https://www.namecheap.com/domains/registration/results/?domain=';

function DomainRow({ result }) {
  const { full_domain, available } = result;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: available ? 'var(--green)' : 'var(--red)',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: '1rem',
          fontWeight: 500,
          color: available ? 'var(--text)' : 'var(--text-muted)',
        }}>
          {full_domain}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a
          href={`${REGISTRAR_URL}${encodeURIComponent(full_domain)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '6px 20px',
            background: available ? 'var(--green)' : 'var(--surface-hover)',
            color: available ? '#000' : 'var(--text-muted)',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
            border: available ? 'none' : '1px solid var(--border)',
          }}
        >
          {available ? 'Register' : 'Lookup'}
        </a>
      </div>
    </div>
  );
}

function PrimaryResult({ result }) {
  if (!result) return null;
  const { full_domain, available } = result;
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        fontWeight: 800,
        color: available ? 'var(--green)' : 'var(--red)',
        marginBottom: '12px',
      }}>
        {full_domain}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <a
          href={`${REGISTRAR_URL}${encodeURIComponent(full_domain)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 28px',
            background: available ? 'var(--green)' : 'var(--surface-hover)',
            color: available ? '#000' : 'var(--text)',
            borderRadius: '24px',
            fontSize: '0.9rem',
            fontWeight: 700,
            textDecoration: 'none',
            border: available ? 'none' : '1px solid var(--border)',
          }}
        >
          {available ? 'Register' : 'Lookup'}
        </a>
        {!available && (
          <span style={{
            padding: '10px 28px',
            background: 'var(--surface)',
            color: 'var(--text-muted)',
            borderRadius: '24px',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: '1px solid var(--border)',
          }}>
            Taken
          </span>
        )}
      </div>
    </div>
  );
}

export function SearchDomains() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const inputRef = useRef(null);
  const eventSourceRef = useRef(null);
  const resultsRef = useRef(null);

  const doSearch = (q) => {
    const trimmed = q.trim().toLowerCase().split('.')[0];
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    if (eventSourceRef.current) eventSourceRef.current.close();

    setLoading(true);
    setSearched(true);
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

  // Sort: .com first, then available first
  const sorted = [...results].sort((a, b) => {
    if (a.tld === 'com') return -1;
    if (b.tld === 'com') return 1;
    if (a.available !== b.available) return a.available ? -1 : 1;
    return 0;
  });

  const primary = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: searched ? 'calc(100vh - 60px)' : 'auto',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      boxSizing: 'border-box',
    }}>
      {/* Results area - scrollable */}
      {searched && (
        <div ref={resultsRef} style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 16px',
        }}>
          {/* Primary .com result */}
          {primary && <PrimaryResult result={primary} />}

          {/* Extensions list */}
          {rest.length > 0 && (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Domain extensions</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  {results.filter(r => r.available).length} available
                </span>
              </div>
              {rest.map(r => <DomainRow key={r.full_domain} result={r} />)}
            </>
          )}

          {/* Loading skeleton */}
          {loading && results.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '48px', borderRadius: '8px' }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search bar - at bottom when results showing, centered when not */}
      <div style={{
        padding: searched ? '12px 16px' : '0 16px',
        borderTop: searched ? '1px solid var(--border)' : 'none',
        background: 'var(--bg)',
        ...(searched ? { position: 'sticky', bottom: 0 } : {}),
      }}>
        {/* Progress bar */}
        {loading && progress.total > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ height: '2px', background: 'var(--border)', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{
                width: `${(progress.done / progress.total) * 100}%`,
                height: '100%', background: 'var(--green)',
                transition: 'width 0.15s',
              }} />
            </div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {searched && (
            <button
              onClick={() => { setQuery(''); setSearched(false); setResults([]); inputRef.current?.focus(); }}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                fontSize: '1.2rem', cursor: 'pointer', padding: '4px',
              }}
            >
              ←
            </button>
          )}
          <input
            ref={inputRef} type="text" value={query}
            onChange={handleChange}
            placeholder="Search domains..."
            autoFocus
            style={{
              flex: 1, padding: '14px 16px', fontSize: '1rem',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', color: 'var(--text)', outline: 'none',
              boxSizing: 'border-box',
            }}
            onKeyDown={(e) => { if (e.key === 'Escape') { setQuery(''); setSearched(false); setResults([]); } }}
          />
        </div>
      </div>
    </div>
  );
}
