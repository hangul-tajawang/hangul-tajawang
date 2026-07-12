#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// books:build 파이프라인
//
// content/original-works/*.md 원고를 전부 파싱하여
//   1) PILSA_SERIES (장편 시리즈 메타 + 토큰 표지)
//   2) LONG_TEXT_DB 의 화(에피소드) 엔트리
// 를 lib/long-text-data.ts 의 마커 주석 사이 영역에 재생성한다.
//
// 마커:
//   // === build-books:series:start ===  ...  // === build-books:series:end ===
//   // === build-books:episodes:start === ... // === build-books:episodes:end ===
//
// 멱등(idempotent): 원고가 그대로면 재실행해도 출력이 동일하다.
// 기존 novel7(novel7_ep1~12) 엔트리는 원고가 동일한 한 바이트 단위로 재현되어
// 서재(필사 기록) 호환이 유지된다.
//
//   실행:  node scripts/build-books.mjs   (= npm run books:build)
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WORKS_DIR = join(ROOT, 'content/original-works');
const TARGET = join(ROOT, 'lib/long-text-data.ts');

// 표지 팔레트 폴백 회전 (표지 토큰이 없는 원고용)
const FALLBACK_PALETTES = ['rose', 'indigo', 'emerald', 'amber', 'ink'];

// ── 특수문자 정제: 타자로 입력 불가한 문자를 표준 문자로 치환 ──
function normalizeText(s) {
  return s
    .replace(/…/g, '...')      // 말줄임표 → 마침표 3개
    .replace(/[‘’]/g, "'")   // 홑따옴표(‘’) → '
    .replace(/[“”]/g, '"');  // 겹따옴표(“”) → "
}

// TS 백틱 문자열 이스케이프
const escBacktick = (s) =>
  s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
// TS 홑따옴표 문자열 이스케이프
const escSingle = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

// ── 메타 블록 파싱 ──
function parseMeta(head) {
  const meta = {};
  for (const line of head.split('\n')) {
    const m = line.match(/^\s*-\s*\*\*(.+?)\*\*\s*:\s*(.+?)\s*$/);
    if (m) meta[m[1].trim()] = m[2].trim();
  }
  return meta;
}

// ── 원고 한 편 파싱 ──
function parseWork(fileName, fallbackIndex) {
  const raw = readFileSync(join(WORKS_DIR, fileName), 'utf8');

  // "## N화." 앞부분이 메타 블록
  const parts = raw.split(/^## /m);
  const head = parts[0];
  const meta = parseMeta(head);

  const titleMatch = head.match(/^#\s+(.+?)\s*$/m);
  const title = (titleMatch ? titleMatch[1] : fileName.replace(/\.md$/, '')).trim();

  const form = meta['형식'] || '';
  const hoMatch = form.match(/(\d+)\s*호/);
  const ho = hoMatch ? Number(hoMatch[1]) : 1000 + fallbackIndex;

  const id = meta['아이디'] || `series${fallbackIndex + 1}`;

  // 작가: '작가' 우선, 없거나 '미정'이면 '작가 표기', 그래도 미정이면 기본값
  let author = meta['작가'] || '';
  if (!author || author.startsWith('미정')) {
    const alt = meta['작가 표기'] || '';
    author = alt && !alt.startsWith('미정') ? alt : '한글타자왕 오리지널';
  }

  const logline = meta['로그라인'] || '';
  const description = meta['소개'] || logline;

  // 작가 아이디 (선택) — authors 테이블 슬러그. 있으면 /authors/{id} 페이지에 작품이 쌓인다
  const authorId = meta['작가 아이디'] || null;

  // 작가 프로필 (선택) — 투고 보상 "작가 SNS·블로그 링크 게재"용
  const authorProfile = {};
  if (meta['작가 SNS']) authorProfile.sns = meta['작가 SNS'];
  if (meta['작가 블로그']) authorProfile.blog = meta['작가 블로그'];
  if (meta['작가 프로필']) authorProfile.image = meta['작가 프로필'];
  if (meta['작가 소개']) authorProfile.bio = meta['작가 소개'];

  // 분류/난이도: 동화면 동화/초급, 그 외 소설/중급
  const isTale = /동화/.test(form);
  const category = isTale ? '동화' : '소설';
  const difficulty = isTale ? '초급' : '중급';

  // 표지 토큰: "palette / pattern"
  let cover;
  if (meta['표지']) {
    const [palette, pattern] = meta['표지'].split('/').map((x) => x.trim());
    cover = { palette: palette || 'rose', pattern: pattern || 'grid' };
  } else {
    cover = { palette: FALLBACK_PALETTES[fallbackIndex % FALLBACK_PALETTES.length], pattern: 'grid' };
  }

  const source = `한글타자왕 오리지널 · ${title}`;

  // 화 분할
  const episodes = [];
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const m = part.match(/^(\d+)화\.\s*(.+)$/m);
    if (!m) continue;
    const episode = Number(m[1]);
    const epTitle = m[2].trim();
    let body = part.slice(part.indexOf('\n') + 1);
    body = body
      .replace(/\*\(끝\)\*/g, '') // 마지막 표기 제거
      .replace(/^---\s*$/gm, '') // 구분선 제거
      .trim();
    body = body
      .split('\n')
      .map((l) => l.trimEnd())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n'); // 연속 빈 줄 → 하나로
    body = normalizeText(body);
    const wordCount = body.replace(/\s+/g, '').length;
    episodes.push({ episode, title: epTitle, body, wordCount });
  }
  episodes.sort((a, b) => a.episode - b.episode);

  // 구성 표기(전 N화)가 실제 화 수보다 크면 "연재 중" (예정 화수만 선언, 원고는 차차 추가)
  const declared = (meta['구성'] || '').match(/전\s*(\d+)\s*화/);
  const declaredTotal = declared ? Number(declared[1]) : 0;
  if (declaredTotal && declaredTotal < episodes.length) {
    console.warn(
      `⚠️  ${fileName}: 구성 표기(전 ${declaredTotal}화)보다 실제 화 수(${episodes.length}화)가 많습니다.`
    );
  } else if (declaredTotal > episodes.length) {
    console.log(`   · ${fileName}: 연재 중 (${episodes.length}/${declaredTotal}화 공개)`);
  }

  return {
    id, title, author, logline, description, cover, source,
    category, difficulty, ho, episodes, authorId,
    totalEpisodes: Math.max(declaredTotal, episodes.length),
    authorProfile: Object.keys(authorProfile).length > 0 ? authorProfile : null,
  };
}

// ── 작가 프로필 렌더 (없으면 빈 문자열 → 기존 출력과 바이트 동일) ──
function renderAuthorProfile(ap) {
  if (!ap) return '';
  const fields = [];
  if (ap.sns) fields.push(`sns: '${escSingle(ap.sns)}'`);
  if (ap.blog) fields.push(`blog: '${escSingle(ap.blog)}'`);
  if (ap.image) fields.push(`image: '${escSingle(ap.image)}'`);
  if (ap.bio) fields.push(`bio: '${escSingle(ap.bio)}'`);
  return `\n    authorProfile: { ${fields.join(', ')} },`;
}

// ── PILSA_SERIES 엔트리 렌더 ──
function renderSeriesEntry(w) {
  return `  {
    id: '${escSingle(w.id)}',
    title: '${escSingle(w.title)}',
    author: '${escSingle(w.author)}',
    logline:
      '${escSingle(w.logline)}',
    totalEpisodes: ${w.totalEpisodes},
    description:
      '${escSingle(w.description)}',
    cover: { palette: '${escSingle(w.cover.palette)}', pattern: '${escSingle(w.cover.pattern)}' },${renderAuthorProfile(w.authorProfile)}
  },`;
}

// ── 화(에피소드) 엔트리 렌더 ──
function renderEpisodeEntry(w, ep) {
  return `  {
    id: '${w.id}_ep${ep.episode}',
    title: '${ep.episode}화. ${escSingle(ep.title)}',
    content: \`${escBacktick(ep.body)}\`,
    category: '${w.category}',
    difficulty: '${w.difficulty}',
    wordCount: ${ep.wordCount},
    author: '${escSingle(w.author)}',
    source: '${escSingle(w.source)}',
    isPremium: false,
    seriesId: '${w.id}',
    episode: ${ep.episode},
  },`;
}

// ── 마커 사이 영역 치환 (마커 줄은 보존) ──
function replaceBetween(src, startMark, endMark, inner, label) {
  const s = src.indexOf(startMark);
  const e = src.indexOf(endMark);
  if (s === -1 || e === -1) {
    console.error(`❌ 마커를 찾지 못했습니다: ${label}`);
    process.exit(1);
  }
  const afterStart = src.indexOf('\n', s) + 1; // 시작 마커 줄 다음
  const beforeEnd = src.lastIndexOf('\n', e) + 1; // 종료 마커 줄 시작
  return src.slice(0, afterStart) + inner + '\n' + src.slice(beforeEnd);
}

// ── 원고 전체 파싱 (publish-books.mjs 도 같은 파서를 사용한다) ──
export function parseAllWorks() {
  const files = readdirSync(WORKS_DIR)
    .filter((f) => f.endsWith('.md') && !/^readme\.md$/i.test(f))
    .sort();

  const works = files.map((f, i) => parseWork(f, i)).sort((a, b) => a.ho - b.ho);

  // id 중복 검사
  const seen = new Set();
  for (const w of works) {
    if (seen.has(w.id)) {
      console.error(`❌ 시리즈 아이디 중복: ${w.id}`);
      process.exit(1);
    }
    seen.add(w.id);
  }
  return works;
}

// ── 실행 (직접 실행할 때만 — publish-books.mjs 가 import 할 때는 파서만 노출) ──
const IS_MAIN = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (IS_MAIN) {
  const works = parseAllWorks();

  const seriesInner = works.map(renderSeriesEntry).join('\n');

  const episodesInner = works
    .map((w) => {
      const header = `  // --- 오리지널 연재소설: ${w.title} (전 ${w.totalEpisodes}화) ---`;
      const body = w.episodes.map((ep) => renderEpisodeEntry(w, ep)).join('\n');
      return `${header}\n${body}`;
    })
    .join('\n');

  let ts = readFileSync(TARGET, 'utf8');
  ts = replaceBetween(
    ts,
    '// === build-books:series:start ===',
    '// === build-books:series:end ===',
    seriesInner,
    'series'
  );
  ts = replaceBetween(
    ts,
    '// === build-books:episodes:start ===',
    '// === build-books:episodes:end ===',
    episodesInner,
    'episodes'
  );
  writeFileSync(TARGET, ts);

  const totalEps = works.reduce((a, w) => a + w.episodes.length, 0);
  const totalChars = works.reduce(
    (a, w) => a + w.episodes.reduce((b, ep) => b + ep.wordCount, 0),
    0
  );
  console.log(
    `✅ 책방 빌드 완료 · 시리즈 ${works.length}편 / 화 ${totalEps}편 / 총 ${totalChars.toLocaleString()}자(공백 제외)`
  );
  for (const w of works) {
    console.log(`   · ${w.id.padEnd(10)} ${w.title} (전 ${w.totalEpisodes}화, 표지 ${w.cover.palette}/${w.cover.pattern})`);
  }
}
