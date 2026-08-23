const isProd = process.env.NODE_ENV === 'production';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = 'Swachhi-AI';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isProd && isGithubActions ? `/${repoName}` : '',
  assetPrefix: isProd && isGithubActions ? `/${repoName}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // better-sqlite3 is a native module — only for server
      config.externals = config.externals || [];
      config.externals.push('better-sqlite3');
    }
    return config;
  },
};

export default nextConfig;
