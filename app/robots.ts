import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.hangul-tajawang.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/mypage/'], // 민감한 정보가 있는 페이지는 제외
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
