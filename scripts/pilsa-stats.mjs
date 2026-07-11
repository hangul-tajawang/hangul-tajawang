#!/usr/bin/env node
/**
 * 필사 지표 대시보드 생성기 (의존성 없음, Node 18+)
 *
 * usage_events를 Supabase REST(service_role 키)로 조회해서
 * stats/pilsa-stats.html (자체 완결 HTML 대시보드)를 생성하고 브라우저로 엽니다.
 *
 * 사용법:  node scripts/pilsa-stats.mjs           (또는 npm run stats)
 *          node scripts/pilsa-stats.mjs --demo    (가짜 데이터로 미리보기)
 *
 * 준비(1회): Supabase 대시보드 → Settings → API → service_role 키 복사 후
 *            .env.local에 한 줄 추가:  SUPABASE_SERVICE_ROLE_KEY=eyJ...
 *            (.env*는 gitignore 되어 있어 커밋되지 않음)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEMO = process.argv.includes('--demo');

// ── .env.local 로드 ─────────────────────────────────────────────────────
function loadEnv() {
  const env = {};
  try {
    for (const line of readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim();
    }
  } catch { /* 없으면 아래에서 안내 */ }
  return env;
}

// ── 이벤트 행 전체 조회 (REST, 1000행 단위 페이지네이션) ────────────────
async function fetchAllEvents() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('SUPABASE_SERVICE_ROLE_KEY가 .env.local에 없습니다.');
    console.error('Supabase 대시보드 → Settings → API → service_role 키를 복사해서');
    console.error('.env.local에  SUPABASE_SERVICE_ROLE_KEY=eyJ...  한 줄을 추가하세요.');
    console.error('(외부 노출 금지 키입니다. .env*는 gitignore라 커밋되지 않습니다.)');
    process.exit(1);
  }
  const rows = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const res = await fetch(
      `${url}/rest/v1/usage_events?select=visitor_id,event,props,path,created_at` +
      `&path=not.eq./__migration_test__&order=created_at.asc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + PAGE - 1}` } }
    );
    if (!res.ok) throw new Error(`조회 실패 (${res.status}): ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < PAGE) break;
  }
  return rows;
}

// ── 데모 데이터 (미리보기용) ────────────────────────────────────────────
function demoEvents() {
  const rows = [];
  const now = Date.now();
  for (let d = 21; d >= 0; d--) {
    const visitors = 3 + ((d * 7) % 9);
    for (let v = 0; v < visitors; v++) {
      const vid = `00000000-0000-0000-0000-0000000000${String((v + d) % 30).padStart(2, '0')}`;
      const ts = new Date(now - d * 864e5).toISOString();
      const cid = ['poem_1', 'poem_2', 'essay_1', 'tale_1'][v % 4];
      rows.push({ visitor_id: vid, event: 'pilsa_start', props: { content_id: cid, source: 'library' }, created_at: ts });
      if (v % 3 !== 0) rows.push({ visitor_id: vid, event: 'pilsa_complete', props: { content_id: cid, source: 'library' }, created_at: ts });
    }
  }
  return rows;
}

// ── 집계 (KST 기준) ─────────────────────────────────────────────────────
const kstDay = (iso) => new Date(new Date(iso).getTime() + 9 * 36e5).toISOString().slice(0, 10);
const dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);

function aggregate(rows) {
  const starts = rows.filter((r) => r.event === 'pilsa_start');

  // 일별 (최근 30일)
  const byDay = new Map();
  for (const r of rows) {
    const day = kstDay(r.created_at);
    if (!byDay.has(day)) byDay.set(day, { day, starts: 0, completes: 0, visitors: new Set() });
    const d = byDay.get(day);
    if (r.event === 'pilsa_start') { d.starts++; d.visitors.add(r.visitor_id); }
    if (r.event === 'pilsa_complete') d.completes++;
  }
  const daily = [...byDay.values()]
    .map((d) => ({ day: d.day, starts: d.starts, completes: d.completes, dau: d.visitors.size }))
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-30);

  // 코호트 D1/D7 (최근 21일)
  const firstSeen = new Map(); // visitor → 첫 필사일
  const visitDays = new Map(); // visitor → Set(day)
  for (const r of starts) {
    const day = kstDay(r.created_at);
    if (!firstSeen.has(r.visitor_id) || day < firstSeen.get(r.visitor_id)) firstSeen.set(r.visitor_id, day);
    if (!visitDays.has(r.visitor_id)) visitDays.set(r.visitor_id, new Set());
    visitDays.get(r.visitor_id).add(day);
  }
  const cohortMap = new Map();
  for (const [vid, day] of firstSeen) {
    if (!cohortMap.has(day)) cohortMap.set(day, { cohort_day: day, cohort_size: 0, d1: 0, d7: 0 });
    const c = cohortMap.get(day);
    c.cohort_size++;
    for (const vd of visitDays.get(vid)) {
      if (dayDiff(day, vd) === 1) c.d1++;
      if (dayDiff(day, vd) === 7) c.d7++;
    }
  }
  const today = kstDay(new Date().toISOString());
  const cohort = [...cohortMap.values()]
    .filter((c) => dayDiff(c.cohort_day, today) <= 21)
    .sort((a, b) => b.cohort_day.localeCompare(a.cohort_day));

  // 작품별 TOP 10
  const byContent = new Map();
  for (const r of rows) {
    const cid = r.props?.content_id || '?';
    const key = `${r.props?.source || '?'}|${cid}`;
    if (!byContent.has(key)) byContent.set(key, { source: r.props?.source || '?', content_id: cid, starts: 0, completes: 0 });
    const c = byContent.get(key);
    if (r.event === 'pilsa_start') c.starts++;
    if (r.event === 'pilsa_complete') c.completes++;
  }
  const contents = [...byContent.values()]
    .filter((c) => c.starts > 0)
    .sort((a, b) => b.completes - a.completes || b.starts - a.starts)
    .slice(0, 10);

  return { daily, cohort, contents };
}

// ── 작품 제목 매핑 (lib/long-text-data.ts에서 id→title 추출) ─────────────
function loadTitleMap() {
  const map = {};
  try {
    const src = readFileSync(path.join(ROOT, 'lib', 'long-text-data.ts'), 'utf8');
    for (const m of src.matchAll(/id:\s*['"]([^'"]+)['"][\s\S]*?title:\s*['"]([^'"]+)['"]/g)) {
      map[m[1]] = m[2];
    }
  } catch { /* 매핑 실패 시 id 그대로 표시 */ }
  return map;
}

// ── 메인 ────────────────────────────────────────────────────────────────
const rows = DEMO ? demoEvents() : await fetchAllEvents();
const { daily, cohort, contents } = aggregate(rows);
const titleMap = loadTitleMap();
const contentsLabeled = contents.map((r) => ({
  ...r,
  label: r.source === 'challenge'
    ? `챌린지 (${String(r.content_id).slice(0, 8)})`
    : titleMap[r.content_id] || r.content_id,
}));

const generatedAt = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
const data = { daily, cohort, contents: contentsLabeled, generatedAt };

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>한글타자왕 필사 지표</title>
<style>
  .viz-root {
    --surface-1: #fcfcfb; --surface-2: #f1f0ee;
    --text-primary: #0b0b0b; --text-secondary: #52514e; --text-muted: #8a8984;
    --grid: #e4e3e0; --border: #dddcd8;
    --series-1: #2a78d6; /* 시작 */
    --series-2: #1baf7a; /* 완주 */
  }
  @media (prefers-color-scheme: dark) {
    .viz-root {
      --surface-1: #1a1a19; --surface-2: #242422;
      --text-primary: #ffffff; --text-secondary: #c3c2b7; --text-muted: #8a897f;
      --grid: #33332f; --border: #3c3b36;
      --series-1: #3987e5; --series-2: #199e70;
    }
  }
  * { box-sizing: border-box; margin: 0; }
  body.viz-root {
    background: var(--surface-1); color: var(--text-primary);
    font-family: -apple-system, "Apple SD Gothic Neo", "Pretendard", sans-serif;
    padding: 32px 24px 64px; max-width: 960px; margin: 0 auto;
  }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .sub { color: var(--text-muted); font-size: 13px; margin-bottom: 28px; }
  h2 { font-size: 15px; margin: 36px 0 12px; }
  .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
  .tile { background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; }
  .tile .k { font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; }
  .tile .v { font-size: 26px; font-weight: 800; font-variant-numeric: tabular-nums; }
  .tile .d { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
  .panel { background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 18px; }
  .legend { display: flex; gap: 16px; font-size: 12px; color: var(--text-secondary); margin-bottom: 10px; }
  .legend span::before { content: ""; display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }
  .legend .s1::before { background: var(--series-1); }
  .legend .s2::before { background: var(--series-2); }
  svg text { fill: var(--text-secondary); font-size: 11px; font-variant-numeric: tabular-nums; }
  svg .gridline { stroke: var(--grid); stroke-width: 1; }
  svg .axis { stroke: var(--border); stroke-width: 1; }
  svg .val { fill: var(--text-primary); font-weight: 700; }
  .bar-s1 { fill: var(--series-1); } .bar-s2 { fill: var(--series-2); }
  .line-s1 { stroke: var(--series-1); stroke-width: 2; fill: none; }
  .dot-s1 { fill: var(--series-1); stroke: var(--surface-2); stroke-width: 2; }
  .empty { color: var(--text-muted); font-size: 13px; padding: 28px 0; text-align: center; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; font-variant-numeric: tabular-nums; }
  th { text-align: left; color: var(--text-secondary); font-weight: 600; font-size: 12px; }
  th, td { padding: 7px 10px; border-bottom: 1px solid var(--border); }
  td.num, th.num { text-align: right; }
  details { margin-top: 12px; } summary { font-size: 12px; color: var(--text-muted); cursor: pointer; }
  #tip { position: fixed; pointer-events: none; background: var(--text-primary); color: var(--surface-1);
    font-size: 12px; padding: 6px 9px; border-radius: 8px; opacity: 0; transition: opacity .1s; z-index: 10;
    font-variant-numeric: tabular-nums; white-space: nowrap; }
</style>
</head>
<body class="viz-root">
<h1>한글타자왕 · 필사 지표</h1>
<p class="sub">생성: ${generatedAt} (KST) · 최근 30일 · 테스트 이벤트 제외</p>

<div class="tiles" id="tiles"></div>

<h2>일별 필사 시작 · 완주</h2>
<div class="panel">
  <div class="legend"><span class="s1">시작</span><span class="s2">완주</span></div>
  <div id="dailyChart"></div>
  <details><summary>표로 보기</summary><div id="dailyTable"></div></details>
</div>

<h2>D1 · D7 재방문 (첫 필사일 코호트)</h2>
<div class="panel"><div id="cohortTable"></div></div>

<h2>완주가 많은 글 TOP 10</h2>
<div class="panel"><div id="contentsChart"></div></div>

<div id="tip"></div>

<script>
const DATA = ${JSON.stringify(data)};
const $ = (id) => document.getElementById(id);
const tip = $('tip');
const num = (v) => Number(v) || 0;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function showTip(evt, html) {
  tip.innerHTML = html; tip.style.opacity = 1;
  tip.style.left = Math.min(evt.clientX + 12, innerWidth - 180) + 'px';
  tip.style.top = (evt.clientY - 36) + 'px';
}
function hideTip() { tip.style.opacity = 0; }

// ── 스탯 타일 ──
(function tiles() {
  const last7 = DATA.daily.slice(-7);
  const starts = last7.reduce((a, r) => a + num(r.starts), 0);
  const completes = last7.reduce((a, r) => a + num(r.completes), 0);
  const dau = last7.length ? Math.max(...last7.map(r => num(r.dau))) : 0;
  const rate = starts ? Math.round(completes / starts * 100) : null;
  const t = [
    ['최근 7일 필사 시작', starts, '회'],
    ['최근 7일 완주', completes, '회'],
    ['완주율 (7일)', rate === null ? '—' : rate + '%', ''],
    ['일 최다 필사 방문자 (7일)', dau, '명'],
  ];
  $('tiles').innerHTML = t.map(([k, v, d]) =>
    '<div class="tile"><div class="k">' + k + '</div><div class="v">' + v + '</div><div class="d">' + d + '</div></div>'
  ).join('');
})();

// ── 일별 그룹 막대 (시작/완주) ──
(function dailyChart() {
  const rows = DATA.daily;
  if (!rows.length) { $('dailyChart').innerHTML = '<div class="empty">아직 데이터가 없어요. 방문자가 생기면 채워집니다.</div>'; return; }
  const W = 880, H = 220, PL = 36, PB = 24, PT = 14;
  const max = Math.max(1, ...rows.map(r => Math.max(num(r.starts), num(r.completes))));
  const iw = (W - PL - 8) / rows.length;
  const bw = Math.max(3, Math.min(14, (iw - 2) / 2 - 1));
  const y = (v) => PT + (H - PT - PB) * (1 - v / max);
  const bar = (x, v, cls) => {
    const top = y(v), base = H - PB, h = Math.max(0, base - top), r = Math.min(4, bw / 2, h);
    if (!h) return '';
    return '<path class="' + cls + '" d="M' + x + ' ' + base + ' V' + (top + r) + ' Q' + x + ' ' + top + ' ' + (x + r) + ' ' + top +
      ' H' + (x + bw - r) + ' Q' + (x + bw) + ' ' + top + ' ' + (x + bw) + ' ' + (top + r) + ' V' + base + ' Z"/>';
  };
  let marks = '', hover = '', labels = '';
  rows.forEach((r, i) => {
    const gx = PL + 4 + i * iw + (iw - bw * 2 - 2) / 2;
    marks += bar(gx, num(r.starts), 'bar-s1') + bar(gx + bw + 2, num(r.completes), 'bar-s2');
    hover += '<rect x="' + (PL + 4 + i * iw) + '" y="' + PT + '" width="' + iw + '" height="' + (H - PT - PB) +
      '" fill="transparent" data-i="' + i + '"/>';
    if (i === rows.length - 1) { // 마지막 값 직접 라벨 (선택적 라벨)
      labels += '<text class="val" x="' + gx + '" y="' + (y(num(r.starts)) - 5) + '">' + num(r.starts) + '</text>' +
        '<text class="val" x="' + (gx + bw + 2) + '" y="' + (y(num(r.completes)) - 5) + '">' + num(r.completes) + '</text>';
    }
    if (rows.length <= 14 || i % Math.ceil(rows.length / 10) === 0) {
      labels += '<text x="' + (PL + 4 + i * iw + iw / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + r.day.slice(5) + '</text>';
    }
  });
  let grid = '';
  for (let g = 0; g <= 3; g++) {
    const v = Math.round(max * g / 3), gy = y(v);
    grid += '<line class="gridline" x1="' + PL + '" x2="' + (W - 4) + '" y1="' + gy + '" y2="' + gy + '"/>' +
      '<text x="' + (PL - 6) + '" y="' + (gy + 4) + '" text-anchor="end">' + v + '</text>';
  }
  $('dailyChart').innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%">' + grid +
    '<line class="axis" x1="' + PL + '" x2="' + (W - 4) + '" y1="' + (H - PB) + '" y2="' + (H - PB) + '"/>' +
    marks + labels + '<g id="dailyHover">' + hover + '</g></svg>';
  $('dailyHover').addEventListener('mousemove', (e) => {
    const i = e.target.dataset.i; if (i === undefined) return;
    const r = rows[i];
    const rate = num(r.starts) ? Math.round(num(r.completes) / num(r.starts) * 100) + '%' : '—';
    showTip(e, r.day + '<br>시작 ' + num(r.starts) + ' · 완주 ' + num(r.completes) + ' (' + rate + ')<br>방문자 ' + num(r.dau) + '명');
  });
  $('dailyHover').addEventListener('mouseleave', hideTip);
  $('dailyTable').innerHTML = '<table><tr><th>날짜</th><th class="num">시작</th><th class="num">완주</th><th class="num">완주율</th><th class="num">방문자</th></tr>' +
    rows.map(r => '<tr><td>' + r.day + '</td><td class="num">' + num(r.starts) + '</td><td class="num">' + num(r.completes) +
      '</td><td class="num">' + (num(r.starts) ? Math.round(num(r.completes) / num(r.starts) * 100) + '%' : '—') +
      '</td><td class="num">' + num(r.dau) + '</td></tr>').join('') + '</table>';
})();

// ── 코호트 테이블 ──
(function cohortTable() {
  const rows = DATA.cohort;
  if (!rows.length) { $('cohortTable').innerHTML = '<div class="empty">아직 코호트가 없어요.</div>'; return; }
  const pct = (n, d) => d ? Math.round(n / d * 100) + '%' : '—';
  $('cohortTable').innerHTML = '<table><tr><th>첫 필사일</th><th class="num">인원</th><th class="num">D1 재방문</th><th class="num">D7 재방문</th></tr>' +
    rows.map(r => '<tr><td>' + r.cohort_day + '</td><td class="num">' + num(r.cohort_size) + '명</td>' +
      '<td class="num">' + num(r.d1) + ' (' + pct(num(r.d1), num(r.cohort_size)) + ')</td>' +
      '<td class="num">' + num(r.d7) + ' (' + pct(num(r.d7), num(r.cohort_size)) + ')</td></tr>').join('') + '</table>' +
    '<p style="font-size:11px;color:var(--text-muted);margin-top:8px">D7은 첫 필사 후 7일이 지나야 집계됩니다. 최근 코호트의 D7이 0인 것은 정상.</p>';
})();

// ── 작품별 가로 막대 ──
(function contentsChart() {
  const rows = DATA.contents;
  if (!rows.length) { $('contentsChart').innerHTML = '<div class="empty">아직 데이터가 없어요.</div>'; return; }
  const max = Math.max(1, ...rows.map(r => num(r.starts)));
  const W = 880, RH = 30, LW = 220, H = rows.length * RH + 8;
  let svg = '';
  rows.forEach((r, i) => {
    const yy = 4 + i * RH, bh = 14;
    const wS = (W - LW - 70) * num(r.starts) / max;
    const wC = (W - LW - 70) * num(r.completes) / max;
    svg += '<text x="' + (LW - 8) + '" y="' + (yy + bh) + '" text-anchor="end">' + esc(r.label).slice(0, 22) + '</text>' +
      '<rect class="bar-s1" x="' + LW + '" y="' + (yy + 2) + '" width="' + Math.max(2, wS) + '" height="' + (bh / 2 - 1) + '" rx="2"/>' +
      '<rect class="bar-s2" x="' + LW + '" y="' + (yy + bh / 2 + 3) + '" width="' + Math.max(2, wC) + '" height="' + (bh / 2 - 1) + '" rx="2"/>' +
      '<text class="val" x="' + (LW + Math.max(wS, wC) + 8) + '" y="' + (yy + bh) + '">' + num(r.starts) + ' / ' + num(r.completes) + '</text>' +
      '<rect fill="transparent" x="0" y="' + yy + '" width="' + W + '" height="' + RH + '" data-i="' + i + '"/>';
  });
  $('contentsChart').innerHTML =
    '<div class="legend"><span class="s1">시작</span><span class="s2">완주</span></div>' +
    '<svg id="cSvg" viewBox="0 0 ' + W + ' ' + H + '" style="width:100%">' + svg + '</svg>';
  $('cSvg').addEventListener('mousemove', (e) => {
    const i = e.target.dataset.i; if (i === undefined) return;
    const r = rows[i];
    showTip(e, esc(r.label) + '<br>시작 ' + num(r.starts) + ' · 완주 ' + num(r.completes) +
      (num(r.starts) ? ' (' + Math.round(num(r.completes) / num(r.starts) * 100) + '%)' : ''));
  });
  $('cSvg').addEventListener('mouseleave', hideTip);
})();
</script>
</body>
</html>`;

mkdirSync(path.join(ROOT, 'stats'), { recursive: true });
const outPath = path.join(ROOT, 'stats', 'pilsa-stats.html');
writeFileSync(outPath, html);
console.log(`✅ 대시보드 생성: ${outPath}`);
console.log(`   일별 ${daily.length}일 · 코호트 ${cohort.length}개 · 작품 ${contents.length}건`);
if (process.platform === 'darwin' && !process.env.NO_OPEN) {
  execFile('open', [outPath], () => {});
}
