/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
    domains: ['wsbvkcnlppmrtbxwucwx.supabase.co']
  },
  output: "standalone", // ✅ Ensures correct deployment on Netlify
  trailingSlash: true, // ✅ Helps prevent 404 errors in Netlify deployments
  reactStrictMode: true,
};

module.exports = nextConfig;
