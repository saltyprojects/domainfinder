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
        height: '32px',
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
          fontSize: '0.9rem', fontWeight: 450,
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
          fontSize: '0.7rem', fontWeight: 600,
          color: available ? '#22c55e' : '#ef4444',
          lineHeight: '22px',
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
function ExtensionsView({ results, isMultiColumn }) {
  const categories = {
    'Popular': ['com','net','org','io','ai','dev','app','co','xyz','me','tech','info','biz','cloud','gg','cc','tv'],
    'Business': ['company','business','agency','solutions','services','consulting','ventures','enterprise','partners','inc','ltd','corp'],
    'Tech': ['dev','app','tech','cloud','code','software','systems','digital','network'],
    'Creative': ['design','studio','media','art','photography','film','music','video'],
    'Commerce': ['store','shop','market','buy','sale','boutique','luxury','deals'],
  };
  const map = {};
  results.forEach(r => { map[r.tld] = r; });

  return (
    <div style={{ padding: '4px 0' }}>
      {Object.entries(categories).map(([cat, tlds]) => {
        const items = tlds.map(t => map[t]).filter(Boolean);
        if (!items.length) return null;
        return (
          <div key={cat} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{cat}</span>
              <span style={{ fontSize: '0.7rem', color: '#666' }}>{items.filter(r => !r.available).length} taken</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMultiColumn ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: '6px' }}>
              {items.map(r => (
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
      })}
    </div>
  );
}

// Generator View — name variations
function GeneratorView({ query, isMultiColumn }) {
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
    <div style={{ display: 'grid', gridTemplateColumns: isMultiColumn ? 'repeat(3,1fr)' : '1fr', gap: '2px' }}>
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
function AftermarketView({ query, isMultiColumn }) {
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
    <div style={{ display: 'grid', gridTemplateColumns: isMultiColumn ? 'repeat(3,1fr)' : '1fr', gap: '2px' }}>
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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [isMultiColumn, setIsMultiColumn] = useState(false);
  const inputRef = useRef(null);
  const bottomInputRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Responsive detection - enable 2-column layout at tablet (768px+) like IDS
  useEffect(() => {
    const updateMultiColumn = () => {
      setIsMultiColumn(window.innerWidth >= 768);
    };
    
    updateMultiColumn(); // Initial check
    window.addEventListener('resize', updateMultiColumn);
    return () => window.removeEventListener('resize', updateMultiColumn);
  }, []);

  const doSearch = (q) => {
    const trimmed = q.trim().toLowerCase().split('.')[0];
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      return;
    }

    if (eventSourceRef.current) eventSourceRef.current.close();
    setLoading(true);
    setResults([]);

    fetch(`${API_BASE}/api/search/?q=${encodeURIComponent(trimmed)}&scope=all`)
      .then(r => r.json())
      .then(data => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
    if (eventSourceRef.current) eventSourceRef.current.close();
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
        maxWidth: 'min(90vw, max(680px, 50vw))',
        padding: 'clamp(20px, 4vh, 40px) clamp(20px, 4vw, 60px) clamp(20px, 4vh, 40px)',
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
        }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={activateSearch}
            onChange={handleChange}
            placeholder="Search for a domain name..."
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 'clamp(0.95rem, 2.8vw, 1.1rem)',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
              borderRadius: '12px',
            }}
          />
        </div>

        {/* Additional content sections matching IDS density */}
        <div style={{
          width: '100%',
          marginTop: 'clamp(40px, 8vh, 80px)',
          textAlign: 'center',
        }}>
          {/* Call-to-action section */}
          <div style={{
            fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
            fontWeight: 600,
            color: '#8b5cf6',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Search millions of domains instantly
          </div>

          <h2 style={{
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            color: '#fff',
            marginBottom: '20px',
          }}>
            The fastest domain search tool on the internet
          </h2>

          <p style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: '#9ca3af',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto',
            marginBottom: '32px',
          }}>
            DomyDomains is the ultimate domain search engine to find, buy, and register available domain names and extensions (TLDs). Our tool shows hundreds of results as you type, surfacing the best domain names at the lowest prices. We are a trusted domain registrar partner.
          </p>

          {/* Feature highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMultiColumn ? 'repeat(3, 1fr)' : '1fr',
            gap: '24px',
            marginTop: '40px',
            maxWidth: '800px',
            margin: '40px auto 0',
          }}>
            <div 
              style={{
                padding: '24px 16px',
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2rem',
                marginBottom: '12px',
                transition: 'transform 0.3s ease',
              }}>⚡</div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '8px',
              }}>
                Instant Results
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}>
                Search results appear as you type, no waiting required
              </div>
            </div>

            <div 
              style={{
                padding: '24px 16px',
                background: 'rgba(34, 197, 94, 0.05)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2rem',
                marginBottom: '12px',
                transition: 'transform 0.3s ease',
              }}>🔍</div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '8px',
              }}>
                400+ Extensions
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}>
                Support for all major TLDs and new domain extensions
              </div>
            </div>

            <div 
              style={{
                padding: '24px 16px',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2rem',
                marginBottom: '12px',
                transition: 'transform 0.3s ease',
              }}>💎</div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '8px',
              }}>
                Best Prices
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}>
                Competitive pricing through trusted registrar partners
              </div>
            </div>
          </div>
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
      maxWidth: 'min(90vw, max(680px, 50vw))',
      flex: 1,
      minHeight: 0,
      boxSizing: 'border-box',
    }}>
      {/* Scrollable results */}
      <div data-scrollable style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 16px 6px',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}>
        {/* Primary result — large domain in status color */}
        {primary && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{
              fontSize: 'clamp(1.4rem, 4.5vw, 1.8rem)',
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
                  fontSize: '0.78rem', fontWeight: 600,
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
                  fontSize: '0.78rem', fontWeight: 500, color: '#999',
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
          <ExtensionsView results={results} isMultiColumn={isMultiColumn} />
        )}

        {/* Generator tab */}
        {!loading && activeTab === 'generator' && query.length >= 2 && (
          <GeneratorView query={query} isMultiColumn={isMultiColumn} />
        )}

        {/* Aftermarket tab */}
        {!loading && activeTab === 'aftermarket' && query.length >= 2 && (
          <AftermarketView query={query} isMultiColumn={isMultiColumn} />
        )}

        {/* Search tab — results grid */}
        {results.length > 0 && !loading && activeTab === 'search' && (
          <>
            <div style={{
              display: isMultiColumn ? 'grid' : 'block',
              gridTemplateColumns: isMultiColumn ? '1fr 1fr' : '1fr',
              gap: isMultiColumn ? '24px' : '0',
              marginBottom: '8px',
            }}>
              {/* Left Column: Domain Extensions */}
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '6px', padding: '2px 0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                      Domain extensions
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                      ({rest.filter(r => r.available).length} available, {rest.filter(r => !r.available).length} taken)
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                      <span style={{ fontSize: '0.7rem', color: '#22c55e' }}>Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                      <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>Taken</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: isMultiColumn ? 'grid' : 'block',
                  gridTemplateColumns: isMultiColumn ? '1fr 1fr' : '1fr',
                  gap: isMultiColumn ? '0 16px' : '0',
                  margin: isMultiColumn ? '0' : '0 -12px',
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
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                        Premium domains
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>
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
                          height: '32px',
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
                            fontSize: '0.9rem', fontWeight: 450,
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
                            fontSize: '0.8rem', fontWeight: 600,
                            color: '#3b82f6',
                          }}>
                            {premium.price}
                          </span>
                          <div style={{
                            display: 'flex', alignItems: 'center',
                            background: '#1a1a1a',
                            borderRadius: '4px',
                            height: '22px',
                            padding: '0 8px',
                            transition: 'all 0.2s ease',
                          }}>
                            <span style={{
                              fontSize: '0.7rem', fontWeight: 600,
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

        {/* Empty state — only on search tab */}
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
      </div>

      {/* Bottom search bar */}
      <div style={{
        padding: '8px 12px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        borderTop: '1px solid #1e1e1e',
        background: '#000',
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
