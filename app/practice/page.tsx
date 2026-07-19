import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Keyboard, Layout, PenTool, MousePointer2, ChevronRight, Star, Sparkles, BookOpenText, HelpCircle } from "lucide-react";
import { KeyboardAdBanner } from "@/components/layout/KeyboardAdBanner";

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
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/practice',
  },
  openGraph: {
    title: "연습 모드 선택 - 한글타자왕",
    description: "한글 타자 마스터를 위한 첫 걸음, 모드를 선택하세요.",
    url: "https://www.hangul-tajawang.com/practice",
  }
};

export default function PracticePage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-4">연습 모드 선택</h1>
        <p className="text-zinc-500 font-medium text-lg">기초부터 탄탄하게, 실력에 맞는 모드를 골라보세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PracticeModeCard 
          href="/practice/position"
          icon={<Keyboard className="text-blue-600" />}
          title="자리 연습"
          description="ㅁㄴㅇㄹ 기본 자리부터 <br/>자판 위치를 정확히 익힙니다."
          color="blue"
        />
        <PracticeModeCard 
          href="/practice/word"
          icon={<Layout className="text-indigo-600" />}
          title="낱말 연습"
          description="실전 단어를 치며 <br/>정확도와 속도를 높입니다."
          color="indigo"
        />
        <PracticeModeCard 
          href="/practice/short"
          icon={<PenTool className="text-purple-600" />}
          title="짧은 글 연습"
          description="시구, 명언, 가사 등 <br/>짧은 문장을 연습합니다."
          color="purple"
        />
      </div>

      <div className="mt-20 p-8 bg-zinc-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles size={120} />
        </div>
        <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                <Star size={24} className="text-yellow-400 fill-yellow-400" /> 긴 글 연습도 해볼까요?
            </h2>
            <p className="text-zinc-400 font-medium">원고지에 써내려가는 감성 필사, 긴 글 연습 페이지로 이동합니다.</p>
        </div>
        <Link prefetch={false} 
            href="/transcription" 
            
            className="px-8 py-4 bg-white text-zinc-900 font-black rounded-2xl hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
        >
            긴 글 연습 바로가기 <ChevronRight size={20} />
        </Link>
      </div>

      {/* SEO 및 정보 섹션 — 연습 모드 선택 가이드 */}
      <div className="mt-24 border-t border-zinc-200 dark:border-zinc-800 pt-16 space-y-16 text-left">
        <section className="space-y-5">
          <div className="flex items-center gap-3 text-primary">
            <BookOpenText size={28} />
            <h2 className="text-2xl md:text-3xl font-black">어떤 연습 모드를 골라야 할까요</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-loose font-medium break-keep">
            한글타자왕은 실력과 목적에 맞춰 세 가지 타자 연습 모드를 제공합니다. 자신의 단계에 맞는 모드를 골라
            <strong className="text-on-surface"> 자리 → 낱말 → 짧은 글</strong> 순으로 넓혀가면 오타 없이 타수를 끌어올릴 수 있습니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ['자리 연습', 'ㅁㄴㅇㄹ 기본 자리부터 자판 위치와 올바른 손가락 배치를 익히는 기초 단계. 독수리 타법 교정의 출발점입니다.'],
              ['낱말 연습', '자판이 손에 익었다면 실제 단어를 치며 손놀림의 흐름과 정확도를 다지는 단계입니다.'],
              ['짧은 글 연습', '명언·힐링·속담 등 테마 문장을 치며 속도와 정확도를 실전 감각으로 끌어올리는 단계입니다.'],
            ].map(([t, d]) => (
              <div key={t} className="p-6 bg-surface-low rounded-2xl border border-surface-high">
                <h3 className="font-black mb-2 text-on-surface">{t}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed break-keep">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-3 text-blue-500">
            <HelpCircle size={28} />
            <h2 className="text-2xl md:text-3xl font-black">자주 묻는 질문</h2>
          </div>
          <div className="space-y-4">
            {PRACTICE_FAQ.map((f) => (
              <details key={f.q} className="group bg-surface-low rounded-2xl border border-surface-high p-6 open:pb-6">
                <summary className="cursor-pointer list-none font-black text-on-surface flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none shrink-0">+</span>
                </summary>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-loose break-keep">{f.a}</p>
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

function PracticeModeCard({ href, icon, title, description, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 shadow-blue-100 dark:shadow-none",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 shadow-indigo-100 dark:shadow-none",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 shadow-purple-100 dark:shadow-none",
  };

  return (
    <Link prefetch={false} 
      href={href}
      
      className="group bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center text-center shadow-sm"
    >
      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl ${colorMap[color]}`}>
        {React.cloneElement(icon, { size: 40 })}
      </div>
      <h3 className="text-2xl font-black mb-4 group-hover:scale-110 transition-transform">{title}</h3>
      <p className="text-zinc-500 font-medium leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: description }}></p>
      <div className="flex items-center gap-1 text-sm font-black opacity-0 group-hover:opacity-100 transition-opacity">
        시작하기 <ChevronRight size={16} />
      </div>
    </Link>
  );
}
