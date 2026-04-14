import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import ResponseTimeTool from './ResponseTimeTool';

export const metadata = {
  title: 'Website Response Time Checker — Test Site Speed & Latency | DomyDomains',
  description: 'Free website response time checker. Measure DNS lookup speed, HTTP response latency, jitter, and connection consistency for any website. Get a performance grade with actionable recommendations.',
  keywords: 'website response time checker, site speed test, website latency test, server response time, TTFB checker, website speed checker, ping website, website performance test, HTTP response time, DNS latency test',
  alternates: { canonical: '/response-time' },
  openGraph: {
    title: 'Website Response Time Checker — Test Site Speed & Latency',
    description: 'Measure DNS lookup speed, HTTP response latency, and connection consistency for any website. Get a performance grade with actionable tips.',
    url: 'https://domydomains.com/response-time',
  },
};

export default function ResponseTimePage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Website Response Time Checker"
        description="Measure website response time including DNS lookup speed, HTTP latency, jitter, and connection consistency. Get a performance grade from A to F with detailed analysis and optimization recommendations."
        url="/response-time"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Website Response Time Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Measure how fast any website responds. Test DNS resolution speed, HTTP round-trip latency, jitter,
        and connection consistency — all from your browser, with a performance grade and optimization tips.
      </p>

      <ResponseTimeTool />

      <section style={{ marginBottom: '48px', marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is Website Response Time?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Website response time measures how long it takes for a web server to respond to a request from your
          browser. This includes multiple stages: DNS resolution (translating the domain name to an IP address),
          TCP connection establishment, TLS/SSL handshake for HTTPS sites, and the server processing the request.
          The total time from sending the request to receiving the first byte of the response is often called
          Time to First Byte (TTFB), a critical web performance metric.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Google has confirmed that page speed is a ranking factor for both desktop and mobile search. A slow
          server response time directly impacts Core Web Vitals metrics like Largest Contentful Paint (LCP) and
          First Contentful Paint (FCP). Every 100 milliseconds of additional latency can measurably reduce
          conversion rates, especially for e-commerce sites where users expect near-instant page loads.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How This Tool Works</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Our response time checker runs entirely in your browser with no backend server — which means
          you&apos;re measuring the actual latency from <em>your</em> network location to the target website.
          The test performs three measurements:
        </p>
        <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>DNS Resolution</strong> — Queries Google&apos;s public DNS (dns.google) to resolve the domain and measures how long it takes. Slow DNS can add hundreds of milliseconds to every page load.</li>
          <li><strong>Multiple HTTP Pings</strong> — Sends 3, 5, or 10 sequential HTTP HEAD requests to the target server. Each ping measures the full round-trip time including TLS negotiation.</li>
          <li><strong>Statistical Analysis</strong> — Calculates average, minimum, maximum, P95, and jitter (variation between fastest and slowest responses) to give you a complete performance picture.</li>
        </ul>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Results are graded from A (under 200ms average) to F (over 3 seconds). Since tests run from your
          browser, results reflect real-world conditions including your ISP, geographic distance to the server,
          and current network congestion. For the most accurate results, run the test multiple times at
          different times of day.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding the Results</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          The key metrics reported by this tool help you understand different aspects of website performance:
        </p>
        <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>Average Response Time</strong> — The mean response time across all pings. Under 200ms is excellent for most websites.</li>
          <li><strong>Fastest / Slowest</strong> — Shows the best-case and worst-case response times. A large gap between these indicates inconsistent performance.</li>
          <li><strong>Jitter</strong> — The difference between the slowest and fastest ping. Low jitter (under 50ms) indicates stable, predictable performance. High jitter suggests server load spikes or network instability.</li>
          <li><strong>P95 (95th Percentile)</strong> — The response time at which 95% of requests are faster. This tells you the &quot;realistic worst case&quot; your users experience, and is often more meaningful than the average.</li>
          <li><strong>DNS Lookup Time</strong> — How long it takes to resolve the domain name. Over 200ms is considered slow for DNS.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Improve Website Response Time</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          If your website scores below a B grade, consider these optimization strategies: use a Content Delivery
          Network (CDN) like Cloudflare, Fastly, or AWS CloudFront to serve content from edge servers closer to
          your visitors. Enable HTTP/2 or HTTP/3 to reduce connection overhead. Optimize your server-side code
          and database queries to reduce processing time. Use a fast DNS provider — premium DNS services like
          Cloudflare DNS or Google Cloud DNS offer sub-20ms resolution times globally.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          For high jitter, investigate server resource utilization. Spikes in CPU, memory, or disk I/O during
          peak traffic can cause inconsistent response times. Consider auto-scaling, load balancing across
          multiple servers, or upgrading to a faster hosting plan. Enabling server-side caching (Redis, Memcached,
          or application-level caching) can dramatically reduce response times for dynamic content.
        </p>
      </section>
    </StaticPage>
  );
}
