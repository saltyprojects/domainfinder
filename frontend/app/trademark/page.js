'use client';

import { useState } from 'react';
import { TrademarkChecker } from '../components/TrademarkChecker';

export default function TrademarkPage() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearched(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearched(false);
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: 'var(--max-width)', 
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
          ⚖️ Trademark Checker
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--text-muted)', 
          margin: '12px 0 0 0',
          maxWidth: '600px',
          margin: '12px auto 0 auto'
        }}>
          Check if your domain name conflicts with existing trademarks. 
          Protect your brand and avoid legal issues.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        maxWidth: '500px',
        margin: '0 auto 32px auto'
      }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter domain name or brand name..."
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
        <button
          type="submit"
          disabled={!query.trim()}
          style={{
            padding: '12px 24px',
            background: query.trim() ? 'var(--green)' : 'var(--border)',
            color: query.trim() ? '#000' : 'var(--text-dim)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: query.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s'
          }}
        >
          Check Trademarks
        </button>
      </form>

      {/* Clear button */}
      {searched && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear and search again
          </button>
        </div>
      )}

      {/* Results */}
      {searched && (
        <div>
          <h2 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 600, 
            marginBottom: '16px',
            color: 'var(--text)'
          }}>
            Trademark Analysis for "{query}"
          </h2>
          
          <TrademarkChecker domainName={query} inline={false} />
          
          {/* Educational Content */}
          <div style={{
            marginTop: '32px',
            padding: '24px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              marginBottom: '12px',
              color: 'var(--text)'
            }}>
              Understanding Trademark Risk
            </h3>
            
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#10B981' }}>✅ Low Risk:</strong> No obvious conflicts found. 
                Your domain name appears to be clear of major trademark issues.
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#F59E0B' }}>⚠️ Medium Risk:</strong> Found similar trademarks. 
                Review the details and consider consulting a trademark attorney.
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#EF4444' }}>🚫 High Risk:</strong> Found exact or very similar trademarks. 
                Strongly recommend consulting a trademark attorney before proceeding.
              </div>
              
              <div style={{ 
                marginTop: '16px',
                padding: '12px',
                background: 'var(--border)',
                borderRadius: '6px'
              }}>
                <strong>Important:</strong> This tool provides basic screening only. 
                It searches a limited database and cannot replace professional legal advice. 
                Always consult with a qualified trademark attorney for comprehensive clearance searches.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '48px',
        padding: '24px',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Want to check domain availability too?{' '}
          <a href="/" style={{ color: 'var(--green)', textDecoration: 'none' }}>
            Search domains →
          </a>
        </div>
      </div>
    </div>
  );
}