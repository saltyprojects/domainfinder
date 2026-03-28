'use client';

import { useState, useCallback } from 'react';

const POLICY_OPTIONS = [
  { value: 'none', label: 'None (Monitor Only)', desc: 'Receive reports but take no action on failing emails — ideal for initial setup', color: '#3b82f6' },
  { value: 'quarantine', label: 'Quarantine', desc: 'Send failing emails to the spam/junk folder — recommended after monitoring', color: '#eab308' },
  { value: 'reject', label: 'Reject', desc: 'Block failing emails entirely — strongest protection against spoofing', color: '#ef4444' },
];

const SUBDOMAIN_POLICY_OPTIONS = [
  { value: '', label: 'Same as domain policy', desc: 'Subdomains inherit the main domain policy' },
  { value: 'none', label: 'None', desc: 'Monitor only for subdomains' },
  { value: 'quarantine', label: 'Quarantine', desc: 'Quarantine failing subdomain emails' },
  { value: 'reject', label: 'Reject', desc: 'Reject failing subdomain emails' },
];

const ALIGNMENT_OPTIONS = [
  { value: 'r', label: 'Relaxed (default)', desc: 'Organizational domain match — example.com matches sub.example.com' },
  { value: 's', label: 'Strict', desc: 'Exact domain match required — sub.example.com will NOT match example.com' },
];

const REPORT_FORMAT_OPTIONS = [
  { value: 'afrf', label: 'AFRF (default)', desc: 'Authentication Failure Reporting Format — the standard format' },
  { value: 'iodef', label: 'IODEF', desc: 'Incident Object Description Exchange Format' },
];

const PERCENTAGE_PRESETS = [
  { value: 100, label: '100%', desc: 'Apply to all emails (recommended for production)' },
  { value: 50, label: '50%', desc: 'Apply to half of emails (gradual rollout)' },
  { value: 25, label: '25%', desc: 'Apply to quarter (cautious rollout)' },
  { value: 10, label: '10%', desc: 'Apply to 10% (initial testing)' },
  { value: 5, label: '5%', desc: 'Apply to 5% (very cautious start)' },
];

const REPORT_INTERVAL_OPTIONS = [
  { value: 86400, label: '24 hours (default)' },
  { value: 43200, label: '12 hours' },
  { value: 3600, label: '1 hour' },
];

export default function DmarcGeneratorTool() {
  const [policy, setPolicy] = useState('none');
  const [subdomainPolicy, setSubdomainPolicy] = useState('');
  const [percentage, setPercentage] = useState(100);
  const [ruaEmail, setRuaEmail] = useState('');
  const [rufEmail, setRufEmail] = useState('');
  const [adkim, setAdkim] = useState('r');
  const [aspf, setAspf] = useState('r');
  const [reportInterval, setReportInterval] = useState(86400);
  const [fo, setFo] = useState('0');
  const [copied, setCopied] = useState(false);
  const [lookupDomain, setLookupDomain] = useState('');
  const [currentDmarc, setCurrentDmarc] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const generateRecord = useCallback(() => {
    const parts = [`v=DMARC1; p=${policy}`];

    if (subdomainPolicy) parts.push(`sp=${subdomainPolicy}`);
    if (percentage < 100) parts.push(`pct=${percentage}`);

    if (ruaEmail.trim()) {
      const emails = ruaEmail.split(/[,\n]/).map(e => e.trim()).filter(Boolean)
        .map(e => e.startsWith('mailto:') ? e : `mailto:${e}`);
      parts.push(`rua=${emails.join(',')}`);
    }

    if (rufEmail.trim()) {
      const emails = rufEmail.split(/[,\n]/).map(e => e.trim()).filter(Boolean)
        .map(e => e.startsWith('mailto:') ? e : `mailto:${e}`);
      parts.push(`ruf=${emails.join(',')}`);
    }

    if (adkim === 's') parts.push('adkim=s');
    if (aspf === 's') parts.push('aspf=s');
    if (fo !== '0') parts.push(`fo=${fo}`);
    if (reportInterval !== 86400) parts.push(`ri=${reportInterval}`);

    return parts.join('; ');
  }, [policy, subdomainPolicy, percentage, ruaEmail, rufEmail, adkim, aspf, fo, reportInterval]);

  const dmarcRecord = generateRecord();

  const copyRecord = () => {
    navigator.clipboard.writeText(dmarcRecord);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lookupCurrentDmarc = async () => {
    let d = lookupDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    if (!d) { setLookupError('Please enter a domain'); return; }
    setLookupLoading(true);
    setLookupError('');
    setCurrentDmarc(null);
    try {
      const resp = await fetch(`https://dns.google/resolve?name=_dmarc.${encodeURIComponent(d)}&type=TXT`);
      const data = await resp.json();
      if (data.Status !== 0 && data.Status !== 3) throw new Error('DNS query failed');
      const dmarc = (data.Answer || []).find(r => r.data && r.data.toLowerCase().includes('v=dmarc1'));
      if (dmarc) {
        setCurrentDmarc(dmarc.data.replace(/^"|"$/g, ''));
      } else {
        setCurrentDmarc('NOT_FOUND');
      }
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLookupLoading(false);
    }
  };

  const analyzeDmarc = (record) => {
    if (!record || record === 'NOT_FOUND') return null;
    const tags = {};
    record.split(';').forEach(part => {
      const [key, ...vals] = part.trim().split('=');
      if (key) tags[key.trim().toLowerCase()] = vals.join('=').trim();
    });

    const p = tags.p || 'none';
    let policyLabel = 'None (Monitor)', policyColor = '#3b82f6';
    if (p === 'quarantine') { policyLabel = 'Quarantine'; policyColor = '#eab308'; }
    else if (p === 'reject') { policyLabel = 'Reject'; policyColor = '#ef4444'; }

    const sp = tags.sp || p;
    const pct = tags.pct || '100';
    const rua = tags.rua || '';
    const ruf = tags.ruf || '';
    const adkimVal = tags.adkim || 'r';
    const aspfVal = tags.aspf || 'r';

    const issues = [];
    if (p === 'none') issues.push('Policy is monitor-only — emails are not blocked or quarantined');
    if (!rua) issues.push('No aggregate report address (rua) — you won\'t receive DMARC reports');
    if (pct !== '100' && p !== 'none') issues.push(`Only ${pct}% of emails are subject to this policy`);

    const strengths = [];
    if (p === 'reject') strengths.push('Strongest enforcement — spoofed emails are rejected');
    if (p === 'quarantine') strengths.push('Failing emails go to spam folder');
    if (rua) strengths.push('Aggregate reports enabled');
    if (ruf) strengths.push('Forensic reports enabled');
    if (adkimVal === 's') strengths.push('Strict DKIM alignment');
    if (aspfVal === 's') strengths.push('Strict SPF alignment');

    return { p, policyLabel, policyColor, sp, pct, rua, ruf, adkim: adkimVal, aspf: aspfVal, issues, strengths };
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', fontSize: '0.9rem',
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
    color: '#fff', outline: 'none', fontFamily: 'ui-monospace, monospace',
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Current DMARC Lookup */}
      <div style={{
        background: '#111', borderRadius: '12px', padding: '20px',
        border: '1px solid #1e1e1e', marginBottom: '32px',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
          🔍 Check Your Current DMARC Record
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={lookupDomain}
            onChange={e => setLookupDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookupCurrentDmarc()}
            placeholder="Enter your domain (e.g., example.com)"
            style={{ ...inputStyle, flex: 1, minWidth: '220px' }}
            onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />
          <button
            onClick={lookupCurrentDmarc}
            disabled={lookupLoading}
            style={{
              padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600,
              background: lookupLoading ? '#4c1d95' : '#1e1e1e', color: '#fff',
              border: '1px solid #2a2a2a', borderRadius: '8px', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {lookupLoading ? 'Checking…' : 'Look Up'}
          </button>
        </div>

        {lookupError && (
          <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '10px' }}>⚠ {lookupError}</p>
        )}

        {currentDmarc && currentDmarc !== 'NOT_FOUND' && (() => {
          const analysis = analyzeDmarc(currentDmarc);
          return (
            <div style={{ marginTop: '16px' }}>
              <div style={{
                background: '#0a0a0a', padding: '12px 16px', borderRadius: '8px',
                fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', color: '#8b5cf6',
                wordBreak: 'break-all', marginBottom: '12px',
              }}>
                {currentDmarc}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px',
                  background: `${analysis.policyColor}20`, color: analysis.policyColor,
                }}>
                  Policy: {analysis.policyLabel}
                </span>
                <span style={{
                  fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px',
                  background: '#22c55e20', color: '#22c55e',
                }}>
                  {analysis.pct}% Coverage
                </span>
                <span style={{
                  fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px',
                  background: analysis.rua ? '#22c55e20' : '#ef444420',
                  color: analysis.rua ? '#22c55e' : '#ef4444',
                }}>
                  {analysis.rua ? '✓ Reports Enabled' : '✗ No Reports'}
                </span>
              </div>
              {analysis.issues.length > 0 && (
                <div style={{ marginBottom: '6px' }}>
                  {analysis.issues.map((issue, i) => (
                    <p key={i} style={{ fontSize: '0.8rem', color: '#f97316', margin: '4px 0' }}>⚠ {issue}</p>
                  ))}
                </div>
              )}
              {analysis.strengths.length > 0 && (
                <div>
                  {analysis.strengths.map((s, i) => (
                    <p key={i} style={{ fontSize: '0.8rem', color: '#22c55e', margin: '4px 0' }}>✓ {s}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {currentDmarc === 'NOT_FOUND' && (
          <div style={{
            marginTop: '12px', padding: '10px 14px', borderRadius: '8px',
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)',
            color: '#f97316', fontSize: '0.85rem',
          }}>
            ⚠ No DMARC record found — your domain has no DMARC policy. Use the generator below to create one!
          </div>
        )}
      </div>

      {/* Generator */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
        🛠️ Build Your DMARC Record
      </h3>

      {/* Policy */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px', color: '#ccc' }}>
          1. Choose your DMARC policy
        </h4>
        <div style={{ display: 'grid', gap: '8px' }}>
          {POLICY_OPTIONS.map(opt => {
            const active = policy === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setPolicy(opt.value)}
                style={{
                  padding: '12px 16px', textAlign: 'left', borderRadius: '8px',
                  background: active ? `${opt.color}15` : '#0a0a0a',
                  border: `1px solid ${active ? opt.color : '#1e1e1e'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    border: `2px solid ${active ? opt.color : '#444'}`,
                    background: active ? opt.color : 'transparent',
                    display: 'inline-block', flexShrink: 0,
                  }} />
                  <span style={{ fontWeight: 600, color: active ? opt.color : '#ccc', fontSize: '0.9rem' }}>
                    {opt.label}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#777', margin: '4px 0 0 24px' }}>{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aggregate Reports (rua) */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px', color: '#ccc' }}>
          2. Aggregate report email (rua) <span style={{ fontWeight: 400, color: '#22c55e' }}>— recommended</span>
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
          Receive daily XML reports showing who is sending email from your domain
        </p>
        <input
          type="text"
          value={ruaEmail}
          onChange={e => setRuaEmail(e.target.value)}
          placeholder="dmarc-reports@example.com"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
          onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>

      {/* Forensic Reports (ruf) */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px', color: '#ccc' }}>
          3. Forensic report email (ruf) <span style={{ fontWeight: 400, color: '#666' }}>— optional</span>
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
          Receive per-message failure reports (not all providers support this)
        </p>
        <input
          type="text"
          value={rufEmail}
          onChange={e => setRufEmail(e.target.value)}
          placeholder="dmarc-forensic@example.com"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
          onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>

      {/* Percentage */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px', color: '#ccc' }}>
          4. Percentage of emails to apply policy <span style={{ fontWeight: 400, color: '#666' }}>— for gradual rollout</span>
        </h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PERCENTAGE_PRESETS.map(p => {
            const active = percentage === p.value;
            return (
              <button
                key={p.value}
                onClick={() => setPercentage(p.value)}
                style={{
                  padding: '8px 16px', borderRadius: '8px',
                  background: active ? '#8b5cf615' : '#0a0a0a',
                  border: `1px solid ${active ? '#8b5cf6' : '#1e1e1e'}`,
                  color: active ? '#8b5cf6' : '#999', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: active ? 600 : 400,
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px' }}>
          {PERCENTAGE_PRESETS.find(p => p.value === percentage)?.desc}
        </p>
      </div>

      {/* Advanced Settings */}
      <details style={{ marginBottom: '24px' }}>
        <summary style={{
          fontSize: '0.95rem', fontWeight: 600, color: '#ccc', cursor: 'pointer',
          marginBottom: '16px', userSelect: 'none',
        }}>
          5. Advanced settings
        </summary>

        {/* Subdomain Policy */}
        <div style={{ marginBottom: '20px', paddingLeft: '16px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#999' }}>
            Subdomain policy (sp)
          </h4>
          <div style={{ display: 'grid', gap: '6px' }}>
            {SUBDOMAIN_POLICY_OPTIONS.map(opt => {
              const active = subdomainPolicy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSubdomainPolicy(opt.value)}
                  style={{
                    padding: '8px 12px', textAlign: 'left', borderRadius: '6px',
                    background: active ? '#8b5cf610' : '#0a0a0a',
                    border: `1px solid ${active ? '#8b5cf6' : '#1a1a1a'}`,
                    color: active ? '#8b5cf6' : '#888', cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  <strong>{opt.label}</strong> — {opt.desc}
                </button>
              );
            })}
          </div>
        </div>

        {/* DKIM Alignment */}
        <div style={{ marginBottom: '20px', paddingLeft: '16px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#999' }}>
            DKIM alignment (adkim)
          </h4>
          <div style={{ display: 'grid', gap: '6px' }}>
            {ALIGNMENT_OPTIONS.map(opt => {
              const active = adkim === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setAdkim(opt.value)}
                  style={{
                    padding: '8px 12px', textAlign: 'left', borderRadius: '6px',
                    background: active ? '#8b5cf610' : '#0a0a0a',
                    border: `1px solid ${active ? '#8b5cf6' : '#1a1a1a'}`,
                    color: active ? '#8b5cf6' : '#888', cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  <strong>{opt.label}</strong> — {opt.desc}
                </button>
              );
            })}
          </div>
        </div>

        {/* SPF Alignment */}
        <div style={{ marginBottom: '20px', paddingLeft: '16px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#999' }}>
            SPF alignment (aspf)
          </h4>
          <div style={{ display: 'grid', gap: '6px' }}>
            {ALIGNMENT_OPTIONS.map(opt => {
              const active = aspf === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setAspf(opt.value)}
                  style={{
                    padding: '8px 12px', textAlign: 'left', borderRadius: '6px',
                    background: active ? '#8b5cf610' : '#0a0a0a',
                    border: `1px solid ${active ? '#8b5cf6' : '#1a1a1a'}`,
                    color: active ? '#8b5cf6' : '#888', cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  <strong>{opt.label}</strong> — {opt.desc}
                </button>
              );
            })}
          </div>
        </div>

        {/* Failure Reporting Options */}
        <div style={{ marginBottom: '20px', paddingLeft: '16px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#999' }}>
            Failure reporting options (fo)
          </h4>
          <div style={{ display: 'grid', gap: '6px' }}>
            {[
              { value: '0', label: 'Generate report if all checks fail (default)' },
              { value: '1', label: 'Generate report if any check fails' },
              { value: 'd', label: 'Generate report if DKIM fails' },
              { value: 's', label: 'Generate report if SPF fails' },
            ].map(opt => {
              const active = fo === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFo(opt.value)}
                  style={{
                    padding: '8px 12px', textAlign: 'left', borderRadius: '6px',
                    background: active ? '#8b5cf610' : '#0a0a0a',
                    border: `1px solid ${active ? '#8b5cf6' : '#1a1a1a'}`,
                    color: active ? '#8b5cf6' : '#888', cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  <strong>fo={opt.value}</strong> — {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Report Interval */}
        <div style={{ marginBottom: '20px', paddingLeft: '16px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: '#999' }}>
            Report interval (ri)
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {REPORT_INTERVAL_OPTIONS.map(opt => {
              const active = reportInterval === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setReportInterval(opt.value)}
                  style={{
                    padding: '8px 16px', borderRadius: '6px',
                    background: active ? '#8b5cf610' : '#0a0a0a',
                    border: `1px solid ${active ? '#8b5cf6' : '#1a1a1a'}`,
                    color: active ? '#8b5cf6' : '#888', cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </details>

      {/* Generated Record */}
      <div style={{
        background: '#111', borderRadius: '12px', padding: '24px',
        border: '1px solid #8b5cf6', marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Your DMARC Record</h3>
            <p style={{ fontSize: '0.75rem', color: '#666', margin: '4px 0 0' }}>
              Add as a TXT record at <code style={{ color: '#8b5cf6' }}>_dmarc.yourdomain.com</code>
            </p>
          </div>
          <button
            onClick={copyRecord}
            style={{
              padding: '6px 14px', fontSize: '0.8rem',
              background: copied ? '#22c55e' : '#8b5cf6', color: '#fff',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 600, transition: 'background 0.15s',
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>

        <div style={{
          background: '#0a0a0a', padding: '14px 18px', borderRadius: '8px',
          fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem',
          color: '#8b5cf6', wordBreak: 'break-all', lineHeight: 1.6,
          userSelect: 'all',
        }}>
          {dmarcRecord}
        </div>

        {!ruaEmail.trim() && (
          <p style={{ color: '#f97316', fontSize: '0.8rem', marginTop: '10px', marginBottom: 0 }}>
            ⚠ No aggregate report email set — you won&apos;t receive DMARC reports. Add an email in step 2 above.
          </p>
        )}
      </div>

      {/* How to Add */}
      <div style={{
        background: '#111', borderRadius: '12px', padding: '20px',
        border: '1px solid #1e1e1e', marginBottom: '24px',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>📝 How to Add This Record</h3>
        <ol style={{ margin: 0, paddingLeft: '20px', color: '#ccc', fontSize: '0.85rem', lineHeight: 1.8 }}>
          <li>Log in to your domain registrar or DNS provider (e.g., Cloudflare, GoDaddy, Namecheap)</li>
          <li>Navigate to <strong style={{ color: '#fff' }}>DNS settings</strong> for your domain</li>
          <li>Add a new <strong style={{ color: '#8b5cf6' }}>TXT record</strong></li>
          <li>Set the <strong style={{ color: '#fff' }}>Host/Name</strong> to <code style={{ color: '#8b5cf6' }}>_dmarc</code></li>
          <li>Paste the generated DMARC record as the <strong style={{ color: '#fff' }}>Value</strong></li>
          <li>Save and allow 1–48 hours for DNS propagation</li>
        </ol>
      </div>

      {/* Recommended Rollout */}
      <div style={{
        background: '#111', borderRadius: '12px', padding: '20px',
        border: '1px solid #1e1e1e',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>🚀 Recommended DMARC Rollout Plan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {[
            { phase: 'Phase 1', title: 'Monitor', desc: 'Set p=none with rua reports. Analyze for 2–4 weeks to identify all legitimate senders.', color: '#3b82f6' },
            { phase: 'Phase 2', title: 'Quarantine 10%', desc: 'Set p=quarantine; pct=10. Gradually increase percentage while monitoring reports.', color: '#eab308' },
            { phase: 'Phase 3', title: 'Quarantine 100%', desc: 'Set p=quarantine; pct=100. All failing emails go to spam. Monitor for false positives.', color: '#f97316' },
            { phase: 'Phase 4', title: 'Reject', desc: 'Set p=reject. Full protection — unauthorized emails are blocked entirely.', color: '#ef4444' },
          ].map(item => (
            <div key={item.phase} style={{
              background: '#0a0a0a', borderRadius: '10px', padding: '14px',
              border: '1px solid #1a1a1a', borderTop: `3px solid ${item.color}`,
            }}>
              <div style={{ fontSize: '0.75rem', color: item.color, fontWeight: 600, marginBottom: '2px' }}>{item.phase}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{item.title}</div>
              <p style={{ fontSize: '0.78rem', color: '#888', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
