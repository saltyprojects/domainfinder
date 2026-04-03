import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import DomainWatchlistTool from './DomainWatchlistTool';

export const metadata = {
  title: 'Domain Watchlist — Track Domain Expiration & Status | DomyDomains',
  description: 'Free domain watchlist tool. Track domain expiration dates, registration status, and DNS health in your browser. Get alerts when domains are expiring soon. No account needed — all data stored locally.',
  keywords: 'domain watchlist, track domain expiration, domain monitoring, domain expiry tracker, domain renewal reminder, watch domain status, domain portfolio tracker, domain expiration alert, free domain monitor',
  alternates: { canonical: '/domain-watchlist' },
  openGraph: {
    title: 'Domain Watchlist — Track Domain Expiration & Status',
    description: 'Track domain expiration dates, registrar info, and DNS status. Monitor your portfolio with our free browser-based watchlist — no sign-up required.',
    url: 'https://domydomains.com/domain-watchlist',
  },
};

export default function DomainWatchlistPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Domain Watchlist"
        description="Track domain expiration dates, registration status, and DNS health. Monitor your domain portfolio with a free browser-based watchlist that stores data locally."
        url="/domain-watchlist"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Domain Watchlist
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Track your domains in one place. Monitor expiration dates, registrar info, nameservers, and DNS status —
        all stored locally in your browser. No account, no sign-up, completely free.
      </p>

      <DomainWatchlistTool />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Track Domain Expiration Dates?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Letting a domain expire is one of the costliest mistakes a business can make. When your domain expires,
          your website goes offline, email stops working, and your online presence disappears. Worse, expired domains
          are quickly scooped up by domain squatters who resell them at inflated prices — sometimes hundreds or
          thousands of dollars above the original registration cost.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Most registrars send renewal reminders via email, but these often land in spam folders or get lost in
          cluttered inboxes. If you manage domains across multiple registrars, tracking expiration dates becomes
          even more challenging. A dedicated watchlist gives you a single dashboard view of every domain you care
          about, regardless of where it&apos;s registered.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How the Domain Watchlist Works</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Add any domain name to your watchlist, and the tool instantly fetches its registration details using
          public RDAP (Registration Data Access Protocol) servers and DNS queries. You&apos;ll see the expiration
          date, registration date, registrar name, nameservers, and whether the domain is actively resolving DNS
          records. Each domain gets a color-coded status badge — green for healthy, yellow for expiring within 90
          days, orange for within 30 days, and red for critical (under 7 days) or already expired.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          All watchlist data is stored in your browser&apos;s localStorage. Nothing is sent to any server, and no
          account is required. You can refresh individual domains or the entire list at any time to get the latest
          registration data. The export feature lets you download your watchlist as a CSV file for use in
          spreadsheets or other tools.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Use Cases for Domain Monitoring</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Portfolio management:</strong> If you own multiple domains — whether
          for different projects, brands, or investment — this watchlist keeps them all visible in one place. Sort
          by expiration date to see which domains need renewal soonest.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Competitor monitoring:</strong> Track competitor domains to know when
          they were registered, which registrar they use, and whether their DNS is active. If a competitor&apos;s
          domain expires, it could represent an acquisition opportunity.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Drop catching:</strong> Watch domains you&apos;re interested in
          acquiring. When their expiration date approaches and the owner doesn&apos;t renew, you can be ready to
          register them the moment they become available. The status badges make it easy to see which watched
          domains are closest to expiring.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          <strong style={{ color: '#fff' }}>Client domain management:</strong> Web developers and agencies managing
          domains for clients can use the watchlist to track all client domains in one view, ensuring none slip
          through the cracks. Export the list as CSV to share with clients or include in reports.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Privacy & Data Storage</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          This tool stores your watchlist exclusively in your browser&apos;s localStorage. No data is transmitted
          to our servers. The only external requests are RDAP lookups and DNS queries made directly from your
          browser to public registration and DNS servers. Your watchlist persists between visits on the same browser,
          and you can clear it at any time by removing individual entries or clearing your browser storage.
        </p>
      </section>
    </StaticPage>
  );
}
