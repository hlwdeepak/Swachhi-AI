/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // better-sqlite3 is a native module — only for server
      config.externals = config.externals || [];
      config.externals.push('better-sqlite3');
    }
    return config;
  },
  // Allow leaflet images from unpkg
  images: {
    domains: ['unpkg.com'],
  },
};

export default nextConfig;
