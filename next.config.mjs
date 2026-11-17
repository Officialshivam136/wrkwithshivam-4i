/** @type {import('next').NextConfig} */

// GITHUB_PAGES=true builds a fully static site for GitHub Pages (no server, so no
// API routes — the forms fall back to a form service or the visitor's email app).
const isStatic = process.env.GITHUB_PAGES === 'true';
const basePath = isStatic ? process.env.PAGES_BASE_PATH ?? '/wrkwithshivam-4i' : '';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const nextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: isStatic ? 'true' : '',
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(isStatic
    ? {
        output: 'export',
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        // Custom headers need a server, so they only apply outside the static build.
        async headers() {
          return [{ source: '/:path*', headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
