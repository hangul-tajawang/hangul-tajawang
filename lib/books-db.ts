/**
 * 책방 콘텐츠 데이터 레이어 (서버 전용)
 *
 * 진실의 원본은 Supabase books / book_episodes 테이블.
 * `npm run books:publish`(추후 /admin)가 쓰고, 웹은 여기서 ISR(5분)로 읽는다
 * → 재배포 없이 웹·앱 동시 송출.
 *
 * DB 장애·빌드 환경 미접속 시에는 lib/long-text-data.ts 의 정적 데이터로
 * 폴백하므로 책방이 통째로 죽지 않는다 (기존 9권은 정적본이 함께 존재).
 */
import {
  LONG_TEXT_DB,
  PILSA_SERIES,
  getSeriesEpisodes,
  type LongTextData,
  type PilsaSeries,
} from "@/lib/long-text-data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SITE = "https://www.hangul-tajawang.com";

/** ISR 주기(초) — publish 후 최대 이 시간 안에 웹 반영 */
export const BOOKS_REVALIDATE = 300;

// sort_order 컬럼이 아직 없는 DB를 위한 폴백 진열 순서 (기존 편집 순서)
const FALLBACK_ORDER = new Map(PILSA_SERIES.map((s, i) => [s.id, i]));

export interface EpisodeMeta {
  id: string;
  episode: number;
  title: string;
  wordCount: number;
}

export interface AuthorInfo {
  id: string;
  name: string;
  bio: string | null;
  snsUrl: string | null;
  blogUrl: string | null;
  imageUrl: string | null;
}

/** 서가·시리즈 페이지가 쓰는 책 한 권 (PilsaSeries 호환 + DB 확장 필드) */
export interface ShelfBook extends PilsaSeries {
  category: string;
  publishedEpisodes: number;
  coverImageUrl: string | null;
  episodesMeta: EpisodeMeta[];
  /** 1화 발췌 (미리보기 오버레이용) */
  previewExcerpt: string;
  /** authors 테이블 슬러그 — 있으면 /authors/{id} 작가 페이지로 연결 */
  authorId: string | null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

async function rest<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    next: { revalidate: BOOKS_REVALIDATE, tags: ["books"] },
  });
  if (!res.ok) throw new Error(`books-db: ${path} → ${res.status}`);
  return res.json();
}

/** 자사 도메인 절대 URL → 상대 경로 (next/image 최적화 대상으로) */
function localizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith(SITE) ? url.slice(SITE.length) : url;
}

function mapBook(b: any, eps: EpisodeMeta[], firstContent: string, author?: AuthorInfo): ShelfBook {
  // 작가 프로필: authors 테이블 우선, 없으면 books 의 레거시 author_* 컬럼
  const profile = author
    ? {
        sns: author.snsUrl || undefined,
        blog: author.blogUrl || undefined,
        image: author.imageUrl || undefined,
        bio: author.bio || undefined,
      }
    : {
        sns: b.author_sns_url || undefined,
        blog: b.author_blog_url || undefined,
        image: localizeUrl(b.author_image_url) || undefined,
        bio: b.author_bio || undefined,
      };
  const hasAuthorProfile = profile.sns || profile.blog || profile.image || profile.bio;
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    logline: b.logline || "",
    description: b.description || b.logline || "",
    totalEpisodes: b.total_episodes,
    category: b.category || "소설",
    cover: b.cover_palette
      ? { palette: b.cover_palette, pattern: b.cover_pattern || "grid" }
      : undefined,
    authorProfile: hasAuthorProfile ? profile : undefined,
    authorId: b.author_id || null,
    publishedEpisodes: eps.length,
    coverImageUrl: localizeUrl(b.cover_image_url),
    episodesMeta: eps,
    previewExcerpt: firstContent.trim().slice(0, 250),
  };
}

/** 정적 데이터 → ShelfBook (DB 폴백용) */
function staticShelfBooks(): ShelfBook[] {
  return PILSA_SERIES.map((s) => {
    const eps = getSeriesEpisodes(s.id);
    return {
      ...s,
      category: eps[0]?.category || "소설",
      publishedEpisodes: eps.length,
      coverImageUrl: `/images/book-covers/${s.id}.jpg`,
      episodesMeta: eps.map((e) => ({
        id: e.id,
        episode: e.episode || 0,
        title: e.title,
        wordCount: e.wordCount,
      })),
      previewExcerpt: (eps[0]?.content || "").trim().slice(0, 250),
      authorId: null,
    };
  });
}

function mapAuthor(a: any): AuthorInfo {
  return {
    id: a.id,
    name: a.name,
    bio: a.bio || null,
    snsUrl: a.sns_url || null,
    blogUrl: a.blog_url || null,
    imageUrl: localizeUrl(a.image_url),
  };
}

/** 작가 전체 — 테이블 미생성/장애 시 빈 배열 */
export async function fetchAuthorsSafe(): Promise<AuthorInfo[]> {
  try {
    const rows = await rest<any[]>("authors?select=*&order=created_at.asc");
    return rows.map(mapAuthor);
  } catch {
    return [];
  }
}

/** 작가 페이지 데이터 — 프로필 + 그 작가의 작품 목록 */
export async function fetchAuthorSafe(
  id: string
): Promise<{ author: AuthorInfo; books: ShelfBook[] } | null> {
  const authors = await fetchAuthorsSafe();
  const author = authors.find((a) => a.id === id);
  if (!author) return null;
  const books = (await fetchBooksSafe()).filter((b) => b.authorId === id);
  return { author, books };
}

/** 서가 전체 — 진열 순서(sort_order, 폴백: 기존 편집 순서)로 정렬 */
export async function fetchBooks(): Promise<ShelfBook[]> {
  const [books, eps, firsts, authors] = await Promise.all([
    rest<any[]>("books?select=*"),
    rest<any[]>("book_episodes?select=book_id,id,episode,title,word_count&order=episode.asc"),
    rest<any[]>("book_episodes?episode=eq.1&select=book_id,content"),
    fetchAuthorsSafe(), // 테이블 미생성이어도 전체 실패로 번지지 않게 safe 버전
  ]);

  const epsBy = new Map<string, EpisodeMeta[]>();
  for (const e of eps) {
    const list = epsBy.get(e.book_id) || [];
    list.push({ id: e.id, episode: e.episode, title: e.title, wordCount: e.word_count });
    epsBy.set(e.book_id, list);
  }
  const firstBy = new Map<string, string>(firsts.map((f) => [f.book_id, f.content || ""]));
  const authorBy = new Map(authors.map((a) => [a.id, a]));

  const orderOf = (b: any) =>
    typeof b.sort_order === "number" ? b.sort_order : (FALLBACK_ORDER.get(b.id) ?? 9999);

  return books
    .sort((a, b) => orderOf(a) - orderOf(b) || String(a.id).localeCompare(String(b.id)))
    .map((b) => mapBook(b, epsBy.get(b.id) || [], firstBy.get(b.id) || "", authorBy.get(b.author_id)));
}

/** 서가 — 실패 시 정적 폴백 (페이지에서 이걸 쓴다) */
export async function fetchBooksSafe(): Promise<ShelfBook[]> {
  try {
    const books = await fetchBooks();
    return books.length > 0 ? books : staticShelfBooks();
  } catch {
    return staticShelfBooks();
  }
}

export async function fetchBookSafe(id: string): Promise<ShelfBook | null> {
  return (await fetchBooksSafe()).find((b) => b.id === id) || null;
}

export interface EpisodePageData {
  text: LongTextData;
  book: ShelfBook;
  prevEp: EpisodeMeta | null;
  nextEp: EpisodeMeta | null;
}

/** 화 한 편 (본문 포함) — DB에 없으면 null (호출부에서 정적 폴백) */
export async function fetchEpisodeSafe(id: string): Promise<EpisodePageData | null> {
  try {
    const rows = await rest<any[]>(`book_episodes?id=eq.${encodeURIComponent(id)}&select=*`);
    const row = rows[0];
    if (!row) return null;
    const book = await fetchBookSafe(row.book_id);
    if (!book) return null;

    const text: LongTextData = {
      id: row.id,
      title: row.title,
      content: row.content,
      category: book.category,
      difficulty: book.category === "동화" ? "초급" : "중급",
      wordCount: row.word_count,
      author: book.author,
      source: `한글타자왕 오리지널 · ${book.title}`,
      isPremium: false,
      seriesId: book.id,
      episode: row.episode,
    };
    const idx = book.episodesMeta.findIndex((e) => e.id === row.id);
    return {
      text,
      book,
      prevEp: idx > 0 ? book.episodesMeta[idx - 1] : null,
      nextEp: idx >= 0 && idx < book.episodesMeta.length - 1 ? book.episodesMeta[idx + 1] : null,
    };
  } catch {
    // DB 실패 → 정적본이 있으면 그걸로 (기존 9권)
    const st = LONG_TEXT_DB.find((t) => t.id === id);
    if (!st?.seriesId) return null;
    const book = staticShelfBooks().find((b) => b.id === st.seriesId);
    if (!book) return null;
    const idx = book.episodesMeta.findIndex((e) => e.id === id);
    return {
      text: st,
      book,
      prevEp: idx > 0 ? book.episodesMeta[idx - 1] : null,
      nextEp: idx >= 0 && idx < book.episodesMeta.length - 1 ? book.episodesMeta[idx + 1] : null,
    };
  }
}
