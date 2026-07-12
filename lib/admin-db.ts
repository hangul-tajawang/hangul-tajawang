/**
 * admin 전용 데이터 조회 (서버 전용, service_role, 캐시 없음)
 * — 목록·편집 화면은 항상 DB 최신 상태를 보여야 한다.
 */

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SVC = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function adminRest<T>(path: string): Promise<T> {
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    headers: { apikey: SVC, Authorization: `Bearer ${SVC}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`admin-db: ${path} → ${res.status}`);
  return res.json();
}

export interface AdminBookRow {
  id: string;
  title: string;
  author: string;
  author_id: string | null;
  logline: string;
  description: string;
  category: string;
  total_episodes: number;
  published_episodes: number;
  cover_palette: string | null;
  cover_pattern: string | null;
  cover_image_url: string | null;
  sort_order: number | null;
  updated_at: string;
}

export interface AdminAuthorRow {
  id: string;
  name: string;
  bio: string | null;
  sns_url: string | null;
  blog_url: string | null;
  image_url: string | null;
}

export interface AdminEpisodeRow {
  id: string;
  episode: number;
  title: string;
  content: string;
  word_count: number;
}

export async function getAdminBooks(): Promise<AdminBookRow[]> {
  return adminRest<AdminBookRow[]>("books?select=*&order=sort_order.asc.nullslast,id.asc");
}

export async function getAdminBook(id: string): Promise<AdminBookRow | null> {
  const rows = await adminRest<AdminBookRow[]>(`books?id=eq.${encodeURIComponent(id)}&select=*`);
  return rows[0] || null;
}

export async function getAdminAuthors(): Promise<AdminAuthorRow[]> {
  return adminRest<AdminAuthorRow[]>("authors?select=*&order=created_at.asc");
}

export async function getAdminEpisodes(bookId: string): Promise<AdminEpisodeRow[]> {
  return adminRest<AdminEpisodeRow[]>(
    `book_episodes?book_id=eq.${encodeURIComponent(bookId)}&select=id,episode,title,content,word_count&order=episode.asc`
  );
}

/** 편집 화면용 — 화 rows 를 다시 "## N화. 제목" 원고 텍스트로 복원 */
export function episodesToManuscript(episodes: AdminEpisodeRow[]): string {
  return episodes
    .map((e) => `## ${e.episode}화. ${e.title.replace(/^\d+화\.\s*/, "")}\n\n${e.content}`)
    .join("\n\n");
}
