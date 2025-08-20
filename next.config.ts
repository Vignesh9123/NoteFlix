import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname:'i.ytimg.com'
      },
      {
        protocol: 'https',
        hostname:'yt3.ggpht.com'
      }
    ],
  },
};

export default nextConfig;
