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
    ]
  },
}

module.exports = nextConfig
