import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:4001";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd()
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
