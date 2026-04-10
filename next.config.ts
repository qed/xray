import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      { source: '/wevend', destination: '/wevend/index.html' },
      { source: '/csuite', destination: '/csuite/index.html' },
    ];
  },
};

export default nextConfig;