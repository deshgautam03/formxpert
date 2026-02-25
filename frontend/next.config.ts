import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@tensorflow-models/pose-detection'],
  outputFileTracingRoot: path.join(__dirname, '../'),
};

export default nextConfig;
