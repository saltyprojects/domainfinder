import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DnsLookupTool from './DnsLookupTool';

export const metadata = {
  title: 'DNS Lookup Tool — Check DNS Records for Any Domain | DomyDomains',
  description: 'Free DNS lookup tool to check A, AAAA, MX, NS, TXT, CNAME, and SOA records for any domain. Troubleshoot DNS issues and verify domain configuration.',
  keywords: 'DNS lookup, DNS records, A record, MX record, NS record, TXT record, CNAME, SOA, DNS checker, domain DNS',
  alternates: { canonical: '/dns-lookup' },
  openGraph: {
    title: 'DNS Lookup Tool — Check DNS Records for Any Domain',
    description: 'Check all DNS records for any domain including A, AAAA, MX, NS, TXT, CNAME, and SOA records instantly.',
    url: 'https://domydomains.com/dns-lookup',
  },
};

export default function DnsLookupPage() {
  return (
    <StaticPage>
      <ToolSchema 
        name="DNS Lookup Tool" 
        description="Check all DNS records for any domain including A, AAAA, MX, NS, TXT, CNAME, and SOA records."
        url="/dns-lookup" 
      />
      
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        DNS Lookup Tool
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Check all DNS records for any domain instantly. View A, AAAA, MX, NS, TXT, CNAME, and SOA records 
        to troubleshoot DNS issues or verify domain configuration.
      </p>

      <DnsLookupTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>DNS Record Types Explained</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { type: 'A Record', desc: 'Maps domain to IPv4 address (e.g., 192.168.1.1)', use: 'Points your domain to a web server' },
            { type: 'AAAA Record', desc: 'Maps domain to IPv6 address (e.g., 2001:db8::1)', use: 'IPv6 version of A record for modern internet' },
            { type: 'MX Record', desc: 'Mail exchange servers that handle email for the domain', use: 'Required for receiving emails' },
            { type: 'NS Record', desc: 'Name servers that host the DNS zone for the domain', use: 'Controls which servers answer DNS queries' },
            { type: 'TXT Record', desc: 'Text records for verification, SPF, DKIM, and other data', use: 'Email security, domain verification, site ownership' },
            { type: 'CNAME Record', desc: 'Canonical name that points to another domain', use: 'Aliases like www.example.com → example.com' },
            { type: 'SOA Record', desc: 'Start of Authority with zone information and settings', use: 'Administrative info about the DNS zone' },
          ].map(record => (
            <div key={record.type} style={{ background: '#111', borderRadius: '8px', padding: '16px', border: '1px solid #1e1e1e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '4px' }}>{record.type}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#ccc', margin: 0, lineHeight: 1.5 }}>{record.desc}</p>
                </div>
                <div style={{ minWidth: '150px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>Use case:</div>
                  <div style={{ fontSize: '0.85rem', color: '#999' }}>{record.use}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Check DNS Records?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minMax(270px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Troubleshoot Website Issues', desc: 'Site not loading? Check if A/AAAA records point to the right server.', icon: '🔧' },
            { title: 'Verify Email Setup', desc: 'Email not working? Check MX records and SPF/DKIM settings in TXT records.', icon: '📧' },
            { title: 'Domain Transfer Prep', desc: 'Before transferring, verify current DNS setup to avoid downtime.', icon: '🔄' },
            { title: 'Security Auditing', desc: 'Check for suspicious DNS records or misconfigurations.', icon: '🔒' },
            { title: 'Competitor Research', desc: 'See what hosting and email providers competitors use.', icon: '🔍' },
            { title: 'CDN Configuration', desc: 'Verify CDN setup with CNAME records and edge server locations.', icon: '🌐' },
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common DNS Issues and Solutions</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ef4444', marginBottom: '12px' }}>🚫 Website Not Loading</h3>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '6px' }}>Check if A record exists and points to the correct IP address</li>
              <li style={{ marginBottom: '6px' }}>Verify the web server is running on that IP</li>
              <li style={{ marginBottom: '6px' }}>Check if domain has CNAME pointing to the wrong location</li>
            </ul>
          </div>
          
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f59e0b', marginBottom: '12px' }}>📬 Email Not Working</h3>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '6px' }}>Ensure MX records point to your email provider's servers</li>
              <li style={{ marginBottom: '6px' }}>Check SPF record in TXT records to prevent spam flagging</li>
              <li style={{ marginBottom: '6px' }}>Verify DKIM and DMARC records for email authentication</li>
            </ul>
          </div>
          
          <div style={{ background: '#111', borderRadius: '12px', padding: '24px', border: '1px solid #1e1e1e' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#22c55e', marginBottom: '12px' }}>🌐 DNS Propagation Delays</h3>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '6px' }}>DNS changes can take 24-48 hours to propagate globally</li>
              <li style={{ marginBottom: '6px' }}>Use multiple DNS checkers to see propagation status</li>
              <li style={{ marginBottom: '6px' }}>Lower TTL values before making changes for faster updates</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding TTL Values</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Time To Live (TTL) determines how long DNS records are cached by resolvers. Lower values mean faster updates but more DNS queries.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
            {[
              { ttl: '300 seconds (5 min)', use: 'During DNS changes', desc: 'Quick updates, higher load' },
              { ttl: '3600 seconds (1 hour)', use: 'Normal operations', desc: 'Balanced performance' },
              { ttl: '86400 seconds (24 hours)', use: 'Stable domains', desc: 'Best performance, slower changes' },
            ].map(item => (
              <div key={item.ttl} style={{ background: '#111', borderRadius: '8px', padding: '16px', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '4px' }}>{item.ttl}</div>
                <div style={{ fontSize: '0.8rem', color: '#22c55e', marginBottom: '4px' }}>{item.use}</div>
                <div style={{ fontSize: '0.8rem', color: '#999' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'How often is DNS data updated?', a: 'Our tool queries Google\'s public DNS servers in real-time, so you see current DNS records as they exist on the internet.' },
          { q: 'Why might some records not appear?', a: 'If a domain doesn\'t have certain record types (like MX for email), they simply won\'t exist. This is normal for domains not using those services.' },
          { q: 'What if DNS lookup fails?', a: 'This usually means the domain doesn\'t exist, is misconfigured, or there are network issues. Double-check the domain spelling.' },
          { q: 'Can I see historical DNS data?', a: 'This tool shows current records only. For historical DNS data, you\'d need specialized services like SecurityTrails or DNSHistory.' },
          { q: 'Is my DNS lookup private?', a: 'We don\'t log your queries, but they do pass through Google\'s public DNS service (8.8.8.8) which may have its own logging policies.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Need more domain tools?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Check domain age, availability, and generate domain names with our other tools.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/domain-age-checker" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            Domain Age Checker
          </a>
          <a href="/" style={{ display: 'inline-block', background: '#333', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            Domain Search
          </a>
        </div>
      </section>
    </StaticPage>
  );
}