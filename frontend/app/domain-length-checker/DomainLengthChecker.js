'use client';

import { useState } from 'react';

const TLD_DATA = [
  { tld: '.com', reg: '$9–15/yr', renewal: '$15–20/yr', trust: 'Highest', seo: '★★★★★' },
  { tld: '.net', reg: '$10–15/yr', renewal: '$15–18/yr', trust: 'High', seo: '★★★★☆' },
  { tld: '.org', reg: '$10–14/yr', renewal: '$15–18/yr', trust: 'High', seo: '★★★★☆' },
  { tld: '.io', reg: '$30–50/yr', renewal: '$40–60/yr', trust: 'High (tech)', seo: '★★★★☆' },
  { tld: '.co', reg: '$10–25/yr', renewal: '$25–35/yr', trust: 'Medium', seo: '★★★☆☆' },
  { tld: '.ai', reg: '$50–90/yr', renewal: '$70–100/yr', trust: 'High (AI)', seo: '★★★★☆' },
  { tld: '.dev', reg: '$12–18/yr', renewal: '$15–20/yr', trust: 'Medium', seo: '★★★☆☆' },
  { tld: '.app', reg: '$12–18/yr', renewal: '$15–20/yr', trust: 'Medium', seo: '★★★☆☆' },
];

function getCharBreakdown(name) {
  const letters = (name.match(/[a-zA-Z]/g) || []).length;
  const numbers = (name.match(/[0-9]/g) || []).length;
  const hyphens = (name.match(/-/g) || []).length;
  return { letters, numbers, hyphens };
}

function getLengthRating(len) {
  if (len <= 5) return { label: 'Excellent — Premium & memorable', color: '#22c55e', tier: 'premium' };
  if (len <= 8) return { label: 'Great — Short & brandable', color: '#22c55e', tier: 'great' };
  if (len <= 12) return { label: 'Good — Average domain length', color: '#eab308', tier: 'good' };
  if (len <= 15) return { label: 'Fair — Getting long', color: '#f97316', tier: 'fair' };
  return { label: 'Long — Hard to remember & type', color: '#ef4444', tier: 'poor' };
}

function getTypeability(name) {
  const hasDoubleLetters = /(.)\1/.test(name);
  const hasHyphens = name.includes('-');
  const hasNumbers = /\d/.test(name);
  const len = name.length;
  let score = 100;
  if (len > 12) score -= (len - 12) * 3;
  if (hasDoubleLetters) score -= 8;
  if (hasHyphens) score -= 12;
  if (hasNumbers) score -= 10;
  // Difficult letter combos
  if (/[qxz]/i.test(name)) score -= 5;
  return Math.max(10, Math.min(100, score));
}

function getMemorability(name) {
  const len = name.length;
  const hasNumbers = /\d/.test(name);
  const hasHyphens = name.includes('-');
  const isPronounceable = /[aeiou]/i.test(name) && /[bcdfghjklmnpqrstvwxyz]/i.test(name);
  let score = 100;
  if (len > 6) score -= (len - 6) * 4;
  if (hasNumbers) score -= 15;
  if (hasHyphens) score -= 15;
  if (!isPronounceable) score -= 20;
  return Math.max(10, Math.min(100, score));
}

function getBrandability(name) {
  const len = name.length;
  const hasNumbers = /\d/.test(name);
  const hasHyphens = name.includes('-');
  const hasVowels = /[aeiou]/i.test(name);
  const hasConsonants = /[bcdfghjklmnpqrstvwxyz]/i.test(name);
  let score = 100;
  if (len > 10) score -= (len - 10) * 5;
  if (len < 3) score -= 20;
  if (hasNumbers) score -= 20;
  if (hasHyphens) score -= 20;
  if (!hasVowels || !hasConsonants) score -= 15;
  return Math.max(10, Math.min(100, score));
}

export default function DomainLengthChecker() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkResults, setBulkResults] = useState([]);

  const analyzeDomain = (raw) => {
    const cleaned = raw.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
    const parts = cleaned.split('.');
    const name = parts[0] || '';
    const tld = parts.length > 1 ? '.' + parts.slice(1).join('.') : '';
    const nameLen = name.length;
    const totalLen = cleaned.length;
    const rating = getLengthRating(nameLen);
    const breakdown = getCharBreakdown(name);
    const typeability = getTypeability(name);
    const memorability = getMemorability(name);
    const brandability = getBrandability(name);

    return {
      original: raw,
      cleaned,
      name,
      tld: tld || '.com',
      nameLength: nameLen,
      totalLength: totalLen,
      rating,
      breakdown,
      typeability,
      memorability,
      brandability,
    };
  };

  const handleCheck = () => {
    if (!input.trim()) return;
    if (bulkMode) {
      const lines = input.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 50);
      const res = lines.map(analyzeDomain);
      res.sort((a, b) => a.nameLength - b.nameLength);
      setBulkResults(res);
      setResults(null);
    } else {
      setResults(analyzeDomain(input));
      setBulkResults([]);
    }
  };

  const ScoreBar = ({ value, label, color }) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color }}>{value}/100</span>
      </div>
      <div style={{ height: '8px', background: '#1e1e1e', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );

  const scoreColor = (v) => v >= 75 ? '#22c55e' : v >= 50 ? '#eab308' : v >= 30 ? '#f97316' : '#ef4444';

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => { setBulkMode(false); setBulkResults([]); }}
          style={{
            padding: '8px 16px', borderRadius: '6px', border: '1px solid #333', cursor: 'pointer',
            background: !bulkMode ? '#8b5cf6' : '#111', color: '#fff', fontWeight: 600, fontSize: '0.85rem',
          }}
        >Single Domain</button>
        <button
          onClick={() => { setBulkMode(true); setResults(null); }}
          style={{
            padding: '8px 16px', borderRadius: '6px', border: '1px solid #333', cursor: 'pointer',
            background: bulkMode ? '#8b5cf6' : '#111', color: '#fff', fontWeight: 600, fontSize: '0.85rem',
          }}
        >Bulk Check (up to 50)</button>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {bulkMode ? (
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter one domain per line, e.g.:\ngoogle.com\namazon.com\nstripe.com"
            rows={5}
            style={{
              flex: 1, padding: '14px', background: '#111', border: '1px solid #333', borderRadius: '8px',
              color: '#fff', fontSize: '1rem', resize: 'vertical', fontFamily: 'inherit',
            }}
          />
        ) : (
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            placeholder="Enter a domain name (e.g., google.com)"
            style={{
              flex: 1, padding: '14px', background: '#111', border: '1px solid #333', borderRadius: '8px',
              color: '#fff', fontSize: '1rem',
            }}
          />
        )}
        <button
          onClick={handleCheck}
          style={{
            padding: '14px 24px', background: '#8b5cf6', color: '#fff', border: 'none',
            borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', whiteSpace: 'nowrap',
          }}
        >Analyze</button>
      </div>

      {/* Single Result */}
      {results && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Main stats */}
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{
                fontSize: '3rem', fontWeight: 800, color: results.rating.color,
                lineHeight: 1, fontFamily: 'monospace',
              }}>{results.nameLength}</div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                  characters in &quot;{results.name}&quot;
                </div>
                <div style={{ fontSize: '0.95rem', color: results.rating.color, fontWeight: 600 }}>
                  {results.rating.label}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>Domain Name</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6' }}>{results.name}</div>
              </div>
              <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>TLD</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ccc' }}>{results.tld}</div>
              </div>
              <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>Name Length</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: results.rating.color }}>{results.nameLength}</div>
              </div>
              <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>Total Length</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ccc' }}>{results.totalLength}</div>
              </div>
            </div>

            {/* Character Breakdown */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Character Breakdown</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: '#1a1a2e', color: '#8b5cf6', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                  {results.breakdown.letters} letters
                </span>
                <span style={{ background: '#1a1a2e', color: '#eab308', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                  {results.breakdown.numbers} numbers
                </span>
                <span style={{ background: '#1a1a2e', color: '#f97316', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                  {results.breakdown.hyphens} hyphens
                </span>
              </div>
            </div>

            {/* Scores */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#666', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domain Quality Scores</h3>
              <ScoreBar value={results.typeability} label="Typeability" color={scoreColor(results.typeability)} />
              <ScoreBar value={results.memorability} label="Memorability" color={scoreColor(results.memorability)} />
              <ScoreBar value={results.brandability} label="Brandability" color={scoreColor(results.brandability)} />
            </div>
          </div>

          {/* Length comparison */}
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>How &quot;{results.name}&quot; Compares</h3>
            {[
              { name: 'google', len: 6 },
              { name: 'amazon', len: 6 },
              { name: 'stripe', len: 6 },
              { name: results.name, len: results.nameLength, highlight: true },
              { name: 'facebook', len: 8 },
              { name: 'instagram', len: 9 },
              { name: 'salesforce', len: 10 },
            ].sort((a, b) => a.len - b.len).map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px',
                padding: '6px 10px', borderRadius: '6px',
                background: item.highlight ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                border: item.highlight ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
              }}>
                <span style={{ fontSize: '0.85rem', color: item.highlight ? '#8b5cf6' : '#999', width: '100px', fontWeight: item.highlight ? 700 : 400 }}>
                  {item.name}
                </span>
                <div style={{ flex: 1, height: '12px', background: '#1e1e1e', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${Math.min(100, item.len * 7)}%`,
                    background: item.highlight ? '#8b5cf6' : '#333',
                    borderRadius: '6px',
                  }} />
                </div>
                <span style={{ fontSize: '0.85rem', color: item.highlight ? '#8b5cf6' : '#666', fontWeight: 600, width: '20px', textAlign: 'right' }}>
                  {item.len}
                </span>
              </div>
            ))}
          </div>

          {/* TLD options */}
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>TLD Options for &quot;{results.name}&quot;</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '8px', color: '#666' }}>Domain</th>
                    <th style={{ textAlign: 'left', padding: '8px', color: '#666' }}>Total Length</th>
                    <th style={{ textAlign: 'left', padding: '8px', color: '#666' }}>Registration</th>
                    <th style={{ textAlign: 'left', padding: '8px', color: '#666' }}>Renewal</th>
                    <th style={{ textAlign: 'left', padding: '8px', color: '#666' }}>Trust</th>
                    <th style={{ textAlign: 'left', padding: '8px', color: '#666' }}>SEO</th>
                  </tr>
                </thead>
                <tbody>
                  {TLD_DATA.map(tld => (
                    <tr key={tld.tld} style={{ borderBottom: '1px solid #1e1e1e' }}>
                      <td style={{ padding: '8px', color: '#8b5cf6', fontWeight: 600 }}>{results.name}{tld.tld}</td>
                      <td style={{ padding: '8px', color: '#ccc' }}>{results.name.length + tld.tld.length}</td>
                      <td style={{ padding: '8px', color: '#ccc' }}>{tld.reg}</td>
                      <td style={{ padding: '8px', color: '#ccc' }}>{tld.renewal}</td>
                      <td style={{ padding: '8px', color: '#ccc' }}>{tld.trust}</td>
                      <td style={{ padding: '8px', color: '#ccc' }}>{tld.seo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Results */}
      {bulkResults.length > 0 && (
        <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
            Bulk Results — {bulkResults.length} domains (sorted by length)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#666' }}>Domain</th>
                  <th style={{ textAlign: 'center', padding: '8px', color: '#666' }}>Name Length</th>
                  <th style={{ textAlign: 'center', padding: '8px', color: '#666' }}>Total</th>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#666' }}>Rating</th>
                  <th style={{ textAlign: 'center', padding: '8px', color: '#666' }}>Type</th>
                  <th style={{ textAlign: 'center', padding: '8px', color: '#666' }}>Memo</th>
                  <th style={{ textAlign: 'center', padding: '8px', color: '#666' }}>Brand</th>
                </tr>
              </thead>
              <tbody>
                {bulkResults.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e1e1e' }}>
                    <td style={{ padding: '8px', color: '#8b5cf6', fontWeight: 600 }}>{r.cleaned || r.name + r.tld}</td>
                    <td style={{ padding: '8px', color: r.rating.color, fontWeight: 700, textAlign: 'center' }}>{r.nameLength}</td>
                    <td style={{ padding: '8px', color: '#ccc', textAlign: 'center' }}>{r.totalLength}</td>
                    <td style={{ padding: '8px', color: r.rating.color, fontSize: '0.8rem' }}>{r.rating.label.split('—')[0].trim()}</td>
                    <td style={{ padding: '8px', color: scoreColor(r.typeability), textAlign: 'center', fontWeight: 600 }}>{r.typeability}</td>
                    <td style={{ padding: '8px', color: scoreColor(r.memorability), textAlign: 'center', fontWeight: 600 }}>{r.memorability}</td>
                    <td style={{ padding: '8px', color: scoreColor(r.brandability), textAlign: 'center', fontWeight: 600 }}>{r.brandability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
