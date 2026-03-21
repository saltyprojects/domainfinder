import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import WebsiteStatusChecker from './WebsiteStatusChecker';

export const metadata = {
  title: 'Website Status Checker — Is This Website Down? Check Uptime & Response Time | DomyDomains',
  description: 'Check if a website is up or down right now. Free website status checker with response time, DNS resolution, and IP address details. Instant uptime monitoring.',
  keywords: 'website status checker, is website down, website uptime checker, site down checker, is it down, website response time, check website status, website availability',
  alternates: { canonical: '/website-status' },
  openGraph: {
    title: 'Website Status Checker — Is This Website Down Right Now?',
    description: 'Instantly check if any website is up, down, or slow. Free uptime checker with response time and DNS details.',
    url: 'https://domydomains.com/website-status',
  },
};

export default function WebsiteStatusPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Website Status Checker"
        description="Check if a website is up or down right now. Free website status checker with response time, DNS resolution, and IP address details."
        url="/website-status"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Website Status Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Is a website down for everyone or just you? Check the status of any website instantly — 
        see response time, DNS resolution, and IP address details, all from your browser.
      </p>

      <WebsiteStatusChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How This Website Status Checker Works</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Our website status checker runs entirely in your browser with no server-side processing required. 
            When you enter a domain, the tool performs multiple checks to determine whether a website is online, 
            offline, or experiencing issues:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '20px' }}>
            {[
              { icon: '🔍', title: 'DNS Resolution', desc: 'Queries Google\'s public DNS servers to check if the domain exists and resolves to an IP address. Detects NXDOMAIN (non-existent domain) errors.' },
              { icon: '🌐', title: 'HTTP Reachability', desc: 'Attempts to connect to the website over HTTPS to confirm the server is responding to requests and measuring the connection time.' },
              { icon: '⏱️', title: 'Response Time', desc: 'Measures how long the website takes to respond, helping you identify slow-loading sites or overloaded servers.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>{item.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Websites Go Down</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Website downtime can happen for many reasons. Understanding common causes helps you diagnose issues faster and minimize disruption for your users.</p>
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {[
              { cause: 'Server Overload', desc: 'Traffic spikes or resource-intensive processes can overwhelm a server, causing slow responses or complete outages. Load balancing and auto-scaling can help prevent this.', urgency: 'Common' },
              { cause: 'DNS Issues', desc: 'Misconfigured DNS records, expired domains, or DNS provider outages prevent browsers from finding the server IP address. This makes the entire site unreachable.', urgency: 'Common' },
              { cause: 'SSL Certificate Problems', desc: 'Expired, misconfigured, or invalid SSL certificates trigger browser security warnings and can block access to your website entirely.', urgency: 'Common' },
              { cause: 'DDoS Attacks', desc: 'Distributed denial-of-service attacks flood servers with fake traffic, consuming bandwidth and preventing legitimate users from accessing the site.', urgency: 'Moderate' },
              { cause: 'Hosting Provider Outage', desc: 'Even major cloud providers like AWS, Google Cloud, and Azure experience outages. Your website goes down when the infrastructure it runs on fails.', urgency: 'Moderate' },
              { cause: 'Code Deployment Errors', desc: 'Bugs in new code releases, database migration failures, or configuration errors during deployment can take a website offline unexpectedly.', urgency: 'Common' },
              { cause: 'Database Failures', desc: 'Database crashes, connection pool exhaustion, or storage limits can cause application errors and make dynamic websites unresponsive.', urgency: 'Moderate' },
              { cause: 'Network Connectivity', desc: 'Issues between your ISP and the website\'s server can make a site appear down when it\'s actually accessible from other locations.', urgency: 'Common' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', background: '#111', borderRadius: '10px', padding: '16px', border: '1px solid #1e1e1e' }}>
                <div style={{ minWidth: '70px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                    background: item.urgency === 'Common' ? '#f59e0b20' : '#8b5cf620',
                    color: item.urgency === 'Common' ? '#f59e0b' : '#8b5cf6',
                    border: `1px solid ${item.urgency === 'Common' ? '#f59e0b' : '#8b5cf6'}40`,
                  }}>{item.urgency}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{item.cause}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding Status Results</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { color: '#22c55e', label: 'Online', icon: '●', desc: 'The website is responding to requests and accessible from your browser. DNS resolves correctly and the server returned a response.' },
            { color: '#f59e0b', label: 'Slow', icon: '●', desc: 'The website is reachable but took longer than 15 seconds to respond. The server may be overloaded, experiencing high traffic, or have performance issues.' },
            { color: '#ef4444', label: 'Offline', icon: '●', desc: 'The website is not responding. This could mean the server is down, DNS is not resolving, the domain has expired, or there\'s a network issue.' },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: `1px solid ${s.color}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: s.color, fontSize: '1.2rem' }}>{s.icon}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: s.color, margin: 0 }}>{s.label}</h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Response Time Benchmarks</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Response time measures how quickly a website's server begins replying to a request. Here's what the numbers mean:</p>
          <div style={{ display: 'grid', gap: '8px', marginTop: '16px' }}>
            {[
              { range: 'Under 200ms', rating: 'Excellent', color: '#22c55e', desc: 'Fast CDN-backed sites, static pages, edge-cached content' },
              { range: '200–500ms', rating: 'Good', color: '#22c55e', desc: 'Well-optimized dynamic sites, most major web applications' },
              { range: '500ms–1s', rating: 'Acceptable', color: '#f59e0b', desc: 'Average performance, may benefit from caching or CDN' },
              { range: '1–3 seconds', rating: 'Slow', color: '#f59e0b', desc: 'Noticeable delay, users may start to leave. Needs optimization.' },
              { range: 'Over 3 seconds', rating: 'Poor', color: '#ef4444', desc: 'Significant performance issues. 53% of mobile users leave after 3s.' },
            ].map(b => (
              <div key={b.range} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#111', borderRadius: '8px', padding: '12px 16px', border: '1px solid #1e1e1e' }}>
                <div style={{ minWidth: '110px', fontSize: '0.85rem', fontWeight: 600, color: '#fff', fontFamily: 'ui-monospace, monospace' }}>{b.range}</div>
                <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600, background: `${b.color}20`, color: b.color, minWidth: '70px', textAlign: 'center' }}>{b.rating}</span>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'Is this website down for everyone or just me?', a: 'This tool checks from your browser, so it tells you if the site is reachable from your current location and network. If a site is down for you but works for others, the issue is likely your ISP, DNS cache, or local network configuration.' },
          { q: 'How accurate is the response time?', a: 'The response time measures the round-trip time from your browser to the website and back. It includes network latency between your location and the server, so results may vary depending on your internet connection and geographic distance to the server.' },
          { q: 'Why does a site show as down when I can access it?', a: 'Some websites block automated requests or have CORS policies that prevent our browser-based check from confirming they\'re online. If you can load the site in another tab, it\'s working — the check result is a false negative due to security restrictions.' },
          { q: 'Can I check multiple websites?', a: 'Yes! Simply check one domain at a time. Your recent results are kept in the list below the search bar so you can compare status and response times across multiple sites.' },
          { q: 'Does this tool store my data?', a: 'No. Everything runs in your browser. No data is sent to our servers, and results are only stored in your browser\'s memory for the current session.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Need more domain tools?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Check DNS records, SSL certificates, domain expiration, and more — all free.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/dns-lookup" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            DNS Lookup →
          </a>
          <a href="/ssl-checker" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            SSL Checker
          </a>
          <a href="/tools" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            All Tools
          </a>
        </div>
      </section>
    </StaticPage>
  );
}
