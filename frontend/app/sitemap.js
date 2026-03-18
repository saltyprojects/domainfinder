import { posts } from '../content/posts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://domydomains.com';

async function fetchAllBlogSlugs() {
  const slugs = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 20) {
    try {
      const res = await fetch(`${API_BASE}/api/seo-articles/?page=${page}&page_size=100`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      const data = await res.json();
      const results = data.results || [];
      for (const article of results) {
        if (article.slug) slugs.push({ slug: article.slug, date: article.created_at || article.date || new Date().toISOString() });
      }
      hasMore = !!data.next;
      page++;
    } catch {
      break;
    }
  }
  return slugs;
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

  // Blog posts from API (paginated)
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
  ];
  const tldPages = tlds.map(tld => ({
    url: `${base}/domain/${tld}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...localBlogPages, ...apiBlogPages, ...tldPages];
}
