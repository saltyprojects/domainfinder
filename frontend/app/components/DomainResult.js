'use client';

import { useState } from 'react';
import { SEOAnalytics } from './SEOAnalytics';

const AFFILIATE_URL = 'https://www.anrdoezrs.net/click-101695072-12589558';
function buildAffiliateUrl(domain) { return `${AFFILIATE_URL}?url=${encodeURIComponent('https://www.dynadot.com/domain/search?q=' + domain)}`; }

function IntelChips({ intel, available }) {
  if (!intel) return null;

  const { social, whois } = intel;
  const chips = [];

  // For available domains, show social handle availability
  if (available && social) {
    const availableSocials = social.filter(s => s.available === true);
    const takenSocials = social.filter(s => s.available === false);
    
    if (availableSocials.length > 0) {
      chips.push(
        <div key="social-available" style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '2px 6px', background: 'rgba(34, 197, 94, 0.1)', 
          borderRadius: '12px', fontSize: '0.7rem', color: 'var(--green)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
        }}>
          @{availableSocials.length} free
        </div>
      );
    }
    if (takenSocials.length > 0) {
      chips.push(
        <div key="social-taken" style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '2px 6px', background: 'rgba(239, 68, 68, 0.1)', 
          borderRadius: '12px', fontSize: '0.7rem', color: 'var(--red)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          @{takenSocials.length} taken
        </div>
      );
    }
  }

  // For taken domains, show WHOIS expiry info
  if (!available && whois && !whois.available) {
    if (whois.expiring_soon) {
      chips.push(
        <div key="expiring" style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '2px 6px', background: 'rgba(251, 146, 60, 0.1)', 
          borderRadius: '12px', fontSize: '0.7rem', color: '#f59e0b',
          border: '1px solid rgba(251, 146, 60, 0.2)',
        }}>
          ⏰ Expires soon
        </div>
      );
    } else if (whois.expiry_date) {
      // Calculate days until expiry
      const expiryDate = new Date(whois.expiry_date);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 7) {
        chips.push(
          <div key="expiry-critical" style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 6px', background: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: '12px', fontSize: '0.7rem', color: '#dc2626',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}>
            🚨 Expires in {daysUntilExpiry}d
          </div>
        );
      } else if (daysUntilExpiry <= 30) {
        chips.push(
          <div key="expiry-warning" style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 6px', background: 'rgba(251, 146, 60, 0.1)', 
            borderRadius: '12px', fontSize: '0.7rem', color: '#d97706',
            border: '1px solid rgba(251, 146, 60, 0.2)',
          }}>
            ⚠️ Expires in {daysUntilExpiry}d
          </div>
        );
      } else if (daysUntilExpiry <= 90) {
        chips.push(
          <div key="expiry-notice" style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 6px', background: 'rgba(254, 240, 138, 0.3)', 
            borderRadius: '12px', fontSize: '0.7rem', color: '#ca8a04',
            border: '1px solid rgba(254, 240, 138, 0.5)',
          }}>
            📅 Expires in {daysUntilExpiry}d
          </div>
        );
      } else {
        const year = whois.expiry_date.split('-')[0];
        chips.push(
          <div key="expiry" style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 6px', background: 'var(--border)', 
            borderRadius: '12px', fontSize: '0.7rem', color: 'var(--text-dim)',
            border: '1px solid var(--border)',
          }}>
            📅 Expires {year}
          </div>
        );
      }
    }
    
    if (whois.registered_date) {
      const year = whois.registered_date.split('-')[0];
      chips.push(
        <div key="registered" style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '2px 6px', background: 'var(--border)', 
          borderRadius: '12px', fontSize: '0.7rem', color: 'var(--text-dim)',
          border: '1px solid var(--border)',
        }}>
          📋 Reg. {year}
        </div>
      );
    }
  }

  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {chips}
    </div>
  );
}

export function DomainResult({ result, onCopy, copied, intel }) {
  const { full_domain, tld, available, price, currency } = result;
  const domainName = full_domain.split('.')[0];
  const [showSEO, setShowSEO] = useState(false);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px 16px',
      background: available ? 'var(--green-dim)' : 'var(--surface)',
      border: `1px solid ${available ? 'rgba(34, 197, 94, 0.15)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      transition: 'background 0.15s',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: available ? 'var(--green)' : 'var(--red)',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: '0.95rem',
            fontWeight: available ? 600 : 400,
            color: available ? 'var(--text)' : 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {full_domain}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Copy button */}
          <button
            onClick={(e) => { e.stopPropagation(); onCopy?.(); }}
            title="Copy domain"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', color: copied ? 'var(--green)' : 'var(--text-dim)',
              padding: '4px 6px', borderRadius: '4px', transition: 'color 0.15s',
            }}
          >
            {copied ? '✓' : '📋'}
          </button>

          {available ? (
            <>
              {price && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  ${price.toFixed(2)}
                </span>
              )}
              <a
                href={buildAffiliateUrl(full_domain)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 16px', background: 'var(--green)', color: '#000',
                  borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                  transition: 'opacity 0.15s', textDecoration: 'none',
                }}
              >
                Register →
              </a>
            </>
          ) : (
            <>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Taken</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSEO(!showSEO);
                }}
                style={{
                  padding: '4px 8px',
                  background: showSEO ? 'var(--green)' : 'var(--border)',
                  color: showSEO ? '#000' : 'var(--text-dim)',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="View SEO analytics"
              >
                📊 SEO
              </button>
            </>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
        <IntelChips intel={intel} available={available} />
      </div>
      
      {!available && showSEO && (
        <div style={{ marginTop: '12px' }}>
          <SEOAnalytics domain={full_domain} keyword={domainName} compact />
        </div>
      )}
    </div>
  );
}
