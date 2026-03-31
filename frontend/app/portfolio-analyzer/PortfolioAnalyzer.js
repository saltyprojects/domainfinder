'use client';

import { useState, useCallback } from 'react';

const VOWELS = new Set('aeiou');
const PREMIUM_TLDS = { com: 100, ai: 92, io: 88, co: 82, dev: 80, app: 78, net: 70, org: 68, me: 65, xyz: 50 };
const PRONOUNCEABLE = /^(?:[bcdfghjklmnpqrstvwxyz]?[aeiou][bcdfghjklmnpqrstvwxyz]?)+$/i;

function parseDomain(input) {
  const cleaned = input.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const parts = cleaned.split('.');
  if (parts.length < 2 || !parts[0]) return null;
  return { name: parts[0], tld: parts.slice(1).join('.'), full: cleaned };
}

function scoreDomain(input) {
  const parsed = parseDomain(input);
  if (!parsed) return null;
  const { name, tld, full } = parsed;
  const len = name.length;

  // Length score
  let lengthScore;
  if (len <= 3) lengthScore = 100;
  else if (len <= 5) lengthScore = 95;
  else if (len <= 8) lengthScore = 80;
  else if (len <= 12) lengthScore = 60;
  else if (len <= 16) lengthScore = 40;
  else lengthScore = 20;

  // Brandability
  const hasNumbers = /\d/.test(name);
  const hasHyphens = name.includes('-');
  let brandScore = 80;
  if (hasNumbers) brandScore -= 25;
  if (hasHyphens) brandScore -= 20;
  if (len <= 6) brandScore += 15;
  else if (len > 12) brandScore -= 15;
  const uniqueChars = new Set(name.replace(/[^a-z]/g, '')).size;
  if (uniqueChars >= 4) brandScore += 5;
  brandScore = Math.max(0, Math.min(100, brandScore));

  // Pronounceability
  const letters = name.replace(/[^a-z]/g, '');
  let pronounce = PRONOUNCEABLE.test(letters) ? 85 : 50;
  let maxConsonants = 0, run = 0;
  for (const ch of letters) {
    if (!VOWELS.has(ch)) { run++; maxConsonants = Math.max(maxConsonants, run); } else run = 0;
  }
  if (maxConsonants >= 4) pronounce -= 30;
  else if (maxConsonants >= 3) pronounce -= 15;
  const vowelRatio = [...letters].filter(c => VOWELS.has(c)).length / (letters.length || 1);
  if (vowelRatio >= 0.3 && vowelRatio <= 0.5) pronounce += 10;
  pronounce = Math.max(0, Math.min(100, pronounce));

  // TLD
  const tldScore = PREMIUM_TLDS[tld] ?? 40;

  // Overall
  const overall = Math.round(lengthScore * 0.25 + brandScore * 0.25 + pronounce * 0.25 + tldScore * 0.25);

  let grade;
  if (overall >= 90) grade = 'A+';
  else if (overall >= 80) grade = 'A';
  else if (overall >= 70) grade = 'B';
  else if (overall >= 60) grade = 'C';
  else if (overall >= 50) grade = 'D';
  else grade = 'F';

  return { name, tld, full, overall, grade, lengthScore, brandScore, pronounce, tldScore, length: len, hasNumbers, hasHyphens };
}

async function fetchRdap(domain) {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    const events = data.events || [];
    const reg = events.find(e => e.eventAction === 'registration')?.eventDate;
    const exp = events.find(e => e.eventAction === 'expiration')?.eventDate;
    const registrar = (data.entities || []).find(e => (e.roles || []).includes('registrar'))?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || null;
    return { registered: reg || null, expires: exp || null, registrar };
  } catch { return null; }
}

function gradeColor(grade) {
  if (grade === 'A+' || grade === 'A') return '#4ade80';
  if (grade === 'B') return '#a3e635';
  if (grade === 'C') return '#fbbf24';
  if (grade === 'D') return '#f97316';
  return '#ef4444';
}

function daysBetween(d1, d2) {
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

export default function PortfolioAnalyzer() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('overall');
  const [sortDir, setSortDir] = useState('desc');

  const analyze = useCallback(async () => {
    const domains = input.split(/[\n,]+/).map(d => d.trim()).filter(Boolean);
    if (domains.length === 0) return;
    setLoading(true);
    setResults(null);

    const scored = domains.map(d => scoreDomain(d)).filter(Boolean);
    // Fetch RDAP in parallel (max 20)
    const toFetch = scored.slice(0, 50);
    const rdapResults = await Promise.all(toFetch.map(s => fetchRdap(s.full)));
    
    const enriched = toFetch.map((s, i) => {
      const rdap = rdapResults[i];
      const regDate = rdap?.registered ? new Date(rdap.registered) : null;
      const expDate = rdap?.expires ? new Date(rdap.expires) : null;
      const now = new Date();
      const ageDays = regDate ? daysBetween(regDate, now) : null;
      const ageYears = ageDays ? (ageDays / 365.25).toFixed(1) : null;
      const daysToExpiry = expDate ? daysBetween(now, expDate) : null;
      return { ...s, regDate, expDate, ageYears: ageYears ? parseFloat(ageYears) : null, daysToExpiry, registrar: rdap?.registrar || null };
    });

    // Portfolio stats
    const avgScore = Math.round(enriched.reduce((a, d) => a + d.overall, 0) / enriched.length);
    const avgLength = (enriched.reduce((a, d) => a + d.length, 0) / enriched.length).toFixed(1);
    const tldDist = {};
    enriched.forEach(d => { tldDist[d.tld] = (tldDist[d.tld] || 0) + 1; });
    const gradeDist = {};
    enriched.forEach(d => { gradeDist[d.grade] = (gradeDist[d.grade] || 0) + 1; });
    const withAge = enriched.filter(d => d.ageYears !== null);
    const avgAge = withAge.length ? (withAge.reduce((a, d) => a + d.ageYears, 0) / withAge.length).toFixed(1) : null;
    const expiringSoon = enriched.filter(d => d.daysToExpiry !== null && d.daysToExpiry <= 90 && d.daysToExpiry > 0);
    const comCount = enriched.filter(d => d.tld === 'com').length;
    const comPct = ((comCount / enriched.length) * 100).toFixed(0);
    const best = enriched.reduce((a, b) => a.overall >= b.overall ? a : b);
    const worst = enriched.reduce((a, b) => a.overall <= b.overall ? a : b);

    let portfolioGrade;
    if (avgScore >= 90) portfolioGrade = 'A+';
    else if (avgScore >= 80) portfolioGrade = 'A';
    else if (avgScore >= 70) portfolioGrade = 'B';
    else if (avgScore >= 60) portfolioGrade = 'C';
    else if (avgScore >= 50) portfolioGrade = 'D';
    else portfolioGrade = 'F';

    setResults({
      domains: enriched,
      stats: { avgScore, avgLength, tldDist, gradeDist, avgAge, expiringSoon, comPct, best, worst, portfolioGrade, total: enriched.length },
    });
    setLoading(false);
  }, [input]);

  const sorted = results?.domains?.slice().sort((a, b) => {
    let va = a[sortBy], vb = b[sortBy];
    if (va == null) va = -Infinity;
    if (vb == null) vb = -Infinity;
    return sortDir === 'desc' ? vb - va : va - vb;
  });

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const exportCSV = () => {
    if (!sorted) return;
    const headers = ['Domain', 'Score', 'Grade', 'Length', 'TLD', 'Brand', 'Pronounce', 'Age (years)', 'Days to Expiry', 'Registrar'];
    const rows = sorted.map(d => [d.full, d.overall, d.grade, d.length, d.tld, d.brandScore, d.pronounce, d.ageYears ?? '', d.daysToExpiry ?? '', d.registrar ?? '']);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'domain-portfolio-analysis.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle = {
    width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #333',
    background: '#111', color: '#fff', fontSize: '0.95rem', resize: 'vertical',
    minHeight: '120px', fontFamily: 'ui-monospace, monospace', lineHeight: 1.6,
  };
  const btnStyle = {
    padding: '14px 32px', borderRadius: '12px', border: 'none', fontWeight: 700,
    fontSize: '1rem', cursor: 'pointer', background: '#8b5cf6', color: '#fff',
    opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s',
  };
  const cardStyle = {
    background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e',
  };

  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', color: '#9ca3af', marginBottom: '8px' }}>
          Enter domains (one per line or comma-separated, up to 50)
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'example.com\nmydomain.io\nstartup.ai\nbrand.co'}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={analyze} disabled={loading || !input.trim()} style={btnStyle}>
            {loading ? 'Analyzing Portfolio...' : 'Analyze Portfolio'}
          </button>
          {results && (
            <button onClick={exportCSV} style={{ ...btnStyle, background: 'transparent', border: '1px solid #8b5cf6', color: '#8b5cf6' }}>
              Export CSV
            </button>
          )}
        </div>
      </div>

      {results && (
        <>
          {/* Portfolio Overview */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>Portfolio Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Total Domains', value: results.stats.total, icon: '📦' },
                { label: 'Portfolio Grade', value: results.stats.portfolioGrade, icon: '🏆', color: gradeColor(results.stats.portfolioGrade) },
                { label: 'Avg Score', value: results.stats.avgScore + '/100', icon: '📊' },
                { label: 'Avg Length', value: results.stats.avgLength + ' chars', icon: '📏' },
                { label: '.com Coverage', value: results.stats.comPct + '%', icon: '🌐' },
                { label: 'Avg Age', value: results.stats.avgAge ? results.stats.avgAge + ' yrs' : 'N/A', icon: '📅' },
              ].map(s => (
                <div key={s.label} style={cardStyle}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color || '#fff' }}>{s.value}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Best & Worst */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ ...cardStyle, borderColor: '#4ade80' }}>
                <div style={{ fontSize: '0.8rem', color: '#4ade80', marginBottom: '4px' }}>🏅 Best Domain</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{results.stats.best.full}</div>
                <div style={{ color: '#4ade80', fontSize: '0.9rem' }}>Score: {results.stats.best.overall} ({results.stats.best.grade})</div>
              </div>
              <div style={{ ...cardStyle, borderColor: '#f97316' }}>
                <div style={{ fontSize: '0.8rem', color: '#f97316', marginBottom: '4px' }}>⚠️ Weakest Domain</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{results.stats.worst.full}</div>
                <div style={{ color: '#f97316', fontSize: '0.9rem' }}>Score: {results.stats.worst.overall} ({results.stats.worst.grade})</div>
              </div>
            </div>

            {/* TLD Distribution */}
            <div style={{ ...cardStyle, marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>TLD Distribution</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {Object.entries(results.stats.tldDist).sort((a, b) => b[1] - a[1]).map(([tld, count]) => (
                  <div key={tld} style={{ background: '#1a1a2e', borderRadius: '8px', padding: '8px 14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#8b5cf6' }}>.{tld}</span>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{count} ({((count / results.stats.total) * 100).toFixed(0)}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Distribution */}
            <div style={{ ...cardStyle, marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Grade Distribution</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['A+', 'A', 'B', 'C', 'D', 'F'].filter(g => results.stats.gradeDist[g]).map(g => (
                  <div key={g} style={{ background: '#1a1a2e', borderRadius: '8px', padding: '8px 14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: gradeColor(g) }}>{g}</span>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{results.stats.gradeDist[g]} domain{results.stats.gradeDist[g] > 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expiring Soon Alert */}
            {results.stats.expiringSoon.length > 0 && (
              <div style={{ ...cardStyle, borderColor: '#ef4444', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ef4444', marginBottom: '8px' }}>⚠️ Expiring Within 90 Days</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {results.stats.expiringSoon.map(d => (
                    <div key={d.full} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ fontFamily: 'ui-monospace, monospace' }}>{d.full}</span>
                      <span style={{ color: '#ef4444' }}>{d.daysToExpiry} days left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Domain Table */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>Domain Details</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    {[
                      { key: 'full', label: 'Domain' },
                      { key: 'overall', label: 'Score' },
                      { key: 'grade', label: 'Grade' },
                      { key: 'length', label: 'Length' },
                      { key: 'brandScore', label: 'Brand' },
                      { key: 'pronounce', label: 'Pronounce' },
                      { key: 'tldScore', label: 'TLD' },
                      { key: 'ageYears', label: 'Age' },
                      { key: 'daysToExpiry', label: 'Expires' },
                    ].map(col => (
                      <th
                        key={col.key}
                        onClick={() => col.key !== 'full' && col.key !== 'grade' && toggleSort(col.key)}
                        style={{
                          textAlign: col.key === 'full' ? 'left' : 'center',
                          padding: '10px 8px', color: '#9ca3af', fontWeight: 600,
                          cursor: col.key !== 'full' && col.key !== 'grade' ? 'pointer' : 'default',
                          whiteSpace: 'nowrap', userSelect: 'none',
                        }}
                      >
                        {col.label}{sortBy === col.key ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((d, i) => (
                    <tr key={d.full} style={{ borderBottom: '1px solid #1e1e1e', background: i % 2 === 0 ? 'transparent' : '#0a0a0a' }}>
                      <td style={{ padding: '10px 8px', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{d.full}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700 }}>{d.overall}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700, color: gradeColor(d.grade) }}>{d.grade}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#9ca3af' }}>{d.length}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#9ca3af' }}>{d.brandScore}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#9ca3af' }}>{d.pronounce}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#9ca3af' }}>{d.tldScore}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#9ca3af' }}>{d.ageYears ? d.ageYears + 'y' : '—'}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: d.daysToExpiry !== null && d.daysToExpiry <= 90 ? '#ef4444' : '#9ca3af' }}>
                        {d.daysToExpiry !== null ? d.daysToExpiry + 'd' : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ ...cardStyle, marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>💡 Portfolio Recommendations</h2>
            <ul style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
              {parseFloat(results.stats.comPct) < 50 && <li>Consider acquiring more .com domains — they carry the most trust and SEO weight. Only {results.stats.comPct}% of your portfolio is .com.</li>}
              {parseFloat(results.stats.avgLength) > 10 && <li>Your average domain length ({results.stats.avgLength} chars) is on the long side. Shorter domains tend to be more memorable and brandable.</li>}
              {results.stats.expiringSoon.length > 0 && <li style={{ color: '#ef4444' }}>Renew {results.stats.expiringSoon.length} domain{results.stats.expiringSoon.length > 1 ? 's' : ''} expiring within 90 days to avoid losing them.</li>}
              {results.stats.avgScore < 60 && <li>Portfolio quality is below average (score {results.stats.avgScore}). Focus on acquiring shorter, more brandable names on premium TLDs.</li>}
              {results.stats.avgScore >= 80 && <li>Strong portfolio! Your average score of {results.stats.avgScore} indicates high-quality, brandable domains.</li>}
              {results.stats.gradeDist['F'] > 0 && <li>Consider divesting {results.stats.gradeDist['F']} F-grade domain{results.stats.gradeDist['F'] > 1 ? 's' : ''} — they may not be worth renewal fees.</li>}
              <li>Use the CSV export to track your portfolio over time and identify trends.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
