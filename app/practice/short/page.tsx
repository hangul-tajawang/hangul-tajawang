import { Metadata } from 'next';
import { SHORT_TEXT_DB } from '@/lib/short-text-data';
import Link from 'next/link';
import { Quote, Sparkles, BookOpenText, Lightbulb, HeartPulse, HelpCircle } from 'lucide-react';
import { KeyboardAdSidebar } from '@/components/layout/KeyboardAdSidebar';

// 짧은 글 연습 페이지 FAQ — 구조화 데이터(JSON-LD)로도 노출
const SHORT_FAQ = [
  {
    q: '짧은 글 타자 연습은 어떻게 하나요?',
    a: '명언·힐링·동기부여·속담 등 원하는 테마를 고르면 해당 주제의 문장이 한 문장씩 화면에 나타납니다. 표시된 문장을 그대로 따라 입력하면 되고, 문장을 완성할 때마다 다음 문장으로 넘어갑니다. 별도 설치나 로그인 없이 바로 시작할 수 있습니다.',
  },
  {
    q: '왜 긴 글보다 짧은 글로 연습하나요?',
    a: '짧은 문장은 한 호흡에 끝나기 때문에 부담이 적고, 자투리 시간에 반복하기 좋습니다. 문장 하나를 완성하는 성취감이 자주 찾아와 꾸준히 이어가기 쉽고, 손가락이 자판 위치를 기억하는 자동화 훈련에도 효과적입니다.',
  },
  {
    q: '타자 속도(타수)도 확인할 수 있나요?',
    a: '연습 중 실시간으로 분당 타수(CPM)와 정확도가 표시됩니다. 처음에는 정확도를 우선해 오타 없이 치는 데 집중하고, 정확도가 안정되면 속도를 조금씩 끌어올리는 방식이 실력 향상에 가장 빠릅니다.',
  },
  {
    q: '어떤 테마부터 시작하는 게 좋나요?',
    a: '문장이 짧고 익숙한 표현이 많은 속담·명언 테마가 입문에 좋습니다. 자판이 손에 익으면 힐링·동기부여처럼 문장 호흡이 조금 더 긴 테마로 넘어가며 난이도를 자연스럽게 올려보세요.',
  },
];

export const metadata: Metadata = {
  title: "한글 짧은 글 연습 목록 - 테마별 감성 문장 타자",
  description: "명언, 힐링, 동기부여, 속담 등 다양한 카테고리의 짧은 글을 선택하여 한글 타자 연습을 매일 새롭게 즐겨보세요.",
  keywords: ["짧은 글 타자 연습", "한글 문장 연습", "타자 속도 측정", "주제별 타자 연습", "감성 문장 타자"],
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/practice/short',
  },
  openGraph: {
    title: "한글 짧은 글 타자 연습 테마 목록 | 한글타자왕",
    description: "원하는 테마별로 짧은 문장들을 쳐보며 타자 실력을 쑥쑥 올려보세요.",
    url: "https://www.hangul-tajawang.com/practice/short",
  }
};

export default function ShortPracticeListPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-16 animate-in slide-in-from-bottom duration-700">
        <h1 className="text-5xl font-bold mb-6">테마별 짧은 글 타자 연습</h1>
        <p className="text-zinc-400 font-medium text-xl leading-relaxed">
          오늘 나의 기분과 감성에 맞는 주제를 선택해 문장 타자 연습을 시작해보세요. <br className="hidden md:block" />
          짧은 시간을 투자하여 빠르고 정확하게 타이핑하는 습관을 기를 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SHORT_TEXT_DB.map((item, i) => (
          <Link prefetch={false} 
            key={item.id} 
            href={`/practice/short/${item.id}`}
            className="group flex flex-col bg-surface-low p-10 rounded-2xl border border-surface-high hover:border-primary/50 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,74,198,0.1)] relative overflow-hidden"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 group-hover:scale-110">
              <Quote size={120} />
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className="flex items-center gap-2 text-sm font-bold px-4 py-1.5 bg-primary/10 text-primary rounded-full"><Sparkles size={14} /> {item.category}</span>
              <span className="text-xs font-bold text-zinc-500 bg-surface-lowest px-4 py-2 rounded-full">총 {item.sentences.length}문장</span>
            </div>
            
            <h2 className="text-3xl font-bold text-on-surface mb-6 group-hover:text-primary transition-colors relative z-10">{item.category} 타자 연습 시작하기</h2>
            
            <div className="mt-auto px-6 py-5 bg-surface-lowest rounded-2xl border border-surface-high text-sm font-medium text-zinc-400 text-center relative z-10">
              "{item.sentences[0]}" 등...
            </div>
          </Link>
        ))}
      </div>

      {/* SEO 및 정보 섹션 — 짧은 글 타자 연습 가이드 */}
      <div className="mt-24 border-t border-zinc-200 pt-16 pb-4 space-y-16 text-left">
        {/* 1. 소개 */}
        <section className="space-y-5">
          <div className="flex items-center gap-3 text-primary">
            <BookOpenText size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">짧은 글 타자 연습이란</h2>
          </div>
          <p className="text-zinc-600 leading-loose font-medium break-keep">
            <strong className="text-on-surface">짧은 글 타자 연습</strong>은 한 문장 단위로 구성된 텍스트를 따라 치며
            한글 타자 감각을 기르는 연습입니다. 명언, 힐링 문장, 동기부여 글귀, 우리말 속담 등 테마별로 정리된 문장을
            골라 원하는 분위기에서 연습할 수 있습니다. 긴 지문을 통째로 마주할 때의 부담 없이, 짧은 호흡으로
            문장을 완성하며 <strong className="text-on-surface">속도와 정확도</strong>를 함께 다듬을 수 있는 것이 특징입니다.
          </p>
        </section>

        {/* 2. 활용 팁 */}
        <section className="space-y-5">
          <div className="flex items-center gap-3 text-amber-500">
            <Lightbulb size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">이렇게 연습하면 좋아요</h2>
          </div>
          <ul className="space-y-4">
            {[
              ['정확도 먼저, 속도는 나중에', '처음에는 오타 없이 끝까지 치는 것을 목표로 하세요. 정확도가 안정되면 속도는 자연히 따라옵니다.'],
              ['자판을 보지 않기', '문장이 짧은 만큼 화면만 보며 치는 무자판(터치 타이핑) 훈련에 적합합니다. 손가락이 위치를 외우게 하세요.'],
              ['테마를 바꿔가며', '매일 같은 문장 대신 기분에 맞는 테마를 골라 새로운 문장으로 연습하면 지루하지 않게 이어갈 수 있습니다.'],
              ['짧게 자주', '하루 5분씩 자투리 시간에 반복하는 것이 몰아서 오래 하는 것보다 습관 형성과 실력 향상에 효과적입니다.'],
            ].map(([t, d]) => (
              <li key={t} className="flex items-start gap-3">
                <span className="text-amber-500 mt-1 shrink-0">✔</span>
                <span className="text-zinc-600 leading-relaxed break-keep">
                  <strong className="text-on-surface">{t}:</strong> {d}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. 효과 */}
        <section className="space-y-5">
          <div className="flex items-center gap-3 text-emerald-600">
            <HeartPulse size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">짧은 글 연습의 효과</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ['꾸준함', '문장 하나를 완성하는 성취감이 자주 찾아와 매일의 연습을 지속하기 쉽습니다.'],
              ['자동화', '반복되는 짧은 문장이 손가락의 자판 위치 기억을 강화해 무의식적인 타이핑을 돕습니다.'],
              ['정서 환기', '좋은 문장을 눈으로 읽고 손으로 옮기는 과정 자체가 필사처럼 마음을 가라앉혀 줍니다.'],
            ].map(([t, d]) => (
              <div key={t} className="p-6 bg-surface-low rounded-2xl border border-surface-high">
                <h3 className="font-bold mb-2 text-on-surface">{t}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed break-keep">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FAQ */}
        <section className="space-y-5">
          <div className="flex items-center gap-3 text-blue-500">
            <HelpCircle size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">자주 묻는 질문</h2>
          </div>
          <div className="space-y-4">
            {SHORT_FAQ.map((f) => (
              <details key={f.q} className="group bg-surface-low rounded-2xl border border-surface-high p-6 open:pb-6">
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

      {/* FAQ 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: SHORT_FAQ.map((f) => ({
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
