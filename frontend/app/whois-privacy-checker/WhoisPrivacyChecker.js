'use client';

import { useState } from 'react';

export default function WhoisPrivacyChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const cleanDomain = (input) => {
    return input.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  };

  const PRIVACY_INDICATORS = [
    'privacy', 'proxy', 'guard', 'protect', 'whoisguard', 'contactprivacy',
    'domainsbyproxy', 'perfectprivacy', 'withheld', 'redacted', 'not disclosed',
    'identity protection', 'id protect', 'private', 'data protected',
    'statutorymask', 'gdpr', 'contact information redacted',
    'registration private', 'domains by proxy', 'whoisprivacy',
    'privacyguardian', 'super privacy', 'identity shield',
  ];

  const KNOWN_PRIVACY_ORGS = [
    { pattern: /domainsbyproxy|domains by proxy/i, name: 'Domains By Proxy (GoDaddy)', icon: '🟢' },
    { pattern: /whoisguard/i, name: 'WhoisGuard (Namecheap)', icon: '🧡' },
    { pattern: /contactprivacy/i, name: 'Contact Privacy Inc. (Tucows)', icon: '🔵' },
    { pattern: /perfectprivacy/i, name: 'Perfect Privacy LLC', icon: '🟣' },
    { pattern: /privacyguardian/i, name: 'PrivacyGuardian.org', icon: '🛡️' },
    { pattern: /withheldforprivacy/i, name: 'Withheld for Privacy (Namecheap)', icon: '🧡' },
    { pattern: /identity protect/i, name: 'ID Protection Service', icon: '🔒' },
    { pattern: /redacted for privacy/i, name: 'RDAP Privacy Redaction', icon: '📋' },
    { pattern: /super privacy/i, name: 'Super Privacy Service', icon: '🛡️' },
    { pattern: /gdpr/i, name: 'GDPR Redaction', icon: '🇪🇺' },
  ];

  const checkPrivacy = async () => {
    const clean = cleanDomain(domain);
    if (!clean || !clean.includes('.')) {
      setError('Please enter a valid domain name (e.g., example.com)');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Fetch RDAP data
      const rdapRes = await fetch(`https://rdap.org/domain/${encodeURIComponent(clean)}`);
      if (!rdapRes.ok) {
        if (rdapRes.status === 404) {
          setError(`Domain "${clean}" not found in RDAP. It may not be registered or the TLD does not support RDAP.`);
        } else {
          setError(`RDAP query failed (HTTP ${rdapRes.status}). Try again in a moment.`);
        }
        setLoading(false);
        return;
      }

      const rdapData = await rdapRes.json();

      // Analyze entities for privacy
      const entities = rdapData.entities || [];
      const allText = JSON.stringify(rdapData).toLowerCase();
      
      // Check for privacy indicators
      const foundIndicators = PRIVACY_INDICATORS.filter(ind => allText.includes(ind.toLowerCase()));
      
      // Check for known privacy services
      let privacyService = null;
      for (const org of KNOWN_PRIVACY_ORGS) {
        if (org.pattern.test(allText)) {
          privacyService = org;
          break;
        }
      }

      // Analyze contact exposure
      const contacts = [];
      const analyzeEntity = (entity, role) => {
        const vcardArray = entity.vcardArray;
        if (!vcardArray || !vcardArray[1]) return;
        
        const vcard = vcardArray[1];
        const contact = { role: role || (entity.roles || []).join(', '), fields: {} };
        
        for (const field of vcard) {
          const [type, , , value] = field;
          if (type === 'fn') contact.fields.name = value;
          if (type === 'org') contact.fields.organization = Array.isArray(value) ? value[0] : value;
          if (type === 'email') contact.fields.email = value;
          if (type === 'tel') contact.fields.phone = value;
          if (type === 'adr') {
            const addr = Array.isArray(value) ? value.filter(v => v && v.trim()).join(', ') : value;
            if (addr && addr.trim()) contact.fields.address = addr;
          }
        }
        
        if (Object.keys(contact.fields).length > 0) {
          contacts.push(contact);
        }
      };

      entities.forEach(e => {
        const roles = e.roles || [];
        roles.forEach(r => analyzeEntity(e, r));
        if (e.entities) {
          e.entities.forEach(sub => {
            const subRoles = sub.roles || [];
            subRoles.forEach(r => analyzeEntity(sub, r));
          });
        }
      });

      // Determine privacy status
      const hasPrivacy = foundIndicators.length > 0 || privacyService !== null;
      
      // Check what's exposed
      const exposedFields = [];
      const redactedFields = [];
      contacts.forEach(c => {
        Object.entries(c.fields).forEach(([key, value]) => {
          const valStr = String(value).toLowerCase();
          const isRedacted = PRIVACY_INDICATORS.some(ind => valStr.includes(ind)) 
            || valStr === '' 
            || valStr.includes('redacted')
            || valStr.includes('not applicable')
            || valStr.includes('data redacted');
          
          if (isRedacted) {
            redactedFields.push({ field: key, role: c.role, value });
          } else {
            exposedFields.push({ field: key, role: c.role, value });
          }
        });
      });

      // Calculate privacy score
      let score = 50; // base
      if (hasPrivacy) score += 25;
      if (privacyService) score += 10;
      if (exposedFields.length === 0) score += 15;
      if (redactedFields.length > 3) score += 5;
      // Penalize for exposed personal info
      const sensitiveExposed = exposedFields.filter(f => 
        ['email', 'phone', 'address'].includes(f.field) && 
        !PRIVACY_INDICATORS.some(ind => String(f.value).toLowerCase().includes(ind))
      );
      score -= sensitiveExposed.length * 15;
      score = Math.max(0, Math.min(100, score));

      // Get registrar info
      let registrar = 'Unknown';
      entities.forEach(e => {
        if (e.roles && e.roles.includes('registrar')) {
          if (e.vcardArray && e.vcardArray[1]) {
            const fn = e.vcardArray[1].find(f => f[0] === 'fn');
            if (fn) registrar = fn[3];
          }
        }
      });

      // Get domain status
      const statuses = (rdapData.status || []).map(s => s.toLowerCase());

      // Registration dates
      const events = rdapData.events || [];
      const regDate = events.find(e => e.eventAction === 'registration')?.eventDate;
      const expDate = events.find(e => e.eventAction === 'expiration')?.eventDate;
      const updateDate = events.find(e => e.eventAction === 'last changed')?.eventDate;

      setResults({
        domain: clean,
        hasPrivacy,
        privacyService,
        score,
        foundIndicators,
        contacts,
        exposedFields,
        redactedFields,
        sensitiveExposed,
        registrar,
        statuses,
        regDate,
        expDate,
        updateDate,
      });
    } catch (err) {
      setError(err.message || 'Lookup failed. Please try again.');
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkPrivacy();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Well Protected';
    if (score >= 50) return 'Partially Protected';
    return 'Exposed';
  };

  const formatDate = (iso) => {
    if (!iso) return null;
    try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return iso; }
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain (e.g., example.com)"
          style={{
            flex: 1, minWidth: '250px', padding: '14px 16px', fontSize: '1rem',
            background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px',
            color: '#fff', outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
          onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
        />
        <button
          type="submit"
          disabled={loading || !domain.trim()}
          style={{
            padding: '14px 28px', fontSize: '1rem', fontWeight: 600,
            background: loading ? '#4c1d95' : '#8b5cf6', color: '#fff',
            border: 'none', borderRadius: '10px', cursor: loading ? 'wait' : 'pointer',
            transition: 'background 0.2s', opacity: !domain.trim() ? 0.5 : 1,
          }}
        >
          {loading ? 'Checking…' : 'Check Privacy'}
        </button>
      </form>

      {error && (
        <div style={{
          padding: '14px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '10px', color: '#f87171', fontSize: '0.9rem', marginBottom: '20px',
        }}>
          {error}
        </div>
      )}

      {results && (
        <div>
          {/* Privacy Score Card */}
          <div style={{
            background: '#111', border: `1px solid ${getScoreColor(results.score)}40`,
            borderRadius: '16px', padding: '28px', marginBottom: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>WHOIS Privacy Score</div>
            <div style={{
              fontSize: '4rem', fontWeight: 800, color: getScoreColor(results.score),
              lineHeight: 1, marginBottom: '8px',
            }}>
              {results.score}
            </div>
            <div style={{
              display: 'inline-block', padding: '4px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
              background: `${getScoreColor(results.score)}20`, color: getScoreColor(results.score),
              border: `1px solid ${getScoreColor(results.score)}40`,
            }}>
              {results.hasPrivacy ? '🔒' : '⚠️'} {getScoreLabel(results.score)}
            </div>
            <div style={{ fontSize: '1.1rem', color: '#ccc', marginTop: '12px', fontWeight: 600 }}>{results.domain}</div>
          </div>

          {/* Summary Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase' }}>Privacy Service</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: results.hasPrivacy ? '#22c55e' : '#ef4444' }}>
                {results.privacyService ? `${results.privacyService.icon} ${results.privacyService.name}` : results.hasPrivacy ? '🔒 Active (Generic)' : '❌ Not Detected'}
              </div>
            </div>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase' }}>Registrar</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ccc' }}>{results.registrar}</div>
            </div>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', textTransform: 'uppercase' }}>Exposed Fields</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: results.sensitiveExposed.length > 0 ? '#ef4444' : '#22c55e' }}>
                {results.sensitiveExposed.length > 0 ? `⚠️ ${results.sensitiveExposed.length} sensitive field${results.sensitiveExposed.length > 1 ? 's' : ''}` : '✅ None detected'}
              </div>
            </div>
          </div>

          {/* Exposed Fields Warning */}
          {results.sensitiveExposed.length > 0 && (
            <div style={{
              background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '12px', padding: '20px', marginBottom: '16px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444', marginBottom: '12px' }}>
                ⚠️ Exposed Personal Information
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '12px' }}>
                The following sensitive fields are publicly visible in WHOIS records. Consider enabling domain privacy protection through your registrar.
              </p>
              <div style={{ display: 'grid', gap: '8px' }}>
                {results.sensitiveExposed.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    background: '#111', borderRadius: '8px', padding: '10px 14px', border: '1px solid #1e1e1e',
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: 600, minWidth: '80px' }}>{f.field}</span>
                    <span style={{ fontSize: '0.7rem', color: '#666', minWidth: '60px' }}>({f.role})</span>
                    <span style={{ fontSize: '0.85rem', color: '#f87171', fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' }}>{String(f.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Redacted Fields */}
          {results.redactedFields.length > 0 && (
            <div style={{
              background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '12px', padding: '20px', marginBottom: '16px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#22c55e', marginBottom: '12px' }}>
                ✅ Protected / Redacted Fields ({results.redactedFields.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {results.redactedFields.map((f, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem',
                    background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e30',
                  }}>
                    🔒 {f.field} ({f.role})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Indicators Found */}
          {results.foundIndicators.length > 0 && (
            <div style={{
              background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '16px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '12px' }}>
                Privacy Indicators Detected
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {results.foundIndicators.map((ind, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem',
                    background: '#8b5cf615', color: '#a78bfa', border: '1px solid #8b5cf630',
                    fontFamily: 'ui-monospace, monospace',
                  }}>
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Domain Status */}
          {results.statuses.length > 0 && (
            <div style={{
              background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', marginBottom: '16px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Domain Status Codes</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {results.statuses.map((s, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem',
                    background: s.includes('lock') ? '#22c55e15' : '#f59e0b15',
                    color: s.includes('lock') ? '#22c55e' : '#f59e0b',
                    border: `1px solid ${s.includes('lock') ? '#22c55e30' : '#f59e0b30'}`,
                    fontFamily: 'ui-monospace, monospace',
                  }}>
                    {s.includes('lock') ? '🔒' : '📋'} {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Registration Timeline */}
          {(results.regDate || results.expDate) && (
            <div style={{
              background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Registration Timeline</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {[
                  { label: 'Registered', value: formatDate(results.regDate), icon: '📅' },
                  { label: 'Last Updated', value: formatDate(results.updateDate), icon: '🔄' },
                  { label: 'Expires', value: formatDate(results.expDate), icon: '⏰' },
                ].filter(x => x.value).map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.icon} {item.label}</div>
                    <div style={{ fontSize: '0.9rem', color: '#ccc', fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
