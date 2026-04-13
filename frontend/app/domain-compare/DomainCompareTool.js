'use client';

import { useState, useCallback } from 'react';

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

function formatDate(str) {
  if (!str) return '—';
  try {
    const d = new Date(str);
    if (isNaN(d)) return str;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return str; }
}

function daysBetween(d1, d2) {
  return Math.round(Math.abs(d2 - d1) / 86400000);
}

function domainAge(dateStr) {
  if (!dateStr) return '—';
  try {
    const created = new Date(dateStr);
    if (isNaN(created)) return '—';
    const now = new Date();
    const years = Math.floor(daysBetween(created, now) / 365);
    const months = Math.floor((daysBetween(created, now) % 365) / 30);
    if (years > 0) return `${years}y ${months}m`;
    return `${months}m`;
  } catch { return '—'; }
}

async function fetchDNS(domain, type) {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
    const data = await res.json();
    return data.Answer || [];
  } catch { return []; }
}

async function fetchRDAP(domain) {
  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function extractFromRDAP(rdap) {
  if (!rdap) return { registrar: '—', created: null, expires: null, updated: null, status: [], nameservers: [] };
  
  const registrar = rdap.entities?.find(e => e.roles?.includes('registrar'))?.vcardArray?.[1]
    ?.find(v => v[0] === 'fn')?.[3] || '—';
  
  const events = rdap.events || [];
  const created = events.find(e => e.eventAction === 'registration')?.eventDate || null;
  const expires = events.find(e => e.eventAction === 'expiration')?.eventDate || null;
  const updated = events.find(e => e.eventAction === 'last changed')?.eventDate || null;
  
  const status = rdap.status || [];
  const nameservers = (rdap.nameservers || []).map(ns => ns.ldhName?.toLowerCase()).filter(Boolean);
  
  return { registrar, created, expires, updated, status, nameservers };
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  fontSize: '1rem',
  borderRadius: '10px',
  border: '1px solid #333',
  backgroundColor: '#1a1a2e',
  color: '#fff',
  outline: 'none',
};

const buttonStyle = {
  padding: '12px 32px',
  fontSize: '1rem',
  fontWeight: 700,
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  color: '#fff',
  cursor: 'pointer',
  minWidth: '160px',
};

const cardStyle = {
  backgroundColor: '#111827',
  borderRadius: '12px',
  border: '1px solid #1f2937',
  padding: '24px',
  marginBottom: '16px',
};

const labelStyle = {
  fontSize: '0.8rem',
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '4px',
};

const valueStyle = {
  fontSize: '1rem',
  color: '#fff',
  fontWeight: 600,
};

export default function DomainCompareTool() {
  const [domain1, setDomain1] = useState('');
  const [domain2, setDomain2] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const compare = useCallback(async () => {
    const d1 = cleanDomain(domain1);
    const d2 = cleanDomain(domain2);
    if (!d1 || !d2) { setError('Please enter two domain names to compare.'); return; }
    if (d1 === d2) { setError('Please enter two different domain names.'); return; }
    
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const [rdap1, rdap2, a1, a2, mx1, mx2, ns1dns, ns2dns, txt1, txt2] = await Promise.all([
        fetchRDAP(d1),
        fetchRDAP(d2),
        fetchDNS(d1, 'A'),
        fetchDNS(d2, 'A'),
        fetchDNS(d1, 'MX'),
        fetchDNS(d2, 'MX'),
        fetchDNS(d1, 'NS'),
        fetchDNS(d2, 'NS'),
        fetchDNS(d1, 'TXT'),
        fetchDNS(d2, 'TXT'),
      ]);

      const info1 = extractFromRDAP(rdap1);
      const info2 = extractFromRDAP(rdap2);

      setResults({
        d1: {
          domain: d1,
          ...info1,
          aRecords: a1.map(r => r.data),
          mxRecords: mx1.map(r => r.data),
          nsRecords: ns1dns.map(r => r.data?.replace(/\.$/, '')),
          txtCount: txt1.length,
          hasSPF: txt1.some(r => r.data?.includes('v=spf1')),
          hasDMARC: false,
        },
        d2: {
          domain: d2,
          ...info2,
          aRecords: a2.map(r => r.data),
          mxRecords: mx2.map(r => r.data),
          nsRecords: ns2dns.map(r => r.data?.replace(/\.$/, '')),
          txtCount: txt2.length,
          hasSPF: txt2.some(r => r.data?.includes('v=spf1')),
          hasDMARC: false,
        },
      });

      // Check DMARC separately
      const [dmarc1, dmarc2] = await Promise.all([
        fetchDNS(`_dmarc.${d1}`, 'TXT'),
        fetchDNS(`_dmarc.${d2}`, 'TXT'),
      ]);
      
      setResults(prev => ({
        d1: { ...prev.d1, hasDMARC: dmarc1.length > 0 },
        d2: { ...prev.d2, hasDMARC: dmarc2.length > 0 },
      }));
    } catch (err) {
      setError('Failed to fetch domain data. Please check the domain names and try again.');
    } finally {
      setLoading(false);
    }
  }, [domain1, domain2]);

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !loading) compare(); };

  function CompareRow({ label, val1, val2, highlight }) {
    const match = val1 === val2 && val1 !== '—';
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', gap: '16px', padding: '12px 0', borderBottom: '1px solid #1f2937', alignItems: 'center' }}>
        <div style={labelStyle}>{label}</div>
        <div style={{ ...valueStyle, color: highlight ? '#8b5cf6' : '#fff' }}>{val1}</div>
        <div style={{ ...valueStyle, color: highlight ? '#8b5cf6' : '#fff' }}>
          {val2}
          {match && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#22c55e' }}>✓ match</span>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="First domain (e.g. google.com)"
          value={domain1}
          onChange={(e) => setDomain1(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Second domain (e.g. bing.com)"
          value={domain2}
          onChange={(e) => setDomain2(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />
      </div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <button onClick={compare} disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Comparing…' : 'Compare Domains'}
        </button>
      </div>

      {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

      {results && (
        <>
          <div style={cardStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', gap: '16px', padding: '0 0 12px', borderBottom: '2px solid #8b5cf6', marginBottom: '4px' }}>
              <div style={{ ...labelStyle, fontWeight: 700, color: '#8b5cf6' }}>Property</div>
              <div style={{ ...valueStyle, color: '#8b5cf6' }}>{results.d1.domain}</div>
              <div style={{ ...valueStyle, color: '#8b5cf6' }}>{results.d2.domain}</div>
            </div>

            <CompareRow label="Registrar" val1={results.d1.registrar} val2={results.d2.registrar} />
            <CompareRow label="Created" val1={formatDate(results.d1.created)} val2={formatDate(results.d2.created)} />
            <CompareRow label="Domain Age" val1={domainAge(results.d1.created)} val2={domainAge(results.d2.created)} />
            <CompareRow label="Expires" val1={formatDate(results.d1.expires)} val2={formatDate(results.d2.expires)} />
            <CompareRow label="Last Updated" val1={formatDate(results.d1.updated)} val2={formatDate(results.d2.updated)} />
            <CompareRow label="Status" 
              val1={results.d1.status.length > 0 ? results.d1.status.join(', ') : '—'} 
              val2={results.d2.status.length > 0 ? results.d2.status.join(', ') : '—'} 
            />
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#8b5cf6' }}>DNS Records</h3>
            <CompareRow label="A Records" 
              val1={results.d1.aRecords.length > 0 ? results.d1.aRecords.join(', ') : '—'} 
              val2={results.d2.aRecords.length > 0 ? results.d2.aRecords.join(', ') : '—'} 
            />
            <CompareRow label="Nameservers" 
              val1={results.d1.nsRecords.length > 0 ? results.d1.nsRecords.join(', ') : (results.d1.nameservers.length > 0 ? results.d1.nameservers.join(', ') : '—')} 
              val2={results.d2.nsRecords.length > 0 ? results.d2.nsRecords.join(', ') : (results.d2.nameservers.length > 0 ? results.d2.nameservers.join(', ') : '—')} 
            />
            <CompareRow label="MX Records" 
              val1={results.d1.mxRecords.length > 0 ? results.d1.mxRecords.join(', ') : 'None'} 
              val2={results.d2.mxRecords.length > 0 ? results.d2.mxRecords.join(', ') : 'None'} 
            />
            <CompareRow label="TXT Records" 
              val1={`${results.d1.txtCount} record${results.d1.txtCount !== 1 ? 's' : ''}`} 
              val2={`${results.d2.txtCount} record${results.d2.txtCount !== 1 ? 's' : ''}`} 
            />
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#8b5cf6' }}>Email Security</h3>
            <CompareRow label="SPF Record" 
              val1={results.d1.hasSPF ? '✅ Present' : '❌ Missing'} 
              val2={results.d2.hasSPF ? '✅ Present' : '❌ Missing'} 
            />
            <CompareRow label="DMARC Record" 
              val1={results.d1.hasDMARC ? '✅ Present' : '❌ Missing'} 
              val2={results.d2.hasDMARC ? '✅ Present' : '❌ Missing'} 
            />
            <CompareRow label="Mail Server" 
              val1={results.d1.mxRecords.length > 0 ? '✅ Configured' : '❌ None'} 
              val2={results.d2.mxRecords.length > 0 ? '✅ Configured' : '❌ None'} 
            />
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#8b5cf6' }}>Quick Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[results.d1, results.d2].map((r, i) => {
                const score = [
                  r.created ? 1 : 0,
                  r.hasSPF ? 1 : 0,
                  r.hasDMARC ? 1 : 0,
                  r.mxRecords.length > 0 ? 1 : 0,
                  r.nsRecords.length >= 2 || r.nameservers.length >= 2 ? 1 : 0,
                  r.aRecords.length > 0 ? 1 : 0,
                ].reduce((a, b) => a + b, 0);
                const grade = score >= 5 ? 'A' : score >= 4 ? 'B' : score >= 3 ? 'C' : 'D';
                const gradeColor = { A: '#22c55e', B: '#eab308', C: '#f97316', D: '#ef4444' }[grade];
                return (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '8px' }}>{r.domain}</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: gradeColor }}>{grade}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{score}/6 checks passed</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
