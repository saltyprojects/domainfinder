'use client';

import { useState, useCallback } from 'react';

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

function formatDuration(seconds) {
  if (seconds >= 86400) {
    const days = Math.floor(seconds / 86400);
    const hrs = Math.floor((seconds % 86400) / 3600);
    return hrs > 0 ? `${days}d ${hrs}h` : `${days}d`;
  }
  if (seconds >= 3600) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  if (seconds >= 60) return `${Math.floor(seconds / 60)}m`;
  return `${seconds}s`;
}

function parseSOA(data) {
  // SOA format: "mname rname serial refresh retry expire minimum"
  const parts = data.split(/\s+/);
  if (parts.length < 7) return null;
  return {
    mname: parts[0].replace(/\.$/, ''),
    rname: parts[1].replace(/\.$/, ''),
    serial: parseInt(parts[2], 10),
    refresh: parseInt(parts[3], 10),
    retry: parseInt(parts[4], 10),
    expire: parseInt(parts[5], 10),
    minimum: parseInt(parts[6], 10),
  };
}

function parseSerialDate(serial) {
  const str = String(serial);
  if (str.length === 10 && str.startsWith('20')) {
    const year = str.slice(0, 4);
    const month = str.slice(4, 6);
    const day = str.slice(6, 8);
    const seq = str.slice(8, 10);
    const date = new Date(`${year}-${month}-${day}`);
    if (!isNaN(date.getTime())) {
      return { date: `${year}-${month}-${day}`, sequence: parseInt(seq, 10), formatted: `${year}-${month}-${day} (revision #${parseInt(seq, 10)})` };
    }
  }
  return null;
}

function rnameToEmail(rname) {
  // First dot becomes @, rest stay as dots
  const idx = rname.indexOf('.');
  if (idx === -1) return rname;
  return rname.slice(0, idx) + '@' + rname.slice(idx + 1);
}

function gradeSOA(soa) {
  const issues = [];
  const good = [];

  // Refresh: RFC recommends 1200-43200 seconds (20min to 12h)
  if (soa.refresh < 1200) issues.push({ field: 'refresh', msg: 'Refresh is very low (< 20 min). Secondary servers will poll too aggressively.' });
  else if (soa.refresh > 86400) issues.push({ field: 'refresh', msg: 'Refresh is very high (> 24h). DNS changes will propagate slowly.' });
  else good.push({ field: 'refresh', msg: `Refresh interval (${formatDuration(soa.refresh)}) is within recommended range.` });

  // Retry: should be less than refresh
  if (soa.retry >= soa.refresh) issues.push({ field: 'retry', msg: 'Retry should be less than refresh interval.' });
  else if (soa.retry < 120) issues.push({ field: 'retry', msg: 'Retry is very low (< 2 min). May cause excessive retries on failure.' });
  else good.push({ field: 'retry', msg: `Retry interval (${formatDuration(soa.retry)}) is reasonable.` });

  // Expire: RFC 1912 recommends 2-4 weeks
  if (soa.expire < 604800) issues.push({ field: 'expire', msg: 'Expire is less than 1 week. Secondary servers may stop serving too quickly.' });
  else if (soa.expire > 4838400) issues.push({ field: 'expire', msg: 'Expire is over 8 weeks. Stale data may persist too long.' });
  else good.push({ field: 'expire', msg: `Expire time (${formatDuration(soa.expire)}) is within recommended range.` });

  // Minimum TTL (negative caching): RFC 2308 recommends 1-3 hours
  if (soa.minimum < 300) issues.push({ field: 'minimum', msg: 'Negative cache TTL is very low (< 5 min). NXDOMAIN responses won\'t be cached.' });
  else if (soa.minimum > 86400) issues.push({ field: 'minimum', msg: 'Negative cache TTL is over 24h. Failed lookups will be cached too long.' });
  else good.push({ field: 'minimum', msg: `Negative cache TTL (${formatDuration(soa.minimum)}) is within recommended range.` });

  // Serial format
  const serialDate = parseSerialDate(soa.serial);
  if (serialDate) {
    good.push({ field: 'serial', msg: `Serial uses YYYYMMDDNN date format (${serialDate.formatted}).` });
  } else {
    issues.push({ field: 'serial', msg: 'Serial doesn\'t follow YYYYMMDDNN convention. Consider using date-based serials.' });
  }

  const score = Math.max(0, 100 - issues.length * 20);
  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';
  return { score, grade, issues, good };
}

const FIELD_DESCRIPTIONS = {
  mname: { label: 'Primary Nameserver (MNAME)', icon: '🖥️', desc: 'The authoritative nameserver that holds the master zone file.' },
  rname: { label: 'Admin Email (RNAME)', icon: '📧', desc: 'Email address of the zone administrator (first dot = @).' },
  serial: { label: 'Serial Number', icon: '🔢', desc: 'Zone version number. Incremented on each change so secondaries know to update.' },
  refresh: { label: 'Refresh Interval', icon: '🔄', desc: 'How often secondary nameservers check for zone updates.' },
  retry: { label: 'Retry Interval', icon: '⏱️', desc: 'Time a secondary waits before retrying after a failed refresh.' },
  expire: { label: 'Expire Time', icon: '⏳', desc: 'Time after which secondary servers stop responding if the primary is unreachable.' },
  minimum: { label: 'Minimum TTL (Negative Caching)', icon: '🕐', desc: 'TTL for negative responses (NXDOMAIN). Defines how long "domain not found" is cached.' },
};

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '16px',
};

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '1rem',
  padding: '14px 16px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const btnStyle = {
  background: '#8b5cf6',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '14px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  whiteSpace: 'nowrap',
};

export default function SoaCheckerTool() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const checkSOA = useCallback(async () => {
    const d = cleanDomain(domain);
    if (!d) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const url = `https://dns.google/resolve?name=${encodeURIComponent(d)}&type=SOA`;
      const res = await fetch(url, { headers: { Accept: 'application/dns-json' } });
      if (!res.ok) throw new Error(`DNS query failed (HTTP ${res.status})`);
      const data = await res.json();

      if (data.Status === 3) {
        throw new Error(`Domain "${d}" does not exist (NXDOMAIN).`);
      }

      // SOA can be in Answer or Authority section
      const soaRecords = [...(data.Answer || []), ...(data.Authority || [])].filter(r => r.type === 6);

      if (soaRecords.length === 0) {
        throw new Error(`No SOA record found for "${d}". This domain may not have a zone configured.`);
      }

      const record = soaRecords[0];
      const soa = parseSOA(record.data);
      if (!soa) throw new Error('Failed to parse SOA record data.');

      const grade = gradeSOA(soa);
      const serialDate = parseSerialDate(soa.serial);

      // Also fetch NS records for context
      let nsRecords = [];
      try {
        const nsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(d)}&type=NS`, { headers: { Accept: 'application/dns-json' } });
        if (nsRes.ok) {
          const nsData = await nsRes.json();
          nsRecords = (nsData.Answer || []).filter(r => r.type === 2).map(r => r.data.replace(/\.$/, ''));
        }
      } catch (_) { /* ignore NS lookup failure */ }

      setResults({
        domain: d,
        soa,
        ttl: record.TTL,
        raw: record.data,
        grade,
        serialDate,
        nsRecords,
        adminEmail: rnameToEmail(soa.rname),
        zoneName: record.name?.replace(/\.$/, '') || d,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [domain]);

  const gradeColor = results?.grade?.grade === 'A' ? '#22c55e' : results?.grade?.grade === 'B' ? '#84cc16' : results?.grade?.grade === 'C' ? '#f59e0b' : '#ef4444';

  return (
    <div>
      {/* Input */}
      <div style={{ ...cardStyle, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Enter domain name (e.g. google.com)"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && checkSOA()}
            style={inputStyle}
          />
        </div>
        <button onClick={checkSOA} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Checking…' : 'Check SOA Record'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ ...cardStyle, borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
          <p style={{ color: '#f87171', margin: 0 }}>❌ {error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Grade Card */}
          <div style={{ ...cardStyle, borderColor: gradeColor, background: `${gradeColor}08` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '16px',
                background: `${gradeColor}20`, border: `2px solid ${gradeColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 800, color: gradeColor,
              }}>
                {results.grade.grade}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                  SOA Record for {results.domain}
                </h3>
                <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                  Zone: {results.zoneName} · TTL: {results.ttl}s ({formatDuration(results.ttl)}) · Score: {results.grade.score}/100
                </p>
                {results.nsRecords.length > 0 && (
                  <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.8rem' }}>
                    Nameservers: {results.nsRecords.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SOA Fields */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', marginTop: '32px' }}>
            📋 SOA Record Fields
          </h3>

          {Object.entries(FIELD_DESCRIPTIONS).map(([key, meta]) => {
            const value = results.soa[key];
            const isTimer = ['refresh', 'retry', 'expire', 'minimum'].includes(key);
            const displayValue = key === 'rname' ? results.adminEmail : isTimer ? `${value.toLocaleString()} seconds (${formatDuration(value)})` : key === 'serial' ? (results.serialDate ? `${value} — ${results.serialDate.formatted}` : String(value)) : String(value);

            return (
              <div key={key} style={{
                ...cardStyle,
                display: 'flex', gap: '16px', alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '1.5rem', marginTop: '2px' }}>{meta.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{meta.label}</span>
                    <span style={{
                      background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem',
                      fontFamily: 'ui-monospace, monospace', fontWeight: 600,
                    }}>{key}</span>
                  </div>
                  <p style={{
                    margin: '0 0 6px', fontFamily: 'ui-monospace, monospace',
                    fontSize: '0.95rem', color: '#e5e7eb', wordBreak: 'break-all',
                  }}>
                    {displayValue}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                    {meta.desc}
                  </p>
                  {isTimer && (
                    <div style={{
                      marginTop: '8px', background: 'rgba(255,255,255,0.03)',
                      borderRadius: '6px', height: '6px', overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', borderRadius: '6px',
                        background: key === 'refresh' ? '#8b5cf6' : key === 'retry' ? '#3b82f6' : key === 'expire' ? '#f59e0b' : '#22c55e',
                        width: `${Math.min(100, (value / (key === 'expire' ? 2419200 : key === 'refresh' ? 86400 : key === 'retry' ? 7200 : 86400)) * 100)}%`,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Analysis */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', marginTop: '32px' }}>
            🔍 Configuration Analysis
          </h3>

          {results.grade.good.map((item, i) => (
            <div key={`good-${i}`} style={{
              ...cardStyle,
              borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)',
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 20px',
            }}>
              <span style={{ fontSize: '1.1rem' }}>✅</span>
              <span style={{ color: '#d1d5db', fontSize: '0.9rem' }}>{item.msg}</span>
            </div>
          ))}

          {results.grade.issues.map((item, i) => (
            <div key={`issue-${i}`} style={{
              ...cardStyle,
              borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)',
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 20px',
            }}>
              <span style={{ fontSize: '1.1rem' }}>⚠️</span>
              <span style={{ color: '#d1d5db', fontSize: '0.9rem' }}>{item.msg}</span>
            </div>
          ))}

          {/* Raw Record */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', marginTop: '32px' }}>
            📝 Raw SOA Record
          </h3>
          <div style={{
            ...cardStyle, fontFamily: 'ui-monospace, monospace',
            fontSize: '0.85rem', color: '#a78bfa', lineHeight: 1.8,
            overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>
            <span style={{ color: '#6b7280' }}>; SOA Record for {results.domain}</span>{'\n'}
            {results.zoneName}. IN SOA {results.raw}
          </div>
        </>
      )}
    </div>
  );
}
