import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true }, // static export: images are pre-optimized at build time by scripts/optimize-images.mjs
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
};

export default config;
