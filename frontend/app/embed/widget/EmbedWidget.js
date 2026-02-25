'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function EmbedWidget() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Read accent/bg from URL params
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const accent = params.get('accent') || '#22c55e';
  const bg = params.get('bg') || '#111111';

  const search = async () => {
    const name = query.trim().toLowerCase().split('.')[0];
    if (!name || name.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/search/?q=${encodeURIComponent(name)}`);
      const data = await res.json();
      const com = data.results?.find(r => r.tld === 'com');
      setResult(com || null);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: '-apple-system, system-ui, sans-serif',
      background: bg,
      padding: '16px',
      borderRadius: '12px',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      minHeight: '60px',
    }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && search()}
        placeholder="Check domain availability..."
        style={{
          flex: 1, padding: '10px 14px', fontSize: '0.95rem',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px', color: '#fff', outline: 'none',
        }}
      />
      <button onClick={search} disabled={loading} style={{
        padding: '10px 18px', background: accent, color: '#000',
        border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}>
        {loading ? '...' : 'Check'}
      </button>

      {result && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
          color: result.available ? accent : '#ef4444',
        }}>
          {result.full_domain}: {result.available ? '✓ Available' : '✗ Taken'}
        </span>
      )}

      <a href="https://domydomains.com" target="_blank" rel="noopener noreferrer"
        style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', marginLeft: '4px' }}>
        by DomyDomains
      </a>
    </div>
  );
}
