/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/profile',
        destination: '/profile/profile',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
