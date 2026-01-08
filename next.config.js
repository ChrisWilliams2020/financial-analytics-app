/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  images: {
    domains: ['localhost', 'medpact-assets.s3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  env: {
    MEDPACT_API_URL: process.env.MEDPACT_API_URL || 'https://api.medpact.com',
    MEDPACT_FINANCIAL_API_URL: process.env.MEDPACT_FINANCIAL_API_URL || 'https://financial-api.medpact.com',
    SEC_EDGAR_API_URL: process.env.SEC_EDGAR_API_URL || 'https://data.sec.gov/submissions',
    TRADINGVIEW_API_KEY: process.env.TRADINGVIEW_API_KEY,
    POLYGON_API_KEY: process.env.POLYGON_API_KEY,
    AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY,
    AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION
  },
  
  async headers() {
    return [
      {
        // Apply CORS headers to API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
  
  webpack: (config, { isServer }) => {
    // Fix for canvas module in client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
