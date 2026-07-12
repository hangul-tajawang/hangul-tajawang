/**
 * 원고 파싱 — scripts/build-books.mjs 와 동일한 규칙 (admin 폼 미리보기·게재 공용)
 *
 * 입력: "## N화. 제목" 마커로 화를 구분한 전체 원고 텍스트.
 * 첫 "## " 이전 내용(메타 블록 등)은 무시한다 — 책 정보는 admin 폼 필드로 받는다.
 */

export interface ParsedEpisode {
  episode: number;
  title: string;
  body: string;
  wordCount: number;
}

/** 타자로 입력 불가한 특수문자를 표준 문자로 치환 */
export function normalizeManuscriptText(s: string): string {
  return s
    .replace(/…/g, "...")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"');
}

export function parseManuscript(raw: string): ParsedEpisode[] {
  const episodes: ParsedEpisode[] = [];
  const parts = raw.replace(/\r\n?/g, "\n").split(/^## /m);
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const m = part.match(/^(\d+)화\.\s*(.+)$/m);
    if (!m) continue;
    const episode = Number(m[1]);
    const title = m[2].trim();
    let body = part.slice(part.indexOf("\n") + 1);
    body = body
      .replace(/\*\(끝\)\*/g, "")
      .replace(/^---\s*$/gm, "")
      .trim();
    body = body
      .split("\n")
      .map((l) => l.trimEnd())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
    body = normalizeManuscriptText(body);
    const wordCount = body.replace(/\s+/g, "").length;
    episodes.push({ episode, title, body, wordCount });
  }
  episodes.sort((a, b) => a.episode - b.episode);
  return episodes;
}
