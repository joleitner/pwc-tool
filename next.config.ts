import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.PROJECT_REF}.supabase.co`,
        port: "",
        pathname: "/storage/v1/object/sign/group-images/**",
      },
    ],
  },
};

export default nextConfig;
