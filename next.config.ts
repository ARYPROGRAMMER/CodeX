import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/default',
        permanent: true, // Set to false if you want it to be a temporary redirect
      },
    ];
  },
};

export default nextConfig;
