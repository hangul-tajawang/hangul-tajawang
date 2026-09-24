import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DICTATION_ITEMS, DICTATION_LEVELS, gradeDictation, pickDictationItems, scoreDictation } from '../lib/dictation';
import { FIGHT_BOSSES, PLAYER_MAX_HP, TypingFightEngine, fightScore, isWrongPrefix } from '../lib/typing-fight';
import { SAJASEONGEO } from '../lib/sajaseongeo-data';
import { RACE_PASSAGES, passageDistance, prefixStrokes, splitPassage, matchedLength, ghostRunners, isBulkInsert, MAX_PLAUSIBLE_CPM } from '../lib/typing-race';
import { getJourneyCourse, getCourseStations } from '../lib/journey-data';

// ── 받아쓰기 ──
test('받아쓰기: 문장부호·앞뒤 공백은 채점하지 않는다', () => {
  assert.deepEqual(gradeDictation('등잔 밑이 어둡다', '  등잔 밑이 어둡다. '), { correct: true, spacingMiss: false });
});

test('받아쓰기: 띄어쓰기만 다르면 정답이되 표시한다', () => {
  assert.deepEqual(gradeDictation('천 리 길도 한 걸음부터', '천리 길도 한걸음부터'), { correct: true, spacingMiss: true });
});

test('받아쓰기: 소리 나는 대로 쓰면 오답', () => {
  assert.equal(gradeDictation('친구와 같이', '친구와 가치').correct, false);
  assert.equal(gradeDictation('며칠 동안', '몇일 동안').correct, false);
});

test('받아쓰기: 재도전으로 맞히면 2번째 60%, 3번째 30%', () => {
  const base = { level: 'hard' as const, seconds: 5, replaysUsed: 0, combo: 0, spacingMiss: false };
  const first = scoreDictation(base);
  assert.equal(scoreDictation({ ...base, wrongTries: 1 }), Math.round(first * 0.6));
  assert.equal(scoreDictation({ ...base, wrongTries: 2 }), Math.round(first * 0.3));
});

test('받아쓰기: 한 판 문제는 중복 없이 단계별 문제 수만큼', () => {
  for (const level of ['easy', 'medium', 'hard'] as const) {
    const items = pickDictationItems(level);
    assert.equal(items.length, DICTATION_LEVELS[level].count);
    assert.equal(new Set(items.map((i) => i.text)).size, items.length);
    assert.ok(DICTATION_ITEMS[level].length >= DICTATION_LEVELS[level].count);
  }
});

test('받아쓰기: 점수는 띄어쓰기 실수 시 절반, 최소 10점', () => {
  const full = scoreDictation({ level: 'medium', seconds: 4, replaysUsed: 0, combo: 0, spacingMiss: false });
  const half = scoreDictation({ level: 'medium', seconds: 4, replaysUsed: 0, combo: 0, spacingMiss: true });
  assert.equal(half, Math.round(full / 2));
  assert.ok(scoreDictation({ level: 'easy', seconds: 99, replaysUsed: 20, combo: 0, spacingMiss: false }) >= 10);
});

// ── 타자 격투 ──
test('격투: 공격 단어를 치면 보스 체력이 줄고 다음 단어로 바뀐다', () => {
  const engine = new TypingFightEngine(FIGHT_BOSSES[0], () => 0.5);
  const word = engine.state.attackWord;
  const next = engine.state.nextWord;
  const { cleared, events } = engine.input(word);
  assert.ok(cleared);
  assert.equal(events[0].type, 'hit');
  assert.ok(engine.state.bossHp < FIGHT_BOSSES[0].hp);
  assert.equal(engine.state.attackWord, next);
});

test('격투: 방어 단어를 제한 시간 안에 못 치면 피해를 입는다', () => {
  const engine = new TypingFightEngine(FIGHT_BOSSES[0], () => 0);
  let events = [] as ReturnType<TypingFightEngine['tick']>;
  for (let i = 0; i < 200 && !engine.state.defense; i++) events = engine.tick(0.1);
  assert.ok(engine.state.defense, '공격 자세가 나와야 한다');
  assert.equal(events.at(-1)?.type, 'windup');
  for (let i = 0; i < 100 && engine.state.defense; i++) events = engine.tick(0.1);
  assert.equal(engine.state.playerHp, PLAYER_MAX_HP - FIGHT_BOSSES[0].damage);
  assert.equal(events[0].type, 'hurt');
});

test('격투: 방어 단어를 치면 막고 반격한다', () => {
  const engine = new TypingFightEngine(FIGHT_BOSSES[1], () => 0);
  while (!engine.state.defense) engine.tick(0.1);
  const word = engine.state.defense!.word;
  assert.equal(engine.target, word);
  const { cleared, events } = engine.input(word);
  assert.ok(cleared);
  assert.equal(events[0].type, 'block');
  assert.equal(engine.state.playerHp, PLAYER_MAX_HP);
  assert.equal(engine.state.defense, null);
});

test('격투: 게이지가 차면 공격 단어가 사자성어 필살기로 바뀐다', () => {
  const engine = new TypingFightEngine({ ...FIGHT_BOSSES[0], hp: 9999 }, () => 0.3);
  const idioms = new Set(SAJASEONGEO.map((s) => s.name));
  for (let i = 0; i < 8 && !engine.state.special; i++) engine.input(engine.state.attackWord);
  assert.ok(engine.state.special);
  assert.ok(idioms.has(engine.state.attackWord));
  assert.ok(engine.state.specialMeaning.length > 0);
  const before = engine.state.bossHp;
  const { events } = engine.input(engine.state.attackWord);
  const hit = events.find((e) => e.type === 'hit');
  assert.ok(hit && hit.type === 'hit' && hit.special && hit.damage >= 24);
  assert.equal(engine.state.gauge, 0);
  assert.ok(engine.state.bossHp <= before - 24);
});

test('격투: 보스 체력이 0이 되면 승리, 점수는 스테이지 가중', () => {
  const engine = new TypingFightEngine({ ...FIGHT_BOSSES[2], hp: 1 }, () => 0.5);
  const { events } = engine.input(engine.state.attackWord);
  assert.ok(events.some((e) => e.type === 'won'));
  assert.equal(engine.state.status, 'won');
  assert.ok(fightScore(FIGHT_BOSSES[2], engine.state) >= 3000);
});

test('격투: 조합 중인 마지막 글자는 오타로 치지 않는다', () => {
  assert.equal(isWrongPrefix('사랑', '삵'), false);
  assert.equal(isWrongPrefix('사랑', '사락'), false);
  assert.equal(isWrongPrefix('사랑', '서랑'), true);
});

test('격투: 99초가 지나면 남은 체력 비율로 판정한다', () => {
  const engine = new TypingFightEngine({ ...FIGHT_BOSSES[0], hp: 1000, attackEvery: [999, 999] }, () => 0.5);
  engine.input(engine.state.attackWord);
  let events = [] as ReturnType<TypingFightEngine['tick']>;
  for (let i = 0; i < 1000 && engine.state.status === 'fighting'; i++) events = engine.tick(0.1);
  assert.equal(engine.state.status, 'won');
  assert.deepEqual(events.map((e) => e.type), ['timeUp', 'won']);
});

// ── 지식타자 데이터 ──
test('세계 수도: 국가 id 중복 없이 190개 이상', () => {
  const course = getJourneyCourse('world-capitals')!;
  const stations = getCourseStations(course);
  assert.ok(stations.length >= 190);
  assert.equal(new Set(stations.map((s) => s.id)).size, stations.length);
  assert.ok(stations.every((s) => s.fact && s.group));
});

test('사자성어: 100개 모두 네 글자·한자 네 자·뜻 포함, 이름 중복 없음', () => {
  assert.equal(SAJASEONGEO.length, 100);
  assert.equal(new Set(SAJASEONGEO.map((s) => s.name)).size, 100);
  for (const s of SAJASEONGEO) {
    assert.equal(Array.from(s.name).length, 4, s.name);
    assert.equal(Array.from(s.reading || '').length, 4, s.name);
    assert.ok(s.fact.length > 0 && s.detail);
  }
});

// ── 타자 레이스 ──
test('레이스: 글은 끊김 없이 이어 붙이면 원문과 같고, 한 편은 350~450타', () => {
  for (const p of RACE_PASSAGES) {
    const chunks = splitPassage(p.text);
    assert.equal(chunks.join(' '), p.text.replace(/\s+/g, ' ').trim(), p.id);
    assert.ok(chunks.every((c) => c.length <= 40), p.id);
    const d = passageDistance(chunks);
    assert.ok(d >= 350 && d <= 450, `${p.id} ${d}`);
  }
});

test('레이스: 조합 중인 글자는 봐주고, 오타는 null', () => {
  assert.ok((prefixStrokes('사랑', '사라') ?? 0) > 0); // ㅇ 받침 치기 전
  assert.ok((prefixStrokes('다리', '달') ?? 0) > 0); // ㄹ이 다음 글자로 넘어갈 예정
  assert.ok((prefixStrokes('과일', '고') ?? 0) > 0); // 겹모음 ㅘ 치는 중
  assert.ok((prefixStrokes('닭', '달') ?? 0) > 0); // 겹받침 ㄺ 치는 중
  assert.ok((prefixStrokes('사랑', 'ㅅ') ?? -1) >= 0); // 자음만 친 상태
  assert.equal(prefixStrokes('사랑', '서'), null);
  assert.equal(prefixStrokes('사랑', '사락'), null);
  assert.equal(prefixStrokes('다리', '닫'), null);
  assert.equal(matchedLength('비 오는 날', '비 오눈'), 3);
});

test('레이스: 랭킹 1~3위 유령 주자 — 이름·타수 반영, 비정상 기록 제외', () => {
  const g = ghostRunners([{ nickname: '아주아주긴닉네임입니다', score: 594 }, { nickname: null, score: 9999 }, { nickname: '솔미', score: 366 }, { nickname: 'x', score: 300 }]);
  assert.deepEqual(g.map((r) => r.cpm), [594, 366, 300]);
  assert.equal(g[0].name, '아주아주긴닉…');
  assert.ok(g.every((r) => r.cpm <= MAX_PLAUSIBLE_CPM));
  assert.equal(new Set(g.map((r) => r.lane)).size, 3);
});

test('레이스: 붙여넣기(한 번에 여러 글자)는 막고, 한글 조합 입력은 허용', () => {
  assert.equal(isBulkInsert('', '처음 달리기를 시작한 날'), true);
  assert.equal(isBulkInsert('처음', '처음 ㄷ'), false);
  assert.equal(isBulkInsert('처음 다', '처음 달'), false);
});
