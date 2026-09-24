/**
 * 타자 레이스 — 경주 규칙 (UI 무관 순수 로직).
 *
 * 거리 단위는 "타(자소 타수)". 글 한 편(약 400타)을 끝까지 쓰면 결승선이고, 내가 친 타수만큼 앞으로 달리며,
 * 상대는 분당 타수(cpm)에 맞춰 일정하게 달린다 — 달팽이 200타 ~ 파랑새 750타.
 * 문장을 끝까지 치기 전에도 맞게 친 글자만큼은 미리 전진하고,
 * 오타가 나면 넘어져서 고칠 때까지 앞으로 가지 못한다.
 */

import { TypingUtils } from './typing-speed';


export interface RaceRunner {
  id: string;
  name: string;
  /** 미니맵 등 작은 아이콘용 */
  emoji: string;
  /** 분당 타수 */
  cpm: number;
  /** 트랙 레인 (0 = 가장 먼 레인 ~ RACE_LANES-1 = 가장 가까운 레인) */
  lane: number;
  color: string;
  /** 달리기 스프라이트 (가로 스트립) */
  sprite: string;
  frameW: number;
  frameH: number;
  frames: number;
  /** 원본이 왼쪽을 보고 있으면 true → 오른쪽으로 달리도록 뒤집는다 */
  flip: boolean;
  /** 하늘을 나는 캐릭터 (먼지 없음, 공중에 그림) */
  flying?: boolean;
}

const SPRITE = '/game/typing-race';

export const RACE_RUNNERS: RaceRunner[] = [
  { id: 'snail', name: '달팽이', emoji: '🐌', cpm: 200, lane: 7, color: '#f472b6', sprite: `${SPRITE}/snail-run.png`, frameW: 38, frameH: 24, frames: 10, flip: true },
  { id: 'bunny', name: '토끼', emoji: '🐰', cpm: 350, lane: 6, color: '#f9a8d4', sprite: `${SPRITE}/bunny-run.png`, frameW: 34, frameH: 44, frames: 12, flip: true },
  { id: 'rino', name: '코뿔소', emoji: '🦏', cpm: 500, lane: 1, color: '#cbd5e1', sprite: `${SPRITE}/rino-run.png`, frameW: 52, frameH: 34, frames: 6, flip: true },
  { id: 'bird', name: '파랑새', emoji: '🐦', cpm: 750, lane: 0, color: '#60a5fa', sprite: `${SPRITE}/bird-run.png`, frameW: 32, frameH: 32, frames: 9, flip: true, flying: true },
];

/** 레인 8개: 파랑새·코뿔소 / 랭킹 1·2위 / 나 / 랭킹 3위 / 토끼·달팽이 */
export const RACE_LANES = 8;
export const PLAYER_LANE = 4;

/** 경주 시작 시점의 랭킹 1~3위 — 그 사람의 기록 타수로 함께 달린다 */
const GHOST_STYLES = [
  { lane: 2, emoji: '🥇', color: '#facc15', sprite: `${SPRITE}/virtual-run.png` },
  { lane: 3, emoji: '🥈', color: '#e5e7eb', sprite: `${SPRITE}/pink-run.png` },
  { lane: 5, emoji: '🥉', color: '#fb923c', sprite: `${SPRITE}/mask-run.png` },
];
/** 비정상 기록(매크로 등)이 유령 주자로 순간이동하지 않도록 상한 */
export const MAX_PLAUSIBLE_CPM = 1500;

export function ghostRunners(top: { nickname?: string | null; score: number }[]): RaceRunner[] {
  return top
    .filter((r) => r.score > 0 && r.score <= MAX_PLAUSIBLE_CPM)
    .slice(0, 3)
    .map((r, i) => {
      const name = (r.nickname || '익명').trim();
      return {
        id: `rank${i + 1}`,
        name: name.length > 6 ? `${name.slice(0, 6)}…` : name,
        emoji: GHOST_STYLES[i].emoji,
        cpm: Math.round(r.score),
        lane: GHOST_STYLES[i].lane,
        color: GHOST_STYLES[i].color,
        sprite: GHOST_STYLES[i].sprite,
        frameW: 32,
        frameH: 32,
        frames: 12,
        flip: false,
      };
    });
}

/**
 * 붙여넣기·자동완성처럼 한 번에 여러 글자가 들어온 입력인지.
 * 한글 IME는 한 번의 입력 이벤트에 많아야 1~2글자(조합 확정 + 새 글자)를 바꾸므로,
 * 이전 값보다 3글자 넘게 늘어나면 사람의 타이핑이 아니라고 본다.
 */
export function isBulkInsert(prev: string, next: string): boolean {
  return next.length - prev.length > 3;
}
export const PLAYER_SPRITES = {
  run: { src: `${SPRITE}/frog-run.png`, frames: 12 },
  hit: { src: `${SPRITE}/frog-hit.png`, frames: 7 },
  idle: { src: `${SPRITE}/frog-idle.png`, frames: 11 },
} as const;
export const PLAYER_FRAME = 32;

/** 경주용 글 — 끊기지 않는 짧은 수필 한 편을 끝까지 쓰면 결승선 (오리지널 창작) */
export const RACE_PASSAGES: { id: string; title: string; text: string }[] = [
  {
    id: 'first-run',
    title: '첫 달리기',
    text: '처음 달리기를 시작한 날, 나는 동네 공원 한 바퀴도 채우지 못하고 벤치에 주저앉았다. 숨이 턱까지 차올랐고 다리는 내 것이 아닌 것처럼 무거웠다. 그래도 다음 날 다시 운동화 끈을 묶었다. 어제보다 딱 백 걸음만 더 가 보자고 마음먹었다. 그렇게 한 달이 지나자 공원 세 바퀴가 가뿐해졌다. 빨리 달리는 법보다 멈추지 않는 법을 먼저 배운 셈이다.',
  },
  {
    id: 'kkachi',
    title: '까치밥',
    text: '할머니 댁 마당에는 커다란 감나무가 한 그루 있다. 가을이 오면 가지마다 주황빛 감이 등불처럼 매달린다. 할머니는 꼭대기의 감 몇 개는 따지 않고 남겨 두신다. 겨울을 나는 까치들의 몫이라고 하셨다. 어릴 때는 그 감이 아까웠는데, 이제는 조금 알 것 같다. 가진 것을 전부 거두지 않고 남겨 두는 마음이 결국 나를 더 넉넉하게 만든다는 것을.',
  },
  {
    id: 'hangul',
    title: '스물여덟 글자',
    text: '세종대왕은 백성들이 글을 몰라 억울한 일을 당해도 제 뜻을 펴지 못하는 것을 안타깝게 여겼다. 그래서 누구나 쉽게 익혀 날마다 편히 쓸 수 있는 스물여덟 글자를 만들었다. 소리가 나는 모양을 본떠 만든 글자라서 원리만 알면 하루 만에도 읽을 수 있다. 오늘 우리가 자판 위에서 이렇게 빠르게 글을 쓸 수 있는 것도 그 오래된 배려 덕분이다.',
  },
  {
    id: 'rainy-stop',
    title: '비 오는 정류장',
    text: '비 오는 날의 버스 정류장은 조용한 무대 같다. 우산을 접는 소리, 젖은 신발이 바닥을 두드리는 소리, 멀리서 들려오는 빗방울의 박자가 한데 섞인다. 사람들은 저마다 다른 곳을 바라보지만 같은 버스를 기다린다. 버스가 도착하면 무대는 순식간에 비워지고, 남은 빗소리만 다음 손님을 기다린다. 나는 그 짧은 막간이 이상하게 좋다.',
  },
  {
    id: 'sorry',
    title: '미안하다는 한마디',
    text: '친구와 크게 다툰 날, 나는 먼저 연락하지 않겠다고 다짐했다. 하루가 지나고 이틀이 지나도 휴대폰 화면은 조용했다. 사흘째 되던 밤, 결국 짧은 문자를 보냈다. 미안하다는 한마디였다. 답장은 일 분도 걸리지 않았다. 나도 계속 보내려다 지웠다는 말과 함께였다. 자존심을 지키느라 흘려보낸 사흘이 그제야 조금 아깝게 느껴졌다.',
  },
  {
    id: 'flowerpot',
    title: '창가의 화분',
    text: '작은 화분 하나를 창가에 들였다. 처음 몇 주는 아무 변화도 없어서 괜히 샀나 싶었다. 그래도 매일 아침 물을 주고 햇빛이 드는 쪽으로 방향을 돌려 주었다. 어느 날 흙 사이로 연둣빛 새싹이 고개를 내밀었다. 눈에 보이지 않을 때에도 뿌리는 쉬지 않고 자라고 있었던 것이다. 요즘은 조급해질 때마다 그 화분을 바라본다.',
  },
];

/** 입력 단위로 자르기 — 문장 끝(. ! ?) 기준, 34자가 넘는 문장은 가운데에 가까운 쉼표(없으면 띄어쓰기)에서 나눈다 */
export function splitPassage(text: string): string[] {
  const out: string[] = [];
  const push = (s: string) => {
    if (s.length <= 34) {
      out.push(s);
      return;
    }
    const mid = s.length / 2;
    const near = (re: RegExp) => {
      let best = -1;
      for (const m of s.matchAll(re)) {
        const i = m.index ?? -1;
        if (best < 0 || Math.abs(i - mid) < Math.abs(best - mid)) best = i;
      }
      return best;
    };
    const comma = near(/, /g);
    const at = comma > s.length * 0.25 && comma < s.length * 0.75 ? comma + 1 : near(/ /g);
    push(s.slice(0, at).trim());
    push(s.slice(at).trim());
  };
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const s = sentence.trim();
    if (s) push(s);
  }
  return out;
}

/** 글 한 편의 전체 거리(타) = 입력 단위들의 타수 합 */
export function passageDistance(chunks: string[]): number {
  return chunks.reduce((sum, c) => sum + TypingUtils.getStrokeCount(TypingUtils.normalize(c)), 0);
}

export function pickPassage(avoidId?: string, random: () => number = Math.random) {
  const pool = RACE_PASSAGES.filter((p) => p.id !== avoidId);
  return pool[Math.floor(random() * pool.length)];
}

const JUNG_PREFIX: Record<number, number[]> = {
  // 겹모음은 앞 모음까지만 친 상태를 허용 (ㅗ→ㅘㅙㅚ, ㅜ→ㅝㅞㅟ, ㅡ→ㅢ)
  8: [9, 10, 11],
  13: [14, 15, 16],
  18: [19],
};
// 종성 인덱스 → 초성 인덱스 (받침이 다음 글자 초성으로 넘어가는 중인지 판정)
const JONG_TO_CHO: Record<number, number> = { 1: 0, 2: 1, 4: 2, 7: 3, 8: 5, 16: 6, 17: 7, 19: 9, 20: 10, 21: 11, 22: 12, 23: 14, 24: 15, 25: 16, 26: 17, 27: 18 };
// 겹받침 → 첫 받침 (ㄺ을 치는 중에는 ㄹ까지만 쳐진 상태)
const JONG_FIRST: Record<number, number> = { 3: 1, 5: 4, 6: 4, 9: 8, 10: 8, 11: 8, 12: 8, 13: 8, 14: 8, 15: 8, 18: 17 };
// 호환 자모(ㄱ~ㅎ) → 초성 인덱스
const COMPAT_CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';

function split(ch: string): [number, number, number] | null {
  const code = ch.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;
  return [Math.floor(code / 588), Math.floor((code % 588) / 28), code % 28];
}

/** last(조합 중일 수 있는 마지막 글자)를 이어서 치면 expected가 될 수 있는가 */
function canComposeInto(last: string, expected: string, after: string): boolean {
  if (last === expected) return true;
  const e = split(expected);
  if (!e) return false;
  const cho = COMPAT_CHO.indexOf(last);
  if (cho >= 0) return cho === e[0]; // 자음만 친 상태
  const l = split(last);
  if (!l || l[0] !== e[0]) return false;
  if (l[1] !== e[1]) return l[2] === 0 && (JUNG_PREFIX[l[1]] || []).includes(e[1]);
  if (l[2] === 0) return true;
  if (l[2] === e[2] || JONG_FIRST[e[2]] === l[2]) return true;
  // "다리"를 치다 "달"이 된 상태 — 받침이 다음 글자 초성으로 넘어갈 예정
  const n = split(after);
  return e[2] === 0 && !!n && JONG_TO_CHO[l[2]] === n[0];
}

/**
 * 입력 중인 값이 목표 문장의 올바른 앞부분이면 그만큼의 타수, 틀렸으면 null.
 * 마지막 글자는 IME 조합 중일 수 있어("사랑" 입력 중 "사라", "다리" 입력 중 "달")
 * 자모를 풀어 이어서 치면 목표 글자가 될 수 있을 때만 인정한다.
 */
export function prefixStrokes(target: string, value: string): number | null {
  const t = TypingUtils.normalize(target);
  const v = TypingUtils.normalize(value);
  if (!v) return 0;
  if (t.startsWith(v)) return TypingUtils.getStrokeCount(v);
  const head = v.slice(0, -1);
  if (!t.startsWith(head) || head.length >= t.length) return null;
  const last = v.slice(-1);
  const expected = t.charAt(head.length);
  if (!canComposeInto(last, expected, t.charAt(head.length + 1))) return null;
  return TypingUtils.getStrokeCount(head) + Math.min(TypingUtils.getStrokeCount(last), TypingUtils.getStrokeCount(expected) - 1);
}

/** 앞에서부터 목표와 일치하는 글자 수 (오타 위치 표시용) */
export function matchedLength(target: string, value: string): number {
  const t = TypingUtils.normalize(target);
  const v = TypingUtils.normalize(value);
  let i = 0;
  while (i < v.length && i < t.length && v[i] === t[i]) i++;
  return i;
}

/** 상대 한 명의 dt초 뒤 위치 (±8% 속도 흔들림) */
export function stepRunner(dist: number, cpm: number, dt: number, jitter: number): number {
  return dist + (cpm / 60) * dt * jitter;
}

/** 지금 내 순위 — 나보다 앞선 상대 수 + 1 */
export function livePlace(myDist: number, runnerDists: number[]): number {
  return 1 + runnerDists.filter((d) => d > myDist).length;
}
