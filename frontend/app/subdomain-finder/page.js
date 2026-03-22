import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import SubdomainFinder from './SubdomainFinder';

export const metadata = {
  title: 'Subdomain Finder — Discover Subdomains for Any Domain | DomyDomains',
  description: 'Free subdomain finder tool. Scan 150+ common subdomain prefixes to discover active subdomains, IP addresses, and CNAME records for any domain. No signup required.',
  keywords: 'subdomain finder, find subdomains, subdomain scanner, subdomain enumeration, subdomain discovery, subdomain lookup, subdomain checker, dns subdomain scan, website subdomains',
  alternates: { canonical: '/subdomain-finder' },
  openGraph: {
    title: 'Subdomain Finder — Discover Subdomains for Any Domain',
    description: 'Scan 150+ common subdomains to discover active hosts, IP addresses, and CNAME records. Free browser-based tool.',
    url: 'https://domydomains.com/subdomain-finder',
  },
};

export default function SubdomainFinderPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Subdomain Finder"
        description="Discover active subdomains for any domain by scanning 150+ common prefixes. Shows IP addresses, CNAME records, and resolution status — all from your browser."
        url="/subdomain-finder"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Subdomain Finder
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Discover active subdomains for any domain. This tool scans 150+ common subdomain prefixes using DNS lookups 
        to find live hosts, their IP addresses, and CNAME records — all from your browser.
      </p>

      <SubdomainFinder />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is Subdomain Enumeration?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Subdomain enumeration is the process of discovering all active subdomains associated with a domain name. 
            Every organization uses subdomains to organize their web infrastructure — from <code style={{ color: '#8b5cf6' }}>mail.example.com</code> for 
            email services to <code style={{ color: '#8b5cf6' }}>api.example.com</code> for backend APIs. Finding these subdomains reveals the 
            full scope of a domain's online presence.
          </p>
          <p style={{ marginTop: '16px' }}>
            This tool uses a dictionary-based approach, testing over 150 of the most commonly used subdomain prefixes 
            against Google's public DNS resolver. Each prefix is queried for A records (IP addresses) and CNAME records 
            (aliases), giving you a clear picture of what's actively configured and reachable. Unlike passive tools that 
            rely on historical data, this performs live DNS queries to show what's currently active right now.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common Subdomain Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { icon: '📧', label: 'Email & Communication', color: '#3b82f6', examples: 'mail, smtp, imap, pop, webmail, exchange, autodiscover', desc: 'Email servers and communication infrastructure. Finding these reveals what email services are in use.' },
            { icon: '⚙️', label: 'Development & CI/CD', color: '#f59e0b', examples: 'dev, staging, test, beta, git, jenkins, ci', desc: 'Development environments and build pipelines. These may expose pre-release features or unprotected test instances.' },
            { icon: '🛡️', label: 'Admin & Access', color: '#ef4444', examples: 'admin, panel, cpanel, vpn, remote, ssh', desc: 'Administrative panels and remote access points. Critical to secure as they provide elevated access to systems.' },
            { icon: '📊', label: 'Monitoring & Logging', color: '#22c55e', examples: 'monitor, grafana, kibana, logs, status, health', desc: 'Monitoring dashboards and log aggregators. These can reveal internal metrics and system architecture details.' },
            { icon: '☁️', label: 'Infrastructure', color: '#8b5cf6', examples: 'cdn, static, assets, s3, cloud, ns1, dns', desc: 'Content delivery, static assets, and DNS infrastructure. Shows what cloud providers and CDNs are in use.' },
            { icon: '🔐', label: 'Authentication', color: '#ec4899', examples: 'auth, sso, login, oauth, id, identity', desc: 'Single sign-on and authentication services. These are high-value targets that should always be properly secured.' },
          ].map(cat => (
            <div key={cat.label} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: `1px solid ${cat.color}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: cat.color, margin: 0 }}>{cat.label}</h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 8px' }}>{cat.desc}</p>
              <span style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'ui-monospace, monospace' }}>{cat.examples}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Find Subdomains?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Subdomain discovery is essential for multiple use cases. Security professionals use it to map an 
            organization's attack surface — forgotten staging servers, exposed admin panels, and misconfigured 
            development environments are common entry points for attackers. A subdomain scan can reveal services 
            that were deployed and forgotten but remain accessible to the public internet.
          </p>
          <p style={{ marginTop: '16px' }}>
            For SEO professionals, subdomain enumeration helps understand how a competitor structures their web 
            presence. Finding separate subdomains for blogs, shops, documentation, and APIs shows how content is 
            organized and where link equity flows. It can also reveal content opportunities — if competitors run 
            community forums or knowledge bases on subdomains, those are proven content strategies worth considering.
          </p>
          <p style={{ marginTop: '16px' }}>
            System administrators use subdomain scanning for asset inventory and compliance. When organizations 
            grow, it's common for teams to spin up subdomains without central oversight. Regular enumeration 
            ensures no forgotten services are running unpatched or exposed without proper access controls.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How This Tool Works</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { step: '1', title: 'Dictionary Scan', desc: 'We test 150+ of the most common subdomain prefixes (www, mail, api, dev, staging, admin, etc.) against your target domain.' },
            { step: '2', title: 'DNS Resolution', desc: 'Each candidate subdomain is queried via Google Public DNS (dns.google) for A records (IPv4 addresses) and CNAME records (aliases).' },
            { step: '3', title: 'Parallel Processing', desc: 'Subdomains are checked in batches of 10 for fast results. The progress bar updates in real-time as results come in.' },
            { step: '4', title: 'Results Report', desc: 'Found subdomains are displayed with their IP addresses and CNAME chains. Copy all results with one click for further analysis.' },
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', gap: '16px', background: '#111', borderRadius: '10px', padding: '16px 20px', border: '1px solid #1e1e1e' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', background: '#8b5cf620',
                color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.95rem', flexShrink: 0,
              }}>
                {item.step}
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 4px', color: '#fff' }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'Is subdomain scanning legal?', a: 'DNS queries are public by design — anyone can look up DNS records for any domain. This tool performs standard DNS resolution, the same thing your browser does when you visit a website. However, using discovered subdomains to attempt unauthorized access is illegal. Always use this tool responsibly and only scan domains you own or have permission to assess.' },
          { q: 'Why might some subdomains be missed?', a: 'This tool uses a dictionary of 150+ common prefixes, but organizations may use unique or randomized subdomain names (e.g., app-7x4k2.example.com) that won\'t appear in any dictionary. For comprehensive enumeration, combine dictionary scanning with certificate transparency logs and passive DNS databases.' },
          { q: 'What do CNAME records tell me?', a: 'CNAME records show that a subdomain is an alias pointing to another hostname. This reveals what services are being used — for example, a CNAME pointing to amazonaws.com indicates AWS hosting, while one pointing to mailgun.org reveals the email provider. CNAME chains can expose the full hosting architecture.' },
          { q: 'Can I scan my own domain for security?', a: 'Absolutely — that\'s one of the best uses for this tool. Regularly scanning your own domain helps you find forgotten services, exposed development servers, and misconfigured subdomains. Compare results over time to catch unauthorized subdomain creation.' },
          { q: 'How is this different from WHOIS lookup?', a: 'WHOIS provides registration information about a domain (owner, registrar, expiry). Subdomain enumeration discovers the active DNS infrastructure under that domain. They are complementary — WHOIS tells you who owns the domain, subdomain scanning tells you what they\'re running on it.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>More domain tools</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Check DNS records, inspect headers, analyze SSL certificates, and more — all free.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/dns-lookup" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            DNS Lookup →
          </a>
          <a href="/nameserver-lookup" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            Nameserver Lookup
          </a>
          <a href="/tools" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            All Tools
          </a>
        </div>
      </section>
    </StaticPage>
  );
}
