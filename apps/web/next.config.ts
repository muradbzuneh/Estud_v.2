import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@estud/api", "@estud/db"],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
