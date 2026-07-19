import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchBookSafe, fetchBooksSafe } from '@/lib/books-db';
import { SeriesTOC } from '@/components/long-practice/SeriesTOC';
import { BookCoverArt } from '@/components/books/BookCoverArt';
import { BookSocial } from '@/components/books/BookSocial';
import { ShareButton } from '@/components/books/ShareButton';
import { BookOpen, Feather, CalendarDays, CheckCircle2 } from 'lucide-react';

type Props = { params: Promise<{ seriesId: string }> };

// DB(ISR) — publish 후 재배포 없이 반영. 새 책 URL도 첫 요청 시 생성(dynamicParams)
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const books = await fetchBooksSafe();
  return books.map((b) => ({ seriesId: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seriesId } = await params;
  const series = await fetchBookSafe(seriesId);
  if (!series) return {};
  const ogImage = series.coverImageUrl
    ? (series.coverImageUrl.startsWith('/') ? `https://www.hangul-tajawang.com${series.coverImageUrl}` : series.coverImageUrl)
    : 'https://www.hangul-tajawang.com/ogimage.png';
  return {
    title: `${series.title} - 오리지널 연재소설 필사 (전 ${series.totalEpisodes}화)`,
    description: `${series.logline} 한글타자왕에서만 읽고 새길 수 있는 오리지널 소설을 하루 한 화, ${series.totalEpisodes}일 완필 플랜으로 필사해 보세요.`,
    keywords: [series.title, '필사하기 좋은 소설', '온라인 필사', '연재소설 필사', '타자 필사', '한글타자왕 오리지널'],
    alternates: { canonical: `https://www.hangul-tajawang.com/transcription/series/${seriesId}` },
    openGraph: {
      title: `${series.title} | 한글타자왕 오리지널 연재`,
      description: series.logline,
      url: `https://www.hangul-tajawang.com/transcription/series/${seriesId}`,
      type: 'book',
      images: [
        {
          url: ogImage,
          width: series.coverImageUrl ? 900 : 1200,
          height: series.coverImageUrl ? 1200 : 630,
          alt: `${series.title} 표지`,
        },
      ],
    },
  };
}

export default async function SeriesPage({ params }: Props) {
  const { seriesId } = await params;
  const series = await fetchBookSafe(seriesId);
  if (!series) notFound();
  const episodes = series.episodesMeta;
  const totalChars = episodes.reduce((a, e) => a + e.wordCount, 0);
  const completed = series.publishedEpisodes >= series.totalEpisodes;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: series.title,
    author: { '@type': 'Person', name: series.author },
    publisher: { '@type': 'Organization', name: '한글타자왕' },
    description: series.logline,
    inLanguage: 'ko',
    numberOfPages: series.totalEpisodes,
    ...(series.coverImageUrl
      ? { image: series.coverImageUrl.startsWith('/') ? `https://www.hangul-tajawang.com${series.coverImageUrl}` : series.coverImageUrl }
      : {}),
    url: `https://www.hangul-tajawang.com/transcription/series/${seriesId}`,
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 md:py-16 px-4 md:px-6 text-on-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 표지 헤더 */}
      <header className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-rose-700 to-rose-950 text-white px-6 md:px-12 py-10 md:py-14 mb-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="w-44 md:w-56 shrink-0">
          <BookCoverArt imageUrl={series.coverImageUrl} title={series.title} author={series.author} cover={series.cover} priority className="shadow-2xl" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-rose-200 font-black text-[11px] uppercase tracking-[0.3em] mb-4">한글타자왕 오리지널 연재</p>
          <h1 className="font-serif font-black text-4xl md:text-5xl mb-3 break-keep">{series.title}</h1>
          <p className="text-rose-200/90 font-bold mb-6">{series.author} 지음</p>
          <p className="max-w-xl text-rose-50/90 leading-[1.8] break-keep">{series.logline}</p>
          <div className="mt-7 flex flex-wrap justify-center md:justify-start gap-2 text-[11px] font-black">
            <span className="px-3 py-1.5 bg-white/15 rounded-full flex items-center gap-1.5">
              <CheckCircle2 size={13} /> {completed ? '완결' : `연재 중 · ${series.publishedEpisodes}화까지 공개`}
            </span>
            <span className="px-3 py-1.5 bg-white/15 rounded-full flex items-center gap-1.5"><BookOpen size={13} /> 전 {series.totalEpisodes}화</span>
            <span className="px-3 py-1.5 bg-white/15 rounded-full flex items-center gap-1.5"><Feather size={13} /> 총 {totalChars.toLocaleString()}자</span>
            <span className="px-3 py-1.5 bg-white/15 rounded-full flex items-center gap-1.5"><CalendarDays size={13} /> 하루 한 화, {series.totalEpisodes}일 완필</span>
            <ShareButton
              url={`https://www.hangul-tajawang.com/transcription/series/${seriesId}`}
              title={`${series.title} — 한글타자왕 오리지널 연재`}
              text={series.logline}
              label="공유하기"
              className="px-3 py-1.5 bg-white/25 hover:bg-white/35 rounded-full flex items-center gap-1.5 transition-colors"
            />
          </div>
        </div>
      </header>

      {/* 소개 */}
      <p className="text-zinc-600 dark:text-zinc-400 leading-loose mb-10 break-keep">{series.description}</p>

      {/* 작가 카드 — 투고 보상 "작가 SNS·블로그 링크 게재" + 작가 페이지 연결 */}
      {(series.authorProfile || series.authorId) && (
        <div className="mb-10 flex items-center gap-4 p-5 rounded-2xl border border-surface-high bg-surface-lowest">
          {series.authorProfile?.image && (
            <Image
              src={series.authorProfile.image}
              alt={`${series.author} 작가 프로필`}
              width={56}
              height={56}
              unoptimized
              className="w-14 h-14 rounded-full object-cover shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            {series.authorId ? (
              <Link prefetch={false} href={`/authors/${series.authorId}`} className="font-black hover:text-primary transition-colors">
                {series.author} <span className="text-xs font-bold text-zinc-400">작품 더 보기 →</span>
              </Link>
            ) : (
              <p className="font-black">{series.author}</p>
            )}
            {series.authorProfile?.bio && (
              <p className="text-sm text-zinc-500 font-medium break-keep">{series.authorProfile.bio}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            {series.authorProfile?.sns && (
              <a href={series.authorProfile.sns} target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 rounded-full bg-surface-high text-xs font-black text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors">
                SNS
              </a>
            )}
            {series.authorProfile?.blog && (
              <a href={series.authorProfile.blog} target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 rounded-full bg-surface-high text-xs font-black text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors">
                블로그
              </a>
            )}
          </div>
        </div>
      )}

      {/* 목차 + 진행 (클라이언트) */}
      <h2 className="text-xl font-black mb-5">목차</h2>
      <SeriesTOC episodes={episodes.map((e) => ({ id: e.id, title: e.title, episode: e.episode, wordCount: e.wordCount }))} />

      {/* 조회수 · 좋아요 · 댓글 (테이블 미생성 시 자동 숨김) */}
      <BookSocial bookId={seriesId} />

      <div className="mt-14 pt-8 border-t border-surface-high text-center">
        <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-4 break-keep">
          {series.totalEpisodes}화를 모두 새기면 이 책이 <Link prefetch={false} href="/library" className="text-primary font-bold underline underline-offset-2">내 서재</Link>에 완간본으로 꽂힙니다.
        </p>
        <Link prefetch={false} href="/transcription" className="text-sm font-black text-zinc-400 hover:text-primary transition-colors">← 다른 작품 필사하러 가기</Link>
      </div>
    </div>
  );
}
