'use client';

import { useState } from 'react';

// SSL Certificate status information that we can simulate
function generateSSLInfo(domain) {
  // This is a simulation since we can't actually check SSL from client-side
  // In a real implementation, this would come from a backend service
  
  const isSecure = domain.includes('google') || domain.includes('github') || domain.includes('microsoft');
  const hasIssues = domain.includes('expired') || domain.includes('invalid');
  
  if (hasIssues) {
    return {
      status: 'Error',
      valid: false,
      message: 'Certificate has issues or has expired',
      details: {
        issuer: 'Unknown',
        validFrom: null,
        validTo: null,
        algorithm: 'Unknown',
        keySize: null,
        fingerprint: null,
        certificateType: 'Unknown'
      }
    };
  }
  
  if (isSecure) {
    const now = new Date();
    const validFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const validTo = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days from now
    
    return {
      status: 'Valid',
      valid: true,
      message: 'Certificate is valid and trusted',
      details: {
        issuer: 'Let\'s Encrypt Authority X3',
        validFrom: validFrom.toISOString().split('T')[0],
        validTo: validTo.toISOString().split('T')[0],
        algorithm: 'SHA256withRSA',
        keySize: 2048,
        fingerprint: 'A1:B2:C3:D4:E5:F6:07:08:09:10:11:12:13:14:15:16:17:18:19:20',
        certificateType: 'Domain Validated (DV)',
        daysUntilExpiry: 60,
        protocol: 'TLS 1.3'
      }
    };
  }
  
  return {
    status: 'Unknown',
    valid: null,
    message: 'Unable to verify certificate status from browser',
    details: null
  };
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function getDaysUntilExpiry(validTo) {
  if (!validTo) return null;
  const now = new Date();
  const expiry = new Date(validTo);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function SSLChecker() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const checkSSL = async (domainToCheck) => {
    if (!domainToCheck.trim()) return;

    setChecking(true);
    setError('');
    setResult(null);

    try {
      // Clean the domain
      const cleanDomain = domainToCheck
        .toLowerCase()
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');

      // Simulate SSL check (in real app, this would be a backend API call)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const sslInfo = generateSSLInfo(cleanDomain);
      setResult({ domain: cleanDomain, ...sslInfo });
      
    } catch (err) {
      setError('Failed to check SSL certificate. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkSSL(domain);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Valid': return '#22c55e';
      case 'Error': return '#ef4444';
      case 'Warning': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getExpiryStatus = (days) => {
    if (days === null) return null;
    if (days < 0) return { status: 'Expired', color: '#ef4444' };
    if (days < 14) return { status: 'Critical', color: '#ef4444' };
    if (days < 30) return { status: 'Warning', color: '#f59e0b' };
    return { status: 'Good', color: '#22c55e' };
  };

  return (
    <div style={{ marginBottom: '64px' }}>
      {/* Input Form */}
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
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
              Enter domain without protocol (e.g., example.com not https://example.com)
            </div>
          </div>
          <button
            type="submit"
            disabled={checking || !domain.trim()}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              background: checking || !domain.trim() ? '#444' : '#8b5cf6',
              color: '#fff',
              cursor: checking || !domain.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {checking ? 'Checking...' : 'Check SSL'}
          </button>
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

      {/* Browser Limitation Notice */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#3b82f6', marginBottom: '8px' }}>
          🔒 Browser Security Note
        </h3>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
          Due to browser security policies, client-side SSL checking is limited. For comprehensive certificate analysis, 
          we recommend using external tools or checking manually. Below we show simulated results for demonstration.
        </p>
      </div>

      {/* Results */}
      {result && (
        <div style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#8b5cf6', margin: 0 }}>
              SSL Certificate: {result.domain}
            </h3>
            <span style={{
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: `${getStatusColor(result.status)}20`,
              color: getStatusColor(result.status),
              border: `1px solid ${getStatusColor(result.status)}40`,
            }}>
              {result.status}
            </span>
          </div>

          <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '24px' }}>
            {result.message}
          </p>

          {result.details && (
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Certificate Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Certificate Authority</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                    {result.details.issuer}
                  </div>
                </div>
                
                <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Certificate Type</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                    {result.details.certificateType}
                  </div>
                </div>

                <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Encryption</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                    {result.details.keySize}-bit {result.details.algorithm?.split('with')[1] || 'RSA'}
                  </div>
                </div>

                <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Protocol</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                    {result.details.protocol}
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b', marginBottom: '16px' }}>
                  📅 Validity Period
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Valid From</div>
                    <div style={{ fontSize: '0.95rem', color: '#22c55e' }}>
                      {formatDate(result.details.validFrom)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Valid Until</div>
                    <div style={{ fontSize: '0.95rem', color: '#ccc' }}>
                      {formatDate(result.details.validTo)}
                    </div>
                  </div>
                  {result.details.daysUntilExpiry && (
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Days Until Expiry</div>
                      <div style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 600,
                        color: getExpiryStatus(result.details.daysUntilExpiry)?.color || '#ccc'
                      }}>
                        {result.details.daysUntilExpiry} days
                        {getExpiryStatus(result.details.daysUntilExpiry) && (
                          <span style={{ 
                            fontSize: '0.7rem', 
                            marginLeft: '8px',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            background: `${getExpiryStatus(result.details.daysUntilExpiry).color}20`,
                            border: `1px solid ${getExpiryStatus(result.details.daysUntilExpiry).color}40`
                          }}>
                            {getExpiryStatus(result.details.daysUntilExpiry).status}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Details */}
              <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#3b82f6', marginBottom: '16px' }}>
                  🔐 Technical Details
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Signature Algorithm</div>
                    <div style={{ fontSize: '0.9rem', color: '#ccc', fontFamily: 'monospace' }}>
                      {result.details.algorithm}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Key Size</div>
                    <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                      {result.details.keySize} bits
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Fingerprint (SHA-1)</div>
                    <div style={{ fontSize: '0.8rem', color: '#ccc', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {result.details.fingerprint}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Check Instructions */}
      <div style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '16px' }}>
          🔍 Manual SSL Certificate Check
        </h3>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
          For comprehensive SSL analysis, use these methods:
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#22c55e', marginBottom: '12px' }}>
              🌐 Browser Method
            </h4>
            <ol style={{ paddingLeft: '20px', margin: 0, color: '#ccc', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '6px' }}>Visit the website in your browser</li>
              <li style={{ marginBottom: '6px' }}>Click the lock icon in the address bar</li>
              <li style={{ marginBottom: '6px' }}>Select "Certificate" or "Connection is secure"</li>
              <li style={{ marginBottom: '6px' }}>View certificate details and validity</li>
            </ol>
          </div>
          
          <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#3b82f6', marginBottom: '12px' }}>
              ⚡ Online Tools
            </h4>
            <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>SSL Labs:</strong> Comprehensive SSL/TLS analysis
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>DigiCert:</strong> SSL certificate checker
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Qualys:</strong> SSL server test and grading
              </div>
              <div>
                <strong>SSL Shopper:</strong> Certificate installation checker
              </div>
            </div>
          </div>
          
          <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b', marginBottom: '12px' }}>
              💻 Command Line
            </h4>
            <div style={{ color: '#ccc', fontSize: '0.85rem', fontFamily: 'monospace' }}>
              <div style={{ marginBottom: '8px', background: '#1a1a1a', padding: '8px', borderRadius: '4px' }}>
                openssl s_client -connect example.com:443
              </div>
              <div style={{ marginBottom: '8px', background: '#1a1a1a', padding: '8px', borderRadius: '4px' }}>
                curl -vI https://example.com
              </div>
              <div style={{ background: '#1a1a1a', padding: '8px', borderRadius: '4px' }}>
                nslookup -type=CAA example.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Tools */}
      <div style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '24px',
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '16px' }}>
          🛠️ Recommended SSL Testing Tools
        </h3>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              name: 'SSL Labs Server Test',
              url: 'https://www.ssllabs.com/ssltest/',
              description: 'Comprehensive SSL/TLS configuration analysis with detailed grading'
            },
            {
              name: 'DigiCert SSL Installation Checker',
              url: 'https://www.digicert.com/help/',
              description: 'Check SSL certificate installation and identify common issues'
            },
            {
              name: 'Qualys SSL Pulse',
              url: 'https://www.ssllabs.com/ssl-pulse/',
              description: 'Global SSL deployment statistics and trends'
            },
            {
              name: 'Security Headers',
              url: 'https://securityheaders.com/',
              description: 'Analyze HTTP security headers and HSTS configuration'
            }
          ].map(tool => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '16px',
                background: '#0a0a0a',
                borderRadius: '8px',
                border: '1px solid #2a2a2a',
                textDecoration: 'none',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
            >
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '4px' }}>
                {tool.name} ↗
              </div>
              <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                {tool.description}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', marginTop: '32px' }}>
        🔒 Regular SSL monitoring helps maintain website security and user trust.
        <br />
        Set up automated alerts for certificate expiration to prevent security issues.
      </div>
    </div>
  );
}