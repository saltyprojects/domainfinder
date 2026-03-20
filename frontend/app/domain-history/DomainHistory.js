'use client';

import { useState } from 'react';

const RDAP_SERVERS = {
  com: 'https://rdap.verisign.com/com/v1/domain/',
  net: 'https://rdap.verisign.com/net/v1/domain/',
  org: 'https://rdap.org/domain/',
  io: 'https://rdap.org/domain/',
  ai: 'https://rdap.org/domain/',
  dev: 'https://rdap.org/domain/',
  app: 'https://rdap.org/domain/',
  co: 'https://rdap.org/domain/',
  me: 'https://rdap.org/domain/',
  info: 'https://rdap.org/domain/',
  xyz: 'https://rdap.org/domain/',
  biz: 'https://rdap.org/domain/',
};

function getRdapUrl(domain) {
  const tld = domain.split('.').pop().toLowerCase();
  const server = RDAP_SERVERS[tld] || 'https://rdap.org/domain/';
  return server + domain;
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function daysBetween(a, b) {
  if (!a || !b) return null;
  return Math.floor((new Date(b) - new Date(a)) / 86400000);
}

function yearsOld(iso) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const y = diff / (365.25 * 86400000);
  return y.toFixed(1);
}

function extractEvents(rdap) {
  const events = [];
  if (rdap.events) {
    for (const e of rdap.events) {
      events.push({
        action: e.eventAction,
        date: e.eventDate,
        actor: e.eventActor || null,
      });
    }
  }
  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function extractNameservers(rdap) {
  if (!rdap.nameservers) return [];
  return rdap.nameservers.map(ns => ns.ldhName || ns.unicodeName || '').filter(Boolean);
}

function extractRegistrar(rdap) {
  if (!rdap.entities) return null;
  for (const ent of rdap.entities) {
    if (ent.roles && ent.roles.includes('registrar')) {
      // Try vcardArray first
      if (ent.vcardArray && ent.vcardArray[1]) {
        for (const field of ent.vcardArray[1]) {
          if (field[0] === 'fn') return field[3];
        }
      }
      // Fall back to handle
      if (ent.handle) return ent.handle;
      // Try publicIds
      if (ent.publicIds) {
        return ent.publicIds.map(p => `${p.type}: ${p.identifier}`).join(', ');
      }
    }
  }
  return null;
}

function extractStatuses(rdap) {
  return rdap.status || [];
}

const EVENT_LABELS = {
  registration: '📋 Registered',
  reregistration: '🔄 Re-registered',
  'last changed': '✏️ Last Modified',
  expiration: '⏰ Expires',
  'last update of RDAP database': '🗃️ RDAP DB Updated',
  transfer: '🔀 Transferred',
  locked: '🔒 Locked',
  unlocked: '🔓 Unlocked',
};

const STATUS_INFO = {
  'client transfer prohibited': { icon: '🔒', desc: 'Transfer locked by registrar' },
  'server transfer prohibited': { icon: '🔒', desc: 'Transfer locked by registry' },
  'client delete prohibited': { icon: '🛡️', desc: 'Delete locked by registrar' },
  'server delete prohibited': { icon: '🛡️', desc: 'Delete locked by registry' },
  'client update prohibited': { icon: '✋', desc: 'Updates locked by registrar' },
  'server update prohibited': { icon: '✋', desc: 'Updates locked by registry' },
  active: { icon: '✅', desc: 'Domain is active and resolving' },
  ok: { icon: '✅', desc: 'Domain is in normal status' },
  'client hold': { icon: '⏸️', desc: 'Suspended by registrar' },
  'server hold': { icon: '⏸️', desc: 'Suspended by registry' },
  'pending delete': { icon: '🗑️', desc: 'Pending deletion' },
  'pending transfer': { icon: '🔄', desc: 'Transfer in progress' },
  'auto renew period': { icon: '♻️', desc: 'In auto-renewal period' },
  'redemption period': { icon: '⚠️', desc: 'In redemption period (can be recovered)' },
};

export default function DomainHistory() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function lookup(e) {
    e.preventDefault();
    const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    if (!clean || !clean.includes('.')) {
      setError('Please enter a valid domain name (e.g., example.com)');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Fetch RDAP data
      const rdapUrl = getRdapUrl(clean);
      const rdapRes = await fetch(rdapUrl);
      if (!rdapRes.ok) throw new Error(`RDAP lookup failed (${rdapRes.status}). Domain may not exist or RDAP data is unavailable.`);
      const rdap = await rdapRes.json();

      // Fetch DNS records in parallel for current state
      const [aRes, nsRes, mxRes] = await Promise.all([
        fetch(`https://dns.google/resolve?name=${clean}&type=A`).then(r => r.json()).catch(() => null),
        fetch(`https://dns.google/resolve?name=${clean}&type=NS`).then(r => r.json()).catch(() => null),
        fetch(`https://dns.google/resolve?name=${clean}&type=MX`).then(r => r.json()).catch(() => null),
      ]);

      const events = extractEvents(rdap);
      const nameservers = extractNameservers(rdap);
      const registrar = extractRegistrar(rdap);
      const statuses = extractStatuses(rdap);
      const regEvent = events.find(e => e.action === 'registration');
      const expEvent = events.find(e => e.action === 'expiration');
      const lastChanged = events.find(e => e.action === 'last changed');

      const aRecords = aRes?.Answer?.map(a => a.data) || [];
      const nsRecords = nsRes?.Answer?.map(a => a.data.replace(/\.$/, '')) || [];
      const mxRecords = mxRes?.Answer?.map(a => a.data) || [];

      setResult({
        domain: rdap.ldhName || clean,
        handle: rdap.handle,
        events,
        nameservers,
        registrar,
        statuses,
        regDate: regEvent?.date,
        expDate: expEvent?.date,
        lastChanged: lastChanged?.date,
        aRecords,
        nsRecords,
        mxRecords,
        raw: rdap,
      });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  const age = result ? yearsOld(result.regDate) : null;
  const totalDays = result ? daysBetween(result.regDate, new Date().toISOString()) : null;

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={lookup} style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="Enter a domain name (e.g., google.com)"
          style={{
            flex: 1, minWidth: '220px', padding: '14px 16px', borderRadius: '10px',
            border: '1px solid #2a2a2a', background: '#111', color: '#fff',
            fontSize: '1rem', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#8b5cf6'}
          onBlur={e => e.target.style.borderColor = '#2a2a2a'}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 28px', borderRadius: '10px', border: 'none',
            background: loading ? '#555' : '#8b5cf6', color: '#fff', fontSize: '1rem',
            fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Looking up…' : 'Lookup History'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#1c1017', border: '1px solid #7f1d1d', borderRadius: '10px', padding: '16px', color: '#fca5a5', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Overview Card */}
          <div style={{ background: '#111', borderRadius: '14px', border: '1px solid #1e1e1e', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{result.domain}</h2>
                {result.registrar && <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '4px 0 0' }}>Registrar: {result.registrar}</p>}
              </div>
              {age && (
                <div style={{ background: '#8b5cf620', border: '1px solid #8b5cf640', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6' }}>{age}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>years old</div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>Registered</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{fmtDate(result.regDate)}</div>
              </div>
              <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>Expires</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{fmtDate(result.expDate)}</div>
              </div>
              <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>Last Modified</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{fmtDate(result.lastChanged)}</div>
              </div>
              {totalDays && (
                <div style={{ background: '#0a0a0a', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>Days Active</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{totalDays.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          {result.events.length > 0 && (
            <div style={{ background: '#111', borderRadius: '14px', border: '1px solid #1e1e1e', padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>📜 Domain Timeline</h3>
              <div style={{ position: 'relative', paddingLeft: '28px' }}>
                <div style={{ position: 'absolute', left: '8px', top: '4px', bottom: '4px', width: '2px', background: '#2a2a2a' }} />
                {result.events.map((ev, i) => {
                  const label = EVENT_LABELS[ev.action] || `📌 ${ev.action}`;
                  return (
                    <div key={i} style={{ position: 'relative', marginBottom: '20px' }}>
                      <div style={{
                        position: 'absolute', left: '-24px', top: '4px',
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: ev.action === 'registration' ? '#8b5cf6' : ev.action === 'expiration' ? '#ef4444' : '#3b3b3b',
                        border: '2px solid #000',
                      }} />
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{label}</div>
                      <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '2px' }}>{fmtDate(ev.date)}</div>
                      {ev.actor && <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>by {ev.actor}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Domain Status */}
          {result.statuses.length > 0 && (
            <div style={{ background: '#111', borderRadius: '14px', border: '1px solid #1e1e1e', padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>🏷️ Domain Status Codes</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {result.statuses.map((s, i) => {
                  const info = STATUS_INFO[s] || { icon: '📌', desc: s };
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0a0a0a', borderRadius: '8px', padding: '10px 14px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{info.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'monospace', color: '#8b5cf6' }}>{s}</div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{info.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current Infrastructure */}
          <div style={{ background: '#111', borderRadius: '14px', border: '1px solid #1e1e1e', padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>🌐 Current Infrastructure</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Nameservers</div>
                {(result.nsRecords.length > 0 ? result.nsRecords : result.nameservers).map((ns, i) => (
                  <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#9ca3af', padding: '4px 0' }}>{ns}</div>
                ))}
                {result.nsRecords.length === 0 && result.nameservers.length === 0 && (
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>None found</div>
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', fontWeight: 600 }}>A Records (IP Addresses)</div>
                {result.aRecords.length > 0 ? result.aRecords.map((ip, i) => (
                  <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#9ca3af', padding: '4px 0' }}>{ip}</div>
                )) : (
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>None found</div>
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', fontWeight: 600 }}>MX Records (Mail)</div>
                {result.mxRecords.length > 0 ? result.mxRecords.map((mx, i) => (
                  <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#9ca3af', padding: '4px 0' }}>{mx}</div>
                )) : (
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>None found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
