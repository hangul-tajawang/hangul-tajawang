#!/usr/bin/env node
/**
 * 기존 표지 9장을 본문용 400px 으로 줄이고, 공유 썸네일용 800px `-og` 변형을 만든다. (일회성)
 *
 * 캐시를 1년으로 바꾼 뒤에도 캐시 이그레스가 하루 90MB 대에 머물렀고, 남은 몫의
 * 대부분이 표지였다(합계 819KB × 앱 구버전의 반복 다운로드). 400px 으로 줄이면 -71%.
 * 다만 표지는 /transcription/[id] 의 og:image 로도 쓰여 그대로 줄이면 카카오톡 공유
 * 썸네일이 작아지므로, 800px 변형을 `-og` 이름으로 따로 올리고 메타데이터만 그쪽을
 * 가리키게 했다(lib/og-image.ts). og:image 는 스크래퍼만 받아가서 이그레스가 거의 없다.
 *
 * 경로는 그대로 두므로 books.cover_image_url 은 손대지 않는다.
 *
 *   node --env-file=.env.local scripts/resize-covers-with-og.mjs          # 미리보기
 *   node --env-file=.env.local scripts/resize-covers-with-og.mjs --apply  # 반영
 */
import sharp from 'sharp';

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SVC = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const APPLY = process.argv.includes('--apply');
if (!URL_ || !SVC) { console.error('.env.local 이 필요합니다'); process.exit(1); }

const auth = (e = {}) => ({ apikey: SVC, Authorization: `Bearer ${SVC}`, ...e });
const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
const toOgPath = (p) => p.replace(/\.(webp|jpg|jpeg|png)$/, '-og.$1');

async function put(path, buf) {
  const res = await fetch(`${URL_}/storage/v1/object/book-assets/${path}`, {
    method: 'POST',
    headers: auth({ 'Content-Type': 'image/webp', 'Cache-Control': 'max-age=31536000', 'x-upsert': 'true' }),
    body: buf,
  });
  if (!res.ok) throw new Error(`upload ${path} → ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

const list = await (await fetch(`${URL_}/storage/v1/object/list/book-assets`, {
  method: 'POST', headers: auth({ 'Content-Type': 'application/json' }),
  body: JSON.stringify({ prefix: 'covers', limit: 1000 }),
})).json();

console.log(APPLY ? '▶ 반영 모드' : '▶ 미리보기 — 반영하려면 --apply');
let before = 0, main = 0, og = 0;

for (const obj of list.filter((o) => o.id && !o.name.includes('-og.'))) {
  const path = `covers/${obj.name}`;
  const res = await fetch(`${URL_}/storage/v1/object/${path.replace('covers/', 'book-assets/covers/')}`, { headers: auth() });
  const src = Buffer.from(await (await fetch(`${URL_}/storage/v1/object/book-assets/${path}`, { headers: auth() })).arrayBuffer());
  const small = await sharp(src).rotate().resize({ width: 400, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  const large = await sharp(src).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  before += obj.metadata.size; main += small.length; og += large.length;
  console.log(`  ${obj.name.padEnd(14)} ${kb(obj.metadata.size).padStart(6)} → 본문 ${kb(small.length).padStart(5)} + og ${kb(large.length).padStart(6)} (${toOgPath(obj.name)})`);
  if (APPLY) { await put(path, small); await put(toOgPath(path), large); }
}

console.log(`\n  본문용 합계 ${kb(before)} → ${kb(main)}  (${(100 - main / before * 100).toFixed(0)}% 감소)`);
console.log(`  og용 추가   ${kb(og)}  ← 스크래퍼만 요청하므로 이그레스 영향 미미`);
if (!APPLY) console.log('\n반영: node --env-file=.env.local scripts/resize-covers-with-og.mjs --apply');
