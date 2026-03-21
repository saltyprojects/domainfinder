'use client';

import { useState, useCallback } from 'react';

const KEYBOARD_NEIGHBORS = {
  q: ['w','a'], w: ['q','e','s','a'], e: ['w','r','d','s'], r: ['e','t','f','d'],
  t: ['r','y','g','f'], y: ['t','u','h','g'], u: ['y','i','j','h'], i: ['u','o','k','j'],
  o: ['i','p','l','k'], p: ['o','l'],
  a: ['q','w','s','z'], s: ['a','w','e','d','z','x'], d: ['s','e','r','f','x','c'],
  f: ['d','r','t','g','c','v'], g: ['f','t','y','h','v','b'], h: ['g','y','u','j','b','n'],
  j: ['h','u','i','k','n','m'], k: ['j','i','o','l','m'], l: ['k','o','p'],
  z: ['a','s','x'], x: ['z','s','d','c'], c: ['x','d','f','v'],
  v: ['c','f','g','b'], b: ['v','g','h','n'], n: ['b','h','j','m'], m: ['n','j','k'],
};

const COMMON_TLDS = ['.com','.net','.org','.co','.io','.dev','.app','.xyz','.info','.biz'];

const HOMOGLYPHS = {
  a: ['@','4'], e: ['3'], i: ['1','l','!'], l: ['1','i'], o: ['0'], s: ['5','$'],
  t: ['7'], b: ['6'], g: ['9'], z: ['2'],
};

const VOWELS = new Set(['a','e','i','o','u']);

function generateTypos(domain) {
  // Split domain and TLD
  let name, tld;
  const lastDot = domain.lastIndexOf('.');
  if (lastDot > 0) {
    name = domain.slice(0, lastDot);
    tld = domain.slice(lastDot);
  } else {
    name = domain;
    tld = '.com';
  }

  const results = new Map(); // dedup

  const add = (variant, type) => {
    const full = variant + (type === 'Wrong TLD' ? '' : tld);
    if (full !== domain && full !== name + tld && variant.length > 0 && !results.has(full)) {
      results.set(full, type);
    }
  };

  // 1. Character omission — missing one character
  for (let i = 0; i < name.length; i++) {
    add(name.slice(0, i) + name.slice(i + 1), 'Missing Character');
  }

  // 2. Adjacent character swap
  for (let i = 0; i < name.length - 1; i++) {
    const arr = name.split('');
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    add(arr.join(''), 'Swapped Characters');
  }

  // 3. Adjacent key replacement (fat-finger)
  for (let i = 0; i < name.length; i++) {
    const ch = name[i].toLowerCase();
    const neighbors = KEYBOARD_NEIGHBORS[ch];
    if (neighbors) {
      for (const n of neighbors) {
        add(name.slice(0, i) + n + name.slice(i + 1), 'Wrong Key');
      }
    }
  }

  // 4. Double character (repeated letter)
  for (let i = 0; i < name.length; i++) {
    add(name.slice(0, i + 1) + name[i] + name.slice(i + 1), 'Doubled Letter');
  }

  // 5. Character insertion (extra character between each pair)
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i <= name.length; i++) {
    // Only insert common neighboring keys to limit explosion
    const before = i > 0 ? name[i - 1].toLowerCase() : null;
    const after = i < name.length ? name[i].toLowerCase() : null;
    const candidates = new Set();
    if (before && KEYBOARD_NEIGHBORS[before]) KEYBOARD_NEIGHBORS[before].forEach(k => candidates.add(k));
    if (after && KEYBOARD_NEIGHBORS[after]) KEYBOARD_NEIGHBORS[after].forEach(k => candidates.add(k));
    for (const c of candidates) {
      add(name.slice(0, i) + c + name.slice(i), 'Inserted Character');
    }
  }

  // 6. Homoglyph substitution
  for (let i = 0; i < name.length; i++) {
    const ch = name[i].toLowerCase();
    if (HOMOGLYPHS[ch]) {
      for (const h of HOMOGLYPHS[ch]) {
        add(name.slice(0, i) + h + name.slice(i + 1), 'Homoglyph');
      }
    }
  }

  // 7. Vowel swap
  for (let i = 0; i < name.length; i++) {
    if (VOWELS.has(name[i].toLowerCase())) {
      for (const v of VOWELS) {
        if (v !== name[i].toLowerCase()) {
          add(name.slice(0, i) + v + name.slice(i + 1), 'Vowel Swap');
        }
      }
    }
  }

  // 8. Dot omission / insertion for subdomains
  if (name.includes('.')) {
    add(name.replace('.', ''), 'Dot Omission');
  }

  // 9. Hyphen variations
  for (let i = 1; i < name.length; i++) {
    if (name[i] !== '-' && name[i - 1] !== '-') {
      add(name.slice(0, i) + '-' + name.slice(i), 'Added Hyphen');
    }
  }
  if (name.includes('-')) {
    add(name.replace(/-/g, ''), 'Removed Hyphen');
  }

  // 10. Wrong TLD
  for (const t of COMMON_TLDS) {
    if (t !== tld) {
      add(name + t, 'Wrong TLD');
    }
  }

  // 11. Plural / singular
  if (name.endsWith('s')) {
    add(name.slice(0, -1), 'Singular');
  } else {
    add(name + 's', 'Plural');
  }

  return Array.from(results.entries()).map(([domain, type]) => ({ domain, type }));
}

const TYPE_COLORS = {
  'Missing Character': '#ef4444',
  'Swapped Characters': '#f59e0b',
  'Wrong Key': '#f97316',
  'Doubled Letter': '#eab308',
  'Inserted Character': '#a855f7',
  'Homoglyph': '#ec4899',
  'Vowel Swap': '#06b6d4',
  'Added Hyphen': '#6366f1',
  'Removed Hyphen': '#6366f1',
  'Dot Omission': '#14b8a6',
  'Wrong TLD': '#8b5cf6',
  'Plural': '#22c55e',
  'Singular': '#22c55e',
};

export default function DomainTypoGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleGenerate = useCallback(() => {
    let domain = input.trim().toLowerCase();
    domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    if (!domain) return;
    const typos = generateTypos(domain);
    setResults({ domain, typos });
    setFilter('all');
  }, [input]);

  const filteredResults = results?.typos?.filter(t => filter === 'all' || t.type === filter) || [];

  const typeGroups = results ? [...new Set(results.typos.map(t => t.type))] : [];

  const copyAll = () => {
    const text = filteredResults.map(r => r.domain).join('\n');
    navigator.clipboard.writeText(text);
  };

  const exportCSV = () => {
    const rows = [['Domain','Type'], ...filteredResults.map(r => [r.domain, r.type])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typos-${results.domain}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Search */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          placeholder="Enter domain (e.g. google.com)"
          style={{
            flex: 1, minWidth: '200px', padding: '14px 16px', borderRadius: '10px',
            border: '1px solid #2a2a2a', background: '#111', color: '#fff',
            fontSize: '1rem', outline: 'none',
          }}
        />
        <button
          onClick={handleGenerate}
          style={{
            padding: '14px 28px', borderRadius: '10px', border: 'none',
            background: '#8b5cf6', color: '#fff', fontWeight: 700, fontSize: '1rem',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
          onMouseLeave={e => e.currentTarget.style.background = '#8b5cf6'}
        >
          Generate Typos
        </button>
      </div>

      {results && (
        <>
          {/* Summary */}
          <div style={{
            background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px',
            padding: '20px', marginBottom: '20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
          }}>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Generated </span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>{results.typos.length}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}> typo variations of </span>
              <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{results.domain}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={copyAll} style={{
                padding: '8px 16px', borderRadius: '8px', border: '1px solid #2a2a2a',
                background: 'transparent', color: '#ccc', fontSize: '0.8rem', cursor: 'pointer',
              }}>
                📋 Copy All
              </button>
              <button onClick={exportCSV} style={{
                padding: '8px 16px', borderRadius: '8px', border: '1px solid #2a2a2a',
                background: 'transparent', color: '#ccc', fontSize: '0.8rem', cursor: 'pointer',
              }}>
                📥 Export CSV
              </button>
            </div>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: filter === 'all' ? '#8b5cf6' : '#1a1a1a',
                color: filter === 'all' ? '#fff' : '#999',
              }}
            >
              All ({results.typos.length})
            </button>
            {typeGroups.map(type => {
              const count = results.typos.filter(t => t.type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    background: filter === type ? (TYPE_COLORS[type] || '#8b5cf6') : '#1a1a1a',
                    color: filter === type ? '#fff' : '#999',
                  }}
                >
                  {type} ({count})
                </button>
              );
            })}
          </div>

          {/* Results table */}
          <div style={{
            background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px',
            overflow: 'hidden', maxHeight: '600px', overflowY: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0a0a0a', position: 'sticky', top: 0, zIndex: 1 }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domain</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r, i) => (
                  <tr key={r.domain} style={{ borderTop: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '10px 16px', fontSize: '0.8rem', color: '#444', fontFamily: 'ui-monospace, monospace' }}>{i + 1}</td>
                    <td style={{ padding: '10px 16px', fontSize: '0.9rem', color: '#fff', fontFamily: 'ui-monospace, monospace' }}>{r.domain}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                        background: `${TYPE_COLORS[r.type] || '#8b5cf6'}20`,
                        color: TYPE_COLORS[r.type] || '#8b5cf6',
                        border: `1px solid ${TYPE_COLORS[r.type] || '#8b5cf6'}40`,
                      }}>
                        {r.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
