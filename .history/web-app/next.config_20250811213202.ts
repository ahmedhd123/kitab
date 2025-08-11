import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Increase body size limit for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  }
};

export default nextConfig;
