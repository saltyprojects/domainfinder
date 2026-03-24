'use client';

import { useState } from 'react';

const BLACKLISTS = [
  { zone: 'dbl.spamhaus.org', name: 'Spamhaus DBL', desc: 'Domain Block List — blocks known spam domains', severity: 'high' },
  { zone: 'multi.surbl.org', name: 'SURBL Multi', desc: 'Spam URI Realtime Blocklist', severity: 'high' },
  { zone: 'black.uribl.com', name: 'URIBL Black', desc: 'URI-based blacklist for spam domains', severity: 'high' },
  { zone: 'dnsbl.sorbs.net', name: 'SORBS DNSBL', desc: 'Spam and Open Relay Blocking System', severity: 'medium' },
  { zone: 'bl.spamcop.net', name: 'SpamCop', desc: 'Real-time spam blocking list', severity: 'medium' },
  { zone: 'dnsbl-1.uceprotect.net', name: 'UCEPROTECT L1', desc: 'Single IP blocking list', severity: 'medium' },
  { zone: 'zen.spamhaus.org', name: 'Spamhaus ZEN', desc: 'Combined Spamhaus IP blocklist (SBL+XBL+PBL)', severity: 'high' },
  { zone: 'b.barracudacentral.org', name: 'Barracuda', desc: 'Barracuda Reputation Block List', severity: 'medium' },
  { zone: 'spam.dnsbl.anonmails.de', name: 'AnonMails', desc: 'German-based spam domain list', severity: 'low' },
  { zone: 'cbl.abuseat.org', name: 'CBL', desc: 'Composite Blocking List — detects botnet/spam sources', severity: 'medium' },
  { zone: 'dnsbl.dronebl.org', name: 'DroneBL', desc: 'Drone/botnet IP blocking list', severity: 'medium' },
  { zone: 'psbl.surriel.com', name: 'PSBL', desc: 'Passive Spam Block List', severity: 'low' },
  { zone: 'all.s5h.net', name: 'S5H', desc: 'Community-driven IP blacklist', severity: 'low' },
  { zone: 'rbl.interserver.net', name: 'InterServer', desc: 'InterServer real-time blacklist', severity: 'low' },
];

function parseDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
  return d;
}

async function resolveDNS(name, type = 'A') {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

async function getIPsForDomain(domain) {
  const ips = [];
  const a = await resolveDNS(domain, 'A');
  if (a && a.Answer) {
    a.Answer.forEach(r => { if (r.type === 1) ips.push(r.data); });
  }
  return ips;
}

function reverseIP(ip) {
  return ip.split('.').reverse().join('.');
}

function StatusBadge({ status }) {
  const config = {
    clean: { bg: '#22c55e20', color: '#22c55e', border: '#22c55e40', label: '✓ Clean' },
    listed: { bg: '#ef444420', color: '#ef4444', border: '#ef444440', label: '✗ Listed' },
    timeout: { bg: '#f59e0b20', color: '#f59e0b', border: '#f59e0b40', label: '— Timeout' },
    error: { bg: '#66666620', color: '#666', border: '#66666640', label: '— Error' },
    checking: { bg: '#8b5cf620', color: '#8b5cf6', border: '#8b5cf640', label: '⟳ Checking' },
  };
  const c = config[status] || config.error;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {c.label}
    </span>
  );
}

function SeverityDot({ severity }) {
  const colors = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
  return (
    <span style={{
      width: '8px', height: '8px', borderRadius: '50%',
      background: colors[severity] || '#666', display: 'inline-block', flexShrink: 0,
    }} title={`${severity} severity`} />
  );
}

export default function DomainBlacklistChecker() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [domainInfo, setDomainInfo] = useState(null);

  async function checkBlacklist(queryName, bl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(queryName)}&type=A`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      if (!res.ok) return 'error';
      const data = await res.json();
      if (data.Answer && data.Answer.length > 0) {
        // NXDOMAIN = not listed, Answer with 127.x.x.x = listed
        const listed = data.Answer.some(a => a.data && a.data.startsWith('127.'));
        return listed ? 'listed' : 'clean';
      }
      // Status 3 = NXDOMAIN = not listed
      return data.Status === 3 || data.Status === 0 ? 'clean' : 'clean';
    } catch (e) {
      if (e.name === 'AbortError') return 'timeout';
      return 'error';
    }
  }

  async function handleCheck() {
    const domain = parseDomain(input);
    if (!domain) return;
    setLoading(true);
    setResults([]);
    setSummary(null);

    // Resolve domain IPs first
    const ips = await getIPsForDomain(domain);
    setDomainInfo({ domain, ips });

    // Initialize results
    const initial = BLACKLISTS.map(bl => ({ ...bl, status: 'checking', queryUsed: '' }));
    setResults([...initial]);

    // Check each blacklist
    const updated = [...initial];
    const promises = BLACKLISTS.map(async (bl, i) => {
      // Domain-based blacklists (dbl, surbl, uribl) check the domain directly
      // IP-based blacklists need reversed IP
      const isDomainBL = ['dbl.spamhaus.org', 'multi.surbl.org', 'black.uribl.com'].includes(bl.zone);

      if (isDomainBL) {
        const query = `${domain}.${bl.zone}`;
        const status = await checkBlacklist(query, bl);
        updated[i] = { ...updated[i], status, queryUsed: query };
        setResults([...updated]);
      } else if (ips.length > 0) {
        // Check first IP against IP-based blacklists
        const ip = ips[0];
        const query = `${reverseIP(ip)}.${bl.zone}`;
        const status = await checkBlacklist(query, bl);
        updated[i] = { ...updated[i], status, queryUsed: query };
        setResults([...updated]);
      } else {
        updated[i] = { ...updated[i], status: 'error', queryUsed: 'No IP resolved' };
        setResults([...updated]);
      }
    });

    await Promise.all(promises);

    // Calculate summary
    const listed = updated.filter(r => r.status === 'listed').length;
    const clean = updated.filter(r => r.status === 'clean').length;
    const errors = updated.filter(r => r.status === 'timeout' || r.status === 'error').length;

    let reputation = 'excellent';
    let score = 100;
    if (listed > 0) {
      score = Math.max(0, 100 - (listed * 20));
      reputation = listed >= 3 ? 'critical' : listed >= 2 ? 'poor' : 'warning';
    }

    setSummary({ listed, clean, errors, total: BLACKLISTS.length, reputation, score });
    setLoading(false);
  }

  const reputationConfig = {
    excellent: { color: '#22c55e', emoji: '🟢', label: 'Excellent — No blacklists detected' },
    warning: { color: '#f59e0b', emoji: '🟡', label: 'Warning — Found on 1 blacklist' },
    poor: { color: '#ef4444', emoji: '🟠', label: 'Poor — Found on multiple blacklists' },
    critical: { color: '#ef4444', emoji: '🔴', label: 'Critical — Found on many blacklists' },
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && handleCheck()}
          placeholder="Enter domain (e.g. example.com)"
          style={{
            flex: 1, minWidth: '240px', padding: '12px 16px', borderRadius: '10px',
            border: '1px solid #2a2a2a', background: '#111', color: '#fff',
            fontSize: '1rem', outline: 'none',
          }}
        />
        <button
          onClick={handleCheck}
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 24px', borderRadius: '10px', border: 'none',
            background: loading ? '#333' : '#8b5cf6', color: '#fff',
            fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
            fontSize: '0.95rem', transition: 'background 0.2s',
          }}
        >
          {loading ? 'Checking…' : 'Check Blacklists'}
        </button>
      </div>

      {/* Domain Info */}
      {domainInfo && (
        <div style={{
          background: '#111', borderRadius: '12px', padding: '16px 20px',
          border: '1px solid #2a2a2a', marginBottom: '20px',
          display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div>
            <span style={{ color: '#666', fontSize: '0.8rem' }}>Domain</span>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{domainInfo.domain}</div>
          </div>
          <div>
            <span style={{ color: '#666', fontSize: '0.8rem' }}>IP Address{domainInfo.ips.length > 1 ? 'es' : ''}</span>
            <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: '#ccc' }}>
              {domainInfo.ips.length > 0 ? domainInfo.ips.join(', ') : 'Could not resolve'}
            </div>
          </div>
          <div>
            <span style={{ color: '#666', fontSize: '0.8rem' }}>Blacklists Checked</span>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{BLACKLISTS.length}</div>
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div style={{
          background: '#111', borderRadius: '12px', padding: '24px',
          border: `1px solid ${reputationConfig[summary.reputation].color}30`,
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '2rem' }}>{reputationConfig[summary.reputation].emoji}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Domain Reputation</h3>
              <p style={{ margin: 0, color: reputationConfig[summary.reputation].color, fontSize: '0.9rem', fontWeight: 600 }}>
                {reputationConfig[summary.reputation].label}
              </p>
            </div>
          </div>

          {/* Score bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '10px', background: '#1e1e1e', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                width: `${summary.score}%`, height: '100%',
                background: reputationConfig[summary.reputation].color,
                borderRadius: '5px', transition: 'width 0.5s ease',
              }} />
            </div>
            <span style={{
              fontWeight: 700, color: reputationConfig[summary.reputation].color,
              fontSize: '1.1rem', minWidth: '55px',
            }}>
              {summary.score}/100
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Stat label="Clean" value={summary.clean} color="#22c55e" />
            <Stat label="Listed" value={summary.listed} color="#ef4444" />
            <Stat label="Errors/Timeouts" value={summary.errors} color="#666" />
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #2a2a2a', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '32px 1fr 1fr auto',
            padding: '12px 16px', borderBottom: '1px solid #2a2a2a',
            fontSize: '0.75rem', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span></span>
            <span>Blacklist</span>
            <span>Description</span>
            <span>Status</span>
          </div>
          {results.map((r, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '32px 1fr 1fr auto',
              padding: '12px 16px', borderBottom: i < results.length - 1 ? '1px solid #1a1a1a' : 'none',
              alignItems: 'center', transition: 'background 0.15s',
              background: r.status === 'listed' ? '#ef444408' : 'transparent',
            }}>
              <SeverityDot severity={r.severity} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</div>
                <div style={{ color: '#555', fontSize: '0.7rem', fontFamily: 'monospace' }}>{r.zone}</div>
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{r.desc}</div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      )}

      {/* Delisting tips */}
      {summary && summary.listed > 0 && (
        <div style={{
          background: '#111', borderRadius: '12px', padding: '24px',
          border: '1px solid #ef444430', marginTop: '24px',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#ef4444' }}>
            ⚠️ Delisting Recommendations
          </h3>
          <ul style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '0.9rem', paddingLeft: '20px' }}>
            <li>Identify and stop any spam or malicious activity originating from your domain or IP.</li>
            <li>Check your email server configuration — ensure proper SPF, DKIM, and DMARC records.</li>
            <li>Visit each blacklist&apos;s website to submit a delisting request.</li>
            <li>Monitor your domain regularly after delisting to prevent recurrence.</li>
            <li>Consider using a dedicated IP address if you&apos;re on shared hosting.</li>
            <li>Review your website for malware or compromised pages that could trigger listings.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', minWidth: '80px' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: '#666' }}>{label}</div>
    </div>
  );
}
