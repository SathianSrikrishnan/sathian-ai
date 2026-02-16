/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  transpilePackages: ['pdfjs-dist'],
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
  async rewrites() {
    return {
      beforeFiles: [
        // toothfairy.sathian.ai → /toothfairy/* pages
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'toothfairy.sathian.ai' }],
          destination: '/toothfairy/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig
