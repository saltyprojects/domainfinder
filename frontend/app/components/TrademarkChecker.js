'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function TrademarkRiskBadge({ risk }) {
  if (!risk) return null;

  const { risk_level, risk_color, risk_icon, message, total_conflicts } = risk;
  
  if (risk_level === 'LOW') return null; // Don't show anything for low risk

  return (
    <div style={{
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '4px',
      padding: '2px 6px', 
      background: `${risk_color}15`, 
      borderRadius: '12px', 
      fontSize: '0.7rem', 
      color: risk_color,
      border: `1px solid ${risk_color}30`,
    }}>
      {risk_icon} TM Risk
      {total_conflicts > 0 && (
        <span style={{ fontWeight: 600 }}>({total_conflicts})</span>
      )}
    </div>
  );
}

export function TrademarkChecker({ domainName, inline = true }) {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!domainName || domainName.length < 2) {
      setRisk(null);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();

    fetch(`${API_BASE}/api/trademark/?q=${encodeURIComponent(domainName)}`, {
      signal: controller.signal
    })
      .then(res => {
        if (!res.ok) throw new Error('Trademark check failed');
        return res.json();
      })
      .then(data => {
        setRisk(data.risk_assessment);
        setLoading(false);
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setError('Failed to check trademarks');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [domainName]);

  if (loading) {
    return inline ? (
      <div style={{
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px',
        padding: '2px 6px', 
        background: '#f3f4f6', 
        borderRadius: '12px', 
        fontSize: '0.7rem', 
        color: '#6b7280',
        border: '1px solid #d1d5db',
      }}>
        🔍 TM...
      </div>
    ) : (
      <div>Checking trademarks...</div>
    );
  }

  if (error) {
    return inline ? (
      <div style={{
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px',
        padding: '2px 6px', 
        background: '#f3f4f6', 
        borderRadius: '12px', 
        fontSize: '0.7rem', 
        color: '#6b7280',
        border: '1px solid #d1d5db',
      }}>
        ❓ TM Error
      </div>
    ) : (
      <div>Unable to check trademarks</div>
    );
  }

  if (inline) {
    return <TrademarkRiskBadge risk={risk} />;
  }

  // Full component view (for dedicated trademark page)
  if (!risk) return null;

  return (
    <div style={{ 
      padding: '16px', 
      border: `2px solid ${risk.risk_color}30`,
      borderRadius: 'var(--radius)',
      background: `${risk.risk_color}05`,
      margin: '16px 0'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '1.2rem' }}>{risk.risk_icon}</span>
        <div>
          <div style={{ 
            fontWeight: 600, 
            color: risk.risk_color,
            fontSize: '0.9rem'
          }}>
            {risk.risk_level} TRADEMARK RISK
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {risk.message}
          </div>
        </div>
      </div>
      
      {risk.needs_review && (
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-dim)',
          marginTop: '8px',
          padding: '8px',
          background: 'var(--surface)',
          borderRadius: '4px'
        }}>
          ⚖️ <strong>Legal Notice:</strong> This is a basic search only. 
          Consult a trademark attorney for comprehensive analysis before using this name commercially.
        </div>
      )}
    </div>
  );
}

export default TrademarkChecker;