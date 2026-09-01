import { localeAlternates } from '@/lib/i18n/alternates';
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { KeyboardAdBanner } from "@/components/layout/KeyboardAdBanner";
import { PageHeader } from "@/components/ui/PageHeader";

const PRACTICE_FAQ = [
  {
    q: '타자 연습, 어떤 순서로 하는 게 좋나요?',
    a: '자판 위치가 익숙하지 않다면 자리 연습 → 낱말 연습 → 짧은 글 연습 순서를 추천합니다. 손가락이 자판을 기억한 뒤 단어, 문장으로 단계를 넓혀가야 오타 없이 속도가 붙습니다. 이미 자판이 익숙하다면 낱말이나 짧은 글부터 시작해도 좋습니다.',
  },
  {
    q: '독수리 타법을 고치고 싶어요.',
    a: '자리 연습부터 시작하세요. 각 키에 배정된 올바른 손가락으로만 치는 원칙을 지키며 낱말 연습으로 넘어가면, 두 손가락에 의존하던 습관이 며칠 안에 교정됩니다.',
  },
  {
    q: '하루에 얼마나 연습해야 하나요?',
    a: '몰아서 오래 하기보다 하루 10~15분씩 꾸준히 하는 편이 훨씬 효과적입니다. 손가락의 근육 기억은 반복 빈도에 비례해 자리 잡기 때문입니다.',
  },
];

export const metadata: Metadata = {
  title: "타자 연습 모드 선택 - 자리/낱말/짧은글",
  description: "기초 자리 연습부터 실전 낱말, 감성 짧은 글 연습까지! 나에게 맞는 연습 모드를 선택해 타자 실력을 키워보세요.",
  alternates: localeAlternates('/practice', 'ko'),
  openGraph: {
    title: "연습 모드 선택 - 한글타자왕",
    description: "한글 타자 마스터를 위한 첫 걸음, 모드를 선택하세요.",
    url: "https://www.hangul-tajawang.com/practice",
  }
};

const MODES = [
  {
    href: "/practice/position",
    key: "자",
    title: "자리 연습",
    description: "ㅁㄴㅇㄹ 기본 자리부터 자판 위치를 정확히 익힙니다.",
    level: "기초",
  },
  {
    href: "/practice/word",
    key: "낱",
    title: "낱말 연습",
    description: "실전 단어를 치며 정확도와 속도를 높입니다.",
    level: "중급",
  },
  {
    href: "/practice/short",
    key: "글",
    title: "짧은 글 연습",
    description: "시구, 명언, 가사 등 짧은 문장을 연습합니다.",
    level: "실전",
  },
  {
    href: "/journey",
    key: "지",
    title: "지식으로 연습하기",
    description: "조선 왕조·세계 수도·주기율표 — 타자 연습하며 지식까지 외웁니다.",
    level: "지식타자",
  },
];

export default function PracticePage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <PageHeader
        eyebrow="Practice"
        title="연습 모드 선택"
        description="기초부터 탄탄하게, 실력에 맞는 모드를 골라보세요. 자리 → 낱말 → 짧은 글 순서를 추천합니다."
        className="mb-12"
      />

      {/* 연습 모드 — 아이콘 박스 대신 키캡(한글 글자) 모티프, 리스트형 행 */}
      <div className="divide-y divide-outline-variant border-y border-outline-variant">
        {MODES.map((mode, i) => (
          <Link
            key={mode.href}
            prefetch={false}
            href={mode.href}
            className="group flex items-center gap-6 py-7 px-2 hover:bg-surface-low transition-colors"
          >
            <span className="keycap w-14 h-14 text-2xl shrink-0 group-hover:border-primary group-hover:text-primary transition-colors">
              {mode.key}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{mode.title}</h3>
                <span className="text-[11px] font-semibold text-zinc-500 tracking-widest">{mode.level} · STEP {i + 1}</span>
              </div>
              <p className="mt-1 text-zinc-600 leading-relaxed">{mode.description}</p>
            </div>
            <ChevronRight size={20} className="text-zinc-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        ))}
      </div>

      {/* 원고지 필사 안내 — 잉크 배너 */}
      <div className="mt-16 p-8 md:p-10 bg-on-surface rounded-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="serif-display text-2xl font-bold mb-2">원고지 필사도 해볼까요?</h2>
          <p className="text-zinc-400">원고지에 써내려가는 감성 필사, 원고지 필사 페이지로 이동합니다.</p>
        </div>
        <Link
          prefetch={false}
          href="/transcription"
          className="px-8 py-4 bg-white text-on-surface font-semibold rounded-xl hover:bg-zinc-100 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          원고지 필사 바로가기 <ChevronRight size={20} />
        </Link>
      </div>

      {/* SEO 및 정보 섹션 — 연습 모드 선택 가이드 */}
      <div className="mt-24 border-t border-outline-variant pt-16 space-y-16 text-left">
        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold">어떤 연습 모드를 골라야 할까요</h2>
          <p className="text-zinc-600 leading-loose break-keep">
            한글타자왕은 실력과 목적에 맞춰 세 가지 타자 연습 모드를 제공합니다. 자신의 단계에 맞는 모드를 골라
            <strong className="text-on-surface"> 자리 → 낱말 → 짧은 글</strong> 순으로 넓혀가면 오타 없이 타수를 끌어올릴 수 있습니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-outline-variant border border-outline-variant">
            {[
              ['자리 연습', 'ㅁㄴㅇㄹ 기본 자리부터 자판 위치와 올바른 손가락 배치를 익히는 기초 단계. 독수리 타법 교정의 출발점입니다.'],
              ['낱말 연습', '자판이 손에 익었다면 실제 단어를 치며 손놀림의 흐름과 정확도를 다지는 단계입니다.'],
              ['짧은 글 연습', '명언·힐링·속담 등 테마 문장을 치며 속도와 정확도를 실전 감각으로 끌어올리는 단계입니다.'],
            ].map(([t, d]) => (
              <div key={t} className="p-6 bg-surface-lowest">
                <h3 className="font-bold mb-2 text-on-surface">{t}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed break-keep">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold">자주 묻는 질문</h2>
          <div className="divide-y divide-outline-variant border-y border-outline-variant">
            {PRACTICE_FAQ.map((f) => (
              <details key={f.q} className="group py-5 px-1">
                <summary className="cursor-pointer list-none font-bold text-on-surface flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none shrink-0">+</span>
                </summary>
                <p className="mt-4 text-sm text-zinc-600 leading-loose break-keep">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16 pt-16 border-t border-outline-variant/60">
        <KeyboardAdBanner />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: PRACTICE_FAQ.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </div>
  );
}
