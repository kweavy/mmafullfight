/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,
  distDir: '.next',
  // Prevent build failure from fetch errors
  experimental: {
    fallbackNodePolyfills: false,
  },
  // Add timeout for fetch requests during build
  staticPageGenerationTimeout: 120, // 2 minutes
};

module.exports = nextConfig;


