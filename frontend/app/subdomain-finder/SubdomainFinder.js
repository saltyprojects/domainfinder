'use client';

import { useState, useRef } from 'react';

const COMMON_SUBDOMAINS = [
  'www', 'mail', 'ftp', 'smtp', 'pop', 'imap', 'webmail', 'email',
  'admin', 'panel', 'cpanel', 'whm', 'dashboard', 'portal',
  'api', 'dev', 'staging', 'stage', 'test', 'beta', 'alpha', 'demo',
  'app', 'apps', 'web', 'mobile', 'm', 'wap',
  'blog', 'news', 'forum', 'community', 'wiki', 'docs', 'doc', 'help', 'support', 'kb',
  'shop', 'store', 'cart', 'pay', 'billing', 'checkout',
  'cdn', 'static', 'assets', 'img', 'images', 'media', 'files', 'download', 'downloads',
  'ns1', 'ns2', 'ns3', 'dns', 'dns1', 'dns2',
  'mx', 'mx1', 'mx2', 'relay', 'gateway',
  'vpn', 'remote', 'proxy', 'ssh', 'rdp', 'citrix',
  'git', 'gitlab', 'github', 'svn', 'repo', 'jenkins', 'ci', 'cd', 'build',
  'monitor', 'status', 'health', 'grafana', 'prometheus', 'kibana', 'elk', 'log', 'logs',
  'auth', 'sso', 'login', 'oauth', 'id', 'identity',
  'db', 'database', 'mysql', 'postgres', 'redis', 'mongo', 'sql',
  'cloud', 'aws', 'azure', 'gcp', 's3',
  'crm', 'erp', 'hr', 'jira', 'confluence',
  'chat', 'slack', 'teams', 'meet', 'zoom', 'video', 'call',
  'search', 'es', 'solr', 'elastic',
  'analytics', 'tracking', 'pixel', 'ads',
  'backup', 'bak', 'old', 'legacy', 'archive',
  'staging2', 'dev2', 'test2', 'uat', 'qa', 'sandbox',
  'secure', 'ssl', 'https',
  'intranet', 'internal', 'corp', 'office',
  'autodiscover', 'autoconfig', 'exchange', 'owa',
  'calendar', 'cal',
  'www2', 'www3', 'web1', 'web2',
  'server', 'server1', 'server2', 'host', 'node1', 'node2',
  'go', 'link', 'links', 'redirect', 'url',
  'api2', 'api3', 'v1', 'v2',
  'preview', 'canary', 'nightly',
  'mailer', 'newsletter', 'campaign',
  'sip', 'voip', 'pbx', 'phone',
  'share', 'drive', 'cloud', 'nas', 'storage',
];

function cleanDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

export default function SubdomainFinder() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ checked: 0, total: 0 });
  const [error, setError] = useState('');
  const abortRef = useRef(false);

  async function checkSubdomain(sub, baseDomain) {
    const full = `${sub}.${baseDomain}`;
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(full)}&type=A`, {
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      if (data.Answer && data.Answer.length > 0) {
        const ips = data.Answer.filter(a => a.type === 1).map(a => a.data);
        const cnames = data.Answer.filter(a => a.type === 5).map(a => a.data.replace(/\.$/, ''));
        return { subdomain: full, ips, cnames, found: true };
      }
      return null;
    } catch {
      return null;
    }
  }

  async function handleScan(e) {
    e.preventDefault();
    const d = cleanDomain(domain);
    if (!d || !d.includes('.')) {
      setError('Please enter a valid domain like example.com');
      return;
    }

    setError('');
    setResults([]);
    setScanning(true);
    abortRef.current = false;

    const total = COMMON_SUBDOMAINS.length;
    setProgress({ checked: 0, total });

    const found = [];
    const batchSize = 10;

    for (let i = 0; i < total; i += batchSize) {
      if (abortRef.current) break;
      const batch = COMMON_SUBDOMAINS.slice(i, i + batchSize);
      const promises = batch.map(sub => checkSubdomain(sub, d));
      const batchResults = await Promise.all(promises);

      for (const r of batchResults) {
        if (r && r.found) {
          found.push(r);
        }
      }

      setResults([...found]);
      setProgress({ checked: Math.min(i + batchSize, total), total });
    }

    setScanning(false);
  }

  function handleStop() {
    abortRef.current = true;
    setScanning(false);
  }

  const progressPct = progress.total > 0 ? Math.round((progress.checked / progress.total) * 100) : 0;

  return (
    <div style={{ marginBottom: '48px' }}>
      <form onSubmit={handleScan} style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          style={{
            flex: '1 1 300px', padding: '14px 18px', fontSize: '1rem',
            background: '#111', border: '1px solid #333', borderRadius: '10px',
            color: '#fff', outline: 'none',
          }}
        />
        {scanning ? (
          <button
            type="button"
            onClick={handleStop}
            style={{
              padding: '14px 28px', fontSize: '1rem', fontWeight: 600,
              background: '#ef4444', color: '#fff', border: 'none',
              borderRadius: '10px', cursor: 'pointer',
            }}
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            style={{
              padding: '14px 28px', fontSize: '1rem', fontWeight: 600,
              background: '#8b5cf6', color: '#fff', border: 'none',
              borderRadius: '10px', cursor: 'pointer',
            }}
          >
            Find Subdomains
          </button>
        )}
      </form>

      {error && (
        <div style={{ padding: '12px 16px', background: '#7f1d1d40', border: '1px solid #7f1d1d', borderRadius: '10px', color: '#fca5a5', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {(scanning || progress.checked > 0) && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#9ca3af' }}>
            <span>Checking {progress.checked} of {progress.total} common subdomains...</span>
            <span>{results.length} found</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#1e1e1e', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${progressPct}%`,
              height: '100%',
              background: scanning ? '#8b5cf6' : '#22c55e',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px', flexWrap: 'wrap', gap: '12px',
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
              Found {results.length} Subdomain{results.length !== 1 ? 's' : ''}
            </h2>
            <button
              onClick={() => {
                const text = results.map(r => {
                  const ips = r.ips.length > 0 ? r.ips.join(', ') : 'N/A';
                  const cnames = r.cnames.length > 0 ? ` → ${r.cnames.join(', ')}` : '';
                  return `${r.subdomain} → ${ips}${cnames}`;
                }).join('\n');
                navigator.clipboard.writeText(text);
              }}
              style={{
                padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600,
                background: 'transparent', color: '#8b5cf6', border: '1px solid #8b5cf6',
                borderRadius: '8px', cursor: 'pointer',
              }}
            >
              Copy All
            </button>
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            {results.map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                gap: '12px', alignItems: 'center',
                background: '#111', borderRadius: '10px', padding: '14px 18px',
                border: '1px solid #1e1e1e',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontFamily: 'ui-monospace, monospace', fontSize: '0.95rem', marginBottom: '4px' }}>
                    <a href={`https://${r.subdomain}`} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#8b5cf6', textDecoration: 'none' }}>
                      {r.subdomain}
                    </a>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.82rem', color: '#9ca3af' }}>
                    {r.ips.length > 0 && (
                      <span>IP: {r.ips.join(', ')}</span>
                    )}
                    {r.cnames.length > 0 && (
                      <span>CNAME: {r.cnames.join(', ')}</span>
                    )}
                  </div>
                </div>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#22c55e', flexShrink: 0,
                }} title="Resolves" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!scanning && progress.checked > 0 && results.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '40px 20px', background: '#111',
          borderRadius: '12px', border: '1px solid #1e1e1e',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
          <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
            No subdomains found. The domain may not have any common subdomains configured.
          </p>
        </div>
      )}
    </div>
  );
}
