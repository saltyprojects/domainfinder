'use client';

import { useState, useEffect, useRef } from 'react';
import { DomainResult } from './DomainResult';
import { Suggestions } from './Suggestions';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function SearchDomains() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim().toLowerCase().split('.')[0];
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      setError(null);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/search/?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.results);
        setSearched(true);
      } catch {
        setError('Failed to search. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const available = results.filter(r => r.available);
  const taken = results.filter(r => !r.available);

  return (
    <div style={{ width: '100%', maxWidth: 'var(--max-width)' }}>
      <div style={{ position: 'relative' }}>
        <svg
          style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            color: 'var(--text-dim)',
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your next domain..."
          autoFocus
          style={{
            width: '100%',
            padding: '18px 20px 18px 48px',
            fontSize: '1.1rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text)',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--green)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
        {loading && (
          <div
            className="pulse"
            style={{
              position: 'absolute',
              right: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            Searching...
          </div>
        )}
      </div>

      {error && (
        <p style={{ textAlign: 'center', color: 'var(--red)', marginTop: '16px', fontSize: '0.9rem' }}>
          {error}
        </p>
      )}

      {searched && results.length > 0 && (
        <div className="fade-in" style={{ marginTop: '24px' }}>
          {/* Summary */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '16px',
            fontSize: '0.85rem',
          }}>
            <span style={{ color: 'var(--green)' }}>
              ● {available.length} available
            </span>
            <span style={{ color: 'var(--text-dim)' }}>
              ● {taken.length} taken
            </span>
          </div>

          {/* Available domains */}
          {available.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {available.map((r) => (
                <DomainResult key={r.full_domain} result={r} />
              ))}
            </div>
          )}

          {/* Taken domains */}
          {taken.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '4px',
                marginTop: '8px',
              }}>
                Taken
              </p>
              {taken.map((r) => (
                <DomainResult key={r.full_domain} result={r} />
              ))}
            </div>
          )}
        </div>
      )}

      {searched && <Suggestions query={query} />}
    </div>
  );
}
