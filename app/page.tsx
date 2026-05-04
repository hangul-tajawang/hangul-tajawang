import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ── 홈페이지 메타데이터 (Server Component에서 export) ──────────────────────
export const metadata: Metadata = {
  title: '한글타자왕 - 무료 한글타자연습사이트 | 낱말/짧은글/필사/게임',
  description: '한글 타자 연습 사이트 한글타자왕에서 낱말 연습, 짧은 글 연습, 원고지 필사, 산성비 게임을 무료로 즐겨보세요. 독수리 타법 교정과 타자 속도 측정에 가장 효과적인 한글타자연습사이트입니다.',
  alternates: {
    canonical: 'https://www.hangul-tajawang.com',
  },
  openGraph: {
    title: '한글타자왕 - 무료 한글타자연습사이트',
    description: '낱말 연습, 짧은 글 연습, 원고지 필사, 산성비 게임을 무료로 즐겨보세요.',
    url: 'https://www.hangul-tajawang.com',
  }
};

// ── SSR 인기 챌린지 fetch ─────────────────────────────────────────────────
async function fetchPopularChallenges() {
  try {
    const { data } = await supabase
      .from('typing_contents')
      .select('id, title, category, complete_count, like_count, profiles!typing_contents_author_id_fkey(nickname)')
      .lt('report_count', 10)
      .order('like_count', { ascending: false })
      .limit(6);
    return data || [];
  } catch {
    return [];
  }
}

// ── 서버 컴포넌트 (기본 export) ───────────────────────────────────────────
export default async function Home() {
  const popularContents = await fetchPopularChallenges();

  return (
    <>
      {/*
        ══ SEO 핵심 섹션 ══════════════════════════════════════════════════
        이 영역은 서버 컴포넌트로 렌더링되어 구글봇이 JS 없이도 읽을 수 있음.
        - H1에 "한글타자연습사이트" 포함
        - 주요 내부 링크 포함
        - 인기 챌린지 <a href> 링크 포함
        ════════════════════════════════════════════════════════════════════
      */}
      <div className="sr-only">
        <h1>한글타자연습사이트 한글타자왕 - 무료 낱말/짧은글/필사/게임</h1>
        <p>
          한글타자왕은 무료 한글 타자 연습 사이트입니다. 낱말 연습, 짧은 글 연습,
          긴 글 원고지 필사, 산성비 아케이드 게임을 통해 한글 타자 속도를 측정하고
          독수리 타법을 교정할 수 있는 한글타자연습사이트입니다.
        </p>
        <nav aria-label="주요 메뉴">
          <Link href="/practice">타자 연습 - 자리/낱말/짧은글</Link>
          <Link href="/practice/word">낱말 연습 단계별 목록</Link>
          <Link href="/practice/short">짧은 글 연습 카테고리</Link>
          <Link href="/transcription">긴 글 원고지 필사 연습</Link>
          <Link href="/challenge">유저 창작 필사 챌린지</Link>
          <Link href="/game">한글 타자 게임</Link>
          <Link href="/game/acid-rain">산성비 타자 게임</Link>
          <Link href="/quiz">한글 맞춤법 퀴즈</Link>
          <Link href="/recommend">키보드 추천</Link>
          <Link href="/blog">타자 연습 블로그</Link>
        </nav>

        {/* 인기 챌린지 내부 링크 - 크롤러가 챌린지 페이지로 진입할 수 있는 경로 */}
        {popularContents.length > 0 && (
          <section aria-label="인기 필사 챌린지">
            <h2>지금 인기있는 한글 필사 챌린지</h2>
            <ul>
              {popularContents.map((c: any) => (
                <li key={c.id}>
                  <Link href={`/challenge/${c.id}`}>
                    {c.title} - {c.profiles?.nickname || '익명'} 작가의 한글 타자 연습
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* 실제 인터랙티브 UI는 클라이언트 컴포넌트로 위임 */}
      <HomeClient initialPopular={popularContents} />
    </>
  );
}
