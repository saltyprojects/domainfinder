import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import UrlRedirectChecker from './UrlRedirectChecker';

export const metadata = {
  title: 'URL Redirect Checker — Trace Redirect Chains & HTTP Status Codes | DomyDomains',
  description: 'Free URL redirect checker tool. Trace full redirect chains, detect 301/302 redirects, find redirect loops, and analyze HTTP status codes. Essential for SEO audits and link debugging.',
  keywords: 'url redirect checker, redirect chain checker, 301 redirect checker, 302 redirect checker, redirect trace tool, http redirect checker, redirect loop detector, seo redirect audit, check redirect chain, url redirect trace',
  alternates: { canonical: '/url-redirect-checker' },
  openGraph: {
    title: 'URL Redirect Checker — Trace Redirect Chains & HTTP Status Codes',
    description: 'Trace full redirect chains for any URL. Detect 301/302 redirects, find loops, and get SEO recommendations. Free browser-based tool.',
    url: 'https://domydomains.com/url-redirect-checker',
  },
};

export default function UrlRedirectCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="URL Redirect Checker"
        description="Trace full redirect chains for any URL. Detect 301/302 redirects, find redirect loops, and get SEO recommendations. Free browser-based tool with visual redirect chain display."
        url="/url-redirect-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        URL Redirect Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Trace the full redirect chain for any URL. See every hop, HTTP status code, and redirect type —
        all from your browser. Detect redirect loops, mixed redirect types, and get SEO recommendations.
      </p>

      <UrlRedirectChecker />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Are URL Redirects?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            A URL redirect is an instruction that automatically sends visitors and search engines from one URL to another.
            When you type a web address into your browser, the server may respond with a redirect status code (like 301 or 302)
            along with a new destination URL. Your browser then follows this instruction and loads the new page instead. This
            happens so quickly that most users never notice it.
          </p>
          <p style={{ marginTop: '16px' }}>
            Redirects serve many purposes: migrating to a new domain, enforcing HTTPS, consolidating duplicate content,
            updating old URLs after a site redesign, or implementing URL shorteners. While redirects are essential for
            maintaining a healthy website, improper configuration can cause serious SEO problems, slow page loads, and
            create poor user experiences. Understanding your redirect chains is critical for anyone managing a website.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Types of HTTP Redirects</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '12px' }}>
            {[
              { code: '301', name: 'Moved Permanently', icon: '🔒', desc: 'The most common redirect for SEO. Tells search engines the page has permanently moved and to transfer all link equity (ranking power) to the new URL. Use this when a page URL changes forever.' },
              { code: '302', name: 'Found (Temporary)', icon: '🔄', desc: 'Indicates a temporary move. Search engines keep the original URL indexed and don\'t transfer full link equity. Use for A/B tests, maintenance pages, or geo-based redirects that may change.' },
              { code: '307', name: 'Temporary Redirect', icon: '↪️', desc: 'HTTP/1.1 version of 302. Preserves the request method (POST stays POST). Important for form submissions and API endpoints that need to maintain the original HTTP method during redirect.' },
              { code: '308', name: 'Permanent Redirect', icon: '🔐', desc: 'HTTP/1.1 version of 301. Like 301, signals a permanent move but also preserves the request method. Ideal for API endpoints and form-handling URLs that are permanently relocated.' },
              { code: 'Meta Refresh', name: 'HTML Meta Redirect', icon: '⏱️', desc: 'Not an HTTP redirect — done via HTML meta tag. Slower, not recommended for SEO as search engines may not pass full link equity. Sometimes used for countdown pages or legacy CMS systems.' },
              { code: 'JS', name: 'JavaScript Redirect', icon: '📜', desc: 'Redirect via window.location in JavaScript. Search engines may not follow these reliably. Avoid for SEO-critical pages. Only use when server-side redirects are impossible (static hosting limits).' },
            ].map(item => (
              <div key={item.code} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                  <div>
                    <span style={{ fontWeight: 700, color: '#8b5cf6', fontSize: '0.9rem' }}>{item.code}</span>
                    <span style={{ color: '#fff', fontSize: '0.9rem', marginLeft: '8px', fontWeight: 600 }}>{item.name}</span>
                  </div>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Common Redirect Problems</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            <strong style={{ color: '#fff' }}>Redirect chains</strong> occur when one redirect leads to another, which leads
            to another. Each hop adds latency and can dilute link equity. Google recommends keeping chains to a maximum of
            one redirect. Long chains (3+ hops) may cause search engines to stop following them entirely, leaving pages
            unindexed.
          </p>
          <p style={{ marginTop: '16px' }}>
            <strong style={{ color: '#fff' }}>Redirect loops</strong> happen when URL A redirects to URL B, which redirects
            back to URL A — creating an infinite cycle. Browsers will eventually stop and show an error
            (&quot;too many redirects&quot;). Loops commonly occur when HTTP-to-HTTPS and www-to-non-www rules conflict with
            each other.
          </p>
          <p style={{ marginTop: '16px' }}>
            <strong style={{ color: '#fff' }}>Mixed redirect types</strong> can confuse search engines. If you redirect
            from page A → B with a 302, then B → C with a 301, search engines receive conflicting signals about whether
            the move is permanent or temporary. Always use consistent redirect types within a chain.
          </p>
          <p style={{ marginTop: '16px' }}>
            <strong style={{ color: '#fff' }}>Wrong redirect type</strong> is the most common SEO mistake. Using a 302
            (temporary) when a 301 (permanent) is appropriate means search engines may not transfer link equity to the new
            URL. If the move is permanent, always use 301.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Best Practices for URL Redirects</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <ul style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Use <strong style={{ color: '#fff' }}>301 redirects</strong> for permanent URL changes — domain migrations, HTTPS enforcement, and URL structure changes.</li>
            <li style={{ marginBottom: '8px' }}>Keep redirect chains <strong style={{ color: '#fff' }}>as short as possible</strong> — ideally one hop from old URL to final destination.</li>
            <li style={{ marginBottom: '8px' }}>Regularly <strong style={{ color: '#fff' }}>audit your redirects</strong> after site migrations to catch chains, loops, and broken redirects.</li>
            <li style={{ marginBottom: '8px' }}>Update <strong style={{ color: '#fff' }}>internal links</strong> to point directly to final URLs instead of relying on redirects.</li>
            <li style={{ marginBottom: '8px' }}>Update your <strong style={{ color: '#fff' }}>sitemap</strong> to include only the final destination URLs, not redirected ones.</li>
            <li style={{ marginBottom: '8px' }}>Monitor <strong style={{ color: '#fff' }}>redirect performance</strong> — each redirect adds 50-100ms of latency to page load time.</li>
          </ul>
        </div>
      </section>
    </StaticPage>
  );
}
