'use client';

import { useState, useCallback } from 'react';

// Industry-specific word banks for generating targeted names
const INDUSTRY_WORDS = {
  saas: {
    cores: ['flow', 'sync', 'stack', 'pulse', 'dash', 'hub', 'link', 'dock', 'base', 'grid', 'core', 'wave', 'node', 'beam', 'nest', 'cloud', 'loop', 'pipe', 'path', 'tier'],
    actions: ['launch', 'ship', 'build', 'scale', 'grow', 'boost', 'track', 'manage', 'automate', 'connect', 'stream', 'deploy', 'craft', 'forge', 'spark'],
    modifiers: ['smart', 'rapid', 'hyper', 'super', 'ultra', 'turbo', 'pro', 'prime', 'open', 'clear']
  },
  fintech: {
    cores: ['vault', 'ledger', 'mint', 'fund', 'coin', 'pay', 'wallet', 'capital', 'asset', 'yield', 'stake', 'credit', 'float', 'margin', 'equity', 'trust', 'apex', 'crest', 'summit', 'forge'],
    actions: ['save', 'invest', 'trade', 'lend', 'earn', 'spend', 'transfer', 'split', 'budget', 'hedge', 'bank', 'fund', 'hold', 'gain', 'settle'],
    modifiers: ['swift', 'iron', 'gold', 'silver', 'noble', 'solid', 'steel', 'prime', 'alpha', 'true']
  },
  healthtech: {
    cores: ['care', 'heal', 'med', 'vita', 'pulse', 'dose', 'cure', 'well', 'health', 'bio', 'gene', 'cell', 'life', 'body', 'mind', 'nurture', 'thrive', 'bloom', 'glow', 'renew'],
    actions: ['treat', 'diagnose', 'monitor', 'scan', 'screen', 'track', 'recover', 'restore', 'prevent', 'detect', 'heal', 'boost', 'balance', 'nurture', 'revive'],
    modifiers: ['vital', 'pure', 'whole', 'ever', 'true', 'bio', 'nano', 'precise', 'clear', 'safe']
  },
  edtech: {
    cores: ['learn', 'quest', 'mind', 'skill', 'tutor', 'class', 'course', 'grade', 'brain', 'sage', 'spark', 'bright', 'study', 'path', 'mentor', 'coach', 'level', 'lesson', 'know', 'wise'],
    actions: ['teach', 'learn', 'study', 'train', 'master', 'prep', 'quiz', 'review', 'practice', 'explore', 'discover', 'unlock', 'advance', 'achieve', 'focus'],
    modifiers: ['smart', 'bright', 'keen', 'sharp', 'quick', 'top', 'ace', 'prime', 'bold', 'next']
  },
  ecommerce: {
    cores: ['shop', 'cart', 'store', 'box', 'deal', 'market', 'trade', 'goods', 'shelf', 'drop', 'pack', 'haul', 'pick', 'grab', 'find', 'order', 'swift', 'flash', 'snap', 'click'],
    actions: ['buy', 'sell', 'ship', 'deliver', 'browse', 'order', 'stock', 'list', 'curate', 'bundle', 'save', 'earn', 'share', 'pick', 'choose'],
    modifiers: ['fast', 'mega', 'super', 'easy', 'flash', 'quick', 'smart', 'top', 'best', 'prime']
  },
  ai: {
    cores: ['neural', 'cortex', 'tensor', 'matrix', 'synth', 'logic', 'algo', 'vector', 'model', 'signal', 'graph', 'cipher', 'qubit', 'axiom', 'theta', 'lambda', 'sigma', 'omega', 'delta', 'phi'],
    actions: ['predict', 'classify', 'generate', 'detect', 'infer', 'parse', 'train', 'learn', 'optimize', 'compute', 'reason', 'think', 'solve', 'adapt', 'evolve'],
    modifiers: ['deep', 'meta', 'auto', 'hyper', 'multi', 'poly', 'neo', 'quantum', 'rapid', 'super']
  },
  marketplace: {
    cores: ['hub', 'bay', 'plaza', 'bazaar', 'square', 'exchange', 'depot', 'port', 'arena', 'forum', 'circle', 'commons', 'guild', 'bridge', 'nexus', 'dock', 'gate', 'yard', 'fair', 'agora'],
    actions: ['match', 'connect', 'trade', 'swap', 'source', 'link', 'book', 'hire', 'find', 'list', 'bid', 'offer', 'share', 'host', 'rent'],
    modifiers: ['open', 'near', 'local', 'global', 'true', 'peer', 'next', 'all', 'any', 'free']
  },
  devtools: {
    cores: ['code', 'dev', 'git', 'api', 'cli', 'test', 'build', 'deploy', 'stack', 'debug', 'lint', 'pipe', 'log', 'query', 'schema', 'runtime', 'env', 'config', 'hook', 'module'],
    actions: ['compile', 'ship', 'push', 'merge', 'deploy', 'test', 'lint', 'build', 'run', 'debug', 'parse', 'fetch', 'render', 'cache', 'index'],
    modifiers: ['fast', 'zero', 'open', 'raw', 'full', 'live', 'hot', 'auto', 'micro', 'mono']
  },
  social: {
    cores: ['tribe', 'circle', 'crew', 'club', 'hive', 'nest', 'camp', 'squad', 'band', 'loop', 'vibe', 'bond', 'meet', 'gather', 'commune', 'folk', 'ally', 'peer', 'clan', 'space'],
    actions: ['share', 'post', 'chat', 'ping', 'wave', 'buzz', 'follow', 'react', 'join', 'invite', 'voice', 'cheer', 'vibe', 'hang', 'connect'],
    modifiers: ['co', 'we', 'our', 'all', 'hey', 'oh', 'yo', 'hi', 'be', 'go']
  },
  greentech: {
    cores: ['terra', 'leaf', 'solar', 'wind', 'ocean', 'carbon', 'seed', 'root', 'grove', 'earth', 'green', 'eco', 'nature', 'harvest', 'rain', 'stream', 'forest', 'bloom', 'shore', 'reef'],
    actions: ['sustain', 'recycle', 'renew', 'restore', 'offset', 'capture', 'reduce', 'conserve', 'protect', 'reuse', 'clean', 'plant', 'grow', 'power', 'save'],
    modifiers: ['eco', 'bio', 'green', 'pure', 'clean', 'zero', 'net', 're', 'ever', 'true']
  }
};

const INDUSTRIES = [
  { value: 'saas', label: 'SaaS / Software' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthtech', label: 'HealthTech' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'ecommerce', label: 'E-Commerce / DTC' },
  { value: 'ai', label: 'AI / Machine Learning' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'devtools', label: 'Developer Tools' },
  { value: 'social', label: 'Social / Community' },
  { value: 'greentech', label: 'GreenTech / Climate' }
];

const STYLES = [
  { value: 'coined', label: 'Coined Word (Spotify, Klarna)' },
  { value: 'compound', label: 'Compound (Salesforce, Airbnb)' },
  { value: 'suffix', label: '-ify / -ly / -io (Shopify, Grammarly)' },
  { value: 'short', label: 'Short & Punchy (Bolt, Stripe)' },
  { value: 'metaphor', label: 'Metaphor (Asana, Notion)' },
  { value: 'action', label: 'Action Word (Zoom, Snap)' }
];

// Utility functions
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Generate names based on industry and style
function generateNames(industry, style, keyword, count = 24) {
  const industryWords = INDUSTRY_WORDS[industry] || INDUSTRY_WORDS.saas;
  const names = new Set();
  let attempts = 0;
  
  while (names.size < count && attempts < 500) {
    attempts++;
    let name;
    const cleanKeyword = keyword ? keyword.toLowerCase().replace(/[^a-z]/g, '') : '';
    
    switch (style) {
      case 'coined': {
        // Blend word parts to create new words
        const word1 = cleanKeyword || randomChoice(industryWords.cores);
        const word2 = randomChoice(industryWords.cores);
        if (word1 === word2) continue;
        name = capitalize(word1.slice(0, Math.max(2, Math.ceil(word1.length * 0.6))) + 
                         word2.slice(Math.floor(word2.length * 0.3)));
        break;
      }
      
      case 'compound': {
        // Combine two full words
        const generators = [
          () => capitalize(cleanKeyword || randomChoice(industryWords.modifiers)) + capitalize(randomChoice(industryWords.cores)),
          () => capitalize(randomChoice(industryWords.cores)) + capitalize(cleanKeyword || randomChoice(industryWords.actions)),
          () => capitalize(randomChoice(industryWords.actions)) + capitalize(randomChoice(industryWords.cores))
        ];
        name = randomChoice(generators)();
        break;
      }
      
      case 'suffix': {
        // Add modern suffixes
        const base = cleanKeyword || randomChoice(industryWords.cores);
        const suffix = randomChoice(['ify', 'ly', 'io', 'er', 'ful', 'able', 'ize', 'ist', 'ive', 'ity']);
        let stem = base;
        
        // Handle vowel conflicts
        if ('aeiou'.includes(base[base.length - 1]) && 'aeiou'.includes(suffix[0])) {
          stem = base.slice(0, -1);
        }
        
        name = capitalize(stem + suffix);
        break;
      }
      
      case 'short': {
        // Create short, punchy names
        const allWords = [...industryWords.cores, ...industryWords.actions];
        const word = cleanKeyword || randomChoice(allWords);
        name = capitalize(word.slice(0, Math.min(6, word.length)));
        if (name.length < 3) continue;
        break;
      }
      
      case 'metaphor': {
        // Use powerful metaphorical words
        const metaphors = [
          'atlas', 'beacon', 'compass', 'dawn', 'ember', 'falcon', 'granite', 'harbor',
          'iris', 'jasper', 'keystone', 'lumen', 'meridian', 'nimbus', 'onyx', 'prism',
          'quartz', 'ripple', 'summit', 'tidal', 'umbra', 'vertex', 'zenith', 'aurora',
          'catalyst', 'echo', 'forge', 'genesis', 'horizon', 'ignite', 'kinetic', 'lotus',
          'momentum', 'nova', 'orbit', 'phoenix', 'radiant', 'spectrum', 'terra', 'vector'
        ];
        
        if (cleanKeyword) {
          name = capitalize(cleanKeyword) + capitalize(randomChoice(metaphors));
        } else {
          name = capitalize(randomChoice(metaphors));
        }
        break;
      }
      
      case 'action': {
        // Action-oriented names
        const action = cleanKeyword || randomChoice(industryWords.actions);
        const generators = [
          () => capitalize(action),
          () => capitalize(action) + capitalize(randomChoice(industryWords.cores).slice(0, 3)),
          () => capitalize(randomChoice(industryWords.modifiers)) + capitalize(action)
        ];
        name = randomChoice(generators)();
        break;
      }
      
      default:
        name = capitalize(randomChoice(industryWords.cores));
    }
    
    // Validate name length and uniqueness
    if (name && name.length >= 3 && name.length <= 22 && !names.has(name)) {
      names.add(name);
    }
  }
  
  return Array.from(names);
}

// Check domain availability using DNS Google API
async function checkDomainAvailability(domain) {
  const cleanDomain = domain.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  try {
    const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}.com&type=A`);
    const data = await response.json();
    
    // Status 3 = NXDOMAIN (domain doesn't exist = available)
    return {
      domain: cleanDomain + '.com',
      available: data.Status === 3
    };
  } catch (error) {
    return {
      domain: cleanDomain + '.com',
      available: null
    };
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
  outline: 'none'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  color: '#9ca3af',
  marginBottom: '6px',
  fontWeight: 500
};

const buttonStyle = {
  padding: '12px 32px',
  background: '#8b5cf6',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer'
};

export default function StartupNameGenerator() {
  const [industry, setIndustry] = useState('saas');
  const [style, setStyle] = useState('coined');
  const [keyword, setKeyword] = useState('');
  const [names, setNames] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [domainChecks, setDomainChecks] = useState({});
  const [copiedName, setCopiedName] = useState(null);

  const generateStartupNames = useCallback(() => {
    setNames(generateNames(industry, style, keyword, 24));
    setDomainChecks({});
  }, [industry, style, keyword]);

  const checkDomain = async (name) => {
    setDomainChecks(prev => ({ ...prev, [name]: 'loading' }));
    
    const result = await checkDomainAvailability(name);
    setDomainChecks(prev => ({ 
      ...prev, 
      [name]: result.available ? 'available' : result.available === false ? 'taken' : 'unknown'
    }));
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={labelStyle}>Startup Category</label>
          <select 
            value={industry} 
            onChange={(e) => setIndustry(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {INDUSTRIES.map(ind => (
              <option key={ind.value} value={ind.value}>{ind.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={labelStyle}>Naming Style</label>
          <select 
            value={style} 
            onChange={(e) => setStyle(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {STYLES.map(st => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={labelStyle}>Core Word (optional)</label>
          <input 
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. rocket, pixel, bloom"
            style={inputStyle}
            onKeyDown={(e) => e.key === 'Enter' && generateStartupNames()}
          />
        </div>
      </div>
      
      <button onClick={generateStartupNames} style={buttonStyle}>
        🚀 Generate Startup Names
      </button>
      
      {/* Generated Names */}
      {names.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Startup Name Ideas
            </h2>
            <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              {names.length} names generated
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {names.map(name => (
              <div
                key={name}
                style={{
                  background: '#111',
                  border: favorites.has(name) ? '1px solid #8b5cf6' : '1px solid #1e1e1e',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                    {name}
                  </span>
                  <button
                    onClick={() => {
                      setFavorites(prev => {
                        const newFavs = new Set(prev);
                        if (newFavs.has(name)) {
                          newFavs.delete(name);
                        } else {
                          newFavs.add(name);
                        }
                        return newFavs;
                      });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '2px'
                    }}
                    title={favorites.has(name) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.has(name) ? '💜' : '🤍'}
                  </button>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => checkDomain(name)}
                    disabled={domainChecks[name] === 'loading'}
                    style={{
                      padding: '4px 12px',
                      background: domainChecks[name] === 'available' ? 'rgba(34,197,94,0.1)' : 'transparent',
                      border: domainChecks[name] === 'available' 
                        ? '1px solid #22c55e' 
                        : domainChecks[name] === 'taken' 
                        ? '1px solid #ef4444' 
                        : '1px solid #333',
                      borderRadius: '6px',
                      color: domainChecks[name] === 'available' 
                        ? '#22c55e' 
                        : domainChecks[name] === 'taken' 
                        ? '#ef4444' 
                        : '#9ca3af',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {domainChecks[name] === 'loading' 
                      ? '⏳ Checking...' 
                      : domainChecks[name] === 'available'
                      ? '✅ .com free'
                      : domainChecks[name] === 'taken'
                      ? '❌ .com taken'
                      : 'Check .com'
                    }
                  </button>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(name);
                      setCopiedName(name);
                      setTimeout(() => setCopiedName(null), 1500);
                    }}
                    style={{
                      padding: '4px 10px',
                      background: 'transparent',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: copiedName === name ? '#8b5cf6' : '#9ca3af',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                    title="Copy to clipboard"
                  >
                    {copiedName === name ? '✓' : '📋'}
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
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            💜 Shortlisted Names ({favorites.size})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[...favorites].map(name => (
              <span
                key={name}
                style={{
                  padding: '6px 14px',
                  background: '#1a1a2e',
                  border: '1px solid #8b5cf6',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
              >
                {name}
              </span>
            ))}
          </div>
          <button
            onClick={() => {
              const allNames = [...favorites].join('\n');
              navigator.clipboard?.writeText(allNames);
            }}
            style={{
              ...buttonStyle,
              marginTop: '12px',
              padding: '8px 20px',
              fontSize: '0.85rem',
              background: '#6d28d9'
            }}
          >
            Copy All Names
          </button>
        </div>
      )}
    </div>
  );
}