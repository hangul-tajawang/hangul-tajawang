import { Metadata } from 'next';
import { QUIZ_DATA } from '@/lib/quiz-data';
import { SpellingQuiz } from '@/components/quiz/SpellingQuiz';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PenTool, CheckCircle2 } from 'lucide-react';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const data = QUIZ_DATA.find((t) => t.id === resolvedParams.id);
  if (!data) return {};

  return {
    title: `${data.correctAnswer} 맞춤법 - ${data.aeoQuestion} | 한글타자왕`,
    description: data.aeoAnswer,
    keywords: [
      data.correctAnswer, 
      ...data.wrongAnswers, 
      "맞춤법 퀴즈", 
      "한국어 문법", 
      "띄어쓰기", 
      "어문 규범"
    ],
    alternates: {
      canonical: `https://www.hangul-tajawang.com/quiz/${data.id}`,
    },
    openGraph: {
      title: data.aeoQuestion,
      description: data.aeoAnswer,
      url: `https://www.hangul-tajawang.com/quiz/${data.id}`,
      type: "article",
    }
  };
}

export function generateStaticParams() {
  return QUIZ_DATA.map((t) => ({ id: t.id }));
}

export default async function QuizDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const currentIndex = QUIZ_DATA.findIndex((t) => t.id === resolvedParams.id);
  
  if (currentIndex === -1) notFound();
  
  const data = QUIZ_DATA[currentIndex];
  const nextData = currentIndex < QUIZ_DATA.length - 1 ? QUIZ_DATA[currentIndex + 1] : null;
  // 관련 맞춤법 문제 — 목록에서 이어지는 6개(순환)로 내부 링크를 강화한다
  const relatedQuizzes = Array.from({ length: 6 }, (_, i) =>
    QUIZ_DATA[(currentIndex + 1 + i) % QUIZ_DATA.length]
  ).filter((q) => q.id !== data.id);

  // AEO & SEO: FAQ Schema Markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": data.aeoQuestion,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": data.aeoAnswer
      }
    }]
  };

  return (
    <div className="w-full py-8 text-on-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="flex flex-col items-center">
        {/* 인터랙티브 퀴즈 컴포넌트 */}
        <Suspense fallback={<div className="animate-pulse bg-zinc-100 dark:bg-zinc-800 w-full max-w-2xl mx-auto h-80 rounded-3xl my-12" />}>
          <SpellingQuiz 
            question={data} 
            nextQuestionId={nextData?.id || null} 
            currentIndex={currentIndex} 
            totalLength={QUIZ_DATA.length} 
          />
        </Suspense>

        {/* AEO 최적화 맞춤법 사전 아티클 영역 */}
        <article className="mt-12 w-full max-w-4xl px-6 lg:px-8 animate-in fade-in duration-1000">
            <h1 className="text-3xl font-black mb-8 border-b border-surface-high pb-4 text-zinc-900 dark:text-zinc-100">
               사전 해설: {data.aeoQuestion}
            </h1>
            
            <div className="prose dark:prose-invert prose-lg text-zinc-700 dark:text-zinc-300 max-w-none">
                <dl className="mb-10 space-y-6">
                    <div className="bg-surface-low p-8 rounded-3xl border border-surface-high">
                        <dt className="text-xl font-bold flex items-center gap-2 mb-4 text-zinc-900 dark:text-zinc-100">
                           <span className="text-blue-600">Q.</span> 맞춤법이 헷갈려요!
                        </dt>
                        <dd className="leading-relaxed">
                            {data.aeoQuestion}
                        </dd>
                    </div>
                    
                    <div className="bg-surface-lowest p-8 rounded-3xl border border-surface-high">
                        <dt className="text-xl font-bold flex items-center gap-2 mb-4 text-zinc-900 dark:text-zinc-100">
                           <span className="text-green-600"><CheckCircle2/></span> 명쾌한 정답
                        </dt>
                        <dd className="leading-relaxed space-y-4 font-medium">
                            <p>{data.aeoAnswer}</p>
                            <div className="pt-4 border-t border-surface-high text-sm text-zinc-600 dark:text-zinc-400">
                                <strong>💡 한글타자왕 기억 팁:</strong> {data.studyTip}
                            </div>
                        </dd>
                    </div>
                </dl>
                
                {/* Internal Linking to Practice Mode */}
                <div className="mt-12 text-center flex flex-col items-center">
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6 font-medium">머리로만 외우지 말고 손가락으로 직접 쳐서 기억하세요.</p>
                    <Link prefetch={false} 
                        href="/practice/short/healing" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl hover:scale-105 transition-transform"
                    >
                        <PenTool size={20} /> 실전 짧은 글 타자 연습 가기
                    </Link>
                </div>

                {/* 관련 맞춤법 문제 — 내부 링크 */}
                <section className="mt-16 pt-10 border-t border-surface-high not-prose">
                    <h2 className="text-2xl font-black mb-6 text-zinc-900 dark:text-zinc-100">이런 맞춤법도 자주 틀려요</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {relatedQuizzes.map((q) => (
                            <Link
                                key={q.id}
                                prefetch={false}
                                href={`/quiz/${q.id}`}
                                className="group flex items-center justify-between gap-4 p-5 bg-surface-low rounded-2xl border border-surface-high hover:border-blue-500/50 transition-all"
                            >
                                <span className="font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                    {q.aeoQuestion}
                                </span>
                                <span className="text-blue-500 shrink-0 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Link prefetch={false} href="/quiz" className="text-sm font-black text-blue-600 dark:text-blue-400 hover:underline">
                            맞춤법 문제 전체 보기 →
                        </Link>
                    </div>
                </section>
            </div>
        </article>
      </div>
    </div>
  );
}
