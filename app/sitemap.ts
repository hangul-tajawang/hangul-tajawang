import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { LONG_TEXT_DB } from '@/lib/long-text-data';
import { BASIC_PRACTICE_STEPS } from '@/lib/word-data';
import { SHORT_TEXT_DB } from '@/lib/short-text-data';
import { QUIZ_DATA } from '@/lib/quiz-data';
import { blogPosts } from '@/lib/blog-data';

// 사이트맵을 1시간마다 재생성 (매 요청마다 DB 쿼리 방지)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.hangul-tajawang.com';

  // ✅ 고정 날짜 사용
  // new Date()를 쓰면 매번 "오늘 수정됨"으로 인식되어
  // 크롤러가 매일 모든 페이지를 강제 재크롤링합니다.
  const CONTENT_LAST_UPDATED = '2025-12-01';

  // 1. 정적 페이지
  const staticPages = [
    '',
    '/blog',
    '/practice',
    '/practice/position',
    '/practice/word',
    '/practice/short',
    '/transcription',
    '/challenge',
    '/game',
    '/game/acid-rain',
    '/game/card-flip',
    '/game/block-pop',
    '/game/castle-defense',
    '/game/typing-race',
    '/quiz',
    '/recommend',
    '/recommend/abko-mk108',
    '/guide',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const, // daily → monthly (정적 페이지는 자주 안 바뀜)
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. 블로그 포스트 (실제 작성 날짜 사용)
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // 3. 하드코딩된 콘텐츠 페이지 (고정 날짜 사용)
  const longTextPages = LONG_TEXT_DB.map(text => ({
    url: `${baseUrl}/transcription/${text.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const shortPages = SHORT_TEXT_DB.map(data => ({
    url: `${baseUrl}/practice/short/${data.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const wordPages = BASIC_PRACTICE_STEPS.map(step => ({
    url: `${baseUrl}/practice/word/${step.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const quizPages = QUIZ_DATA.map(quiz => ({
    url: `${baseUrl}/quiz/${quiz.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // 4. 동적 챌린지 페이지 (revalidate로 1시간 캐싱)
  let challengePages: any[] = [];
  try {
    const { data: contents } = await supabase
      .from('typing_contents')
      .select('id, updated_at, created_at')
      .lt('report_count', 10);

    if (contents) {
      challengePages = contents.map((content) => ({
        url: `${baseUrl}/challenge/${content.id}`,
        lastModified: new Date(content.updated_at || content.created_at).toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return [
    ...staticPages,
    ...blogPages,
    ...longTextPages,
    ...shortPages,
    ...wordPages,
    ...quizPages,
    ...challengePages,
  ];
}
