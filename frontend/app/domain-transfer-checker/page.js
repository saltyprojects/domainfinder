import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainTransferChecker from './DomainTransferChecker';

export const metadata = {
  title: 'Domain Transfer Checker — Can You Transfer Your Domain? | DomyDomains',
  description: 'Free domain transfer checker. Check if your domain is eligible for transfer by analyzing EPP status codes, transfer locks, ICANN 60-day rules, and expiration dates. No signup required.',
  keywords: 'domain transfer checker, transfer domain, domain transfer status, EPP status codes, transfer lock check, clientTransferProhibited, domain transfer eligibility, move domain to new registrar, domain unlock checker, ICANN transfer rules',
  alternates: { canonical: '/domain-transfer-checker' },
  openGraph: {
    title: 'Domain Transfer Checker — Can You Transfer Your Domain?',
    description: 'Check if your domain is eligible for transfer. Analyzes transfer locks, EPP status codes, ICANN rules, and expiration dates — all free.',
    url: 'https://domydomains.com/domain-transfer-checker',
  },
};

export default function DomainTransferCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Transfer Checker"
        description="Check if a domain is eligible for transfer to another registrar. Analyzes EPP status codes, transfer locks, ICANN 60-day rules, and expiration dates using public RDAP data."
        url="/domain-transfer-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Transfer Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Check if your domain is eligible for transfer to a new registrar. This tool analyzes EPP status codes, 
        transfer locks, and ICANN rules to tell you exactly what&apos;s blocking your transfer — or confirm you&apos;re 
        good to go.
      </p>

      <DomainTransferChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is a Domain Transfer?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            A domain transfer is the process of moving your domain name registration from one registrar to another. 
            You might want to transfer a domain to take advantage of better pricing, superior customer support, 
            improved management tools, or to consolidate all your domains under a single provider. The transfer 
            process is governed by ICANN (Internet Corporation for Assigned Names and Numbers) policies that protect 
            domain owners from unauthorized transfers while ensuring the process remains straightforward for 
            legitimate requests.
          </p>
          <p style={{ marginTop: '16px' }}>
            Before initiating a transfer, you need to verify that your domain meets several requirements. The domain 
            must be unlocked at your current registrar, it must have been registered for at least 60 days, and it 
            must not be expiring within the next 15 days. This tool checks all these conditions automatically by 
            querying the domain&apos;s RDAP records — the modern replacement for WHOIS — to analyze its current 
            EPP (Extensible Provisioning Protocol) status codes and registration dates.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding EPP Status Codes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {[
            { code: 'clientTransferProhibited', color: '#ef4444', impact: 'Blocks Transfer', desc: 'The registrar has locked the domain to prevent transfers. This is the most common lock and is set by default at many registrars. You can remove it through your registrar\'s control panel.' },
            { code: 'serverTransferProhibited', color: '#ef4444', impact: 'Blocks Transfer', desc: 'A registry-level lock that prevents transfers. Usually applied during legal disputes, UDRP proceedings, or by premium domain registries. Contact the registry to resolve.' },
            { code: 'ok / active', color: '#22c55e', impact: 'No Restriction', desc: 'The domain is active with no special restrictions. This is the ideal status for initiating a transfer. If this is the only status code, the domain is likely transferable.' },
            { code: 'pendingTransfer', color: '#8b5cf6', impact: 'Transfer Active', desc: 'A transfer is already in progress. You\'ll need to wait for it to complete or cancel the existing transfer before starting a new one.' },
            { code: 'clientHold / serverHold', color: '#f59e0b', impact: 'May Block Transfer', desc: 'The domain is suspended and won\'t resolve in DNS. Domains on hold typically cannot be transferred until the hold is removed by the registrar or registry.' },
            { code: 'redemptionPeriod', color: '#ef4444', impact: 'Blocks Transfer', desc: 'The domain has expired and entered redemption. It must be restored (usually at a premium fee) before any transfer can be initiated.' },
          ].map(item => (
            <div key={item.code} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e', borderTop: `3px solid ${item.color}` }}>
              <code style={{ color: item.color, fontSize: '0.85rem', fontFamily: 'ui-monospace, monospace' }}>{item.code}</code>
              <span style={{ marginLeft: '10px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: `${item.color}20`, color: item.color }}>{item.impact}</span>
              <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6, marginTop: '10px' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Transfer a Domain</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { step: '1', title: 'Verify Eligibility', desc: 'Use this tool to check that your domain has no transfer locks, is older than 60 days, and isn\'t expiring soon. Resolve any blockers first.' },
            { step: '2', title: 'Unlock the Domain', desc: 'Log into your current registrar and disable the transfer lock (clientTransferProhibited). This is usually found in domain settings or security settings.' },
            { step: '3', title: 'Get the Auth Code (EPP Code)', desc: 'Request an authorization code from your current registrar. This code proves you own the domain and is required by the new registrar to initiate the transfer.' },
            { step: '4', title: 'Initiate at New Registrar', desc: 'Go to your new registrar, start a domain transfer, enter the domain name and the auth code. Pay the transfer fee (usually includes a 1-year renewal).' },
            { step: '5', title: 'Approve the Transfer', desc: 'You\'ll receive confirmation emails at the domain\'s registrant contact address. Approve the transfer to speed up the process. Otherwise, it auto-completes in 5-7 days.' },
            { step: '6', title: 'Verify DNS Settings', desc: 'After the transfer completes, verify your DNS records are intact. Some transfers preserve DNS settings, while others may require reconfiguration.' },
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
          { q: 'How long does a domain transfer take?', a: 'Most domain transfers complete within 5-7 days. Some registrars allow you to speed this up by approving the transfer via email. The process involves a waiting period mandated by ICANN to prevent unauthorized transfers.' },
          { q: 'Will my website go down during transfer?', a: 'No — your website and email should remain fully functional during the transfer. The domain continues to resolve using its existing DNS settings. However, it\'s wise to avoid making DNS changes during the transfer process.' },
          { q: 'Why can\'t I transfer a domain I just registered?', a: 'ICANN requires a 60-day waiting period after initial registration before a domain can be transferred. This also applies after a previous transfer — you must wait 60 days between transfers. This rule prevents domain theft through rapid successive transfers.' },
          { q: 'What is an auth code / EPP code?', a: 'An authorization code (also called an EPP code, transfer code, or auth-info code) is a unique password that proves domain ownership. You get it from your current registrar and provide it to the new registrar to authorize the transfer. Treat it like a password — don\'t share it publicly.' },
          { q: 'Does transferring a domain extend my registration?', a: 'Yes, in most cases. Domain transfers for gTLDs (.com, .net, .org, etc.) add one year to your existing registration period. So if your domain was set to expire in 6 months, after transfer it would expire in 1 year and 6 months.' },
          { q: 'Can I transfer a domain that\'s about to expire?', a: 'Most registrars won\'t allow transfers within 15 days of expiration. If your domain is expiring soon, renew it first at your current registrar, then initiate the transfer. This is safer and ensures you don\'t lose the domain.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 5 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>More domain tools</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Check DNS records, verify SSL certificates, find domain age, and more — all free.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/domain-age-checker" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Domain Age Checker →
          </a>
          <a href="/domain-expiration" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            Expiration Checker
          </a>
          <a href="/tools" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            All Tools
          </a>
        </div>
      </section>
    </StaticPage>
  );
}
