// Post-build: writes out/_headers (Netlify / Cloudflare Pages format) with security headers and a CSP
// that allow-lists every inline <script> in the export by sha256 (the pre-paint bootstrap and Next's flight data).
// Static export cannot set headers itself, so host-level headers are the only place CSP can live.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('out');
if (!fs.existsSync(out)) { console.error('make-headers: run next build first'); process.exit(1); }
const pages = new Map(); // url path -> Set of inline-script hashes
const sha = (t) => `'sha256-${createHash('sha256').update(t).digest('base64')}'`;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) {
      const html = fs.readFileSync(p, 'utf8');
      const set = new Set();
      for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) if (m[1].trim()) set.add(sha(m[1]));
      let url = '/' + path.relative(out, p).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '');
      pages.set(url === '/404' ? '/404.html' : url, set);
    }
  }
})(out);

const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT?.trim();
let connect = "'self'";
if (endpoint) { try { connect += ' ' + new URL(endpoint).origin; } catch { console.warn('make-headers: NEXT_PUBLIC_FORM_ENDPOINT is not a valid URL, ignored'); } }
const cspFor = (hashes) => [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].join(' ')}`,
  "style-src 'self' 'unsafe-inline'", // React style attributes (CSS custom properties for stagger, sizes) need this
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src ${connect}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  `form-action 'self'${endpoint ? ' ' + connect.replace("'self' ", '') : ''}`,
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');
// Ship report-only first; rename the header to Content-Security-Policy once the browser console is clean in production.
const headerName = process.env.CSP_ENFORCE === '1' ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only';
// One block per page: hosts merge matching blocks by appending duplicate headers, so CSP must live ONLY in the page block.
// Each page gets its own short hash list (hosts cap header lines at ~2000 chars; a site-wide union would exceed it).
const pageBlocks = [...pages].sort().map(([url, set]) => {
  const csp = cspFor(set);
  const paths = url === '/' || url.endsWith('.html') ? [url] : [url, url + '/'];
  return `${paths.join('\n')}\n  ${headerName}: ${csp}`;
});
const longest = Math.max(...pageBlocks.map((b) => b.split('\n').at(-1).length));
if (longest > 1900) console.warn(`make-headers: longest CSP line is ${longest} chars; some hosts cap header lines at 2000`);
const body = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/brand/*
  Cache-Control: public, max-age=86400

${pageBlocks.join('\n\n')}
`;
fs.writeFileSync(path.join(out, '_headers'), body);
console.log(`make-headers: ${pages.size} pages, longest CSP line ${longest} chars, ${headerName}`);
