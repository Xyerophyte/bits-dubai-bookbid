/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint in production
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checks in production
  },
  images: {
    unoptimized: false, // Enable image optimization for production
    domains: ['blob.v0.dev'], // Allow v0 blob images
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/auth',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
