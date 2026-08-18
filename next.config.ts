import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// next dev에서 Cloudflare 바인딩(R2/D1/DO)에 접근할 수 있게 해준다. 프로덕션 빌드에는 영향 없음.
initOpenNextCloudflareForDev();

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
      {
        // 키보드 추천(쿠팡 제휴) 섹션 폐지 — 잔여 검색 유입·외부 링크를 홈으로 영구 이동
        source: '/recommend/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/recommend',
        destination: '/',
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Vercel 이미지 최적화(변형) 과금을 전면 차단.
    //   실제 변형 소비의 주범은 책표지(소스 9개)가 아니라 유저 아바타였다:
    //   profiles.avatar_url 88개(Supabase 58 / Kakao 30)가 리더보드·헤더·댓글·알림 등에서 next/image로 최적화됐고,
    //   Supabase 아바타의 ?v=<타임스탬프> 캐시버스터 탓에 프사를 바꿀 때마다 새 소스=새 변형이 생겨 dedup이 무력화됐다.
    //   전역 unoptimized로 카카오 포함 전 이미지를 원본 그대로 서빙 → 변형 소비 0, 앞으로 추가되는 이미지도 자동 커버.
    //   (표지는 업로드 시 800px WebP 리사이즈, 카카오/기존 아바타는 원래 작아 부작용 없음.)
    unoptimized: true,
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
