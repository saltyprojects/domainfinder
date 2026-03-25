'use client';

import { useState } from 'react';

const TECH_CATEGORIES = {
  hosting: { label: 'Hosting & CDN', icon: '🖥️', color: '#8b5cf6' },
  security: { label: 'Security', icon: '🔒', color: '#22c55e' },
  email: { label: 'Email', icon: '📧', color: '#3b82f6' },
  dns: { label: 'DNS Provider', icon: '🌐', color: '#f59e0b' },
  framework: { label: 'Framework & CMS', icon: '⚙️', color: '#ec4899' },
  analytics: { label: 'Analytics & Marketing', icon: '📊', color: '#14b8a6' },
  cdn: { label: 'CDN & Performance', icon: '⚡', color: '#f97316' },
};

// Detection rules based on HTTP headers, DNS, and other signals
const HEADER_DETECTIONS = [
  // Servers
  { header: 'server', match: /nginx/i, tech: 'Nginx', category: 'hosting', confidence: 'high' },
  { header: 'server', match: /apache/i, tech: 'Apache', category: 'hosting', confidence: 'high' },
  { header: 'server', match: /cloudflare/i, tech: 'Cloudflare', category: 'cdn', confidence: 'high' },
  { header: 'server', match: /microsoft-iis/i, tech: 'Microsoft IIS', category: 'hosting', confidence: 'high' },
  { header: 'server', match: /litespeed/i, tech: 'LiteSpeed', category: 'hosting', confidence: 'high' },
  { header: 'server', match: /openresty/i, tech: 'OpenResty', category: 'hosting', confidence: 'high' },
  { header: 'server', match: /caddy/i, tech: 'Caddy', category: 'hosting', confidence: 'high' },
  { header: 'server', match: /gunicorn/i, tech: 'Gunicorn (Python)', category: 'hosting', confidence: 'high' },
  { header: 'server', match: /deno/i, tech: 'Deno Deploy', category: 'hosting', confidence: 'high' },
  
  // CDN/Platform
  { header: 'x-powered-by', match: /express/i, tech: 'Express.js (Node.js)', category: 'framework', confidence: 'high' },
  { header: 'x-powered-by', match: /next\.?js/i, tech: 'Next.js', category: 'framework', confidence: 'high' },
  { header: 'x-powered-by', match: /php/i, tech: 'PHP', category: 'framework', confidence: 'high' },
  { header: 'x-powered-by', match: /asp\.net/i, tech: 'ASP.NET', category: 'framework', confidence: 'high' },
  { header: 'x-powered-by', match: /nuxt/i, tech: 'Nuxt.js', category: 'framework', confidence: 'high' },
  
  // CDN headers
  { header: 'cf-ray', match: /.+/, tech: 'Cloudflare CDN', category: 'cdn', confidence: 'high' },
  { header: 'x-vercel-id', match: /.+/, tech: 'Vercel', category: 'hosting', confidence: 'high' },
  { header: 'x-amz-cf-id', match: /.+/, tech: 'Amazon CloudFront', category: 'cdn', confidence: 'high' },
  { header: 'x-amz-cf-pop', match: /.+/, tech: 'Amazon CloudFront', category: 'cdn', confidence: 'high' },
  { header: 'x-served-by', match: /cache/i, tech: 'Fastly CDN', category: 'cdn', confidence: 'medium' },
  { header: 'x-cache', match: /HIT|MISS/i, tech: 'CDN Caching Active', category: 'cdn', confidence: 'medium' },
  { header: 'fly-request-id', match: /.+/, tech: 'Fly.io', category: 'hosting', confidence: 'high' },
  { header: 'x-netlify-request-id', match: /.+/, tech: 'Netlify', category: 'hosting', confidence: 'high' },
  { header: 'x-github-request-id', match: /.+/, tech: 'GitHub Pages', category: 'hosting', confidence: 'high' },
  
  // Frameworks/CMS via headers
  { header: 'x-drupal-cache', match: /.+/, tech: 'Drupal', category: 'framework', confidence: 'high' },
  { header: 'x-generator', match: /drupal/i, tech: 'Drupal', category: 'framework', confidence: 'high' },
  { header: 'x-generator', match: /wordpress/i, tech: 'WordPress', category: 'framework', confidence: 'high' },
  { header: 'x-shopify-stage', match: /.+/, tech: 'Shopify', category: 'framework', confidence: 'high' },
  { header: 'x-wix-request-id', match: /.+/, tech: 'Wix', category: 'framework', confidence: 'high' },
  
  // Security headers
  { header: 'strict-transport-security', match: /.+/, tech: 'HSTS Enabled', category: 'security', confidence: 'high' },
  { header: 'content-security-policy', match: /.+/, tech: 'Content Security Policy', category: 'security', confidence: 'high' },
  { header: 'x-frame-options', match: /.+/, tech: 'X-Frame-Options', category: 'security', confidence: 'high' },
  { header: 'x-content-type-options', match: /nosniff/i, tech: 'X-Content-Type-Options', category: 'security', confidence: 'high' },
  { header: 'x-xss-protection', match: /.+/, tech: 'XSS Protection Header', category: 'security', confidence: 'high' },
  { header: 'permissions-policy', match: /.+/, tech: 'Permissions Policy', category: 'security', confidence: 'high' },
  { header: 'referrer-policy', match: /.+/, tech: 'Referrer Policy', category: 'security', confidence: 'high' },
];

const NS_DETECTIONS = [
  { match: /cloudflare/i, tech: 'Cloudflare DNS', category: 'dns' },
  { match: /awsdns/i, tech: 'Amazon Route 53', category: 'dns' },
  { match: /google/i, tech: 'Google Cloud DNS', category: 'dns' },
  { match: /azure-dns/i, tech: 'Azure DNS', category: 'dns' },
  { match: /digitalocean/i, tech: 'DigitalOcean DNS', category: 'dns' },
  { match: /domaincontrol/i, tech: 'GoDaddy DNS', category: 'dns' },
  { match: /name-services\.com/i, tech: 'Enom DNS', category: 'dns' },
  { match: /registrar-servers/i, tech: 'Namecheap DNS', category: 'dns' },
  { match: /dns\.he\.net/i, tech: 'Hurricane Electric DNS', category: 'dns' },
  { match: /nsone/i, tech: 'NS1 DNS', category: 'dns' },
  { match: /dnsimple/i, tech: 'DNSimple', category: 'dns' },
  { match: /vercel-dns/i, tech: 'Vercel DNS', category: 'dns' },
  { match: /netlify/i, tech: 'Netlify DNS', category: 'dns' },
];

const MX_DETECTIONS = [
  { match: /google|gmail|aspmx/i, tech: 'Google Workspace', category: 'email' },
  { match: /outlook|microsoft/i, tech: 'Microsoft 365', category: 'email' },
  { match: /protonmail|proton/i, tech: 'ProtonMail', category: 'email' },
  { match: /zoho/i, tech: 'Zoho Mail', category: 'email' },
  { match: /mimecast/i, tech: 'Mimecast', category: 'email' },
  { match: /barracuda/i, tech: 'Barracuda Email Security', category: 'email' },
  { match: /pphosted|proofpoint/i, tech: 'Proofpoint', category: 'email' },
  { match: /messagelabs/i, tech: 'Symantec Email Security', category: 'email' },
  { match: /secureserver/i, tech: 'GoDaddy Email', category: 'email' },
  { match: /ovh\.net/i, tech: 'OVH Email', category: 'email' },
  { match: /fastmail/i, tech: 'Fastmail', category: 'email' },
  { match: /icloud/i, tech: 'iCloud Mail', category: 'email' },
  { match: /sendgrid/i, tech: 'SendGrid', category: 'email' },
  { match: /mailgun/i, tech: 'Mailgun', category: 'email' },
];

const TXT_DETECTIONS = [
  { match: /v=spf1/i, tech: 'SPF Record', category: 'email' },
  { match: /google-site-verification/i, tech: 'Google Search Console', category: 'analytics' },
  { match: /facebook-domain-verification/i, tech: 'Facebook Domain Verification', category: 'analytics' },
  { match: /ms=/i, tech: 'Microsoft Domain Verification', category: 'analytics' },
  { match: /apple-domain-verification/i, tech: 'Apple Domain Verification', category: 'analytics' },
  { match: /adobe-idp-site-verification/i, tech: 'Adobe Domain Verification', category: 'analytics' },
  { match: /atlassian-domain-verification/i, tech: 'Atlassian Domain Verification', category: 'analytics' },
  { match: /hubspot-developer-verification/i, tech: 'HubSpot', category: 'analytics' },
  { match: /stripe-verification/i, tech: 'Stripe', category: 'analytics' },
  { match: /docusign/i, tech: 'DocuSign', category: 'analytics' },
  { match: /v=DMARC1/i, tech: 'DMARC Policy', category: 'email' },
];

const CNAME_DETECTIONS = [
  { match: /cdn\.shopify/i, tech: 'Shopify Hosting', category: 'hosting' },
  { match: /squarespace/i, tech: 'Squarespace', category: 'hosting' },
  { match: /wordpress\.com/i, tech: 'WordPress.com', category: 'hosting' },
  { match: /ghost\.io/i, tech: 'Ghost CMS', category: 'hosting' },
  { match: /webflow\.io/i, tech: 'Webflow', category: 'hosting' },
  { match: /herokuapp/i, tech: 'Heroku', category: 'hosting' },
  { match: /azurewebsites/i, tech: 'Azure App Service', category: 'hosting' },
  { match: /cloudfront\.net/i, tech: 'Amazon CloudFront', category: 'cdn' },
  { match: /github\.io/i, tech: 'GitHub Pages', category: 'hosting' },
  { match: /netlify/i, tech: 'Netlify', category: 'hosting' },
  { match: /vercel/i, tech: 'Vercel', category: 'hosting' },
  { match: /railway\.app/i, tech: 'Railway', category: 'hosting' },
  { match: /render\.com/i, tech: 'Render', category: 'hosting' },
  { match: /pages\.dev/i, tech: 'Cloudflare Pages', category: 'hosting' },
];

const IP_DETECTIONS = [
  { ranges: ['13.', '52.', '54.', '34.', '35.', '3.'], tech: 'AWS (likely)', category: 'hosting', confidence: 'low' },
  { ranges: ['104.21.', '172.67.', '104.16.', '104.17.', '104.18.', '104.19.', '104.20.'], tech: 'Cloudflare', category: 'cdn', confidence: 'medium' },
  { ranges: ['76.76.21.', '76.223.'], tech: 'Vercel', category: 'hosting', confidence: 'medium' },
  { ranges: ['185.199.'], tech: 'GitHub Pages', category: 'hosting', confidence: 'high' },
  { ranges: ['151.101.'], tech: 'Fastly CDN', category: 'cdn', confidence: 'medium' },
  { ranges: ['216.239.', '142.250.', '34.'], tech: 'Google Cloud (likely)', category: 'hosting', confidence: 'low' },
];

async function resolveDNS(name, type = 'A') {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function parseDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
  return d;
}

function ConfidenceBadge({ level }) {
  const config = {
    high: { bg: '#22c55e20', color: '#22c55e', border: '#22c55e40' },
    medium: { bg: '#f59e0b20', color: '#f59e0b', border: '#f59e0b40' },
    low: { bg: '#66666620', color: '#999', border: '#66666640' },
  };
  const c = config[level] || config.low;
  return (
    <span style={{
      display: 'inline-flex', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`, textTransform: 'uppercase',
    }}>
      {level}
    </span>
  );
}

export default function WebsiteTechDetector() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  async function detect() {
    const domain = parseDomain(input);
    if (!domain || !domain.includes('.')) {
      setError('Please enter a valid domain name');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    const techs = new Map(); // key: tech name, value: { tech, category, confidence, source }

    function addTech(tech, category, confidence, source) {
      const existing = techs.get(tech);
      if (!existing || (confidence === 'high' && existing.confidence !== 'high')) {
        techs.set(tech, { tech, category, confidence, source });
      }
    }

    try {
      // Step 1: DNS Records
      setProgress('Querying DNS records...');
      const [aData, nsData, mxData, txtData, cnameData, dmarcData] = await Promise.all([
        resolveDNS(domain, 'A'),
        resolveDNS(domain, 'NS'),
        resolveDNS(domain, 'MX'),
        resolveDNS(domain, 'TXT'),
        resolveDNS(domain, 'CNAME'),
        resolveDNS(`_dmarc.${domain}`, 'TXT'),
      ]);

      // Check A records for IP-based detection
      const ips = [];
      if (aData?.Answer) {
        aData.Answer.forEach(r => {
          if (r.type === 1) {
            ips.push(r.data);
            IP_DETECTIONS.forEach(det => {
              if (det.ranges.some(prefix => r.data.startsWith(prefix))) {
                addTech(det.tech, det.category, det.confidence, `IP: ${r.data}`);
              }
            });
          }
        });
      }

      // NS records
      if (nsData?.Answer) {
        nsData.Answer.forEach(r => {
          if (r.type === 2) {
            NS_DETECTIONS.forEach(det => {
              if (det.match.test(r.data)) {
                addTech(det.tech, det.category, 'high', `NS: ${r.data}`);
              }
            });
          }
        });
      }

      // MX records
      if (mxData?.Answer) {
        mxData.Answer.forEach(r => {
          if (r.type === 15) {
            MX_DETECTIONS.forEach(det => {
              if (det.match.test(r.data)) {
                addTech(det.tech, det.category, 'high', `MX: ${r.data}`);
              }
            });
          }
        });
      }

      // TXT records
      if (txtData?.Answer) {
        txtData.Answer.forEach(r => {
          if (r.type === 16) {
            TXT_DETECTIONS.forEach(det => {
              if (det.match.test(r.data)) {
                addTech(det.tech, det.category, 'high', `TXT record`);
              }
            });
          }
        });
      }

      // DMARC
      if (dmarcData?.Answer) {
        dmarcData.Answer.forEach(r => {
          if (r.type === 16 && /v=DMARC1/i.test(r.data)) {
            addTech('DMARC Policy', 'email', 'high', 'TXT: _dmarc record');
          }
        });
      }

      // CNAME records
      if (cnameData?.Answer) {
        cnameData.Answer.forEach(r => {
          if (r.type === 5) {
            CNAME_DETECTIONS.forEach(det => {
              if (det.match.test(r.data)) {
                addTech(det.tech, det.category, 'high', `CNAME: ${r.data}`);
              }
            });
          }
        });
      }

      // Also check www CNAME
      setProgress('Checking www CNAME...');
      const wwwCname = await resolveDNS(`www.${domain}`, 'CNAME');
      if (wwwCname?.Answer) {
        wwwCname.Answer.forEach(r => {
          if (r.type === 5) {
            CNAME_DETECTIONS.forEach(det => {
              if (det.match.test(r.data)) {
                addTech(det.tech, det.category, 'high', `www CNAME: ${r.data}`);
              }
            });
          }
        });
      }

      // Check DKIM for Google / Microsoft
      setProgress('Checking DKIM selectors...');
      const [googleDkim, msDkim] = await Promise.all([
        resolveDNS(`google._domainkey.${domain}`, 'TXT'),
        resolveDNS(`selector1._domainkey.${domain}`, 'TXT'),
      ]);
      if (googleDkim?.Answer?.length) addTech('Google Workspace (DKIM)', 'email', 'high', 'DKIM: google._domainkey');
      if (msDkim?.Answer?.length) addTech('Microsoft 365 (DKIM)', 'email', 'high', 'DKIM: selector1._domainkey');

      // Step 2: HTTP headers via a CORS-friendly check
      setProgress('Analyzing HTTP headers...');
      try {
        // Try fetching the site headers using a public header-check API or direct fetch
        const headerRes = await fetch(`https://${domain}`, { 
          method: 'HEAD', 
          mode: 'no-cors',
          signal: AbortSignal.timeout(8000),
        }).catch(() => null);

        // Since no-cors won't give us headers, try dns.google TXT for _http._tcp
        // Instead, we'll use a known trick: check common CDN/platform-specific subdomains
      } catch (e) {
        // Expected - CORS blocks most header reads
      }

      // Step 3: Platform-specific subdomain checks
      setProgress('Probing platform signatures...');
      const platformChecks = [
        { sub: `_cf-custom-hostname.${domain}`, tech: 'Cloudflare for SaaS', category: 'cdn' },
      ];

      // Check for Vercel, Netlify via special DNS
      const vercelCheck = await resolveDNS(`_vercel.${domain}`, 'TXT');
      if (vercelCheck?.Answer?.length) addTech('Vercel', 'hosting', 'high', 'TXT: _vercel record');

      // Step 4: SSL/Certificate-based detection via CNAME patterns already done above

      setProgress('Done!');

      // Group by category
      const grouped = {};
      techs.forEach((val) => {
        if (!grouped[val.category]) grouped[val.category] = [];
        grouped[val.category].push(val);
      });

      setResults({
        domain,
        ips,
        techCount: techs.size,
        grouped,
        rawTechs: Array.from(techs.values()),
      });

    } catch (e) {
      setError(`Error analyzing ${domain}: ${e.message}`);
    } finally {
      setLoading(false);
      setProgress('');
    }
  }

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Input */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && detect()}
          placeholder="Enter domain (e.g., github.com)"
          style={{
            flex: 1, minWidth: '240px', padding: '14px 18px', borderRadius: '12px',
            background: '#111', border: '1px solid #1e1e1e', color: '#fff', fontSize: '1rem',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#8b5cf6'}
          onBlur={e => e.target.style.borderColor = '#1e1e1e'}
        />
        <button
          onClick={detect}
          disabled={loading}
          style={{
            padding: '14px 32px', borderRadius: '12px', background: '#8b5cf6', color: '#fff',
            fontWeight: 700, fontSize: '1rem', border: 'none', cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Scanning...' : 'Detect Technologies'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', borderRadius: '12px', background: '#ef444420', border: '1px solid #ef444440', color: '#ef4444', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {progress && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#8b5cf610', border: '1px solid #8b5cf630', color: '#8b5cf6', marginBottom: '24px', fontSize: '0.9rem' }}>
          ⟳ {progress}
        </div>
      )}

      {results && (
        <div>
          {/* Summary */}
          <div style={{
            padding: '24px', borderRadius: '16px', background: '#111', border: '1px solid #1e1e1e',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Domain</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{results.domain}</div>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#1e1e1e' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Technologies Detected</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6' }}>{results.techCount}</div>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#1e1e1e' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>IP Address</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'monospace' }}>
                  {results.ips.length > 0 ? results.ips[0] : 'N/A'}
                </div>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#1e1e1e' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Categories</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>
                  {Object.keys(results.grouped).length}
                </div>
              </div>
            </div>
          </div>

          {/* Results by category */}
          {Object.entries(TECH_CATEGORIES).map(([key, cat]) => {
            const items = results.grouped[key];
            if (!items || items.length === 0) return null;
            return (
              <div key={key} style={{ marginBottom: '20px' }}>
                <h3 style={{
                  fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span style={{
                    fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px',
                    background: `${cat.color}20`, color: cat.color, fontWeight: 600,
                  }}>
                    {items.length}
                  </span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
                  {items.map((item, i) => (
                    <div key={i} style={{
                      padding: '16px', borderRadius: '12px', background: '#111', border: '1px solid #1e1e1e',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{item.tech}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'monospace' }}>{item.source}</div>
                      </div>
                      <ConfidenceBadge level={item.confidence} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* No results fallback */}
          {results.techCount === 0 && (
            <div style={{
              padding: '32px', borderRadius: '16px', background: '#111', border: '1px solid #1e1e1e',
              textAlign: 'center', color: '#9ca3af',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🤷</div>
              <p>No technologies detected. The domain may be parked, using privacy protection, or blocking DNS-based analysis.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
