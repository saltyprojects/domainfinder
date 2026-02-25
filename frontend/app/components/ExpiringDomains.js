'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function ExpiryBadge({ urgency, daysUntilExpiry }) {
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'EXPIRED':
        return { bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' };
      case 'CRITICAL':
        return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' };
      case 'WARNING':
        return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
      case 'NOTICE':
        return { bg: '#FEFCE8', color: '#CA8A04', border: '#FEF08A' };
      default:
        return { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' };
    }
  };

  const colors = getUrgencyColor(urgency);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 6px',
      background: colors.bg,
      borderRadius: '12px',
      fontSize: '0.7rem',
      color: colors.color,
      border: `1px solid ${colors.border}`,
      fontWeight: 500
    }}>
      {daysUntilExpiry <= 0 ? '⚠️' : daysUntilExpiry <= 7 ? '🚨' : daysUntilExpiry <= 30 ? '⚠️' : '📅'}
      {daysUntilExpiry <= 0 ? 'EXPIRED' : `${daysUntilExpiry}d`}
    </div>
  );
}

function DomainExpiryItem({ domain }) {
  const { domain: domainName, days_until_expiry, urgency, message, registrar } = domain;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      transition: 'all 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.target.style.borderColor = 'var(--green)';
      e.target.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={(e) => {
      e.target.style.borderColor = 'var(--border)';
      e.target.style.transform = 'translateY(0)';
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--text)'
          }}>
            {domainName}
          </span>
          <ExpiryBadge urgency={urgency} daysUntilExpiry={days_until_expiry} />
        </div>
        
        {registrar && (
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-dim)'
          }}>
            Registrar: {registrar}
          </div>
        )}
      </div>

      <button style={{
        padding: '6px 12px',
        background: 'var(--green)',
        color: '#000',
        border: 'none',
        borderRadius: '6px',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'opacity 0.2s'
      }}
      onMouseEnter={(e) => e.target.style.opacity = '0.8'}
      onMouseLeave={(e) => e.target.style.opacity = '1'}>
        Watch →
      </button>
    </div>
  );
}

export function ExpiringDomains({ showTitle = true, limit = 5 }) {
  const [expiringDomains, setExpiringDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchExpiringDomains = async () => {
      try {
        setLoading(true);
        
        // Fetch domains categorized by urgency
        const response = await fetch(`${API_BASE}/api/expiring-domains/by-urgency/`);
        if (!response.ok) throw new Error('Failed to fetch expiring domains');
        
        const data = await response.json();
        
        // Combine all categories and take the most urgent ones first
        const allExpiring = [
          ...data.categories.EXPIRED,
          ...data.categories.CRITICAL,
          ...data.categories.WARNING,
          ...data.categories.NOTICE
        ].slice(0, limit);
        
        setExpiringDomains(allExpiring);
        setSummary(data.summary);
        setError(null);
      } catch (err) {
        setError(err.message);
        setExpiringDomains([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringDomains();
  }, [limit]);

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)'
      }}>
        {showTitle && (
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '16px',
            color: 'var(--text)'
          }}>
            ⏰ Domains Expiring Soon
          </h3>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton" style={{
              height: '60px',
              borderRadius: 'var(--radius)'
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        {showTitle && (
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '16px',
            color: 'var(--text)'
          }}>
            ⏰ Domains Expiring Soon
          </h3>
        )}
        
        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          Unable to load expiring domains
        </div>
      </div>
    );
  }

  if (expiringDomains.length === 0) {
    return (
      <div style={{
        padding: '20px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        {showTitle && (
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '16px',
            color: 'var(--text)'
          }}>
            ⏰ Domains Expiring Soon
          </h3>
        )}
        
        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          No domains expiring soon
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)'
    }}>
      {showTitle && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--text)'
          }}>
            ⏰ Domains Expiring Soon
          </h3>
          
          {summary && (
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              fontSize: '0.8rem',
              color: 'var(--text-dim)'
            }}>
              {summary.critical > 0 && (
                <span style={{ color: '#DC2626' }}>🚨 {summary.critical} critical</span>
              )}
              {summary.warning > 0 && (
                <span style={{ color: '#D97706' }}>⚠️ {summary.warning} warning</span>
              )}
              {summary.notice > 0 && (
                <span style={{ color: '#CA8A04' }}>📅 {summary.notice} notice</span>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {expiringDomains.map((domain, index) => (
          <DomainExpiryItem key={`${domain.domain}-${index}`} domain={domain} />
        ))}
      </div>

      <div style={{
        marginTop: '16px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        paddingTop: '12px'
      }}>
        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--green)',
          fontSize: '0.9rem',
          cursor: 'pointer',
          textDecoration: 'underline',
          fontWeight: 500
        }}>
          View all expiring domains →
        </button>
      </div>
    </div>
  );
}

export default ExpiringDomains;