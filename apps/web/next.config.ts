import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  async rewrites() {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const backendUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
