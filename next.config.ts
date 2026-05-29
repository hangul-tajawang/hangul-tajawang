import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '*.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: '*.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: 'www.transparenttextures.com',
      },
      // Supabase Storage 도메인 추가
      {
        protocol: 'https',
        hostname: 'lxvbibfmvsrdstwwlkdm.supabase.co',
      }
    ],
  },
};

export default nextConfig;
