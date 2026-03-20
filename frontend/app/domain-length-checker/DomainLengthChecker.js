'use client';

import { useState } from 'react';

// Famous domain examples for comparison
const FAMOUS_DOMAINS = [
  { name: 'X.com', length: 1, category: 'Social Media' },
  { name: 'Go.com', length: 2, category: 'Search' },
  { name: 'Bit.ly', length: 4, category: 'URL Shortener' },
  { name: 'Apple.com', length: 5, category: 'Technology' },
  { name: 'Google.com', length: 6, category: 'Search' },
  { name: 'Amazon.com', length: 6, category: 'E-commerce' },
  { name: 'Netflix.com', length: 7, category: 'Streaming' },
  { name: 'Shopify.com', length: 7, category: 'E-commerce' },
  { name: 'LinkedIn.com', length: 8, category: 'Social Media' },
  { name: 'Facebook.com', length: 8, category: 'Social Media' },
  { name: 'Microsoft.com', length: 9, category: 'Technology' },
  { name: 'Instagram.com', length: 9, category: 'Social Media' },
  { name: 'Salesforce.com', length: 10, category: 'Software' },
  { name: 'Stackoverflow.com', length: 13, category: 'Developer' }
];

function analyzeDomain(domain) {
  const cleanDomain = domain.toLowerCase().trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
  
  const withoutTLD = cleanDomain.split('.')[0];
  const totalLength = cleanDomain.length;
  const nameLength = withoutTLD.length;
  
  // Character analysis
  const hasNumbers = /\d/.test(withoutTLD);
  const hasHyphens = /-/.test(withoutTLD);
  const vowelCount = (withoutTLD.match(/[aeiou]/g) || []).length;
  const consonantCount = nameLength - vowelCount;
  
  // Difficulty scoring
  let difficultyScore = 0;
  if (nameLength > 10) difficultyScore += 2;
  if (nameLength > 15) difficultyScore += 2;
  if (hasHyphens) difficultyScore += 2;
  if (hasNumbers) difficultyScore += 1;
  if (vowelCount / nameLength < 0.2) difficultyScore += 1; // Too consonant-heavy
  
  // Length rating
  let lengthRating = 'Too Long';
  let lengthColor = '#ef4444';
  let lengthAdvice = 'Consider a shorter alternative for better memorability.';
  
  if (nameLength <= 6) {
    lengthRating = 'Excellent';
    lengthColor = '#22c55e';
    lengthAdvice = 'Perfect length! Extremely memorable and mobile-friendly.';
  } else if (nameLength <= 10) {
    lengthRating = 'Very Good';
    lengthColor = '#22c55e';
    lengthAdvice = 'Great length with good balance of brevity and brandability.';
  } else if (nameLength <= 15) {
    lengthRating = 'Good';
    lengthColor = '#f59e0b';
    lengthAdvice = 'Acceptable length, but could benefit from being shorter.';
  } else if (nameLength <= 20) {
    lengthRating = 'Acceptable';
    lengthColor = '#f59e0b';
    lengthAdvice = 'Getting long. Consider shortening for better user experience.';
  }
  
  // Memorability score (1-100)
  let memorabilityScore = 100;
  if (nameLength > 6) memorabilityScore -= (nameLength - 6) * 5;
  if (hasHyphens) memorabilityScore -= 15;
  if (hasNumbers) memorabilityScore -= 10;
  if (difficultyScore > 3) memorabilityScore -= 20;
  memorabilityScore = Math.max(0, memorabilityScore);
  
  // Typeability score (1-100)
  let typeabilityScore = 100;
  if (nameLength > 8) typeabilityScore -= (nameLength - 8) * 4;
  if (hasHyphens) typeabilityScore -= 20;
  if (hasNumbers) typeabilityScore -= 5;
  if (consonantCount > nameLength * 0.7) typeabilityScore -= 10; // Hard to type
  typeabilityScore = Math.max(0, typeabilityScore);
  
  // Similar length famous domains
  const similarDomains = FAMOUS_DOMAINS.filter(d => 
    Math.abs(d.length - nameLength) <= 2
  ).slice(0, 3);
  
  return {
    original: domain,
    clean: cleanDomain,
    nameOnly: withoutTLD,
    totalLength,
    nameLength,
    hasNumbers,
    hasHyphens,
    vowelCount,
    consonantCount,
    lengthRating,
    lengthColor,
    lengthAdvice,
    memorabilityScore,
    typeabilityScore,
    difficultyScore,
    similarDomains
  };
}

export default function DomainLengthChecker() {
  const [domain, setDomain] = useState('');
  const [bulkDomains, setBulkDomains] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [bulkResults, setBulkResults] = useState([]);
  const [activeTab, setActiveTab] = useState('single');

  const analyzeSingle = (domainToAnalyze) => {
    if (!domainToAnalyze.trim()) return;
    setAnalysis(analyzeDomain(domainToAnalyze));
  };

  const analyzeBulk = () => {
    if (!bulkDomains.trim()) return;
    
    const domains = bulkDomains
      .split('\n')
      .map(d => d.trim())
      .filter(d => d && d.length > 0);
    
    const results = domains.map(d => analyzeDomain(d));
    setBulkResults(results);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'single') {
      analyzeSingle(domain);
    } else {
      analyzeBulk();
    }
  };

  return (
    <div style={{ marginBottom: '64px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid #1e1e1e' }}>
        <button
          onClick={() => setActiveTab('single')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'single' ? '#8b5cf6' : 'transparent',
            color: activeTab === 'single' ? '#fff' : '#9ca3af',
            border: 'none',
            borderBottom: activeTab === 'single' ? '2px solid #8b5cf6' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          Single Domain
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'bulk' ? '#8b5cf6' : 'transparent',
            color: activeTab === 'bulk' ? '#fff' : '#9ca3af',
            border: 'none',
            borderBottom: activeTab === 'bulk' ? '2px solid #8b5cf6' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          Bulk Analysis
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
        {activeTab === 'single' ? (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px', color: '#e5e5e5' }}>
                Domain Name
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com or mycompany"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #333',
                  background: '#111',
                  color: '#fff',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>
            <button
              type="submit"
              disabled={!domain.trim()}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                background: !domain.trim() ? '#444' : '#8b5cf6',
                color: '#fff',
                cursor: !domain.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              Analyze Length
            </button>
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px', color: '#e5e5e5' }}>
              Domain Names (one per line)
            </label>
            <textarea
              value={bulkDomains}
              onChange={(e) => setBulkDomains(e.target.value)}
              placeholder={`example.com\nmycompany.io\nanotherdomain.net\nstartup.ai`}
              rows={6}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical',
                marginBottom: '12px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
            <button
              type="submit"
              disabled={!bulkDomains.trim()}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                background: !bulkDomains.trim() ? '#444' : '#8b5cf6',
                color: '#fff',
                cursor: !bulkDomains.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Analyze All Domains
            </button>
          </div>
        )}
      </form>

      {/* Single Domain Analysis */}
      {activeTab === 'single' && analysis && (
        <div style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', color: '#8b5cf6' }}>
            Analysis: {analysis.clean}
          </h3>
          
          {/* Overview Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Total Length</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#fff' }}>{analysis.totalLength} characters</div>
            </div>
            
            <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Domain Name</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#fff' }}>{analysis.nameLength} characters</div>
            </div>
            
            <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Length Rating</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: analysis.lengthColor }}>
                {analysis.lengthRating}
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Memorability */}
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#22c55e', marginBottom: '12px' }}>
                📧 Memorability Score
              </h4>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e', marginBottom: '8px' }}>
                {analysis.memorabilityScore}/100
              </div>
              <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.5, margin: 0 }}>
                Based on length, character complexity, and cognitive load factors.
              </p>
            </div>

            {/* Typeability */}
            <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#3b82f6', marginBottom: '12px' }}>
                ⌨️ Typeability Score
              </h4>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6', marginBottom: '8px' }}>
                {analysis.typeabilityScore}/100
              </div>
              <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.5, margin: 0 }}>
                How easy it is to type on desktop and mobile keyboards.
              </p>
            </div>
          </div>

          {/* Character Breakdown */}
          <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b', marginBottom: '16px' }}>
              🔤 Character Analysis
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>Vowels: </span>
                <span style={{ color: '#fff', fontWeight: 500 }}>{analysis.vowelCount}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>Consonants: </span>
                <span style={{ color: '#fff', fontWeight: 500 }}>{analysis.consonantCount}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>Contains Numbers: </span>
                <span style={{ color: analysis.hasNumbers ? '#f59e0b' : '#22c55e', fontWeight: 500 }}>
                  {analysis.hasNumbers ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>Contains Hyphens: </span>
                <span style={{ color: analysis.hasHyphens ? '#ef4444' : '#22c55e', fontWeight: 500 }}>
                  {analysis.hasHyphens ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '8px' }}>
              💡 Recommendation
            </h4>
            <p style={{ color: '#e5e5e5', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              {analysis.lengthAdvice}
            </p>
          </div>

          {/* Similar Length Domains */}
          {analysis.similarDomains.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#666', marginBottom: '12px' }}>
                Famous domains with similar length:
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {analysis.similarDomains.map(domain => (
                  <span
                    key={domain.name}
                    style={{
                      padding: '4px 12px',
                      background: '#2a2a2a',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      color: '#ccc'
                    }}
                  >
                    {domain.name} ({domain.length})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bulk Results */}
      {activeTab === 'bulk' && bulkResults.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', color: '#8b5cf6' }}>
            Bulk Analysis Results ({bulkResults.length} domains)
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#0a0a0a' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>Domain</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>Length</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>Rating</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>Memorability</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>Typeability</th>
                </tr>
              </thead>
              <tbody>
                {bulkResults.map((result, index) => (
                  <tr key={index} style={{ borderTop: '1px solid #2a2a2a' }}>
                    <td style={{ padding: '12px', color: '#fff', fontSize: '0.9rem' }}>{result.clean}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>{result.nameLength}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: `${result.lengthColor}20`,
                        color: result.lengthColor,
                        border: `1px solid ${result.lengthColor}40`
                      }}>
                        {result.lengthRating}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>{result.memorabilityScore}/100</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>{result.typeabilityScore}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', marginTop: '32px' }}>
        💡 Tip: Domain length is just one factor in branding success. 
        <br />
        Consider memorability, brandability, and your target audience when choosing a domain.
      </div>
    </div>
  );
}