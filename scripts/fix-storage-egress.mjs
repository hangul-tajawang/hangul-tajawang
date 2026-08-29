#!/usr/bin/env node
/**
 * Supabase 캐시 이그레스 정리 (일회성)
 *
 * 실측(2026-08-29) 기준 문제는 두 가지였다.
 *   1) book-assets/covers/*.jpg 9개가 `Cache-Control: no-cache` 로 저장돼 있어
 *      화면을 열 때마다 통째로 재다운로드된다. (파일은 이미 800px WebP였다)
 *   2) avatars 버킷 "루트"에 웹에서 리사이즈 없이 올라간 원본 8개(합 6.9MB)가 있고,
 *      max-age=3600 이라 한 시간마다 다시 받는다. 1.8MB 사진 한 장이 3일에 77번 불렸다.
 *
 * 처리 방식 — 삭제가 아니라 "같은 경로에 작게 덮어쓰기"를 기본으로 한다.
 * 경로가 그대로면 books.cover_image_url / profiles.avatar_url 을 손댈 필요가 없고,
 * 이미 그 URL을 쓰고 있는 이용자의 아바타도 사라지지 않는다.
 *
 *   - covers/*        → max-age=31536000 로 덮어쓰기 (크기는 800px 유지.
 *                        400px까지 줄여봤지만 og:image 공유 썸네일이 작아져 되돌렸다)
 *   - avatars 루트 이미지 → 256px 정사각 WebP + max-age=31536000 로 덮어쓰기
 *   - avatars 루트 비(非)이미지(mp4·crdownload) → 삭제.
 *     profiles 가 참조 중이면 avatar_url 을 null 로 되돌린다(이미 깨져 보이던 것들).
 *   - 아무도 참조하지 않는 고아 이미지 → 삭제
 *
 * 신규 업로드는 코드에서 이미 막아뒀다(lib/image-resize.ts, lib/supabase.ts,
 * components/admin/*Form.tsx, app/adminsangwon/actions.ts). 이 스크립트는 과거 잔재용이다.
 *
 * 실행:
 *   node --env-file=.env.local scripts/fix-storage-egress.mjs          # 미리보기(기본)
 *   node --env-file=.env.local scripts/fix-storage-egress.mjs --apply  # 실제 반영
 */

import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SVC = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const APPLY = process.argv.includes('--apply');

if (!URL_ || !SVC) {
  console.error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.');
  console.error('예: node --env-file=.env.local scripts/fix-storage-egress.mjs');
  process.exit(1);
}

const ONE_YEAR = 'max-age=31536000';
// 덮어쓰기·삭제 전에 원본을 로컬로 보관한다. 원본 화질은 복구할 수 없으므로
// 되돌릴 여지를 남겨둔다. (git에는 올라가지 않는다)
const BACKUP_DIR = path.resolve('.storage-backup');
const auth = (extra = {}) => ({ apikey: SVC, Authorization: `Bearer ${SVC}`, ...extra });
const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

async function listAll(bucket, prefix) {
  const out = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${URL_}/storage/v1/object/list/${bucket}`, {
      method: 'POST',
      headers: auth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ prefix, limit: 1000, offset, sortBy: { column: 'name', order: 'asc' } }),
    });
    if (!res.ok) throw new Error(`list ${bucket}/${prefix} → ${res.status}`);
    const batch = await res.json();
    out.push(...batch);
    if (batch.length < 1000) return out;
  }
}

async function download(bucket, objectPath) {
  const res = await fetch(`${URL_}/storage/v1/object/${bucket}/${objectPath}`, { headers: auth() });
  if (!res.ok) throw new Error(`download ${objectPath} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function backup(bucket, objectPath, buf) {
  if (!APPLY) return;
  const dest = path.join(BACKUP_DIR, bucket, objectPath);
  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(dest, buf);
}

async function overwrite(bucket, path, body, contentType) {
  const res = await fetch(`${URL_}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: auth({ 'Content-Type': contentType, 'Cache-Control': ONE_YEAR, 'x-upsert': 'true' }),
    body,
  });
  if (!res.ok) throw new Error(`upload ${path} → ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

async function remove(bucket, path) {
  const res = await fetch(`${URL_}/storage/v1/object/${bucket}/${path}`, {
    method: 'DELETE',
    headers: auth(),
  });
  if (!res.ok) throw new Error(`delete ${path} → ${res.status}`);
}

async function clearAvatarUrl(profileId) {
  const res = await fetch(`${URL_}/rest/v1/profiles?id=eq.${profileId}`, {
    method: 'PATCH',
    headers: auth({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({ avatar_url: null }),
  });
  if (!res.ok) throw new Error(`profiles PATCH ${profileId} → ${res.status}`);
}

// ── 1. 책 표지 ──────────────────────────────────────────────────────────
async function fixCovers() {
  console.log('\n■ book-assets/covers — 800px WebP + 1년 캐시');
  const files = (await listAll('book-assets', 'covers')).filter((o) => o.id);
  let before = 0;
  let after = 0;

  for (const obj of files) {
    const path = `covers/${obj.name}`;
    const src = await download('book-assets', path);
    backup('book-assets', path, src);
    const out = await sharp(src)
      .rotate() // EXIF 방향 정보를 실제 픽셀에 반영 (재인코딩 시 사진이 눕는 것 방지)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    before += obj.metadata.size;
    after += out.length;
    console.log(
      `  ${obj.name}  ${kb(obj.metadata.size)} → ${kb(out.length)}  (cc: ${obj.metadata.cacheControl} → ${ONE_YEAR})`
    );
    if (APPLY) await overwrite('book-assets', path, out, 'image/webp');
  }
  console.log(`  합계 ${kb(before)} → ${kb(after)}`);
}

// ── 2. avatars 버킷 루트 ────────────────────────────────────────────────
async function fixAvatarRoot() {
  console.log('\n■ avatars 루트 — 256px 정사각 WebP + 1년 캐시 / 비이미지는 삭제');

  const files = (await listAll('avatars', '')).filter((o) => o.id);
  const res = await fetch(`${URL_}/rest/v1/profiles?select=id,avatar_url&avatar_url=not.is.null`, {
    headers: auth(),
  });
  const profiles = await res.json();
  // 루트 파일명 → 그 파일을 참조 중인 profiles.id 목록
  const referencedBy = new Map();
  for (const p of profiles) {
    const name = decodeURIComponent((p.avatar_url.split('/avatars/')[1] || '').split('?')[0]);
    if (name && !name.includes('/')) {
      if (!referencedBy.has(name)) referencedBy.set(name, []);
      referencedBy.get(name).push(p.id);
    }
  }

  let before = 0;
  let after = 0;

  for (const obj of files) {
    const refs = referencedBy.get(obj.name) || [];
    const isImage = (obj.metadata.mimetype || '').startsWith('image/');
    before += obj.metadata.size;

    if (!isImage) {
      console.log(
        `  ${obj.name}  ${kb(obj.metadata.size)} ${obj.metadata.mimetype} → 삭제` +
          (refs.length ? ` (+ profiles ${refs.length}건 avatar_url=null — 원래도 깨진 이미지)` : ' (미참조)')
      );
      if (APPLY) {
        backup('avatars', obj.name, await download('avatars', obj.name));
        for (const id of refs) await clearAvatarUrl(id);
        await remove('avatars', obj.name);
      }
      continue;
    }

    if (refs.length === 0) {
      console.log(`  ${obj.name}  ${kb(obj.metadata.size)} → 삭제 (미참조 고아)`);
      if (APPLY) {
        backup('avatars', obj.name, await download('avatars', obj.name));
        await remove('avatars', obj.name);
      }
      continue;
    }

    const src = await download('avatars', obj.name);
    backup('avatars', obj.name, src);
    const meta = await sharp(src).metadata();
    const side = Math.min(meta.width, meta.height, 256);
    const out = await sharp(src)
      .rotate() // EXIF 방향 정보를 실제 픽셀에 반영
      .resize({ width: side, height: side, fit: 'cover', position: 'centre' })
      .webp({ quality: 82 })
      .toBuffer();
    after += out.length;
    console.log(
      `  ${obj.name}  ${kb(obj.metadata.size)} → ${kb(out.length)}  (cc: ${obj.metadata.cacheControl} → ${ONE_YEAR}, 참조 ${refs.length}명)`
    );
    if (APPLY) await overwrite('avatars', obj.name, out, 'image/webp');
  }
  console.log(`  합계 ${kb(before)} → ${kb(after)}`);
}

// ── 3. avatars/{uid}/ — 헤더만 1년으로 ─────────────────────────────────
// 앱이 supabase-js 로 올린 파일들이라 라이브러리 기본값 max-age=3600 이 붙어 있다.
// 이미 13~33KB로 충분히 작으므로 재인코딩 없이 같은 바이트를 1년 캐시로 다시 올린다.
// 저장된 URL 은 사용자별로 고정이라(교체 시엔 앱이 ?v= 를 갱신) 1년 캐시가 안전하다.
async function fixAvatarFolders() {
  console.log('\n■ avatars/{uid}/ — 헤더만 max-age=3600 → 1년');
  const res = await fetch(`${URL_}/rest/v1/profiles?select=avatar_url&avatar_url=not.is.null`, {
    headers: auth(),
  });
  const paths = [
    ...new Set(
      (await res.json())
        .map((p) => decodeURIComponent((p.avatar_url.split('/avatars/')[1] || '').split('?')[0]))
        .filter((n) => n.includes('/'))
    ),
  ];
  console.log(`  대상 ${paths.length}개`);
  if (!APPLY) return;

  let done = 0;
  let failed = 0;
  for (const objectPath of paths) {
    try {
      const buf = await download('avatars', objectPath);
      await overwrite('avatars', objectPath, buf, 'image/jpeg');
      done++;
    } catch {
      failed++; // 이미 지워진 파일을 가리키는 프로필이 있을 수 있다
    }
    if ((done + failed) % 25 === 0) console.log(`    ${done + failed}/${paths.length}`);
  }
  console.log(`  완료 ${done}개 / 건너뜀 ${failed}개(파일 없음)`);
}

const started = Date.now();
console.log(APPLY ? '▶ 실제 반영 모드 (--apply)' : '▶ 미리보기 모드 — 반영하려면 --apply');
await fixCovers();
await fixAvatarRoot();
await fixAvatarFolders();
console.log(`\n완료 (${((Date.now() - started) / 1000).toFixed(1)}s)`);
if (!APPLY) console.log('실제 반영: node --env-file=.env.local scripts/fix-storage-egress.mjs --apply');
