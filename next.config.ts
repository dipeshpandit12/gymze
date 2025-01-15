import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  optimizeFonts: true,
  experimental: {

    scrollRestoration: true
  },
  webpack: (config, { dev, isServer }) => {

    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      }
    }
    return config
  },

  onDemandEntries: {

    maxInactiveAge: 25 * 1000,

    pagesBufferLength: 2,
  }
};

export default nextConfig;