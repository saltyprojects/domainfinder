'use client';

import { useState } from 'react';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];

const TYPE_INFO = {
  A: { icon: '🌐', label: 'A (IPv4)', desc: 'IPv4 addresses' },
  AAAA: { icon: '🔗', label: 'AAAA (IPv6)', desc: 'IPv6 addresses' },
  MX: { icon: '📧', label: 'MX (Mail)', desc: 'Mail servers' },
  NS: { icon: '🗂️', label: 'NS (Nameservers)', desc: 'DNS providers' },
  TXT: { icon: '📝', label: 'TXT (Text)', desc: 'SPF, DKIM, verification' },
  CNAME: { icon: '🔗', label: 'CNAME (Alias)', desc: 'Domain aliases' },
  SOA: { icon: '📋', label: 'SOA (Authority)', desc: 'Zone authority info' },
};

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

async function queryDns(domain, type) {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
    const data = await res.json();
    if (data.Answer) {
      return data.Answer.map(a => ({
        name: a.name,
        type: a.type,
        ttl: a.TTL,
        data: a.data,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

async function fetchAllRecords(domain) {
  const results = {};
  const promises = RECORD_TYPES.map(async (type) => {
    results[type] = await queryDns(domain, type);
  });
  await Promise.all(promises);
  return results;
}

function normalizeValue(val) {
  return (val || '').replace(/\.$/g, '').toLowerCase().trim();
}

function compareRecordSets(records1, records2) {
  const vals1 = new Set((records1 || []).map(r => normalizeValue(r.data)));
  const vals2 = new Set((records2 || []).map(r => normalizeValue(r.data)));

  const onlyIn1 = [...vals1].filter(v => !vals2.has(v));
  const onlyIn2 = [...vals2].filter(v => !vals1.has(v));
  const shared = [...vals1].filter(v => vals2.has(v));

  return { onlyIn1, onlyIn2, shared };
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '10px',
  border: '1px solid #2a2a2a',
  background: '#0a0a0a',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const btnStyle = {
  padding: '14px 32px',
  borderRadius: '10px',
  border: 'none',
  background: '#8b5cf6',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  width: '100%',
};

function Badge({ text, color }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '6px',
      background: color + '22',
      color: color,
      fontSize: '0.75rem',
      fontWeight: 600,
      marginLeft: '8px',
    }}>{text}</span>
  );
}

function RecordRow({ value, status }) {
  const color = status === 'match' ? '#22c55e' : status === 'only-left' ? '#f59e0b' : '#ef4444';
  const icon = status === 'match' ? '✓' : status === 'only-left' ? '←' : '→';

  return (
    <div style={{
      padding: '8px 12px',
      background: color + '08',
      borderLeft: `3px solid ${color}`,
      borderRadius: '0 6px 6px 0',
      marginBottom: '4px',
      fontSize: '0.85rem',
      fontFamily: 'monospace',
      color: '#ddd',
      wordBreak: 'break-all',
    }}>
      <span style={{ color, marginRight: '8px', fontWeight: 700 }}>{icon}</span>
      {value}
    </div>
  );
}

export default function DnsCompareTool() {
  const [domain1, setDomain1] = useState('');
  const [domain2, setDomain2] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(new Set(RECORD_TYPES));

  const toggleType = (type) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleCompare = async () => {
    const d1 = cleanDomain(domain1);
    const d2 = cleanDomain(domain2);

    if (!d1 || !d2) {
      setError('Please enter two domain names to compare.');
      return;
    }
    if (d1 === d2) {
      setError('Please enter two different domain names.');
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);

    try {
      const [records1, records2] = await Promise.all([
        fetchAllRecords(d1),
        fetchAllRecords(d2),
      ]);

      const comparison = {};
      let totalMatches = 0;
      let totalDiffs = 0;

      for (const type of RECORD_TYPES) {
        const c = compareRecordSets(records1[type], records2[type]);
        comparison[type] = c;
        totalMatches += c.shared.length;
        totalDiffs += c.onlyIn1.length + c.onlyIn2.length;
      }

      setResults({
        domain1: d1,
        domain2: d2,
        records1,
        records2,
        comparison,
        totalMatches,
        totalDiffs,
      });
    } catch (err) {
      setError('Failed to fetch DNS records. Please check the domain names and try again.');
    } finally {
      setLoading(false);
    }
  };

  const similarity = results
    ? results.totalMatches + results.totalDiffs > 0
      ? Math.round((results.totalMatches / (results.totalMatches + results.totalDiffs)) * 100)
      : 0
    : 0;

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Input form */}
      <div style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px', fontWeight: 600 }}>
              Domain A
            </label>
            <input
              type="text"
              placeholder="example.com"
              value={domain1}
              onChange={e => setDomain1(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCompare()}
              style={inputStyle}
            />
          </div>
          <div style={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 800, paddingTop: '24px' }}>vs</div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px', fontWeight: 600 }}>
              Domain B
            </label>
            <input
              type="text"
              placeholder="competitor.com"
              value={domain2}
              onChange={e => setDomain2(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCompare()}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Record type filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px', fontWeight: 600 }}>
            Record Types
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {RECORD_TYPES.map(type => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${selectedTypes.has(type) ? '#8b5cf6' : '#2a2a2a'}`,
                  background: selectedTypes.has(type) ? '#8b5cf622' : '#0a0a0a',
                  color: selectedTypes.has(type) ? '#8b5cf6' : '#666',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {TYPE_INFO[type].icon} {type}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading}
          style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Comparing DNS Records...' : 'Compare DNS Records'}
        </button>

        {error && (
          <p style={{ color: '#ef4444', marginTop: '12px', fontSize: '0.9rem' }}>{error}</p>
        )}
      </div>

      {/* Results */}
      {results && (
        <div>
          {/* Summary card */}
          <div style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            textAlign: 'center',
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e' }}>{results.totalMatches}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Matching Records</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{results.totalDiffs}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Differences</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: similarity > 60 ? '#22c55e' : similarity > 30 ? '#f59e0b' : '#ef4444' }}>
                {similarity}%
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Similarity</div>
            </div>
          </div>

          {/* Per-type comparison */}
          {RECORD_TYPES.filter(type => selectedTypes.has(type)).map(type => {
            const info = TYPE_INFO[type];
            const c = results.comparison[type];
            const r1 = results.records1[type] || [];
            const r2 = results.records2[type] || [];
            const hasRecords = r1.length > 0 || r2.length > 0;
            const identical = c.onlyIn1.length === 0 && c.onlyIn2.length === 0 && c.shared.length > 0;

            return (
              <div key={type} style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.3rem', marginRight: '10px' }}>{info.icon}</span>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>{info.label}</h3>
                  {!hasRecords && <Badge text="No records" color="#666" />}
                  {hasRecords && identical && <Badge text="Identical" color="#22c55e" />}
                  {hasRecords && !identical && c.onlyIn1.length + c.onlyIn2.length > 0 && (
                    <Badge text={`${c.onlyIn1.length + c.onlyIn2.length} difference${c.onlyIn1.length + c.onlyIn2.length > 1 ? 's' : ''}`} color="#f59e0b" />
                  )}
                </div>

                {!hasRecords ? (
                  <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>
                    Neither domain has {type} records.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Domain A column */}
                    <div>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#8b5cf6',
                        marginBottom: '8px',
                        padding: '6px 10px',
                        background: '#8b5cf612',
                        borderRadius: '6px',
                      }}>
                        {results.domain1}
                      </div>
                      {c.shared.map((v, i) => <RecordRow key={`s-${i}`} value={v} status="match" />)}
                      {c.onlyIn1.map((v, i) => <RecordRow key={`a-${i}`} value={v} status="only-left" />)}
                      {r1.length === 0 && (
                        <div style={{ color: '#555', fontSize: '0.85rem', padding: '8px 12px', fontStyle: 'italic' }}>
                          No {type} records
                        </div>
                      )}
                    </div>
                    {/* Domain B column */}
                    <div>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#8b5cf6',
                        marginBottom: '8px',
                        padding: '6px 10px',
                        background: '#8b5cf612',
                        borderRadius: '6px',
                      }}>
                        {results.domain2}
                      </div>
                      {c.shared.map((v, i) => <RecordRow key={`s-${i}`} value={v} status="match" />)}
                      {c.onlyIn2.map((v, i) => <RecordRow key={`b-${i}`} value={v} status="only-right" />)}
                      {r2.length === 0 && (
                        <div style={{ color: '#555', fontSize: '0.85rem', padding: '8px 12px', fontStyle: 'italic' }}>
                          No {type} records
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Legend */}
          <div style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            fontSize: '0.8rem',
            color: '#9ca3af',
          }}>
            <span><span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span> Record exists in both domains</span>
            <span><span style={{ color: '#f59e0b', fontWeight: 700 }}>←</span> Only in Domain A</span>
            <span><span style={{ color: '#ef4444', fontWeight: 700 }}>→</span> Only in Domain B</span>
          </div>
        </div>
      )}
    </div>
  );
}
