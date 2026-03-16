import { posts } from '../content/posts';

export default function sitemap() {
  const base = 'https://domydomains.com';
  return [
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
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/trademark`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
