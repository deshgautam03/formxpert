import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@tensorflow-models/pose-detection'],
};

export default nextConfig;
