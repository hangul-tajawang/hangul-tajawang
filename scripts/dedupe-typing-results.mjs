#!/usr/bin/env node
/**
 * typing_results 중복 완주 기록 정리 (일회성)
 *
 * LongPractice.tsx 의 handleInputChange 에 완주 가드가 없어서, 입력 길이가 본문 길이에
 * 도달한 뒤 키를 누를 때마다 saveResult() 가 다시 호출됐다. 그 결과 같은 유저·같은 작품의
 * 완주 기록이 0.01초 간격으로 수천 건씩 쌓였다(최다 조합 2,685행, 전부 0타·0초).
 * 코드는 2026-09-05에 고쳤고, 이 스크립트는 그 전에 쌓인 것을 정리한다.
 *
 * 판별 기준 — 같은 (user_id, content_id) 안에서 시간순으로 훑으며
 *   직전에 "남기기로 한" 행과의 간격이 THRESHOLD 초 미만이면 같은 뭉치로 본다.
 *   뭉치 안에서는 가장 이른 행 하나만 남기고 나머지를 지운다.
 *
 *   왜 "가장 이른" 인가: 뭉치 안에서 elapsed_seconds 는 그대로인데 타수만 계속 오른다.
 *   완주 후 키를 더 누를수록 총 타건수가 늘어 kpm 이 부풀기 때문이다.
 *   (실측 예: 17초 고정에 76.7 → 78.3 → 81.3 → 84.4타)
 *   따라서 완주 순간인 첫 행이 정직한 기록이고, 최고 타수를 남기면 오히려 기록을
 *   부풀려 랭킹과 profiles.best_speed 를 왜곡한다.
 *
 * 사람이 같은 작품을 여러 번 필사하는 것은 정상이고, 그 기록은 남긴다.
 * 전체 완주 간격 분포에서 10초 이상이 11%(진짜 재도전), 1초 미만이 85%였다.
 * 임계값 2초는 그 사이의 빈 구간이라 정상 기록을 건드리지 않는다.
 *
 *   node --env-file=.env.local scripts/dedupe-typing-results.mjs          # 미리보기
 *   node --env-file=.env.local scripts/dedupe-typing-results.mjs --apply  # 반영
 */

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SVC = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const APPLY = process.argv.includes('--apply');
const THRESHOLD_MS = 2000;

if (!URL_ || !SVC) { console.error('.env.local 이 필요합니다'); process.exit(1); }
const auth = (e = {}) => ({ apikey: SVC, Authorization: `Bearer ${SVC}`, ...e });

// ── 전량 조회 ────────────────────────────────────────────────────────────
let rows = [];
for (let offset = 0; ; offset += 1000) {
  const res = await fetch(
    `${URL_}/rest/v1/typing_results?select=id,user_id,content_id,speed,accuracy,elapsed_seconds,created_at&order=created_at.asc&limit=1000&offset=${offset}`,
    { headers: auth() });
  const batch = await res.json();
  if (!Array.isArray(batch)) throw new Error(JSON.stringify(batch).slice(0, 200));
  rows.push(...batch);
  if (batch.length < 1000) break;
}

// ── (user, content) 별로 뭉치를 만들고 대표 1건만 남긴다 ─────────────────
const groups = new Map();
for (const r of rows) {
  const k = `${r.user_id}|${r.content_id}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(r);
}

const doomed = [];
let clusters = 0;
let inflated = 0;

for (const list of groups.values()) {
  list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  let bucket = [];
  const flush = () => {
    if (!bucket.length) return;
    clusters++;
    if (bucket.length > 1) {
      // 뭉치 대표: 가장 이른 행 = 완주 순간. 뒤로 갈수록 타수가 부풀어 있다.
      const keep = bucket[0];
      for (const r of bucket) {
        if (r.id === keep.id) continue;
        doomed.push(r);
        if (r.speed > keep.speed) inflated++;
      }
    }
    bucket = [];
  };
  for (const r of list) {
    if (!bucket.length) { bucket.push(r); continue; }
    const gap = new Date(r.created_at) - new Date(bucket[bucket.length - 1].created_at);
    if (gap < THRESHOLD_MS) bucket.push(r);
    else { flush(); bucket.push(r); }
  }
  flush();
}

console.log(APPLY ? '▶ 반영 모드' : '▶ 미리보기 — 반영하려면 --apply');
console.log(`  전체 ${rows.length.toLocaleString()}행 / (유저x작품) 조합 ${groups.size.toLocaleString()}개`);
console.log(`  뭉치 ${clusters.toLocaleString()}개 → 뭉치당 1건 보존`);
console.log(`  삭제 대상 ${doomed.length.toLocaleString()}행 (${(doomed.length / rows.length * 100).toFixed(0)}%)`);
console.log(`  남는 행   ${(rows.length - doomed.length).toLocaleString()}행`);
console.log(`  삭제 대상 중 보존 행보다 타수가 부풀려진 행: ${inflated.toLocaleString()}건`);

const kept = rows.length - doomed.length;
console.log(`\n  검증: 조합 수(${groups.size}) <= 남는 행(${kept}) 이어야 정상 → ${groups.size <= kept ? 'OK' : '이상'}`);

if (!APPLY) {
  console.log('\n  삭제 대상 표본 5건:');
  doomed.slice(0, 5).forEach(r =>
    console.log(`    ${r.created_at}  ${r.speed}타 ${r.accuracy}% ${r.elapsed_seconds}초`));
  console.log('\n반영: node --env-file=.env.local scripts/dedupe-typing-results.mjs --apply');
} else {
  for (let i = 0; i < doomed.length; i += 100) {
    const ids = doomed.slice(i, i + 100).map(r => `"${r.id}"`).join(',');
    const res = await fetch(`${URL_}/rest/v1/typing_results?id=in.(${ids})`,
      { method: 'DELETE', headers: auth({ Prefer: 'return=minimal' }) });
    if (!res.ok) throw new Error(`DELETE → ${res.status}: ${(await res.text()).slice(0, 200)}`);
    if ((i / 100) % 20 === 0) console.log(`    ${i}/${doomed.length}`);
  }
  console.log(`  삭제 완료 ${doomed.length.toLocaleString()}행`);
}
