import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import RobotsAnalyzerTool from './RobotsAnalyzerTool';

export const metadata = {
  title: 'Robots.txt Analyzer — Parse & Explain Any Site\'s Robots.txt | DomyDomains',
  description: 'Free robots.txt analyzer tool. Parse, validate, and understand any website\'s robots.txt file. See which bots are blocked, which paths are disallowed, find sitemaps, detect syntax errors, and get actionable SEO insights.',
  keywords: 'robots.txt analyzer, robots.txt checker, robots.txt parser, robots.txt validator, check robots.txt, analyze robots.txt, robots.txt tester, SEO robots.txt, crawl directives, search engine crawler',
  alternates: { canonical: '/robots-analyzer' },
  openGraph: {
    title: 'Robots.txt Analyzer — Parse & Explain Any Site\'s Robots.txt',
    description: 'Analyze any website\'s robots.txt file. See blocked bots, disallowed paths, sitemaps, syntax errors, and SEO insights — completely free.',
    url: 'https://domydomains.com/robots-analyzer',
  },
};

export default function RobotsAnalyzerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Robots.txt Analyzer"
        description="Parse, validate, and analyze any website's robots.txt file. See which bots are blocked, which paths are disallowed, find declared sitemaps, and get actionable SEO insights."
        url="/robots-analyzer"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Robots.txt Analyzer
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Parse and analyze any website&apos;s robots.txt file instantly. See which crawlers are allowed or blocked,
        find declared sitemaps, detect syntax errors, and get clear SEO recommendations.
      </p>

      <RobotsAnalyzerTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is a Robots.txt File?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A robots.txt file is a plain text file placed at the root of a website (e.g., example.com/robots.txt) that
          tells search engine crawlers which pages or sections of the site they are allowed to access. It follows the
          Robots Exclusion Protocol, a standard that has been in use since 1994. Every major search engine — Google,
          Bing, Yahoo, DuckDuckGo — respects robots.txt directives when crawling websites.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          The file uses simple directives: <strong>User-agent</strong> specifies which crawler the rules apply to,
          <strong> Disallow</strong> blocks access to specific paths, <strong>Allow</strong> overrides disallow rules
          for specific paths, and <strong>Sitemap</strong> points crawlers to your XML sitemap. A well-configured
          robots.txt file is a fundamental part of technical SEO — it controls how search engines discover and
          index your content.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Analyze Robots.txt?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Misconfigured robots.txt files are one of the most common technical SEO mistakes. A single misplaced
          &quot;Disallow: /&quot; directive can prevent your entire site from appearing in search results. Our analyzer
          helps you catch these issues before they impact your rankings. It parses every directive, identifies
          syntax errors, highlights potential problems, and explains exactly what each rule does.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          This tool is also useful for competitive analysis. By examining a competitor&apos;s robots.txt file, you
          can learn about their site structure, discover hidden directories, see which crawlers they block (including
          AI bots like GPTBot and CCBot), and understand their technical SEO strategy. Many sites also declare their
          sitemaps in robots.txt, giving you a direct link to their full URL inventory.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Use This Tool</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Enter any domain name and click &quot;Analyze Robots.txt&quot;. The tool fetches the site&apos;s robots.txt
          file directly and parses every directive. You&apos;ll see a summary of user-agent groups, allow and disallow
          rules, declared sitemaps, and any syntax errors. The insights panel highlights important findings like
          whether the site blocks all crawlers, is missing a sitemap declaration, uses crawl-delay directives, or
          has specific rules for AI bots. Switch between the Overview, Rules, Sitemaps, and Raw File tabs to explore
          the full analysis.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Common things to look for: Does the site declare a sitemap? Are important pages accidentally blocked?
          Are there specific rules for Googlebot vs. other crawlers? Does the file contain syntax errors that
          crawlers might misinterpret? Our tool makes all of this visible at a glance, helping webmasters,
          SEO professionals, and developers ensure their crawl directives work as intended.
        </p>
      </section>
    </StaticPage>
  );
}
