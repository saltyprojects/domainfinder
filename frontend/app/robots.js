export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/callback/'] }],
    sitemap: 'https://domydomains.com/sitemap.xml',
  };
}
