'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'domy_domain_watchlist';

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function statusBadge(daysLeft) {
  if (daysLeft === null) return { label: 'Unknown', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' };
  if (daysLeft < 0) return { label: 'Expired', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' };
  if (daysLeft <= 7) return { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' };
  if (daysLeft <= 30) return { label: 'Warning', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
  if (daysLeft <= 90) return { label: 'Upcoming', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' };
  return { label: 'OK', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' };
}

function loadWatchlist() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveWatchlist(list) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

async function fetchDomainInfo(domain) {
  // Try RDAP first
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { 'Accept': 'application/rdap+json' },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const data = await res.json();
      let expiration = null;
      let registration = null;
      let registrar = null;

      if (data.events) {
        for (const ev of data.events) {
          if (ev.eventAction === 'expiration') expiration = ev.eventDate;
          if (ev.eventAction === 'registration') registration = ev.eventDate;
        }
      }

      if (data.entities) {
        for (const ent of data.entities) {
          if (ent.roles && ent.roles.includes('registrar')) {
            if (ent.vcardArray && ent.vcardArray[1]) {
              for (const field of ent.vcardArray[1]) {
                if (field[0] === 'fn') { registrar = field[3]; break; }
              }
            }
            if (!registrar && ent.publicIds) {
              registrar = ent.publicIds[0]?.identifier || null;
            }
            break;
          }
        }
      }

      // Also get DNS status
      let hasA = false;
      let nameservers = [];
      try {
        const dnsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        const dnsData = await dnsRes.json();
        hasA = dnsData.Answer && dnsData.Answer.length > 0;
      } catch {}
      try {
        const nsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`);
        const nsData = await nsRes.json();
        if (nsData.Answer) nameservers = nsData.Answer.map(a => a.data).slice(0, 3);
      } catch {}

      return {
        expiration: expiration ? new Date(expiration).toISOString() : null,
        registration: registration ? new Date(registration).toISOString() : null,
        registrar: registrar || 'Unknown',
        isActive: hasA,
        nameservers,
        lastChecked: new Date().toISOString(),
      };
    }
  } catch {}

  // Fallback: just DNS check
  let hasA = false;
  try {
    const dnsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const dnsData = await dnsRes.json();
    hasA = dnsData.Answer && dnsData.Answer.length > 0;
  } catch {}

  return {
    expiration: null,
    registration: null,
    registrar: 'Unknown',
    isActive: hasA,
    nameservers: [],
    lastChecked: new Date().toISOString(),
  };
}

const inputStyle = {
  flex: 1,
  padding: '14px 18px',
  borderRadius: '12px',
  border: '1px solid rgba(139,92,246,0.3)',
  background: 'rgba(139,92,246,0.08)',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const buttonStyle = {
  padding: '14px 28px',
  borderRadius: '12px',
  border: 'none',
  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
};

const cardStyle = {
  background: 'rgba(139,92,246,0.06)',
  border: '1px solid rgba(139,92,246,0.15)',
  borderRadius: '16px',
  padding: '20px 24px',
  marginBottom: '12px',
  transition: 'all 0.2s',
};

export default function DomainWatchlistTool() {
  const [watchlist, setWatchlist] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState({});
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [sortBy, setSortBy] = useState('expiration');
  const [filterStatus, setFilterStatus] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setWatchlist(loadWatchlist());
    setMounted(true);
  }, []);

  const addDomain = useCallback(async () => {
    const domain = cleanDomain(input);
    if (!domain || !domain.includes('.')) return;
    if (watchlist.find(d => d.domain === domain)) return;

    setLoading(l => ({ ...l, [domain]: true }));
    const info = await fetchDomainInfo(domain);

    const entry = { domain, ...info, addedAt: new Date().toISOString() };
    const updated = [...watchlist, entry];
    setWatchlist(updated);
    saveWatchlist(updated);
    setInput('');
    setLoading(l => { const n = { ...l }; delete n[domain]; return n; });
  }, [input, watchlist]);

  const removeDomain = useCallback((domain) => {
    const updated = watchlist.filter(d => d.domain !== domain);
    setWatchlist(updated);
    saveWatchlist(updated);
  }, [watchlist]);

  const refreshDomain = useCallback(async (domain) => {
    setLoading(l => ({ ...l, [domain]: true }));
    const info = await fetchDomainInfo(domain);
    const updated = watchlist.map(d => d.domain === domain ? { ...d, ...info } : d);
    setWatchlist(updated);
    saveWatchlist(updated);
    setLoading(l => { const n = { ...l }; delete n[domain]; return n; });
  }, [watchlist]);

  const refreshAll = useCallback(async () => {
    setRefreshingAll(true);
    const updated = [...watchlist];
    for (let i = 0; i < updated.length; i++) {
      setLoading(l => ({ ...l, [updated[i].domain]: true }));
      const info = await fetchDomainInfo(updated[i].domain);
      updated[i] = { ...updated[i], ...info };
      setWatchlist([...updated]);
      saveWatchlist([...updated]);
      setLoading(l => { const n = { ...l }; delete n[updated[i].domain]; return n; });
      // Small delay to avoid rate limiting
      if (i < updated.length - 1) await new Promise(r => setTimeout(r, 500));
    }
    setRefreshingAll(false);
  }, [watchlist]);

  const exportCSV = useCallback(() => {
    const header = 'Domain,Expiration,Days Left,Status,Registrar,Active,Added\n';
    const rows = watchlist.map(d => {
      const days = daysUntil(d.expiration);
      const status = statusBadge(days);
      return `${d.domain},${d.expiration ? new Date(d.expiration).toLocaleDateString() : 'N/A'},${days !== null ? days : 'N/A'},${status.label},${d.registrar || 'Unknown'},${d.isActive ? 'Yes' : 'No'},${new Date(d.addedAt).toLocaleDateString()}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domain-watchlist.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [watchlist]);

  // Sort & filter
  const filtered = watchlist.filter(d => {
    if (filterStatus === 'all') return true;
    const days = daysUntil(d.expiration);
    const status = statusBadge(days);
    return status.label.toLowerCase() === filterStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'expiration') {
      if (!a.expiration && !b.expiration) return 0;
      if (!a.expiration) return 1;
      if (!b.expiration) return -1;
      return new Date(a.expiration) - new Date(b.expiration);
    }
    if (sortBy === 'domain') return a.domain.localeCompare(b.domain);
    if (sortBy === 'added') return new Date(b.addedAt) - new Date(a.addedAt);
    return 0;
  });

  // Summary stats
  const stats = {
    total: watchlist.length,
    expiringSoon: watchlist.filter(d => { const days = daysUntil(d.expiration); return days !== null && days >= 0 && days <= 30; }).length,
    expired: watchlist.filter(d => { const days = daysUntil(d.expiration); return days !== null && days < 0; }).length,
    active: watchlist.filter(d => d.isActive).length,
  };

  if (!mounted) return null;

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Add domain input */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addDomain()}
          placeholder="Enter domain to watch (e.g., example.com)"
          style={inputStyle}
        />
        <button
          onClick={addDomain}
          disabled={loading[cleanDomain(input)]}
          style={{ ...buttonStyle, opacity: loading[cleanDomain(input)] ? 0.6 : 1 }}
        >
          {loading[cleanDomain(input)] ? '⏳ Adding...' : '👁️ Add to Watchlist'}
        </button>
      </div>

      {/* Stats bar */}
      {watchlist.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <div style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6' }}>{stats.total}</div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Tracked</div>
          </div>
          <div style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e' }}>{stats.active}</div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Active</div>
          </div>
          <div style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{stats.expiringSoon}</div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Expiring Soon</div>
          </div>
          <div style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{stats.expired}</div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Expired</div>
          </div>
        </div>
      )}

      {/* Controls */}
      {watchlist.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ ...inputStyle, flex: 'none', width: 'auto', cursor: 'pointer' }}
          >
            <option value="expiration">Sort by Expiration</option>
            <option value="domain">Sort by Domain</option>
            <option value="added">Sort by Date Added</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ ...inputStyle, flex: 'none', width: 'auto', cursor: 'pointer' }}
          >
            <option value="all">All Status</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="upcoming">Upcoming</option>
            <option value="ok">OK</option>
            <option value="expired">Expired</option>
          </select>
          <div style={{ flex: 1 }} />
          <button
            onClick={refreshAll}
            disabled={refreshingAll}
            style={{ ...buttonStyle, background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', fontSize: '0.9rem', padding: '10px 18px' }}
          >
            {refreshingAll ? '⏳ Refreshing...' : '🔄 Refresh All'}
          </button>
          <button
            onClick={exportCSV}
            style={{ ...buttonStyle, background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: '0.9rem', padding: '10px 18px' }}
          >
            📥 Export CSV
          </button>
        </div>
      )}

      {/* Domain list */}
      {sorted.length === 0 && watchlist.length === 0 && (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👁️</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Your Watchlist Is Empty</h3>
          <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>
            Add domains to track their expiration dates, registration status, and DNS health.
            All data is stored locally in your browser — no account needed.
          </p>
        </div>
      )}

      {sorted.map(entry => {
        const days = daysUntil(entry.expiration);
        const status = statusBadge(days);
        const isLoading = loading[entry.domain];

        return (
          <div key={entry.domain} style={{ ...cardStyle, opacity: isLoading ? 0.7 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{entry.domain}</h3>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: status.color,
                    background: status.bg,
                  }}>
                    {status.label}
                  </span>
                  {entry.isActive && (
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,0.1)' }}>
                      🟢 Active
                    </span>
                  )}
                  {!entry.isActive && (
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                      🔴 Inactive
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '0.85rem', color: '#9ca3af' }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>Expires: </span>
                    <span style={{ color: days !== null && days <= 30 ? status.color : '#ccc' }}>
                      {entry.expiration ? `${new Date(entry.expiration).toLocaleDateString()} (${days}d)` : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Registered: </span>
                    <span style={{ color: '#ccc' }}>
                      {entry.registration ? new Date(entry.registration).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Registrar: </span>
                    <span style={{ color: '#ccc' }}>{entry.registrar || 'Unknown'}</span>
                  </div>
                  {entry.nameservers && entry.nameservers.length > 0 && (
                    <div>
                      <span style={{ color: '#6b7280' }}>NS: </span>
                      <span style={{ color: '#ccc' }}>{entry.nameservers.join(', ')}</span>
                    </div>
                  )}
                  <div>
                    <span style={{ color: '#6b7280' }}>Last checked: </span>
                    <span style={{ color: '#ccc' }}>
                      {entry.lastChecked ? new Date(entry.lastChecked).toLocaleString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => refreshDomain(entry.domain)}
                  disabled={isLoading}
                  title="Refresh"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px', padding: '8px 12px', color: '#8b5cf6', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  {isLoading ? '⏳' : '🔄'}
                </button>
                <button
                  onClick={() => removeDomain(entry.domain)}
                  title="Remove"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '8px 12px', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {sorted.length === 0 && watchlist.length > 0 && (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '32px' }}>
          <p style={{ color: '#9ca3af' }}>No domains match the current filter.</p>
        </div>
      )}
    </div>
  );
}
