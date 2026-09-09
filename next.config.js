/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  outputFileTracingRoot: __dirname,
  // Prevent webpack from bundling native modules used by Solana/Umi
  serverExternalPackages: [
      "ws",
      "bufferutil",
      "utf-8-validate",
      "@solana/web3.js",
      "@coral-xyz/anchor",
      "@metaplex-foundation/umi-uploader-irys",
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.sathian.ai' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'toothfairy.sathian.ai' }],
        destination: 'https://toothfairy.network',
        permanent: true,
      },
      {
        source: '/voice/:path*',
        destination: '/#agent',
        permanent: true,
      },
      {
        source: '/ccac-vibe-piano',
        destination: '/ccac',
        permanent: false,
      },
      {
        source: '/btc-atlas',
        destination: 'https://btc.sathian.ai',
        permanent: true,
      },
      {
        source: '/toothfairy',
        destination: 'https://toothfairy.network',
        permanent: true,
      },
      {
        source: '/toothfairy/:path*',
        destination: 'https://toothfairy.network',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/ccac',
        destination: '/ccac-vibe-piano/index.html',
      },
      {
        source: '/writings/saraswati-lakshmi-and-the-ledger',
        destination: '/features/saraswati-lakshmi-ledger.html',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=(), payment=(), usb=()',
          },
        ],
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
