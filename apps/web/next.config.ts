import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@estud/api", "@estud/db"],
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
