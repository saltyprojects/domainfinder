'use client';

import { useState, useCallback } from 'react';

/* ─── Scoring helpers (all client-side, no API needed) ─── */

const PREMIUM_TLDS = { '.com': 10, '.net': 7, '.org': 7, '.io': 6, '.ai': 7, '.co': 6, '.dev': 5, '.app': 5 };
const COMMON_TLDS = { '.me': 4, '.xyz': 3, '.info': 3, '.biz': 3, '.us': 4, '.uk': 4, '.de': 4, '.ca': 4, '.tech': 4, '.online': 3 };

const HIGH_VALUE_KEYWORDS = [
  'ai', 'crypto', 'cloud', 'data', 'tech', 'health', 'finance', 'trade', 'pay', 'money',
  'auto', 'home', 'shop', 'buy', 'sell', 'bet', 'game', 'play', 'app', 'web',
  'seo', 'ads', 'lead', 'crm', 'saas', 'api', 'code', 'dev', 'lab', 'hub',
  'digital', 'media', 'social', 'market', 'brand', 'design', 'studio', 'agency',
  'legal', 'law', 'insure', 'invest', 'loan', 'credit', 'bank', 'fund',
  'edu', 'learn', 'course', 'coach', 'fit', 'diet', 'care', 'med',
  'travel', 'hotel', 'flight', 'car', 'rent', 'real', 'estate', 'property',
];

function extractParts(domain) {
  const dot = domain.lastIndexOf('.');
  if (dot < 1) return { sld: domain, tld: '' };
  return { sld: domain.slice(0, dot), tld: domain.slice(dot) };
}

function hasNumbers(s) { return /\d/.test(s); }
function hasHyphens(s) { return s.includes('-'); }
function isAllLetters(s) { return /^[a-z]+$/.test(s); }
function isPronounceable(s) {
  // Rough heuristic: no 3+ consonants in a row, has vowels
  if (!/[aeiou]/i.test(s)) return false;
  if (/[^aeiou]{4,}/i.test(s)) return false;
  return true;
}
function isDictionaryLike(s) {
  // Very rough: 3-8 chars, all letters, pronounceable
  return s.length >= 3 && s.length <= 8 && isAllLetters(s) && isPronounceable(s);
}

function scoreDomain(domain) {
  const { sld, tld } = extractParts(domain);
  const factors = [];
  let total = 0;

  // 1. TLD Quality (0-10)
  const tldScore = PREMIUM_TLDS[tld] || COMMON_TLDS[tld] || 2;
  factors.push({ name: 'TLD Quality', score: tldScore, max: 10, detail: tld === '.com' ? 'Premium .com TLD — highest commercial value' : `${tld} TLD` });
  total += tldScore;

  // 2. Length (0-10)
  let lenScore;
  if (sld.length <= 3) lenScore = 10;
  else if (sld.length <= 5) lenScore = 9;
  else if (sld.length <= 7) lenScore = 8;
  else if (sld.length <= 10) lenScore = 6;
  else if (sld.length <= 15) lenScore = 4;
  else lenScore = 2;
  factors.push({ name: 'Domain Length', score: lenScore, max: 10, detail: `${sld.length} characters — ${sld.length <= 5 ? 'ultra-short, very valuable' : sld.length <= 10 ? 'good length' : 'longer names are harder to brand'}` });
  total += lenScore;

  // 3. Brandability (0-10)
  let brandScore = 5;
  if (isAllLetters(sld)) brandScore += 2;
  if (isPronounceable(sld)) brandScore += 2;
  if (isDictionaryLike(sld)) brandScore += 1;
  if (hasNumbers(sld)) brandScore -= 2;
  if (hasHyphens(sld)) brandScore -= 3;
  brandScore = Math.max(0, Math.min(10, brandScore));
  factors.push({ name: 'Brandability', score: brandScore, max: 10, detail: isPronounceable(sld) ? 'Easy to pronounce and remember' : 'May be harder to brand verbally' });
  total += brandScore;

  // 4. Keyword Value (0-10)
  const sldLower = sld.toLowerCase();
  const matchedKws = HIGH_VALUE_KEYWORDS.filter(kw => sldLower.includes(kw));
  let kwScore = Math.min(10, matchedKws.length * 3);
  if (matchedKws.length === 0) kwScore = 1;
  factors.push({ name: 'Keyword Value', score: kwScore, max: 10, detail: matchedKws.length > 0 ? `Contains: ${matchedKws.join(', ')}` : 'No high-value keywords detected' });
  total += kwScore;

  // 5. Character Composition (0-10)
  let charScore = 7;
  if (isAllLetters(sld)) charScore = 10;
  if (hasNumbers(sld)) charScore -= 2;
  if (hasHyphens(sld)) charScore -= 3;
  if (/^[a-z]{2,4}$/.test(sld)) charScore = 10; // Short letter-only = premium
  charScore = Math.max(0, Math.min(10, charScore));
  factors.push({ name: 'Character Quality', score: charScore, max: 10, detail: isAllLetters(sld) ? 'All letters — clean and professional' : 'Numbers or hyphens reduce perceived quality' });
  total += charScore;

  // 6. Memorability (0-10)
  let memScore = 5;
  if (sld.length <= 6) memScore += 2;
  if (isPronounceable(sld)) memScore += 2;
  if (isDictionaryLike(sld)) memScore += 1;
  if (hasHyphens(sld)) memScore -= 2;
  memScore = Math.max(0, Math.min(10, memScore));
  factors.push({ name: 'Memorability', score: memScore, max: 10, detail: memScore >= 7 ? 'Highly memorable — easy to recall' : 'Average memorability' });
  total += memScore;

  // Estimated value range
  const avgScore = total / 6;
  let minVal, maxVal;
  if (tld === '.com') {
    if (avgScore >= 9) { minVal = 50000; maxVal = 500000; }
    else if (avgScore >= 8) { minVal = 10000; maxVal = 100000; }
    else if (avgScore >= 7) { minVal = 2000; maxVal = 25000; }
    else if (avgScore >= 6) { minVal = 500; maxVal = 5000; }
    else if (avgScore >= 4) { minVal = 100; maxVal = 1000; }
    else { minVal = 10; maxVal = 200; }
  } else if (PREMIUM_TLDS[tld]) {
    if (avgScore >= 9) { minVal = 10000; maxVal = 100000; }
    else if (avgScore >= 7) { minVal = 1000; maxVal = 15000; }
    else if (avgScore >= 5) { minVal = 200; maxVal = 3000; }
    else { minVal = 10; maxVal = 500; }
  } else {
    if (avgScore >= 9) { minVal = 2000; maxVal = 20000; }
    else if (avgScore >= 7) { minVal = 200; maxVal = 3000; }
    else if (avgScore >= 5) { minVal = 50; maxVal = 500; }
    else { minVal = 5; maxVal = 100; }
  }

  const grade = avgScore >= 9 ? 'A+' : avgScore >= 8 ? 'A' : avgScore >= 7 ? 'B+' : avgScore >= 6 ? 'B' : avgScore >= 5 ? 'C+' : avgScore >= 4 ? 'C' : 'D';

  return { factors, total, avgScore, minVal, maxVal, grade, sld, tld };
}

function fmt(n) {
  return n >= 1000 ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `$${n}`;
}

/* ─── DNS enrichment via dns.google ─── */
async function fetchDNSInfo(domain) {
  const info = {};
  try {
    const [aRes, mxRes, nsRes] = await Promise.all([
      fetch(`https://dns.google/resolve?name=${domain}&type=A`).then(r => r.json()).catch(() => null),
      fetch(`https://dns.google/resolve?name=${domain}&type=MX`).then(r => r.json()).catch(() => null),
      fetch(`https://dns.google/resolve?name=${domain}&type=NS`).then(r => r.json()).catch(() => null),
    ]);
    info.hasA = !!(aRes?.Answer?.length);
    info.hasMX = !!(mxRes?.Answer?.length);
    info.nsCount = nsRes?.Answer?.length || 0;
    info.resolves = info.hasA;
  } catch {
    info.resolves = false;
  }
  return info;
}

/* ─── Styles ─── */
const input = { width: '100%', padding: '14px 16px', background: '#1a1a2e', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none' };
const btn = { padding: '14px 32px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' };
const card = { background: '#1a1a2e', borderRadius: '12px', border: '1px solid #2a2a4a', padding: '24px', marginBottom: '16px' };

export default function DomainAppraisalTool() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [dnsInfo, setDnsInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const appraise = useCallback(async () => {
    let d = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    if (!d || !d.includes('.')) return;
    setLoading(true);
    setDnsInfo(null);

    const scores = scoreDomain(d);
    setResult(scores);

    // Parallel DNS check
    const dns = await fetchDNSInfo(d);
    setDnsInfo(dns);
    setLoading(false);
  }, [domain]);

  const gradeColor = (grade) => {
    if (grade.startsWith('A')) return '#22c55e';
    if (grade.startsWith('B')) return '#eab308';
    if (grade.startsWith('C')) return '#f97316';
    return '#ef4444';
  };

  const barColor = (score, max) => {
    const pct = score / max;
    if (pct >= 0.8) return '#22c55e';
    if (pct >= 0.6) return '#eab308';
    if (pct >= 0.4) return '#f97316';
    return '#ef4444';
  };

  return (
    <div style={{ width: '100%', maxWidth: '750px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          style={{ ...input, flex: 1, minWidth: '200px' }}
          placeholder="Enter a domain name (e.g., example.com)"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && appraise()}
        />
        <button style={btn} onClick={appraise} disabled={loading}>
          {loading ? 'Analyzing…' : 'Appraise Domain'}
        </button>
      </div>

      {result && (
        <>
          {/* Grade & Value Card */}
          <div style={{ ...card, textAlign: 'center', borderColor: gradeColor(result.grade) + '40' }}>
            <div style={{ fontSize: '4rem', fontWeight: 900, color: gradeColor(result.grade), lineHeight: 1 }}>
              {result.grade}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '4px', marginBottom: '16px' }}>
              Overall Grade — {result.total}/60 points
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>
              {fmt(result.minVal)} — {fmt(result.maxVal)}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
              Estimated Market Value Range
            </div>
          </div>

          {/* Factor Breakdown */}
          <div style={card}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Appraisal Breakdown</h3>
            {result.factors.map((f, i) => (
              <div key={i} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{f.name}</span>
                  <span style={{ color: barColor(f.score, f.max), fontWeight: 700 }}>{f.score}/{f.max}</span>
                </div>
                <div style={{ background: '#0d0d1a', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${(f.score / f.max) * 100}%`, height: '100%', background: barColor(f.score, f.max), borderRadius: '6px', transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>{f.detail}</div>
              </div>
            ))}
          </div>

          {/* DNS Status */}
          {dnsInfo && (
            <div style={card}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>DNS & Registration Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#0d0d1a', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>{dnsInfo.resolves ? '🟢' : '🔴'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
                    {dnsInfo.resolves ? 'Domain Resolves' : 'Not Resolving'}
                  </div>
                </div>
                <div style={{ background: '#0d0d1a', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>{dnsInfo.hasMX ? '📧' : '❌'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
                    {dnsInfo.hasMX ? 'Has MX Records' : 'No MX Records'}
                  </div>
                </div>
                <div style={{ background: '#0d0d1a', padding: '14px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#8b5cf6' }}>{dnsInfo.nsCount}</div>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>Nameservers</div>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div style={card}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>💡 Appraisal Notes</h3>
            <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '20px', fontSize: '0.9rem' }}>
              {result.tld !== '.com' && <li>Upgrading to a .com TLD could significantly increase value.</li>}
              {result.avgScore < 6 && <li>Consider a shorter, more brandable alternative for maximum value.</li>}
              {result.factors[3].score <= 3 && <li>Adding a trending keyword (AI, cloud, pay) can boost perceived value.</li>}
              {result.factors[2].score >= 8 && <li>Strong brandability — this domain has startup/brand potential.</li>}
              {result.factors[1].score >= 9 && <li>Ultra-short domains command premium prices in aftermarket sales.</li>}
              <li>This is an algorithmic estimate. Actual market value depends on buyer demand, comparable sales, traffic, and backlinks.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
