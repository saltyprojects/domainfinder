'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DomainResult } from './DomainResult';
import { Suggestions } from './Suggestions';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const LOADING_MESSAGES = [
  '🏠 Domy is knocking on doors...',
  '🔍 Checking the neighborhood...',
  '🏘️ Exploring every street...',
  '📬 Peeking in the mailbox...',
  '🗺️ Mapping the domain landscape...',
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'tld', label: 'TLD (A→Z)' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
];

function getInitialQuery() {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('q') || '';
}

function getSearchHistory() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('domy_history') || '[]').slice(0, 8); }
  catch { return []; }
}

function saveSearchHistory(query) {
  if (typeof window === 'undefined' || !query) return;
  try {
    const hist = getSearchHistory().filter(h => h !== query);
    hist.unshift(query);
    localStorage.setItem('domy_history', JSON.stringify(hist.slice(0, 8)));
  } catch {}
}

function sortResults(results, sort) {
  const sorted = [...results];
  if (sort === 'tld') sorted.sort((a, b) => a.tld.localeCompare(b.tld));
  else if (sort === 'price-asc') sorted.sort((a, b) => (a.price || 999) - (b.price || 999));
  else if (sort === 'price-desc') sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
  return sorted;
}

export function SearchDomains() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [sort, setSort] = useState('default');
  const [hiddenTlds, setHiddenTlds] = useState(new Set());
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const initialized = useRef(false);
  const abortRef = useRef(null);

  useEffect(() => {
    const initial = getInitialQuery();
    if (initial) setQuery(initial);
    setHistory(getSearchHistory());
    initialized.current = true;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setQuery(''); inputRef.current?.focus(); }
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault(); inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }

    const trimmed = query.trim().toLowerCase().split('.')[0];
    if (!trimmed || trimmed.length < 2) {
      setResults([]); setError(null); setSearched(false); setProgress({ done: 0, total: 0 });
      return;
    }

    const url = new URL(window.location);
    url.searchParams.set('q', trimmed);
    window.history.replaceState({}, '', url);

    debounceRef.current = setTimeout(() => {
      setLoading(true); setError(null); setResults([]); setSearched(true);
      setProgress({ done: 0, total: 0 });

      // Try SSE first, fall back to batch
      const abort = new AbortController();
      abortRef.current = abort;

      const eventSource = new EventSource(`${API_BASE}/api/search/stream/?q=${encodeURIComponent(trimmed)}`);
      let received = [];

      eventSource.onmessage = (event) => {
        if (abort.signal.aborted) { eventSource.close(); return; }
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
            saveSearchHistory(trimmed);
            setHistory(getSearchHistory());
          }
        } catch {}
      };

      eventSource.onerror = () => {
        eventSource.close();
        // Fallback to batch endpoint
        fetch(`${API_BASE}/api/search/?q=${encodeURIComponent(trimmed)}`, { signal: abort.signal })
          .then(res => { if (!res.ok) throw new Error(); return res.json(); })
          .then(data => {
            setResults(data.results);
            setProgress({ done: data.results.length, total: data.results.length });
            saveSearchHistory(trimmed);
            setHistory(getSearchHistory());
          })
          .catch(err => {
            if (!abort.signal.aborted) setError('Failed to search. Please try again.');
          })
          .finally(() => { if (!abort.signal.aborted) setLoading(false); });
      };

      // Cleanup on abort
      abort.signal.addEventListener('abort', () => eventSource.close());
    }, 300);

    return () => {
      clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query]);

  const copyDomain = useCallback((domain) => {
    navigator.clipboard.writeText(domain);
    setCopied(domain);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const allTlds = [...new Set(results.map(r => r.tld))];
  const toggleTld = (tld) => {
    setHiddenTlds(prev => { const n = new Set(prev); n.has(tld) ? n.delete(tld) : n.add(tld); return n; });
  };

  let filtered = results.filter(r => !hiddenTlds.has(r.tld));
  filtered = sortResults(filtered, sort);
  const available = filtered.filter(r => r.available);
  const taken = filtered.filter(r => !r.available);

  const loadingMsg = LOADING_MESSAGES[Math.floor(Date.now() / 2000) % LOADING_MESSAGES.length];

  return (
    <div style={{ width: '100%', maxWidth: 'var(--max-width)' }}>
      <div style={{ position: 'relative' }}>
        <svg style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'var(--text-dim)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef} type="text" value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          placeholder="Search for your next domain... (press / to focus)"
          autoFocus
          style={{
            width: '100%', padding: '18px 20px 18px 48px', fontSize: '1.1rem',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', color: 'var(--text)', outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onKeyDown={(e) => { if (e.key === 'Escape') setQuery(''); }}
        />
        {loading && (
          <div className="pulse" style={{
            position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.85rem', color: 'var(--text-muted)',
          }}>
            {loadingMsg}
          </div>
        )}

        {showHistory && !searched && history.length > 0 && query.length < 2 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', zIndex: 10, overflow: 'hidden',
          }}>
            <div style={{ padding: '8px 14px', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recent searches
            </div>
            {history.map(h => (
              <div key={h} onMouseDown={() => setQuery(h)}
                style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-muted)', transition: 'background 0.1s' }}
                onMouseEnter={(e) => e.target.style.background = 'var(--green-dim)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                🕐 {h}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skeleton loading state */}
      {loading && results.length === 0 && query.trim().length >= 2 && (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '48px', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {loading && progress.total > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
            <span>Checking domains...</span>
            <span>{progress.done}/{progress.total}</span>
          </div>
          <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: 'var(--green)', borderRadius: '2px',
              width: `${(progress.done / progress.total) * 100}%`,
              transition: 'width 0.15s ease-out',
            }} />
          </div>
        </div>
      )}

      {error && (
        <p style={{ textAlign: 'center', color: 'var(--red)', marginTop: '16px', fontSize: '0.9rem' }}>{error}</p>
      )}

      {searched && results.length > 0 && (
        <div className="fade-in" style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            {allTlds.map(tld => (
              <button key={tld} onClick={() => toggleTld(tld)} style={{
                padding: '4px 12px', fontSize: '0.8rem', fontWeight: 500, borderRadius: '16px',
                cursor: 'pointer', transition: 'all 0.15s', border: '1px solid var(--border)',
                background: hiddenTlds.has(tld) ? 'transparent' : 'var(--green-dim)',
                color: hiddenTlds.has(tld) ? 'var(--text-dim)' : 'var(--green)',
                opacity: hiddenTlds.has(tld) ? 0.5 : 1,
                textDecoration: hiddenTlds.has(tld) ? 'line-through' : 'none',
              }}>
                .{tld}
              </button>
            ))}
            <div style={{ marginLeft: 'auto' }}>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
                padding: '4px 8px', fontSize: '0.8rem', background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer',
              }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--green)' }}>● {available.length} available</span>
            <span style={{ color: 'var(--text-dim)' }}>● {taken.length} taken</span>
            {hiddenTlds.size > 0 && (
              <button onClick={() => setHiddenTlds(new Set())} style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline',
              }}>Clear filters</button>
            )}
          </div>

          {available.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {available.map((r) => (
                <DomainResult key={r.full_domain} result={r} onCopy={() => copyDomain(r.full_domain)} copied={copied === r.full_domain} />
              ))}
            </div>
          )}

          {taken.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', marginTop: '8px' }}>Taken</p>
              {taken.map((r) => (
                <DomainResult key={r.full_domain} result={r} onCopy={() => copyDomain(r.full_domain)} copied={copied === r.full_domain} />
              ))}
            </div>
          )}
        </div>
      )}

      {searched && <Suggestions query={query} />}
    </div>
  );
}
