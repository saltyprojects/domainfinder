import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import SitemapValidatorTool from './SitemapValidatorTool';

export const metadata = {
  title: 'Sitemap Validator — Check & Parse XML Sitemaps Online Free | DomyDomains',
  description: 'Free XML sitemap validator tool. Parse, validate, and analyze your sitemap.xml file. Check for errors, duplicate URLs, missing lastmod dates, size limits, and get a health score with actionable SEO recommendations.',
  keywords: 'sitemap validator, xml sitemap checker, sitemap tester, validate sitemap, sitemap analyzer, check sitemap xml, sitemap errors, sitemap SEO, sitemap health check, xml sitemap validator online',
  alternates: { canonical: '/sitemap-validator' },
  openGraph: {
    title: 'Sitemap Validator — Check & Parse XML Sitemaps Online Free',
    description: 'Validate and analyze any XML sitemap. Find errors, duplicates, missing dates, and get an SEO health score — completely free.',
    url: 'https://domydomains.com/sitemap-validator',
  },
};

export default function SitemapValidatorPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Sitemap Validator"
        description="Parse, validate, and analyze XML sitemaps. Check for errors, duplicate URLs, missing lastmod dates, file size limits, and get an SEO health score."
        url="/sitemap-validator"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        XML Sitemap Validator
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Validate and analyze any XML sitemap instantly. Check for syntax errors, duplicate URLs, missing metadata,
        and file size limits. Get a health score and actionable recommendations to improve your site&apos;s crawlability.
      </p>

      <SitemapValidatorTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is an XML Sitemap?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          An XML sitemap is a structured file that lists the URLs on your website, along with optional metadata like
          when each page was last modified, how often it changes, and its relative priority. Search engines like Google,
          Bing, and Yahoo use sitemaps to discover and crawl pages more efficiently. The sitemap protocol was
          standardized by sitemaps.org in 2006 and is now a cornerstone of technical SEO. A properly formatted
          sitemap helps search engines understand your site structure and find new or updated content faster.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          There are two main types: a <strong>URL set</strong> sitemap that directly lists page URLs, and a
          <strong> sitemap index</strong> that references multiple child sitemaps. Large websites with thousands of
          pages typically use sitemap indexes to organize URLs into manageable files, since each individual sitemap
          is limited to 50,000 URLs and 50MB uncompressed.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Validate Your Sitemap?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A broken or misconfigured sitemap can silently damage your search rankings. Common issues include invalid
          XML syntax that prevents parsers from reading the file, duplicate URLs that waste crawl budget, missing
          lastmod dates that make it harder for search engines to prioritize fresh content, and files that exceed
          protocol size limits. Google Search Console often reports sitemap errors, but our validator catches problems
          before you submit — saving time and avoiding indexing delays.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Regular sitemap validation is especially important for dynamic sites where content management systems
          auto-generate sitemaps. Plugin updates, URL structure changes, or database issues can introduce errors
          that go unnoticed for weeks. By validating periodically, you ensure search engines always have a clean,
          accurate map of your site&apos;s content.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Use This Validator</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Enter a domain name or a full sitemap URL and click &quot;Validate Sitemap.&quot; If you enter just a domain,
          the tool automatically checks the standard <code style={{ color: '#8b5cf6' }}>/sitemap.xml</code> location. The
          validator fetches the file, parses the XML, and runs a comprehensive analysis. You&apos;ll see key metrics
          at a glance: the sitemap type, total URL count, file size, and number of warnings.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Explore the tabs for deeper analysis. The <strong>Overview</strong> tab shows a health score based on
          completeness and correctness — covering lastmod coverage, changefreq distribution, priority usage, and
          duplicate detection. The <strong>URLs</strong> tab lists every URL with its metadata, paginated for large
          sitemaps. The <strong>Warnings</strong> tab highlights specific issues with clear explanations. Use these
          insights to fix errors, improve metadata coverage, and ensure search engines can efficiently crawl every
          important page on your site.
        </p>
      </section>
    </StaticPage>
  );
}
