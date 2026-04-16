import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Permissions policy — disable unneeded browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), payment=(self)",
  },
  // HSTS — 2 years, include subdomains, preload-ready
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // XSS protection for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // DNS prefetch control
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Content Security Policy
  // 'unsafe-inline' on style-src covers Tailwind runtime styles.
  // Tighten further once a nonce-based CSP is ready.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: http://149.102.155.247:9000 *.googleusercontent.com",
      "connect-src 'self' https://api.stripe.com https://novu.feendesk.com https://n8n.feendesk.com wss: ws:",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "149.102.155.247",
        port: "9000",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
