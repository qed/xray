import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;