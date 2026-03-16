'use client';

import { useState, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Namecheap affiliate via CJ (publisher 101695072)
const AFFILIATE_URL = 'https://www.anrdoezrs.net/click-101695072-15083053';
function buildAffiliateUrl(domain) {
  return `${AFFILIATE_URL}?url=${encodeURIComponent('https://www.namecheap.com/domains/registration/results/?domain=' + domain)}`;
}

export default function DomainAvailabilityChecker() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  const doSearch = async (searchQuery) => {
    const cleaned = searchQuery.trim().toLowerCase();
    const dotIndex = cleaned.indexOf('.');
    const trimmed = dotIndex > 0 ? cleaned.substring(0, dotIndex) : cleaned;
    
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      setError('Please enter at least 2 characters.');
      return;
    }

    // Abort any ongoing request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch(
        `${API_BASE}/api/search/?q=${encodeURIComponent(trimmed)}&scope=all&limit=100&offset=0`,
        { signal: controller.signal }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const domains = data.results || [];
      
      if (domains.length === 0) {
        setError('No results found. Try a different domain name.');
      } else {
        setResults(domains);
      }
      
    } catch (err) {
      if (!controller.signal.aborted) {
        setError('Failed to check domain availability. Please try again.');
        console.error('Search error:', err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      doSearch(query.trim());
    }
  };

  // Sort domains by popularity and availability
  const sortedResults = [...results].sort((a, b) => {
    // First sort by availability (available domains first)
    if (a.available && !b.available) return -1;
    if (!a.available && b.available) return 1;
    
    // Then by TLD popularity
    const popularTlds = ['com', 'net', 'org', 'io', 'ai', 'app', 'co', 'dev', 'tech'];
    const aIndex = popularTlds.indexOf(a.tld);
    const bIndex = popularTlds.indexOf(b.tld);
    const aPopular = aIndex !== -1 ? aIndex : 999;
    const bPopular = bIndex !== -1 ? bIndex : 999;
    
    return aPopular - bPopular;
  });

  const availableCount = results.filter(r => r.available).length;
  const takenCount = results.filter(r => !r.available).length;

  return (
    <div style={{ marginBottom: '64px' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px', color: '#e5e5e5' }}>
              Domain Name to Check
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="yourdomainidea (without extension)"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
              Enter just the domain name (e.g., "mycompany") — we'll check all extensions
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              background: loading || !query.trim() ? '#444' : '#8b5cf6',
              color: '#fff',
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Checking...' : 'Check Availability'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          padding: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#ef4444',
          marginBottom: '24px',
        }}>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginBottom: '20px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#8b5cf6', margin: 0 }}>
              Availability Results
            </h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#22c55e' }}>
                {availableCount} available
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444' }}>
                {takenCount} taken
              </span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {results.length} total
              </span>
            </div>
          </div>

          {/* Available domains first */}
          {availableCount > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#22c55e', marginBottom: '12px' }}>
                ✅ Available Domains ({availableCount})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
                {sortedResults.filter(r => r.available).map(result => (
                  <a
                    key={result.full_domain}
                    href={buildAffiliateUrl(result.full_domain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#22c55e', flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: '1rem', fontWeight: 500, color: '#22c55e',
                      }}>
                        {result.full_domain}
                      </span>
                    </div>
                    <div style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#22c55e',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}>
                      Register →
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Taken domains */}
          {takenCount > 0 && (
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ef4444', marginBottom: '12px' }}>
                ❌ Taken Domains ({takenCount})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
                {sortedResults.filter(r => !r.available).slice(0, 20).map(result => (
                  <div
                    key={result.full_domain}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#ef4444', flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: '1rem', fontWeight: 500, color: '#ef4444',
                      }}>
                        {result.full_domain}
                      </span>
                    </div>
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}>
                      Taken
                    </div>
                  </div>
                ))}
              </div>
              {takenCount > 20 && (
                <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                  ... and {takenCount - 20} more taken domains
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '24px', padding: '16px', background: '#111', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: '#8b5cf6' }}>
              💡 What to do next
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#ccc', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <li>Click any available domain to register it instantly</li>
              <li>If your preferred .com is taken, consider .io, .ai, .co, or .app</li>
              <li>Try variations like adding "get", "try", "my" or "app" to your name</li>
              <li>Check our <a href="/domain-generator" style={{ color: '#8b5cf6', textDecoration: 'none' }}>domain generator</a> for more ideas</li>
            </ul>
          </div>
        </div>
      )}

      <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', lineHeight: 1.6 }}>
        🔄 Availability data is checked in real-time from domain registries.
        <br />
        Popular names get registered quickly — secure your domain today!
      </div>
    </div>
  );
}