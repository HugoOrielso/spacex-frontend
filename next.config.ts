import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images2.imgbox.com",
      },
      {
        protocol: "https",
        hostname: "**.imgbox.com", 
      },
    ],
  },
};

export default nextConfig;
