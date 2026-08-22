import { Metadata } from 'next';
import { BASIC_PRACTICE_STEPS } from '@/lib/word-data';
import Link from 'next/link';
import { Keyboard, ArrowRight, BookOpenText, Lightbulb, HeartPulse, HelpCircle } from 'lucide-react';
import { KeyboardAdSidebar } from '@/components/layout/KeyboardAdSidebar';

const WORD_FAQ = [
  {
    q: '낱말 연습은 자리 연습과 무엇이 다른가요?',
    a: '자리 연습이 개별 자음·모음의 위치를 외우는 단계라면, 낱말 연습은 그 글자들을 이어 실제 단어를 완성하는 단계입니다. 손가락이 자판 위치를 아는 것을 넘어, 자연스러운 손놀림의 흐름을 만드는 훈련이라 타수를 본격적으로 끌어올리는 구간입니다.',
  },
  {
    q: '어떤 단계(Step)부터 시작해야 하나요?',
    a: '반드시 첫 번째 기본 자리(중간 줄) 단계부터 순서대로 진행하세요. 손가락이 중심 위치를 확실히 기억한 뒤 윗줄·아랫줄로 넓혀가야 오타가 줄고, 나중에 문장을 칠 때 속도가 무너지지 않습니다.',
  },
  {
    q: '독수리 타법도 교정할 수 있나요?',
    a: '네. 낱말 연습은 두 손가락만 쓰는 독수리 타법을 교정하는 데 특히 효과적입니다. 처음에는 느려도 정해진 손가락으로만 치는 원칙을 지키면, 며칠 안에 화면만 보고도 단어를 입력하는 감각이 생깁니다.',
  },
];

export const metadata: Metadata = {
  title: "한글 낱말 연습 목록 - 단계별 자판 단어 연습",
  description: "중간 줄, 상단 줄, 하단 줄 등 키보드 자판 위치별로 구성된 한글 낱말 타자 연습을 통해 타이핑 실력을 체계적으로 높여보세요. 독수리 타법 교정에 필수적인 코스입니다.",
  keywords: ["낱말 타자 연습", "한글 자판 연습", "단어 타자", "독수리 타법 교정", "타수 늘리기", "단계별 타자"],
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/practice/word',
  },
  openGraph: {
    title: "한글 낱말 타자 연습 단계별 목록 | 한글타자왕",
    description: "키보드 위치별로 맞춤형 낱말 연습을 진행해보세요.",
    url: "https://www.hangul-tajawang.com/practice/word",
  }
};

export default function WordPracticeListPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-16 animate-in slide-in-from-bottom duration-700">
        <h1 className="text-5xl font-bold mb-6">단계별 낱말 타자 연습</h1>
        <p className="text-zinc-400 font-medium text-xl leading-relaxed">
          키보드의 각 위치(중간 줄, 윗 줄, 아랫 줄) 영역별로 구성된 낱말을 연습합니다. <br className="hidden md:block" />
          손가락의 위치를 자연스럽게 익히고 타수를 폭발적으로 올릴 수 있는 가장 중요한 훈련 과정입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BASIC_PRACTICE_STEPS.map((step, i) => (
          <Link prefetch={false} 
            key={step.id} 
            href={`/practice/word/${step.id}`}
            className="group flex flex-col bg-surface-low p-8 rounded-2xl border border-surface-high hover:border-primary/50 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,74,198,0.1)] relative overflow-hidden"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 group-hover:scale-110">
              <Keyboard size={80} />
            </div>
            
            <div className="mb-4 relative z-10">
              <span className="text-[10px] font-bold uppercase text-primary tracking-widest bg-primary/10 px-3 py-1 rounded-full">Step {i + 1}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors relative z-10">{step.title}</h2>
            <p className="text-sm font-medium text-zinc-400 mb-6 relative z-10">{step.description}</p>
            
            <div className="mt-auto flex items-center justify-between relative z-10 p-4 bg-surface-lowest rounded-xl border border-surface-high">
                <span className="text-xs font-bold text-zinc-500 line-clamp-1 flex-1">'{step.words[0]}', '{step.words[1]}' 등</span>
                <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform ml-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* SEO 및 정보 섹션 — 낱말 타자 연습 가이드 */}
      <div className="mt-24 border-t border-zinc-200 pt-16 pb-4 space-y-16 text-left">
        <section className="space-y-5">
          <div className="flex items-center gap-3 text-primary">
            <BookOpenText size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">단계별 낱말 연습이란</h2>
          </div>
          <p className="text-zinc-600 leading-loose font-medium break-keep">
            <strong className="text-on-surface">낱말 타자 연습</strong>은 키보드 자판을 영역별(중간 줄·윗 줄·아랫 줄)로 나누어,
            해당 위치의 글자로 이루어진 단어를 반복해서 치며 손가락에 자판을 각인시키는 훈련입니다.
            낱개의 자음·모음 위치를 익히는 자리 연습에서 한 걸음 나아가, 실제 <strong className="text-on-surface">단어 단위의 손놀림</strong>을
            몸에 새기는 과정이라 타수를 본격적으로 끌어올리는 가장 중요한 구간입니다.
          </p>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-3 text-amber-500">
            <Lightbulb size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">효과적인 낱말 연습법</h2>
          </div>
          <ul className="space-y-4">
            {[
              ['순서대로 차근차근', '기본 자리 → 윗줄 → 아랫줄 → 쌍자음 순으로 진행하세요. 한 단계를 건너뛰면 나중에 오타의 원인이 됩니다.'],
              ['정해진 손가락 지키기', '느리더라도 각 키에 배정된 손가락으로만 치세요. 이 원칙이 무너지면 독수리 타법이 다시 굳어집니다.'],
              ['화면만 보고 치기', '단어가 짧아 무자판 훈련에 적합합니다. 손이 아니라 화면의 단어만 보며 입력하는 연습을 하세요.'],
              ['속도보다 리듬', '한 글자씩 끊어 치기보다 단어를 하나의 흐름으로 이어 치는 감각을 익히면 타수가 자연스럽게 올라갑니다.'],
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
          <div className="flex items-center gap-3 text-emerald-600">
            <HeartPulse size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">낱말 연습의 효과</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ['타수 향상', '단어 단위 반복이 손가락의 이동 거리를 최적화해 분당 타수를 눈에 띄게 끌어올립니다.'],
              ['오타 감소', '올바른 손가락 배치가 몸에 배어, 빠르게 쳐도 틀리지 않는 정확한 타이핑이 가능해집니다.'],
              ['타법 교정', '독수리 타법을 근본적으로 교정해, 자판을 보지 않고 치는 터치 타이핑의 토대를 만듭니다.'],
            ].map(([t, d]) => (
              <div key={t} className="p-6 bg-surface-low rounded-2xl border border-surface-high">
                <h3 className="font-bold mb-2 text-on-surface">{t}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed break-keep">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-3 text-blue-500">
            <HelpCircle size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">자주 묻는 질문</h2>
          </div>
          <div className="space-y-4">
            {WORD_FAQ.map((f) => (
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
            mainEntity: WORD_FAQ.map((f) => ({
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
