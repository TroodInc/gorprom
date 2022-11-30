/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: (process.env.NEXT_PUBLIC_MEDIA_HOSTS || 'localhost')
      .split(',').map(item => item.trim()),
  },
  async redirects() {
    return [
      {
        source: '/profile',
        destination: '/profile/profile',
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
