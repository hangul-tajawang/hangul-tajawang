import { localeAlternates } from '@/lib/i18n/alternates';
import { Metadata } from 'next';
import { SpeedTest } from '@/components/test/SpeedTest';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '타자 속도 테스트 - 1분 타자 측정 및 티어 확인 (무료)',
  description:
    '60초 동안 문장을 입력하고 내 분당 타수(CPM)와 정확도를 정확하게 측정하세요. 결과는 SSS급부터 D급까지 타자 티어로 환산되며, 결과 카드를 이미지로 저장해 친구에게 공유할 수 있습니다.',
  keywords: [
    '타자 속도 테스트',
    '타자속도측정',
    '타자 테스트',
    '1분 타자',
    '타자 측정 사이트',
    '분당 타수 측정',
    '한글 타자 속도',
    '무료 타자 테스트',
  ],
  alternates: localeAlternates('/test', 'ko'),
  openGraph: {
    title: '타자 속도 테스트 - 내 타자 티어는? | 한글타자왕',
    description: '1분 만에 내 타수와 타자 티어(SSS~D급)를 확인하고 결과 카드를 공유해보세요.',
    url: 'https://www.hangul-tajawang.com/test',
  },
};

const FAQ = [
  {
    q: '타자 속도 테스트는 어떻게 진행되나요?',
    a: '시작 버튼을 누른 뒤 화면에 나오는 문장을 따라 입력하면 됩니다. 첫 글자를 입력하는 순간부터 60초 타이머가 시작되고, 문장을 완성하면 자동으로 다음 문장이 나옵니다. 60초가 끝나면 분당 타수(CPM)와 정확도, 타자 티어가 표시됩니다.',
  },
  {
    q: '분당 타수(CPM)는 어떻게 계산되나요?',
    a: '한컴타자와 같은 자소 단위 계산 방식을 사용합니다. 예를 들어 "한"이라는 글자는 ㅎ+ㅏ+ㄴ으로 3타로 계산됩니다. 60초 동안 입력한 총 자소 수가 곧 분당 타수가 됩니다.',
  },
  {
    q: '타자 티어 기준은 어떻게 되나요?',
    a: '정확도를 반영한 환산 점수 기준으로 600타 이상 SSS급(신), 500타 이상 SS급(고수), 400타 이상 S급(숙련자), 300타 이상 A급(상급자), 200타 이상 B급(중급자), 100타 이상 C급(초급자), 그 미만은 D급(연습필요)입니다. 일반적인 사무직 직장인 평균은 300~400타 수준입니다.',
  },
];

export default function SpeedTestPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: '한글 타자 속도 테스트',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      description: '60초 동안 한글 문장을 입력해 분당 타수(CPM)와 정확도를 측정하고 타자 티어를 확인하는 무료 테스트입니다.',
      author: { '@type': 'Organization', name: '한글타자왕' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <div className="w-full py-6 md:py-12 text-on-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="text-center mb-6 md:mb-10 px-4">
        <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-3">Speed Test · 60s</p>
        <h1 className="serif-display text-3xl md:text-5xl font-bold mb-4">1분 타자 속도 테스트</h1>
        <p className="text-zinc-600 text-base md:text-xl leading-relaxed break-keep">
          내 분당 타수는 몇 타일까? 60초 만에 측정하고 <strong className="text-on-surface">타자 티어</strong>를 확인하세요.
        </p>
      </div>

      <SpeedTest />

      {/* SEO 콘텐츠 */}
      <div className="max-w-4xl mx-auto mt-16 md:mt-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-surface-high pt-12 md:pt-16">
        <section>
          <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-primary inline-block">정확한 자소 단위 측정</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">한컴타자와 동일한 자소 단위 방식으로 분당 타수를 계산합니다. &lsquo;한&rsquo; = ㅎ+ㅏ+ㄴ = 3타. 오타는 정확도에 반영되어 뻥튀기 없는 진짜 실력이 측정됩니다.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-tertiary inline-block">티어 결과 카드 공유</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">테스트가 끝나면 SSS급(신)부터 D급까지 티어가 담긴 결과 카드를 이미지로 저장하거나 친구에게 바로 공유할 수 있습니다. 친구와 티어 대결을 해보세요.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-success inline-block">측정 다음은 성장</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            내 타수가 평균(300~400타)보다 낮다면 <Link prefetch={false} href="/blog/four-week-typing-plan" className="text-primary font-bold underline underline-offset-2">4주 연습 플랜</Link>을,
            수준별 기준이 궁금하다면 <Link prefetch={false} href="/blog/average-typing-speed" className="text-primary font-bold underline underline-offset-2">평균 타수 가이드</Link>를 확인해 보세요.
          </p>
        </section>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto mt-12 md:mt-16 px-6">
        <h2 className="text-2xl font-bold mb-6">자주 묻는 질문</h2>
        <dl className="divide-y divide-outline-variant border-y border-outline-variant">
          {FAQ.map((f) => (
            <div key={f.q} className="py-5 px-1">
              <dt className="font-bold mb-2">{f.q}</dt>
              <dd className="text-sm text-zinc-600 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
