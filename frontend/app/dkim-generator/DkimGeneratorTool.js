'use client';

import { useState, useCallback } from 'react';

const COMMON_SELECTORS = [
  { id: 'google', name: 'Google Workspace', selector: 'google._domainkey', note: 'Google generates the key in Admin Console → Apps → Google Workspace → Gmail → Authenticate email' },
  { id: 'microsoft', name: 'Microsoft 365', selector: 'selector1._domainkey / selector2._domainkey', note: 'Microsoft auto-generates two selectors (selector1, selector2) with CNAME records' },
  { id: 'sendgrid', name: 'SendGrid', selector: 's1._domainkey / s2._domainkey', note: 'SendGrid uses s1 and s2 selectors — configure in Settings → Sender Authentication' },
  { id: 'mailchimp', name: 'Mailchimp', selector: 'k1._domainkey', note: 'Mailchimp uses k1 selector — set up in Account → Domains → Authentication' },
  { id: 'mailgun', name: 'Mailgun', selector: 'mailo._domainkey', note: 'Mailgun generates the selector — check Domain Settings → DNS Records' },
  { id: 'amazonses', name: 'Amazon SES', selector: '[random]._domainkey', note: 'SES generates unique CNAME selectors automatically — find them in Verified Identities' },
  { id: 'postmark', name: 'Postmark', selector: '[date-based]._domainkey', note: 'Postmark generates a date-stamped selector — check Sender Signatures → DNS Settings' },
  { id: 'zoho', name: 'Zoho Mail', selector: 'zmail._domainkey', note: 'Zoho generates a key — go to Mail Admin → Domain → Email Authentication → DKIM' },
  { id: 'protonmail', name: 'ProtonMail', selector: 'protonmail._domainkey', note: 'ProtonMail uses three selectors (protonmail, protonmail2, protonmail3)' },
  { id: 'fastmail', name: 'Fastmail', selector: 'fm1._domainkey / fm2._domainkey / fm3._domainkey', note: 'Fastmail uses fm1-fm3 selectors — check Settings → Domains → Set up MX records' },
];

const KEY_SIZES = [
  { value: '1024', label: '1024-bit', desc: 'Compatible with all DNS providers (fits in single TXT record)', color: '#eab308' },
  { value: '2048', label: '2048-bit (recommended)', desc: 'Industry standard — may need to be split across multiple TXT strings', color: '#22c55e' },
];

export default function DkimGeneratorTool() {
  const [domain, setDomain] = useState('');
  const [selector, setSelector] = useState('default');
  const [keySize, setKeySize] = useState('2048');
  const [publicKey, setPublicKey] = useState('');
  const [flags, setFlags] = useState('');
  const [copied, setCopied] = useState(false);

  // Lookup state
  const [lookupDomain, setLookupDomain] = useState('');
  const [lookupSelector, setLookupSelector] = useState('google');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const generateRecord = useCallback(() => {
    const parts = ['v=DKIM1'];
    parts.push('k=rsa');
    if (flags === 'testing') parts.push('t=y');
    if (publicKey.trim()) {
      const cleaned = publicKey
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/\s+/g, '');
      parts.push(`p=${cleaned}`);
    } else {
      parts.push('p=YOUR_PUBLIC_KEY_HERE');
    }
    return parts.join('; ');
  }, [publicKey, flags]);

  const dkimRecord = generateRecord();
  const recordName = selector.trim() ? `${selector.trim()}._domainkey${domain.trim() ? '.' + domain.trim() : ''}` : '_domainkey';

  const copyRecord = () => {
    navigator.clipboard.writeText(dkimRecord);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lookupDkim = async () => {
    let d = lookupDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    let sel = lookupSelector.trim().toLowerCase();
    if (!d) { setLookupError('Please enter a domain'); return; }
    if (!sel) { setLookupError('Please enter a selector'); return; }

    setLookupLoading(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const qname = `${sel}._domainkey.${d}`;
      const resp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(qname)}&type=TXT`);
      const data = await resp.json();

      if (data.Status === 3) {
        setLookupResult({ found: false, qname });
      } else if (data.Status !== 0) {
        throw new Error('DNS query failed');
      } else {
        // Check for CNAME (common for M365, SendGrid, SES)
        const cname = (data.Answer || []).find(r => r.type === 5);
        const txt = (data.Answer || []).find(r => r.type === 16 && r.data && r.data.toLowerCase().includes('v=dkim1'));
        if (txt) {
          const raw = txt.data.replace(/^"|"$/g, '').replace(/"[\s]*"/g, '');
          setLookupResult({ found: true, qname, record: raw, type: 'TXT' });
        } else if (cname) {
          setLookupResult({ found: true, qname, record: cname.data, type: 'CNAME' });
        } else {
          setLookupResult({ found: false, qname });
        }
      }
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLookupLoading(false);
    }
  };

  const parseDkim = (record) => {
    if (!record) return {};
    const parts = {};
    record.split(';').forEach(part => {
      const [k, ...v] = part.trim().split('=');
      if (k && v.length) parts[k.trim()] = v.join('=').trim();
    });
    return parts;
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', fontSize: '0.9rem',
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
    color: '#fff', outline: 'none', fontFamily: 'ui-monospace, monospace',
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* DKIM Lookup */}
      <div style={{
        background: '#111', borderRadius: '12px', padding: '20px',
        border: '1px solid #1e1e1e', marginBottom: '32px',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
          🔍 Check Existing DKIM Record
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <input
            type="text"
            value={lookupDomain}
            onChange={e => setLookupDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookupDkim()}
            placeholder="Domain (e.g., example.com)"
            style={{ ...inputStyle, flex: 1, minWidth: '180px' }}
            onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />
          <input
            type="text"
            value={lookupSelector}
            onChange={e => setLookupSelector(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookupDkim()}
            placeholder="Selector (e.g., google)"
            style={{ ...inputStyle, flex: 0.6, minWidth: '140px' }}
            onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />
          <button
            onClick={lookupDkim}
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

        {/* Common selectors reference */}
        <details style={{ marginTop: '8px' }}>
          <summary style={{ fontSize: '0.8rem', color: '#666', cursor: 'pointer' }}>
            Common DKIM selectors by provider ▾
          </summary>
          <div style={{ marginTop: '8px', display: 'grid', gap: '6px' }}>
            {COMMON_SELECTORS.map(s => (
              <div key={s.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '6px 10px', background: '#0a0a0a', borderRadius: '6px',
                fontSize: '0.8rem', gap: '8px', flexWrap: 'wrap',
              }}>
                <span style={{ color: '#ccc', fontWeight: 500, minWidth: '120px' }}>{s.name}</span>
                <span style={{ color: '#8b5cf6', fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem' }}>{s.selector}</span>
                <button
                  onClick={() => setLookupSelector(s.selector.split(' ')[0].replace('._domainkey', ''))}
                  style={{
                    padding: '2px 8px', fontSize: '0.7rem', background: '#1e1e1e',
                    border: '1px solid #2a2a2a', borderRadius: '4px', color: '#999',
                    cursor: 'pointer',
                  }}
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </details>

        {lookupError && (
          <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '10px' }}>⚠ {lookupError}</p>
        )}

        {lookupResult && lookupResult.found && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span style={{
                fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px',
                background: '#22c55e20', color: '#22c55e',
              }}>
                ✓ DKIM Found
              </span>
              <span style={{
                fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px',
                background: '#8b5cf620', color: '#8b5cf6',
              }}>
                {lookupResult.type} Record
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '6px' }}>
              Query: <code style={{ color: '#999' }}>{lookupResult.qname}</code>
            </div>
            <div style={{
              background: '#0a0a0a', padding: '12px 16px', borderRadius: '8px',
              fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: '#8b5cf6',
              wordBreak: 'break-all', lineHeight: 1.6,
            }}>
              {lookupResult.record}
            </div>
            {lookupResult.type === 'TXT' && (() => {
              const parsed = parseDkim(lookupResult.record);
              return (
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {parsed.k && <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#3b82f620', color: '#3b82f6' }}>Key type: {parsed.k}</span>}
                  {parsed.t === 'y' && <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#eab30820', color: '#eab308' }}>Testing mode</span>}
                  {parsed.p && <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#22c55e20', color: '#22c55e' }}>Key length: ~{Math.round(parsed.p.length * 6 / 8)} bytes ({Math.round(parsed.p.length * 6 / 8) >= 256 ? '2048-bit' : '1024-bit'})</span>}
                </div>
              );
            })()}
            {lookupResult.type === 'CNAME' && (
              <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '8px' }}>
                This is a CNAME record pointing to <strong style={{ color: '#ccc' }}>{lookupResult.record}</strong>. 
                The DKIM key is hosted by your email provider — this is normal for services like Microsoft 365, SendGrid, and Amazon SES.
              </p>
            )}
          </div>
        )}

        {lookupResult && !lookupResult.found && (
          <div style={{
            marginTop: '12px', padding: '10px 14px', borderRadius: '8px',
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)',
            color: '#f97316', fontSize: '0.85rem',
          }}>
            ⚠ No DKIM record found at <code style={{ color: '#fff' }}>{lookupResult.qname}</code>. 
            Try a different selector — common ones include "google", "selector1", "s1", "k1", "default".
          </div>
        )}
      </div>

      {/* Generator Section */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
        🛠️ Build Your DKIM Record
      </h3>

      {/* Domain */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px', color: '#ccc' }}>
          1. Your domain
        </h4>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="example.com"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
          onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>

      {/* Selector */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px', color: '#ccc' }}>
          2. DKIM selector
        </h4>
        <input
          type="text"
          value={selector}
          onChange={e => setSelector(e.target.value)}
          placeholder="default"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
          onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
        />
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '6px' }}>
          The selector is a label that identifies which DKIM key to use. Common selectors: "default", "google", "selector1", "s1", "k1"
        </p>
      </div>

      {/* Key Size */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px', color: '#ccc' }}>
          3. Key size
        </h4>
        <div style={{ display: 'grid', gap: '8px' }}>
          {KEY_SIZES.map(opt => {
            const active = keySize === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setKeySize(opt.value)}
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

      {/* Public Key */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px', color: '#ccc' }}>
          4. Public key <span style={{ fontWeight: 400, color: '#666' }}>(paste your RSA public key)</span>
        </h4>
        <textarea
          value={publicKey}
          onChange={e => setPublicKey(e.target.value)}
          placeholder={"Paste your RSA public key here (PEM format accepted):\n\n-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----\n\nOr just the base64 key string without headers."}
          rows={6}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
          onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
        />
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '6px' }}>
          Generate a key pair with: <code style={{ color: '#8b5cf6' }}>openssl genrsa -out dkim_private.pem {keySize}</code> then <code style={{ color: '#8b5cf6' }}>openssl rsa -in dkim_private.pem -pubout -out dkim_public.pem</code>
        </p>
      </div>

      {/* Testing flag */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px', color: '#ccc' }}>
          5. Options
        </h4>
        <button
          onClick={() => setFlags(flags === 'testing' ? '' : 'testing')}
          style={{
            padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
            background: flags === 'testing' ? '#eab30815' : '#0a0a0a',
            border: `1px solid ${flags === 'testing' ? '#eab308' : '#1e1e1e'}`,
            color: flags === 'testing' ? '#eab308' : '#999',
            fontSize: '0.85rem', transition: 'all 0.15s',
          }}
        >
          {flags === 'testing' ? '✓ ' : ''}Testing mode (t=y) — receivers won't reject failures while you're testing
        </button>
      </div>

      {/* Generated Record */}
      <div style={{
        background: '#111', borderRadius: '12px', padding: '24px',
        border: '1px solid #8b5cf6', marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            Your DKIM TXT Record
          </h3>
          <button
            onClick={copyRecord}
            style={{
              padding: '6px 14px', fontSize: '0.8rem',
              background: copied ? '#22c55e' : '#8b5cf6', color: '#fff',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 600, transition: 'background 0.15s',
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy Value'}
          </button>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>DNS Record Name:</div>
          <div style={{
            background: '#0a0a0a', padding: '10px 14px', borderRadius: '8px',
            fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem',
            color: '#22c55e', wordBreak: 'break-all',
          }}>
            {recordName}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>TXT Record Value:</div>
          <div style={{
            background: '#0a0a0a', padding: '10px 14px', borderRadius: '8px',
            fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem',
            color: '#8b5cf6', wordBreak: 'break-all', lineHeight: 1.6,
            userSelect: 'all',
          }}>
            {dkimRecord}
          </div>
        </div>
      </div>

      {/* How to Add */}
      <div style={{
        background: '#111', borderRadius: '12px', padding: '20px',
        border: '1px solid #1e1e1e', marginBottom: '24px',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>📝 How to Set Up DKIM</h3>
        <ol style={{ margin: 0, paddingLeft: '20px', color: '#ccc', fontSize: '0.85rem', lineHeight: 1.8 }}>
          <li>Generate a {keySize}-bit RSA key pair using OpenSSL or let your email provider generate one</li>
          <li>Log in to your DNS host (e.g., Cloudflare, Route 53, GoDaddy)</li>
          <li>Add a new <strong style={{ color: '#8b5cf6' }}>TXT record</strong></li>
          <li>Set the <strong style={{ color: '#fff' }}>Name/Host</strong> to <code style={{ color: '#22c55e' }}>{selector.trim() || 'default'}._domainkey</code></li>
          <li>Paste the generated DKIM record as the <strong style={{ color: '#fff' }}>Value</strong></li>
          <li>Configure your mail server to sign outgoing email with the private key</li>
          <li>Test by sending an email and checking the <code style={{ color: '#8b5cf6' }}>DKIM-Signature</code> header</li>
        </ol>
      </div>
    </div>
  );
}
