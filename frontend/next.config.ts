import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@tensorflow-models/pose-detection'],
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

export default nextConfig;
