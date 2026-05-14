import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.hangul-tajawang.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/mypage/', '/*?_rsc='], // 민감한 정보 및 불필요한 RSC 크롤링 차단
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
