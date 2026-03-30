'use client';

import { useState } from 'react';

const VOWELS = new Set('aeiou');
const CONSONANTS = new Set('bcdfghjklmnpqrstvwxyz');
const COMMON_TLDS = ['com', 'net', 'org', 'io', 'ai', 'co', 'dev', 'app', 'xyz'];
const PREMIUM_TLDS = ['com', 'ai', 'io'];

// Common English syllable patterns for pronounceability
const PRONOUNCEABLE_PATTERNS = /^(?:[bcdfghjklmnpqrstvwxyz]?[aeiou][bcdfghjklmnpqrstvwxyz]?)+$/i;

function analyzeDomain(input) {
  const cleaned = input.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
  const parts = cleaned.split('.');
  
  if (parts.length < 2) return null;
  
  const name = parts[0]; // just the domain name part
  const tld = parts.slice(1).join('.');
  const full = cleaned;
  
  if (!name || name.length === 0) return null;
  
  const scores = {};
  const feedback = [];
  
  // 1. LENGTH SCORE (0-100)
  const len = name.length;
  if (len <= 4) { scores.length = 100; feedback.push({ category: 'Length', rating: 'Excellent', detail: `${len} characters — ultra-short and premium`, color: '#4ade80' }); }
  else if (len <= 6) { scores.length = 90; feedback.push({ category: 'Length', rating: 'Great', detail: `${len} characters — short and memorable`, color: '#4ade80' }); }
  else if (len <= 8) { scores.length = 75; feedback.push({ category: 'Length', rating: 'Good', detail: `${len} characters — solid length`, color: '#a3e635' }); }
  else if (len <= 12) { scores.length = 55; feedback.push({ category: 'Length', rating: 'Average', detail: `${len} characters — a bit long but workable`, color: '#fbbf24' }); }
  else if (len <= 16) { scores.length = 35; feedback.push({ category: 'Length', rating: 'Below Average', detail: `${len} characters — consider a shorter alternative`, color: '#f97316' }); }
  else { scores.length = 15; feedback.push({ category: 'Length', rating: 'Poor', detail: `${len} characters — too long for easy recall`, color: '#ef4444' }); }
  
  // 2. PRONOUNCEABILITY SCORE (0-100)
  const hasNumbers = /\d/.test(name);
  const hasHyphens = name.includes('-');
  const nameLettersOnly = name.replace(/[^a-z]/g, '');
  
  // Check consonant/vowel ratio
  let vowelCount = 0;
  let consonantCount = 0;
  for (const ch of nameLettersOnly) {
    if (VOWELS.has(ch)) vowelCount++;
    else if (CONSONANTS.has(ch)) consonantCount++;
  }
  const ratio = nameLettersOnly.length > 0 ? vowelCount / nameLettersOnly.length : 0;
  
  // Check for consecutive consonants (hard to pronounce)
  let maxConsecutiveConsonants = 0;
  let currentConsecutive = 0;
  for (const ch of nameLettersOnly) {
    if (CONSONANTS.has(ch)) { currentConsecutive++; maxConsecutiveConsonants = Math.max(maxConsecutiveConsonants, currentConsecutive); }
    else { currentConsecutive = 0; }
  }
  
  let pronounceScore = 70;
  if (PRONOUNCEABLE_PATTERNS.test(nameLettersOnly)) pronounceScore += 20;
  if (ratio >= 0.3 && ratio <= 0.5) pronounceScore += 10;
  else if (ratio < 0.2 || ratio > 0.6) pronounceScore -= 20;
  if (maxConsecutiveConsonants >= 4) pronounceScore -= 30;
  else if (maxConsecutiveConsonants >= 3) pronounceScore -= 15;
  if (hasNumbers) pronounceScore -= 20;
  if (hasHyphens) pronounceScore -= 15;
  scores.pronounceability = Math.max(0, Math.min(100, pronounceScore));
  
  if (scores.pronounceability >= 80) feedback.push({ category: 'Pronounceability', rating: 'Excellent', detail: 'Easy to say and spell over the phone', color: '#4ade80' });
  else if (scores.pronounceability >= 60) feedback.push({ category: 'Pronounceability', rating: 'Good', detail: 'Reasonably easy to pronounce', color: '#a3e635' });
  else if (scores.pronounceability >= 40) feedback.push({ category: 'Pronounceability', rating: 'Fair', detail: 'Somewhat difficult to pronounce naturally', color: '#fbbf24' });
  else feedback.push({ category: 'Pronounceability', rating: 'Poor', detail: 'Hard to pronounce — may cause confusion', color: '#ef4444' });
  
  // 3. BRANDABILITY SCORE (0-100)
  let brandScore = 60;
  // Unique/made-up words score higher for branding
  if (nameLettersOnly.length >= 3 && nameLettersOnly.length <= 8) brandScore += 15;
  if (!hasNumbers && !hasHyphens) brandScore += 10;
  if (scores.pronounceability >= 70) brandScore += 10;
  // Single word bonus
  if (!name.includes('-') && !name.includes('.')) brandScore += 5;
  // Repeating characters penalty
  if (/(.)\1{2,}/.test(name)) brandScore -= 15;
  scores.brandability = Math.max(0, Math.min(100, brandScore));
  
  if (scores.brandability >= 80) feedback.push({ category: 'Brandability', rating: 'Excellent', detail: 'Strong potential as a brand name', color: '#4ade80' });
  else if (scores.brandability >= 60) feedback.push({ category: 'Brandability', rating: 'Good', detail: 'Solid branding potential', color: '#a3e635' });
  else if (scores.brandability >= 40) feedback.push({ category: 'Brandability', rating: 'Fair', detail: 'Moderate branding potential', color: '#fbbf24' });
  else feedback.push({ category: 'Brandability', rating: 'Poor', detail: 'Weak branding potential — hard to build a brand around', color: '#ef4444' });
  
  // 4. MEMORABILITY SCORE (0-100)
  let memScore = 60;
  if (len <= 6) memScore += 20;
  else if (len <= 10) memScore += 10;
  else if (len > 14) memScore -= 20;
  if (scores.pronounceability >= 70) memScore += 10;
  if (!hasNumbers) memScore += 5;
  if (!hasHyphens) memScore += 5;
  // Common words are more memorable
  scores.memorability = Math.max(0, Math.min(100, memScore));
  
  if (scores.memorability >= 80) feedback.push({ category: 'Memorability', rating: 'Excellent', detail: 'Very easy to remember — sticks in people\'s minds', color: '#4ade80' });
  else if (scores.memorability >= 60) feedback.push({ category: 'Memorability', rating: 'Good', detail: 'Fairly easy to remember', color: '#a3e635' });
  else if (scores.memorability >= 40) feedback.push({ category: 'Memorability', rating: 'Fair', detail: 'Somewhat forgettable — may need repeat exposure', color: '#fbbf24' });
  else feedback.push({ category: 'Memorability', rating: 'Poor', detail: 'Difficult to remember', color: '#ef4444' });
  
  // 5. TLD SCORE (0-100)
  const tldLower = tld.toLowerCase();
  let tldScore = 50;
  if (tldLower === 'com') tldScore = 100;
  else if (['ai', 'io'].includes(tldLower)) tldScore = 85;
  else if (['co', 'net', 'org'].includes(tldLower)) tldScore = 75;
  else if (['dev', 'app', 'me'].includes(tldLower)) tldScore = 70;
  else if (['xyz', 'tech', 'store', 'online'].includes(tldLower)) tldScore = 55;
  else if (tldLower.length === 2) tldScore = 60; // ccTLDs
  scores.tld = tldScore;
  
  if (scores.tld >= 90) feedback.push({ category: 'TLD', rating: 'Excellent', detail: `.${tld} is the gold standard for credibility`, color: '#4ade80' });
  else if (scores.tld >= 75) feedback.push({ category: 'TLD', rating: 'Great', detail: `.${tld} is a strong, trusted extension`, color: '#4ade80' });
  else if (scores.tld >= 60) feedback.push({ category: 'TLD', rating: 'Good', detail: `.${tld} is a recognized extension`, color: '#a3e635' });
  else if (scores.tld >= 40) feedback.push({ category: 'TLD', rating: 'Fair', detail: `.${tld} is less conventional — may reduce trust`, color: '#fbbf24' });
  else feedback.push({ category: 'TLD', rating: 'Poor', detail: `.${tld} is an uncommon extension — may confuse users`, color: '#ef4444' });
  
  // 6. TYPABILITY SCORE (0-100)
  let typeScore = 80;
  if (hasHyphens) typeScore -= 20;
  if (hasNumbers) typeScore -= 15;
  // Check for difficult key combinations
  const difficultKeys = /[qzx]/g;
  const diffCount = (nameLettersOnly.match(difficultKeys) || []).length;
  typeScore -= diffCount * 5;
  if (len > 12) typeScore -= 15;
  else if (len > 8) typeScore -= 5;
  // Double letters are harder to type
  if (/(.)\1/.test(name)) typeScore -= 5;
  scores.typability = Math.max(0, Math.min(100, typeScore));
  
  if (scores.typability >= 80) feedback.push({ category: 'Typability', rating: 'Excellent', detail: 'Easy to type without errors', color: '#4ade80' });
  else if (scores.typability >= 60) feedback.push({ category: 'Typability', rating: 'Good', detail: 'Reasonably easy to type', color: '#a3e635' });
  else if (scores.typability >= 40) feedback.push({ category: 'Typability', rating: 'Fair', detail: 'Some typing challenges (hyphens, numbers, or length)', color: '#fbbf24' });
  else feedback.push({ category: 'Typability', rating: 'Poor', detail: 'Difficult to type accurately', color: '#ef4444' });
  
  // OVERALL SCORE (weighted average)
  const weights = { length: 0.20, pronounceability: 0.18, brandability: 0.22, memorability: 0.18, tld: 0.12, typability: 0.10 };
  const overall = Math.round(
    Object.entries(weights).reduce((sum, [key, weight]) => sum + (scores[key] || 0) * weight, 0)
  );
  
  let grade, gradeColor;
  if (overall >= 90) { grade = 'A+'; gradeColor = '#4ade80'; }
  else if (overall >= 80) { grade = 'A'; gradeColor = '#4ade80'; }
  else if (overall >= 70) { grade = 'B'; gradeColor = '#a3e635'; }
  else if (overall >= 60) { grade = 'C'; gradeColor = '#fbbf24'; }
  else if (overall >= 50) { grade = 'D'; gradeColor = '#f97316'; }
  else { grade = 'F'; gradeColor = '#ef4444'; }
  
  return { name, tld, full, scores, overall, grade, gradeColor, feedback, stats: { length: len, vowels: vowelCount, consonants: consonantCount, hasNumbers, hasHyphens } };
}

function ScoreBar({ value, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '0.8rem', color: '#888', minWidth: '110px', textAlign: 'right' }}>{label}</span>
      <div style={{ flex: 1, height: '8px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          width: `${value}%`, height: '100%', borderRadius: '4px',
          background: value >= 80 ? '#4ade80' : value >= 60 ? '#a3e635' : value >= 40 ? '#fbbf24' : '#ef4444',
          transition: 'width 0.5s ease',
        }} />
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', minWidth: '35px', fontFamily: 'ui-monospace, monospace' }}>{value}</span>
    </div>
  );
}

export default function DomainNameScorer() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const scoreDomain = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    
    let input = domain.trim();
    if (!input) return;
    
    // Add .com if no TLD specified
    if (!input.includes('.')) input += '.com';
    
    const analysis = analyzeDomain(input);
    if (!analysis) {
      setError('Please enter a valid domain name (e.g., example.com)');
      return;
    }
    setResult(analysis);
  };

  const inputStyle = {
    flex: 1, padding: '14px 16px', background: '#111', border: '1px solid #2a2a2a',
    borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none',
    transition: 'border-color 0.2s', minWidth: '200px',
  };
  const btnStyle = {
    padding: '14px 28px', background: '#8b5cf6', border: 'none', borderRadius: '10px',
    color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s',
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={scoreDomain} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="Enter a domain name (e.g., stripe.com)"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#8b5cf6'}
          onBlur={e => e.target.style.borderColor = '#2a2a2a'}
        />
        <button type="submit" style={btnStyle}
          onMouseEnter={e => e.target.style.background = '#7c3aed'}
          onMouseLeave={e => e.target.style.background = '#8b5cf6'}>
          Score Domain
        </button>
      </form>

      {error && (
        <div style={{ padding: '16px', background: '#1a0000', border: '1px solid #3a1515', borderRadius: '10px', color: '#ef4444', marginBottom: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Overall Score Card */}
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '8px' }}>Domain Score for</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', fontFamily: 'ui-monospace, monospace' }}>
              <span style={{ color: '#fff' }}>{result.name}</span>
              <span style={{ color: '#8b5cf6' }}>.{result.tld}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '16px' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                border: `4px solid ${result.gradeColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: result.gradeColor }}>{result.overall}</div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>/ 100</div>
              </div>
              <div style={{
                fontSize: '3rem', fontWeight: 800, color: result.gradeColor,
                textShadow: `0 0 20px ${result.gradeColor}33`,
              }}>
                {result.grade}
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              {result.stats.length} chars · {result.stats.vowels} vowels · {result.stats.consonants} consonants
              {result.stats.hasNumbers ? ' · contains numbers' : ''}
              {result.stats.hasHyphens ? ' · contains hyphens' : ''}
            </div>
          </div>

          {/* Score Breakdown */}
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>📊 Score Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <ScoreBar value={result.scores.brandability} label="Brandability" />
              <ScoreBar value={result.scores.length} label="Length" />
              <ScoreBar value={result.scores.pronounceability} label="Pronounceability" />
              <ScoreBar value={result.scores.memorability} label="Memorability" />
              <ScoreBar value={result.scores.tld} label="TLD Quality" />
              <ScoreBar value={result.scores.typability} label="Typability" />
            </div>
          </div>

          {/* Detailed Feedback */}
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>💡 Detailed Analysis</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.feedback.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#0a0a0a', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
                  <div style={{ minWidth: '110px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '2px' }}>{item.category}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: item.color }}>{item.rating}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.6, paddingTop: '2px' }}>{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
