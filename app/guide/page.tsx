import { Metadata } from "next";
import Link from "next/link";
import { Keyboard, Layout, PenTool, Gamepad2, BookOpenCheck, Users, ChevronRight, HelpCircle, Timer, TramFront } from "lucide-react";

export const metadata: Metadata = {
  title: "기능 안내 - 한글 타자 연습 및 속도 측정 사이트 활용법",
  description: "한글타자왕 활용법을 안내합니다. 지식타자·필사 챌린지·한글 게임 3가지 핵심 기능부터 1분 타자 테스트, 연습장, 원고지 필사, 맞춤법 퀴즈까지 모두 무료입니다.",
  keywords: ["한글타자연습 사용법", "타자 속도 측정 방법", "온라인 타자 연습 가이드", "무료 타자 게임 안내"],
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/guide',
  }
};

// 코어 3 — 한글타자왕의 중심 기능 (지식타자 메인)
const CORE = [
  {
    href: "/journey",
    icon: <TramFront size={26} />,
    emoji: "🌏",
    title: "지식타자",
    tagline: "배움이 남는 타자",
    desc: "조선 왕조 27대, 세계 수도, 주기율표 — 순서가 있는 지식을 한 항목씩 타자로 정복하며 외웁니다. 초성 힌트를 보고 다음 항목을 떠올려 입력하는 과정 자체가 인출 연습이라, 눈으로 읽는 것보다 훨씬 오래 남습니다.",
    how: "코스를 고르고, 초성 힌트를 보고 다음 항목을 타자로 입력하세요. 진행 상황은 자동 저장됩니다.",
    cta: "지식타자 시작하기",
  },
  {
    href: "/challenge",
    icon: <Users size={26} />,
    emoji: "✍️",
    title: "필사 챌린지",
    tagline: "생각이 남는 타자",
    desc: "좋은 문장을 함께 필사하고 실시간 랭킹을 겨루는 참여형 필사입니다. 다른 사람이 올린 글에 도전할 수도, 내가 고른 글로 나만의 챌린지를 만들어 공유할 수도 있습니다.",
    how: "마음에 드는 챌린지를 골라 필사하면 타수·정확도가 랭킹에 기록됩니다. 글 등록은 로그인 후 가능해요.",
    cta: "필사 챌린지 참여하기",
  },
  {
    href: "/game",
    icon: <Gamepad2 size={26} />,
    emoji: "🎮",
    title: "한글 게임",
    tagline: "실력이 남는 타자",
    desc: "산성비, 성문방어, 글자 계단, 타자 레이스 — 추억의 타자 게임부터 오리지널 디펜스까지 6종. 게임에 몰입하는 사이 순발력과 타수가 조용히 올라갑니다.",
    how: "게임을 고르고 떨어지는(또는 몰려오는) 단어를 입력해 점수를 쌓으세요. 최고 점수는 전체 랭킹에 올라갑니다.",
    cta: "게임 즐기기",
  },
];

// 도구 — 코어를 받치는 연습·측정 도구들
const TOOLS = [
  {
    href: "/test",
    icon: <Timer size={20} />,
    title: "1분 타자 테스트",
    desc: "지금 내 타수를 1분 만에 측정하고 등급(티어)을 확인합니다. 결과 카드를 이미지로 저장해 자랑할 수 있어요.",
  },
  {
    href: "/practice/position",
    icon: <Keyboard size={20} />,
    title: "자리 연습",
    desc: "타자의 기본은 정확한 손가락 위치. 자음·모음 자리부터 기본기를 다집니다. 처음이라면 여기서 시작하세요.",
  },
  {
    href: "/practice/word",
    icon: <Layout size={20} />,
    title: "낱말 연습",
    desc: "플래시카드 방식으로 실전 단어를 입력하며 정확도와 속도를 함께 끌어올립니다.",
  },
  {
    href: "/practice/short",
    icon: <PenTool size={20} />,
    title: "짧은 글 연습",
    desc: "명언·속담·힐링 문장을 한 문장씩 입력합니다. 문장이 날아가는 손맛과 함께 실시간 타수를 확인하세요.",
  },
  {
    href: "/transcription",
    icon: <BookOpenCheck size={20} />,
    title: "원고지 필사",
    desc: "윤동주·김소월 등 한국 문학을 원고지 위에 정성스럽게 옮겨 씁니다. 완주한 글은 내 서재에 쌓입니다.",
  },
  {
    href: "/quiz",
    icon: <HelpCircle size={20} />,
    title: "맞춤법 퀴즈",
    desc: "어른도 헷갈리는 맞춤법을 퀴즈로 풀고 해설로 다집니다. 헷갈리는 표기는 지식타자처럼 손으로 굳히세요.",
  },
];

export default function GuidePage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-4">
      <header className="mb-16">
        <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-3">Guide</p>
        <h1 className="serif-display text-4xl md:text-5xl font-bold mb-5">한글타자왕 활용 가이드</h1>
        <p className="text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed break-keep">
          한글타자왕의 중심은 세 가지입니다 — 외우면서 치는 <strong className="text-on-surface">지식타자</strong>,
          함께 쓰는 <strong className="text-on-surface">필사 챌린지</strong>, 놀면서 느는 <strong className="text-on-surface">한글 게임</strong>.
          나머지 도구들은 이 셋을 더 잘하게 만들어 줍니다.
        </p>
        <div className="rule-divider mt-8" />
      </header>

      {/* ── 코어 3 ───────────────────────────────── */}
      <section className="mb-20">
        <div className="grid grid-cols-1 gap-8">
          {CORE.map((c, i) => (
            <div key={c.href} className="paper-card p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="shrink-0 flex md:flex-col items-center gap-4">
                <span className="keycap w-16 h-16 text-3xl" aria-hidden>{c.emoji}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Core {i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-2">{c.tagline}</p>
                <h2 className="serif-display text-2xl md:text-3xl font-bold mb-4">{c.title}</h2>
                <p className="text-zinc-600 leading-relaxed mb-4 break-keep">{c.desc}</p>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6 break-keep">
                  <strong className="text-zinc-600">이렇게 시작하세요 —</strong> {c.how}
                </p>
                <Link prefetch={false} href={c.href} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                  {c.cta} <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 도구 ───────────────────────────────── */}
      <section className="mb-20">
        <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-2">Tools · 도구</p>
        <h2 className="serif-display text-2xl md:text-3xl font-bold mb-8">기본기를 만드는 도구들</h2>
        <div className="divide-y divide-outline-variant border-y border-outline-variant">
          {TOOLS.map((t) => (
            <Link key={t.href} prefetch={false} href={t.href} className="group flex items-center gap-5 py-6 px-2 hover:bg-surface-low transition-colors">
              <span className="keycap w-12 h-12 shrink-0 text-primary">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{t.title}</h3>
                <p className="mt-0.5 text-sm text-zinc-600 leading-relaxed break-keep">{t.desc}</p>
              </div>
              <ChevronRight size={18} className="text-zinc-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── 추천 루트 ───────────────────────────────── */}
      <section className="mb-20">
        <h2 className="serif-display text-2xl md:text-3xl font-bold mb-8">처음이라면, 이 순서로</h2>
        <ol className="space-y-4">
          <li className="flex items-start gap-4">
            <span className="keycap w-9 h-9 text-sm shrink-0">1</span>
            <p className="text-zinc-600 leading-relaxed break-keep pt-1.5"><Link prefetch={false} href="/test" className="font-bold text-on-surface hover:text-primary">1분 타자 테스트</Link>로 현재 내 타수를 측정해 출발점을 확인합니다.</p>
          </li>
          <li className="flex items-start gap-4">
            <span className="keycap w-9 h-9 text-sm shrink-0">2</span>
            <p className="text-zinc-600 leading-relaxed break-keep pt-1.5">300타 이하라면 <Link prefetch={false} href="/practice" className="font-bold text-on-surface hover:text-primary">타자 연습장</Link>에서 자리 → 낱말 → 짧은 글 순서로 기본기를 다집니다.</p>
          </li>
          <li className="flex items-start gap-4">
            <span className="keycap w-9 h-9 text-sm shrink-0">3</span>
            <p className="text-zinc-600 leading-relaxed break-keep pt-1.5">이제 매일 <Link prefetch={false} href="/journey" className="font-bold text-on-surface hover:text-primary">지식타자</Link> 한 코스씩 — 타수와 지식이 함께 쌓입니다. 지루해지면 <Link prefetch={false} href="/game" className="font-bold text-on-surface hover:text-primary">한글 게임</Link>으로 순발력을, 감성이 필요하면 <Link prefetch={false} href="/challenge" className="font-bold text-on-surface hover:text-primary">필사 챌린지</Link>로 문장을 채우세요.</p>
          </li>
        </ol>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <div className="p-10 bg-on-surface rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="serif-display text-3xl font-bold mb-2">지금 바로 시작해보세요</h2>
          <p className="opacity-80 font-medium text-lg">설치 없이 웹에서 바로, 전부 무료입니다.</p>
        </div>
        <Link prefetch={false} href="/journey" className="px-10 py-5 bg-white text-on-surface rounded-2xl font-bold text-xl flex items-center gap-2 hover:scale-105 transition-all shrink-0">
          지식타자 시작하기 <ChevronRight />
        </Link>
      </div>
    </div>
  );
}
