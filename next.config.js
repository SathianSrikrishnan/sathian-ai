/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  transpilePackages: ['pdfjs-dist'],
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
      {
        source: '/btc-atlas',
        destination: 'https://btc.sathian.ai',
        permanent: true,
      },
    ]
  },
  // Subdomain routing handled by middleware.ts
}

module.exports = nextConfig
