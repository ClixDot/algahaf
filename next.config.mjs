import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: true,
  },
  // The production server runs out of memory during the "Running TypeScript"
  // step of `next build`. Type checking is done separately via
  // `npm run typecheck` (run it before pushing), so skip it during the build.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Source maps add memory pressure during build; not needed in production.
  productionBrowserSourceMaps: false,
  enablePrerenderSourceMaps: false,
};

export default nextConfig;

