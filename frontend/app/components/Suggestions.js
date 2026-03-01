'use client';

import { useState, useEffect, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const AFFILIATE_URL = 'https://www.anrdoezrs.net/click-101695072-15083053';
function buildAffiliateUrl(domain) { return `${AFFILIATE_URL}?url=${encodeURIComponent('https://www.namecheap.com/domains/registration/results/?domain=' + domain)}`; }

export function Suggestions({ query }) {
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
        setSuggestions(data.suggestions || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  if (!query || query.trim().length < 2) return null;
  if (!loading && suggestions.length === 0) return null;

  const available = suggestions.filter(s => s.available);

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '12px',
      }}>
        💡 Name Ideas {loading && <span className="pulse" style={{ marginLeft: '8px' }}>generating...</span>}
      </h3>

      {available.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          {available.map((s) => (
            <a
              key={s.full_domain}
              href={buildAffiliateUrl(s.full_domain)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '8px 14px',
                background: 'var(--green-dim)',
                border: '1px solid rgba(34, 197, 94, 0.15)',
                borderRadius: '20px',
                fontSize: '0.85rem',
                color: 'var(--green)',
                fontWeight: 500,
                transition: 'background 0.15s',
              }}
            >
              {s.full_domain}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
