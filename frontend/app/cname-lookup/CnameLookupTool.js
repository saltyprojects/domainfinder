'use client';

import { useState } from 'react';

const KNOWN_SERVICES = {
  'github.io': { name: 'GitHub Pages', color: '#238636', icon: '🐙' },
  'githubusercontent.com': { name: 'GitHub Pages', color: '#238636', icon: '🐙' },
  'netlify.app': { name: 'Netlify', color: '#00c7b7', icon: '🌐' },
  'netlify.com': { name: 'Netlify', color: '#00c7b7', icon: '🌐' },
  'vercel-dns.com': { name: 'Vercel', color: '#fff', icon: '▲' },
  'vercel.app': { name: 'Vercel', color: '#fff', icon: '▲' },
  'cloudfront.net': { name: 'AWS CloudFront', color: '#ff9900', icon: '☁️' },
  'amazonaws.com': { name: 'AWS', color: '#ff9900', icon: '☁️' },
  'elasticbeanstalk.com': { name: 'AWS Elastic Beanstalk', color: '#ff9900', icon: '☁️' },
  'azurewebsites.net': { name: 'Azure App Service', color: '#0078d4', icon: '🔷' },
  'azureedge.net': { name: 'Azure CDN', color: '#0078d4', icon: '🔷' },
  'trafficmanager.net': { name: 'Azure Traffic Manager', color: '#0078d4', icon: '🔷' },
  'cloudflare.net': { name: 'Cloudflare', color: '#f38020', icon: '🔶' },
  'cdn.cloudflare.net': { name: 'Cloudflare CDN', color: '#f38020', icon: '🔶' },
  'shopify.com': { name: 'Shopify', color: '#96bf48', icon: '🛒' },
  'myshopify.com': { name: 'Shopify', color: '#96bf48', icon: '🛒' },
  'squarespace.com': { name: 'Squarespace', color: '#fff', icon: '⬛' },
  'wixdns.net': { name: 'Wix', color: '#0c6efc', icon: '🎨' },
  'wordpress.com': { name: 'WordPress.com', color: '#21759b', icon: '📝' },
  'wpengine.com': { name: 'WP Engine', color: '#0ecad4', icon: '📝' },
  'firebaseapp.com': { name: 'Firebase Hosting', color: '#ffca28', icon: '🔥' },
  'web.app': { name: 'Firebase Hosting', color: '#ffca28', icon: '🔥' },
  'fastly.net': { name: 'Fastly CDN', color: '#ff282d', icon: '⚡' },
  'edgekey.net': { name: 'Akamai', color: '#009bde', icon: '🌍' },
  'edgesuite.net': { name: 'Akamai', color: '#009bde', icon: '🌍' },
  'akamaiedge.net': { name: 'Akamai', color: '#009bde', icon: '🌍' },
  'herokudns.com': { name: 'Heroku', color: '#430098', icon: '💜' },
  'herokuapp.com': { name: 'Heroku', color: '#430098', icon: '💜' },
  'fly.dev': { name: 'Fly.io', color: '#8b5cf6', icon: '🪁' },
  'render.com': { name: 'Render', color: '#46e3b7', icon: '🟢' },
  'onrender.com': { name: 'Render', color: '#46e3b7', icon: '🟢' },
  'railway.app': { name: 'Railway', color: '#a855f7', icon: '🚂' },
  'pantheonsite.io': { name: 'Pantheon', color: '#ffdc28', icon: '🏛️' },
  'hubspot.net': { name: 'HubSpot', color: '#ff7a59', icon: '🟠' },
  'ghost.io': { name: 'Ghost', color: '#15171a', icon: '👻' },
  'webflow.io': { name: 'Webflow', color: '#4353ff', icon: '🔵' },
  'proxy-ssl.webflow.com': { name: 'Webflow', color: '#4353ff', icon: '🔵' },
  'stackpathdns.com': { name: 'StackPath CDN', color: '#00b4d8', icon: '📦' },
  'googlehosted.com': { name: 'Google', color: '#4285f4', icon: '🔍' },
  'ghs.google.com': { name: 'Google Sites', color: '#4285f4', icon: '🔍' },
};

function detectService(target) {
  const host = target.toLowerCase();
  for (const [domain, info] of Object.entries(KNOWN_SERVICES)) {
    if (host.endsWith(domain) || host.endsWith(domain + '.')) {
      return info;
    }
  }
  return null;
}

export default function CnameLookupTool() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cleanDomain = (input) => {
    let d = input.trim().toLowerCase();
    d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
    return d;
  };

  const lookupCname = async () => {
    const d = cleanDomain(domain);
    if (!d) {
      setError('Please enter a domain or subdomain');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Follow the CNAME chain
      const chain = [];
      let current = d;
      let maxDepth = 10;
      let finalA = null;

      while (maxDepth-- > 0) {
        const resp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(current)}&type=CNAME`);
        if (!resp.ok) throw new Error('DNS query failed');
        const data = await resp.json();

        if (data.Status === 3) {
          if (chain.length === 0) {
            throw new Error(`Domain "${d}" not found (NXDOMAIN)`);
          }
          break;
        }

        const cnameRecords = (data.Answer || []).filter(r => r.type === 5);
        if (cnameRecords.length === 0) break;

        for (const rec of cnameRecords) {
          const target = rec.data.replace(/\.$/, '');
          const service = detectService(target);
          chain.push({
            name: rec.name.replace(/\.$/, ''),
            target,
            ttl: rec.TTL,
            service,
          });
          current = target;
        }
      }

      // Get the final A record
      try {
        const aResp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(current)}&type=A`);
        const aData = await aResp.json();
        if (aData.Answer) {
          finalA = aData.Answer
            .filter(r => r.type === 1)
            .map(r => r.data);
        }
      } catch {}

      // Also check common subdomains if no CNAME found on root
      let subdomainResults = [];
      if (chain.length === 0 && !d.startsWith('www.') && !d.includes('.') === false) {
        const subs = ['www', 'mail', 'cdn', 'app', 'blog', 'shop', 'api', 'dev', 'staging'];
        const subChecks = await Promise.allSettled(
          subs.map(async (sub) => {
            const subDomain = `${sub}.${d}`;
            const resp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(subDomain)}&type=CNAME`);
            const data = await resp.json();
            const cnames = (data.Answer || []).filter(r => r.type === 5);
            if (cnames.length > 0) {
              const target = cnames[0].data.replace(/\.$/, '');
              return {
                subdomain: subDomain,
                target,
                ttl: cnames[0].TTL,
                service: detectService(target),
              };
            }
            return null;
          })
        );
        subdomainResults = subChecks
          .filter(r => r.status === 'fulfilled' && r.value)
          .map(r => r.value);
      }

      setResults({
        domain: d,
        chain,
        finalTarget: current,
        finalA,
        subdomainResults,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message || 'Failed to look up CNAME records');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') lookupCname();
  };

  const copyResults = () => {
    if (!results) return;
    let text = '';
    if (results.chain.length > 0) {
      text = results.chain.map(r => `${r.name} → ${r.target} (TTL: ${r.ttl}s)`).join('\n');
      if (results.finalA?.length) text += `\nResolves to: ${results.finalA.join(', ')}`;
    }
    if (results.subdomainResults.length > 0) {
      text += '\n\nSubdomain CNAMEs:\n';
      text += results.subdomainResults.map(r => `${r.subdomain} → ${r.target}`).join('\n');
    }
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter domain or subdomain (e.g., www.github.com)"
          style={{
            flex: 1, minWidth: '240px', padding: '12px 16px', fontSize: '1rem',
            background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
            color: '#fff', outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#8b5cf6')}
          onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
        />
        <button
          onClick={lookupCname}
          disabled={loading}
          style={{
            padding: '12px 24px', fontSize: '1rem', fontWeight: 600,
            background: loading ? '#4c1d95' : '#8b5cf6', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer',
            transition: 'background 0.15s', whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Looking up…' : 'Lookup CNAME'}
        </button>
      </div>

      {/* Quick examples */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>Try:</span>
        {['www.github.com', 'blog.cloudflare.com', 'shop.tesla.com', 'docs.stripe.com'].map(d => (
          <button
            key={d}
            onClick={() => { setDomain(d); }}
            style={{
              background: '#111', border: '1px solid #2a2a2a', borderRadius: '6px',
              padding: '4px 10px', fontSize: '0.75rem', color: '#8b5cf6',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          padding: '12px 16px', marginBottom: '24px', background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
          color: '#f87171', fontSize: '0.9rem',
        }}>
          ⚠ {error}
        </div>
      )}

      {results && (
        <div>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px', flexWrap: 'wrap', gap: '8px',
          }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                CNAME Results for <span style={{ color: '#8b5cf6' }}>{results.domain}</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0' }}>
                {results.chain.length} CNAME record{results.chain.length !== 1 ? 's' : ''} found · {new Date(results.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={copyResults}
              style={{
                padding: '6px 12px', fontSize: '0.8rem', background: '#111',
                border: '1px solid #2a2a2a', borderRadius: '6px', color: '#ccc',
                cursor: 'pointer',
              }}
            >
              📋 Copy
            </button>
          </div>

          {/* CNAME Chain Visualization */}
          {results.chain.length > 0 ? (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px', color: '#ccc' }}>
                🔗 CNAME Chain
              </h3>
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute', left: '11px', top: '8px',
                  bottom: results.finalA ? '8px' : '40px',
                  width: '2px', background: 'linear-gradient(180deg, #8b5cf6, #4c1d95)',
                }} />

                {/* Starting domain */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <div style={{
                    position: 'absolute', left: '-18px', top: '10px',
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: '#8b5cf6', border: '2px solid #111',
                  }} />
                  <div style={{
                    background: '#111', borderRadius: '10px', padding: '14px 18px',
                    border: '1px solid #8b5cf6', borderLeft: '3px solid #8b5cf6',
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#8b5cf6', fontWeight: 500, marginBottom: '4px' }}>
                      QUERY
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', fontFamily: 'ui-monospace, monospace' }}>
                      {results.domain}
                    </div>
                  </div>
                </div>

                {/* CNAME records */}
                {results.chain.map((record, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: '16px' }}>
                    <div style={{
                      position: 'absolute', left: '-18px', top: '10px',
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: record.service ? record.service.color : '#6b7280',
                      border: '2px solid #111',
                    }} />
                    <div style={{
                      background: '#111', borderRadius: '10px', padding: '14px 18px',
                      border: '1px solid #1e1e1e',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 500 }}>CNAME</span>
                        <span style={{ fontSize: '0.7rem', color: '#555' }}>TTL: {record.ttl}s</span>
                        {record.service && (
                          <span style={{
                            fontSize: '0.7rem', padding: '2px 8px',
                            background: `${record.service.color}15`,
                            color: record.service.color,
                            borderRadius: '4px', fontWeight: 500,
                          }}>
                            {record.service.icon} {record.service.name}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '2px' }}>
                        {record.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#8b5cf6' }}>→</span>
                        <span style={{
                          fontSize: '0.95rem', fontWeight: 500, color: '#fff',
                          fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all',
                        }}>
                          {record.target}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Final resolution */}
                {results.finalA && results.finalA.length > 0 && (
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: '-18px', top: '10px',
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: '#22c55e', border: '2px solid #111',
                    }} />
                    <div style={{
                      background: '#111', borderRadius: '10px', padding: '14px 18px',
                      border: '1px solid #1e1e1e', borderLeft: '3px solid #22c55e',
                    }}>
                      <div style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 500, marginBottom: '4px' }}>
                        RESOLVES TO (A RECORD)
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {results.finalA.map((ip, i) => (
                          <span key={i} style={{
                            fontSize: '0.95rem', fontWeight: 600, color: '#fff',
                            fontFamily: 'ui-monospace, monospace',
                            background: '#0a0a0a', padding: '4px 10px', borderRadius: '6px',
                            border: '1px solid #2a2a2a',
                          }}>
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              padding: '24px', textAlign: 'center', background: '#111',
              borderRadius: '12px', border: '1px solid #2a2a2a', color: '#eab308',
              marginBottom: '24px',
            }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>No CNAME Record Found</p>
              <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '0' }}>
                <strong style={{ color: '#fff' }}>{results.domain}</strong> does not have a CNAME record.
                It likely resolves directly via an A or AAAA record.
              </p>
              {results.finalA && results.finalA.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Direct A record: </span>
                  {results.finalA.map((ip, i) => (
                    <span key={i} style={{
                      fontSize: '0.85rem', fontWeight: 500, color: '#22c55e',
                      fontFamily: 'ui-monospace, monospace', marginLeft: '4px',
                    }}>
                      {ip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subdomain CNAME scan */}
          {results.subdomainResults.length > 0 && (
            <div style={{
              background: '#111', borderRadius: '12px', padding: '20px',
              border: '1px solid #1e1e1e', marginBottom: '24px',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
                🔍 CNAME Records Found on Subdomains
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {results.subdomainResults.map((sub, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: '#0a0a0a', borderRadius: '8px', padding: '12px 16px',
                    border: '1px solid #1a1a1a', flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <span style={{
                        fontSize: '0.85rem', color: '#8b5cf6',
                        fontFamily: 'ui-monospace, monospace', fontWeight: 500,
                      }}>
                        {sub.subdomain}
                      </span>
                    </div>
                    <span style={{ color: '#555' }}>→</span>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <span style={{
                        fontSize: '0.85rem', color: '#fff',
                        fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all',
                      }}>
                        {sub.target}
                      </span>
                    </div>
                    {sub.service && (
                      <span style={{
                        fontSize: '0.7rem', padding: '2px 8px',
                        background: `${sub.service.color}15`,
                        color: sub.service.color,
                        borderRadius: '4px', fontWeight: 500,
                      }}>
                        {sub.service.icon} {sub.service.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Detection Summary */}
          {results.chain.some(r => r.service) && (
            <div style={{
              background: '#111', borderRadius: '12px', padding: '20px',
              border: '1px solid #1e1e1e',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>🏢 Detected Service</h3>
              {(() => {
                const service = results.chain.find(r => r.service)?.service;
                return service ? (
                  <p style={{ fontSize: '0.85rem', color: '#ccc', margin: 0 }}>
                    This domain points to{' '}
                    <strong style={{ color: service.color }}>
                      {service.icon} {service.name}
                    </strong>
                    . The CNAME record redirects DNS resolution to the service provider&apos;s infrastructure.
                  </p>
                ) : null;
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
