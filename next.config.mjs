/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*', // Serve from the mapped directory
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hono-api.pictusweb.com',
        pathname: '/api/upload/proud2next/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3013',
        pathname: '/api/upload/proud2next/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
}

export default nextConfig
