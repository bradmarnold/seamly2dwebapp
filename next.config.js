// next.config.js
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',          // emit a static site to ./out
  basePath,                  // project path on GitHub Pages
  assetPrefix: basePath,     // ensure assets resolve under /seamly2dwebapp
  images: { unoptimized: true },
  trailingSlash: true,
  // Disable server-side features for static export
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};