'use client';

import { useState, useCallback } from 'react';

const EMAIL_PROVIDERS = [
  { id: 'google', name: 'Google Workspace / Gmail', include: 'include:_spf.google.com', color: '#4285f4' },
  { id: 'microsoft', name: 'Microsoft 365 / Outlook', include: 'include:spf.protection.outlook.com', color: '#0078d4' },
  { id: 'zoho', name: 'Zoho Mail', include: 'include:zoho.com', color: '#c8202b' },
  { id: 'protonmail', name: 'ProtonMail', include: 'include:_spf.protonmail.ch', color: '#6d4aff' },
  { id: 'fastmail', name: 'Fastmail', include: 'include:spf.messagingengine.com', color: '#2f54eb' },
  { id: 'icloud', name: 'iCloud Mail (Apple)', include: 'include:icloud.com', color: '#555' },
  { id: 'yahoo', name: 'Yahoo Mail', include: 'include:spf.mail.yahoo.com', color: '#6001d2' },
];

const SENDING_SERVICES = [
  { id: 'sendgrid', name: 'SendGrid', include: 'include:sendgrid.net', color: '#1a82e2' },
  { id: 'mailchimp', name: 'Mailchimp', include: 'include:servers.mcsv.net', color: '#ffe01b' },
  { id: 'mailgun', name: 'Mailgun', include: 'include:mailgun.org', color: '#e03c31' },
  { id: 'amazonses', name: 'Amazon SES', include: 'include:amazonses.com', color: '#ff9900' },
  { id: 'postmark', name: 'Postmark', include: 'include:spf.mtasv.net', color: '#ffde00' },
  { id: 'sparkpost', name: 'SparkPost / MessageBird', include: 'include:sparkpostmail.com', color: '#fa6423' },
  { id: 'sendinblue', name: 'Brevo (Sendinblue)', include: 'include:sendinblue.com', color: '#0092ff' },
  { id: 'hubspot', name: 'HubSpot', include: 'include:mail.hubspot.net', color: '#ff7a59' },
  { id: 'zendesk', name: 'Zendesk', include: 'include:mail.zendesk.com', color: '#03363d' },
  { id: 'freshdesk', name: 'Freshdesk / Freshworks', include: 'include:email.freshdesk.com', color: '#2c9cf2' },
  { id: 'convertkit', name: 'ConvertKit', include: 'include:spf.convertkit.com', color: '#fb6970' },
  { id: 'shopify', name: 'Shopify', include: 'include:shops.shopify.com', color: '#96bf48' },
];

const POLICY_OPTIONS = [
  { value: '~all', label: 'Soft Fail (~all)', desc: 'Recommended — marks unauthorized email as suspicious but still delivers it', color: '#eab308' },
  { value: '-all', label: 'Hard Fail (-all)', desc: 'Strict — rejects all email not from authorized sources', color: '#ef4444' },
  { value: '?all', label: 'Neutral (?all)', desc: 'Permissive — no opinion on unauthorized email (weakest protection)', color: '#6b7280' },
];

export default function SpfGeneratorTool() {
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [customIncludes, setCustomIncludes] = useState('');
  const [customIPs, setCustomIPs] = useState('');
  const [policy, setPolicy] = useState('~all');
  const [copied, setCopied] = useState(false);
  const [lookupDomain, setLookupDomain] = useState('');
  const [currentSpf, setCurrentSpf] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const toggleItem = (id, list, setList) => {
    setList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const generateRecord = useCallback(() => {
    const parts = ['v=spf1'];

    // Add provider includes
    selectedProviders.forEach(id => {
      const p = EMAIL_PROVIDERS.find(x => x.id === id);
      if (p) parts.push(p.include);
    });

    // Add service includes
    selectedServices.forEach(id => {
      const s = SENDING_SERVICES.find(x => x.id === id);
      if (s) parts.push(s.include);
    });

    // Add custom includes
    const customs = customIncludes.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    customs.forEach(c => {
      if (!c.startsWith('include:')) parts.push(`include:${c}`);
      else parts.push(c);
    });

    // Add custom IPs
    const ips = customIPs.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    ips.forEach(ip => {
      if (ip.includes(':')) parts.push(`ip6:${ip}`);
      else if (ip.includes('/')) parts.push(`ip4:${ip}`);
      else if (ip.match(/^\d+\.\d+\.\d+\.\d+$/)) parts.push(`ip4:${ip}`);
      else parts.push(`ip4:${ip}`);
    });

    parts.push(policy);
    return parts.join(' ');
  }, [selectedProviders, selectedServices, customIncludes, customIPs, policy]);

  const spfRecord = generateRecord();

  // Count DNS lookups (each include = 1 lookup, ip4/ip6 don't count, limit is 10)
  const lookupCount = spfRecord.split(' ').filter(p => p.startsWith('include:')).length;
  const lookupWarning = lookupCount > 10;

  const copyRecord = () => {
    navigator.clipboard.writeText(spfRecord);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lookupCurrentSpf = async () => {
    let d = lookupDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    if (!d) { setLookupError('Please enter a domain'); return; }
    setLookupLoading(true);
    setLookupError('');
    setCurrentSpf(null);
    try {
      const resp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(d)}&type=TXT`);
      const data = await resp.json();
      if (data.Status !== 0) throw new Error(data.Status === 3 ? `Domain "${d}" not found` : `DNS error`);
      const spf = (data.Answer || []).find(r => r.data && r.data.toLowerCase().includes('v=spf1'));
      if (spf) {
        setCurrentSpf(spf.data.replace(/^"|"$/g, ''));
      } else {
        setCurrentSpf('NOT_FOUND');
      }
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLookupLoading(false);
    }
  };

  const analyzeSpf = (record) => {
    if (!record || record === 'NOT_FOUND') return null;
    const parts = record.split(' ');
    const includes = parts.filter(p => p.startsWith('include:'));
    const ips = parts.filter(p => p.startsWith('ip4:') || p.startsWith('ip6:'));
    const mechanism = parts[parts.length - 1];
    let policyLabel = 'Unknown';
    let policyColor = '#666';
    if (mechanism === '-all') { policyLabel = 'Hard Fail'; policyColor = '#ef4444'; }
    else if (mechanism === '~all') { policyLabel = 'Soft Fail'; policyColor = '#eab308'; }
    else if (mechanism === '?all') { policyLabel = 'Neutral'; policyColor = '#6b7280'; }
    else if (mechanism === '+all') { policyLabel = 'Pass All (INSECURE!)'; policyColor = '#ef4444'; }

    const detected = [];
    includes.forEach(inc => {
      const all = [...EMAIL_PROVIDERS, ...SENDING_SERVICES];
      const match = all.find(p => inc === p.include);
      if (match) detected.push(match);
    });

    return { includes, ips, policyLabel, policyColor, detected, lookupCount: includes.length };
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', fontSize: '0.9rem',
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
    color: '#fff', outline: 'none', fontFamily: 'ui-monospace, monospace',
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Current SPF Lookup */}
      <div style={{
        background: '#111', borderRadius: '12px', padding: '20px',
        border: '1px solid #1e1e1e', marginBottom: '32px',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
          🔍 Check Your Current SPF Record
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={lookupDomain}
            onChange={e => setLookupDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookupCurrentSpf()}
            placeholder="Enter your domain (e.g., example.com)"
            style={{ ...inputStyle, flex: 1, minWidth: '220px' }}
            onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />
          <button
            onClick={lookupCurrentSpf}
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

        {currentSpf && currentSpf !== 'NOT_FOUND' && (() => {
          const analysis = analyzeSpf(currentSpf);
          return (
            <div style={{ marginTop: '16px' }}>
              <div style={{
                background: '#0a0a0a', padding: '12px 16px', borderRadius: '8px',
                fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', color: '#8b5cf6',
                wordBreak: 'break-all', marginBottom: '12px',
              }}>
                {currentSpf}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px',
                  background: `${analysis.policyColor}20`, color: analysis.policyColor,
                }}>
                  {analysis.policyLabel}
                </span>
                <span style={{
                  fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px',
                  background: analysis.lookupCount > 10 ? '#ef444420' : '#22c55e20',
                  color: analysis.lookupCount > 10 ? '#ef4444' : '#22c55e',
                }}>
                  {analysis.lookupCount}/10 DNS Lookups
                </span>
                {analysis.detected.map(d => (
                  <span key={d.id} style={{
                    fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px',
                    background: `${d.color}20`, color: d.color,
                  }}>
                    {d.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

        {currentSpf === 'NOT_FOUND' && (
          <div style={{
            marginTop: '12px', padding: '10px 14px', borderRadius: '8px',
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)',
            color: '#f97316', fontSize: '0.85rem',
          }}>
            ⚠ No SPF record found — this domain has no email authentication configured. Use the generator below to create one!
          </div>
        )}
      </div>

      {/* Generator Section */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
        🛠️ Build Your SPF Record
      </h3>

      {/* Email Providers */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px', color: '#ccc' }}>
          1. Select your email provider
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {EMAIL_PROVIDERS.map(p => {
            const active = selectedProviders.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleItem(p.id, selectedProviders, setSelectedProviders)}
                style={{
                  padding: '10px 14px', textAlign: 'left', borderRadius: '8px',
                  background: active ? `${p.color}15` : '#0a0a0a',
                  border: `1px solid ${active ? p.color : '#1e1e1e'}`,
                  color: active ? p.color : '#999', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {active ? '✓ ' : ''}{p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sending Services */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px', color: '#ccc' }}>
          2. Select email sending services
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {SENDING_SERVICES.map(s => {
            const active = selectedServices.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleItem(s.id, selectedServices, setSelectedServices)}
                style={{
                  padding: '10px 14px', textAlign: 'left', borderRadius: '8px',
                  background: active ? `${s.color}15` : '#0a0a0a',
                  border: `1px solid ${active ? s.color : '#1e1e1e'}`,
                  color: active ? s.color : '#999', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {active ? '✓ ' : ''}{s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Includes */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px', color: '#ccc' }}>
          3. Custom includes <span style={{ fontWeight: 400, color: '#666' }}>(optional)</span>
        </h4>
        <textarea
          value={customIncludes}
          onChange={e => setCustomIncludes(e.target.value)}
          placeholder="One per line, e.g.&#10;include:mail.example.com&#10;include:_spf.custom.com"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
          onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>

      {/* Custom IPs */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px', color: '#ccc' }}>
          4. Custom IP addresses <span style={{ fontWeight: 400, color: '#666' }}>(optional)</span>
        </h4>
        <textarea
          value={customIPs}
          onChange={e => setCustomIPs(e.target.value)}
          placeholder="One per line, e.g.&#10;203.0.113.0/24&#10;198.51.100.1&#10;2001:db8::/32"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
          onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>

      {/* Policy */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px', color: '#ccc' }}>
          5. Choose enforcement policy
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

      {/* Generated Record */}
      <div style={{
        background: '#111', borderRadius: '12px', padding: '24px',
        border: lookupWarning ? '1px solid #ef4444' : '1px solid #8b5cf6',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            Your SPF Record
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px',
              background: lookupWarning ? '#ef444420' : '#22c55e20',
              color: lookupWarning ? '#ef4444' : '#22c55e',
            }}>
              {lookupCount}/10 DNS Lookups
            </span>
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
        </div>

        <div style={{
          background: '#0a0a0a', padding: '14px 18px', borderRadius: '8px',
          fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem',
          color: '#8b5cf6', wordBreak: 'break-all', lineHeight: 1.6,
          userSelect: 'all',
        }}>
          {spfRecord}
        </div>

        {lookupWarning && (
          <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '10px', marginBottom: 0 }}>
            ⚠ Your record exceeds 10 DNS lookups — this will cause SPF validation failures! Remove some includes or consolidate.
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
          <li>Log in to your domain registrar or DNS host (e.g., Cloudflare, GoDaddy, Namecheap)</li>
          <li>Navigate to <strong style={{ color: '#fff' }}>DNS settings</strong> for your domain</li>
          <li>Add a new <strong style={{ color: '#8b5cf6' }}>TXT record</strong></li>
          <li>Set the <strong style={{ color: '#fff' }}>Host/Name</strong> to <code style={{ color: '#8b5cf6' }}>@</code> (root domain)</li>
          <li>Paste the generated SPF record as the <strong style={{ color: '#fff' }}>Value</strong></li>
          <li>Save and allow 1–48 hours for DNS propagation</li>
        </ol>
      </div>
    </div>
  );
}
