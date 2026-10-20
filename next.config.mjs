/** @type {import('next').NextConfig} */
const nextConfig = {
  // Google always returns to the bare domain; a login started on www kept its cookies there and
  // failed with error=Configuration.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.prud.sk' }],
        destination: 'https://prud.sk/:path*',
        permanent: true,
      },
    ]
  },
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
        pathname: '/api/upload/prudsk2next/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3013',
        pathname: '/api/upload/prudsk2next/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
}

export default nextConfig
