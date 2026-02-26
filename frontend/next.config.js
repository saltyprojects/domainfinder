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
};

module.exports = nextConfig;
