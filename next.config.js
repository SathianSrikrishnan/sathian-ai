/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  experimental: {
    workerThreads: true,
    // Prevent webpack from bundling native modules used by Solana/Umi
    serverComponentsExternalPackages: [
      "ws",
      "bufferutil",
      "utf-8-validate",
      "@solana/web3.js",
      "@coral-xyz/anchor",
      "@metaplex-foundation/umi-uploader-irys",
    ],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.sathian.ai' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/toothfairy/network',
        destination: '/toothfairy',
        permanent: false, // 307 — avoid browser caching (old 301 caused issues)
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Codex/Windows workspaces can block webpack's filesystem cache from
    // readlinking parent directories during dependency snapshots.
    config.cache = false

    if (!isServer) {
      // Polyfills for Solana/Anchor in browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
