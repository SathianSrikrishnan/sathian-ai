/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
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
}

module.exports = nextConfig
