import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DnsPropagationChecker from './DnsPropagationChecker';

export const metadata = {
  title: 'DNS Propagation Checker — Check DNS Records Worldwide | DomyDomains',
  description: 'Free DNS propagation checker tool. Check if your DNS changes have propagated across global DNS servers. Test A, AAAA, CNAME, MX, TXT, NS, and SOA records from multiple locations worldwide.',
  keywords: 'DNS propagation checker, DNS propagation test, check DNS propagation, DNS spread, global DNS check, DNS update checker, DNS record propagation, has my DNS updated, DNS propagation tool, DNS change checker',
  alternates: { canonical: '/dns-propagation-checker' },
  openGraph: {
    title: 'DNS Propagation Checker — Check DNS Records Worldwide',
    description: 'Check if your DNS changes have propagated globally. Query multiple DNS servers worldwide for A, AAAA, MX, CNAME, TXT, NS, and SOA records.',
    url: 'https://domydomains.com/dns-propagation-checker',
  },
};

export default function DnsPropagationCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="DNS Propagation Checker"
        description="Check if DNS record changes have propagated across global DNS resolvers. Test A, AAAA, CNAME, MX, TXT, NS, and SOA records from multiple DNS servers worldwide."
        url="/dns-propagation-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        DNS Propagation Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Check whether your DNS changes have propagated across global DNS servers. Query multiple resolvers
        worldwide for A, AAAA, CNAME, MX, TXT, NS, and SOA records — all from your browser.
      </p>

      <DnsPropagationChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is DNS Propagation?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          DNS propagation is the process of updating DNS records across all DNS servers around the world. When
          you change your domain&apos;s DNS records — whether updating an A record to point to a new server,
          changing MX records for a new email provider, or switching nameservers entirely — those changes
          don&apos;t take effect instantly. Instead, they gradually spread (propagate) through the global
          network of DNS resolvers and caches.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          Each DNS server caches records for a period defined by the TTL (Time to Live) value. Until the
          cached record expires, that server continues serving the old data. This means different users
          around the world may see different results for the same domain during propagation. Some will
          reach your new server while others are still directed to the old one.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How Long Does DNS Propagation Take?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          DNS propagation typically takes anywhere from a few minutes to 48 hours, depending on several
          factors. The most important factor is the TTL value of your DNS records. If your records had a
          TTL of 300 seconds (5 minutes), most resolvers will refresh within that timeframe. Records with
          longer TTLs of 86400 seconds (24 hours) naturally take longer to propagate.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {[
            { title: 'TTL Value', desc: 'Lower TTL values mean faster propagation. Before making DNS changes, reduce your TTL to 300 seconds and wait for the old TTL to expire.', icon: '⏱️' },
            { title: 'ISP Caching', desc: 'Some ISPs cache DNS records aggressively, sometimes beyond the TTL. This can cause delays for users on specific networks.', icon: '🏢' },
            { title: 'Record Type', desc: 'Simple A record changes propagate fastest. Nameserver changes take longer because they involve the parent zone (e.g., .com TLD servers).', icon: '📝' },
            { title: 'Resolver Behavior', desc: 'Major resolvers like Google (8.8.8.8) and Cloudflare (1.1.1.1) strictly respect TTL. Smaller ISP resolvers may lag behind.', icon: '🖥️' },
          ].map(item => (
            <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>DNS Record Types Explained</h2>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            { type: 'A', desc: 'Maps a domain to an IPv4 address (e.g., 93.184.216.34). The most common record type — it tells browsers where your website lives.' },
            { type: 'AAAA', desc: 'Maps a domain to an IPv6 address. As IPv6 adoption grows, this record becomes increasingly important for modern connectivity.' },
            { type: 'CNAME', desc: 'Creates an alias from one domain to another. Used to point subdomains (like www) to the main domain or a CDN endpoint.' },
            { type: 'MX', desc: 'Specifies mail servers for the domain. Critical for email delivery — incorrect MX records mean lost emails.' },
            { type: 'TXT', desc: 'Stores text data for verification, SPF email authentication, DKIM signatures, DMARC policies, and domain ownership proof.' },
            { type: 'NS', desc: 'Defines the authoritative nameservers for the domain. Changing NS records is the most impactful DNS change you can make.' },
            { type: 'SOA', desc: 'Start of Authority record containing zone administration data — primary nameserver, admin contact, serial number, and timing values.' },
          ].map(item => (
            <div key={item.type} style={{ background: '#111', borderRadius: '8px', padding: '14px 16px', border: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{
                  padding: '3px 10px', background: '#8b5cf6', color: '#fff', borderRadius: '4px',
                  fontWeight: 700, fontSize: '0.8rem', fontFamily: 'ui-monospace, monospace', whiteSpace: 'nowrap',
                }}>
                  {item.type}
                </span>
                <p style={{ color: '#999', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Tips for Faster DNS Propagation</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          While you can&apos;t force DNS propagation to happen instantly, you can take steps to minimize
          the wait. The most effective strategy is planning ahead: lower your TTL to 300 seconds (5 minutes)
          at least 24-48 hours before making any DNS changes. This ensures the old, high-TTL records expire
          from caches before you make the switch. After the change is confirmed propagated, you can raise
          the TTL back to a longer value like 3600 or 86400 to reduce DNS query load.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8 }}>
          If you&apos;re migrating a website, keep the old server running during propagation. Some visitors
          will still reach the old IP address until propagation completes. Configure both old and new servers
          to serve valid content to avoid downtime for any user. Our DNS propagation checker helps you
          monitor the process in real time — check back periodically to see when all global resolvers
          have updated to your new records.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { q: 'Why do different DNS servers show different results?', a: 'Each DNS server independently caches records based on TTL values. During propagation, some servers still have the old cached record while others have fetched the new one. This is normal and resolves as caches expire.' },
            { q: 'Can I speed up DNS propagation?', a: 'You can\'t force it, but lowering your TTL before making changes helps significantly. Set TTL to 300 seconds at least 24 hours before the planned change, then make the switch.' },
            { q: 'My DNS shows propagated but the site still shows old content?', a: 'Your browser has its own DNS cache separate from DNS servers. Try clearing your browser cache, using incognito mode, or flushing your OS DNS cache (ipconfig /flushdns on Windows, sudo dscacheutil -flushcache on Mac).' },
            { q: 'How often should I check DNS propagation?', a: 'After making a DNS change, check every 15-30 minutes for the first few hours. Most changes propagate within 1-4 hours for records with low TTL values. Full global propagation can take up to 48 hours.' },
          ].map(faq => (
            <div key={faq.q} style={{ background: '#111', borderRadius: '10px', padding: '16px 20px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px', color: '#fff' }}>{faq.q}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
