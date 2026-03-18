import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
