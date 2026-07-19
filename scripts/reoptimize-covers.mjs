#!/usr/bin/env node
/**
 * 필사 책 표지 일괄 재최적화 (일회성)
 *
 * Supabase Storage(book-assets/covers/*)에 리사이즈 없이 올라간 기존 표지 원본들을
 * 폭 800px 이하 · WebP(q82)로 다시 줄여 같은 경로에 덮어쓴다.
 * 이미 폭이 800px 이하인 원본은 건너뛴다.
 *
 * 웹 렌더는 BookCoverArt의 <Image>에 unoptimized가 걸려 Vercel 이미지 변형을 우회하므로,
 * 원본 자체를 가볍게 만들어야 전송량·로딩이 개선된다. (신규 업로드는 BookForm에서 이미 800px WebP로 축소)
 *
 * 준비(1회): .env.local 에 아래 두 값이 있어야 한다 (이미 있음).
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 *
 * 실행:  node scripts/reoptimize-covers.mjs
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const MAX_WIDTH = 800;
const WEBP_QUALITY = 82;

// ── .env.local 로드 ─────────────────────────────────────────────────────
function loadEnv() {
  const env = {};
  try {
    for (const line of readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim();
    }
  } catch {
    /* .env.local 없으면 process.env로 폴백 */
  }
  return { ...env, ...process.env };
}

const env = loadEnv();
const SUPA = (env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
const SVC = env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPA || !SVC) {
  console.error('✗ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 가 .env.local 에 필요합니다.');
  process.exit(1);
}

const svcHeaders = (extra = {}) => ({ apikey: SVC, Authorization: `Bearer ${SVC}`, ...extra });
const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

/** cover_image_url → Storage object path (예: covers/batchim.jpg). 쿼리(?v=)는 버린다. */
function objectPathOf(coverUrl) {
  const u = new URL(coverUrl);
  const marker = '/book-assets/';
  const idx = u.pathname.indexOf(marker);
  if (idx === -1) throw new Error(`book-assets 경로가 아님: ${u.pathname}`);
  return u.pathname.slice(idx + marker.length); // covers/batchim.jpg
}

async function main() {
  // 1) cover_image_url 있는 책들
  const listRes = await fetch(
    `${SUPA}/rest/v1/books?select=id,cover_image_url&cover_image_url=not.is.null`,
    { headers: svcHeaders() }
  );
  if (!listRes.ok) {
    console.error(`✗ books 조회 실패 ${listRes.status}: ${(await listRes.text()).slice(0, 200)}`);
    process.exit(1);
  }
  const books = await listRes.json();
  console.log(`대상 표지 ${books.length}권 — 폭 ${MAX_WIDTH}px 이하 WebP(q${WEBP_QUALITY})로 재최적화\n`);

  const skipped = [];
  const failed = [];
  let done = 0;

  for (const b of books) {
    const { id, cover_image_url } = b;
    try {
      const objectPath = objectPathOf(cover_image_url); // covers/xxx.jpg

      // 2) 원본 다운로드 (public URL). ?v= 는 무시되니 clean 경로로 받는다.
      const dlUrl = `${SUPA}/storage/v1/object/public/book-assets/${objectPath}`;
      const dl = await fetch(dlUrl, { headers: svcHeaders() });
      if (!dl.ok) throw new Error(`다운로드 ${dl.status}`);
      const orig = Buffer.from(await dl.arrayBuffer());

      // 3) sharp 변환 — 폭 800 초과일 때만 축소, 이미 작으면 건너뜀
      const meta = await sharp(orig).metadata();
      if ((meta.width || 0) <= MAX_WIDTH) {
        skipped.push(`${id} (원본 폭 ${meta.width}px ≤ ${MAX_WIDTH}, ${kb(orig.length)})`);
        console.log(`· ${id.padEnd(14)} 건너뜀 (폭 ${meta.width}px, ${kb(orig.length)})`);
        continue;
      }
      const out = await sharp(orig)
        .rotate() // EXIF 방향 보정
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

      // 4) 같은 경로에 덮어쓰기 (x-upsert). 확장자는 .jpg 유지, 내용은 webp.
      const up = await fetch(`${SUPA}/storage/v1/object/book-assets/${objectPath}`, {
        method: 'POST',
        headers: svcHeaders({ 'Content-Type': 'image/webp', 'x-upsert': 'true' }),
        body: out,
      });
      if (!up.ok) throw new Error(`업로드 ${up.status}: ${(await up.text()).slice(0, 120)}`);

      // 5) DB의 cover_image_url에 ?v= 가 있으면 새 타임스탬프로 캐시 무효화
      if (cover_image_url.includes('?v=')) {
        const clean = cover_image_url.split('?')[0];
        const newUrl = `${clean}?v=${Date.now()}`;
        const patch = await fetch(`${SUPA}/rest/v1/books?id=eq.${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: svcHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
          body: JSON.stringify({ cover_image_url: newUrl }),
        });
        if (!patch.ok) throw new Error(`DB 갱신 ${patch.status}`);
      }

      done++;
      console.log(`✓ ${id.padEnd(14)} ${kb(orig.length)} → ${kb(out.length)} (${meta.width}px→${MAX_WIDTH}px)`);
    } catch (e) {
      failed.push(`${id}: ${e.message}`);
      console.log(`✗ ${id.padEnd(14)} 실패 — ${e.message}`);
    }
  }

  console.log(`\n── 완료: ${done}권 재최적화, ${skipped.length}권 건너뜀, ${failed.length}권 실패 ──`);
  if (skipped.length) console.log('건너뜀:\n  ' + skipped.join('\n  '));
  if (failed.length) console.log('실패:\n  ' + failed.join('\n  '));
}

main().catch((e) => {
  console.error('✗ 예기치 못한 오류:', e);
  process.exit(1);
});
