export default function ToolSchema({ name, description, url }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: `https://domydomains.com${url}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: {
      '@type': 'Organization',
      name: 'DomyDomains',
      url: 'https://domydomains.com',
      logo: { '@type': 'ImageObject', url: 'https://domydomains.com/android-chrome-512x512.png' },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
