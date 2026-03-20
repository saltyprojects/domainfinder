'use client';

import { useState } from 'react';

async function queryDNS(name, type) {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.Answer || [];
  } catch {
    return null;
  }
}

function parseDomain(input) {
  let d = input.trim().toLowerCase();
  // If user enters email, extract domain
  if (d.includes('@')) d = d.split('@').pop();
  // Strip protocol/path
  d = d.replace(/^https?:\/\//, '').split('/')[0];
  return d;
}

function ScoreBar({ score, max = 100 }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <div style={{ flex: 1, height: '10px', background: '#1e1e1e', borderRadius: '5px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '5px', transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontWeight: 700, color, fontSize: '1.1rem', minWidth: '50px' }}>{pct}/100</span>
    </div>
  );
}

function Badge({ ok, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
      background: ok ? '#22c55e20' : '#ef444420',
      color: ok ? '#22c55e' : '#ef4444',
      border: `1px solid ${ok ? '#22c55e' : '#ef4444'}40`,
    }}>
      {ok ? '✓' : '✗'} {label}
    </span>
  );
}

function RecordCard({ title, status, records, details }) {
  const statusColor = status === 'found' ? '#22c55e' : status === 'warning' ? '#f59e0b' : '#ef4444';
  const statusLabel = status === 'found' ? 'Configured' : status === 'warning' ? 'Partial' : 'Not Found';
  return (
    <div style={{ background: '#111', borderRadius: '12px', padding: '20px', border: `1px solid ${statusColor}30` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{title}</h3>
        <span style={{
          padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
          background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40`,
        }}>
          {statusLabel}
        </span>
      </div>
      {records && records.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          {records.map((r, i) => (
            <div key={i} style={{
              background: '#0a0a0a', padding: '8px 12px', borderRadius: '8px', marginBottom: '4px',
              fontFamily: 'monospace', fontSize: '0.8rem', color: '#ccc', wordBreak: 'break-all',
            }}>
              {r}
            </div>
          ))}
        </div>
      )}
      {details && <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{details}</p>}
    </div>
  );
}

export default function EmailDomainChecker() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleCheck(e) {
    e.preventDefault();
    const domain = parseDomain(input);
    if (!domain || !domain.includes('.')) {
      setError('Please enter a valid domain or email address.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const [mx, txt, dmarc] = await Promise.all([
        queryDNS(domain, 'MX'),
        queryDNS(domain, 'TXT'),
        queryDNS(`_dmarc.${domain}`, 'TXT'),
      ]);

      // Parse MX records
      const mxRecords = (mx || []).map(r => {
        const parts = r.data.trim().split(/\s+/);
        return { priority: parseInt(parts[0]) || 0, host: (parts[1] || r.data).replace(/\.$/, '') };
      }).sort((a, b) => a.priority - b.priority);

      // Parse SPF
      const spfRecords = (txt || []).filter(r => r.data && r.data.toLowerCase().includes('v=spf1'));
      const spfData = spfRecords.map(r => r.data.replace(/^"|"$/g, ''));

      // Parse DMARC
      const dmarcRecords = (dmarc || []).filter(r => r.data && r.data.toLowerCase().includes('v=dmarc1'));
      const dmarcData = dmarcRecords.map(r => r.data.replace(/^"|"$/g, ''));

      // Parse DMARC policy
      let dmarcPolicy = null;
      if (dmarcData.length > 0) {
        const pMatch = dmarcData[0].match(/p\s*=\s*(\w+)/i);
        if (pMatch) dmarcPolicy = pMatch[1].toLowerCase();
      }

      // Try DKIM (common selectors)
      const dkimSelectors = ['google', 'default', 'selector1', 'selector2', 'k1', 'mail', 'dkim'];
      let dkimFound = [];
      const dkimResults = await Promise.all(
        dkimSelectors.map(sel => queryDNS(`${sel}._domainkey.${domain}`, 'TXT'))
      );
      dkimResults.forEach((records, idx) => {
        if (records && records.length > 0 && records.some(r => r.data && r.data.toLowerCase().includes('v=dkim1'))) {
          dkimFound.push(dkimSelectors[idx]);
        }
      });

      // Score
      let score = 0;
      if (mxRecords.length > 0) score += 30;
      if (spfData.length > 0) score += 25;
      if (dmarcData.length > 0) {
        score += 15;
        if (dmarcPolicy === 'reject') score += 10;
        else if (dmarcPolicy === 'quarantine') score += 5;
      }
      if (dkimFound.length > 0) score += 20;

      // Detect provider
      let provider = 'Unknown';
      const mxHosts = mxRecords.map(r => r.host.toLowerCase()).join(' ');
      if (mxHosts.includes('google') || mxHosts.includes('gmail')) provider = 'Google Workspace';
      else if (mxHosts.includes('outlook') || mxHosts.includes('microsoft')) provider = 'Microsoft 365';
      else if (mxHosts.includes('zoho')) provider = 'Zoho Mail';
      else if (mxHosts.includes('protonmail') || mxHosts.includes('proton')) provider = 'Proton Mail';
      else if (mxHosts.includes('yahoodns') || mxHosts.includes('yahoo')) provider = 'Yahoo Mail';
      else if (mxHosts.includes('mimecast')) provider = 'Mimecast';
      else if (mxHosts.includes('barracuda')) provider = 'Barracuda';
      else if (mxHosts.includes('pphosted') || mxHosts.includes('proofpoint')) provider = 'Proofpoint';
      else if (mxRecords.length > 0) provider = mxRecords[0].host;

      setResult({ domain, mxRecords, spfData, dmarcData, dmarcPolicy, dkimFound, score, provider });
    } catch {
      setError('Failed to check domain. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={handleCheck} style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter domain or email (e.g. example.com or user@example.com)"
          style={{
            flex: 1, minWidth: '250px', padding: '14px 18px', borderRadius: '10px',
            background: '#111', border: '1px solid #333', color: '#fff', fontSize: '1rem',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#8b5cf6'}
          onBlur={e => e.target.style.borderColor = '#333'}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '1rem',
            background: loading ? '#6d28d9' : '#8b5cf6', color: '#fff', border: 'none',
            cursor: loading ? 'wait' : 'pointer', whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Checking...' : 'Check Email Config'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#ef444420', border: '1px solid #ef444440', borderRadius: '10px', padding: '14px', color: '#ef4444', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          {/* Summary header */}
          <div style={{ background: '#111', borderRadius: '16px', padding: '24px', border: '1px solid #1e1e1e', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 4px' }}>{result.domain}</h2>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>Email Provider: <strong style={{ color: '#8b5cf6' }}>{result.provider}</strong></p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Badge ok={result.mxRecords.length > 0} label="MX" />
                <Badge ok={result.spfData.length > 0} label="SPF" />
                <Badge ok={result.dmarcData.length > 0} label="DMARC" />
                <Badge ok={result.dkimFound.length > 0} label="DKIM" />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Email Security Score</span>
              </div>
              <ScoreBar score={result.score} />
            </div>
          </div>

          {/* Detail cards */}
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            <RecordCard
              title="📬 MX Records (Mail Servers)"
              status={result.mxRecords.length > 0 ? 'found' : 'error'}
              records={result.mxRecords.map(r => `Priority ${r.priority}: ${r.host}`)}
              details={result.mxRecords.length === 0
                ? 'No MX records found. This domain cannot receive email.'
                : `${result.mxRecords.length} mail server${result.mxRecords.length > 1 ? 's' : ''} configured.`}
            />

            <RecordCard
              title="🛡️ SPF Record (Sender Policy)"
              status={result.spfData.length > 0 ? 'found' : 'error'}
              records={result.spfData}
              details={result.spfData.length === 0
                ? 'No SPF record found. SPF helps prevent email spoofing by specifying authorized mail servers.'
                : 'SPF record configured. This helps receiving servers verify authorized senders for this domain.'}
            />

            <RecordCard
              title="🔒 DMARC Record (Authentication)"
              status={result.dmarcData.length > 0 ? (result.dmarcPolicy === 'reject' ? 'found' : 'warning') : 'error'}
              records={result.dmarcData}
              details={result.dmarcData.length === 0
                ? 'No DMARC record found. DMARC protects against email spoofing and phishing attacks.'
                : result.dmarcPolicy === 'reject'
                  ? `DMARC policy set to "reject" — strongest protection against email spoofing.`
                  : result.dmarcPolicy === 'quarantine'
                    ? `DMARC policy set to "quarantine" — suspicious emails are flagged. Consider upgrading to "reject".`
                    : `DMARC policy set to "${result.dmarcPolicy || 'none'}" — minimal enforcement. Consider upgrading to "quarantine" or "reject".`}
            />

            <RecordCard
              title="✍️ DKIM Records (Signatures)"
              status={result.dkimFound.length > 0 ? 'found' : 'error'}
              records={result.dkimFound.map(s => `Selector: ${s}._domainkey.${result.domain}`)}
              details={result.dkimFound.length === 0
                ? 'No DKIM records found for common selectors. DKIM signs outgoing email to prove authenticity. Note: custom selectors may exist.'
                : `DKIM signing configured with ${result.dkimFound.length} selector${result.dkimFound.length > 1 ? 's' : ''}.`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
