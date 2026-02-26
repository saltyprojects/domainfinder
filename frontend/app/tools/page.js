'use client';

import { AppShell } from '../components/AppShell';

export default function Tools() {
  return (
    <AppShell>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', flex: 1, padding: '24px', gap: '8px',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
          Domain Tools
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          WHOIS lookup, DNS checker, and more — coming soon
        </p>
      </div>
    </AppShell>
  );
}
