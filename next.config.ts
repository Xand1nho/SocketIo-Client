import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
      {
        protocol: "https",
        hostname: "zap-zap-socket-backend-production.up.railway.app",
      }
    ]
  }
};

export default nextConfig;
