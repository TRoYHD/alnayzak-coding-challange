/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server external packages moved from experimental
  serverExternalPackages: [],
  
  // React strict mode
  reactStrictMode: true,
  
  // Image configuration
  images: {
    domains: ['localhost'],
  },
  
  // Add support for SVG imports
  webpack(config:any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;