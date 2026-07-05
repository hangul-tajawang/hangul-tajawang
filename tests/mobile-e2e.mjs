#!/usr/bin/env node
/**
 * 모바일 뷰포트 E2E 테스트 (Playwright + Chromium)
 *
 * 실기기 IME를 완전히 재현할 수는 없지만, 모바일 IME가 React에 전달하는
 * 것과 동일한 형태(조합 완료된 음절이 포함된 input 이벤트)로 입력을 넣어
 * 자소 스트림 판정·자동 진행·레이아웃 오버플로를 검증한다.
 *
 * 사용법: npm run build 후 → node tests/mobile-e2e.mjs
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const PORT = 3311;
const BASE = `http://localhost:${PORT}`;
const MOBILE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 };

let passed = 0, failed = 0;
const failures = [];
function ok(name, cond, detail = '') {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; failures.push(name); console.log(`  ❌ ${name} ${detail}`); }
}

// React 제어 컴포넌트에 네이티브 setter로 값 주입 (모바일 IME의 커밋과 동일한 경로)
async function setInputValue(page, selector, value) {
  await page.evaluate(({ selector, value }) => {
    const el = document.querySelector(selector);
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, { selector, value });
}

// 자음+모음 → 완성형 음절 조합 (모바일 IME의 음절 조합 시뮬레이션)
const CHO = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const JUNG = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
function appendJamoLikeIME(current, jamo) {
  const last = current.slice(-1);
  const choIdx = CHO.indexOf(last);
  const jungIdx = JUNG.indexOf(jamo);
  if (choIdx > -1 && jungIdx > -1) {
    // 직전 낱자음 + 모음 → 음절로 조합 (예: "ㅁ" + "ㅏ" → "마")
    return current.slice(0, -1) + String.fromCharCode(0xac00 + choIdx * 588 + jungIdx * 28);
  }
  return current + jamo;
}

async function noHorizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
}

async function main() {
  // ── 프로덕션 서버 기동 ──
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { stdio: 'pipe' });
  await new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('server start timeout')), 30000);
    server.stdout.on('data', (d) => { if (String(d).includes('Ready')) { clearTimeout(t); res(); } });
  });

  const browser = await chromium.launch();
  const ctx = await browser.newContext(MOBILE);
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', (e) => jsErrors.push(e.message));

  try {
    // ══ 1. 주요 페이지 가로 오버플로 검사 (390px) ══════════════════════════
    console.log('\n[1] 모바일 레이아웃 (가로 스크롤 없어야 함)');
    for (const path of ['/', '/practice/short/healing', '/practice/word', '/practice/position', '/transcription/poem_1', '/game/acid-rain', '/game/block-pop', '/game/typing-race', '/quiz/an-vs-anh', '/blog/four-week-typing-plan']) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      ok(`${path} 오버플로 없음`, await noHorizontalOverflow(page));
    }

    // ══ 2. 짧은 글 연습: 문장 완성 → 자동 다음 문장 ══════════════════════
    console.log('\n[2] 짧은 글 연습 (모바일)');
    await page.goto(BASE + '/practice/short/healing', { waitUntil: 'networkidle' });
    const sentence = await page.evaluate(() => document.querySelector('div.font-plus-jakarta.font-black.select-none')?.textContent);
    ok('목표 문장 렌더링', !!sentence && sentence.length > 5, `got: ${sentence}`);
    await setInputValue(page, 'input[placeholder="문장을 입력해 주세요"]', sentence);
    await page.waitForTimeout(900); // 완성 애니메이션(600ms) 대기
    const progressText = await page.evaluate(() => [...document.querySelectorAll('span')].find(s => s.textContent?.match(/^2\/\d+$/))?.textContent);
    ok('문장 완성 → 2번째 문장으로 자동 진행', progressText?.startsWith('2/'), `progress: ${progressText}`);
    const kpmShown = await page.evaluate(() => { const els = [...document.querySelectorAll('span.font-plus-jakarta')]; return els.some(e => Number(e.textContent) > 0); });
    ok('타수 측정값 표시', kpmShown);

    // ══ 3. 자리 연습: 자소 스트림 판정 (IME 음절 조합 포함) ═══════════════
    console.log('\n[3] 자리 연습 (자소 스트림 + 음절 조합)');
    await page.goto(BASE + '/practice/position', { waitUntil: 'networkidle' });
    // 이 페이지는 initialPhase="keys"로 즉시 시작됨
    await page.waitForSelector('h2.font-plus-jakarta', { timeout: 10000 });
    await page.waitForTimeout(300);

    let typed = '';
    let allCorrect = true;
    for (let i = 0; i < 8; i++) {
      const target = await page.evaluate(() => document.querySelector('h2.font-plus-jakarta')?.textContent?.trim());
      if (!target || target.length !== 1) { allCorrect = false; break; }
      typed = appendJamoLikeIME(typed, target); // 모음이면 직전 자음과 음절로 조합됨
      await setInputValue(page, 'input.fixed', typed);
      await page.waitForTimeout(120);
    }
    const posProgress = await page.evaluate(() => [...document.querySelectorAll('span.font-black')].find(s => /^\d+ \/ \d+$/.test(s.textContent || ''))?.textContent);
    ok('자소 8개 순서대로 정답 처리 (조합 음절 포함)', allCorrect && posProgress?.startsWith('9 /'), `progress: ${posProgress}`);

    // 오답 자소 입력 시 진행되지 않아야 함
    const before = posProgress;
    const wrongTarget = await page.evaluate(() => document.querySelector('h2.font-plus-jakarta')?.textContent?.trim());
    const wrongJamo = wrongTarget === 'ㅁ' ? 'ㄴ' : 'ㅁ';
    await setInputValue(page, 'input.fixed', typed + wrongJamo);
    await page.waitForTimeout(120);
    const after = await page.evaluate(() => [...document.querySelectorAll('span.font-black')].find(s => /^\d+ \/ \d+$/.test(s.textContent || ''))?.textContent);
    ok('오답 자소는 진행 안 됨', before === after, `${before} → ${after}`);

    // ══ 4. 긴 글 필사: 입력 → 하이라이트/자동 스크롤/타수 ═════════════════
    console.log('\n[4] 긴 글 필사 (모바일 상하 분할)');
    await page.goto(BASE + '/transcription/poem_1', { waitUntil: 'networkidle' });
    const first10 = await page.evaluate(() => {
      const panel = document.querySelector('div[class*="overflow-y-auto"]');
      const spans = [...panel.querySelectorAll('span')].slice(0, 10);
      return spans.map(s => s.querySelector('br') ? '\n' : s.textContent).join('');
    });
    ok('원문 로드', first10.length === 10, `got: ${JSON.stringify(first10)}`);
    await setInputValue(page, 'textarea', first10);
    await page.waitForTimeout(400);
    const currentMarker = await page.evaluate(() => !!document.querySelector('[data-current="true"]'));
    ok('현재 위치 하이라이트 이동', currentMarker);
    const strokesShown = await page.evaluate(() => [...document.querySelectorAll('span')].some(s => { const t = s.textContent?.trim() || ''; return /^\d+$/.test(t) && Number(t) > 5 && s.closest('div')?.textContent?.includes(':'); }));
    ok('타수 카운트 동작', strokesShown);

    // ══ 5. 타자 레이스: 단어 입력 → 전진 ══════════════════════════════════
    console.log('\n[5] 타자 레이스 (모바일)');
    await page.goto(BASE + '/game/typing-race', { waitUntil: 'networkidle' });
    await page.locator('button', { hasText: '경주 시작' }).click();
    await page.waitForTimeout(300);
    let raceOk = true;
    for (let i = 0; i < 3; i++) {
      const word = await page.evaluate(() => [...document.querySelectorAll('div.border-4.tracking-wider')].map(d => d.textContent?.trim()).find(t => t && t !== '🏁'));
      if (!word) { raceOk = false; break; }
      await setInputValue(page, 'input[placeholder="위 단어를 입력하세요!"]', word);
      await page.waitForTimeout(200);
      const cleared = await page.evaluate(() => document.querySelector('input[placeholder="위 단어를 입력하세요!"]')?.value === '');
      if (!cleared) { raceOk = false; break; }
    }
    ok('단어 3개 연속 인식 → 전진/입력 초기화', raceOk);

    // ══ 6. 블록 팝핑: 블록 단어 입력 → 점수 ═══════════════════════════════
    console.log('\n[6] 블록 팝핑 (모바일)');
    await page.goto(BASE + '/game/block-pop', { waitUntil: 'networkidle' });
    await page.locator('button', { hasText: '게임 시작' }).click();
    await page.waitForTimeout(3500); // 첫 블록 생성(레벨1 스폰 주기 2.6초) 대기
    const blockWord = await page.evaluate(() => [...document.querySelectorAll('div.border-b-4')].map(d => d.textContent?.trim()).find(t => t && !t.includes('💣') && !t.includes('✨')));
    ok('블록 생성', !!blockWord, `word: ${blockWord}`);
    if (blockWord) {
      await setInputValue(page, 'input[placeholder="블록 단어를 입력하세요!"]', blockWord);
      await page.waitForTimeout(200);
      const score = await page.evaluate(() => Number([...document.querySelectorAll('span.text-yellow-400')].map(s => s.textContent?.replace(/,/g, '')).find(t => /^\d+$/.test(t)) || 0));
      ok('블록 파괴 → 점수 획득', score > 0, `score: ${score}`);
    }

    // ══ 7. 산성비: 낙하 단어 입력 → 점수 ══════════════════════════════════
    console.log('\n[7] 산성비 (모바일)');
    await page.goto(BASE + '/game/acid-rain', { waitUntil: 'networkidle' });
    await page.locator('button', { hasText: '게임 시작' }).click();
    await page.waitForTimeout(3200); // 첫 단어 스폰(레벨1 주기 2.75초) 대기
    const fallingWord = await page.evaluate(() => [...document.querySelectorAll('div.whitespace-nowrap')].map(d => d.textContent?.trim()).find(t => t && !t.includes('폭탄') && !t.includes('얼음') && !t.includes('황금') && t !== '???'));
    ok('단어 낙하 시작', !!fallingWord, `word: ${fallingWord}`);
    if (fallingWord) {
      await setInputValue(page, 'input[placeholder="단어를 입력하세요!"]', fallingWord);
      await page.waitForTimeout(200);
      const score = await page.evaluate(() => Number([...document.querySelectorAll('span.text-yellow-400')].map(s => s.textContent?.replace(/,/g, '')).find(t => /^\d+$/.test(t)) || 0));
      ok('단어 격추 → 점수 획득', score > 0, `score: ${score}`);
    }

    // ══ 8. 데스크톱 회귀 확인 ═════════════════════════════════════════════
    console.log('\n[8] 데스크톱 회귀 (1440px)');
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const dp = await desktop.newPage();
    await dp.goto(BASE + '/practice/short/healing', { waitUntil: 'networkidle' });
    const dSentence = await dp.evaluate(() => document.querySelector('div.font-plus-jakarta.font-black.select-none')?.textContent);
    await dp.evaluate(({ value }) => {
      const el = document.querySelector('input[placeholder="문장을 입력해 주세요"]');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, { value: dSentence });
    await dp.waitForTimeout(900);
    const dProgress = await dp.evaluate(() => [...document.querySelectorAll('span')].find(s => s.textContent?.match(/^2\/\d+$/))?.textContent);
    ok('데스크톱 짧은 글 연습 정상', dProgress?.startsWith('2/'));
    await dp.goto(BASE + '/transcription/poem_1', { waitUntil: 'networkidle' });
    ok('데스크톱 필사 좌우 분할 렌더링', await dp.evaluate(() => !!document.querySelector('textarea')));
    await desktop.close();

    // ══ 9. 가상 키보드 열림 시뮬레이션 (390×450) ═══════════════════════════
    // 안드로이드는 interactive-widget=resizes-content로 자판이 올라오면
    // 레이아웃 뷰포트가 이만큼 줄어든다. 줄어든 화면에서
    // "목표 텍스트 + 입력창"이 동시에 보이는지 검증한다.
    console.log('\n[9] 자판 열림 상태 (뷰포트 390×450)');
    const kbCtx = await browser.newContext({ viewport: { width: 390, height: 450 }, isMobile: true, hasTouch: true });
    const kp = await kbCtx.newPage();
    const isVisible = (sel) => kp.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0 && r.height > 0;
    }, sel);

    // 짧은 글: 입력창 포커스(자동 스크롤 발동) 후 문장 카드와 입력창 동시 노출
    await kp.goto(BASE + '/practice/short/healing', { waitUntil: 'networkidle' });
    await kp.evaluate(() => document.querySelector('input[placeholder="문장을 입력해 주세요"]')?.focus());
    await kp.waitForTimeout(700); // scrollIntoViewOnFocus(300ms 지연) 대기
    ok('짧은글: 목표 문장 보임', await isVisible('div.font-plus-jakarta.font-black.select-none'));
    ok('짧은글: 입력창 보임', await isVisible('input[placeholder="문장을 입력해 주세요"]'));

    // 낱말 연습(자리연습 words 단계): 목표 단어 + 입력 표시 영역 노출
    await kp.goto(BASE + '/practice/word/step1', { waitUntil: 'networkidle' });
    await kp.waitForTimeout(500);
    ok('낱말: 목표 단어 보임', await isVisible('h2.font-plus-jakarta'));

    // 자리 연습: 목표 글자 + 화면 자판 노출
    await kp.goto(BASE + '/practice/position', { waitUntil: 'networkidle' });
    await kp.waitForTimeout(300);
    ok('자리: 목표 글자 보임', await isVisible('h2.font-plus-jakarta'));

    // 긴 글 필사: 텍스트영역 포커스 후 원문 현재 위치 + 입력영역 동시 노출
    await kp.goto(BASE + '/transcription/poem_1', { waitUntil: 'networkidle' });
    await kp.evaluate(() => document.querySelector('textarea')?.scrollIntoView({ block: 'center' }));
    await kp.evaluate(() => document.querySelector('textarea')?.focus());
    await kp.waitForTimeout(500);
    ok('필사: 원문 현재 글자 보임', await isVisible('[data-current="true"]'));
    ok('필사: 입력 영역 보임', await isVisible('textarea'));

    // 산성비: 게임 영역 + 입력창 동시 노출
    await kp.goto(BASE + '/game/acid-rain', { waitUntil: 'networkidle' });
    await kp.locator('button', { hasText: '게임 시작' }).click();
    await kp.waitForTimeout(300);
    ok('산성비: 게임 영역 보임', await isVisible('div.bg-zinc-950'));
    ok('산성비: 입력창 보임', await isVisible('input[placeholder="단어를 입력하세요!"]'));

    // 타자 레이스: 목표 단어 + 입력창 동시 노출
    await kp.goto(BASE + '/game/typing-race', { waitUntil: 'networkidle' });
    await kp.locator('button', { hasText: '경주 시작' }).click();
    await kp.waitForTimeout(300);
    await kp.evaluate(() => { const el = document.querySelector('input[placeholder="위 단어를 입력하세요!"]'); el?.scrollIntoView({ block: 'center' }); el?.focus(); });
    await kp.waitForTimeout(400);
    ok('레이스: 목표 단어 보임', await isVisible('div.border-4.tracking-wider'));
    ok('레이스: 입력창 보임', await isVisible('input[placeholder="위 단어를 입력하세요!"]'));

    await kbCtx.close();

    // ══ JS 런타임 에러 ══
    console.log('\n[10] JS 런타임 에러');
    ok('페이지 에러 0건', jsErrors.length === 0, jsErrors.slice(0, 3).join(' | '));
  } finally {
    await browser.close();
    server.kill();
  }

  console.log(`\n═══ 결과: ${passed} 통과 / ${failed} 실패 ═══`);
  if (failures.length) console.log('실패 목록:', failures.join(', '));
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
