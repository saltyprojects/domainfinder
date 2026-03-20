'use client';

import { useState } from 'react';

// Comprehensive TLD data
const TLD_DATA = [
  // Generic TLDs
  { 
    tld: '.com', 
    category: 'Generic', 
    price: '$12-15/year', 
    popularity: 95, 
    trust: 98, 
    seo: 95, 
    best_for: 'Any business, global reach',
    restrictions: 'None',
    launched: 1985,
    notes: 'Most trusted and recognized TLD worldwide'
  },
  { 
    tld: '.net', 
    category: 'Generic', 
    price: '$12-15/year', 
    popularity: 70, 
    trust: 85, 
    seo: 90, 
    best_for: 'Network services, tech companies',
    restrictions: 'None',
    launched: 1985,
    notes: 'Good alternative when .com unavailable'
  },
  { 
    tld: '.org', 
    category: 'Generic', 
    price: '$12-15/year', 
    popularity: 75, 
    trust: 90, 
    seo: 90, 
    best_for: 'Non-profits, organizations',
    restrictions: 'None (originally for non-profits)',
    launched: 1985,
    notes: 'Associated with non-profits and causes'
  },
  { 
    tld: '.info', 
    category: 'Generic', 
    price: '$15-20/year', 
    popularity: 40, 
    trust: 60, 
    seo: 70, 
    best_for: 'Informational websites',
    restrictions: 'None',
    launched: 2001,
    notes: 'Often used for informational content'
  },
  
  // New Generic TLDs
  { 
    tld: '.io', 
    category: 'New Generic', 
    price: '$35-60/year', 
    popularity: 85, 
    trust: 80, 
    seo: 85, 
    best_for: 'Tech startups, SaaS, developers',
    restrictions: 'None',
    launched: 1997,
    notes: 'Popular among tech companies, stands for Input/Output'
  },
  { 
    tld: '.ai', 
    category: 'New Generic', 
    price: '$60-200/year', 
    popularity: 75, 
    trust: 75, 
    seo: 80, 
    best_for: 'AI companies, machine learning',
    restrictions: 'None',
    launched: 1995,
    notes: 'Perfect for AI and machine learning companies'
  },
  { 
    tld: '.app', 
    category: 'New Generic', 
    price: '$20-50/year', 
    popularity: 70, 
    trust: 75, 
    seo: 80, 
    best_for: 'Mobile apps, software',
    restrictions: 'HTTPS required',
    launched: 2018,
    notes: 'Google-owned, requires HTTPS, great for apps'
  },
  { 
    tld: '.dev', 
    category: 'New Generic', 
    price: '$20-50/year', 
    popularity: 80, 
    trust: 80, 
    seo: 85, 
    best_for: 'Developers, development projects',
    restrictions: 'HTTPS required',
    launched: 2019,
    notes: 'Google-owned, developer-focused, HTTPS required'
  },
  { 
    tld: '.co', 
    category: 'Country/Generic', 
    price: '$25-40/year', 
    popularity: 75, 
    trust: 80, 
    seo: 85, 
    best_for: 'Companies, shorter alternative to .com',
    restrictions: 'None',
    launched: 1991,
    notes: 'Colombia ccTLD used globally as .com alternative'
  },
  { 
    tld: '.tech', 
    category: 'New Generic', 
    price: '$30-60/year', 
    popularity: 60, 
    trust: 70, 
    seo: 75, 
    best_for: 'Technology companies',
    restrictions: 'None',
    launched: 2015,
    notes: 'Clear tech industry signaling'
  },
  { 
    tld: '.me', 
    category: 'Country/Generic', 
    price: '$20-35/year', 
    popularity: 55, 
    trust: 70, 
    seo: 75, 
    best_for: 'Personal brands, portfolios',
    restrictions: 'None',
    launched: 2008,
    notes: 'Montenegro ccTLD, perfect for personal branding'
  },
  { 
    tld: '.ly', 
    category: 'Country', 
    price: '$50-100/year', 
    popularity: 45, 
    trust: 65, 
    seo: 70, 
    best_for: 'Short domains, URL shorteners',
    restrictions: 'Libya regulations',
    launched: 1997,
    notes: 'Libya ccTLD, popular for short domains like bit.ly'
  },
  
  // Country Codes
  { 
    tld: '.us', 
    category: 'Country', 
    price: '$10-20/year', 
    popularity: 50, 
    trust: 85, 
    seo: 90, 
    best_for: 'US businesses, patriotic brands',
    restrictions: 'US presence required',
    launched: 1985,
    notes: 'United States official domain, boosts local SEO'
  },
  { 
    tld: '.uk', 
    category: 'Country', 
    price: '$15-25/year', 
    popularity: 80, 
    trust: 90, 
    seo: 90, 
    best_for: 'UK businesses',
    restrictions: 'Usually .co.uk or .org.uk',
    launched: 1985,
    notes: 'United Kingdom domain, high trust in UK'
  },
  { 
    tld: '.ca', 
    category: 'Country', 
    price: '$15-30/year', 
    popularity: 75, 
    trust: 85, 
    seo: 85, 
    best_for: 'Canadian businesses',
    restrictions: 'Canadian presence required',
    launched: 1987,
    notes: 'Canada domain, required for government contracts'
  },
  { 
    tld: '.de', 
    category: 'Country', 
    price: '$10-20/year', 
    popularity: 85, 
    trust: 90, 
    seo: 90, 
    best_for: 'German businesses',
    restrictions: 'Admin contact in Germany',
    launched: 1986,
    notes: 'Germany domain, very popular in Europe'
  },
  
  // Specialty/Business
  { 
    tld: '.store', 
    category: 'New Generic', 
    price: '$30-70/year', 
    popularity: 45, 
    trust: 65, 
    seo: 70, 
    best_for: 'E-commerce, retail',
    restrictions: 'None',
    launched: 2015,
    notes: 'Perfect for online stores and retail'
  },
  { 
    tld: '.shop', 
    category: 'New Generic', 
    price: '$25-50/year', 
    popularity: 50, 
    trust: 70, 
    seo: 75, 
    best_for: 'E-commerce, shopping sites',
    restrictions: 'None',
    launched: 2016,
    notes: 'Clear e-commerce signaling'
  },
  { 
    tld: '.blog', 
    category: 'New Generic', 
    price: '$20-40/year', 
    popularity: 60, 
    trust: 75, 
    seo: 80, 
    best_for: 'Blogs, content creators',
    restrictions: 'None',
    launched: 2016,
    notes: 'Perfect for blogs and content sites'
  },
  { 
    tld: '.news', 
    category: 'New Generic', 
    price: '$25-50/year', 
    popularity: 40, 
    trust: 70, 
    seo: 75, 
    best_for: 'News sites, journalism',
    restrictions: 'None',
    launched: 2014,
    notes: 'Great for news and media organizations'
  }
];

const CATEGORIES = ['All', 'Generic', 'New Generic', 'Country', 'Country/Generic'];

function ScoreBar({ score, color = '#8b5cf6' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
      <div style={{ 
        width: '60px', 
        height: '6px', 
        background: '#333', 
        borderRadius: '3px', 
        overflow: 'hidden' 
      }}>
        <div style={{ 
          width: `${score}%`, 
          height: '100%', 
          background: color,
          borderRadius: '3px'
        }} />
      </div>
      <span style={{ fontSize: '0.8rem', color: '#9ca3af', minWidth: '35px' }}>
        {score}/100
      </span>
    </div>
  );
}

function TldCard({ tld }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{
      background: '#111',
      border: '1px solid #1e1e1e',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6', margin: 0 }}>
            {tld.tld}
          </h3>
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#9ca3af', 
            background: '#2a2a2a', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            marginTop: '4px',
            display: 'inline-block'
          }}>
            {tld.category}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
            {tld.price}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            Since {tld.launched}
          </div>
        </div>
      </div>

      {/* Scores */}
      <div style={{ display: 'grid', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Popularity</span>
            <span>How widely used and recognized</span>
          </div>
          <ScoreBar score={tld.popularity} color={getScoreColor(tld.popularity)} />
        </div>
        
        <div>
          <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Trust</span>
            <span>User trust and credibility</span>
          </div>
          <ScoreBar score={tld.trust} color={getScoreColor(tld.trust)} />
        </div>
        
        <div>
          <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>SEO</span>
            <span>Search engine performance</span>
          </div>
          <ScoreBar score={tld.seo} color={getScoreColor(tld.seo)} />
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'grid', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>Best for:</div>
          <div style={{ fontSize: '0.9rem', color: '#22c55e' }}>{tld.best_for}</div>
        </div>
        
        <div>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>Restrictions:</div>
          <div style={{ fontSize: '0.9rem', color: tld.restrictions === 'None' ? '#22c55e' : '#f59e0b' }}>
            {tld.restrictions}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={{ 
        background: '#0a0a0a', 
        padding: '12px', 
        borderRadius: '8px', 
        border: '1px solid #2a2a2a' 
      }}>
        <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.5 }}>
          {tld.notes}
        </div>
      </div>
    </div>
  );
}

export default function TldComparison() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedTlds, setSelectedTlds] = useState(new Set(['.com', '.io', '.ai']));

  const filteredTlds = TLD_DATA
    .filter(tld => selectedCategory === 'All' || tld.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price') {
        // Simple price comparison based on first number in price string
        const priceA = parseInt(a.price.match(/\d+/)?.[0] || '0');
        const priceB = parseInt(b.price.match(/\d+/)?.[0] || '0');
        return priceA - priceB;
      }
      return b[sortBy] - a[sortBy];
    });

  const comparisonTlds = Array.from(selectedTlds)
    .map(tld => TLD_DATA.find(t => t.tld === tld))
    .filter(Boolean);

  return (
    <div style={{ marginBottom: '64px' }}>
      {/* Quick Comparison */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', color: '#8b5cf6' }}>
          Quick Comparison
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '20px' }}>
          Select TLDs to compare side by side:
        </p>
        
        {/* TLD Selection */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {TLD_DATA.slice(0, 12).map(tld => (
            <button
              key={tld.tld}
              onClick={() => {
                setSelectedTlds(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(tld.tld)) {
                    newSet.delete(tld.tld);
                  } else {
                    newSet.add(tld.tld);
                  }
                  return newSet;
                });
              }}
              style={{
                padding: '8px 16px',
                background: selectedTlds.has(tld.tld) ? '#8b5cf6' : '#2a2a2a',
                color: selectedTlds.has(tld.tld) ? '#fff' : '#9ca3af',
                border: 'none',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tld.tld}
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        {comparisonTlds.length > 0 && (
          <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              background: '#111', 
              borderRadius: '12px', 
              overflow: 'hidden',
              minWidth: '600px'
            }}>
              <thead>
                <tr style={{ background: '#0a0a0a' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>
                    TLD
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>
                    Price/Year
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>
                    Popularity
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>
                    Trust
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>
                    SEO
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonTlds.map((tld, index) => (
                  <tr key={tld.tld} style={{ borderTop: '1px solid #2a2a2a' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#8b5cf6' }}>
                          {tld.tld}
                        </span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          background: '#2a2a2a', 
                          color: '#9ca3af',
                          padding: '2px 6px',
                          borderRadius: '8px'
                        }}>
                          {tld.category}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', color: '#fff', fontSize: '0.9rem' }}>
                      {tld.price}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '4px', 
                          background: '#333', 
                          borderRadius: '2px', 
                          overflow: 'hidden' 
                        }}>
                          <div style={{ 
                            width: `${tld.popularity}%`, 
                            height: '100%', 
                            background: tld.popularity >= 80 ? '#22c55e' : tld.popularity >= 60 ? '#f59e0b' : '#ef4444'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                          {tld.popularity}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '4px', 
                          background: '#333', 
                          borderRadius: '2px', 
                          overflow: 'hidden' 
                        }}>
                          <div style={{ 
                            width: `${tld.trust}%`, 
                            height: '100%', 
                            background: tld.trust >= 80 ? '#22c55e' : tld.trust >= 60 ? '#f59e0b' : '#ef4444'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                          {tld.trust}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '4px', 
                          background: '#333', 
                          borderRadius: '2px', 
                          overflow: 'hidden' 
                        }}>
                          <div style={{ 
                            width: `${tld.seo}%`, 
                            height: '100%', 
                            background: tld.seo >= 80 ? '#22c55e' : tld.seo >= 60 ? '#f59e0b' : '#ef4444'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                          {tld.seo}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#9ca3af', fontSize: '0.85rem' }}>
                      {tld.best_for}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Filters and Controls */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <option value="popularity">Popularity</option>
            <option value="trust">Trust Level</option>
            <option value="seo">SEO Score</option>
            <option value="price">Price (Low to High)</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '0.9rem', color: '#666' }}>
          {filteredTlds.length} TLDs shown
        </div>
      </div>

      {/* TLD Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredTlds.map(tld => (
          <TldCard key={tld.tld} tld={tld} />
        ))}
      </div>

      {/* Legend */}
      <div style={{ 
        marginTop: '32px', 
        padding: '16px', 
        background: '#111', 
        borderRadius: '8px', 
        border: '1px solid #1e1e1e' 
      }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '12px' }}>
          Score Guide
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          <div>
            <strong style={{ color: '#22c55e' }}>Popularity (80-100):</strong>
            <span style={{ color: '#9ca3af' }}> Widely recognized and used</span>
          </div>
          <div>
            <strong style={{ color: '#f59e0b' }}>Trust (60-79):</strong>
            <span style={{ color: '#9ca3af' }}> Generally trusted by users</span>
          </div>
          <div>
            <strong style={{ color: '#ef4444' }}>SEO (&lt;60):</strong>
            <span style={{ color: '#9ca3af' }}> Lower user recognition</span>
          </div>
        </div>
      </div>
    </div>
  );
}