import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ['@tensorflow-models/pose-detection'],
  outputFileTracingRoot: path.join(__dirname, '../'),
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@tensorflow/**',
      'node_modules/@mediapipe/**',
      'node_modules/sharp/**',
      'node_modules/canvas/**',
    ],
  },
};

export default nextConfig;
