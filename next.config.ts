import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "corsproxy.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
