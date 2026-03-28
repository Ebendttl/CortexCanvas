import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-pdf', 'pdfjs-dist'],
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'zod/v4': path.resolve(process.cwd(), 'node_modules/zod/v4/index.js'),
      'pdfjs-dist': path.resolve(process.cwd(), 'node_modules/pdfjs-dist/build/pdf.mjs'),
    };
    
    // Fix for pdfjs-dist trying to load Node-only modules in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      encoding: false,
    };

    // Add rule to handle pdfjs-dist as javascript/auto to fix ESM/CJS hazard
    config.module.rules.push({
      test: /node_modules\/pdfjs-dist/,
      type: 'javascript/auto',
    });


    return config;
  },
};

export default nextConfig;
