import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchAuthorSafe, fetchAuthorsSafe } from '@/lib/books-db';
import { BookCoverArt } from '@/components/books/BookCoverArt';
import { Feather, BookOpen } from 'lucide-react';

type Props = { params: Promise<{ authorId: string }> };

// DB(ISR) — 작가·작품이 늘면 재배포 없이 반영
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const authors = await fetchAuthorsSafe();
  return authors.map((a) => ({ authorId: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { authorId } = await params;
  const data = await fetchAuthorSafe(authorId);
  if (!data) return {};
  const { author, books } = data;
  return {
    title: `${author.name} 작가 - 오리지널 연재소설 ${books.length}편`,
    description: `${author.name} 작가의 한글타자왕 오리지널 연재작 ${books.length}편을 필사로 만나보세요. ${author.bio || ''}`.trim(),
    alternates: { canonical: `https://www.hangul-tajawang.com/authors/${authorId}` },
    openGraph: {
      title: `${author.name} 작가 | 한글타자왕 책방`,
      description: author.bio || `${author.name} 작가의 오리지널 연재작을 필사로 만나보세요.`,
      url: `https://www.hangul-tajawang.com/authors/${authorId}`,
      images: [
        {
          url: author.imageUrl
            ? (author.imageUrl.startsWith('/') ? `https://www.hangul-tajawang.com${author.imageUrl}` : author.imageUrl)
            : 'https://www.hangul-tajawang.com/ogimage.png',
          alt: `${author.name} 작가`,
        },
      ],
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { authorId } = await params;
  const data = await fetchAuthorSafe(authorId);
  if (!data) notFound();
  const { author, books } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `https://www.hangul-tajawang.com/authors/${authorId}`,
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.imageUrl
      ? { image: author.imageUrl.startsWith('/') ? `https://www.hangul-tajawang.com${author.imageUrl}` : author.imageUrl }
      : {}),
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 md:py-16 px-4 md:px-6 text-on-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 작가 프로필 헤더 */}
      <header className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-12">
        {author.imageUrl ? (
          <Image
            src={author.imageUrl}
            alt={`${author.name} 작가 프로필`}
            width={112}
            height={112}
            unoptimized
            className="w-28 h-28 rounded-full object-cover shadow-xl shrink-0"
          />
        ) : (
          <div className="w-28 h-28 rounded-full primary-gradient text-white flex items-center justify-center shrink-0 shadow-xl">
            <Feather size={40} />
          </div>
        )}
        <div className="text-center sm:text-left">
          <p className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-2">한글타자왕 작가</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{author.name}</h1>
          {author.bio && <p className="text-zinc-500 font-medium leading-relaxed break-keep">{author.bio}</p>}
          <div className="mt-4 flex justify-center sm:justify-start gap-2">
            {author.snsUrl && (
              <a href={author.snsUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-surface-high text-xs font-bold text-zinc-600 hover:text-primary transition-colors">
                SNS
              </a>
            )}
            {author.blogUrl && (
              <a href={author.blogUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-surface-high text-xs font-bold text-zinc-600 hover:text-primary transition-colors">
                블로그
              </a>
            )}
          </div>
        </div>
      </header>

      {/* 작품 목록 */}
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <BookOpen size={20} className="text-primary" /> 작품 {books.length}편
      </h2>
      {books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-7 p-4 md:p-7 bg-surface-low rounded-2xl border-b-8 border-[#c9a97a]/40">
          {books.map((book) => (
            <Link
              key={book.id}
              prefetch={false}
              href={`/transcription/series/${book.id}`}
              className="group block text-left transition-transform hover:-translate-y-2"
            >
              <BookCoverArt
                imageUrl={book.coverImageUrl}
                title={book.title}
                author={book.author}
                cover={book.cover}
                className="group-hover:shadow-2xl"
              />
              <p className="mt-2 px-1 text-[11px] font-bold text-zinc-500">
                전 {book.totalEpisodes}화
                {book.publishedEpisodes >= book.totalEpisodes ? (
                  <span className="text-zinc-400"> · 완결</span>
                ) : (
                  <span className="text-primary"> · 연재 중</span>
                )}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500 font-medium">아직 게재된 작품이 없습니다.</p>
      )}

      <div className="mt-14 text-center">
        <Link prefetch={false} href="/transcription" className="text-sm font-bold text-zinc-400 hover:text-primary transition-colors">← 원고지 필사로 돌아가기</Link>
      </div>
    </div>
  );
}
