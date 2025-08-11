import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Increase body size limit for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  
  // Disable ESLint during builds temporarily
  eslint: {
    ignoreDuringBuilds: true
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;
