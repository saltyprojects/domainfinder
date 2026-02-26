'use client';

import { useState, useRef, useEffect } from 'react';

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
        padding: '0 12px',
        height: 'clamp(32px, 4vw, 46px)',
        borderRadius: '4px',
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
          fontSize: 'clamp(0.9rem, 1.4vw, 1.35rem)', fontWeight: 450,
          color: '#e5e5e5',
        }}>
          {full_domain}
        </span>
      </div>
      {/* Split button */}
      <div 
        style={{
          display: 'flex', alignItems: 'center',
          background: '#1a1a1a',
          borderRadius: '4px',
          overflow: 'hidden',
          height: '22px',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#2a2a2a';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#1a1a1a';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span style={{
          padding: '0 8px',
          fontSize: 'clamp(0.7rem, 1vw, 1rem)', fontWeight: 600,
          color: available ? '#22c55e' : '#ef4444',
          lineHeight: 'clamp(22px, 2.5vw, 30px)',
          transition: 'color 0.2s ease',
        }}>
          {available ? 'Continue' : 'Lookup'}
        </span>
        <div style={{
          width: '1px', height: '12px',
          background: '#333',
          transition: 'background 0.2s ease',
        }} />
        <span style={{
          padding: '0 6px',
          fontSize: '0.6rem',
          color: '#444',
          lineHeight: '22px',
          transition: 'color 0.2s ease',
        }}>▾</span>
      </div>
    </a>
  );
}

// Extensions View — colored TLD cards grouped by category
function ExtensionsView({ results, isMultiColumn, columns = 1 }) {
  // Show all results as extension cards — available first, then taken
  const sorted = [...results].sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1;
    return a.tld.localeCompare(b.tld);
  });
  const availCount = results.filter(r => r.available).length;
  const takenCount = results.filter(r => !r.available).length;

  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{results.length} extensions</span>
        <span style={{ fontSize: '0.7rem', color: '#22c55e' }}>{availCount} available</span>
        <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>{takenCount} taken</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(3, columns + 2)}, 1fr)`, gap: '6px' }}>
        {sorted.map(r => (
          <a key={r.tld} href={`https://www.namecheap.com/domains/registration/results/?domain=${r.full_domain}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '8px', borderRadius: '8px', textDecoration: 'none',
              fontSize: '0.78rem', fontWeight: 600,
              background: r.available ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              color: r.available ? '#22c55e' : '#ef4444',
              border: `1px solid ${r.available ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
            }}>.{r.tld}</a>
        ))}
      </div>
    </div>
  );
}

// Generator View — name variations
function GeneratorView({ query, isMultiColumn, columns = 1 }) {
  const [shown, setShown] = useState(15);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShown(s => s + 15); }, { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  });

  if (!query || query.length < 2) return null;
  const prefixes = ['try','go','use','join','hey','meet','get','my','the','pro','new','web','re'];
  const suffixes = ['hq','tech','studio','site','shop','team','labs','hub','group','cloud','design','media','app','dev','zone'];
  const suggestions = [...prefixes.map(p => `${p}${query}.com`), ...suffixes.map(s => `${query}${s}.com`)];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '2px' }}>
      {suggestions.slice(0, shown).map(d => (
        <a key={d} href={`https://www.namecheap.com/domains/registration/results/?domain=${d}`}
          target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', height: '36px', borderRadius: '4px', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = '#141414'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: '0.85rem', color: '#e5e5e5' }}>{d}</span>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '24px', display: 'flex', alignItems: 'center' }}>
            <span style={{ padding: '0 8px', fontSize: '0.7rem', fontWeight: 600, color: '#22c55e' }}>Continue</span>
            <span style={{ padding: '0 4px', fontSize: '0.55rem', color: '#444' }}>▾</span>
          </div>
        </a>
      ))}
      {suggestions.length > shown && <div ref={ref} style={{ height: '1px' }} />}
    </div>
  );
}

// Aftermarket View — premium domains with prices
function AftermarketView({ query, isMultiColumn, columns = 1 }) {
  const [shown, setShown] = useState(10);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShown(s => s + 10); }, { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  });

  if (!query || query.length < 2) return null;
  const aftermarket = [
    { domain: `${query}pro.com`, price: '$2,500' }, { domain: `get${query}.com`, price: '$4,995' },
    { domain: `${query}hub.com`, price: '$1,200' }, { domain: `the${query}.com`, price: '$12,095' },
    { domain: `${query}cloud.com`, price: '$3,200' }, { domain: `smart${query}.com`, price: '$2,388' },
    { domain: `${query}ai.com`, price: '$8,999' }, { domain: `${query}tech.com`, price: 'Make offer' },
    { domain: `${query}data.com`, price: '$700' }, { domain: `${query}safe.com`, price: '$149' },
    { domain: `cyber${query}.com`, price: '$500,000' }, { domain: `${query}labs.com`, price: '$995' },
    { domain: `${query}digital.com`, price: '$4,095' }, { domain: `${query}group.com`, price: 'Make offer' },
    { domain: `${query}zone.com`, price: '$950' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '2px' }}>
      {aftermarket.slice(0, shown).map(item => (
        <a key={item.domain} href={`https://www.namecheap.com/domains/registration/results/?domain=${item.domain}`}
          target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', height: '36px', borderRadius: '4px', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = '#141414'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }} />
            <span style={{ fontSize: '0.85rem', color: '#e5e5e5' }}>{item.domain}</span>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '24px', display: 'flex', alignItems: 'center' }}>
            <span style={{ padding: '0 8px', fontSize: '0.7rem', fontWeight: 600, color: '#3b82f6' }}>{item.price}</span>
            <span style={{ padding: '0 4px', fontSize: '0.55rem', color: '#444' }}>▾</span>
          </div>
        </a>
      ))}
      {aftermarket.length > shown && <div ref={ref} style={{ height: '1px' }} />}
    </div>
  );
}

export function SearchDomains({ onActiveChange, activeTab = 'search', onTabChange }) {
  const [query, setQuery] = useState(() => {
    if (typeof window !== 'undefined') return new URLSearchParams(window.location.search).get('q') || '';
    return '';
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [active, setActive] = useState(false);
  const [isMultiColumn, setIsMultiColumn] = useState(false);
  const [columns, setColumns] = useState(1); // 1=mobile, 2=tablet, 3=desktop, 4=wide
  const inputRef = useRef(null);
  const bottomInputRef = useRef(null);

  // Responsive detection - enable 2-column layout at tablet (768px+) like IDS
  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      setIsMultiColumn(w >= 768);
      if (w >= 1440) setColumns(4);
      else if (w >= 1024) setColumns(3);
      else if (w >= 768) setColumns(2);
      else setColumns(1);
    };
    
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const abortRef = useRef(null);

  // Auto-search if ?q= present on load
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q && q.trim().length >= 2) {
      setActive(true);
      onActiveChange?.(true);
      doSearch(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const doSearch = (q) => {
    const trimmed = q.trim().toLowerCase().split('.')[0];
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      return;
    }

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('q', trimmed);
    window.history.replaceState({}, '', url);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setResults([]);

    const BATCH = 30;
    let offset = 0;
    let allResults = [];
    setTotalLoaded(0);

    const loadBatch = () => {
      if (offset > 0) setLoadingMore(true);
      fetch(`${API_BASE}/api/search/?q=${encodeURIComponent(trimmed)}&scope=all&limit=${BATCH}&offset=${offset}`, { signal: controller.signal })
        .then(r => r.json())
        .then(data => {
          if (controller.signal.aborted) return;
          const batch = data.results || [];
          allResults = [...allResults, ...batch];
          setResults([...allResults]);
          setTotalLoaded(allResults.length);
          setLoading(false);

          if (batch.length === BATCH) {
            offset += BATCH;
            loadBatch();
          } else {
            setLoadingMore(false);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) { setLoading(false); setLoadingMore(false); }
        });
    };

    loadBatch();
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
    if (abortRef.current) abortRef.current.abort();
    window.history.replaceState({}, '', window.location.pathname);
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
        maxWidth: '720px',
        padding: 'clamp(12px, 3vh, 32px) 16px clamp(12px, 3vh, 32px)',
        boxSizing: 'border-box',
      }}>
        {/* Promotional banner matching IDS style */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '24px',
          padding: '8px 16px',
          marginBottom: '24px',
          fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
          fontWeight: 500,
          color: '#22c55e',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          animation: 'bannerPulse 4s ease-in-out infinite',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.animation = 'none';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.animation = 'bannerPulse 4s ease-in-out infinite';
        }}
        >
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22c55e',
            flexShrink: 0,
          }} />
          <span>We now support 400+ TLDs</span>
          <span style={{ 
            color: '#22c55e', 
            fontWeight: 700,
            background: 'rgba(34, 197, 94, 0.2)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.7rem',
          }}>
            .new
          </span>
          <span style={{ 
            fontSize: '0.8rem', 
            color: '#666',
            transition: 'color 0.2s ease',
          }}>›</span>
        </div>

        <img src="/domy-mascot.png" alt="Domy mascot" style={{
          width: 'clamp(60px, 15vw, 90px)',
          height: 'clamp(60px, 15vw, 90px)',
          borderRadius: '50%',
          marginBottom: '16px',
          filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))',
        }} />
        <h1 style={{
          fontSize: 'clamp(1.6rem, 5.5vw, 2.4rem)',
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          marginBottom: '8px',
          color: '#fff',
        }}>
          Domain name search
        </h1>
        <p style={{
          fontSize: 'clamp(0.8rem, 2.3vw, 0.95rem)',
          color: '#9ca3af',
          textAlign: 'center',
          marginBottom: '32px',
          lineHeight: 1.5,
          maxWidth: '500px',
        }}>
          The fastest domain search tool on the internet. Check domain availability, find popular extensions, and buy premium domains as you type.
        </p>
        {/* Enhanced search box container matching IDS */}
        <div style={{
          width: '100%',
          background: '#1a1a1a',
          borderRadius: '12px',
          border: '1px solid #333',
          overflow: 'hidden',
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
              padding: '18px 16px',
              fontSize: 'clamp(1rem, 3vw, 1.15rem)',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {/* Tabs inside search box */}
          <div style={{
            display: 'flex',
            padding: '0',
            borderTop: '1px solid #2a2a2a',
          }}>
            {[
              { label: 'Search', icon: '🔍', id: 'search' },
              { label: 'Extensions', icon: '🧩', id: 'extensions' },
              { label: 'Generator', icon: '⚡', id: 'generator' },
              { label: 'Premium', icon: '💎', id: 'aftermarket' },
            ].map(tab => (
              <button key={tab.id} onClick={() => { onTabChange?.(tab.id); }} style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                fontSize: 'clamp(0.68rem, 2vw, 0.78rem)',
                fontWeight: 500,
                color: activeTab === tab.id ? '#fff' : '#777',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '10px 0',
                transition: 'all 0.15s',
                borderBottom: activeTab === tab.id ? '2px solid #8b5cf6' : '2px solid transparent',
              }}>
                <span style={{ fontSize: '0.8rem', lineHeight: 1 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab-dependent preview content */}
        <div style={{ width: '100%', marginTop: '32px' }}>
          {activeTab === 'search' && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, color: '#fff', marginBottom: '12px', letterSpacing: '-0.03em' }}>
                Search available domain names
              </h2>
              <p style={{ fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', color: '#9ca3af', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px' }}>
                Our tool instantly shows you every domain and extension combination in real-time as you type.
              </p>
              {/* Mock results preview */}
              <div style={{ background: '#111', borderRadius: '12px', padding: '12px', textAlign: 'left', border: '1px solid #1e1e1e' }}>
                {['boldapparel.com', 'boldapparel.net', 'boldapparel.org', 'boldapparel.ai'].map((d, i) => (
                  <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 8px', borderBottom: i < 3 ? '1px solid #1a1a1a' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: i < 2 ? '#22c55e' : '#ef4444' }} />
                      <span style={{ fontSize: '0.88rem', color: '#e5e5e5' }}>{d}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: i < 2 ? '#22c55e' : '#ef4444' }}>{i < 2 ? 'Continue' : 'Taken'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'extensions' && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, color: '#fff', marginBottom: '12px', letterSpacing: '-0.03em' }}>
                Check 400+ domain extensions
              </h2>
              <p style={{ fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', color: '#9ca3af', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px' }}>
                Instantly browse the most popular, relevant, and cheapest domain extensions for your website.
              </p>
              {/* Mock extension cards */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                {[
                  { tld: '.com', color: '#22c55e' }, { tld: '.net', color: '#22c55e' }, { tld: '.org', color: '#ef4444' },
                  { tld: '.ai', color: '#22c55e' }, { tld: '.io', color: '#ef4444' }, { tld: '.xyz', color: '#22c55e' },
                  { tld: '.app', color: '#22c55e' }, { tld: '.shop', color: '#22c55e' }, { tld: '.info', color: '#ef4444' },
                  { tld: '.co', color: '#ef4444' }, { tld: '.dev', color: '#22c55e' }, { tld: '.site', color: '#22c55e' },
                ].map(ext => (
                  <span key={ext.tld} style={{
                    padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                    background: ext.color === '#22c55e' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                    color: ext.color,
                    border: `1px solid ${ext.color === '#22c55e' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                  }}>{ext.tld}</span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'generator' && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, color: '#fff', marginBottom: '12px', letterSpacing: '-0.03em' }}>
                Domain name generator
              </h2>
              <p style={{ fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', color: '#9ca3af', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px' }}>
                Search through millions of available domains to find creative, short, and unique names.
              </p>
              {/* Mock generator results */}
              <div style={{ background: '#111', borderRadius: '12px', padding: '12px', textAlign: 'left', border: '1px solid #1e1e1e' }}>
                {['getboldapparel', 'myboldapparel', 'boldapparelteam'].map((name, i) => (
                  <div key={name} style={{ padding: '10px 8px', borderBottom: i < 2 ? '1px solid #1a1a1a' : 'none' }}>
                    <span style={{ fontSize: '0.88rem', color: '#e5e5e5', fontWeight: 500 }}>{name}</span>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      {['.com', '.ai', '.io', '.xyz'].map(tld => (
                        <span key={tld} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#1a1a1a', color: '#22c55e' }}>{tld}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'aftermarket' && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, color: '#fff', marginBottom: '12px', letterSpacing: '-0.03em' }}>
                Explore aftermarket domains
              </h2>
              <p style={{ fontSize: 'clamp(0.85rem, 2.2vw, 1rem)', color: '#9ca3af', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px' }}>
                Discover premium domains for sale with existing traffic, backlinks, and domain authority.
              </p>
              {/* Mock premium domains */}
              <div style={{ background: '#111', borderRadius: '12px', padding: '12px', textAlign: 'left', border: '1px solid #1e1e1e' }}>
                {[{ d: 'boldapparel.com', p: '$12,500' }, { d: 'getbold.com', p: '$4,995' }, { d: 'boldstyle.com', p: 'Make offer' }].map((item, i) => (
                  <div key={item.d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 8px', borderBottom: i < 2 ? '1px solid #1a1a1a' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }} />
                      <span style={{ fontSize: '0.88rem', color: '#e5e5e5' }}>{item.d}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#3b82f6' }}>{item.p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
      maxWidth: '100%',
      flex: 1,
      minHeight: 0,
      boxSizing: 'border-box',
    }}>
      {/* Scrollable results */}
      <div data-scrollable style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}>
        {/* Sticky search bar — desktop only */}
        {isMultiColumn && (
          <div style={{
            position: 'sticky', top: 0, zIndex: 5,
            background: '#000', padding: '8px 20px',
            borderBottom: '1px solid #1e1e1e',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: '#141414', borderRadius: '10px',
              border: '1px solid #222', padding: '0 4px',
              maxWidth: '560px',
            }}>
              <input type="text" value={query} onChange={handleChange}
                placeholder="Search domains..." style={{
                  flex: 1, padding: '10px 12px', fontSize: '0.95rem',
                  background: 'transparent', border: 'none', color: '#fff', outline: 'none',
                }}
                onKeyDown={e => { if (e.key === 'Escape') clear(); }}
              />
              <button onClick={clear} style={{
                background: '#2a2a2a', border: 'none', color: '#888',
                width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', flexShrink: 0,
              }}>✕</button>
            </div>
          </div>
        )}

        <div style={{ padding: '8px 16px 6px' }}>
        {/* Primary result — large domain in status color */}
        {primary && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{
              fontSize: 'clamp(1.4rem, 4.5vw, 2.2rem)',
              fontWeight: 700,
              color: primary.available ? '#22c55e' : '#ef4444',
              letterSpacing: '-0.03em',
              marginBottom: '8px',
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
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.78rem, 1vw, 1.1rem)', fontWeight: 600,
                  textDecoration: 'none',
                  background: primary.available ? '#22c55e' : '#dc2626',
                  color: primary.available ? '#000' : '#fff',
                  minHeight: '34px', boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = primary.available 
                    ? '0 4px 12px rgba(34, 197, 94, 0.4)' 
                    : '0 4px 12px rgba(220, 38, 38, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {primary.available ? 'Continue' : 'Lookup'} →
              </a>
              <a
                href={`${REGISTRAR_URL}${encodeURIComponent(primary.full_domain)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.78rem, 1vw, 1.1rem)', fontWeight: 500, color: '#999',
                  textDecoration: 'none',
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  minHeight: '34px', boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#2a2a2a';
                  e.currentTarget.style.borderColor = '#404040';
                  e.currentTarget.style.color = '#ccc';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#1a1a1a';
                  e.currentTarget.style.borderColor = '#2a2a2a';
                  e.currentTarget.style.color = '#999';
                }}
              >
                Namecheap →
              </a>
            </div>
          </div>
        )}

        {/* Extensions tab */}
        {results.length > 0 && !loading && activeTab === 'extensions' && (
          <ExtensionsView results={results} isMultiColumn={isMultiColumn} columns={columns} />
        )}

        {/* Generator tab */}
        {!loading && activeTab === 'generator' && query.length >= 2 && (
          <GeneratorView query={query} isMultiColumn={isMultiColumn} columns={columns} />
        )}

        {/* Aftermarket tab */}
        {!loading && activeTab === 'aftermarket' && query.length >= 2 && (
          <AftermarketView query={query} isMultiColumn={isMultiColumn} columns={columns} />
        )}

        {/* Search tab — results grid */}
        {results.length > 0 && !loading && activeTab === 'search' && (
          <>
            <div style={{
              display: columns >= 2 ? 'grid' : 'block',
              gridTemplateColumns: columns >= 3 ? '2fr 1fr' : columns >= 2 ? '1fr 1fr' : '1fr',
              gap: columns >= 2 ? '24px' : '0',
              marginBottom: '8px',
            }}>
              {/* Left Column: Domain Extensions */}
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '6px', padding: '2px 0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.25rem)', fontWeight: 700, color: '#fff' }}>
                      Domain extensions
                    </span>
                    <span style={{ fontSize: 'clamp(0.8rem, 1vw, 1.15rem)', color: '#666' }}>
                      ({rest.filter(r => r.available).length} available, {rest.filter(r => !r.available).length} taken)
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                      <span style={{ fontSize: 'clamp(0.7rem, 0.9vw, 1rem)', color: '#22c55e' }}>Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                      <span style={{ fontSize: 'clamp(0.7rem, 0.9vw, 1rem)', color: '#ef4444' }}>Taken</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: columns > 1 ? 'grid' : 'block',
                  gridTemplateColumns: columns > 1 ? `repeat(${Math.min(columns, 2)}, 1fr)` : '1fr',
                  gap: columns > 1 ? '0 16px' : '0',
                  margin: columns > 1 ? '0' : '0 -12px',
                }}>
                  {rest.map(r => <DomainRow key={r.full_domain} result={r} />)}
                </div>
              </div>

              {/* Right Column: Premium/Marketplace Domains (tablet 768px+ and desktop) */}
              {isMultiColumn && (
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '6px', padding: '2px 0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.25rem)', fontWeight: 700, color: '#fff' }}>
                        Premium domains
                      </span>
                      <span style={{ fontSize: 'clamp(0.8rem, 1vw, 1.15rem)', color: '#666' }}>
                        (marketplace)
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
                        <span style={{ fontSize: '0.7rem', color: '#3b82f6' }}>Premium</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* Mock premium domains to match IDS layout */}
                    {[
                      { domain: `${query}marketplace.com`, price: '$2,500' },
                      { domain: `${query}hub.com`, price: '$1,200' },
                      { domain: `${query}pro.net`, price: '$850' },
                      { domain: `get${query}.com`, price: '$3,200' },
                      { domain: `${query}zone.com`, price: '$950' },
                    ].filter(d => query && query.length > 1).map((premium, idx) => (
                      <a
                        key={idx}
                        href={`${REGISTRAR_URL}${encodeURIComponent(premium.domain)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 12px',
                          height: 'clamp(32px, 4vw, 46px)',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          transition: 'background 0.12s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: '#3b82f6',
                            flexShrink: 0,
                          }} />
                          <span style={{
                            fontSize: 'clamp(0.9rem, 1.4vw, 1.35rem)', fontWeight: 450,
                            color: '#e5e5e5',
                          }}>
                            {premium.domain}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          flexShrink: 0,
                        }}>
                          <span style={{
                            fontSize: 'clamp(0.8rem, 1.1vw, 1.15rem)', fontWeight: 600,
                            color: '#3b82f6',
                          }}>
                            {premium.price}
                          </span>
                          <div style={{
                            display: 'flex', alignItems: 'center',
                            background: '#1a1a1a',
                            borderRadius: '4px',
                            height: 'clamp(22px, 2.5vw, 30px)',
                            padding: '0 8px',
                            transition: 'all 0.2s ease',
                          }}>
                            <span style={{
                              fontSize: 'clamp(0.7rem, 1vw, 1rem)', fontWeight: 600,
                              color: '#3b82f6',
                            }}>
                              Buy
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Batch loading indicator */}
        {loadingMore && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 0' }}>
            <div style={{
              width: '16px', height: '16px', border: '2px solid #333', borderTopColor: '#8b5cf6',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
            <span style={{ fontSize: '0.78rem', color: '#888' }}>Loading more extensions... ({totalLoaded} loaded)</span>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && results.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="skeleton" 
                style={{ 
                  height: '48px',
                  opacity: 0,
                  animation: `shimmer 1.5s ease-in-out infinite, fadeIn 0.3s ease-out ${i * 0.05}s forwards`
                }} 
              />
            ))}
          </div>
        )}

        {/* Empty state — extensions tab */}
        {!loading && results.length === 0 && activeTab === 'extensions' && (
          <div style={{ padding: '16px 0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Browse 400+ domain extensions</h3>
            <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.5, marginBottom: '16px' }}>
              Type a name above to see availability across every TLD — from .com and .net to .ai, .dev, .shop, and hundreds more.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['.com','.net','.org','.io','.ai','.dev','.app','.co','.xyz','.tech','.shop','.site','.cloud','.design','.store','.online','.gg','.me','.tv','.info'].map(tld => (
                <span key={tld} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>{tld}</span>
              ))}
            </div>
          </div>
        )}

        {/* Empty state — generator tab */}
        {!loading && results.length === 0 && activeTab === 'generator' && (
          <div style={{ padding: '16px 0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Generate domain name ideas</h3>
            <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.5, marginBottom: '16px' }}>
              Enter a keyword and we'll generate creative variations — prefixes like try, get, my and suffixes like hq, hub, labs, pro.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['trycloud.com', 'getcloud.com', 'cloudhq.com', 'cloudlabs.com', 'mycloudapp.com'].map(d => (
                <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '6px', background: '#111' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state — aftermarket/premium tab */}
        {!loading && results.length === 0 && activeTab === 'aftermarket' && (
          <div style={{ padding: '16px 0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Discover premium domains</h3>
            <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.5, marginBottom: '16px' }}>
              Find premium domains for sale with existing traffic and authority. Type a keyword to explore the aftermarket.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[{ d: 'cloudmarket.com', p: '$12,500' }, { d: 'getcloud.io', p: '$4,995' }, { d: 'cloudpro.com', p: 'Make offer' }].map(item => (
                <div key={item.d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderRadius: '6px', background: '#111' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }} />
                    <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{item.d}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#3b82f6' }}>{item.p}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state — search tab */}
        {!loading && results.length === 0 && activeTab === 'search' && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '12px' }}>
              Popular extensions
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {['.com', '.io', '.ai', '.dev', '.app', '.co', '.xyz', '.net', '.org', '.tech', '.gg', '.me'].map(tld => (
                <span key={tld} style={{
                  padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500,
                  background: '#1a1a1a', color: '#aaa', border: '1px solid #2a2a2a',
                }}>{tld}</span>
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: '12px' }}>
              Try searching
            </div>
            {['cloudvault', 'nextshift', 'pixelforge', 'dataflow'].map(term => (
              <div key={term} onClick={() => { setQuery(term); doSearch(term); bottomInputRef.current && (bottomInputRef.current.value = term); }}
                style={{
                  padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem', color: '#ccc',
                  cursor: 'pointer', transition: 'background 0.15s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ color: '#666' }}>🔍</span> {term}
              </div>
            ))}
          </div>
        )}
        </div>{/* close padding wrapper */}
      </div>

      {/* Bottom search bar — mobile only */}
      <div style={{
        padding: '8px 12px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        borderTop: '1px solid #1e1e1e',
        background: '#000',
        display: isMultiColumn ? 'none' : 'block',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#141414',
          borderRadius: '10px',
          border: '1px solid #222',
          padding: '0 4px',
          transition: 'all 0.2s ease',
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
              transition: 'all 0.2s ease',
            }}
            onKeyDown={(e) => { if (e.key === 'Escape') clear(); }}
            onFocus={e => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
              e.currentTarget.parentElement.style.borderColor = '#8b5cf6';
              e.currentTarget.parentElement.style.boxShadow = '0 0 0 1px rgba(139, 92, 246, 0.2)';
            }}
            onBlur={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.parentElement.style.borderColor = '#222';
              e.currentTarget.parentElement.style.boxShadow = 'none';
            }}
          />
          <button 
            onClick={clear} 
            style={{
              background: '#2a2a2a', border: 'none', color: '#888',
              width: '28px', height: '28px', borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', minHeight: 'auto', minWidth: 'auto',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#3a3a3a';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#2a2a2a';
              e.currentTarget.style.color = '#888';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >✕</button>
        </div>
      </div>
    </div>
  );
}
