'use client';

import { useState, useCallback } from 'react';

// Punycode constants per RFC 3492
const BASE = 36, TMIN = 1, TMAX = 26, SKEW = 38, DAMP = 700, INITIAL_BIAS = 72, INITIAL_N = 128;

function adaptBias(delta, numPoints, firstTime) {
  delta = firstTime ? Math.floor(delta / DAMP) : delta >> 1;
  delta += Math.floor(delta / numPoints);
  let k = 0;
  while (delta > ((BASE - TMIN) * TMAX) >> 1) {
    delta = Math.floor(delta / (BASE - TMIN));
    k += BASE;
  }
  return k + Math.floor(((BASE - TMIN + 1) * delta) / (delta + SKEW));
}

function digitToChar(d) {
  return d < 26 ? String.fromCharCode(d + 97) : String.fromCharCode(d - 26 + 48);
}

function charToDigit(c) {
  const code = c.charCodeAt(0);
  if (code >= 48 && code <= 57) return code - 48 + 26;
  if (code >= 65 && code <= 90) return code - 65;
  if (code >= 97 && code <= 122) return code - 97;
  return BASE;
}

function punycodeEncode(input) {
  const codePoints = Array.from(input).map(c => c.codePointAt(0));
  const basicChars = codePoints.filter(cp => cp < 128);
  let output = basicChars.map(cp => String.fromCodePoint(cp)).join('');
  let h = basicChars.length;
  const b = h;
  if (b > 0) output += '-';

  let n = INITIAL_N, delta = 0, bias = INITIAL_BIAS;
  while (h < codePoints.length) {
    const m = Math.min(...codePoints.filter(cp => cp >= n));
    delta += (m - n) * (h + 1);
    n = m;
    for (const cp of codePoints) {
      if (cp < n) delta++;
      if (cp === n) {
        let q = delta;
        for (let k = BASE; ; k += BASE) {
          const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
          if (q < t) break;
          output += digitToChar(t + ((q - t) % (BASE - t)));
          q = Math.floor((q - t) / (BASE - t));
        }
        output += digitToChar(q);
        bias = adaptBias(delta, h + 1, h === b);
        delta = 0;
        h++;
      }
    }
    delta++;
    n++;
  }
  return output;
}

function punycodeDecode(input) {
  let n = INITIAL_N, i = 0, bias = INITIAL_BIAS;
  const lastDash = input.lastIndexOf('-');
  let output = lastDash > 0 ? Array.from(input.slice(0, lastDash)).map(c => c.codePointAt(0)) : [];
  let pos = lastDash > 0 ? lastDash + 1 : 0;

  while (pos < input.length) {
    let oldi = i, w = 1;
    for (let k = BASE; ; k += BASE) {
      if (pos >= input.length) throw new Error('Invalid punycode input');
      const digit = charToDigit(input[pos++]);
      if (digit >= BASE) throw new Error('Invalid punycode character');
      i += digit * w;
      const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
      if (digit < t) break;
      w *= (BASE - t);
    }
    const len = output.length + 1;
    bias = adaptBias(i - oldi, len, oldi === 0);
    n += Math.floor(i / len);
    i = i % len;
    output.splice(i, 0, n);
    i++;
  }
  return output.map(cp => String.fromCodePoint(cp)).join('');
}

function toASCII(domain) {
  return domain.split('.').map(label => {
    if (/^[\x00-\x7F]*$/.test(label)) return label;
    return 'xn--' + punycodeEncode(label);
  }).join('.');
}

function toUnicode(domain) {
  return domain.split('.').map(label => {
    if (label.startsWith('xn--')) {
      try { return punycodeDecode(label.slice(4)); }
      catch { return label; }
    }
    return label;
  }).join('.');
}

function analyzeLabel(label) {
  const codePoints = Array.from(label);
  const scripts = new Set();
  const nonAscii = codePoints.filter(c => c.codePointAt(0) > 127);
  return {
    length: codePoints.length,
    hasNonAscii: nonAscii.length > 0,
    nonAsciiCount: nonAscii.length,
    codePoints: codePoints.map(c => ({ char: c, hex: 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0') })),
  };
}

const EXAMPLES = [
  { unicode: 'münchen.de', description: 'German city (ü)' },
  { unicode: 'café.com', description: 'French word (é)' },
  { unicode: '中文.com', description: 'Chinese characters' },
  { unicode: '日本語.jp', description: 'Japanese domain' },
  { unicode: 'São-Paulo.br', description: 'Portuguese (ã)' },
  { unicode: 'Москва.ru', description: 'Russian (Cyrillic)' },
  { unicode: '한국.kr', description: 'Korean (Hangul)' },
  { unicode: 'عربي.com', description: 'Arabic script' },
];

const inputStyle = {
  width: '100%', padding: '14px 16px', fontSize: '1rem',
  background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px',
  color: '#fff', outline: 'none', fontFamily: 'ui-monospace, monospace',
};

const btnStyle = {
  padding: '14px 28px', fontSize: '1rem', fontWeight: 600,
  background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px',
  cursor: 'pointer', transition: 'background 0.15s', whiteSpace: 'nowrap',
};

const cardStyle = {
  background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '12px',
  padding: '20px', marginBottom: '16px',
};

export default function PunycodeConverter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('auto');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError('');
    setResult(null);
    setCopied(false);

    const domain = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!domain) { setError('Please enter a domain name.'); return; }

    try {
      const isPunycode = domain.includes('xn--');
      const isNonAscii = /[^\x00-\x7F]/.test(domain);
      let direction;

      if (mode === 'toAscii' || (mode === 'auto' && isNonAscii)) {
        direction = 'toAscii';
      } else if (mode === 'toUnicode' || (mode === 'auto' && isPunycode)) {
        direction = 'toUnicode';
      } else if (mode === 'auto') {
        direction = 'toAscii';
      } else {
        direction = mode;
      }

      const unicodeDomain = direction === 'toUnicode' ? toUnicode(domain) : domain;
      const asciiDomain = direction === 'toAscii' ? toASCII(domain) : toASCII(toUnicode(domain));
      const displayUnicode = direction === 'toAscii' ? domain : toUnicode(domain);

      const labels = displayUnicode.split('.');
      const analysis = labels.map(label => ({
        label,
        ascii: toASCII(label.includes('.') ? label : label).replace(/\.$/, ''),
        ...analyzeLabel(label),
      }));

      setResult({
        input: domain,
        unicode: displayUnicode,
        ascii: asciiDomain,
        direction,
        labels: analysis,
        isIDN: isNonAscii || isPunycode,
      });
    } catch (e) {
      setError('Conversion failed: ' + e.message);
    }
  }, [input, mode]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      {/* Converter Form */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { value: 'auto', label: 'Auto Detect' },
            { value: 'toAscii', label: 'Unicode → Punycode' },
            { value: 'toUnicode', label: 'Punycode → Unicode' },
          ].map(opt => (
            <button key={opt.value} onClick={() => setMode(opt.value)}
              style={{
                padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600,
                background: mode === opt.value ? '#8b5cf6' : '#1a1a1a',
                color: mode === opt.value ? '#fff' : '#999',
                border: '1px solid', borderColor: mode === opt.value ? '#8b5cf6' : '#2a2a2a',
                borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s',
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Enter domain (e.g., münchen.de or xn--mnchen-3ya.de)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && convert()}
            style={{ ...inputStyle, flex: 1, minWidth: '250px' }}
          />
          <button onClick={convert} style={btnStyle}
            onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.background = '#8b5cf6'}>
            Convert
          </button>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div style={{ ...cardStyle, borderColor: '#8b5cf620' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: '#8b5cf6' }}>
            Conversion Result
          </h3>

          <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
            {/* Unicode */}
            <div style={{ background: '#111', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Unicode (IDN)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.25rem', fontFamily: 'ui-monospace, monospace', color: '#fff', flex: 1, wordBreak: 'break-all' }}>
                  {result.unicode}
                </span>
                <button onClick={() => copyToClipboard(result.unicode)}
                  style={{ padding: '6px 12px', background: '#1e1e1e', border: '1px solid #333', borderRadius: '6px', color: '#ccc', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* ASCII / Punycode */}
            <div style={{ background: '#111', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ASCII (Punycode)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.25rem', fontFamily: 'ui-monospace, monospace', color: '#fff', flex: 1, wordBreak: 'break-all' }}>
                  {result.ascii}
                </span>
                <button onClick={() => copyToClipboard(result.ascii)}
                  style={{ padding: '6px 12px', background: '#1e1e1e', border: '1px solid #333', borderRadius: '6px', color: '#ccc', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* IDN Badge */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
              background: result.isIDN ? 'rgba(139,92,246,0.15)' : 'rgba(34,197,94,0.15)',
              color: result.isIDN ? '#a78bfa' : '#4ade80',
              border: '1px solid', borderColor: result.isIDN ? 'rgba(139,92,246,0.3)' : 'rgba(34,197,94,0.3)',
            }}>
              {result.isIDN ? '🌐 Internationalized Domain Name' : '✓ ASCII-only Domain'}
            </span>
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem',
              background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)',
            }}>
              {result.direction === 'toAscii' ? 'Unicode → Punycode' : 'Punycode → Unicode'}
            </span>
          </div>

          {/* Label Breakdown */}
          {result.labels.some(l => l.hasNonAscii) && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ccc', marginBottom: '12px' }}>
                Character Breakdown
              </h4>
              {result.labels.filter(l => l.hasNonAscii).map((label, i) => (
                <div key={i} style={{ background: '#111', borderRadius: '8px', padding: '16px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                    Label: <span style={{ color: '#fff' }}>{label.label}</span> → <span style={{ color: '#a78bfa', fontFamily: 'monospace' }}>{toASCII(label.label)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {label.codePoints.map((cp, j) => (
                      <div key={j} style={{
                        padding: '6px 10px', background: cp.hex.length > 6 || cp.char.codePointAt(0) > 127 ? 'rgba(139,92,246,0.1)' : '#0d0d0d',
                        border: '1px solid', borderColor: cp.char.codePointAt(0) > 127 ? 'rgba(139,92,246,0.3)' : '#222',
                        borderRadius: '6px', textAlign: 'center', minWidth: '48px',
                      }}>
                        <div style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{cp.char}</div>
                        <div style={{ fontSize: '0.65rem', color: '#888', fontFamily: 'monospace' }}>{cp.hex}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Examples */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#ccc' }}>
          Try These Examples
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
          {EXAMPLES.map((ex, i) => (
            <button key={i}
              onClick={() => { setInput(ex.unicode); setMode('toAscii'); }}
              style={{
                padding: '12px 16px', background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px',
                color: '#ccc', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s',
                display: 'flex', flexDirection: 'column', gap: '4px',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#8b5cf6'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}>
              <span style={{ fontSize: '1rem', fontFamily: 'monospace' }}>{ex.unicode}</span>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>{ex.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
