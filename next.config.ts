import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: {
    serverActions: {
      // admin 표지·프로필 이미지 업로드 (기본 1MB → 8MB)
      bodySizeLimit: '8mb',
    },
  },
  async redirects() {
    return [
      {
        // 저작권 이슈로 삭제된 K-POP 카테고리 → 속담/격언으로 영구 이동
        source: '/practice/short/kpop',
        destination: '/practice/short/proverb',
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
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
