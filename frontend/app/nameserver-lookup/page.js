import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import NameserverLookupTool from './NameserverLookupTool';

export const metadata = {
  title: 'Nameserver Lookup — Find NS Records for Any Domain | DomyDomains',
  description: 'Free nameserver lookup tool to find NS records, DNS provider, IP addresses, and SOA details for any domain. Identify which DNS hosting provider a domain uses.',
  keywords: 'nameserver lookup, NS record lookup, DNS provider checker, find nameservers, NS records, domain nameserver, DNS hosting provider, SOA record, nameserver IP',
  alternates: { canonical: '/nameserver-lookup' },
  openGraph: {
    title: 'Nameserver Lookup — Find NS Records for Any Domain',
    description: 'Find nameservers, DNS provider, IP addresses, and SOA details for any domain instantly. Free client-side tool.',
    url: 'https://domydomains.com/nameserver-lookup',
  },
};

export default function NameserverLookupPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Nameserver Lookup Tool"
        description="Find NS records, DNS hosting provider, IP addresses, and SOA details for any domain name."
        url="/nameserver-lookup"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Nameserver Lookup
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Look up nameserver (NS) records for any domain. See which DNS hosting provider is used,
        resolve nameserver IP addresses, and view SOA authority details — all from your browser.
      </p>

      <NameserverLookupTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Are Nameservers?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          Nameservers (NS records) are the backbone of domain name resolution. When someone types your domain
          into a browser, the first thing the internet does is ask the nameservers where to find your website.
          Every domain has at least two nameservers that store all DNS records — A records pointing to your web
          server, MX records for email, TXT records for verification, and more.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          Think of nameservers as the address book for your domain. They tell the internet where everything
          lives. If your nameservers go down, your entire online presence — website, email, everything —
          becomes unreachable. That&apos;s why most domains use two or more nameservers for redundancy.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Look Up Nameservers?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Identify DNS Provider', desc: 'Find out if a domain uses Cloudflare, AWS Route 53, Google Cloud DNS, or another provider. Useful for competitive research.', icon: '🔍' },
            { title: 'Troubleshoot DNS Issues', desc: 'Website not loading? Checking nameservers is the first step. Misconfigured or expired NS records break everything.', icon: '🔧' },
            { title: 'Domain Transfer Prep', desc: 'Before transferring a domain, document current nameservers. After transfer, verify they stayed correct or update them.', icon: '🔄' },
            { title: 'Verify DNS Migration', desc: 'Moving to a new DNS provider? Verify the nameserver change propagated correctly and the old records are gone.', icon: '✅' },
            { title: 'Security Auditing', desc: 'Unauthorized nameserver changes can redirect all traffic. Regular NS monitoring detects domain hijacking early.', icon: '🛡️' },
            { title: 'Infrastructure Research', desc: 'NS records reveal hosting infrastructure. Combined with IP lookups, you can map out how websites are architected.', icon: '🏗️' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common DNS Providers</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          Your choice of DNS provider affects website speed, uptime, and security. Here are the most popular
          DNS hosting providers you&apos;ll see when looking up nameservers:
        </p>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            { name: 'Cloudflare', ns: 'ns1.cloudflare.com', note: 'Free tier with DDoS protection and CDN. Most popular choice for performance.' },
            { name: 'AWS Route 53', ns: 'ns-xxx.awsdns-xx.com', note: 'Enterprise-grade DNS with 100% SLA. Integrated with AWS services.' },
            { name: 'Google Cloud DNS', ns: 'ns-cloud-x.googledomains.com', note: 'Low-latency global anycast DNS with high availability.' },
            { name: 'GoDaddy', ns: 'nsXX.domaincontrol.com', note: 'Default nameservers for GoDaddy-registered domains.' },
            { name: 'Namecheap', ns: 'dns1.registrar-servers.com', note: 'Default nameservers for Namecheap domains. Solid for basic needs.' },
          ].map(p => (
            <div key={p.name} style={{ background: '#111', borderRadius: '8px', padding: '14px 16px', border: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: '#8b5cf6' }}>{p.name}</span>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', color: '#666' }}>{p.ns}</span>
              </div>
              <p style={{ color: '#999', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding SOA Records</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          The SOA (Start of Authority) record contains administrative information about a DNS zone. Our tool
          displays the full SOA breakdown including the primary nameserver, admin contact email, zone serial
          number, and timing values that control how often secondary nameservers sync with the primary.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8 }}>
          The serial number is especially useful — it increments every time DNS records change. If you&apos;ve
          just updated DNS and want to confirm the change reached authoritative nameservers, check whether
          the serial number increased. The refresh and retry intervals tell you how frequently secondary
          servers check for updates, which impacts DNS propagation speed.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { q: 'How many nameservers should a domain have?', a: 'At minimum two for redundancy — if one goes down, the other keeps your domain accessible. Many providers use four or more for higher availability.' },
            { q: 'How long does a nameserver change take?', a: 'Nameserver changes typically propagate within 24-48 hours, but most resolvers update within a few hours. The NS record TTL value affects timing.' },
            { q: 'Can I use different DNS providers simultaneously?', a: 'Yes, multi-provider DNS (also called secondary DNS) is possible but requires keeping records synchronized across providers. It provides maximum redundancy.' },
            { q: 'What happens if nameservers are misconfigured?', a: 'Your domain becomes unreachable. Website, email, and any services using the domain will stop working until NS records are corrected.' },
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
