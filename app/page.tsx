import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getDailyPilsa, getKstDateString, getPilsaExcerpt } from '@/lib/daily-pilsa';

// 오늘의 필사·인기 챌린지가 빌드 시점에 고정되지 않도록 1시간마다 재검증
export const revalidate = 3600;

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

// ── 홈 하단 안내/FAQ 콘텐츠 (서버 렌더링, 크롤러와 사용자 모두에게 노출) ──
const HOME_FAQ = [
  {
    q: '한글타자왕은 무료인가요?',
    a: '네, 모든 기능이 무료입니다. 낱말 연습, 짧은 글 연습, 긴 글 원고지 필사, 산성비를 비롯한 타자 게임, 맞춤법 퀴즈까지 회원가입 없이 바로 이용할 수 있습니다. 구글/카카오 로그인을 하면 연습 기록과 타자 속도 변화를 저장할 수 있습니다.',
  },
  {
    q: '타자 속도(타수)는 어떻게 측정하나요?',
    a: '연습 화면에서 문장을 입력하는 동안 분당 타수(CPM)와 정확도가 실시간으로 계산됩니다. 낱말 연습, 짧은 글 연습, 긴 글 필사 어느 모드에서든 연습이 끝나면 결과 화면에서 평균 타수와 최고 기록을 확인할 수 있습니다.',
  },
  {
    q: '독수리 타법은 어떻게 교정하나요?',
    a: '자리 연습 모드에서 기본 손가락 위치(기준 자리)부터 단계별로 익힌 뒤, 낱말 연습으로 넘어가는 것을 추천합니다. 핵심은 키보드를 보지 않고 치는 습관을 들이는 것으로, 매일 30분씩 2~4주 정도 꾸준히 연습하면 자판을 보지 않고 칠 수 있게 됩니다.',
  },
  {
    q: '어떤 연습 모드가 있나요?',
    a: '자리 연습(키보드 위치 익히기), 낱말 연습(플래시카드 방식), 짧은 글 연습(명언·속담·힐링 문장), 긴 글 원고지 필사(윤동주·김소월 등 한국 문학), 산성비·디펜스 등 타자 게임, 한글 맞춤법 퀴즈, 그리고 다른 사용자가 만든 글로 연습하는 오픈 챌린지가 있습니다.',
  },
];

// ── 서버 컴포넌트 (기본 export) ───────────────────────────────────────────
export default async function Home() {
  const popularContents = await fetchPopularChallenges();
  const dailyPilsa = getDailyPilsa();
  const dailyDate = getKstDateString();

  // FAQ 리치 결과를 위한 구조화 데이터
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 인터랙티브 UI (히어로 h1 포함) */}
      <HomeClient initialPopular={popularContents} />

      {/*
        ══ 홈 하단 안내 섹션 ══════════════════════════════════════════════
        서버 컴포넌트로 렌더링되는 "보이는" 콘텐츠.
        (과거 sr-only 숨김 텍스트는 구글 스팸 정책상 위험해 제거함)
        ════════════════════════════════════════════════════════════════════
      */}
      <section className="container mx-auto max-w-5xl px-4 md:px-6 lg:px-8 py-16 md:py-24 text-on-surface">
        <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">
          한글타자왕, 이렇게 활용해보세요
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10 max-w-3xl">
          한글타자왕은 무료 한글 타자 연습 사이트입니다. 처음이라면 <strong>자리 연습</strong>으로
          손가락 위치를 익히고, <strong>낱말 연습</strong>과 <strong>짧은 글 연습</strong>으로
          속도를 끌어올려 보세요. 실력이 붙으면 <strong>긴 글 원고지 필사</strong>로 지구력을,
          <strong> 산성비 게임</strong>으로 순발력을 기를 수 있습니다. 연습이 지루해질 때쯤
          <strong> 맞춤법 퀴즈</strong>로 한국어 실력까지 함께 다져보세요.
        </p>

        {/* 오늘의 필사 — 매일 바뀌는 한국 문학 한 편 (습관 루프의 시작점) */}
        <Link
          prefetch={false}
          href={`/transcription/${dailyPilsa.id}`}
          className="group block mb-16 p-8 md:p-10 rounded-[2.5rem] border border-primary/30 bg-surface-low hover:border-primary/60 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,74,198,0.12)]"
        >
          <p className="text-primary font-black text-sm mb-3">✍️ 오늘의 필사 · {dailyDate}</p>
          <p className="text-2xl md:text-3xl font-black mb-2 group-hover:text-primary transition-colors">
            {dailyPilsa.title}
          </p>
          <p className="text-sm font-bold text-zinc-500 mb-5">
            {dailyPilsa.author} · {dailyPilsa.wordCount}자
          </p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-loose line-clamp-2">
            {getPilsaExcerpt(dailyPilsa)}
          </p>
          <span className="mt-5 inline-block font-black text-primary">지금 필사하기 →</span>
        </Link>

        <nav aria-label="주요 메뉴" className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
          {[
            { href: '/test', label: '1분 타자 속도 테스트' },
            { href: '/practice', label: '타자 연습 (자리/낱말/짧은글)' },
            { href: '/transcription', label: '긴 글 원고지 필사' },
            { href: '/challenge', label: '유저 창작 필사 챌린지' },
            { href: '/game/acid-rain', label: '산성비 타자 게임' },
            { href: '/quiz', label: '한글 맞춤법 퀴즈' },
            { href: '/blog', label: '타자 연습 가이드 블로그' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="px-5 py-4 bg-surface-low rounded-2xl border border-surface-high font-bold text-sm md:text-base hover:border-primary/50 hover:text-primary transition-colors"
            >
              {item.label} →
            </Link>
          ))}
        </nav>

        {/* 인기 챌린지 내부 링크 */}
        {popularContents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-black mb-6 tracking-tight">
              지금 인기있는 필사 챌린지
            </h2>
            <ul className="space-y-3">
              {popularContents.map((c: any) => (
                <li key={c.id}>
                  <Link
                    href={`/challenge/${c.id}`}
                    prefetch={false}
                    className="group flex items-baseline gap-3 hover:text-primary transition-colors"
                  >
                    <span className="font-bold text-lg group-hover:underline">{c.title}</span>
                    <span className="text-sm text-zinc-500">
                      {c.profiles?.nickname || '익명'} · ❤️ {c.like_count ?? 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 자주 묻는 질문 */}
        <h2 className="text-2xl md:text-3xl font-black mb-8 tracking-tight">자주 묻는 질문</h2>
        <dl className="space-y-6">
          {HOME_FAQ.map((item) => (
            <div
              key={item.q}
              className="bg-surface-low p-6 md:p-8 rounded-3xl border border-surface-high"
            >
              <dt className="text-lg md:text-xl font-black mb-3">{item.q}</dt>
              <dd className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
