import { DomainDetail } from './DomainDetail';

export async function generateMetadata({ params }) {
  const { name } = await params;
  const domain = decodeURIComponent(name);
  return {
    title: `${domain} — Domain Intelligence | DomyDomains`,
    description: `Check availability, WHOIS data, social handles, and registrar prices for ${domain}. Find out everything about this domain.`,
    openGraph: {
      title: `${domain} — Is it available?`,
      description: `Check availability, WHOIS data, and pricing for ${domain} on DomyDomains.`,
    },
  };
}

export default async function DomainPage({ params }) {
  const { name } = await params;
  const domain = decodeURIComponent(name);

  return <DomainDetail domain={domain} />;
}
