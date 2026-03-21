import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import SSLChecker from './SSLChecker';

export const metadata = {
  title: 'SSL Certificate Checker — Check HTTPS Security, Expiry & Validity | DomyDomains',
  description: 'Check SSL certificate status, expiry date, issuer, and security details. Free SSL certificate checker with detailed certificate chain analysis.',
  keywords: 'SSL checker, SSL certificate check, HTTPS checker, SSL expiry, certificate validity, SSL security checker, certificate chain',
  alternates: { canonical: '/ssl-checker' },
  openGraph: {
    title: 'SSL Certificate Checker — Check HTTPS Security, Expiry & Validity',
    description: 'Check SSL certificate status, expiry date, issuer, and security details. Free SSL certificate checker tool.',
    url: 'https://domydomains.com/ssl-checker',
  },
};

export default function SSLCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema 
        name="SSL Certificate Checker" 
        description="Check SSL certificate status, expiry date, issuer, and security details. Free SSL certificate checker with certificate chain analysis."
        url="/ssl-checker" 
      />
      
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        SSL Certificate Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Check SSL certificate status, expiry dates, and security details for any domain. 
        Ensure your website's HTTPS security is properly configured and up-to-date.
      </p>

      <SSLChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why SSL Certificates Matter</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>SSL certificates are crucial for website security, trust, and SEO:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Data Encryption:</strong> Protects sensitive user data during transmission.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>User Trust:</strong> Browsers show security warnings for sites without SSL.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>SEO Ranking:</strong> Google prioritizes HTTPS sites in search results.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Compliance:</strong> Required for PCI DSS, GDPR, and other regulations.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Browser Requirements:</strong> Modern browsers require HTTPS for many features.</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>SSL Certificate Types</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { 
              title: 'Domain Validated (DV)', 
              desc: 'Basic validation, proves domain ownership only',
              security: 'Low',
              timeframe: 'Minutes to hours',
              cost: 'Free to $100/year',
              bestFor: 'Blogs, personal sites, basic e-commerce'
            },
            { 
              title: 'Organization Validated (OV)', 
              desc: 'Validates domain ownership and organization identity',
              security: 'Medium',
              timeframe: '1-3 days',
              cost: '$50-300/year',
              bestFor: 'Business websites, corporate sites'
            },
            { 
              title: 'Extended Validation (EV)', 
              desc: 'Highest validation, shows company name in address bar',
              security: 'High',
              timeframe: '1-2 weeks',
              cost: '$100-1000/year',
              bestFor: 'Banking, e-commerce, high-security sites'
            },
            { 
              title: 'Wildcard SSL', 
              desc: 'Secures domain and all subdomains with single certificate',
              security: 'Varies (DV/OV)',
              timeframe: 'Same as base type',
              cost: '3-5x standard price',
              bestFor: 'Sites with many subdomains'
            },
            { 
              title: 'Multi-Domain (SAN)', 
              desc: 'Single certificate covering multiple different domains',
              security: 'Varies (DV/OV/EV)',
              timeframe: 'Same as base type',
              cost: '$100-500/year',
              bestFor: 'Multiple domains, multi-brand companies'
            },
            { 
              title: 'Code Signing', 
              desc: 'Signs software and applications to prove authenticity',
              security: 'High',
              timeframe: '1-7 days',
              cost: '$100-500/year',
              bestFor: 'Software developers, app publishers'
            },
          ].map(cert => (
            <div key={cert.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: '#8b5cf6' }}>{cert.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>{cert.desc}</p>
              
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Security Level:</span>
                  <span style={{ fontSize: '0.8rem', color: cert.security === 'High' ? '#22c55e' : cert.security === 'Medium' ? '#f59e0b' : '#ef4444' }}>
                    {cert.security}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Issuance:</span>
                  <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{cert.timeframe}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Cost:</span>
                  <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{cert.cost}</span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Best for:</div>
                  <div style={{ fontSize: '0.85rem', color: '#22c55e' }}>{cert.bestFor}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding SSL Check Results</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>Our SSL checker analyzes multiple aspects of your certificate:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#22c55e', marginBottom: '12px' }}>✅ Valid Certificate</h3>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#ccc' }}>
                <li style={{ marginBottom: '6px' }}>Certificate is trusted and valid</li>
                <li style={{ marginBottom: '6px' }}>Not expired or close to expiry</li>
                <li style={{ marginBottom: '6px' }}>Issued by a trusted CA</li>
                <li style={{ marginBottom: '6px' }}>Domain name matches certificate</li>
                <li style={{ marginBottom: '6px' }}>Certificate chain is complete</li>
              </ul>
            </div>
            
            <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b', marginBottom: '12px' }}>⚠️ Warning Signs</h3>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#ccc' }}>
                <li style={{ marginBottom: '6px' }}>Certificate expires within 30 days</li>
                <li style={{ marginBottom: '6px' }}>Weak encryption (&lt; 2048-bit RSA)</li>
                <li style={{ marginBottom: '6px' }}>Using deprecated SHA-1 algorithm</li>
                <li style={{ marginBottom: '6px' }}>Self-signed certificate</li>
                <li style={{ marginBottom: '6px' }}>Domain mismatch warnings</li>
              </ul>
            </div>
            
            <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ef4444', marginBottom: '12px' }}>❌ Critical Issues</h3>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#ccc' }}>
                <li style={{ marginBottom: '6px' }}>Certificate has expired</li>
                <li style={{ marginBottom: '6px' }}>Untrusted certificate authority</li>
                <li style={{ marginBottom: '6px' }}>Certificate revoked</li>
                <li style={{ marginBottom: '6px' }}>Invalid certificate chain</li>
                <li style={{ marginBottom: '6px' }}>No SSL certificate found</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common SSL Issues & Solutions</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            { 
              issue: 'Certificate Expired', 
              cause: 'SSL certificate has passed its expiration date',
              solution: 'Renew the certificate immediately. Set up auto-renewal to prevent future expiration.',
              urgency: 'Critical'
            },
            { 
              issue: 'Domain Mismatch', 
              cause: 'Certificate was issued for a different domain name',
              solution: 'Get a new certificate for the correct domain, or use a wildcard/SAN certificate.',
              urgency: 'High'
            },
            { 
              issue: 'Untrusted CA', 
              cause: 'Certificate issued by an untrusted Certificate Authority',
              solution: 'Replace with a certificate from a trusted CA like Let\'s Encrypt, DigiCert, or Comodo.',
              urgency: 'High'
            },
            { 
              issue: 'Incomplete Certificate Chain', 
              cause: 'Intermediate certificates are missing from the server configuration',
              solution: 'Install the complete certificate chain including intermediate certificates.',
              urgency: 'Medium'
            },
            { 
              issue: 'Mixed Content', 
              cause: 'HTTPS page loading HTTP resources (images, scripts, stylesheets)',
              solution: 'Update all resource URLs to HTTPS or use protocol-relative URLs.',
              urgency: 'Medium'
            },
            { 
              issue: 'Weak Encryption', 
              cause: 'Using outdated encryption algorithms or key sizes',
              solution: 'Upgrade to at least 2048-bit RSA or 256-bit ECC with SHA-256.',
              urgency: 'Low'
            },
          ].map((item, i) => (
            <div key={i} style={{ 
              background: '#111', 
              padding: '20px', 
              borderRadius: '12px', 
              border: `1px solid ${item.urgency === 'Critical' ? '#ef4444' : item.urgency === 'High' ? '#f59e0b' : '#22c55e'}40`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                  {item.issue}
                </h3>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.7rem', 
                  fontWeight: 600,
                  background: `${item.urgency === 'Critical' ? '#ef4444' : item.urgency === 'High' ? '#f59e0b' : '#22c55e'}20`,
                  color: item.urgency === 'Critical' ? '#ef4444' : item.urgency === 'High' ? '#f59e0b' : '#22c55e',
                  border: `1px solid ${item.urgency === 'Critical' ? '#ef4444' : item.urgency === 'High' ? '#f59e0b' : '#22c55e'}40`
                }}>
                  {item.urgency}
                </span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '8px' }}>
                <strong>Cause:</strong> {item.cause}
              </p>
              <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
                <strong>Solution:</strong> {item.solution}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>SSL Best Practices</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>🔐 Certificate Management</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>Set up automatic renewal (90 days for Let's Encrypt)</li>
                <li style={{ marginBottom: '8px' }}>Monitor expiration dates and renew 30+ days early</li>
                <li style={{ marginBottom: '8px' }}>Use wildcard certificates for multiple subdomains</li>
                <li style={{ marginBottom: '8px' }}>Keep private keys secure and never share them</li>
                <li style={{ marginBottom: '8px' }}>Revoke compromised certificates immediately</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>⚙️ Server Configuration</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>Disable weak cipher suites and protocols</li>
                <li style={{ marginBottom: '8px' }}>Enable HTTP Strict Transport Security (HSTS)</li>
                <li style={{ marginBottom: '8px' }}>Implement Certificate Transparency monitoring</li>
                <li style={{ marginBottom: '8px' }}>Use OCSP stapling for faster validation</li>
                <li style={{ marginBottom: '8px' }}>Redirect all HTTP traffic to HTTPS</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>📊 Monitoring & Testing</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>Regular SSL certificate health checks</li>
                <li style={{ marginBottom: '8px' }}>Test with SSL Labs or similar tools</li>
                <li style={{ marginBottom: '8px' }}>Monitor certificate transparency logs</li>
                <li style={{ marginBottom: '8px' }}>Set up expiration alerts and notifications</li>
                <li style={{ marginBottom: '8px' }}>Verify certificate chain completeness</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { 
            q: 'How often should I check my SSL certificate?', 
            a: 'Check monthly for critical sites, weekly for high-traffic sites. Set up automated monitoring to alert you of issues or upcoming expiration within 30 days.'
          },
          { 
            q: 'What happens if my SSL certificate expires?', 
            a: 'Browsers will show security warnings to users, potentially blocking access. Search engines may also penalize expired HTTPS sites. Renew immediately to restore trust.'
          },
          { 
            q: 'Are free SSL certificates as secure as paid ones?', 
            a: 'Yes, the encryption is identical. Free certificates (like Let\'s Encrypt) provide Domain Validation only. Paid certificates may offer Organization or Extended Validation for additional trust indicators.'
          },
          { 
            q: 'Why can\'t I check some domains directly?', 
            a: 'Browser security policies prevent direct certificate checking from websites. For domains with connection issues, we provide instructions to check manually or use external tools.'
          },
          { 
            q: 'What SSL grade should I aim for?', 
            a: 'Aim for an A+ grade on SSL Labs. This requires modern protocols, strong ciphers, HSTS, and proper certificate configuration. Avoid anything below B grade.'
          },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Need help securing your domain?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Secure your domain with proper SSL certificates and HTTPS configuration.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/domain-security" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Domain security guide →
          </a>
          <a href="https://www.ssllabs.com/ssltest/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            SSL Labs Test
          </a>
        </div>
      </section>
    </StaticPage>
  );
}