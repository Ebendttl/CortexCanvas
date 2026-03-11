import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'zod/v4': path.resolve(process.cwd(), 'node_modules/zod/v4/index.js'),
    };
    return config;
  },
};

export default nextConfig;
