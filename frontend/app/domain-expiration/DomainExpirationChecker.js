'use client';

import { useState } from 'react';

export default function DomainExpirationChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkDomainExpiration = async (domainToCheck) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Clean the domain input
      const cleanDomain = domainToCheck.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
      
      // Try RDAP first (more reliable and standardized)
      const rdapUrl = `https://rdap.verisign.com/domain/${cleanDomain}`;
      
      try {
        const rdapResponse = await fetch(rdapUrl);
        if (rdapResponse.ok) {
          const rdapData = await rdapResponse.json();
          const registrationDate = rdapData.events?.find(e => e.eventAction === 'registration')?.eventDate;
          const expirationDate = rdapData.events?.find(e => e.eventAction === 'expiration')?.eventDate;
          const lastChanged = rdapData.events?.find(e => e.eventAction === 'last changed')?.eventDate;
          
          if (expirationDate) {
            const expDate = new Date(expirationDate);
            const regDate = registrationDate ? new Date(registrationDate) : null;
            const now = new Date();
            const daysUntilExpiration = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const isExpired = daysUntilExpiration < 0;
            const daysSinceExpiration = isExpired ? Math.abs(daysUntilExpiration) : null;
            
            setResult({
              domain: cleanDomain,
              expirationDate: expDate.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }),
              registrationDate: regDate ? regDate.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }) : 'Not available',
              daysUntilExpiration: daysUntilExpiration,
              daysSinceExpiration: daysSinceExpiration,
              isExpired: isExpired,
              status: getExpirationStatus(daysUntilExpiration),
              registrar: rdapData.entities?.find(e => e.roles?.includes('registrar'))?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'Not available',
              nameServers: rdapData.nameservers?.map(ns => ns.ldhName).join(', ') || 'Not available',
              lastUpdated: lastChanged ? new Date(lastChanged).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }) : 'Not available',
              source: 'RDAP'
            });
            setLoading(false);
            return;
          }
        }
      } catch (rdapError) {
        console.log('RDAP failed, trying alternative approach');
      }

      // Fallback: Try a different RDAP server for other TLDs
      const tld = cleanDomain.split('.').pop();
      let rdapServer = 'https://rdap.verisign.com'; // Default for .com/.net
      
      if (['org'].includes(tld)) {
        rdapServer = 'https://rdap.publicinterestregistry.org';
      } else if (['io'].includes(tld)) {
        rdapServer = 'https://rdap.nic.io';
      } else if (['ai'].includes(tld)) {
        rdapServer = 'https://rdap.nic.ai';
      }
      
      try {
        const altRdapResponse = await fetch(`${rdapServer}/domain/${cleanDomain}`);
        if (altRdapResponse.ok) {
          const rdapData = await altRdapResponse.json();
          const registrationDate = rdapData.events?.find(e => e.eventAction === 'registration')?.eventDate;
          const expirationDate = rdapData.events?.find(e => e.eventAction === 'expiration')?.eventDate;
          
          if (expirationDate) {
            const expDate = new Date(expirationDate);
            const regDate = registrationDate ? new Date(registrationDate) : null;
            const now = new Date();
            const daysUntilExpiration = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const isExpired = daysUntilExpiration < 0;
            const daysSinceExpiration = isExpired ? Math.abs(daysUntilExpiration) : null;
            
            setResult({
              domain: cleanDomain,
              expirationDate: expDate.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }),
              registrationDate: regDate ? regDate.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }) : 'Not available',
              daysUntilExpiration: daysUntilExpiration,
              daysSinceExpiration: daysSinceExpiration,
              isExpired: isExpired,
              status: getExpirationStatus(daysUntilExpiration),
              registrar: rdapData.entities?.find(e => e.roles?.includes('registrar'))?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'Not available',
              nameServers: rdapData.nameservers?.map(ns => ns.ldhName).join(', ') || 'Not available',
              source: 'RDAP'
            });
            setLoading(false);
            return;
          }
        }
      } catch (altError) {
        console.log('Alternative RDAP failed');
      }

      // If all APIs fail, provide a helpful message
      setError(`Unable to retrieve expiration data for ${cleanDomain}. This domain may not exist, be recently registered, or the registry may not provide public WHOIS data. Try checking manually at who.is/${cleanDomain}`);
      
    } catch (err) {
      setError('Failed to check domain expiration. Please check the domain name and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getExpirationStatus = (daysUntilExpiration) => {
    if (daysUntilExpiration < 0) {
      const daysSince = Math.abs(daysUntilExpiration);
      if (daysSince <= 45) {
        return { text: 'Grace Period', color: '#f59e0b', description: 'Domain expired but can still be renewed at normal price' };
      } else if (daysSince <= 75) {
        return { text: 'Redemption Period', color: '#ef4444', description: 'Domain can be recovered for a high redemption fee' };
      } else if (daysSince <= 80) {
        return { text: 'Pending Delete', color: '#dc2626', description: 'Domain will be deleted soon and become available' };
      } else {
        return { text: 'Likely Available', color: '#22c55e', description: 'Domain may be available for registration' };
      }
    } else if (daysUntilExpiration <= 30) {
      return { text: 'Expiring Soon', color: '#ef4444', description: 'Domain expires in less than 30 days' };
    } else if (daysUntilExpiration <= 90) {
      return { text: 'Renewal Due', color: '#f59e0b', description: 'Domain should be renewed soon' };
    } else if (daysUntilExpiration <= 180) {
      return { text: 'Active', color: '#22c55e', description: 'Domain is active with moderate time until renewal' };
    } else {
      return { text: 'Active', color: '#22c55e', description: 'Domain is active with plenty of time until renewal' };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (domain.trim()) {
      checkDomainExpiration(domain.trim());
    }
  };

  const formatTimeUntilExpiration = (days) => {
    if (days < 0) return null;
    
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    if (days <= 30) return `${days} days`;
    if (days <= 365) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return `${months} month${months !== 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays} day${remainingDays !== 1 ? 's' : ''}` : ''}`;
    }
    
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    
    let result = `${years} year${years !== 1 ? 's' : ''}`;
    if (months > 0) result += `, ${months} month${months !== 1 ? 's' : ''}`;
    
    return result;
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
            {loading ? 'Checking...' : 'Check Expiration'}
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

      {result && (
        <div style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', color: '#8b5cf6' }}>
            {result.domain}
          </h3>
          
          {/* Status Alert */}
          <div style={{
            background: `${result.status.color}20`,
            border: `1px solid ${result.status.color}40`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: result.status.color }}>
                {result.status.text}
              </span>
              {result.isExpired && (
                <span style={{
                  fontSize: '0.8rem',
                  background: result.status.color,
                  color: '#000',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}>
                  EXPIRED
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.9rem', color: result.status.color, margin: 0 }}>
              {result.status.description}
            </p>
          </div>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Expiration Date</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: result.isExpired ? '#ef4444' : '#fff' }}>
                  {result.expirationDate}
                </div>
              </div>
              
              <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>
                  {result.isExpired ? 'Days Since Expiration' : 'Time Until Expiration'}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: result.isExpired ? '#ef4444' : '#22c55e' }}>
                  {result.isExpired 
                    ? `${result.daysSinceExpiration} days ago`
                    : formatTimeUntilExpiration(result.daysUntilExpiration)
                  }
                </div>
              </div>
              
              {result.registrationDate !== 'Not available' && (
                <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Registration Date</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>{result.registrationDate}</div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Registrar</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#ccc', wordBreak: 'break-word' }}>
                  {result.registrar}
                </div>
              </div>
              
              {result.lastUpdated && result.lastUpdated !== 'Not available' && (
                <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Last Updated</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#ccc' }}>
                    {result.lastUpdated}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Name Servers</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#ccc', wordBreak: 'break-all' }}>
                {result.nameServers}
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 500 }}>
              ✨ Data source: {result.source} | Real-time lookup
            </div>
          </div>

          {/* Expiration Recommendations */}
          {!result.isExpired && result.daysUntilExpiration <= 90 && (
            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              borderRadius: '8px' 
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ef4444', marginBottom: '8px' }}>
                ⚠️ Renewal Recommended
              </h4>
              <ul style={{ fontSize: '0.9rem', color: '#ef4444', margin: 0, paddingLeft: '20px' }}>
                <li>Enable auto-renewal to prevent accidental expiration</li>
                <li>Update contact information to ensure you receive renewal notices</li>
                <li>Consider renewing for multiple years to reduce management overhead</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
        💡 Pro tip: Set calendar reminders 60-90 days before expiration to avoid losing valuable domains.
        <br />
        Can't find expiration data? Try checking at{' '}
        <a href="https://who.is" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6', textDecoration: 'none' }}>
          who.is
        </a>
      </div>
    </div>
  );
}