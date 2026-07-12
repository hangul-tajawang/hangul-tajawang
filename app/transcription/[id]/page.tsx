import { Metadata } from 'next';
import { LONG_TEXT_DB, PILSA_SERIES } from '@/lib/long-text-data';
import { LongPractice } from '@/components/long-practice/LongPractice';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const text = LONG_TEXT_DB.find((t) => t.id === resolvedParams.id);
  if (!text) return {};

  return {
    title: `${text.title} 한글 타자 연습 | 필사 연습`,
    description: `${text.title} 타자 연습: ${text.content.substring(0, 80).replace(/\n/g, ' ')}... 한글 타자 속도와 정확도를 실시간으로 측정해보세요.`,
    keywords: [
        text.title, 
        `${text.title} 한글타자`, 
        `${text.title} 타자연습`, 
        `${text.title} 필사연습`, 
        `${text.title} 타자필사`, 
        text.author, 
        text.category, 
        "한글 타자 연습", 
        "한글타자왕"
    ],
    alternates: {
      canonical: `https://www.hangul-tajawang.com/transcription/${resolvedParams.id}`,
    },
    openGraph: {
      title: `${text.title} 한글 타자 연습 | 필사 연습 | 한글타자왕`,
      description: `지금 바로 '${text.title}' 한글 타자 연습을 시작하세요. 타수와 정확도를 측정해 드립니다!`,
      url: `https://www.hangul-tajawang.com/transcription/${resolvedParams.id}`,
      type: "article",
      images: [
        text.seriesId
          ? {
              url: `https://www.hangul-tajawang.com/images/book-covers/${text.seriesId}.jpg`,
              width: 900,
              height: 1200,
              alt: `${text.title} 표지`,
            }
          : {
              url: "https://www.hangul-tajawang.com/ogimage.png",
              width: 1200,
              height: 630,
              alt: "한글타자왕 필사 연습",
            },
      ],
    }
  };
}

export function generateStaticParams() {
  return LONG_TEXT_DB.map((text) => ({
    id: text.id,
  }));
}

export default async function TranscriptionDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const currentIndex = LONG_TEXT_DB.findIndex((t) => t.id === resolvedParams.id);
  
  if (currentIndex === -1) {
    notFound();
  }
  
  const text = LONG_TEXT_DB[currentIndex];
  const prevText = currentIndex > 0 ? LONG_TEXT_DB[currentIndex - 1] : null;
  const nextText = currentIndex < LONG_TEXT_DB.length - 1 ? LONG_TEXT_DB[currentIndex + 1] : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: text.title,
    author: { '@type': 'Person', name: text.author },
    genre: text.category,
    inLanguage: 'ko',
    url: `https://www.hangul-tajawang.com/transcription/${text.id}`,
    description: `${text.author}의 '${text.title}' 전문을 타이핑으로 필사하며 타자 속도와 정확도를 측정할 수 있는 온라인 필사 페이지입니다.`,
    isPartOf: {
      '@type': 'WebSite',
      name: '한글타자왕',
      url: 'https://www.hangul-tajawang.com',
    },
  };

  return (
    <div className="w-full py-8 text-on-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col items-center">
        {/* 연재물이면 시리즈 배너 */}
        {text.seriesId && (() => {
          const series = PILSA_SERIES.find((s) => s.id === text.seriesId);
          return series ? (
            <Link
              prefetch={false}
              href={`/transcription/series/${series.id}`}
              className="mb-2 inline-flex items-center gap-2 px-5 py-2.5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 rounded-full text-sm font-black text-rose-700 dark:text-rose-300 hover:scale-105 transition-transform"
            >
              📖 {series.title} · {text.episode}화 / {series.totalEpisodes}화 — 목차 보기 →
            </Link>
          ) : null;
        })()}
        <LongPractice initialTextId={text.id} />

        {/* SEO HTML Content */}
        <article className="mt-20 w-full max-w-5xl px-6 lg:px-8 animate-in fade-in duration-1000">
            <h2 className="text-3xl font-black mb-8 border-b border-surface-high pb-4 break-keep text-balance">
              {text.title} <span className="whitespace-nowrap">한글 타자 연습</span>
            </h2>
            <div className="prose dark:prose-invert prose-lg text-zinc-700 dark:text-zinc-300 max-w-none">
                <p className="leading-relaxed mb-8">
                    이 페이지는 <strong>{text.author}</strong>의 <strong>'{text.title}'</strong> 전문을 제공하며, 이를 활용하여 한글 타자 연습을 하실 수 있도록 구성되어 있습니다.
                    상단의 감성적인 원고지 화면에서 제시된 글을 따라 입력하며 연습을 진행해보세요.
                    이 한글 타자 연습 서비스는 연습 중인 사용자의 <strong>타자 속도(타수)</strong>와 <strong>정확도</strong>를 실시간으로 매우 정확하게 측정해 드립니다. 
                    지속적인 연습을 통해 타자 실력을 향상시키고 자신만의 기록을 세워보세요!
                </p>
                <div className="bg-surface-low p-10 rounded-[2.5rem] whitespace-pre-wrap leading-loose font-medium text-lg border border-surface-high shadow-inner">
                    <h3 className="text-2xl font-bold mb-6 text-primary">{text.title} 전문</h3>
                    <div className="text-zinc-800 dark:text-zinc-200 font-bold">
                      {text.content}
                    </div>
                </div>

                {/* 이전 글 / 다음 글 네비게이션 */}
                <nav className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-surface-high pt-8">
                    {prevText ? (
                        <Link prefetch={false} href={`/transcription/${prevText.id}`} className="group flex flex-col text-left mr-auto hover:bg-surface-low p-4 rounded-2xl transition-all w-full sm:w-1/2">
                            <span className="text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">이전 작품</span>
                            <span className="text-xl font-black text-zinc-300 group-hover:text-primary transition-colors line-clamp-1">{prevText.title}</span>
                            <span className="text-sm font-medium text-zinc-500">{prevText.author}</span>
                        </Link>
                    ) : <div className="w-full sm:w-1/2" />}

                    {nextText ? (
                        <Link prefetch={false} href={`/transcription/${nextText.id}`} className="group flex flex-col text-right ml-auto hover:bg-surface-low p-4 rounded-2xl transition-all w-full sm:w-1/2 items-end">
                            <span className="text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">다음 작품</span>
                            <span className="text-xl font-black text-zinc-300 group-hover:text-primary transition-colors line-clamp-1">{nextText.title}</span>
                            <span className="text-sm font-medium text-zinc-500">{nextText.author}</span>
                        </Link>
                    ) : <div className="w-full sm:w-1/2" />}
                </nav>
            </div>
        </article>
      </div>
    </div>
  );
}
