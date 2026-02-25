'use client';

import { useState } from 'react';
import { SEOAnalytics } from '../components/SEOAnalytics';

export default function SEOAnalysisPage() {
  const [domain, setDomain] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searched, setSearched] = useState(false);
  const [searchedDomain, setSearchedDomain] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (domain.trim()) {
      setSearchedDomain(domain.trim().toLowerCase());
      setSearched(true);
    }
  };

  const handleClear = () => {
    setDomain('');
    setKeyword('');
    setSearched(false);
    setSearchedDomain('');
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto',
      padding: '24px 16px' 
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          margin: 0,
          background: 'linear-gradient(135deg, var(--green), #10B981)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          📊 SEO Domain Analytics
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--text-muted)', 
          margin: '12px 0 0 0',
          maxWidth: '600px',
          margin: '12px auto 0 auto'
        }}>
          Get comprehensive SEO intelligence for any domain. Analyze domain authority, 
          backlinks, traffic estimates, and search trends.
        </p>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(168, 85, 247, 0.1)',
          borderRadius: '12px',
          fontSize: '0.8rem',
          color: 'var(--purple)',
          marginTop: '16px',
          fontWeight: 500
        }}>
          🚀 Premium Feature - Upgrade to Pro for real-time data
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '32px',
        maxWidth: '600px',
        margin: '0 auto 32px auto'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain name (e.g., example.com)"
            style={{
              flex: 2,
              padding: '12px 16px',
              fontSize: '1rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Target keyword (optional)"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '1rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="submit"
            disabled={!domain.trim()}
            style={{
              padding: '12px 32px',
              background: domain.trim() ? 'var(--green)' : 'var(--border)',
              color: domain.trim() ? '#000' : 'var(--text-dim)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: domain.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            📊 Analyze SEO
          </button>
          
          {searched && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                padding: '12px 24px',
                background: 'var(--surface)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {searched && searchedDomain && (
        <div>
          <SEOAnalytics 
            domain={searchedDomain} 
            keyword={keyword || searchedDomain.split('.')[0]} 
            compact={false} 
          />
        </div>
      )}

      {/* Example Domains */}
      {!searched && (
        <div style={{
          marginTop: '48px',
          padding: '24px',
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            marginBottom: '16px',
            color: 'var(--text)'
          }}>
            Try analyzing these example domains
          </h3>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {['example.com', 'github.com', 'stackoverflow.com'].map(exampleDomain => (
              <button
                key={exampleDomain}
                onClick={() => {
                  setDomain(exampleDomain);
                  setSearchedDomain(exampleDomain);
                  setSearched(true);
                }}
                style={{
                  padding: '8px 16px',
                  background: 'var(--background)',
                  color: 'var(--green)',
                  border: '1px solid var(--green)',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--green)';
                  e.target.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--background)';
                  e.target.style.color = 'var(--green)';
                }}
              >
                {exampleDomain}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Educational Content */}
      <div style={{
        marginTop: '48px',
        padding: '24px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ 
          fontSize: '1.1rem', 
          fontWeight: 600, 
          marginBottom: '16px',
          color: 'var(--text)'
        }}>
          Understanding SEO Metrics
        </h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          fontSize: '0.9rem', 
          color: 'var(--text-muted)', 
          lineHeight: 1.6 
        }}>
          <div>
            <strong style={{ color: 'var(--text)' }}>📊 SEO Score:</strong> Overall domain health 
            combining authority, backlinks, and traffic. Higher scores indicate stronger SEO potential.
          </div>
          
          <div>
            <strong style={{ color: 'var(--text)' }}>🎯 Domain Authority:</strong> Moz's 0-100 scale 
            predicting ranking ability. Higher DA domains tend to rank better in search results.
          </div>
          
          <div>
            <strong style={{ color: 'var(--text)' }}>🔗 Backlinks:</strong> Links from other websites. 
            More quality backlinks typically lead to higher search rankings.
          </div>
          
          <div>
            <strong style={{ color: 'var(--text)' }}>👥 Traffic:</strong> Estimated monthly visitors. 
            Indicates current popularity and potential audience reach.
          </div>
          
          <div>
            <strong style={{ color: 'var(--text)' }}>📈 Search Trends:</strong> Google search volume 
            over time. Shows if interest in the topic is growing or declining.
          </div>
          
          <div>
            <strong style={{ color: 'var(--text)' }}>💡 Recommendations:</strong> Actionable insights 
            to improve SEO performance based on current metrics and best practices.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '48px',
        padding: '24px',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
          Want to search domains too?{' '}
          <a href="/" style={{ color: 'var(--green)', textDecoration: 'none' }}>
            Domain search →
          </a>
        </div>
      </div>
    </div>
  );
}