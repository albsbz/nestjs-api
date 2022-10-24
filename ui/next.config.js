/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'sameorigin',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  { key: 'ngrok-skip-browser-warning', value: '1' },
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  async rewrites() {
    console.log('====================================');
    console.log(
      'rewrit3',
      `${process.env.NEXT_PUBLIC_API_URL}/main/auth/:path*`,
    );
    console.log('====================================');
    return [
      // {
      //   source: '/api/:path*',
      //   destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      // },
      {
        source: '/api/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/main/auth/:path*`,
      },
      {
        source: '/api/articles/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/blog/articles/:path*`,
      },
      {
        source: '/api/files/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/blog/files/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/main/users/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
