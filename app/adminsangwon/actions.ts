"use server";

/**
 * 책방 admin 서버 액션 — 게재 즉시 revalidateTag('books')로 웹에 반영된다.
 * 쓰기는 전부 service_role 키(서버 환경변수)로 수행한다.
 */
import { updateTag } from "next/cache";
import { assertAdmin } from "@/lib/admin-auth";
import { parseManuscript } from "@/lib/manuscript";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SVC = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export interface ActionResult {
  ok: boolean;
  message: string;
}

function svcHeaders(extra: Record<string, string> = {}) {
  return { apikey: SVC, Authorization: `Bearer ${SVC}`, ...extra };
}

async function svcRest(method: string, path: string, body?: unknown): Promise<void> {
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    method,
    headers: svcHeaders({
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "resolution=merge-duplicates,return=minimal" : "return=minimal",
    }),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/** Storage 업로드 → 공개 URL 반환 */
async function uploadAsset(file: File, path: string): Promise<string> {
  const res = await fetch(`${URL_}/storage/v1/object/book-assets/${path}`, {
    method: "POST",
    headers: svcHeaders({ "Content-Type": file.type || "image/jpeg", "x-upsert": "true" }),
    body: Buffer.from(await file.arrayBuffer()),
  });
  if (!res.ok) throw new Error(`이미지 업로드 실패 (${res.status})`);
  // 캐시 무효화를 위해 버전 쿼리를 붙인다 (같은 경로 재업로드 대비)
  return `${URL_}/storage/v1/object/public/book-assets/${path}?v=${Date.now()}`;
}

const SLUG = /^[a-z0-9][a-z0-9_-]{1,40}$/;

// ── 책 게재/수정 ────────────────────────────────────────────────────────────
export async function saveBook(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();

    const id = String(formData.get("id") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const authorId = String(formData.get("authorId") || "").trim() || null;
    const authorName = String(formData.get("authorName") || "").trim();
    const logline = String(formData.get("logline") || "").trim();
    const description = String(formData.get("description") || "").trim() || logline;
    const category = String(formData.get("category") || "소설");
    const totalDeclared = Number(formData.get("totalEpisodes") || 0);
    const sortOrder = Number(formData.get("sortOrder") || 0) || null;
    const coverPalette = String(formData.get("coverPalette") || "rose");
    const coverPattern = String(formData.get("coverPattern") || "grid");
    const manuscript = String(formData.get("manuscript") || "");
    const coverFile = formData.get("coverFile") as File | null;
    const existingCoverUrl = String(formData.get("existingCoverUrl") || "") || null;

    if (!SLUG.test(id)) return { ok: false, message: "아이디는 영문 소문자·숫자·하이픈 2~40자여야 합니다." };
    if (!title) return { ok: false, message: "제목을 입력하세요." };
    if (!authorName && !authorId) return { ok: false, message: "작가를 선택하거나 작가 표기명을 입력하세요." };

    const episodes = parseManuscript(manuscript);
    if (episodes.length === 0) {
      return { ok: false, message: "원고에서 화를 찾지 못했습니다. \"## 1화. 제목\" 형식인지 확인하세요." };
    }

    let coverImageUrl = existingCoverUrl;
    if (coverFile && coverFile.size > 0) {
      coverImageUrl = await uploadAsset(coverFile, `covers/${id}.jpg`);
    }

    const now = new Date().toISOString();
    await svcRest("POST", "books?on_conflict=id", [{
      id,
      title,
      author: authorName || authorId,
      author_id: authorId,
      logline,
      description,
      category,
      total_episodes: Math.max(totalDeclared, episodes.length),
      published_episodes: episodes.length,
      cover_palette: coverPalette,
      cover_pattern: coverPattern,
      cover_image_url: coverImageUrl,
      ...(sortOrder ? { sort_order: sortOrder } : {}),
      updated_at: now,
    }]);

    const rows = episodes.map((ep) => ({
      id: `${id}_ep${ep.episode}`,
      book_id: id,
      episode: ep.episode,
      title: `${ep.episode}화. ${ep.title}`,
      content: ep.body,
      word_count: ep.wordCount,
      updated_at: now,
    }));
    await svcRest("POST", "book_episodes?on_conflict=id", rows);
    // 원고에서 사라진 화 정리 (이 책 범위 안에서만)
    await svcRest("DELETE", `book_episodes?book_id=eq.${id}&id=not.in.(${rows.map((r) => r.id).join(",")})`);

    updateTag("books");
    return { ok: true, message: `게재 완료 — 전 ${Math.max(totalDeclared, episodes.length)}화 중 ${episodes.length}화 공개. 웹·앱에 반영되었습니다.` };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "저장 중 오류가 발생했습니다." };
  }
}

// ── 책 내리기 ───────────────────────────────────────────────────────────────
export async function deleteBook(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await svcRest("DELETE", `books?id=eq.${encodeURIComponent(id)}`);
    updateTag("books");
    return { ok: true, message: "책을 내렸습니다. (화 본문도 함께 삭제됨 — 독자의 필사 기록은 유지)" };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "삭제 중 오류가 발생했습니다." };
  }
}

// ── 작가 등록/수정 ──────────────────────────────────────────────────────────
export async function saveAuthor(formData: FormData): Promise<ActionResult> {
  try {
    await assertAdmin();

    const id = String(formData.get("id") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const bio = String(formData.get("bio") || "").trim() || null;
    const snsUrl = String(formData.get("snsUrl") || "").trim() || null;
    const blogUrl = String(formData.get("blogUrl") || "").trim() || null;
    const imageFile = formData.get("imageFile") as File | null;
    const existingImageUrl = String(formData.get("existingImageUrl") || "") || null;

    if (!SLUG.test(id)) return { ok: false, message: "작가 아이디는 영문 소문자·숫자·하이픈 2~40자여야 합니다." };
    if (!name) return { ok: false, message: "필명을 입력하세요." };

    let imageUrl = existingImageUrl;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadAsset(imageFile, `authors/${id}.jpg`);
    }

    await svcRest("POST", "authors?on_conflict=id", [{
      id, name, bio, sns_url: snsUrl, blog_url: blogUrl, image_url: imageUrl,
      updated_at: new Date().toISOString(),
    }]);

    updateTag("books");
    return { ok: true, message: `작가 저장 완료 — /authors/${id} 에 반영되었습니다.` };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "저장 중 오류가 발생했습니다." };
  }
}

export async function deleteAuthor(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await svcRest("DELETE", `authors?id=eq.${encodeURIComponent(id)}`);
    updateTag("books");
    return { ok: true, message: "작가를 삭제했습니다." };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("23503") || msg.includes("foreign key")) {
      return { ok: false, message: "이 작가에게 연결된 책이 있어 삭제할 수 없습니다. 책의 작가를 먼저 바꾸세요." };
    }
    return { ok: false, message: msg || "삭제 중 오류가 발생했습니다." };
  }
}
