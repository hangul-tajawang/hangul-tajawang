import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { blogPosts } from '@/lib/blog-data';

export const revalidate = 3600; // 1시간마다 캐시 갱신

export async function GET() {
  const baseUrl = 'https://www.hangul-tajawang.com';

  try {
    // 가장 최근에 등록된 유저 필사 챌린지 50개를 가져옵니다.
    // 주의: profiles 대신 반드시 profiles!typing_contents_author_id_fkey 릴레이션을 명시해야 합니다.
    const { data: contents, error } = await supabase
      .from('typing_contents')
      .select('id, title, content, created_at, profiles!typing_contents_author_id_fkey(nickname)')
      .lt('report_count', 10)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('RSS Feed Supabase Error:', error);
      // DB 에러가 발생해도 크롤러가 뻗지 않도록 최소한의 빈 XML을 반환합니다.
    }

    // 블로그 글 (최신순)
    const blogXml = [...blogPosts]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${baseUrl}/blog/${post.id}</link>
        <guid isPermaLink="true">${baseUrl}/blog/${post.id}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.description}]]></description>
        <author>한글타자왕</author>
      </item>
    `).join('');

    const itemsXml = (contents || []).map((item: any) => `
      <item>
        <title><![CDATA[${item.title} - 유저 창작 필사]]></title>
        <link>${baseUrl}/challenge/${item.id}</link>
        <guid isPermaLink="true">${baseUrl}/challenge/${item.id}</guid>
        <pubDate>${new Date(item.created_at).toUTCString()}</pubDate>
        <description><![CDATA[${item.content.substring(0, 150)}...]]></description>
        <author>${item.profiles?.nickname || '익명 참가자'}</author>
      </item>
    `).join('');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>한글타자왕 - 타자 연습 가이드 및 필사 챌린지</title>
          <link>${baseUrl}</link>
          <description>타자 연습 가이드, 맞춤법 콘텐츠, 유저들이 등록한 필사 챌린지 소식을 전합니다.</description>
          <language>ko-KR</language>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
          ${blogXml}
          ${itemsXml}
        </channel>
      </rss>`;

    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (err) {
    console.error('RSS Feed Generation Exception:', err);
    return new NextResponse('Error generating feed', { status: 500 });
  }
}
