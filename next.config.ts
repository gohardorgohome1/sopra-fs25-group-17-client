import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = { process: require.resolve("process/browser") };
    return config;
  },
};

export default nextConfig;
