'use client';

import { useState, useCallback } from 'react';

// Common English words used to split concatenated domain names
const DICTIONARY = [
  // Tech
  'app','web','net','dev','code','tech','data','cloud','cyber','digital','smart','auto','bot','api','sync','hub',
  'stack','flow','dash','link','wire','byte','pixel','bit','node','edge','core','grid','fast','quick','pro',
  // Business
  'shop','store','buy','sell','deal','trade','market','pay','price','offer','brand','lead','grow','boost','fund',
  'invest','profit','earn','cash','money','gold','wealth','asset','stock','bank','credit','loan','finance',
  // Domain-specific
  'domain','host','site','page','blog','forum','wiki','mail','email','chat','call','meet','video','stream',
  'media','news','info','help','guide','learn','teach','study','book','read','write','create','make','build',
  // General
  'home','house','room','space','place','world','land','city','town','park','road','path','way','door','gate',
  'key','lock','safe','shield','guard','watch','find','search','seek','look','view','see','show','play','game',
  'sport','health','fit','life','love','heart','star','sun','moon','fire','air','water','green','blue','red',
  'black','white','light','dark','bright','cool','hot','new','old','big','small','top','best','first','next',
  'open','free','easy','simple','clean','fresh','pure','real','true','one','two','all','any','every','some',
  // Action words
  'get','set','run','go','move','turn','pull','push','drop','pick','hold','keep','take','give','send','post',
  'flip','snap','tap','click','swipe','scroll','type','ping','buzz','pop','zip','jam','mix','fix','cut',
  // Marketing
  'launch','start','begin','scale','reach','target','impact','power','force','energy','drive','speed','rapid',
  'instant','prime','elite','ultra','mega','super','hyper','max','plus','extra',
];

// Sort by length descending so longer matches are preferred
const SORTED_DICT = [...DICTIONARY].sort((a, b) => b.length - a.length);

function extractKeywords(domain) {
  // Remove TLD and subdomain
  let name = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
  const dotIdx = name.indexOf('.');
  const tld = dotIdx !== -1 ? name.slice(dotIdx + 1).replace(/\/$/, '') : '';
  name = dotIdx !== -1 ? name.slice(0, dotIdx) : name;

  const results = {
    original: domain.trim(),
    cleanName: name,
    tld: tld || 'N/A',
    length: name.length,
    words: [],
    separators: { hyphens: false, numbers: false, underscores: false },
    characteristics: [],
  };

  // Check separators
  results.separators.hyphens = name.includes('-');
  results.separators.numbers = /\d/.test(name);
  results.separators.underscores = name.includes('_');

  // Split on hyphens, underscores, numbers
  let parts = name.split(/[-_]+/).filter(Boolean);
  let allWords = [];

  for (const part of parts) {
    // Split on number boundaries
    const segments = part.split(/(\d+)/).filter(Boolean);
    for (const seg of segments) {
      if (/^\d+$/.test(seg)) {
        allWords.push({ word: seg, type: 'number' });
        continue;
      }
      // Try dictionary-based word segmentation
      const segmented = segmentWord(seg);
      allWords.push(...segmented);
    }
  }

  results.words = allWords;

  // Characteristics
  if (name.length <= 4) results.characteristics.push('Ultra-short (premium)');
  else if (name.length <= 7) results.characteristics.push('Short (desirable)');
  else if (name.length <= 12) results.characteristics.push('Medium length');
  else results.characteristics.push('Long domain name');

  if (results.separators.hyphens) results.characteristics.push('Contains hyphens');
  if (results.separators.numbers) results.characteristics.push('Contains numbers');
  if (allWords.filter(w => w.type === 'word').length >= 3) results.characteristics.push('Multi-keyword domain');
  if (allWords.length === 1 && allWords[0].type === 'word') results.characteristics.push('Single-word domain');

  const hasVowel = /[aeiou]/.test(name);
  if (!hasVowel) results.characteristics.push('No vowels (acronym-style)');

  // Check if it's likely a brand name (not dictionary words)
  const unknowns = allWords.filter(w => w.type === 'unknown');
  if (unknowns.length > 0 && unknowns.length === allWords.length) {
    results.characteristics.push('Brandable / invented word');
  }

  return results;
}

function segmentWord(str) {
  if (str.length <= 2) return [{ word: str, type: 'fragment' }];

  // Try to match dictionary words greedily
  const result = [];
  let remaining = str.toLowerCase();

  while (remaining.length > 0) {
    let matched = false;
    for (const word of SORTED_DICT) {
      if (remaining.startsWith(word) && (remaining.length === word.length || remaining.length - word.length >= 2)) {
        result.push({ word, type: 'word' });
        remaining = remaining.slice(word.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Try matching from end
      let endMatched = false;
      for (const word of SORTED_DICT) {
        if (remaining.endsWith(word) && remaining.length - word.length >= 2) {
          const prefix = remaining.slice(0, remaining.length - word.length);
          result.push({ word: prefix, type: prefix.length <= 2 ? 'fragment' : 'unknown' });
          result.push({ word, type: 'word' });
          remaining = '';
          endMatched = true;
          break;
        }
      }
      if (!endMatched) {
        result.push({ word: remaining, type: remaining.length <= 2 ? 'fragment' : 'unknown' });
        remaining = '';
      }
    }
  }

  return result;
}

const typeColors = {
  word: '#8b5cf6',
  number: '#f59e0b',
  unknown: '#6b7280',
  fragment: '#374151',
};

const typeLabels = {
  word: 'Keyword',
  number: 'Number',
  unknown: 'Brand/Unique',
  fragment: 'Fragment',
};

export default function DomainKeywordExtractor() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const analyze = useCallback(() => {
    setError('');
    const domains = input.split(/[\n,]+/).map(d => d.trim()).filter(Boolean);
    if (domains.length === 0) {
      setError('Please enter at least one domain name.');
      return;
    }
    if (domains.length > 50) {
      setError('Maximum 50 domains at a time.');
      return;
    }
    setResults(domains.map(extractKeywords));
  }, [input]);

  const exportCSV = useCallback(() => {
    if (results.length === 0) return;
    const rows = [['Domain', 'Clean Name', 'TLD', 'Length', 'Keywords', 'Characteristics']];
    results.forEach(r => {
      rows.push([
        r.original,
        r.cleanName,
        r.tld,
        r.length,
        r.words.map(w => w.word).join(', '),
        r.characteristics.join('; '),
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'domain-keywords.csv'; a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter domain names (one per line or comma-separated)&#10;e.g. techstartup.com, airbnb.com, stackoverflow.io"
          rows={4}
          style={{
            flex: '1 1 100%', padding: '14px 16px', background: '#111', border: '1px solid #2a2a2a',
            borderRadius: '10px', color: '#fff', fontSize: '0.95rem', fontFamily: 'ui-monospace, monospace',
            resize: 'vertical', outline: 'none', lineHeight: 1.6,
          }}
          onFocus={e => e.target.style.borderColor = '#8b5cf6'}
          onBlur={e => e.target.style.borderColor = '#2a2a2a'}
        />
        <button
          onClick={analyze}
          style={{
            padding: '12px 32px', background: '#8b5cf6', color: '#fff', border: 'none',
            borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
          onMouseLeave={e => e.currentTarget.style.background = '#8b5cf6'}
        >
          Extract Keywords
        </button>
        {results.length > 0 && (
          <button
            onClick={exportCSV}
            style={{
              padding: '12px 24px', background: 'transparent', color: '#8b5cf6', border: '1px solid #8b5cf6',
              borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Export CSV
          </button>
        )}
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
      )}

      {results.map((r, i) => (
        <div key={i} style={{
          background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px',
          padding: '24px', marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, fontFamily: 'ui-monospace, monospace' }}>
              {r.original}
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              <span style={{ fontSize: '0.75rem', background: '#1a1a2e', color: '#8b5cf6', padding: '3px 10px', borderRadius: '6px' }}>
                .{r.tld}
              </span>
              <span style={{ fontSize: '0.75rem', background: '#1a1a1a', color: '#9ca3af', padding: '3px 10px', borderRadius: '6px' }}>
                {r.length} chars
              </span>
            </div>
          </div>

          {/* Word breakdown */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Extracted Keywords
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {r.words.map((w, j) => (
                <div key={j} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  background: '#0a0a0a', border: `1px solid ${typeColors[w.type]}33`, borderRadius: '10px',
                  padding: '10px 16px',
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'ui-monospace, monospace', color: typeColors[w.type] }}>
                    {w.word}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: typeColors[w.type], opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {typeLabels[w.type]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual breakdown bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Name Structure
            </div>
            <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '32px' }}>
              {r.words.map((w, j) => (
                <div key={j} style={{
                  flex: w.word.length,
                  background: typeColors[w.type] + '33',
                  borderRight: j < r.words.length - 1 ? '1px solid #000' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', color: typeColors[w.type], fontWeight: 600,
                  fontFamily: 'ui-monospace, monospace',
                }}>
                  {w.word}
                </div>
              ))}
            </div>
          </div>

          {/* Characteristics */}
          {r.characteristics.length > 0 && (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Characteristics
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {r.characteristics.map((c, j) => (
                  <span key={j} style={{
                    fontSize: '0.75rem', background: '#1a1a1a', color: '#9ca3af',
                    padding: '4px 12px', borderRadius: '6px', border: '1px solid #2a2a2a',
                  }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
