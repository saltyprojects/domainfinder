'use client';

import { useState } from 'react';

export default function DnsLookupTool() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState('');

  const recordTypes = [
    { type: 'A', name: 'A Records (IPv4)', description: 'IP addresses where the domain points' },
    { type: 'AAAA', name: 'AAAA Records (IPv6)', description: 'IPv6 addresses for the domain' },
    { type: 'MX', name: 'MX Records (Mail)', description: 'Mail servers handling email' },
    { type: 'NS', name: 'NS Records (Name Servers)', description: 'Authoritative name servers' },
    { type: 'TXT', name: 'TXT Records (Text)', description: 'Text records for verification and security' },
    { type: 'CNAME', name: 'CNAME Records (Aliases)', description: 'Canonical name aliases' },
    { type: 'SOA', name: 'SOA Record (Authority)', description: 'Start of Authority information' },
  ];

  const lookupDns = async (domainToCheck) => {
    setLoading(true);
    setError('');
    setResults({});

    try {
      // Clean the domain input
      const cleanDomain = domainToCheck.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
      
      const lookupPromises = recordTypes.map(async (record) => {
        try {
          // Use Google's public DNS API
          const response = await fetch(
            `https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=${record.type}`,
            {
              headers: {
                'Accept': 'application/json',
              },
            }
          );
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const data = await response.json();
          return {
            type: record.type,
            name: record.name,
            description: record.description,
            records: data.Answer || [],
            status: data.Status || 0,
          };
        } catch (err) {
          return {
            type: record.type,
            name: record.name,
            description: record.description,
            records: [],
            error: err.message,
            status: -1,
          };
        }
      });

      const allResults = await Promise.all(lookupPromises);
      const resultMap = {};
      
      allResults.forEach(result => {
        resultMap[result.type] = result;
      });
      
      setResults(resultMap);
      
    } catch (err) {
      setError('Failed to lookup DNS records. Please check the domain name and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (domain.trim()) {
      lookupDns(domain.trim());
    }
  };

  const formatDnsRecord = (record) => {
    const { type, data, TTL } = record;
    
    // Format different record types appropriately
    switch (type) {
      case 1: // A
        return { value: data, type: 'A', ttl: TTL };
      case 28: // AAAA
        return { value: data, type: 'AAAA', ttl: TTL };
      case 15: // MX
        return { value: data, type: 'MX', ttl: TTL };
      case 2: // NS
        return { value: data, type: 'NS', ttl: TTL };
      case 16: // TXT
        return { value: data, type: 'TXT', ttl: TTL };
      case 5: // CNAME
        return { value: data, type: 'CNAME', ttl: TTL };
      case 6: // SOA
        return { value: data, type: 'SOA', ttl: TTL };
      default:
        return { value: data, type: type.toString(), ttl: TTL };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return '#22c55e'; // Success
      case 2: return '#f59e0b'; // Server failure
      case 3: return '#ef4444'; // Name error (domain doesn't exist)
      default: return '#666';   // Other/unknown
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Success';
      case 2: return 'Server Error';
      case 3: return 'Domain Not Found';
      default: return 'Unknown Status';
    }
  };

  return (
    <div style={{ marginBottom: '64px' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px', color: '#e5e5e5' }}>
              Domain Name
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
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
            disabled={loading || !domain.trim()}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              background: loading || !domain.trim() ? '#444' : '#8b5cf6',
              color: '#fff',
              cursor: loading || !domain.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Looking up...' : 'Lookup DNS'}
          </button>
        </div>
      </form>

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

      {Object.keys(results).length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px', color: '#8b5cf6' }}>
            DNS Records for {domain}
          </h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {recordTypes.map(recordType => {
              const result = results[recordType.type];
              if (!result) return null;

              const hasRecords = result.records && result.records.length > 0;
              const statusColor = getStatusColor(result.status);

              return (
                <div key={recordType.type} style={{
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  borderRadius: '8px',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px', color: '#fff' }}>
                        {result.name}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>
                        {result.description}
                      </p>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      background: `${statusColor}20`,
                      color: statusColor,
                      border: `1px solid ${statusColor}40`,
                    }}>
                      {getStatusText(result.status)}
                    </div>
                  </div>

                  {hasRecords ? (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {result.records.map((record, index) => {
                        const formatted = formatDnsRecord(record);
                        return (
                          <div key={index} style={{
                            background: '#0a0a0a',
                            border: '1px solid #2a2a2a',
                            borderRadius: '6px',
                            padding: '12px',
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                              <div style={{ flex: 1, minWidth: '200px' }}>
                                <code style={{
                                  fontSize: '0.9rem',
                                  color: '#22c55e',
                                  background: 'rgba(34, 197, 94, 0.1)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  wordBreak: 'break-all',
                                }}>
                                  {formatted.value}
                                </code>
                              </div>
                              {formatted.ttl && (
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                  TTL: {formatted.ttl}s
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{
                      padding: '12px',
                      background: '#0a0a0a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '6px',
                      color: '#666',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                    }}>
                      {result.error ? `Error: ${result.error}` : 'No records found'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 500 }}>
              🌐 Powered by Google Public DNS | Real-time lookup
            </div>
          </div>
        </div>
      )}

      <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', lineHeight: 1.6 }}>
        💡 Tip: DNS changes can take 24-48 hours to propagate globally.
        <br />
        If records look wrong, try again later or check with your DNS provider.
      </div>
    </div>
  );
}