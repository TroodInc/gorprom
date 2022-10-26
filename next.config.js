/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '45.138.163.227',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/profile',
        destination: '/profile/profile',
        permanent: true,
      },
      {
        source: '/',
        destination: '/market/product',
        permanent: true,
      },
      {
        source: '/market',
        destination: '/market/product',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
