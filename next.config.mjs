/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wxrcttjxwvzerznghyen.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/biz-bucket/**",
      },
    ],
  },
};

export default nextConfig;
