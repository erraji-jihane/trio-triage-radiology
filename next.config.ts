import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // The scan intake page and the ER dashboard are static pages in public/
  async rewrites() {
    return [
      { source: "/scan", destination: "/scan/index.html" },
      { source: "/dashboard", destination: "/dashboard/index.html" },
    ];
  },
};

export default nextConfig;
