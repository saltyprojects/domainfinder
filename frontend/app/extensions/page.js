'use client';

import { AppShell } from '../components/AppShell';

export default function Extensions() {
  return (
    <AppShell>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', flex: 1, padding: '24px', gap: '8px',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
          Domain Extensions
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          Browse 20+ TLD extensions — coming soon
        </p>
      </div>
    </AppShell>
  );
}
