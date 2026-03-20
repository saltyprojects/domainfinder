'use client';

import { useState, useRef } from 'react';

// Use the existing API from the main search component
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function cleanDomain(domain) {
  return domain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

function downloadCSV(data, filename) {
  const headers = ['Domain', 'Status', 'Checked At'];
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.domain}"`,
      `"${row.status}"`,
      `"${row.checkedAt}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default function BulkDomainChecker() {
  const [domains, setDomains] = useState('');
  const [results, setResults] = useState([]);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [progress, setProgress] = useState({ checked: 0, total: 0 });
  const abortControllerRef = useRef(null);

  const checkBulkDomains = async () => {
    if (!domains.trim()) return;

    // Parse and clean domains
    const domainList = domains
      .split('\n')
      .map(d => cleanDomain(d))
      .filter(d => d && d.length > 0 && d.includes('.'))
      .filter((domain, index, self) => self.indexOf(domain) === index); // Remove duplicates

    if (domainList.length === 0) {
      setError('Please enter valid domains (one per line)');
      return;
    }

    if (domainList.length > 1000) {
      setError('Please limit to 1000 domains per batch for optimal performance');
      return;
    }

    setChecking(true);
    setError('');
    setResults([]);
    setProgress({ checked: 0, total: domainList.length });

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      // Check domains in batches of 10 to avoid overwhelming the API
      const batchSize = 10;
      const newResults = [];

      for (let i = 0; i < domainList.length; i += batchSize) {
        const batch = domainList.slice(i, i + batchSize);
        
        // Process batch in parallel
        const batchPromises = batch.map(async (domain) => {
          try {
            // Extract the domain name without TLD for the API
            const domainParts = domain.split('.');
            const domainName = domainParts[0];
            const tld = domainParts.slice(1).join('.');

            const response = await fetch(
              `${API_BASE}/api/search/?q=${encodeURIComponent(domainName)}&scope=all&limit=100&offset=0`,
              { signal: abortControllerRef.current.signal }
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const results = data.results || [];
            
            // Find the specific domain in results
            const domainResult = results.find(r => r.full_domain === domain);
            
            if (domainResult) {
              return {
                domain,
                status: domainResult.available ? 'Available' : 'Registered',
                available: domainResult.available,
                checkedAt: new Date().toLocaleString()
              };
            } else {
              // If not found in results, it might be available or we need to check differently
              // For now, mark as unknown
              return {
                domain,
                status: 'Unknown',
                available: null,
                checkedAt: new Date().toLocaleString()
              };
            }
          } catch (err) {
            if (abortControllerRef.current.signal.aborted) {
              return null;
            }
            return {
              domain,
              status: 'Error',
              available: null,
              checkedAt: new Date().toLocaleString(),
              error: err.message
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter(r => r !== null);
        
        newResults.push(...validResults);
        setResults([...newResults]);
        setProgress({ checked: newResults.length, total: domainList.length });

        // Small delay between batches to be respectful to the API
        if (i + batchSize < domainList.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        setError('Failed to check domains. Please try again with a smaller batch.');
      }
    } finally {
      setChecking(false);
      abortControllerRef.current = null;
    }
  };

  const cancelCheck = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setChecking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkBulkDomains();
  };

  const filteredResults = results.filter(result => {
    if (filter === 'all') return true;
    if (filter === 'available') return result.available === true;
    if (filter === 'taken') return result.available === false;
    if (filter === 'unknown') return result.available === null;
    return true;
  });

  const exportResults = () => {
    if (results.length === 0) return;
    
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadCSV(results, `domain-check-results-${timestamp}.csv`);
  };

  const stats = {
    total: results.length,
    available: results.filter(r => r.available === true).length,
    taken: results.filter(r => r.available === false).length,
    unknown: results.filter(r => r.available === null).length
  };

  return (
    <div style={{ marginBottom: '64px' }}>
      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px', color: '#e5e5e5' }}>
            Domain Names (one per line)
          </label>
          <textarea
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
            placeholder={`example.com\nmystartup.io\nanothersite.net\ncoolbrand.ai\n\nSupports formats:\n• Full domains: example.com\n• URLs: https://example.com\n• Names with www: www.example.com`}
            rows={12}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '0.95rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#111',
              color: '#fff',
              outline: 'none',
              transition: 'border-color 0.2s',
              resize: 'vertical',
              marginBottom: '12px',
              fontFamily: 'ui-monospace, monospace'
            }}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = '#333'}
          />
          
          {/* Input Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              {domains.trim() ? 
                `${domains.split('\n').filter(d => d.trim()).length} domains entered` : 
                'Enter domains above, one per line'
              }
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              Max: 1000 domains per batch
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={checking || !domains.trim()}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                background: checking || !domains.trim() ? '#444' : '#8b5cf6',
                color: '#fff',
                cursor: checking || !domains.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {checking ? 'Checking...' : 'Check All Domains'}
            </button>

            {checking && (
              <button
                type="button"
                onClick={cancelCheck}
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: '1px solid #ef4444',
                  background: 'transparent',
                  color: '#ef4444',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                Cancel
              </button>
            )}

            {results.length > 0 && (
              <button
                type="button"
                onClick={exportResults}
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: '1px solid #22c55e',
                  background: 'transparent',
                  color: '#22c55e',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(34, 197, 94, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                📥 Export CSV
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          padding: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#ef4444',
          marginBottom: '24px',
        }}>
          {error}
        </div>
      )}

      {/* Progress */}
      {checking && (
        <div style={{
          padding: '16px',
          background: '#111',
          border: '1px solid #8b5cf6',
          borderRadius: '8px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#8b5cf6', fontWeight: 600 }}>
              Checking Progress
            </span>
            <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              {progress.checked} / {progress.total}
            </span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: '#333', 
            borderRadius: '4px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              width: `${progress.total > 0 ? (progress.checked / progress.total) * 100 : 0}%`, 
              height: '100%', 
              background: '#8b5cf6',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          {/* Stats and Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.9rem', color: '#22c55e' }}>
                ✅ Available: {stats.available}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#ef4444' }}>
                ❌ Taken: {stats.taken}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#f59e0b' }}>
                ❓ Unknown: {stats.unknown}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                📊 Total: {stats.total}
              </div>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
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
              <option value="all">All Results ({stats.total})</option>
              <option value="available">Available Only ({stats.available})</option>
              <option value="taken">Taken Only ({stats.taken})</option>
              <option value="unknown">Unknown Only ({stats.unknown})</option>
            </select>
          </div>

          {/* Results Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              background: '#111', 
              borderRadius: '8px', 
              overflow: 'hidden',
              minWidth: '600px'
            }}>
              <thead>
                <tr style={{ background: '#0a0a0a' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>
                    Domain
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>
                    Checked At
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#e5e5e5', fontSize: '0.9rem', fontWeight: 600 }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, index) => (
                  <tr key={`${result.domain}-${index}`} style={{ borderTop: '1px solid #2a2a2a' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ 
                        color: '#fff', 
                        fontSize: '0.95rem',
                        fontFamily: 'ui-monospace, monospace'
                      }}>
                        {result.domain}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem', 
                        fontWeight: 600,
                        background: result.available === true 
                          ? 'rgba(34, 197, 94, 0.2)' 
                          : result.available === false 
                          ? 'rgba(239, 68, 68, 0.2)' 
                          : 'rgba(249, 158, 11, 0.2)',
                        color: result.available === true 
                          ? '#22c55e' 
                          : result.available === false 
                          ? '#ef4444' 
                          : '#f59e0b',
                        border: `1px solid ${result.available === true 
                          ? '#22c55e40' 
                          : result.available === false 
                          ? '#ef444440' 
                          : '#f59e0b40'}`
                      }}>
                        {result.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '0.85rem' }}>
                      {result.checkedAt}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {result.available === true ? (
                        <a
                          href={`https://www.namecheap.com/domains/registration/results/?domain=${result.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '6px 12px',
                            background: '#22c55e',
                            color: '#000',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          Register
                        </a>
                      ) : result.available === false ? (
                        <button
                          onClick={() => window.open(`https://who.is/whois/${result.domain}`, '_blank')}
                          style={{
                            padding: '6px 12px',
                            background: 'transparent',
                            color: '#8b5cf6',
                            border: '1px solid #8b5cf6',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          WHOIS
                        </button>
                      ) : (
                        <span style={{ color: '#666', fontSize: '0.8rem' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredResults.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '32px', 
              color: '#666',
              background: '#111',
              borderRadius: '8px',
              border: '1px solid #1e1e1e'
            }}>
              No domains match the current filter.
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', marginTop: '32px' }}>
        💡 Tip: Available domains can be registered quickly - they won't stay available forever!
        <br />
        For critical domains, double-check availability before registering.
      </div>
    </div>
  );
}