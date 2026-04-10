'use client';

import { AppShell } from '../components/AppShell';

const TOOLS = [
  { href: '/domain-age-checker', name: 'Domain Age Checker', desc: 'Find out when any domain was first registered', icon: '📅' },
  { href: '/dns-lookup', name: 'DNS Lookup', desc: 'Query A, AAAA, MX, NS, TXT, and CNAME records', icon: '🔍' },
  { href: '/domain-expiration', name: 'Domain Expiration Checker', desc: 'Check when a domain expires via RDAP', icon: '⏰' },
  { href: '/domain-availability', name: 'Domain Availability Checker', desc: 'Check if a domain name is available to register', icon: '✅' },
  { href: '/random-domain-generator', name: 'Random Domain Generator', desc: 'Generate creative, brandable domain name ideas', icon: '🎲' },
  { href: '/brand-name-generator', name: 'Brand Name Generator', desc: 'Create unique business & brand names by industry', icon: '✨' },
  { href: '/startup-name-generator', name: 'Startup Name Generator', desc: 'Generate fundable startup names for SaaS, AI, fintech & more', icon: '🚀' },
  { href: '/domain-value', name: 'Domain Value Estimator', desc: 'Estimate how much a domain name is worth', icon: '💰' },
  { href: '/domain-length-checker', name: 'Domain Length Checker', desc: 'Analyze character count, typeability, memorability & brandability', icon: '📏' },
  { href: '/tld-comparison', name: 'TLD Comparison Tool', desc: 'Compare domain extensions: .com, .io, .ai, .dev & 50+ more', icon: '🌐' },
  { href: '/bulk-domain-checker', name: 'Bulk Domain Checker', desc: 'Check availability of multiple domains at once with export', icon: '📊' },
  { href: '/ssl-checker', name: 'SSL Certificate Checker', desc: 'Check HTTPS security, certificate expiry & validity', icon: '🔒' },
  { href: '/email-domain-checker', name: 'Email Domain Checker', desc: 'Check MX, SPF, DKIM & DMARC email authentication records', icon: '📧' },
  { href: '/domain-history', name: 'Domain History Lookup', desc: 'View registration timeline, status codes & infrastructure history', icon: '📜' },
  { href: '/website-status', name: 'Website Status Checker', desc: 'Check if any website is up, down, or slow with response time', icon: '🟢' },
  { href: '/domain-typo-generator', name: 'Domain Typo Generator', desc: 'Generate typo domain variations to find typosquatting threats', icon: '🔠' },
  { href: '/nameserver-lookup', name: 'Nameserver Lookup', desc: 'Find NS records, DNS provider, and SOA details for any domain', icon: '🗂️' },
  { href: '/whois-privacy-checker', name: 'WHOIS Privacy Checker', desc: 'Check if your domain WHOIS info is protected or publicly exposed', icon: '🛡️' },
  { href: '/http-header-checker', name: 'HTTP Header Checker', desc: 'Inspect HTTP response headers and security score for any website', icon: '📋' },
  { href: '/subdomain-finder', name: 'Subdomain Finder', desc: 'Discover active subdomains by scanning 150+ common prefixes via DNS', icon: '🔎' },
  { href: '/domain-transfer-checker', name: 'Domain Transfer Checker', desc: 'Check if a domain is eligible for transfer — analyzes EPP status codes, locks, and ICANN rules', icon: '📤' },
  { href: '/reverse-ip-lookup', name: 'Reverse IP Lookup', desc: 'Find PTR records, reverse DNS hostnames, and identify hosting providers from any IP or domain', icon: '🔄' },
  { href: '/url-redirect-checker', name: 'URL Redirect Checker', desc: 'Trace full redirect chains, detect 301/302 redirects, find loops, and get SEO recommendations', icon: '↪️' },
  { href: '/domain-blacklist-checker', name: 'Domain Blacklist Checker', desc: 'Check your domain and IP against 14+ major DNS blacklists including Spamhaus, SURBL, and SpamCop', icon: '🛡️' },
  { href: '/website-tech-detector', name: 'Website Technology Detector', desc: 'Identify the tech stack behind any website — hosting, CDN, CMS, email, DNS & security headers', icon: '🔬' },
  { href: '/dns-propagation-checker', name: 'DNS Propagation Checker', desc: 'Check if DNS changes have propagated across global DNS servers. Test A, AAAA, MX, CNAME, TXT, NS records worldwide', icon: '🌍' },
  { href: '/whois-compare', name: 'WHOIS Compare', desc: 'Compare WHOIS records for two domains side by side. See differences in registrar, age, expiration, nameservers, and DNSSEC', icon: '⚖️' },
  { href: '/punycode-converter', name: 'Punycode/IDN Converter', desc: 'Convert internationalized domain names between Unicode and ASCII Punycode encoding. Supports all scripts including Chinese, Arabic, Cyrillic, and more', icon: '🌐' },
  { href: '/mx-record-checker', name: 'MX Record Checker', desc: 'Look up MX records for any domain. Detect email providers like Google Workspace and Microsoft 365, and verify SPF/DMARC email security settings', icon: '📧' },
  { href: '/spf-generator', name: 'SPF Record Generator', desc: 'Create valid SPF TXT records for email authentication. Select providers like Google Workspace, Microsoft 365, SendGrid, and Mailchimp — with DNS lookup counter', icon: '🛡️' },
  { href: '/dmarc-generator', name: 'DMARC Record Generator', desc: 'Generate DMARC policies for email security. Configure enforcement, alignment, reporting, and gradual rollout — with current record lookup', icon: '🔐' },
  { href: '/dkim-generator', name: 'DKIM Record Generator', desc: 'Generate and validate DKIM records for email signing. Look up existing records by selector, build new TXT records with your RSA key, and get setup guides for all major providers', icon: '🔑' },
  { href: '/cname-lookup', name: 'CNAME Lookup Tool', desc: 'Look up CNAME records for any domain. Follow the full DNS alias chain, detect hosting providers, and resolve final IP addresses', icon: '🔗' },
  { href: '/redirect-mapper', name: 'Domain Redirect Mapper', desc: 'Map and visualize redirect chains for multiple URLs at once. Trace 301/302 hops, detect loops, and export to CSV', icon: '🗺️' },
  { href: '/dns-compare', name: 'DNS Record Comparison', desc: 'Compare DNS records between two domains side by side. Spot differences in A, MX, NS, TXT, and more', icon: '⚖️' },
  { href: '/portfolio-analyzer', name: 'Domain Portfolio Analyzer', desc: 'Analyze your entire domain collection — quality scores, TLD distribution, age, expiration alerts, and CSV export', icon: '📁' },
  { href: '/robots-analyzer', name: 'Robots.txt Analyzer', desc: 'Parse, validate, and analyze any website\'s robots.txt — see blocked bots, disallowed paths, sitemaps, and syntax errors', icon: '🤖' },
  { href: '/sitemap-validator', name: 'Sitemap Validator', desc: 'Validate and analyze XML sitemaps — check for errors, duplicates, missing metadata, size limits, and get an SEO health score', icon: '🗺️' },
  { href: '/og-preview', name: 'Open Graph Preview', desc: 'Preview how your links appear on Facebook, Twitter/X, Discord, LinkedIn, and Slack — with readiness score and code snippets', icon: '🖼️' },
  { href: '/domain-keywords', name: 'Domain Keyword Extractor', desc: 'Extract meaningful keywords from any domain name. Break down concatenated names, classify words, and export results as CSV', icon: '🔤' },
  { href: '/doh-tester', name: 'DNS over HTTPS Tester', desc: 'Test and compare DoH resolvers — Google, Cloudflare, Quad9, AdGuard & Mullvad — with speed benchmarks and DNSSEC validation', icon: '🔐' },
  { href: '/domain-watchlist', name: 'Domain Watchlist', desc: 'Track domain expiration dates, registrar info, and DNS status. Monitor your portfolio with a free browser-based watchlist', icon: '👁️' },
  { href: '/caa-checker', name: 'CAA Record Checker', desc: 'Check Certificate Authority Authorization records for any domain. See which CAs can issue SSL/TLS certificates and get security recommendations', icon: '🛡️' },
  { href: '/domain-appraisal', name: 'Domain Appraisal Tool', desc: 'Free multi-factor domain name appraisal. Get an instant value estimate based on TLD quality, length, brandability, keywords, and memorability', icon: '💎' },
  { href: '/txt-record-lookup', name: 'TXT Record Lookup', desc: 'Check all DNS TXT records for any domain — SPF, DKIM, DMARC, BIMI, MTA-STS, and verification tokens from Google, Microsoft, Facebook, and more', icon: '📝' },
  { href: '/registrar-detector', name: 'Registrar Detector', desc: 'Identify which registrar manages any domain. See IANA ID, abuse contacts, nameservers, registration dates, and EPP status flags via live RDAP', icon: '🏢' },
  { href: '/ptr-lookup', name: 'PTR Record Lookup', desc: 'Reverse DNS lookup for any IP address. Find the hostname mapped to an IP, verify forward-confirmed reverse DNS (FCrDNS), and inspect ARPA records', icon: '🔄' },
];

export default function Tools() {
  return (
    <AppShell>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          Free Domain Tools
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px' }}>
          All tools run entirely in your browser — no sign-up, no limits, completely free.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {TOOLS.map(tool => (
            <a key={tool.href} href={tool.href} style={{
              background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '24px',
              textDecoration: 'none', color: '#fff', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#8b5cf6'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{tool.icon}</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{tool.name}</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{tool.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
