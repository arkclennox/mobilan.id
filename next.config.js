/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'deepskyblue-oryx-260341.hostingersite.com',
      'images.pexels.com',
      'jcvtwkjpbxxedooftbso.supabase.co',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
    ],
  },
  // Disable Next.js telemetry
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;