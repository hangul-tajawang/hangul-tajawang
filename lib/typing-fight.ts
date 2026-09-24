/**
 * 타자 격투 — 보스와 1:1로 싸우는 타자 게임 엔진 (UI 무관 순수 로직).
 *
 * - 공격: 화면의 공격 단어를 정확히 치면 타수에 비례한 데미지.
 * - 필살기: 공격을 맞힐 때마다 게이지가 차고, 가득 차면 다음 공격 단어가 사자성어로 바뀐다.
 * - 방어: 보스가 공격 자세를 잡으면 방어 단어가 뜨고, 제한 시간 안에 쳐야 막는다.
 * - 난이도 = 스테이지(보스). 보스가 강할수록 체력·공격 빈도·방어 제한 시간이 빡빡해진다.
 *
 * 컴포넌트는 매 프레임 tick(dt)과 입력마다 input(value)을 부르고,
 * 반환된 이벤트로 이펙트(타격·피격·방어)를 그린다.
 */

import { getWordForLevel } from './game-words';
import { SAJASEONGEO } from './sajaseongeo-data';
import { TypingUtils } from './typing-speed';

export type FightCharacter = 'samurai' | 'huntress' | 'ronin' | 'knight' | 'kenji' | 'wizard';

export interface FightBoss {
  stage: number;
  name: string;
  title: string;
  /** 난이도 라벨 */
  grade: string;
  hp: number;
  /** 다음 공격까지 대기 시간 범위(초) */
  attackEvery: [number, number];
  /** 방어 단어 제한 시간(초) */
  window: number;
  /** 방어 실패 시 피해 */
  damage: number;
  /** 공격 단어 난이도 (game-words 레벨) */
  wordLevel: number;
  /** 방어 직후 연속 공격 확률 */
  doubleChance: number;
  /** 스프라이트 캐릭터 (lib/typing-fight-sprites.ts) */
  character: FightCharacter;
  /** 기본 키 대비 표시 배율 — 보스일수록 크게 */
  scale: number;
}

export const FIGHT_BOSSES: FightBoss[] = [
  { stage: 1, name: '창술사 하나', title: '숲의 파수꾼', grade: '입문', hp: 60, attackEvery: [6, 8], window: 3.2, damage: 10, wordLevel: 1, doubleChance: 0, character: 'huntress', scale: 1 },
  { stage: 2, name: '떠돌이 무사', title: '이름 없는 칼', grade: '초급', hp: 90, attackEvery: [5, 7], window: 2.8, damage: 12, wordLevel: 2, doubleChance: 0.1, character: 'ronin', scale: 1.05 },
  { stage: 3, name: '서리 기사', title: '얼음 성의 수호자', grade: '중급', hp: 120, attackEvery: [4.5, 6], window: 2.4, damage: 14, wordLevel: 3, doubleChance: 0.2, character: 'knight', scale: 1.1 },
  { stage: 4, name: '그림자 자객', title: '달빛 아래의 칼날', grade: '고급', hp: 160, attackEvery: [4, 5.5], window: 2.1, damage: 16, wordLevel: 5, doubleChance: 0.3, character: 'kenji', scale: 1.1 },
  { stage: 5, name: '타자 마왕', title: '자판의 지배자', grade: '마스터', hp: 210, attackEvery: [3.5, 5], window: 1.8, damage: 20, wordLevel: 7, doubleChance: 0.4, character: 'wizard', scale: 1.3 },
];

/** 라운드 제한 시간(초) — 끝나면 남은 체력 비율로 판정 */
export const ROUND_SECONDS = 99;

export const PLAYER_MAX_HP = 100;
const GAUGE_PER_HIT = 14;
const GAUGE_PER_BLOCK = 8;
/** 연속 공격의 두 번째 공격까지 간격(초) */
const DOUBLE_GAP = 0.7;

const DEFENSE_WORDS_EASY = ['막기', '방어', '가드', '피해', '막아', '숙여', '방패', '버텨'];
const DEFENSE_WORDS_HARD = ['철벽 방어', '몸을 숙여', '뒤로 피해', '방패 들어', '막고 버텨', '옆으로 굴러'];

export type FightEvent =
  | { type: 'hit'; damage: number; special: boolean; idiom?: { name: string; meaning: string } }
  | { type: 'windup' }
  | { type: 'block'; counter: number }
  | { type: 'hurt'; damage: number }
  | { type: 'mistake' }
  | { type: 'gaugeFull' }
  | { type: 'timeUp' }
  | { type: 'won' }
  | { type: 'lost' };

export interface FightDefense {
  word: string;
  remaining: number;
  total: number;
}

export interface FightState {
  status: 'fighting' | 'won' | 'lost';
  playerHp: number;
  bossHp: number;
  attackWord: string;
  nextWord: string;
  /** 현재 공격 단어가 필살기(사자성어)인지 */
  special: boolean;
  /** 필살기 사자성어의 뜻 — 공격 단어 아래에 보여준다 */
  specialMeaning: string;
  gauge: number;
  defense: FightDefense | null;
  combo: number;
  maxCombo: number;
  hits: number;
  blocks: number;
  mistakes: number;
  strokes: number;
  elapsed: number;
}

/** IME 조합 중인 마지막 글자는 봐주고, 그 앞이 접두어가 아니면 오타 */
export function isWrongPrefix(target: string, value: string): boolean {
  const t = TypingUtils.normalize(target);
  const v = TypingUtils.normalize(value);
  if (!v || t.startsWith(v)) return false;
  return !t.startsWith(v.slice(0, -1));
}

export function fightScore(boss: FightBoss, s: FightState): number {
  if (s.status === 'won') {
    return boss.stage * 1000 + s.playerHp * 10 + s.maxCombo * 20 + Math.max(0, Math.round((ROUND_SECONDS - s.elapsed) * 10));
  }
  return Math.round((boss.hp - s.bossHp) * 5 + s.maxCombo * 10);
}

export class TypingFightEngine {
  state: FightState;
  readonly boss: FightBoss;
  private random: () => number;
  private bossTimer: number;
  private pendingDouble = false;
  private wasWrong = false;
  private recentWords: string[] = [];

  constructor(boss: FightBoss, random: () => number = Math.random) {
    this.boss = boss;
    this.random = random;
    const first = this.pickWord();
    this.state = {
      status: 'fighting',
      playerHp: PLAYER_MAX_HP,
      bossHp: boss.hp,
      attackWord: first,
      nextWord: this.pickWord(),
      special: false,
      specialMeaning: '',
      gauge: 0,
      defense: null,
      combo: 0,
      maxCombo: 0,
      hits: 0,
      blocks: 0,
      mistakes: 0,
      strokes: 0,
      elapsed: 0,
    };
    // 첫 공격은 조금 늦게 — 손 풀 시간
    this.bossTimer = this.nextAttackDelay() + 1.5;
  }

  /** 지금 입력해야 하는 단어 (방어 중이면 방어 단어가 우선) */
  get target(): string {
    return this.state.defense ? this.state.defense.word : this.state.attackWord;
  }

  private nextAttackDelay() {
    const [min, max] = this.boss.attackEvery;
    return min + this.random() * (max - min);
  }

  private pickWord(): string {
    let word = getWordForLevel(this.boss.wordLevel);
    for (let i = 0; i < 8 && this.recentWords.includes(word); i++) word = getWordForLevel(this.boss.wordLevel);
    this.recentWords = [...this.recentWords.slice(-5), word];
    return word;
  }

  private pickDefenseWord(): string {
    const pool = this.boss.stage >= 4 && this.random() < 0.5 ? DEFENSE_WORDS_HARD : DEFENSE_WORDS_EASY;
    return pool[Math.floor(this.random() * pool.length)];
  }

  private startWindup(events: FightEvent[]) {
    const word = this.pickDefenseWord();
    // 긴 방어 단어는 제한 시간을 조금 늘려 준다
    const total = this.boss.window + (word.length > 3 ? 0.8 : 0);
    this.state = { ...this.state, defense: { word, remaining: total, total } };
    this.wasWrong = false;
    events.push({ type: 'windup' });
  }

  private afterDefense() {
    if (this.pendingDouble) {
      this.pendingDouble = false;
      this.bossTimer = DOUBLE_GAP;
    } else {
      this.pendingDouble = this.random() < this.boss.doubleChance;
      this.bossTimer = this.pendingDouble ? DOUBLE_GAP : this.nextAttackDelay();
    }
  }

  tick(dt: number): FightEvent[] {
    const events: FightEvent[] = [];
    if (this.state.status !== 'fighting') return events;
    this.state = { ...this.state, elapsed: this.state.elapsed + dt };

    if (this.state.elapsed >= ROUND_SECONDS) {
      // 시간 종료 — 남은 체력 비율이 높은 쪽이 승리 (같으면 도전자 패배)
      const won = this.state.playerHp / PLAYER_MAX_HP > this.state.bossHp / this.boss.hp;
      this.state = { ...this.state, elapsed: ROUND_SECONDS, defense: null, status: won ? 'won' : 'lost' };
      events.push({ type: 'timeUp' }, { type: won ? 'won' : 'lost' });
      return events;
    }

    const defense = this.state.defense;
    if (defense) {
      const remaining = defense.remaining - dt;
      if (remaining <= 0) {
        // 방어 실패 — 피해
        const playerHp = Math.max(0, this.state.playerHp - this.boss.damage);
        this.state = { ...this.state, playerHp, defense: null, combo: 0 };
        this.wasWrong = false;
        events.push({ type: 'hurt', damage: this.boss.damage });
        if (playerHp <= 0) {
          this.state = { ...this.state, status: 'lost' };
          events.push({ type: 'lost' });
          return events;
        }
        this.afterDefense();
      } else {
        this.state = { ...this.state, defense: { ...defense, remaining } };
      }
      return events;
    }

    this.bossTimer -= dt;
    if (this.bossTimer <= 0) this.startWindup(events);
    return events;
  }

  /**
   * 입력값 변화마다 호출. 목표 단어를 완성하면 true(입력창 비우기) + 이벤트.
   */
  input(value: string): { cleared: boolean; events: FightEvent[] } {
    const events: FightEvent[] = [];
    if (this.state.status !== 'fighting') return { cleared: false, events };
    const target = this.target;

    if (TypingUtils.normalize(value) === TypingUtils.normalize(target)) {
      this.wasWrong = false;
      const strokes = this.state.strokes + TypingUtils.getStrokeCount(target);
      if (this.state.defense) {
        // 방어 성공 + 소소한 반격
        const counter = 3;
        const bossHp = Math.max(0, this.state.bossHp - counter);
        const gauge = Math.min(100, this.state.gauge + GAUGE_PER_BLOCK);
        const combo = this.state.combo + 1;
        this.state = {
          ...this.state,
          defense: null,
          bossHp,
          gauge,
          strokes,
          combo,
          maxCombo: Math.max(this.state.maxCombo, combo),
          blocks: this.state.blocks + 1,
        };
        events.push({ type: 'block', counter });
        this.checkGauge(events);
        if (bossHp <= 0) this.win(events);
        else this.afterDefense();
        return { cleared: true, events };
      }

      const combo = this.state.combo + 1;
      const special = this.state.special;
      const damage = special
        ? Math.round(24 + TypingUtils.getStrokeCount(target) * 0.6)
        : Math.max(3, Math.round(TypingUtils.getStrokeCount(target) * 0.8 * (1 + Math.min(combo, 20) * 0.03)));
      const bossHp = Math.max(0, this.state.bossHp - damage);
      const idiom = special ? { name: target, meaning: this.state.specialMeaning } : undefined;
      const gauge = special ? 0 : Math.min(100, this.state.gauge + GAUGE_PER_HIT);
      this.state = {
        ...this.state,
        bossHp,
        gauge,
        strokes,
        combo,
        maxCombo: Math.max(this.state.maxCombo, combo),
        hits: this.state.hits + 1,
        attackWord: this.state.nextWord,
        nextWord: this.pickWord(),
        special: false,
        specialMeaning: '',
      };
      events.push({ type: 'hit', damage, special, idiom });
      if (bossHp <= 0) {
        this.win(events);
        return { cleared: true, events };
      }
      this.checkGauge(events);
      return { cleared: true, events };
    }

    const wrong = isWrongPrefix(target, value);
    if (wrong && !this.wasWrong) {
      this.state = { ...this.state, mistakes: this.state.mistakes + 1, combo: 0 };
      events.push({ type: 'mistake' });
    }
    this.wasWrong = wrong;
    return { cleared: false, events };
  }

  /** 게이지가 차면 다음 공격 단어를 사자성어로 교체 */
  private checkGauge(events: FightEvent[]) {
    if (this.state.gauge < 100 || this.state.special) return;
    const idiom = SAJASEONGEO[Math.floor(this.random() * SAJASEONGEO.length)];
    this.state = { ...this.state, attackWord: idiom.name, special: true, specialMeaning: idiom.fact };
    events.push({ type: 'gaugeFull' });
  }

  private win(events: FightEvent[]) {
    this.state = { ...this.state, status: 'won', defense: null };
    events.push({ type: 'won' });
  }
}

const CLEARED_KEY = 'typing_fight_cleared';

/** 깬 최고 스테이지 (없으면 0) */
export function loadClearedStage(): number {
  try {
    return Number(window.localStorage.getItem(CLEARED_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function saveClearedStage(stage: number) {
  try {
    if (stage > loadClearedStage()) window.localStorage.setItem(CLEARED_KEY, String(stage));
  } catch {
    /* ignore */
  }
}
