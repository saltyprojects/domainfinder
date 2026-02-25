'use client';

import { useState, useEffect, useRef } from 'react';
import { DomainResult } from './DomainResult';
import { SocialResult } from './SocialResult';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function SearchDomains() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [social, setSocial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim().toLowerCase().split('.')[0];
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      setSocial([]);
      setError(null);
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
        setSocial(data.social || []);
      } catch (err) {
        setError('Failed to search. Please try again.');
        setResults([]);
        setSocial([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div style={{ width: '100%', maxWidth: '640px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a domain name..."
        autoFocus
        style={{
          width: '100%',
          padding: '16px 20px',
          fontSize: '1.1rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--text)',
          outline: 'none',
        }}
      />

      {loading && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px' }}>
          Searching...
        </p>
      )}

      {error && (
        <p style={{ textAlign: 'center', color: 'var(--red)', marginTop: '20px' }}>
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div style={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {results.map((r) => (
            <DomainResult key={r.full_domain} result={r} />
          ))}
        </div>
      )}

      {social.length > 0 && (
        <div style={{ marginTop: '32px', width: '100%' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-muted)' }}>
            Social Media Handles
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            {social.map((s) => (
              <SocialResult key={s.platform} result={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
