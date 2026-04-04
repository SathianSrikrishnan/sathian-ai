/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  experimental: {
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
        source: '/toothfairy',
        destination: '/toothfairy/network',
        permanent: true,
      },
    ]
  },
  // Subdomain routing handled by middleware.ts
  webpack: (config, { isServer }) => {
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
