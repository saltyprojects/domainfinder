'use client';

import { useState } from 'react';

const BASE_URL = 'https://domydomains.com';

export function EmbedGenerator() {
  const [accentColor, setAccentColor] = useState('#22c55e');
  const [bgColor, setBgColor] = useState('#111111');
  const [copied, setCopied] = useState(false);

  const iframeSrc = `${BASE_URL}/embed/widget?accent=${encodeURIComponent(accentColor)}&bg=${encodeURIComponent(bgColor)}`;
  const embedCode = `<iframe src="${iframeSrc}" width="100%" height="80" style="border:none;border-radius:12px;" title="Domain Search by DomyDomains"></iframe>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Customization */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Accent Color
          <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
            style={{ width: '40px', height: '32px', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Background
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
            style={{ width: '40px', height: '32px', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
        </label>
      </div>

      {/* Preview */}
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Preview</h3>
      <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }}>
        <iframe
          src={iframeSrc}
          width="100%"
          height="80"
          style={{ border: 'none', borderRadius: '12px' }}
          title="Domain Search Preview"
        />
      </div>

      {/* Embed code */}
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Embed Code</h3>
      <div style={{ position: 'relative' }}>
        <pre style={{
          padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', fontSize: '0.85rem', color: 'var(--text-muted)',
          overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        }}>
          {embedCode}
        </pre>
        <button onClick={copyCode} style={{
          position: 'absolute', top: '8px', right: '8px',
          padding: '6px 14px', background: 'var(--green)', color: '#000',
          border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
        }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
