import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import WebsiteTechDetector from './WebsiteTechDetector';

export const metadata = {
  title: 'Website Technology Detector — Identify Tech Stack, CMS & Hosting | DomyDomains',
  description: 'Free website technology detector tool. Identify the tech stack behind any website — hosting provider, CMS, CDN, email services, DNS provider, and security headers. All analysis runs in your browser.',
  keywords: 'website technology detector, tech stack checker, what CMS is this site, website technology lookup, hosting provider checker, CDN detector, website built with, technology profiler, web technology scanner, site technology checker',
  alternates: { canonical: '/website-tech-detector' },
  openGraph: {
    title: 'Website Technology Detector — Identify Tech Stack, CMS & Hosting',
    description: 'Discover what technologies power any website. Detect hosting, CDN, CMS, email provider, DNS, and security headers — all from your browser.',
    url: 'https://domydomains.com/website-tech-detector',
  },
};

export default function WebsiteTechDetectorPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Website Technology Detector"
        description="Identify the complete technology stack behind any website. Detect hosting provider, CMS/framework, CDN, email services, DNS provider, and security headers using DNS analysis and fingerprinting."
        url="/website-tech-detector"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Website Technology Detector
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Discover the technology stack behind any website. Detect hosting providers, CDN, CMS, email services,
        DNS providers, and security configurations — all from your browser using DNS fingerprinting.
      </p>

      <WebsiteTechDetector />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is Website Technology Detection?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Website technology detection is the process of identifying the software, services, and infrastructure that
            power a website. Every website leaves digital fingerprints in its DNS records, HTTP headers, IP addresses,
            and domain configuration. By analyzing these signals, you can determine what hosting provider a site uses,
            which content management system (CMS) it runs on, what CDN delivers its content, and much more.
          </p>
          <p style={{ marginTop: '16px' }}>
            This tool performs a comprehensive analysis using publicly available DNS data. It queries A records to
            identify hosting providers by IP range, NS records to detect DNS providers, MX records to find email
            services, TXT records to discover verified third-party services, and CNAME records to identify platform-specific
            hosting. All of this runs entirely in your browser — no data is sent to our servers.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Technologies Can Be Detected?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '12px' }}>
            {[
              { icon: '🖥️', title: 'Hosting & Platforms', desc: 'Identify if a site is hosted on Vercel, Netlify, AWS, GitHub Pages, Heroku, Cloudflare Pages, Railway, Render, Fly.io, Shopify, Squarespace, Webflow, or other platforms via CNAME records and IP fingerprinting.' },
              { icon: '⚡', title: 'CDN & Performance', desc: 'Detect content delivery networks like Cloudflare, Amazon CloudFront, and Fastly. CDN detection reveals how sites optimize global performance and protect against DDoS attacks.' },
              { icon: '📧', title: 'Email Infrastructure', desc: 'Discover email providers (Google Workspace, Microsoft 365, ProtonMail, Zoho) via MX records, and verify email authentication with SPF, DKIM, and DMARC record checks.' },
              { icon: '🌐', title: 'DNS Providers', desc: 'Identify which DNS service manages the domain — Cloudflare, Route 53, Google Cloud DNS, GoDaddy, Namecheap, and more — by analyzing nameserver records.' },
              { icon: '⚙️', title: 'Frameworks & CMS', desc: 'Detect web frameworks and content management systems like WordPress, Drupal, Next.js, Nuxt.js, and others through platform-specific DNS signatures and hosting patterns.' },
              { icon: '📊', title: 'Third-Party Services', desc: 'Find verified services through TXT records — Google Search Console, Facebook, Microsoft, Apple, HubSpot, Stripe, and other platforms that require domain verification.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#111', borderRadius: '12px', padding: '20px', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>{item.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Detect Website Technologies?</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            <strong style={{ color: '#fff' }}>Competitive analysis</strong> — Understanding what technology stack your
            competitors use helps inform your own technology decisions. If a fast-loading competitor uses Cloudflare CDN
            with Vercel hosting, that combination might work well for your project too.
          </p>
          <p style={{ marginTop: '16px' }}>
            <strong style={{ color: '#fff' }}>Security auditing</strong> — Checking which security headers and email
            authentication records a domain has configured helps identify potential vulnerabilities. Missing DMARC policies,
            absent security headers, or exposed infrastructure details can all pose risks.
          </p>
          <p style={{ marginTop: '16px' }}>
            <strong style={{ color: '#fff' }}>Sales intelligence</strong> — Technology detection powers sales prospecting.
            Knowing what CMS, hosting, or email provider a company uses lets you target pitches for complementary or
            replacement solutions.
          </p>
          <p style={{ marginTop: '16px' }}>
            <strong style={{ color: '#fff' }}>Migration planning</strong> — When acquiring a domain or taking over a
            website, knowing its current technology stack helps plan a smooth migration. Understanding DNS providers,
            email services, and hosting platforms prevents accidental service disruption.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How DNS-Based Detection Works</h2>
        <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '1rem' }}>
          <p>
            Our tool uses a technique called DNS fingerprinting to identify technologies. Unlike server-side tools that
            crawl web pages and parse HTML, DNS-based detection works by querying the Domain Name System — the internet&#39;s
            public directory. This approach is fast, privacy-respecting, and works even when websites block crawlers.
          </p>
          <p style={{ marginTop: '16px' }}>
            The tool queries multiple DNS record types: <strong style={{ color: '#fff' }}>A records</strong> reveal IP
            addresses that can be matched to known hosting providers, <strong style={{ color: '#fff' }}>NS records</strong> show
            DNS providers, <strong style={{ color: '#fff' }}>MX records</strong> expose email services,
            <strong style={{ color: '#fff' }}> CNAME records</strong> often point to specific platforms (like Shopify or
            Vercel), and <strong style={{ color: '#fff' }}>TXT records</strong> contain verification tokens for third-party
            services. Each data point adds to the technology profile, building a comprehensive picture of a site&#39;s
            infrastructure.
          </p>
        </div>
      </section>
    </StaticPage>
  );
}
