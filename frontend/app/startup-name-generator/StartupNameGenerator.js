'use client';

import { useState, useCallback } from 'react';

const CATEGORIES = [
  { value: 'saas', label: 'SaaS / Software' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthtech', label: 'HealthTech' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'ecommerce', label: 'E-Commerce / DTC' },
  { value: 'ai', label: 'AI / Machine Learning' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'devtools', label: 'Developer Tools' },
  { value: 'social', label: 'Social / Community' },
  { value: 'greentech', label: 'GreenTech / Climate' },
];

const NAMING_STYLES = [
  { value: 'coined', label: 'Coined Word (Spotify, Klarna)' },
  { value: 'compound', label: 'Compound (Salesforce, Airbnb)' },
  { value: 'suffix', label: '-ify / -ly / -io (Shopify, Grammarly)' },
  { value: 'short', label: 'Short & Punchy (Bolt, Stripe)' },
  { value: 'metaphor', label: 'Metaphor (Asana, Notion)' },
  { value: 'action', label: 'Action Word (Zoom, Snap)' },
];

const POOLS = {
  saas: {
    cores: ['flow', 'sync', 'stack', 'pulse', 'dash', 'hub', 'link', 'dock', 'base', 'grid', 'core', 'wave', 'node', 'beam', 'nest', 'cloud', 'loop', 'pipe', 'path', 'tier'],
    actions: ['launch', 'ship', 'build', 'scale', 'grow', 'boost', 'track', 'manage', 'automate', 'connect', 'stream', 'deploy', 'craft', 'forge', 'spark'],
    modifiers: ['smart', 'rapid', 'hyper', 'super', 'ultra', 'turbo', 'pro', 'prime', 'open', 'clear'],
  },
  fintech: {
    cores: ['vault', 'ledger', 'mint', 'fund', 'coin', 'pay', 'wallet', 'capital', 'asset', 'yield', 'stake', 'credit', 'float', 'margin', 'equity', 'trust', 'apex', 'crest', 'summit', 'forge'],
    actions: ['save', 'invest', 'trade', 'lend', 'earn', 'spend', 'transfer', 'split', 'budget', 'hedge', 'bank', 'fund', 'hold', 'gain', 'settle'],
    modifiers: ['swift', 'iron', 'gold', 'silver', 'noble', 'solid', 'steel', 'prime', 'alpha', 'true'],
  },
  healthtech: {
    cores: ['care', 'heal', 'med', 'vita', 'pulse', 'dose', 'cure', 'well', 'health', 'bio', 'gene', 'cell', 'life', 'body', 'mind', 'nurture', 'thrive', 'bloom', 'glow', 'renew'],
    actions: ['treat', 'diagnose', 'monitor', 'scan', 'screen', 'track', 'recover', 'restore', 'prevent', 'detect', 'heal', 'boost', 'balance', 'nurture', 'revive'],
    modifiers: ['vital', 'pure', 'whole', 'ever', 'true', 'bio', 'nano', 'precise', 'clear', 'safe'],
  },
  edtech: {
    cores: ['learn', 'quest', 'mind', 'skill', 'tutor', 'class', 'course', 'grade', 'brain', 'sage', 'spark', 'bright', 'study', 'path', 'mentor', 'coach', 'level', 'lesson', 'know', 'wise'],
    actions: ['teach', 'learn', 'study', 'train', 'master', 'prep', 'quiz', 'review', 'practice', 'explore', 'discover', 'unlock', 'advance', 'achieve', 'focus'],
    modifiers: ['smart', 'bright', 'keen', 'sharp', 'quick', 'top', 'ace', 'prime', 'bold', 'next'],
  },
  ecommerce: {
    cores: ['shop', 'cart', 'store', 'box', 'deal', 'market', 'trade', 'goods', 'shelf', 'drop', 'pack', 'haul', 'pick', 'grab', 'find', 'order', 'swift', 'flash', 'snap', 'click'],
    actions: ['buy', 'sell', 'ship', 'deliver', 'browse', 'order', 'stock', 'list', 'curate', 'bundle', 'save', 'earn', 'share', 'pick', 'choose'],
    modifiers: ['fast', 'mega', 'super', 'easy', 'flash', 'quick', 'smart', 'top', 'best', 'prime'],
  },
  ai: {
    cores: ['neural', 'cortex', 'tensor', 'matrix', 'synth', 'logic', 'algo', 'vector', 'model', 'signal', 'graph', 'cipher', 'qubit', 'axiom', 'theta', 'lambda', 'sigma', 'omega', 'delta', 'phi'],
    actions: ['predict', 'classify', 'generate', 'detect', 'infer', 'parse', 'train', 'learn', 'optimize', 'compute', 'reason', 'think', 'solve', 'adapt', 'evolve'],
    modifiers: ['deep', 'meta', 'auto', 'hyper', 'multi', 'poly', 'neo', 'quantum', 'rapid', 'super'],
  },
  marketplace: {
    cores: ['hub', 'bay', 'plaza', 'bazaar', 'square', 'exchange', 'depot', 'port', 'arena', 'forum', 'circle', 'commons', 'guild', 'bridge', 'nexus', 'dock', 'gate', 'yard', 'fair', 'agora'],
    actions: ['match', 'connect', 'trade', 'swap', 'source', 'link', 'book', 'hire', 'find', 'list', 'bid', 'offer', 'share', 'host', 'rent'],
    modifiers: ['open', 'near', 'local', 'global', 'true', 'peer', 'next', 'all', 'any', 'free'],
  },
  devtools: {
    cores: ['code', 'dev', 'git', 'api', 'cli', 'test', 'build', 'deploy', 'stack', 'debug', 'lint', 'pipe', 'log', 'query', 'schema', 'runtime', 'env', 'config', 'hook', 'module'],
    actions: ['compile', 'ship', 'push', 'merge', 'deploy', 'test', 'lint', 'build', 'run', 'debug', 'parse', 'fetch', 'render', 'cache', 'index'],
    modifiers: ['fast', 'zero', 'open', 'raw', 'full', 'live', 'hot', 'auto', 'micro', 'mono'],
  },
  social: {
    cores: ['tribe', 'circle', 'crew', 'club', 'hive', 'nest', 'camp', 'squad', 'band', 'loop', 'vibe', 'bond', 'meet', 'gather', 'commune', 'folk', 'ally', 'peer', 'clan', 'space'],
    actions: ['share', 'post', 'chat', 'ping', 'wave', 'buzz', 'follow', 'react', 'join', 'invite', 'voice', 'cheer', 'vibe', 'hang', 'connect'],
    modifiers: ['co', 'we', 'our', 'all', 'hey', 'oh', 'yo', 'hi', 'be', 'go'],
  },
  greentech: {
    cores: ['terra', 'leaf', 'solar', 'wind', 'ocean', 'carbon', 'seed', 'root', 'grove', 'earth', 'green', 'eco', 'nature', 'harvest', 'rain', 'stream', 'forest', 'bloom', 'shore', 'reef'],
    actions: ['sustain', 'recycle', 'renew', 'restore', 'offset', 'capture', 'reduce', 'conserve', 'protect', 'reuse', 'clean', 'plant', 'grow', 'power', 'save'],
    modifiers: ['eco', 'bio', 'green', 'pure', 'clean', 'zero', 'net', 're', 'ever', 'true'],
  },
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function generateNames(category, style, keyword, count = 24) {
  const pool = POOLS[category] || POOLS.saas;
  const names = new Set();
  let attempts = 0;

  while (names.size < count && attempts < 600) {
    attempts++;
    let name;
    const kw = keyword ? keyword.toLowerCase().replace(/[^a-z]/g, '') : '';

    switch (style) {
      case 'coined': {
        // Blend two words into a portmanteau
        const a = kw || pick(pool.cores);
        const b = pick(pool.cores);
        if (a === b) continue;
        const cutA = a.slice(0, Math.max(2, Math.ceil(a.length * 0.6)));
        const cutB = b.slice(Math.floor(b.length * 0.3));
        name = capitalize(cutA + cutB);
        break;
      }
      case 'compound': {
        const parts = [
          () => capitalize(kw || pick(pool.modifiers)) + capitalize(pick(pool.cores)),
          () => capitalize(pick(pool.cores)) + capitalize(kw || pick(pool.actions)),
          () => capitalize(pick(pool.actions)) + capitalize(pick(pool.cores)),
        ];
        name = pick(parts)();
        break;
      }
      case 'suffix': {
        const base = kw || pick(pool.cores);
        const suffixes = ['ify', 'ly', 'io', 'er', 'ful', 'able', 'ize', 'ist', 'ive', 'ity'];
        const suf = pick(suffixes);
        // Drop trailing vowel before vowel-starting suffix
        let cleaned = base;
        if ('aeiou'.includes(base[base.length - 1]) && 'aeiou'.includes(suf[0])) {
          cleaned = base.slice(0, -1);
        }
        name = capitalize(cleaned + suf);
        break;
      }
      case 'short': {
        // 3-6 letter punchy names
        const sources = [...pool.cores, ...pool.actions];
        const word = kw || pick(sources);
        name = capitalize(word.slice(0, Math.min(6, word.length)));
        if (name.length < 3) continue;
        break;
      }
      case 'metaphor': {
        const metaphors = [
          'atlas', 'beacon', 'compass', 'dawn', 'ember', 'falcon', 'granite',
          'harbor', 'iris', 'jasper', 'keystone', 'lumen', 'meridian', 'nimbus',
          'onyx', 'prism', 'quartz', 'ripple', 'summit', 'tidal', 'umbra',
          'vertex', 'zenith', 'aurora', 'catalyst', 'echo', 'forge', 'genesis',
          'horizon', 'ignite', 'kinetic', 'lotus', 'momentum', 'nova',
          'orbit', 'phoenix', 'radiant', 'spectrum', 'terra', 'vector',
        ];
        if (kw) {
          name = capitalize(kw) + capitalize(pick(metaphors));
        } else {
          name = capitalize(pick(metaphors));
        }
        break;
      }
      case 'action': {
        const base = kw || pick(pool.actions);
        const variants = [
          () => capitalize(base),
          () => capitalize(base) + capitalize(pick(pool.cores).slice(0, 3)),
          () => capitalize(pick(pool.modifiers)) + capitalize(base),
        ];
        name = pick(variants)();
        break;
      }
      default:
        name = capitalize(pick(pool.cores));
    }

    if (name && name.length >= 3 && name.length <= 22 && !names.has(name)) {
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
    return { domain: clean + '.com', available: data.Status === 3 };
  } catch {
    return { domain: clean + '.com', available: null };
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

export default function StartupNameGenerator() {
  const [category, setCategory] = useState('saas');
  const [style, setStyle] = useState('coined');
  const [keyword, setKeyword] = useState('');
  const [names, setNames] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [checking, setChecking] = useState({});
  const [copied, setCopied] = useState(null);

  const generate = useCallback(() => {
    const results = generateNames(category, style, keyword, 24);
    setNames(results);
    setChecking({});
  }, [category, style, keyword]);

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
    setChecking(prev => ({
      ...prev,
      [name]: result.available ? 'available' : result.available === false ? 'taken' : 'unknown',
    }));
  };

  const copyName = (name) => {
    navigator.clipboard?.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={labelStyle}>Startup Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Naming Style</label>
          <select value={style} onChange={e => setStyle(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {NAMING_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Core Word (optional)</label>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="e.g. rocket, pixel, bloom"
            style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && generate()}
          />
        </div>
      </div>

      <button onClick={generate} style={buttonStyle}>
        🚀 Generate Startup Names
      </button>

      {/* Results */}
      {names.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Startup Name Ideas</h2>
            <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{names.length} names generated</span>
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
                transition: 'border-color 0.2s',
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
                      background: checking[name] === 'available' ? 'rgba(34,197,94,0.1)' : 'transparent',
                      border: checking[name] === 'available' ? '1px solid #22c55e' : checking[name] === 'taken' ? '1px solid #ef4444' : '1px solid #333',
                      borderRadius: '6px',
                      color: checking[name] === 'available' ? '#22c55e' : checking[name] === 'taken' ? '#ef4444' : '#9ca3af',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    {checking[name] === 'loading' ? '⏳ Checking...' : checking[name] === 'available' ? '✅ .com free' : checking[name] === 'taken' ? '❌ .com taken' : 'Check .com'}
                  </button>
                  <button
                    onClick={() => copyName(name)}
                    style={{
                      padding: '4px 10px',
                      background: 'transparent',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: copied === name ? '#8b5cf6' : '#9ca3af',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                    title="Copy to clipboard"
                  >
                    {copied === name ? '✓' : '📋'}
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
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>💜 Shortlisted Names ({favorites.size})</h3>
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
            Copy All Names
          </button>
        </div>
      )}
    </div>
  );
}
