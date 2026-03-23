'use client';

import { useState } from 'react';

const STATUS_INFO = {
  'client transfer prohibited': { label: 'Transfer Locked', color: '#ef4444', icon: '🔒', desc: 'Domain is locked by the registrar. You must unlock it before transferring.' },
  'server transfer prohibited': { label: 'Server Transfer Lock', color: '#ef4444', icon: '🛑', desc: 'Registry-level lock. Often applied during disputes or UDRP proceedings.' },
  'client hold': { label: 'Client Hold', color: '#f59e0b', icon: '⏸️', desc: 'Domain is suspended by the registrar. Transfers are typically blocked.' },
  'server hold': { label: 'Server Hold', color: '#f59e0b', icon: '⏸️', desc: 'Domain is suspended by the registry. Usually due to policy violations.' },
  'client delete prohibited': { label: 'Delete Protected', color: '#22c55e', icon: '🛡️', desc: 'Domain is protected from accidental deletion.' },
  'server delete prohibited': { label: 'Registry Delete Lock', color: '#22c55e', icon: '🛡️', desc: 'Registry prevents deletion of this domain.' },
  'client update prohibited': { label: 'Update Locked', color: '#3b82f6', icon: '📝', desc: 'DNS and contact changes are locked at the registrar level.' },
  'server update prohibited': { label: 'Registry Update Lock', color: '#3b82f6', icon: '📝', desc: 'Registry prevents updates to this domain.' },
  'client renew prohibited': { label: 'Renew Locked', color: '#f59e0b', icon: '🔄', desc: 'Domain renewal is locked by the registrar.' },
  'server renew prohibited': { label: 'Registry Renew Lock', color: '#f59e0b', icon: '🔄', desc: 'Registry prevents renewal of this domain.' },
  'pending transfer': { label: 'Transfer In Progress', color: '#8b5cf6', icon: '📤', desc: 'A transfer is already in progress for this domain.' },
  'pending delete': { label: 'Pending Deletion', color: '#ef4444', icon: '🗑️', desc: 'Domain is scheduled for deletion and cannot be transferred.' },
  'redemption period': { label: 'Redemption Period', color: '#ef4444', icon: '⚠️', desc: 'Domain expired and is in redemption. Must be restored before transfer.' },
  'active': { label: 'Active', color: '#22c55e', icon: '✅', desc: 'Domain is active and registered.' },
  'ok': { label: 'Active', color: '#22c55e', icon: '✅', desc: 'Domain is active with no special restrictions.' },
};

function getStatusInfo(status) {
  const lower = status.toLowerCase().replace(/\s+/g, ' ').trim();
  for (const [key, info] of Object.entries(STATUS_INFO)) {
    if (lower.includes(key)) return info;
  }
  return { label: status, color: '#6b7280', icon: '❓', desc: 'Unknown status code.' };
}

function parseDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('?')[0];
  return d;
}

export default function DomainTransferChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function checkTransfer(e) {
    e.preventDefault();
    const d = parseDomain(domain);
    if (!d || !d.includes('.')) {
      setError('Please enter a valid domain name (e.g., example.com)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`https://rdap.org/domain/${d}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Domain not found. It may not be registered or the TLD is not supported.');
        throw new Error(`RDAP lookup failed (HTTP ${res.status})`);
      }
      const data = await res.json();

      const statuses = data.status || [];
      const registrar = data.entities?.find(e => e.roles?.includes('registrar'));
      const registrarName = registrar?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3]
        || registrar?.publicIds?.[0]?.identifier
        || 'Unknown';

      // Extract dates
      const events = data.events || [];
      const registration = events.find(e => e.eventAction === 'registration')?.eventDate;
      const expiration = events.find(e => e.eventAction === 'expiration')?.eventDate;
      const lastChanged = events.find(e => e.eventAction === 'last changed')?.eventDate;

      // Determine transferability
      const hasTransferLock = statuses.some(s =>
        s.toLowerCase().includes('transfer prohibited') ||
        s.toLowerCase().includes('server hold') ||
        s.toLowerCase().includes('client hold') ||
        s.toLowerCase().includes('pending delete') ||
        s.toLowerCase().includes('redemption period') ||
        s.toLowerCase().includes('pending transfer')
      );

      // Check if domain was registered recently (within 60 days — ICANN rule)
      const regDate = registration ? new Date(registration) : null;
      const daysSinceRegistration = regDate ? Math.floor((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
      const tooNew = daysSinceRegistration !== null && daysSinceRegistration < 60;

      // Check if domain expires soon (within 15 days)
      const expDate = expiration ? new Date(expiration) : null;
      const daysUntilExpiry = expDate ? Math.floor((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
      const expiringSoon = daysUntilExpiry !== null && daysUntilExpiry < 15;

      const canTransfer = !hasTransferLock && !tooNew && !expiringSoon;

      setResult({
        domain: data.ldhName || d,
        statuses,
        registrar: registrarName,
        registration,
        expiration,
        lastChanged,
        canTransfer,
        hasTransferLock,
        tooNew,
        daysSinceRegistration,
        expiringSoon,
        daysUntilExpiry,
      });
    } catch (err) {
      setError(err.message || 'Failed to check domain. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    flex: 1, padding: '14px 18px', fontSize: '1rem', borderRadius: '10px',
    border: '1px solid #333', background: '#111', color: '#fff',
    outline: 'none', minWidth: 0,
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={checkTransfer} style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="Enter domain name (e.g., example.com)"
          style={inputStyle}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 28px', fontSize: '1rem', fontWeight: 600,
            borderRadius: '10px', border: 'none', cursor: loading ? 'wait' : 'pointer',
            background: loading ? '#6b21a8' : '#8b5cf6', color: '#fff',
            opacity: loading ? 0.7 : 1, whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Checking…' : 'Check Transfer Status'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#1c1117', border: '1px solid #7f1d1d', borderRadius: '10px', padding: '16px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          {/* Transfer verdict */}
          <div style={{
            background: result.canTransfer ? '#0a1f0a' : '#1c1117',
            border: `1px solid ${result.canTransfer ? '#166534' : '#7f1d1d'}`,
            borderRadius: '14px', padding: '24px', marginBottom: '24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
              {result.canTransfer ? '✅' : '🔒'}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px', color: result.canTransfer ? '#4ade80' : '#fca5a5' }}>
              {result.canTransfer ? 'Transfer Eligible' : 'Transfer Blocked'}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: 0 }}>
              {result.canTransfer
                ? `${result.domain} appears eligible for transfer to another registrar.`
                : `${result.domain} cannot be transferred right now. See details below.`}
            </p>
          </div>

          {/* Domain info */}
          <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #1e1e1e', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>Domain Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Domain', value: result.domain },
                { label: 'Registrar', value: result.registrar },
                { label: 'Registered', value: result.registration ? new Date(result.registration).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                { label: 'Expires', value: result.expiration ? new Date(result.expiration).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                { label: 'Last Modified', value: result.lastChanged ? new Date(result.lastChanged).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                { label: 'Domain Age', value: result.daysSinceRegistration !== null ? `${Math.floor(result.daysSinceRegistration / 365)} years, ${result.daysSinceRegistration % 365} days` : 'N/A' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ color: '#e5e7eb', fontSize: '0.95rem', fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Transfer blockers */}
          {!result.canTransfer && (
            <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #7f1d1d', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#fca5a5' }}>⚠️ Transfer Blockers</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {result.hasTransferLock && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px', background: '#1a1a1a', borderRadius: '8px' }}>
                    <span>🔒</span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', marginBottom: '2px' }}>Transfer Lock Active</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.88rem' }}>The domain has a transfer-prohibiting status. Contact your current registrar to unlock it.</div>
                    </div>
                  </div>
                )}
                {result.tooNew && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px', background: '#1a1a1a', borderRadius: '8px' }}>
                    <span>🆕</span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', marginBottom: '2px' }}>Recently Registered (ICANN 60-Day Lock)</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.88rem' }}>
                        This domain was registered {result.daysSinceRegistration} days ago. ICANN requires a 60-day waiting period before transfers.
                        You can transfer after {result.daysSinceRegistration !== null ? `${60 - result.daysSinceRegistration} more days` : 'the lock period ends'}.
                      </div>
                    </div>
                  </div>
                )}
                {result.expiringSoon && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px', background: '#1a1a1a', borderRadius: '8px' }}>
                    <span>⏰</span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', marginBottom: '2px' }}>Expiring Soon</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.88rem' }}>
                        This domain expires in {result.daysUntilExpiry} days. Most registrars won't allow transfers within 15 days of expiration.
                        Renew the domain first, then initiate the transfer.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EPP Status Codes */}
          <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #1e1e1e', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>EPP Status Codes</h3>
            {result.statuses.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>No status codes reported.</p>
            ) : (
              <div style={{ display: 'grid', gap: '8px' }}>
                {result.statuses.map((status, i) => {
                  const info = getStatusInfo(status);
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px', background: '#1a1a1a', borderRadius: '8px',
                      borderLeft: `3px solid ${info.color}`,
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>{info.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>{info.label}</span>
                          <code style={{ fontSize: '0.72rem', color: '#666', fontFamily: 'ui-monospace, monospace' }}>{status}</code>
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: '0.84rem' }}>{info.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Transfer checklist */}
          <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #1e1e1e', padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>📋 Transfer Checklist</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { check: !result.hasTransferLock, label: 'No transfer lock (clientTransferProhibited / serverTransferProhibited)' },
                { check: !result.tooNew, label: 'Domain is older than 60 days (ICANN requirement)' },
                { check: !result.expiringSoon, label: 'Domain is not expiring within 15 days' },
                { check: !result.statuses.some(s => s.toLowerCase().includes('pending')), label: 'No pending operations on the domain' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 14px', background: '#1a1a1a', borderRadius: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.check ? '✅' : '❌'}</span>
                  <span style={{ color: item.check ? '#d1d5db' : '#fca5a5', fontSize: '0.92rem' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
