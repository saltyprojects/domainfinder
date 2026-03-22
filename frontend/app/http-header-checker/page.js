import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import HttpHeaderChecker from './HttpHeaderChecker';

export const metadata = {
  title: 'HTTP Header Checker — Analyze Response Headers & Security Score | DomyDomains',
  description: 'Free HTTP header checker tool. Inspect response headers, analyze security headers, and get a security score for any website. Check HSTS, CSP, X-Frame-Options, and more.',
  keywords: 'http header checker, check http headers, response header analyzer, security header checker, hsts checker, csp checker, http headers tool, website header check, http response headers',
  alternates: { canonical: '/http-header-checker' },
  openGraph: {
    title: 'HTTP Header Checker — Analyze Response Headers & Security Score',
    description: 'Inspect HTTP response headers for any website. Free security header audit with CSP, HSTS, and more.',
    url: 'https://domydomains.com/http-header-checker',
  },
};

export default function HttpHeaderCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="HTTP Header Checker"
        description="Inspect HTTP response headers and analyze security headers for any website. Free tool with security score, header categorization, and detailed audit."
        url="/http-header-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        HTTP Header Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Inspect HTTP response headers for any website. Analyze security headers, caching policies, server info, 
        and CORS configuration — all from your browser. Get an instant security score and actionable recommendations.
      </p>

      <HttpHeaderChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Are HTTP Headers?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            HTTP headers are metadata sent between your browser and a web server with every request and response. 
            They control caching behavior, security policies, content types, authentication, and much more. 
            Response headers tell your browser how to handle the content it receives — whether to cache it, 
            what character encoding to use, and which security restrictions to enforce.
          </p>
          <p style={{ marginTop: '16px' }}>
            Understanding HTTP headers is essential for web developers, security analysts, and SEO professionals. 
            Misconfigured headers can lead to security vulnerabilities, poor performance, and crawling issues that 
            affect your search rankings. This tool makes it easy to inspect any website's headers without using 
            command-line tools like curl or browser developer tools.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Security Headers Explained</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Security headers are the first line of defense for any website. They instruct browsers to enforce 
            specific security policies that protect users from common attacks like cross-site scripting (XSS), 
            clickjacking, and protocol downgrade attacks. Our security audit checks for the most important ones:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' }}>
            {[
              { header: 'Strict-Transport-Security', abbr: 'HSTS', icon: '🔒', desc: 'Forces all connections to use HTTPS. The max-age directive sets how long browsers should remember this policy. Include includeSubDomains for full coverage.' },
              { header: 'Content-Security-Policy', abbr: 'CSP', icon: '🛡️', desc: 'The most powerful security header. Defines exactly which resources (scripts, styles, images) can load on your page, effectively blocking XSS attacks.' },
              { header: 'X-Frame-Options', abbr: 'XFO', icon: '🖼️', desc: 'Prevents your page from being embedded in iframes on other sites. Set to DENY or SAMEORIGIN to block clickjacking attacks.' },
              { header: 'X-Content-Type-Options', abbr: 'XCTO', icon: '📄', desc: 'Set to nosniff to prevent browsers from guessing content types, which can lead to security vulnerabilities with user-uploaded files.' },
              { header: 'Referrer-Policy', abbr: 'RP', icon: '🔗', desc: 'Controls how much URL information is shared when users navigate away. strict-origin-when-cross-origin is a good default for privacy and analytics.' },
              { header: 'Permissions-Policy', abbr: 'PP', icon: '🎛️', desc: 'Restricts which browser APIs (camera, microphone, geolocation, payment) your page and embedded iframes can access.' },
            ].map(item => (
              <div key={item.header} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px', color: '#fff' }}>{item.header}</h3>
                <span style={{ fontSize: '0.7rem', color: '#8b5cf6', fontWeight: 600 }}>{item.abbr}</span>
                <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6, margin: '8px 0 0' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Header Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { color: '#8b5cf6', label: 'Security', icon: '🛡️', desc: 'Headers that protect against XSS, clickjacking, MIME sniffing, and protocol downgrade attacks. Critical for any production website.', examples: 'HSTS, CSP, X-Frame-Options' },
            { color: '#f59e0b', label: 'Caching', icon: '⚡', desc: 'Control how browsers and CDNs cache your content. Proper caching headers reduce server load and improve page load times dramatically.', examples: 'Cache-Control, ETag, Expires' },
            { color: '#3b82f6', label: 'Server', icon: '🖥️', desc: 'Reveal information about the web server technology. Consider removing these in production to reduce your attack surface.', examples: 'Server, X-Powered-By, Via' },
            { color: '#22c55e', label: 'Content', icon: '📦', desc: 'Define the type, encoding, and length of the response body. Correct content-type headers prevent rendering issues and security problems.', examples: 'Content-Type, Content-Encoding' },
            { color: '#ec4899', label: 'CORS', icon: '🌐', desc: 'Cross-Origin Resource Sharing headers control which domains can access your API or resources. Essential for frontend-backend communication.', examples: 'Access-Control-Allow-Origin' },
          ].map(cat => (
            <div key={cat.label} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: `1px solid ${cat.color}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: cat.color, margin: 0 }}>{cat.label}</h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 8px' }}>{cat.desc}</p>
              <span style={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>e.g. {cat.examples}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why HTTP Headers Matter for SEO</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Search engines use HTTP headers to understand how to crawl and index your website. Incorrect caching 
            headers can cause search engines to see stale content. Missing security headers may flag your site as 
            less trustworthy. Here are the headers that directly impact your search rankings:
          </p>
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {[
              { header: 'X-Robots-Tag', impact: 'Directly controls search engine crawling and indexing at the server level, similar to meta robots tags but applies to non-HTML resources like PDFs and images.' },
              { header: 'Cache-Control', impact: 'Affects how often search engine bots re-crawl your pages. Long cache times may delay index updates after content changes.' },
              { header: 'Content-Type', impact: 'Incorrect content types can prevent search engines from properly parsing your HTML, leading to indexing failures.' },
              { header: 'Link (canonical)', impact: 'The HTTP Link header can specify canonical URLs at the server level, helpful for pages that generate duplicate URLs.' },
              { header: 'HSTS', impact: 'HTTPS is a ranking signal. HSTS ensures all traffic uses HTTPS, and Google has confirmed this as a lightweight ranking factor.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#111', borderRadius: '10px', padding: '16px', border: '1px solid #1e1e1e' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#8b5cf6', margin: '0 0 6px', fontFamily: 'ui-monospace, monospace' }}>{item.header}</h3>
                <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
        {[
          { q: 'Why can\'t I see all headers for some websites?', a: 'Websites with strict CORS policies block cross-origin requests, which prevents our browser-based tool from reading their response headers. This is actually a good security practice. For full header inspection, use the curl command shown in the results.' },
          { q: 'What is a good security header score?', a: 'A score of 70% or above is good — it means the site implements the most critical security headers like HSTS and CSP. A score below 40% indicates significant security gaps. Even major websites sometimes miss security headers, so use the audit to identify and fix missing ones.' },
          { q: 'Do HTTP headers affect page speed?', a: 'Yes. Caching headers (Cache-Control, ETag) dramatically impact load times by telling browsers which resources to cache and for how long. Compression headers (Content-Encoding: gzip/br) reduce transfer sizes. Proper header configuration can cut page load times by 50% or more.' },
          { q: 'Should I remove the Server header?', a: 'Security best practice is to remove or minimize the Server and X-Powered-By headers in production. They reveal your technology stack (e.g., Apache, nginx, PHP version) which attackers can use to find known vulnerabilities specific to your software versions.' },
          { q: 'What\'s the difference between HEAD and GET requests?', a: 'A HEAD request retrieves only the response headers without the body content, making it faster and lighter. Our tool tries HEAD first, then falls back to GET if HEAD is blocked. Both methods return the same headers — HEAD just skips downloading the page content.' },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < 4 ? '1px solid #1e1e1e' : 'none' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{faq.q}</h3>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#111', borderRadius: '16px', padding: '32px', border: '1px solid #1e1e1e' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>More domain tools</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Check SSL certificates, DNS records, website status, and more — all free.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/ssl-checker" style={{ display: 'inline-block', background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            SSL Checker →
          </a>
          <a href="/website-status" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            Website Status
          </a>
          <a href="/tools" style={{ display: 'inline-block', background: 'transparent', color: '#8b5cf6', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #8b5cf6' }}>
            All Tools
          </a>
        </div>
      </section>
    </StaticPage>
  );
}
