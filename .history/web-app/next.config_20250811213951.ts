import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Increase body size limit for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  
  // Relax ESLint rules for development
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src']
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;
