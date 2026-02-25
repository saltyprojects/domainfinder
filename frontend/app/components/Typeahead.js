'use client';

import { useState, useEffect, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function Typeahead({ query, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query?.trim().toLowerCase().split('.')[0];
    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/suggestions/?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const avail = (data.suggestions || []).filter(s => s.available).slice(0, 8);
        setSuggestions(avail);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  if (!query || query.trim().length < 2 || suggestions.length === 0) return null;

  return (
    <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginRight: '4px' }}>💡 Try:</span>
      {suggestions.map(s => (
        <button
          key={s.full_domain}
          onClick={() => onSelect(s.name || s.full_domain.split('.')[0])}
          style={{
            padding: '5px 12px', background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '16px', fontSize: '0.8rem', color: 'var(--green)', cursor: 'pointer',
            fontWeight: 500, transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.target.style.background = 'var(--green-dim)'; e.target.style.borderColor = 'rgba(34,197,94,0.3)'; }}
          onMouseLeave={(e) => { e.target.style.background = 'var(--surface)'; e.target.style.borderColor = 'var(--border)'; }}
        >
          {s.full_domain}
        </button>
      ))}
    </div>
  );
}
