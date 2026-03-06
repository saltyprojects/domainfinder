const fs = require('fs');
const { execSync } = require('child_process');

let gitSha = 'unknown';
try {
  // Try git first (works in dev / CI)
  gitSha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch {
  // Fall back to .build-sha file (written before Docker build)
  try { gitSha = fs.readFileSync('.build-sha', 'utf8').trim(); } catch {}
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_BUILD_SHA: gitSha,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
