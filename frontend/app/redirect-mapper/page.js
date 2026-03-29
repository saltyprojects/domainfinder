import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import RedirectMapperTool from './RedirectMapperTool';

export const metadata = {
  title: 'Domain Redirect Mapper — Trace & Visualize Redirect Chains in Bulk | DomyDomains',
  description: 'Free domain redirect mapper tool. Trace redirect chains for multiple URLs at once, visualize 301/302 hops, detect redirect loops, and export results to CSV. Perfect for SEO audits and site migrations.',
  keywords: 'domain redirect mapper, redirect chain tool, bulk redirect checker, 301 redirect mapper, redirect visualization, redirect audit tool, site migration redirect checker, SEO redirect tool, redirect loop detector, bulk URL redirect trace',
  alternates: { canonical: '/redirect-mapper' },
  openGraph: {
    title: 'Domain Redirect Mapper — Trace & Visualize Redirect Chains in Bulk',
    description: 'Map redirect chains for multiple URLs at once. Visualize every hop, detect loops, export to CSV. Free browser-based tool for SEO audits.',
    url: 'https://domydomains.com/redirect-mapper',
  },
};

export default function RedirectMapperPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Redirect Mapper"
        description="Map and visualize redirect chains for multiple URLs at once. Trace 301/302 redirects, detect loops, and export results to CSV. Free browser-based tool for SEO audits and site migrations."
        url="/redirect-mapper"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Redirect Mapper
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Map and visualize redirect chains for multiple domains or URLs at once. See every hop,
        detect redirect loops, compare permanent vs. temporary redirects, and export your
        results as CSV — all free, directly in your browser.
      </p>

      <RedirectMapperTool />

      <section style={{ marginTop: '64px', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is a Domain Redirect Mapper?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A domain redirect mapper traces the full path a browser follows when you visit a URL. When a domain
          or page has been moved, the server sends a redirect response (like a 301 or 302) telling the browser
          to go to a different location. This can happen multiple times, creating a &quot;redirect chain&quot; —
          a sequence of hops from the original URL to the final destination. Our mapper visualizes this entire
          chain, showing you every intermediate step, the HTTP status code at each hop, and where the URL
          ultimately resolves.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>Why Redirect Mapping Matters for SEO</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Redirects are one of the most important factors in technical SEO. Every redirect in a chain introduces
          latency and can dilute link equity (also called &quot;link juice&quot;). Google&apos;s crawlers follow
          redirect chains, but long chains can cause crawl budget waste and make it harder for search engines
          to discover your content. A single unnecessary hop might seem harmless, but across thousands of pages
          on a large site, the impact on crawl efficiency and ranking signals can be significant.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Understanding the difference between permanent redirects (301, 308) and temporary redirects (302, 307)
          is critical. A 301 redirect tells search engines to transfer all ranking power to the new URL permanently.
          A 302 redirect signals the move is temporary, so search engines may keep indexing the original URL.
          Using the wrong redirect type during a site migration is one of the most common SEO mistakes, and it
          can take months to recover from the resulting ranking drops.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>How to Use This Tool</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Paste one or more URLs into the input field — one per line, or separated by commas. You can enter
          bare domains like <code style={{ color: '#8b5cf6', background: '#111', padding: '2px 6px', borderRadius: '4px' }}>example.com</code> or
          full URLs like <code style={{ color: '#8b5cf6', background: '#111', padding: '2px 6px', borderRadius: '4px' }}>http://old-site.com/page</code>.
          The tool will automatically normalize them and trace the redirect chain for each one. You will see
          a visual map of every hop, with status codes color-coded: green for success (2xx), yellow for permanent
          redirects (301/308), orange for temporary redirects (302/307), and red for errors (4xx/5xx).
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          This is especially useful during site migrations, domain consolidations, or when auditing a list of
          backlinks. The bulk input lets you check dozens of URLs at once instead of testing them one by one.
          When you are done, export everything to a CSV file for your records or to share with your team.
          Redirect loops — where URL A redirects to B, which redirects back to A — are automatically detected
          and flagged, helping you catch configuration errors before they affect your users or search rankings.
        </p>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>Common Redirect Issues to Watch For</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Long redirect chains:</strong> More than two hops can slow down page loads
          and waste crawl budget. Aim to resolve any URL in one redirect or fewer.{' '}
          <strong style={{ color: '#fff' }}>Mixed redirect types:</strong> A chain that uses both 301 and 302 redirects
          confuses search engines about whether the move is permanent.{' '}
          <strong style={{ color: '#fff' }}>HTTP to HTTPS redirects:</strong> Every site should redirect HTTP to HTTPS,
          but make sure it is a direct hop — not HTTP → www HTTP → www HTTPS.{' '}
          <strong style={{ color: '#fff' }}>Trailing slash inconsistency:</strong> Redirecting between slash and non-slash
          versions of the same URL adds unnecessary hops and can fragment your analytics data.
        </p>
      </section>
    </StaticPage>
  );
}
