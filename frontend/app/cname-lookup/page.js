import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import CnameLookupTool from './CnameLookupTool';

export const metadata = {
  title: 'CNAME Lookup Tool — Check CNAME Records & Follow DNS Chains | DomyDomains',
  description: 'Free CNAME lookup tool. Check CNAME records for any domain, follow the full DNS chain, detect hosting providers (Vercel, Netlify, AWS, Cloudflare), and resolve final IP addresses.',
  keywords: 'CNAME lookup, CNAME record checker, DNS CNAME, canonical name lookup, CNAME chain, domain alias lookup, check CNAME record, DNS chain resolver, hosting provider detector',
  alternates: { canonical: '/cname-lookup' },
  openGraph: {
    title: 'CNAME Lookup Tool — Check CNAME Records & Follow DNS Chains',
    description: 'Instantly look up CNAME records, follow the full DNS alias chain, detect hosting providers, and resolve final IP addresses — free and fast.',
    url: 'https://domydomains.com/cname-lookup',
  },
};

export default function CnameLookupPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="CNAME Lookup Tool"
        description="Look up CNAME (canonical name) records for any domain. Follow the full DNS alias chain, detect hosting providers, and resolve final IP addresses."
        url="/cname-lookup"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        CNAME Lookup Tool
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Look up CNAME records for any domain or subdomain. Follow the complete DNS alias chain,
        automatically detect hosting providers like Vercel, Netlify, and AWS, and see the final
        IP address resolution — all instantly and free.
      </p>

      <CnameLookupTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is a CNAME Record?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A CNAME (Canonical Name) record is a type of DNS record that maps one domain name to another.
          Instead of pointing directly to an IP address like an A record, a CNAME creates an alias — essentially
          saying &quot;this domain is the same as that domain.&quot; When a DNS resolver encounters a CNAME record,
          it follows the alias to the target domain and continues resolving until it reaches an A or AAAA record
          with the actual IP address.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          CNAME records are one of the most commonly used DNS record types. They are essential for connecting
          custom domains to hosting platforms, CDNs, and cloud services. For example, when you point{' '}
          <code style={{ color: '#8b5cf6', background: '#111', padding: '2px 6px', borderRadius: '4px' }}>
            www.example.com
          </code>{' '}
          to your Netlify or Vercel deployment, you are creating a CNAME record. The beauty of CNAMEs is that
          the hosting provider can change their underlying IP addresses without you needing to update your DNS.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Our CNAME lookup tool does more than a basic query — it follows the entire CNAME chain, which can
          span multiple levels deep. Some CDN providers use nested CNAME records for load balancing and
          geographic routing. We also automatically detect over 30 popular hosting and cloud services from
          the CNAME targets, helping you understand a domain&apos;s infrastructure at a glance.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>CNAME vs Other DNS Records</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Record Type</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Points To</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Use Case</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#999', fontWeight: 500 }}>Root Domain?</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'CNAME', points: 'Another domain name', use: 'Aliases, subdomains, cloud services', root: '❌ No', color: '#8b5cf6' },
                { type: 'A', points: 'IPv4 address', use: 'Direct domain-to-IP mapping', root: '✅ Yes', color: '#22c55e' },
                { type: 'AAAA', points: 'IPv6 address', use: 'Direct domain-to-IPv6 mapping', root: '✅ Yes', color: '#3b82f6' },
                { type: 'ALIAS/ANAME', points: 'Another domain name', use: 'Root domain aliases (provider-specific)', root: '✅ Yes', color: '#eab308' },
              ].map(row => (
                <tr key={row.type} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '10px 12px', color: row.color, fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>{row.type}</td>
                  <td style={{ padding: '10px 12px', color: '#ccc' }}>{row.points}</td>
                  <td style={{ padding: '10px 12px', color: '#999' }}>{row.use}</td>
                  <td style={{ padding: '10px 12px', color: '#ccc' }}>{row.root}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Look Up CNAME Records?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🔧', title: 'DNS Troubleshooting', desc: 'Website not loading? Check if CNAME records are correctly configured and pointing to the right destination.' },
            { icon: '🏢', title: 'Identify Hosting Providers', desc: 'Discover where a website is hosted by examining CNAME targets — detect Vercel, Netlify, AWS, Cloudflare, and more.' },
            { icon: '🔗', title: 'Follow CNAME Chains', desc: 'CDNs and cloud services often chain CNAME records. Our tool follows the entire chain to the final IP resolution.' },
            { icon: '🔄', title: 'Migration Planning', desc: 'Before migrating a domain, document all existing CNAME records and their targets to avoid breaking subdomains.' },
            { icon: '🔒', title: 'Security Auditing', desc: 'Detect dangling CNAMEs that point to decommissioned services — a common subdomain takeover vulnerability.' },
            { icon: '🕵️', title: 'Competitive Intelligence', desc: 'Understand what infrastructure stack competitors use by examining their CNAME records and detected services.' },
          ].map(item => (
            <div key={item.title} style={{
              background: '#111', borderRadius: '12px', padding: '20px',
              border: '1px solid #1e1e1e',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Important CNAME Rules</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              rule: 'CNAMEs Cannot Coexist',
              desc: 'A CNAME record cannot be placed alongside any other record type (A, MX, TXT, etc.) for the same name. This is why CNAME records typically cannot be used at the root/apex of a domain — the root domain needs SOA and NS records.',
              color: '#ef4444',
            },
            {
              rule: 'No Root Domain CNAMEs',
              desc: 'You cannot set a CNAME on a bare domain (example.com). CNAMEs only work on subdomains (www.example.com, blog.example.com). Some DNS providers offer ALIAS/ANAME records as a workaround.',
              color: '#eab308',
            },
            {
              rule: 'CNAME Chains Add Latency',
              desc: 'Each CNAME in a chain requires an additional DNS lookup. While most resolvers handle this quickly, deeply nested chains can add noticeable latency to the first connection.',
              color: '#f97316',
            },
            {
              rule: 'TTL Matters for Changes',
              desc: 'When changing a CNAME record, the old value may persist in DNS caches until the TTL expires. Lower TTLs before planned changes to ensure faster propagation.',
              color: '#3b82f6',
            },
          ].map(item => (
            <div key={item.rule} style={{
              background: '#111', borderRadius: '10px', padding: '16px 20px',
              border: '1px solid #1e1e1e', borderLeft: `3px solid ${item.color}`,
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{item.rule}</h3>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              q: 'What is a CNAME chain?',
              a: 'A CNAME chain occurs when a CNAME record points to another domain that also has a CNAME record, creating a sequence of aliases. For example, www.example.com → cdn.example.com → d123.cloudfront.net → an IP address. Our tool automatically follows and displays the entire chain.'
            },
            {
              q: 'Why does my domain have no CNAME record?',
              a: 'Root domains (like example.com without www) typically use A records instead of CNAME records due to DNS specification restrictions. Subdomains (www, blog, shop) are more likely to have CNAME records. If a subdomain has no CNAME, it may use an A record pointing directly to an IP.'
            },
            {
              q: 'What is a dangling CNAME?',
              a: 'A dangling CNAME is a CNAME record that points to a domain or service that no longer exists. This is a security risk because an attacker could potentially register the target domain and take over the subdomain. Regular CNAME audits help identify these vulnerabilities.'
            },
            {
              q: 'Can CNAME records affect website performance?',
              a: 'CNAME records add one extra DNS lookup per level of the chain. While modern DNS resolvers are fast (typically 1-50ms per lookup), deeply nested chains or high-TTL misconfigurations can occasionally impact initial page load times. Once resolved, the result is cached.'
            },
            {
              q: 'How do I set up a CNAME record?',
              a: 'Log into your DNS provider or domain registrar, navigate to DNS management, and add a new CNAME record. You\'ll need the subdomain name (e.g., "www") and the target domain (e.g., "mysite.vercel.app"). Changes typically propagate within minutes to hours depending on TTL settings.'
            },
          ].map(faq => (
            <div key={faq.q} style={{
              background: '#111', borderRadius: '10px', padding: '16px 20px',
              border: '1px solid #1e1e1e',
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{faq.q}</h3>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </StaticPage>
  );
}
