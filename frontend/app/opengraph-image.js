import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'DomyDomains — Domain Search Tool';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16 }}>🌐</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-2px',
            marginBottom: 16,
          }}
        >
          DomyDomains
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#22c55e',
            fontWeight: 600,
          }}
        >
          Find Your Perfect Domain Name — Instantly
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#888888',
            marginTop: 16,
          }}
        >
          20+ TLDs · Social Handles · Price Comparison · Free Forever
        </div>
      </div>
    ),
    { ...size },
  );
}
