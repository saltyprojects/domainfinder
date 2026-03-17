'use client';

import { useState, useCallback } from 'react';

const INDUSTRIES = [
  { value: 'tech', label: 'Technology' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'finance', label: 'Finance' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'fashion', label: 'Fashion & Beauty' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel & Hospitality' },
  { value: 'fitness', label: 'Fitness & Sports' },
  { value: 'creative', label: 'Creative & Design' },
  { value: 'ecommerce', label: 'E-Commerce & Retail' },
];

const STYLES = [
  { value: 'modern', label: 'Modern & Minimal' },
  { value: 'playful', label: 'Playful & Fun' },
  { value: 'luxurious', label: 'Luxurious & Premium' },
  { value: 'bold', label: 'Bold & Powerful' },
  { value: 'natural', label: 'Natural & Organic' },
  { value: 'abstract', label: 'Abstract & Unique' },
];

const WORD_POOLS = {
  tech: {
    roots: ['nova', 'pixel', 'sync', 'arc', 'vibe', 'flux', 'dash', 'zen', 'logic', 'orbit', 'pulse', 'shift', 'nexus', 'prism', 'qubit', 'delta', 'ionic', 'helix', 'axiom', 'cipher'],
    suffixes: ['ly', 'fy', 'io', 'ix', 'ify', 'able', 'hub', 'lab', 'base', 'stack', 'flow', 'mind', 'wave', 'link', 'dock'],
    prefixes: ['smart', 'hyper', 'meta', 'neo', 'cyber', 'digi', 'cloud', 'auto', 'rapid', 'insta'],
  },
  health: {
    roots: ['vita', 'bloom', 'glow', 'pure', 'zen', 'calm', 'heal', 'thrive', 'nurture', 'revive', 'renew', 'whole', 'balance', 'serene', 'gentle', 'radiant', 'flourish', 'restore', 'harmony', 'oasis'],
    suffixes: ['well', 'care', 'life', 'body', 'mind', 'soul', 'fit', 'health', 'med', 'cure', 'leaf', 'root', 'seed', 'glow', 'spring'],
    prefixes: ['ever', 'true', 'pure', 'vital', 'bio', 'whole', 'all', 'zen', 'nourish', 'green'],
  },
  finance: {
    roots: ['apex', 'summit', 'vault', 'ledger', 'capital', 'sterling', 'trust', 'forge', 'shield', 'anchor', 'atlas', 'pinnacle', 'vertex', 'meridian', 'compass', 'beacon', 'sentinel', 'crest', 'bastion', 'citadel'],
    suffixes: ['pay', 'fund', 'vest', 'wealth', 'coin', 'bank', 'fin', 'cap', 'worth', 'mint', 'sage', 'prime', 'guard', 'yield', 'profit'],
    prefixes: ['prime', 'alpha', 'gold', 'silver', 'iron', 'oak', 'stone', 'steel', 'noble', 'grand'],
  },
  food: {
    roots: ['savor', 'feast', 'spice', 'zest', 'morsel', 'crumb', 'toast', 'nectar', 'harvest', 'pantry', 'kettle', 'ember', 'basil', 'maple', 'clover', 'honey', 'berry', 'cocoa', 'olive', 'pepper'],
    suffixes: ['bites', 'eats', 'table', 'bowl', 'plate', 'fork', 'kitchen', 'crave', 'taste', 'chef', 'farm', 'garden', 'grove', 'mill', 'hearth'],
    prefixes: ['fresh', 'golden', 'rustic', 'wild', 'sweet', 'savory', 'crisp', 'hearty', 'tender', 'ripe'],
  },
  fashion: {
    roots: ['luxe', 'chic', 'muse', 'aura', 'grace', 'velvet', 'silk', 'pearl', 'rouge', 'ivory', 'onyx', 'jade', 'scarlet', 'sable', 'opulence', 'couture', 'allure', 'glamour', 'mystique', 'elegance'],
    suffixes: ['style', 'wear', 'mode', 'look', 'glam', 'vogue', 'charm', 'lux', 'belle', 'dior', 'thread', 'stitch', 'drape', 'bliss', 'rose'],
    prefixes: ['noir', 'haute', 'bella', 'le', 'la', 'maison', 'petit', 'royal', 'pure', 'divine'],
  },
  education: {
    roots: ['scholar', 'sage', 'quest', 'mentor', 'spark', 'bright', 'mind', 'learn', 'study', 'genius', 'tutor', 'brain', 'know', 'wise', 'skill', 'craft', 'path', 'course', 'lesson', 'insight'],
    suffixes: ['ify', 'ly', 'academy', 'school', 'prep', 'master', 'coach', 'guru', 'class', 'course', 'learn', 'teach', 'study', 'grade', 'pass'],
    prefixes: ['bright', 'sharp', 'quick', 'keen', 'smart', 'clever', 'bold', 'prime', 'top', 'lead'],
  },
  travel: {
    roots: ['voyage', 'wander', 'roam', 'drift', 'cruise', 'trek', 'trail', 'compass', 'horizon', 'sunset', 'aurora', 'terra', 'atlas', 'haven', 'oasis', 'cove', 'isle', 'vista', 'summit', 'ridge'],
    suffixes: ['trip', 'away', 'go', 'fly', 'stay', 'path', 'pass', 'gate', 'port', 'land', 'bay', 'coast', 'shore', 'peak', 'lodge'],
    prefixes: ['far', 'wild', 'true', 'free', 'open', 'blue', 'sky', 'sun', 'star', 'cloud'],
  },
  fitness: {
    roots: ['surge', 'power', 'peak', 'force', 'drive', 'iron', 'steel', 'titan', 'beast', 'grind', 'hustle', 'crush', 'blaze', 'strike', 'charge', 'muscle', 'flex', 'sprint', 'endure', 'vigor'],
    suffixes: ['fit', 'gym', 'lift', 'run', 'pump', 'burn', 'core', 'flex', 'reps', 'gains', 'zone', 'mode', 'strong', 'pro', 'max'],
    prefixes: ['ultra', 'mega', 'super', 'hyper', 'raw', 'pure', 'total', 'max', 'full', 'peak'],
  },
  creative: {
    roots: ['canvas', 'palette', 'sketch', 'frame', 'hue', 'tint', 'shade', 'prism', 'mosaic', 'pixel', 'craft', 'muse', 'dream', 'vision', 'spark', 'bloom', 'create', 'design', 'studio', 'artisan'],
    suffixes: ['works', 'studio', 'lab', 'shop', 'house', 'room', 'space', 'craft', 'art', 'make', 'ink', 'press', 'form', 'type', 'co'],
    prefixes: ['bright', 'bold', 'vivid', 'wild', 'fresh', 'new', 'free', 'true', 'raw', 'indie'],
  },
  ecommerce: {
    roots: ['cart', 'shop', 'deal', 'trade', 'mart', 'store', 'market', 'bazaar', 'outlet', 'depot', 'emporium', 'haul', 'find', 'pick', 'grab', 'snap', 'click', 'order', 'swift', 'express'],
    suffixes: ['store', 'shop', 'mart', 'hub', 'spot', 'zone', 'box', 'drop', 'cart', 'deal', 'buy', 'sell', 'ship', 'pack', 'rack'],
    prefixes: ['flash', 'quick', 'fast', 'easy', 'mega', 'super', 'top', 'best', 'prime', 'smart'],
  },
};

const STYLE_TRANSFORMS = {
  modern: (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
  playful: (name) => {
    // Double a letter or add 'oo'/'ee'
    const transforms = [
      () => name + 'ly',
      () => name + 'oo',
      () => name.replace(/e$/, 'ee'),
      () => name + 'ie',
    ];
    return transforms[Math.floor(Math.random() * transforms.length)]();
  },
  luxurious: (name) => {
    const prefixes = ['Maison ', 'Atelier ', 'Haus ', 'Casa ', ''];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return prefix + name.charAt(0).toUpperCase() + name.slice(1);
  },
  bold: (name) => name.toUpperCase(),
  natural: (name) => {
    const suffixes = [' & Co', ' Collective', ' Naturals', ' Roots', ''];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return name.charAt(0).toUpperCase() + name.slice(1) + suffix;
  },
  abstract: (name) => {
    // Create portmanteau-style names
    const vowels = 'aeiou';
    const len = Math.floor(Math.random() * 3) + 4;
    let result = name.slice(0, Math.min(len, name.length));
    if (!vowels.includes(result[result.length - 1])) {
      result += vowels[Math.floor(Math.random() * vowels.length)];
    }
    return result.charAt(0).toUpperCase() + result.slice(1);
  },
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNames(industry, style, keyword, count = 20) {
  const pool = WORD_POOLS[industry] || WORD_POOLS.tech;
  const transform = STYLE_TRANSFORMS[style] || STYLE_TRANSFORMS.modern;
  const names = new Set();
  let attempts = 0;

  while (names.size < count && attempts < 500) {
    attempts++;
    let name;
    const method = Math.floor(Math.random() * 6);

    switch (method) {
      case 0: // root + suffix
        name = pick(pool.roots) + pick(pool.suffixes);
        break;
      case 1: // prefix + root
        name = pick(pool.prefixes) + pick(pool.roots);
        break;
      case 2: // root only (styled)
        name = pick(pool.roots);
        break;
      case 3: // keyword + suffix (if keyword provided)
        if (keyword) {
          name = keyword.toLowerCase() + pick(pool.suffixes);
        } else {
          name = pick(pool.roots) + pick(pool.suffixes);
        }
        break;
      case 4: // prefix + keyword (if keyword provided)
        if (keyword) {
          name = pick(pool.prefixes) + keyword.toLowerCase();
        } else {
          name = pick(pool.prefixes) + pick(pool.roots);
        }
        break;
      case 5: // two roots combined
        name = pick(pool.roots).slice(0, 4) + pick(pool.roots).slice(-4);
        break;
    }

    name = transform(name);
    if (name.length >= 3 && name.length <= 20) {
      names.add(name);
    }
  }

  return [...names];
}

async function checkDomain(name) {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  try {
    const res = await fetch(`https://dns.google/resolve?name=${clean}.com&type=A`);
    const data = await res.json();
    // Status 3 = NXDOMAIN (likely available)
    return { name: clean + '.com', available: data.Status === 3 };
  } catch {
    return { name: clean + '.com', available: null };
  }
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: '#111',
  border: '1px solid #333',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  color: '#9ca3af',
  marginBottom: '6px',
  fontWeight: 500,
};

const buttonStyle = {
  padding: '12px 32px',
  background: '#8b5cf6',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
};

export default function BrandNameGenerator() {
  const [industry, setIndustry] = useState('tech');
  const [style, setStyle] = useState('modern');
  const [keyword, setKeyword] = useState('');
  const [names, setNames] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [checking, setChecking] = useState({});

  const generate = useCallback(() => {
    const results = generateNames(industry, style, keyword, 24);
    setNames(results);
    setChecking({});
  }, [industry, style, keyword]);

  const toggleFavorite = (name) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const checkAvailability = async (name) => {
    setChecking(prev => ({ ...prev, [name]: 'loading' }));
    const result = await checkDomain(name);
    setChecking(prev => ({ ...prev, [name]: result.available ? 'available' : result.available === false ? 'taken' : 'unknown' }));
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={labelStyle}>Industry</label>
          <select value={industry} onChange={e => setIndustry(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Style</label>
          <select value={style} onChange={e => setStyle(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Keyword (optional)</label>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="e.g. cloud, green, swift"
            style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && generate()}
          />
        </div>
      </div>

      <button onClick={generate} style={buttonStyle}>
        ✨ Generate Brand Names
      </button>

      {/* Results */}
      {names.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Generated Names</h2>
            <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{names.length} results</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {names.map(name => (
              <div key={name} style={{
                background: '#111',
                border: favorites.has(name) ? '1px solid #8b5cf6' : '1px solid #1e1e1e',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{name}</span>
                  <button
                    onClick={() => toggleFavorite(name)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '2px' }}
                    title={favorites.has(name) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.has(name) ? '💜' : '🤍'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => checkAvailability(name)}
                    disabled={checking[name] === 'loading'}
                    style={{
                      padding: '4px 12px',
                      background: 'transparent',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#9ca3af',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    {checking[name] === 'loading' ? '...' : checking[name] === 'available' ? '✅ .com available' : checking[name] === 'taken' ? '❌ .com taken' : 'Check .com'}
                  </button>
                  <button
                    onClick={() => navigator.clipboard?.writeText(name)}
                    style={{
                      padding: '4px 10px',
                      background: 'transparent',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#9ca3af',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {favorites.size > 0 && (
        <div style={{ marginTop: '32px', padding: '20px', background: '#0d0d15', border: '1px solid #8b5cf6', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>💜 Your Favorites ({favorites.size})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[...favorites].map(name => (
              <span key={name} style={{
                padding: '6px 14px',
                background: '#1a1a2e',
                border: '1px solid #8b5cf6',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}>
                {name}
              </span>
            ))}
          </div>
          <button
            onClick={() => {
              const text = [...favorites].join('\n');
              navigator.clipboard?.writeText(text);
            }}
            style={{ ...buttonStyle, marginTop: '12px', padding: '8px 20px', fontSize: '0.85rem', background: '#6d28d9' }}
          >
            Copy All Favorites
          </button>
        </div>
      )}
    </div>
  );
}
