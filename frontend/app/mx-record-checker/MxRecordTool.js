'use client';

import { useState } from 'react';

const PROVIDER_MAP = {
  'google.com': { name: 'Google Workspace', color: '#4285f4' },
  'googlemail.com': { name: 'Google Workspace', color: '#4285f4' },
  'outlook.com': { name: 'Microsoft 365', color: '#0078d4' },
  'protection.outlook.com': { name: 'Microsoft 365', color: '#0078d4' },
  'pphosted.com': { name: 'Proofpoint', color: '#e4572e' },
  'mimecast.com': { name: 'Mimecast', color: '#1d1d1b' },
  'secureserver.net': { name: 'GoDaddy', color: '#00a63f' },
  'zoho.com': { name: 'Zoho Mail', color: '#c8202b' },
  'zoho.eu': { name: 'Zoho Mail (EU)', color: '#c8202b' },
  'yahoodns.net': { name: 'Yahoo Mail', color: '#6001d2' },
  'registrar-servers.com': { name: 'Namecheap', color: '#de3723' },
  'titan.email': { name: 'Titan Email', color: '#1a73e8' },
  'migadu.com': { name: 'Migadu', color: '#ff6b35' },
  'fastmail.com': { name: 'Fastmail', color: '#2f54eb' },
  'icloud.com': { name: 'iCloud Mail', color: '#333' },
  'messagelabs.com': { name: 'Symantec', color: '#ffc300' },
  'barracudanetworks.com': { name: 'Barracuda', color: '#005daa' },
  'amazonaws.com': { name: 'Amazon SES', color: '#ff9900' },
  'mailgun.org': { name: 'Mailgun', color: '#e03c31' },
  'sendgrid.net': { name: 'SendGrid', color: '#1a82e2' },
};

function detectProvider(exchange) {
  const host = exchange.toLowerCase();
  for (const [domain, info] of Object.entries(PROVIDER_MAP)) {
    if (host.endsWith(domain) || host.endsWith(domain + '.')) {
      return info;
    }
  }
  return null;
}

function getPriorityLabel(priority) {
  if (priority <= 5) return { label: 'Primary', color: '#22c55e' };
  if (priority <= 10) return { label: 'Primary', color: '#22c55e' };
  if (priority <= 20) return { label: 'Secondary', color: '#eab308' };
  if (priority <= 30) return { label: 'Backup', color: '#f97316' };
  return { label: 'Low Priority', color: '#ef4444' };
}

export default function MxRecordTool() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cleanDomain = (input) => {
    let d = input.trim().toLowerCase();
    d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    return d;
  };

  const lookupMx = async () => {
    const d = cleanDomain(domain);
    if (!d) {
      setError('Please enter a domain name');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(d)}&type=MX`);
      if (!response.ok) throw new Error('DNS query failed');
      const data = await response.json();

      if (data.Status !== 0) {
        throw new Error(data.Status === 3 ? `Domain "${d}" not found (NXDOMAIN)` : `DNS error (status: ${data.Status})`);
      }

      const mxRecords = (data.Answer || [])
        .filter(r => r.type === 15)
        .map(r => {
          const parts = r.data.split(' ');
          const priority = parseInt(parts[0], 10);
          const exchange = parts.slice(1).join(' ').replace(/\.$/, '');
          const provider = detectProvider(exchange);
          const priorityInfo = getPriorityLabel(priority);
          return { priority, exchange, provider, priorityInfo, ttl: r.TTL };
        })
        .sort((a, b) => a.priority - b.priority);

      // Also fetch TXT for SPF
      let spfRecord = null;
      try {
        const txtResp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(d)}&type=TXT`);
        const txtData = await txtResp.json();
        if (txtData.Answer) {
          const spf = txtData.Answer.find(r => r.data && r.data.toLowerCase().includes('v=spf1'));
          if (spf) spfRecord = spf.data.replace(/^"|"$/g, '');
        }
      } catch {}

      // Fetch DMARC
      let dmarcRecord = null;
      try {
        const dmarcResp = await fetch(`https://dns.google/resolve?name=_dmarc.${encodeURIComponent(d)}&type=TXT`);
        const dmarcData = await dmarcResp.json();
        if (dmarcData.Answer) {
          const dmarc = dmarcData.Answer.find(r => r.data && r.data.toLowerCase().includes('v=dmarc1'));
          if (dmarc) dmarcRecord = dmarc.data.replace(/^"|"$/g, '');
        }
      } catch {}

      setResults({ domain: d, mxRecords, spfRecord, dmarcRecord, timestamp: new Date().toISOString() });
    } catch (err) {
      setError(err.message || 'Failed to lookup MX records');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') lookupMx();
  };

  const copyResults = () => {
    if (!results) return;
    const text = results.mxRecords.map(r => `${r.priority} ${r.exchange}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter domain (e.g., google.com)"
          style={{
            flex: 1, minWidth: '240px', padding: '12px 16px', fontSize: '1rem',
            background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
            color: '#fff', outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#8b5cf6')}
          onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
        />
        <button
          onClick={lookupMx}
          disabled={loading}
          style={{
            padding: '12px 24px', fontSize: '1rem', fontWeight: 600,
            background: loading ? '#4c1d95' : '#8b5cf6', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer',
            transition: 'background 0.15s', whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Checking…' : 'Check MX Records'}
        </button>
      </div>

      {/* Quick examples */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>Try:</span>
        {['google.com', 'microsoft.com', 'apple.com', 'github.com'].map(d => (
          <button
            key={d}
            onClick={() => { setDomain(d); }}
            style={{
              background: '#111', border: '1px solid #2a2a2a', borderRadius: '6px',
              padding: '4px 10px', fontSize: '0.75rem', color: '#8b5cf6',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          padding: '12px 16px', marginBottom: '24px', background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
          color: '#f87171', fontSize: '0.9rem',
        }}>
          ⚠ {error}
        </div>
      )}

      {results && (
        <div>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px', flexWrap: 'wrap', gap: '8px',
          }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                MX Records for <span style={{ color: '#8b5cf6' }}>{results.domain}</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0' }}>
                {results.mxRecords.length} record{results.mxRecords.length !== 1 ? 's' : ''} found · {new Date(results.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={copyResults}
              style={{
                padding: '6px 12px', fontSize: '0.8rem', background: '#111',
                border: '1px solid #2a2a2a', borderRadius: '6px', color: '#ccc',
                cursor: 'pointer',
              }}
            >
              📋 Copy
            </button>
          </div>

          {/* MX Records Table */}
          {results.mxRecords.length === 0 ? (
            <div style={{
              padding: '24px', textAlign: 'center', background: '#111',
              borderRadius: '12px', border: '1px solid #2a2a2a', color: '#f97316',
            }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>⚠ No MX Records Found</p>
              <p style={{ fontSize: '0.85rem', color: '#999' }}>
                This domain has no MX records configured. Email sent to this domain will likely bounce.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '8px', marginBottom: '24px' }}>
              {results.mxRecords.map((record, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: '#111', borderRadius: '10px', padding: '14px 18px',
                  border: '1px solid #1e1e1e', flexWrap: 'wrap',
                }}>
                  {/* Priority Badge */}
                  <div style={{
                    minWidth: '52px', textAlign: 'center', background: '#000',
                    borderRadius: '6px', padding: '6px 8px', border: '1px solid #2a2a2a',
                  }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: record.priorityInfo.color }}>
                      {record.priority}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#666', textTransform: 'uppercase' }}>
                      priority
                    </div>
                  </div>

                  {/* Exchange */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#fff', fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' }}>
                      {record.exchange}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.7rem', padding: '2px 6px',
                        background: `${record.priorityInfo.color}20`,
                        color: record.priorityInfo.color,
                        borderRadius: '4px', fontWeight: 500,
                      }}>
                        {record.priorityInfo.label}
                      </span>
                      {record.provider && (
                        <span style={{
                          fontSize: '0.7rem', padding: '2px 6px',
                          background: `${record.provider.color}20`,
                          color: record.provider.color,
                          borderRadius: '4px', fontWeight: 500,
                        }}>
                          {record.provider.name}
                        </span>
                      )}
                      <span style={{ fontSize: '0.7rem', color: '#555' }}>
                        TTL: {record.ttl}s
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Email Security Summary */}
          <div style={{
            background: '#111', borderRadius: '12px', padding: '20px',
            border: '1px solid #1e1e1e', marginBottom: '24px',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>📧 Email Security Summary</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {/* MX */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>{results.mxRecords.length > 0 ? '✅' : '❌'}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>MX Records</div>
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>
                    {results.mxRecords.length > 0
                      ? `${results.mxRecords.length} mail server${results.mxRecords.length > 1 ? 's' : ''} configured`
                      : 'No mail servers configured — email will not work'}
                  </div>
                </div>
              </div>

              {/* SPF */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>{results.spfRecord ? '✅' : '⚠️'}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>SPF Record</div>
                  <div style={{ fontSize: '0.75rem', color: '#999', wordBreak: 'break-all' }}>
                    {results.spfRecord || 'No SPF record found — vulnerable to email spoofing'}
                  </div>
                </div>
              </div>

              {/* DMARC */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>{results.dmarcRecord ? '✅' : '⚠️'}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>DMARC Record</div>
                  <div style={{ fontSize: '0.75rem', color: '#999', wordBreak: 'break-all' }}>
                    {results.dmarcRecord || 'No DMARC record found — email authentication not enforced'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Detection */}
          {results.mxRecords.some(r => r.provider) && (
            <div style={{
              background: '#111', borderRadius: '12px', padding: '20px',
              border: '1px solid #1e1e1e',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>🏢 Detected Email Provider</h3>
              <p style={{ fontSize: '0.85rem', color: '#ccc', margin: 0 }}>
                This domain appears to use{' '}
                <strong style={{ color: results.mxRecords[0]?.provider?.color || '#8b5cf6' }}>
                  {results.mxRecords[0]?.provider?.name || 'a custom mail server'}
                </strong>{' '}
                for email delivery.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
