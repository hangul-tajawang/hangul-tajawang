import { Metadata } from 'next';
import { QUIZ_DATA } from '@/lib/quiz-data';
import Link from 'next/link';
import { BookOpen, AlertTriangle, BookOpenText, Lightbulb, HelpCircle } from 'lucide-react';
import { KeyboardAdSidebar } from '@/components/layout/KeyboardAdSidebar';

const QUIZ_FAQ = [
  {
    q: '맞춤법 퀴즈는 어떻게 진행되나요?',
    a: '헷갈리기 쉬운 맞춤법 주제를 고르면 빈칸이 있는 문장이 나옵니다. 알맞은 표기를 선택하면 정답 여부와 함께 왜 그것이 맞는지에 대한 상세한 해설이 표시됩니다. 단순히 외우는 것이 아니라 원리를 이해하도록 구성되어 있습니다.',
  },
  {
    q: '왜 한국인도 맞춤법을 자주 틀리나요?',
    a: '\'되/돼\', \'낫다/낳다\', \'바람/바램\'처럼 발음이 비슷하거나 규칙이 헷갈리는 표현이 많기 때문입니다. 평소 무심코 쓰던 표현을 퀴즈로 한 번 짚고 해설로 원리를 익히면, 문서·메일·SNS에서 실수를 크게 줄일 수 있습니다.',
  },
  {
    q: '타자 연습과 맞춤법이 무슨 관계인가요?',
    a: '빠르게 치는 것만큼 바르게 쓰는 것도 글쓰기의 기본입니다. 타자 연습으로 속도를, 맞춤법 퀴즈로 정확한 표기를 함께 익히면 실무에서 신뢰받는 글을 더 빠르게 완성할 수 있습니다.',
  },
];

export const metadata: Metadata = {
  title: "자주 틀리는 한글 맞춤법 사전 및 퀴즈",
  description: "한국인이 가장 자주 헷갈리는 맞춤법(바람/바램, 낫다/낳다 등)을 퀴즈로 풀고 상세한 해설을 확인하세요.",
  keywords: ["맞춤법 퀴즈", "한글 타자 연습", "바람 바램", "낫다 낳다", "되 돼 구분", "띄어쓰기 앱"],
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/quiz',
  },
  openGraph: {
    title: "자주 틀리는 한글 맞춤법 사전 | 한글타자왕",
    description: "헷갈리는 맞춤법, 더 이상 틀리지 마세요. 퀴즈와 해설로 완벽 마스터!",
    url: "https://www.hangul-tajawang.com/quiz",
  }
};

export default function QuizListPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-16 animate-in slide-in-from-bottom duration-700">
        <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-3">Spelling Quiz</p>
        <h1 className="serif-display text-4xl md:text-5xl font-bold mb-6">한글 맞춤법 집중 공략</h1>
        <p className="text-zinc-600 font-medium text-xl leading-relaxed">
          어른들도 자주 헷갈리는 필수 맞춤법과 띄어쓰기 논란을 모았습니다. <br className="hidden md:block" />
          가장 취약한 문제를 골라 퀴즈를 풀고 완벽한 해설을 확인해보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {QUIZ_DATA.map((item, i) => (
          <Link prefetch={false} 
            key={item.id} 
            href={`/quiz/${item.id}`}
            
            className="group flex flex-col bg-surface-low p-8 rounded-2xl border border-surface-high hover:border-blue-500/50 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] relative overflow-hidden"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:-rotate-6 group-hover:scale-110">
              <AlertTriangle size={120} />
            </div>
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <span className="text-xs font-bold px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full">맞춤법 난제 #{i + 1}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 group-hover:text-blue-600 transition-colors relative z-10 line-clamp-1">{item.aeoQuestion}</h2>
            <p className="text-sm text-zinc-600 mb-8 relative z-10 line-clamp-2">{item.question.replace("___", "[ ? ]")}</p>
            
            <div className="mt-auto flex items-center justify-between text-sm font-bold text-blue-600 relative z-10">
              <span className="flex items-center gap-2"><BookOpen size={16} />퀴즈 풀고 해설 보기</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* SEO 및 정보 섹션 — 한글 맞춤법 가이드 */}
      <div className="mt-24 border-t border-zinc-200 pt-16 pb-4 space-y-16 text-left">
        <section className="space-y-5">
          <div className="flex items-center gap-3 text-blue-600">
            <BookOpenText size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">헷갈리는 한글 맞춤법, 퀴즈로 정복하기</h2>
          </div>
          <p className="text-zinc-600 leading-loose font-medium break-keep">
            한글 맞춤법은 규칙이 촘촘해 성인도 자주 실수합니다. <strong className="text-on-surface">한글타자왕 맞춤법 퀴즈</strong>는
            <strong className="text-on-surface"> 되/돼, 낫다/낳다/낮다, 바람/바램, 든지/던지</strong>처럼 일상에서 가장 많이 틀리는 표현을 모아,
            직접 골라 풀고 해설로 원리를 이해하도록 구성했습니다. 무작정 암기하는 대신 "왜 이게 맞는지"를 익혀
            문서·이메일·SNS 글쓰기에서 실수를 줄이는 것이 목표입니다.
          </p>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-3 text-amber-500">
            <Lightbulb size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">이렇게 활용해보세요</h2>
          </div>
          <ul className="space-y-4">
            {[
              ['취약한 것부터', '평소 자신 없던 주제를 먼저 골라 풀어보세요. 틀린 문제일수록 해설이 오래 기억에 남습니다.'],
              ['해설까지 꼭 읽기', '정답을 맞혀도 해설을 읽어 원리를 확인하세요. 비슷한 다른 표현까지 함께 정리할 수 있습니다.'],
              ['타자 연습과 병행', '맞춤법으로 정확한 표기를, 타자 연습으로 속도를 함께 키우면 글쓰기 전반이 탄탄해집니다.'],
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

        <section className="space-y-5">
          <div className="flex items-center gap-3 text-blue-500">
            <HelpCircle size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">자주 묻는 질문</h2>
          </div>
          <div className="space-y-4">
            {QUIZ_FAQ.map((f) => (
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: QUIZ_FAQ.map((f) => ({
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
