import { SearchDomains } from './components/SearchDomains';
import { Features } from './components/Features';
import { Stats } from './components/Stats';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 16px',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', flexShrink: 0 }}>
          🌐 DomyDomains
        </span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <a href="#features">Features</a>
          <a href="/blog">Blog</a>
          <a href="#faq">FAQ</a>
        </div>
      </nav>

      {/* Hero */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 16px 32px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 14px',
          background: 'var(--green-dim)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          borderRadius: '20px',
          fontSize: '0.8rem',
          color: 'var(--green)',
          marginBottom: '20px',
          fontWeight: 500,
        }}>
          ✨ Free forever — no signup required
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: '16px',
          maxWidth: '700px',
          width: '100%',
          wordBreak: 'break-word',
        }}>
          Your next big idea<br />
          <span style={{ color: 'var(--green)' }}>starts with a name</span>
        </h1>

        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
          color: 'var(--text-muted)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          lineHeight: 1.6,
          marginBottom: '32px',
          padding: '0 8px',
        }}>
          Search availability across 20+ TLDs, check matching social handles,
          and find the cheapest registrar — all in one place.
        </p>

        <SearchDomains />
      </main>

      <Stats />
      <HowItWorks />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}
