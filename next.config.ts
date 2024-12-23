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

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push((_context: any, request: string | string[], callback: (arg0: null | undefined, arg1: string | undefined) => void) => {
        if (request.includes('cache.cjs') || request.includes('.open-next/server-functions')) {
          return callback(null, `commonjs ${request}`);
        }
        callback(null, undefined);
      });
    }
    return config;
  }
};

export default nextConfig;
