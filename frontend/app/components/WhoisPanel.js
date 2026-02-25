'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function WhoisPanel({ domain }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/whois/?domain=${encodeURIComponent(domain)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Lookup failed');
        return res.json();
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [domain]);

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.85rem',
  };

  const labelStyle = { color: 'var(--text-muted)', fontWeight: 500 };
  const valueStyle = { color: 'var(--text)', textAlign: 'right' };

  return (
    <div style={{
      padding: '16px 18px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderTop: 'none',
      borderRadius: '0 0 var(--radius) var(--radius)',
    }}>
      {loading && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Looking up WHOIS data...
        </p>
      )}

      {error && (
        <p style={{ color: 'var(--red)', fontSize: '0.85rem' }}>{error}</p>
      )}

      {data && data.error && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{data.error}</p>
      )}

      {data && !data.error && (
        <div>
          {data.expiring_soon && (
            <div style={{
              padding: '8px 12px',
              background: 'rgba(255, 180, 0, 0.15)',
              border: '1px solid rgba(255, 180, 0, 0.3)',
              borderRadius: '6px',
              marginBottom: '12px',
              fontSize: '0.85rem',
              color: '#ffb400',
              fontWeight: 500,
            }}>
              ⚡ This domain expires soon — snipe opportunity!
            </div>
          )}

          {data.registrar && (
            <div style={rowStyle}>
              <span style={labelStyle}>Registrar</span>
              <span style={valueStyle}>{data.registrar}</span>
            </div>
          )}
          {data.registered_date && (
            <div style={rowStyle}>
              <span style={labelStyle}>Registered</span>
              <span style={valueStyle}>{data.registered_date}</span>
            </div>
          )}
          {data.expiry_date && (
            <div style={rowStyle}>
              <span style={labelStyle}>Expires</span>
              <span style={valueStyle}>{data.expiry_date}</span>
            </div>
          )}
          {data.updated_date && (
            <div style={rowStyle}>
              <span style={labelStyle}>Last Updated</span>
              <span style={valueStyle}>{data.updated_date}</span>
            </div>
          )}
          {data.nameservers && data.nameservers.length > 0 && (
            <div style={rowStyle}>
              <span style={labelStyle}>Nameservers</span>
              <span style={{ ...valueStyle, maxWidth: '60%', wordBreak: 'break-all' }}>
                {data.nameservers.join(', ')}
              </span>
            </div>
          )}
          {data.status && data.status.length > 0 && (
            <div style={{ ...rowStyle, borderBottom: 'none' }}>
              <span style={labelStyle}>Status</span>
              <span style={{ ...valueStyle, maxWidth: '60%' }}>
                {data.status.map(s => s.replace(/\s*https?:\/\/.*/, '')).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
