/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Allow Supabase storage images (avatars, etc.)
      {
        protocol: "https",
        hostname: "vknwvnzjszleaqbtkxsn.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default nextConfig;
