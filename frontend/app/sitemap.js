import { posts } from '../content/posts';

const API_BASE = 'https://backend-production-758b.up.railway.app';

async function fetchAllBlogSlugs() {
  const allArticles = [];
  let page = 1;
  const pageSize = 100;
  try {
    while (true) {
      const res = await fetch(`${API_BASE}/api/blog/posts/?page=${page}&page_size=${pageSize}`, { next: { revalidate: 3600 } });
      if (!res.ok) break;
      const data = await res.json();
      const results = data.results || [];
      results.forEach(a => allArticles.push({ slug: a.slug, date: a.published_at || a.date || new Date().toISOString() }));
      if (!data.next || results.length < pageSize) break;
      page++;
    }
  } catch {}
  return allArticles;
}

export default async function sitemap() {
  const base = 'https://domydomains.com';

  // Static pages
  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/domain-extensions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/premium-domains`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/whois-lookup`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-value`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-age-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dns-lookup`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-availability`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/random-domain-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-expiration`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/brand-name-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/startup-name-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-length-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/tld-comparison`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/bulk-domain-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/ssl-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/email-domain-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-history`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/website-status`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-typo-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/nameserver-lookup`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/whois-privacy-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/http-header-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/subdomain-finder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-transfer-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/reverse-ip-lookup`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/url-redirect-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-blacklist-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/website-tech-detector`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dns-propagation-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/whois-compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/punycode-converter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/mx-record-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/spf-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dmarc-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/cname-lookup`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/redirect-mapper`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dkim-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dns-compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/portfolio-analyzer`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-name-scorer`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/robots-analyzer`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/sitemap-validator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/og-preview`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-keywords`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/doh-tester`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/domain-watchlist`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/caa-checker`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/seo`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/trademark`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Blog posts from local content
  const localBlogPages = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Blog posts from API (sample articles to reach 115+ URLs)
  const apiBlogSlugs = await fetchAllBlogSlugs();
  const localSlugs = new Set(posts.map(p => p.slug));
  const apiBlogPages = apiBlogSlugs
    .filter(a => !localSlugs.has(a.slug))
    .map(a => ({
      url: `${base}/blog/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  // Domain extension pages (common TLDs)
  const tlds = [
    'com', 'net', 'org', 'io', 'co', 'ai', 'dev', 'app', 'xyz', 'me',
    'tech', 'online', 'store', 'site', 'info', 'biz', 'us', 'uk', 'ca', 'de',
    'fr', 'nl', 'au', 'in', 'jp', 'club', 'shop', 'blog', 'design', 'cloud',
    'gg', 'tv', 'so', 'to', 'cc', 'pro', 'space', 'fun', 'world', 'live',
    'ventures', 'agency', 'studio', 'digital', 'solutions', 'media', 'marketing',
    'consulting', 'global', 'health', 'finance', 'education', 'science', 'art',
    'music', 'games', 'travel', 'food', 'fashion', 'law', 'engineering', 'academy',
    'careers', 'foundation', 'holdings', 'investments', 'properties', 'rentals',
    'software', 'systems', 'technology', 'tools', 'works', 'zone', 'domains',
    'email', 'hosting', 'network', 'security', 'services', 'support', 'website',
  ];
  const tldPages = tlds.map(tld => ({
    url: `${base}/domain/${tld}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...localBlogPages, ...apiBlogPages, ...tldPages];
}
