/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  swcMinify: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.solonomous-labs.com https://challenges.cloudflare.com https://*.clerk.accounts.dev",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://img.clerk.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https: wss: http://localhost:5000 http://127.0.0.1:5000 https://*.vercel.app https://*.clerk.accounts.dev",
              "frame-src 'self' https://challenges.cloudflare.com https://*.clerk.accounts.dev",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      }
    ];
  },

  async rewrites() {
    let apiUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000/api/v1';

    // Strip trailing slashes
    apiUrl = apiUrl.replace(/\/+$/, '');

    // Ensure apiUrl ends with /api/v1
    if (!apiUrl.endsWith('/api/v1')) {
      apiUrl = `${apiUrl}/api/v1`;
    }

    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/:path*`
      }
    ];
  }
};

export default nextConfig;
