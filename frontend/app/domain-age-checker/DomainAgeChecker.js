'use client';

import { useState } from 'react';

export default function DomainAgeChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkDomainAge = async (domainToCheck) => {
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
          
          if (registrationDate) {
            const regDate = new Date(registrationDate);
            const expDate = expirationDate ? new Date(expirationDate) : null;
            const age = calculateAge(regDate);
            
            setResult({
              domain: cleanDomain,
              registrationDate: regDate.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }),
              expirationDate: expDate ? expDate.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }) : 'Not available',
              age: age,
              registrar: rdapData.entities?.find(e => e.roles?.includes('registrar'))?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'Not available',
              nameServers: rdapData.nameservers?.map(ns => ns.ldhName).join(', ') || 'Not available',
              status: rdapData.status?.join(', ') || 'Not available',
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
          
          if (registrationDate) {
            const regDate = new Date(registrationDate);
            const expDate = expirationDate ? new Date(expirationDate) : null;
            const age = calculateAge(regDate);
            
            setResult({
              domain: cleanDomain,
              registrationDate: regDate.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }),
              expirationDate: expDate ? expDate.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }) : 'Not available',
              age: age,
              registrar: rdapData.entities?.find(e => e.roles?.includes('registrar'))?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'Not available',
              nameServers: rdapData.nameservers?.map(ns => ns.ldhName).join(', ') || 'Not available',
              status: rdapData.status?.join(', ') || 'Not available',
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
      setError(`Unable to retrieve WHOIS data for ${cleanDomain}. This domain may not exist, be recently registered, or the registry may not provide public WHOIS data. Try checking manually at who.is/${cleanDomain}`);
      
    } catch (err) {
      setError('Failed to check domain age. Please check the domain name and try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (registrationDate) => {
    const now = new Date();
    const regDate = new Date(registrationDate);
    const diffMs = now.getTime() - regDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    const parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    
    return parts.length > 0 ? parts.join(', ') : 'Less than a day';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (domain.trim()) {
      checkDomainAge(domain.trim());
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
            {loading ? 'Checking...' : 'Check Age'}
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
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Domain Age</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#22c55e' }}>{result.age}</div>
              </div>
              
              <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Registration Date</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>{result.registrationDate}</div>
              </div>
              
              <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Expiration Date</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: result.expirationDate === 'Not available' ? '#888' : '#ff6b6b' }}>
                  {result.expirationDate}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Registrar</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#ccc', wordBreak: 'break-word' }}>
                  {result.registrar}
                </div>
              </div>
              
              <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Status</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#ccc', wordBreak: 'break-word' }}>
                  {result.status}
                </div>
              </div>
            </div>
            
            <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Name Servers</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#ccc', wordBreak: 'break-all' }}>
                {result.nameServers}
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
          
          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 500 }}>
              ✨ Data source: {result.source} | Real-time lookup
            </div>
          </div>
        </div>
      )}

      <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
        💡 Tip: Older domains often have more SEO authority and trust signals. 
        <br />
        Can't find data? Try checking at{' '}
        <a href="https://who.is" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6', textDecoration: 'none' }}>
          who.is
        </a>
      </div>
    </div>
  );
}