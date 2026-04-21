import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloudinary.images-iherb.com",
      },
      {
        protocol: "http",
        hostname: "cloudinary.images-iherb.com",
      },
    ],
  },
};

export default nextConfig;
