#!/usr/bin/env node
/**
 * 책방 콘텐츠 → Supabase 퍼블리시 (앱 배포 채널)
 *
 * content/original-works/*.md 를 build-books.mjs 와 같은 파서로 읽어
 * books / book_episodes 테이블에 upsert 합니다. 웹은 이 테이블을 읽지 않고
 * (정적 빌드 유지), 앱(korean_typing)이 여기서 책방 콘텐츠를 가져갑니다.
 *
 * 사용법:  npm run books:publish            (실제 반영)
 *          npm run books:publish -- --dry-run  (반영 없이 요약만)
 *
 * 준비(1회): supabase/books.sql 을 대시보드 SQL Editor에서 실행하고,
 *            .env.local 에  SUPABASE_SERVICE_ROLE_KEY=eyJ...  추가
 *            (pilsa-stats 와 같은 키. 외부 노출 금지, .env*는 gitignore)
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseAllWorks } from './build-books.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DRY = process.argv.includes('--dry-run');
const SITE = 'https://www.hangul-tajawang.com';

// ── .env.local 로드 (pilsa-stats.mjs 와 동일 패턴) ──────────────────────
function loadEnv() {
  const env = {};
  try {
    for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim();
    }
  } catch { /* 없으면 아래에서 안내 */ }
  return env;
}

// ── REST 헬퍼 ───────────────────────────────────────────────────────────
function restClient(url, key) {
  return async function rest(method, path, body) {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: method === 'POST' ? 'resolution=merge-duplicates,return=minimal' : 'return=minimal',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${method} ${path} → ${res.status}: ${text}`);
    }
    // POST/DELETE는 return=minimal이라 본문이 없다 — GET만 JSON 파싱
    return method === 'GET' ? res.json() : null;
  };
}

// ── 원고 → 테이블 행 변환 ───────────────────────────────────────────────
const works = parseAllWorks();
const now = new Date().toISOString();

const bookRows = works.map((w) => ({
  id: w.id,
  title: w.title,
  author: w.author,
  logline: w.logline,
  description: w.description,
  category: w.category,
  total_episodes: w.totalEpisodes,
  published_episodes: w.episodes.length,
  cover_palette: w.cover.palette,
  cover_pattern: w.cover.pattern,
  cover_image_url: existsSync(join(ROOT, `public/images/book-covers/${w.id}.jpg`))
    ? `${SITE}/images/book-covers/${w.id}.jpg`
    : null,
  author_sns_url: w.authorProfile?.sns ?? null,
  author_blog_url: w.authorProfile?.blog ?? null,
  // 프로필 이미지는 사이트 상대경로(/images/authors/…)로 쓰면 절대 URL로 변환
  author_image_url: w.authorProfile?.image
    ? (w.authorProfile.image.startsWith('/') ? SITE + w.authorProfile.image : w.authorProfile.image)
    : null,
  author_bio: w.authorProfile?.bio ?? null,
  author_id: w.authorId ?? null,
  sort_order: w.ho,
  updated_at: now,
}));

// 작가 rows — `작가 아이디` 선언 원고에서 수집, 같은 작가는 프로필 필드 병합 (뒤 원고가 우선)
const authorsById = new Map();
for (const w of works) {
  if (!w.authorId) continue;
  const prev = authorsById.get(w.authorId) || {};
  const img = w.authorProfile?.image
    ? (w.authorProfile.image.startsWith('/') ? SITE + w.authorProfile.image : w.authorProfile.image)
    : null;
  authorsById.set(w.authorId, {
    id: w.authorId,
    name: w.author || prev.name || w.authorId,
    bio: w.authorProfile?.bio ?? prev.bio ?? null,
    sns_url: w.authorProfile?.sns ?? prev.sns_url ?? null,
    blog_url: w.authorProfile?.blog ?? prev.blog_url ?? null,
    image_url: img ?? prev.image_url ?? null,
    updated_at: now,
  });
}
const authorRows = [...authorsById.values()];

const episodeRows = works.flatMap((w) =>
  w.episodes.map((ep) => ({
    id: `${w.id}_ep${ep.episode}`,
    book_id: w.id,
    episode: ep.episode,
    title: `${ep.episode}화. ${ep.title}`,
    content: ep.body,
    word_count: ep.wordCount,
    updated_at: now,
  }))
);

console.log(`📚 퍼블리시 대상: 책 ${bookRows.length}권 / 화 ${episodeRows.length}편 / 작가 ${authorRows.length}명`);
for (const b of bookRows) {
  const status = b.published_episodes < b.total_episodes
    ? `연재 중 ${b.published_episodes}/${b.total_episodes}화`
    : `완결 전 ${b.total_episodes}화`;
  console.log(`   · ${b.id.padEnd(10)} ${b.title} (${status}${b.cover_image_url ? '' : ', 일러스트 표지 없음'})`);
}

if (DRY) {
  console.log('\n--dry-run: DB에는 반영하지 않았습니다.');
  process.exit(0);
}

// ── 반영 ────────────────────────────────────────────────────────────────
const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('\nSUPABASE_SERVICE_ROLE_KEY가 .env.local에 없습니다.');
  console.error('Supabase 대시보드 → Settings → API → service_role 키를 복사해서');
  console.error('.env.local에  SUPABASE_SERVICE_ROLE_KEY=eyJ...  한 줄을 추가하세요.');
  console.error('(외부 노출 금지 키입니다. .env*는 gitignore라 커밋되지 않습니다.)');
  process.exit(1);
}
const rest = restClient(url, key);

// 추가 컬럼이 아직 없는 DB(books.sql 재실행 전)에도 퍼블리시가 깨지지 않게
const probe = await fetch(`${url}/rest/v1/books?select=author_sns_url,sort_order&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
if (!probe.ok) {
  console.warn('⚠️  books 테이블에 추가 컬럼(작가 프로필/진열 순서)이 없습니다 — 이번엔 빼고 올립니다.');
  console.warn('   supabase/books.sql 을 대시보드에서 재실행하면 다음부터 반영됩니다.');
  for (const b of bookRows) {
    delete b.author_sns_url;
    delete b.author_blog_url;
    delete b.author_image_url;
    delete b.author_bio;
    delete b.sort_order;
  }
}

// 0) 작가 upsert (books.author_id 의 FK 대상이므로 맨 먼저)
//    authors 테이블이 아직 없으면(supabase/authors.sql 미실행) 작가 연결만 빼고 진행
const authorsProbe = await fetch(`${url}/rest/v1/authors?select=id&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
if (authorsProbe.ok) {
  if (authorRows.length > 0) await rest('POST', 'authors?on_conflict=id', authorRows);
} else {
  console.warn('⚠️  authors 테이블이 없습니다 — 작가 연결 없이 올립니다.');
  console.warn('   supabase/authors.sql 을 대시보드에서 실행하면 다음부터 반영됩니다.');
  for (const b of bookRows) delete b.author_id;
}

// 1) 책 메타 upsert (episodes 의 FK 대상이므로 먼저)
await rest('POST', 'books?on_conflict=id', bookRows);

// 2) 화 upsert (책 단위로 나눠 전송 — 요청당 본문 크기 관리)
for (const w of works) {
  const rows = episodeRows.filter((e) => e.book_id === w.id);
  await rest('POST', 'book_episodes?on_conflict=id', rows);

  // 3) 원고에서 사라진 화 정리 (예: 화 번호 재편) — 해당 책 범위 안에서만
  const keep = rows.map((e) => e.id).join(',');
  await rest('DELETE', `book_episodes?book_id=eq.${w.id}&id=not.in.(${keep})`);
}

// 4) 로컬 원고에 없는 책이 DB에 남아 있으면 경고만 (자동 삭제는 하지 않음)
const dbBooks = await fetch(`${url}/rest/v1/books?select=id`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
}).then((r) => r.json());
const localIds = new Set(bookRows.map((b) => b.id));
const orphans = (dbBooks || []).map((b) => b.id).filter((id) => !localIds.has(id));
if (orphans.length > 0) {
  console.warn(`\n⚠️  로컬 원고에 없는 책이 DB에 있습니다 (자동 삭제 안 함): ${orphans.join(', ')}`);
  console.warn('   내리려면 대시보드에서 직접 삭제하세요: delete from books where id = \'...\';');
}

console.log(`\n✅ 퍼블리시 완료 — 앱은 다음 조회부터 새 콘텐츠를 봅니다.`);
