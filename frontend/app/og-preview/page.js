import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import OgPreviewTool from './OgPreviewTool';

export const metadata = {
  title: 'Open Graph Preview Tool — Preview Social Media Cards Free | DomyDomains',
  description: 'Free Open Graph preview tool. See how your links look on Facebook, Twitter/X, Discord, LinkedIn, and Slack before sharing. Check og:title, og:image, og:description tags and get a social media readiness score.',
  keywords: 'open graph preview, og preview tool, social media card preview, twitter card preview, facebook link preview, discord embed preview, og meta tags checker, open graph debugger, social share preview, og image checker',
  alternates: { canonical: '/og-preview' },
  openGraph: {
    title: 'Open Graph Preview Tool — Preview Social Media Cards Free',
    description: 'See exactly how your links appear on Facebook, Twitter/X, Discord, LinkedIn, and Slack. Check OG tags, get a readiness score, and copy recommended meta tags.',
    url: 'https://domydomains.com/og-preview',
  },
};

export default function OgPreviewPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Open Graph Preview Tool"
        description="Preview how any URL appears when shared on Facebook, Twitter/X, Discord, LinkedIn, and Slack. Analyze Open Graph and Twitter Card meta tags, get a social media readiness score, and copy recommended code."
        url="/og-preview"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Open Graph Preview Tool
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        See exactly how your links look when shared on Facebook, Twitter/X, Discord, LinkedIn, and Slack.
        Check your Open Graph and Twitter Card meta tags, get a readiness score, and copy the recommended code.
      </p>

      <OgPreviewTool />

      <section style={{ marginTop: '48px', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Are Open Graph Meta Tags?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Open Graph (OG) is a protocol created by Facebook in 2010 that lets web pages control how they
          appear when shared on social media platforms. By adding specific <code style={{ color: '#8b5cf6' }}>&lt;meta&gt;</code> tags
          to your page&apos;s HTML head, you define the title, description, image, and URL that platforms
          display in link previews. Without these tags, social networks guess what to show — often pulling
          the wrong image, cutting off your title, or displaying a blank preview that nobody clicks.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          The core OG tags are <code style={{ color: '#8b5cf6' }}>og:title</code>, <code style={{ color: '#8b5cf6' }}>og:description</code>,{' '}
          <code style={{ color: '#8b5cf6' }}>og:image</code>, and <code style={{ color: '#8b5cf6' }}>og:url</code>. Twitter uses
          its own card system with tags like <code style={{ color: '#8b5cf6' }}>twitter:card</code> and{' '}
          <code style={{ color: '#8b5cf6' }}>twitter:image</code>, though it falls back to OG tags when Twitter-specific
          ones are missing. Discord, Slack, LinkedIn, iMessage, and most messaging apps all read OG tags to
          generate rich link embeds.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Preview Your Social Cards?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          A well-crafted link preview dramatically increases click-through rates. Studies show that links
          with rich previews — a compelling image, clear title, and descriptive text — get up to 5x more
          engagement than bare URLs. But each platform renders previews slightly differently. Facebook
          crops images to a 1.91:1 aspect ratio, Twitter supports both small square cards and large
          landscape cards, Discord adds a colored sidebar to embeds, and Slack shows a compact format.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          This tool lets you check all platforms at once without actually posting. Enter any URL and
          instantly see how Facebook, Twitter/X, Discord, and Slack will render it. The score tab tells
          you which tags are missing, and the code tab gives you copy-paste HTML to fix any gaps.
          The recommended OG image size is <strong>1200×630 pixels</strong> — this works well across
          all platforms and avoids cropping issues.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How to Use This Tool</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Enter any URL in the input field and click &quot;Preview.&quot; The tool fetches the page, parses
          all Open Graph and Twitter Card meta tags, and renders realistic previews for four major platforms.
          Switch between the <strong>Previews</strong> tab for visual mockups, <strong>Score</strong> for a
          completeness audit of your meta tags, <strong>Raw Tags</strong> to see every detected tag, and{' '}
          <strong>Copy Code</strong> to get ready-to-use HTML you can paste into your page&apos;s head section.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          For best results, make sure your <code style={{ color: '#8b5cf6' }}>og:image</code> uses an absolute
          URL (starting with https://), is at least 1200×630 pixels, and is under 5MB. Use unique titles and
          descriptions for each page rather than repeating your homepage text. If you update your OG tags and
          the old preview persists on Facebook, use the{' '}
          <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6' }}>
            Facebook Sharing Debugger
          </a>{' '}
          to clear their cache.
        </p>
      </section>
    </StaticPage>
  );
}
