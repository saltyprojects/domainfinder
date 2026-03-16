'use client';

import { useState, useRef } from 'react';

// Word lists for different categories
const WORD_LISTS = {
  tech: {
    base: ['flow', 'sync', 'code', 'data', 'tech', 'byte', 'node', 'core', 'edge', 'mesh', 'grid', 'link', 'wave', 'flux', 'zoom', 'dash', 'bolt', 'spark', 'beam', 'loop', 'ping', 'stack', 'layer', 'frame', 'build'],
    prefixes: ['auto', 'smart', 'micro', 'nano', 'mega', 'hyper', 'ultra', 'super', 'meta', 'cyber', 'digi', 'neuro', 'quantum', 'turbo'],
    suffixes: ['labs', 'tech', 'soft', 'ware', 'systems', 'works', 'forge', 'studio', 'space', 'hub', 'dev', 'io', 'ai', 'bot', 'app']
  },
  professional: {
    base: ['prime', 'apex', 'summit', 'peak', 'elite', 'crown', 'gold', 'platinum', 'diamond', 'sterling', 'noble', 'royal', 'grand', 'prestige', 'premier', 'executive', 'capital', 'venture', 'global', 'alliance', 'strategic', 'corporate', 'enterprise'],
    prefixes: ['alpha', 'beta', 'delta', 'sigma', 'omega', 'nexus', 'vertex', 'zenith'],
    suffixes: ['group', 'partners', 'associates', 'consulting', 'advisory', 'solutions', 'services', 'corporation', 'enterprises', 'holdings', 'capital', 'ventures']
  },
  creative: {
    base: ['bright', 'spark', 'glow', 'shine', 'beam', 'flash', 'bloom', 'burst', 'rush', 'splash', 'twist', 'blend', 'mix', 'fuse', 'merge', 'craft', 'make', 'build', 'shape', 'mold', 'paint', 'draw', 'sketch', 'design'],
    prefixes: ['super', 'mega', 'epic', 'wild', 'crazy', 'funky', 'groovy', 'jazzy', 'snappy', 'zippy', 'bouncy', 'bubbly'],
    suffixes: ['works', 'studio', 'creative', 'design', 'art', 'craft', 'make', 'shop', 'house', 'space', 'lab', 'spot', 'zone', 'place']
  },
  abstract: {
    base: ['echo', 'wave', 'pulse', 'rise', 'fall', 'flow', 'drift', 'shift', 'turn', 'spin', 'roll', 'fold', 'bend', 'curve', 'line', 'path', 'route', 'way', 'road', 'bridge', 'gate', 'door', 'window', 'view'],
    prefixes: ['zen', 'pure', 'clear', 'deep', 'wide', 'high', 'low', 'soft', 'hard', 'warm', 'cool', 'fresh', 'new', 'old'],
    suffixes: ['form', 'shape', 'mode', 'state', 'phase', 'stage', 'level', 'scale', 'scope', 'range', 'span', 'reach', 'touch', 'feel']
  }
};

// Common extensions to show availability for
const EXTENSIONS = ['.com', '.io', '.ai', '.app', '.co', '.dev', '.tech', '.org', '.net'];

// Namecheap affiliate link
const AFFILIATE_URL = 'https://www.anrdoezrs.net/click-101695072-15083053';
function buildAffiliateUrl(domain) {
  return `${AFFILIATE_URL}?url=${encodeURIComponent('https://www.namecheap.com/domains/registration/results/?domain=' + domain)}`;
}

export default function RandomDomainGenerator() {
  const [style, setStyle] = useState('tech');
  const [length, setLength] = useState('medium');
  const [generatedNames, setGeneratedNames] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const generateNames = () => {
    const wordList = WORD_LISTS[style];
    const names = new Set(); // Use Set to avoid duplicates
    
    const lengthConfig = {
      short: { count: 20, maxLength: 8 },
      medium: { count: 25, maxLength: 12 },
      long: { count: 30, maxLength: 16 }
    };
    
    const config = lengthConfig[length];
    
    // Generate different types of names
    while (names.size < config.count) {
      const rand = Math.random();
      let name = '';
      
      if (rand < 0.3) {
        // Prefix + base word
        const prefix = wordList.prefixes[Math.floor(Math.random() * wordList.prefixes.length)];
        const base = wordList.base[Math.floor(Math.random() * wordList.base.length)];
        name = prefix + base;
      } else if (rand < 0.6) {
        // Base word + suffix
        const base = wordList.base[Math.floor(Math.random() * wordList.base.length)];
        const suffix = wordList.suffixes[Math.floor(Math.random() * wordList.suffixes.length)];
        name = base + suffix;
      } else if (rand < 0.8) {
        // Two base words
        const base1 = wordList.base[Math.floor(Math.random() * wordList.base.length)];
        const base2 = wordList.base[Math.floor(Math.random() * wordList.base.length)];
        name = base1 + base2;
      } else {
        // Single base word (if short enough)
        const base = wordList.base[Math.floor(Math.random() * wordList.base.length)];
        name = base;
      }
      
      // Apply length filter and avoid very short names unless specifically requested
      if (name.length <= config.maxLength && name.length >= 4) {
        names.add(name.toLowerCase());
      }
    }
    
    const nameArray = Array.from(names).slice(0, config.count);
    setGeneratedNames(nameArray);
  };

  const toggleFavorite = (name) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(name)) {
      newFavorites.delete(name);
    } else {
      newFavorites.add(name);
    }
    setFavorites(newFavorites);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
  };

  // Generate initial names
  if (generatedNames.length === 0) {
    generateNames();
  }

  return (
    <div style={{ marginBottom: '64px' }}>
      {/* Controls */}
      <div style={{ 
        background: '#111', 
        border: '1px solid #1e1e1e', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '32px' 
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px', color: '#fff' }}>
          Generation Settings
        </h3>
        
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#e5e5e5' }}>
              Naming Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '0.9rem',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#0a0a0a',
                color: '#fff',
                outline: 'none',
              }}
            >
              <option value="tech">Tech & Startup</option>
              <option value="professional">Professional & Corporate</option>
              <option value="creative">Creative & Fun</option>
              <option value="abstract">Abstract & Modern</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#e5e5e5' }}>
              Name Length
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '0.9rem',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#0a0a0a',
                color: '#fff',
                outline: 'none',
              }}
            >
              <option value="short">Short (4-8 chars)</option>
              <option value="medium">Medium (6-12 chars)</option>
              <option value="long">Long (8-16 chars)</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={generateNames}
              style={{
                width: '100%',
                padding: '10px 20px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                background: '#8b5cf6',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = '#7c3aed'}
              onMouseLeave={(e) => e.target.style.background = '#8b5cf6'}
            >
              Generate New Names
            </button>
          </div>
        </div>
      </div>

      {/* Generated Names */}
      {generatedNames.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#8b5cf6', margin: 0 }}>
              Generated Domain Names ({generatedNames.length})
            </h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                {favorites.size} favorited
              </span>
              <button
                onClick={generateNames}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  background: '#333',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = '#444'}
                onMouseLeave={(e) => e.target.style.background = '#333'}
              >
                🔄 Regenerate
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            {generatedNames.map((name, index) => (
              <div
                key={`${name}-${index}`}
                style={{
                  background: favorites.has(name) ? 'rgba(139, 92, 246, 0.1)' : '#111',
                  border: favorites.has(name) ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid #1e1e1e',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '200px' }}>
                  <button
                    onClick={() => toggleFavorite(name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '4px',
                    }}
                    title={favorites.has(name) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.has(name) ? '⭐' : '☆'}
                  </button>
                  
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                      {name}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {EXTENSIONS.slice(0, 5).map(ext => (
                        <span
                          key={ext}
                          style={{
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                            background: '#333',
                            color: '#ccc',
                            borderRadius: '4px',
                          }}
                        >
                          {name}{ext}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => copyToClipboard(name)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      borderRadius: '4px',
                      border: 'none',
                      background: '#333',
                      color: '#fff',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#444'}
                    onMouseLeave={(e) => e.target.style.background = '#333'}
                    title="Copy to clipboard"
                  >
                    📋 Copy
                  </button>
                  
                  <a
                    href={`/domain-availability?q=${encodeURIComponent(name)}`}
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '4px',
                      background: '#8b5cf6',
                      color: '#fff',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#7c3aed'}
                    onMouseLeave={(e) => e.target.style.background = '#8b5cf6'}
                  >
                    Check Availability
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Favorites Summary */}
          {favorites.size > 0 && (
            <div style={{
              marginTop: '32px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '12px' }}>
                ⭐ Your Favorites ({favorites.size})
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {Array.from(favorites).map(name => (
                  <span
                    key={name}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#8b5cf6',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#8b5cf6' }}>
                💡 Tip: Click "Check Availability" on your favorites to see which domains are available for registration.
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', lineHeight: 1.6, marginTop: '32px' }}>
        🎲 Domain names are generated randomly using curated word lists.
        <br />
        Generate multiple batches to find the perfect name for your project!
      </div>
    </div>
  );
}