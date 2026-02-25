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
      padding: '12px 16px',
      background: available ? 'var(--green-dim)' : 'var(--surface)',
      border: `1px solid ${available ? 'rgba(34, 197, 94, 0.15)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: available ? 'var(--green)' : 'var(--red)',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: '0.95rem',
          fontWeight: available ? 600 : 400,
          color: available ? 'var(--text)' : 'var(--text-muted)',
        }}>
          {full_domain}
        </span>
      </div>
      {available ? (
        <a
          href={`${REGISTRAR_URL}${encodeURIComponent(full_domain)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '6px 16px', background: 'var(--green)', color: '#000',
            borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
            textDecoration: 'none', flexShrink: 0,
          }}
        >
          Register →
        </a>
      ) : (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', flexShrink: 0 }}>Taken</span>
      )}
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

  const doSearch = (q) => {
    const trimmed = q.trim().toLowerCase().split('.')[0];
    if (!trimmed || trimmed.length < 2) return;

    // Close any existing stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

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
      // Fallback to batch API
      if (received.length === 0) {
        fetch(`${API_BASE}/api/search/?q=${encodeURIComponent(trimmed)}`)
          .then(r => r.json())
          .then(data => {
            setResults(data.results || []);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    };
  };

  // Debounce search
  const debounceRef = useRef(null);
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const available = results.filter(r => r.available);
  const taken = results.filter(r => !r.available);

  return (
    <div style={{ width: '100%', maxWidth: 'var(--max-width)', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative' }}>
        <svg style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'var(--text-dim)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef} type="text" value={query}
          onChange={handleChange}
          placeholder="Search for your next domain..."
          autoFocus
          style={{
            width: '100%', padding: '18px 20px 18px 48px', fontSize: '1.1rem',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', color: 'var(--text)', outline: 'none',
            transition: 'border-color 0.2s', boxSizing: 'border-box',
          }}
          onKeyDown={(e) => { if (e.key === 'Escape') { setQuery(''); setSearched(false); setResults([]); } }}
        />
        {loading && (
          <div className="pulse" style={{
            position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.75rem', color: 'var(--text-muted)',
          }}>
            Searching...
          </div>
        )}
      </div>

      {/* Progress bar */}
      {loading && progress.total > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              width: `${(progress.done / progress.total) * 100}%`,
              height: '100%', background: 'var(--green)',
              transition: 'width 0.2s', borderRadius: '2px',
            }} />
          </div>
        </div>
      )}

      {/* Results */}
      {searched && results.length > 0 && (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Available first, then taken */}
          {available.map(r => <DomainRow key={r.full_domain} result={r} />)}
          {taken.map(r => <DomainRow key={r.full_domain} result={r} />)}
        </div>
      )}

      {/* No results */}
      {searched && !loading && results.length === 0 && (
        <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No results found. Try a different name.
        </div>
      )}
    </div>
  );
}
