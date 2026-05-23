/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://oochhyhkkqvkotrjnzuk.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vY2hoeWhra3F2a290cmpuenVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNjUzOTgsImV4cCI6MjA5NDk0MTM5OH0.QKEuGSv_5zJzyHLAO8v8xt40KRpZsLgqO5LQ-N7ocRk",
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
