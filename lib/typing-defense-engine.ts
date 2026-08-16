import { EASY_WORDS, HARD_WORDS, IDIOMS, MEDIUM_WORDS, getWordForLevel } from "./game-words";

// ── 튜닝 상수 ─────────────────────────────────────────────
export const TYPING_DEFENSE_BASE_GATE_HEALTH = 10;
export const TYPING_DEFENSE_LANE_COUNT = 3;
export const TYPING_DEFENSE_MAX_ENEMIES = 8;
export const TYPING_DEFENSE_BOSS_EVERY = 5; // 5웨이브마다 보스

// 하위호환용 별칭 (기존 import 유지)
export const TYPING_DEFENSE_MAX_GATE_HEALTH = TYPING_DEFENSE_BASE_GATE_HEALTH;

export const TYPING_DEFENSE_SKILLS = ["번개", "방패", "수리"] as const;
export type TypingDefenseSkill = (typeof TYPING_DEFENSE_SKILLS)[number];

const BASE_SKILL_COOLDOWN_MS: Record<TypingDefenseSkill, number> = {
  번개: 12000,
  방패: 9000,
  수리: 14000,
};

export const ENEMY_VARIANTS = ["red", "purple", "black"] as const;
export type EnemyVariant = (typeof ENEMY_VARIANTS)[number];

export type EnemyKind = "normal" | "runner" | "shield" | "splitter" | "boss";

export enum TypingDefenseCommandResult {
  Hit = "hit",
  Guarded = "guarded",
  AreaHit = "areaHit",
  Repaired = "repaired",
  Invalid = "invalid",
  Unavailable = "unavailable",
}

export type EnemyState = "march" | "dying";

export interface TypingDefenseEnemy {
  id: number;
  lane: number;
  distance: number; // 1 → 0
  speed: number;
  word: string;
  variant: EnemyVariant;
  state: EnemyState;
  kind: EnemyKind;
  hp: number; // 남은 타수 (일반 1, 방패병 2, 보스 N)
  maxHp: number;
  gateDamage: number; // 성문 도달 시 피해량
}

export type SubmitKind = "fire" | "skill" | "miss";

export interface SubmitOutcome {
  kind: SubmitKind;
  result: TypingDefenseCommandResult;
  targetId: number | null;
  lane: number | null;
  gainedScore: number;
  word: string | null;
  skill: TypingDefenseSkill | null;
  killed: boolean; // fire 시 실제 격파 여부 (보스·방패병은 여러 번 쳐야 함)
}

export interface PrefixMatch {
  targetId: number | null;
  word: string | null;
  exact: boolean;
}

export type WavePhase = "spawning" | "intermission" | "finished";

// ── 업그레이드 ────────────────────────────────────────────
export type UpgradeId = "gate" | "combo" | "cooldown" | "pierce" | "shield" | "autorepair";
export interface UpgradeOption {
  id: UpgradeId;
  title: string;
  desc: string;
}
const UPGRADE_POOL: UpgradeOption[] = [
  { id: "gate", title: "성문 보강", desc: "성문 최대 체력 +2, 즉시 +2 회복" },
  { id: "combo", title: "콤보 마스터", desc: "콤보 점수 배율 +25%" },
  { id: "cooldown", title: "쾌속 재정비", desc: "스킬 쿨다운 20% 감소" },
  { id: "pierce", title: "관통 화살", desc: "격파 시 같은 라인 뒤 적도 1대 타격" },
  { id: "shield", title: "단단한 방패", desc: "방패 최대치 +1, 방패 스킬 획득 +1" },
  { id: "autorepair", title: "자동 수리반", desc: "웨이브 클리어마다 성문 +2 회복" },
];

export interface TypingDefenseState {
  enemies: TypingDefenseEnemy[];
  gateHealth: number;
  maxGateHealth: number;
  shieldCount: number;
  score: number;
  kills: number;
  combo: number;
  bestCombo: number;
  mistakes: number;
  wave: number;
  wavePhase: WavePhase;
  waveEnemiesRemaining: number;
  isBossWave: boolean;
  bossActive: boolean;
  upgradeChoices: UpgradeOption[]; // 인터미션 중 3개 제시, 선택 시까지 다음 웨이브 대기
  skillCooldowns: Record<TypingDefenseSkill, number>;
  isRunning: boolean;
  isFinished: boolean;
  elapsedMs: number;
}

interface AddEnemyOptions {
  lane: number;
  distance: number;
  speed?: number;
  word?: string;
  variant?: EnemyVariant;
  kind?: EnemyKind;
  hp?: number;
}

const BASE_SPAWN_INTERVAL_MS = 1800;

export class TypingDefenseEngine {
  private enemies: TypingDefenseEnemy[] = [];
  private nextEnemyId = 0;
  private gateHealth = TYPING_DEFENSE_BASE_GATE_HEALTH;
  private maxGateHealth = TYPING_DEFENSE_BASE_GATE_HEALTH;
  private shieldCount = 0;
  private score = 0;
  private kills = 0;
  private combo = 0;
  private bestCombo = 0;
  private mistakes = 0;
  private wave = 0;
  private wavePhase: WavePhase = "spawning";
  private waveEnemiesRemaining = 0;
  private isBossWave = false;
  private bossSpawned = false;
  private upgradeChoices: UpgradeOption[] = [];
  private skillCooldowns: Record<TypingDefenseSkill, number> = { 번개: 0, 방패: 0, 수리: 0 };
  private isRunning = false;
  private isFinished = false;
  private elapsedMs = 0;
  private spawnAccumulatorMs = 0;
  private spawnIntervalMs = BASE_SPAWN_INTERVAL_MS;

  // 업그레이드 효과
  private comboMultiplier = 1;
  private cooldownScale = 1;
  private pierce = 0;
  private shieldMax = 3;
  private shieldGain = 1;
  private autoRepair = 0;

  private readonly random: () => number;

  constructor(random: () => number = Math.random) {
    this.random = random;
  }

  get state(): TypingDefenseState {
    return {
      enemies: this.enemies.map((enemy) => ({ ...enemy })),
      gateHealth: this.gateHealth,
      maxGateHealth: this.maxGateHealth,
      shieldCount: this.shieldCount,
      score: this.score,
      kills: this.kills,
      combo: this.combo,
      bestCombo: this.bestCombo,
      mistakes: this.mistakes,
      wave: this.wave,
      wavePhase: this.wavePhase,
      waveEnemiesRemaining: this.waveEnemiesRemaining,
      isBossWave: this.isBossWave,
      bossActive: this.enemies.some((e) => e.kind === "boss"),
      upgradeChoices: this.upgradeChoices.map((u) => ({ ...u })),
      skillCooldowns: {
        번개: Math.max(0, Math.round(this.skillCooldowns.번개)),
        방패: Math.max(0, Math.round(this.skillCooldowns.방패)),
        수리: Math.max(0, Math.round(this.skillCooldowns.수리)),
      },
      isRunning: this.isRunning,
      isFinished: this.isFinished,
      elapsedMs: Math.round(this.elapsedMs),
    };
  }

  start() {
    this.enemies = [];
    this.nextEnemyId = 0;
    this.maxGateHealth = TYPING_DEFENSE_BASE_GATE_HEALTH;
    this.gateHealth = TYPING_DEFENSE_BASE_GATE_HEALTH;
    this.shieldCount = 0;
    this.score = 0;
    this.kills = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.mistakes = 0;
    this.wave = 0;
    this.upgradeChoices = [];
    this.skillCooldowns = { 번개: 0, 방패: 0, 수리: 0 };
    this.isRunning = true;
    this.isFinished = false;
    this.elapsedMs = 0;
    this.spawnAccumulatorMs = 0;
    this.comboMultiplier = 1;
    this.cooldownScale = 1;
    this.pierce = 0;
    this.shieldMax = 3;
    this.shieldGain = 1;
    this.autoRepair = 0;
    this.beginWave(1);
  }

  // ── 웨이브 ─────────────────────────────────────────────
  private beginWave(wave: number) {
    this.wave = wave;
    this.wavePhase = "spawning";
    this.isBossWave = wave % TYPING_DEFENSE_BOSS_EVERY === 0;
    this.bossSpawned = false;
    this.upgradeChoices = [];
    if (this.isBossWave) {
      this.waveEnemiesRemaining = 3 + Math.floor(wave / TYPING_DEFENSE_BOSS_EVERY); // 보스 + 소수 잡몹
    } else {
      this.waveEnemiesRemaining = 4 + wave * 2;
    }
    this.spawnIntervalMs = Math.max(650, BASE_SPAWN_INTERVAL_MS - (wave - 1) * 150);
    this.spawnAccumulatorMs = this.spawnIntervalMs; // 시작 시 즉시 첫 스폰
  }

  private levelForWave(): number {
    return this.wave <= 2 ? 1 : this.wave <= 4 ? 3 : this.wave <= 6 ? 5 : 7;
  }

  private enemySpeedForWave(): number {
    const base = 0.05 + (this.wave - 1) * 0.006;
    const jitter = this.random() * 0.012;
    return Math.min(0.14, base + jitter);
  }

  private pickUniqueWord(pool: readonly string[]): string {
    const used = new Set(this.enemies.map((enemy) => enemy.word));
    const reserved = new Set<string>(TYPING_DEFENSE_SKILLS);
    for (let attempt = 0; attempt < 30; attempt++) {
      const candidate = pool[Math.floor(this.random() * pool.length)];
      if (!used.has(candidate) && !reserved.has(candidate)) return candidate;
    }
    return `${pool[0]}${this.nextEnemyId}`;
  }

  private wordForLevelUnique(): string {
    const used = new Set(this.enemies.map((enemy) => enemy.word));
    const reserved = new Set<string>(TYPING_DEFENSE_SKILLS);
    const level = this.levelForWave();
    for (let attempt = 0; attempt < 30; attempt++) {
      const candidate = getWordForLevel(level);
      if (!used.has(candidate) && !reserved.has(candidate)) return candidate;
    }
    return `${getWordForLevel(level)}${this.nextEnemyId}`;
  }

  // 다음 스폰 적의 종류를 웨이브 기반으로 결정
  private chooseKind(): EnemyKind {
    if (this.isBossWave) return this.random() < 0.5 ? "runner" : "normal"; // 잡몹은 단순
    const r = this.random();
    let runner = 0,
      shield = 0,
      splitter = 0;
    if (this.wave >= 2) runner = 0.2;
    if (this.wave >= 3) shield = 0.15;
    if (this.wave >= 4) splitter = 0.1;
    if (r < runner) return "runner";
    if (r < runner + shield) return "shield";
    if (r < runner + shield + splitter) return "splitter";
    return "normal";
  }

  private makeEnemy(kind: EnemyKind, lane: number, distance: number): TypingDefenseEnemy {
    const variant = ENEMY_VARIANTS[Math.floor(this.random() * ENEMY_VARIANTS.length)];
    let speed = this.enemySpeedForWave();
    let word: string;
    let hp = 1;
    let gateDamage = 1;
    switch (kind) {
      case "runner":
        speed *= 1.7;
        word = this.pickUniqueWord(EASY_WORDS);
        break;
      case "shield":
        speed *= 0.85;
        word = this.pickUniqueWord(MEDIUM_WORDS);
        hp = 2;
        break;
      case "splitter":
        word = this.pickUniqueWord(MEDIUM_WORDS);
        break;
      case "boss": {
        speed = 0.03 + Math.floor(this.wave / TYPING_DEFENSE_BOSS_EVERY) * 0.004;
        word = this.pickUniqueWord(this.random() < 0.5 ? HARD_WORDS : IDIOMS);
        hp = 3 + Math.floor(this.wave / TYPING_DEFENSE_BOSS_EVERY);
        gateDamage = 3;
        break;
      }
      default:
        word = this.wordForLevelUnique();
    }
    return { id: this.nextEnemyId++, lane, distance, speed, word, variant, state: "march", kind, hp, maxHp: hp, gateDamage };
  }

  spawnEnemy() {
    if (!this.isRunning || this.isFinished) return;
    if (this.enemies.filter((e) => e.state === "march").length >= TYPING_DEFENSE_MAX_ENEMIES) return;
    if (this.waveEnemiesRemaining <= 0) return;

    let kind: EnemyKind;
    if (this.isBossWave && !this.bossSpawned) {
      kind = "boss";
      this.bossSpawned = true;
    } else {
      kind = this.chooseKind();
    }
    const lane = Math.floor(this.random() * TYPING_DEFENSE_LANE_COUNT);
    this.enemies.push(this.makeEnemy(kind, lane, 1));
    this.waveEnemiesRemaining--;
  }

  addEnemyForTest({ lane, distance, speed = 0.08, word = "테스트", variant = "red", kind = "normal", hp }: AddEnemyOptions) {
    const resolvedHp = hp ?? (kind === "shield" ? 2 : kind === "boss" ? 4 : 1);
    this.enemies.push({
      id: this.nextEnemyId++,
      lane,
      distance,
      speed,
      word,
      variant,
      state: "march",
      kind,
      hp: resolvedHp,
      maxHp: resolvedHp,
      gateDamage: kind === "boss" ? 3 : 1,
    });
  }

  // ── 프레임 ─────────────────────────────────────────────
  tick(dtMs: number) {
    if (!this.isRunning || this.isFinished) return;
    const dt = Math.max(0, dtMs);
    this.elapsedMs += dt;

    for (const skill of TYPING_DEFENSE_SKILLS) {
      if (this.skillCooldowns[skill] > 0) this.skillCooldowns[skill] = Math.max(0, this.skillCooldowns[skill] - dt);
    }

    // 인터미션: 업그레이드 선택 대기 (자동 진행하지 않음)
    if (this.wavePhase === "intermission") return;

    if (this.wavePhase === "spawning" && this.waveEnemiesRemaining > 0) {
      this.spawnAccumulatorMs += dt;
      while (this.spawnAccumulatorMs >= this.spawnIntervalMs && this.waveEnemiesRemaining > 0) {
        this.spawnAccumulatorMs -= this.spawnIntervalMs;
        this.spawnEnemy();
      }
    }

    const dtSec = dt / 1000;
    const survivors: TypingDefenseEnemy[] = [];
    for (const enemy of this.enemies) {
      if (enemy.state === "dying") continue;
      const nextDistance = enemy.distance - enemy.speed * dtSec;
      if (nextDistance <= 0) {
        this.damageGate(enemy.gateDamage);
      } else {
        survivors.push({ ...enemy, distance: nextDistance });
      }
    }
    this.enemies = survivors;

    if (this.gateHealth <= 0) {
      this.isRunning = false;
      this.isFinished = true;
      this.wavePhase = "finished";
      return;
    }

    // 웨이브 클리어 → 인터미션 + 업그레이드 3선 제시
    if (this.wavePhase === "spawning" && this.waveEnemiesRemaining <= 0 && this.enemies.length === 0) {
      this.wavePhase = "intermission";
      this.score += 200 + this.wave * 50;
      if (this.autoRepair > 0) this.gateHealth = Math.min(this.maxGateHealth, this.gateHealth + this.autoRepair);
      this.upgradeChoices = this.rollUpgrades();
    }
  }

  private rollUpgrades(): UpgradeOption[] {
    const pool = [...UPGRADE_POOL];
    const picks: UpgradeOption[] = [];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
      const idx = Math.floor(this.random() * pool.length);
      picks.push(pool.splice(idx, 1)[0]);
    }
    return picks;
  }

  // 업그레이드 선택 → 효과 적용 후 다음 웨이브 시작
  applyUpgrade(id: UpgradeId) {
    if (this.wavePhase !== "intermission") return;
    switch (id) {
      case "gate":
        this.maxGateHealth += 2;
        this.gateHealth = Math.min(this.maxGateHealth, this.gateHealth + 2);
        break;
      case "combo":
        this.comboMultiplier += 0.25;
        break;
      case "cooldown":
        this.cooldownScale = Math.max(0.3, this.cooldownScale - 0.2);
        break;
      case "pierce":
        this.pierce += 1;
        break;
      case "shield":
        this.shieldMax += 1;
        this.shieldGain += 1;
        break;
      case "autorepair":
        this.autoRepair += 2;
        break;
    }
    this.upgradeChoices = [];
    this.beginWave(this.wave + 1);
  }

  // ── 입력 ───────────────────────────────────────────────
  matchPrefix(rawInput: string): PrefixMatch {
    const input = rawInput.trim();
    if (!input) return { targetId: null, word: null, exact: false };
    let target: TypingDefenseEnemy | null = null;
    for (const enemy of this.enemies) {
      if (enemy.state !== "march") continue;
      if (!enemy.word.startsWith(input)) continue;
      if (!target || enemy.distance < target.distance) target = enemy;
    }
    if (!target) return { targetId: null, word: null, exact: false };
    return { targetId: target.id, word: target.word, exact: target.word === input };
  }

  submitInput(rawInput: string): SubmitOutcome {
    const input = rawInput.trim();
    if (!this.isRunning || this.isFinished || !input) return this.miss(TypingDefenseCommandResult.Unavailable);
    if ((TYPING_DEFENSE_SKILLS as readonly string[]).includes(input)) return this.useSkill(input as TypingDefenseSkill);
    const match = this.matchPrefix(input);
    if (match.exact && match.targetId !== null) return this.fireAt(match.targetId);
    return this.miss(TypingDefenseCommandResult.Invalid);
  }

  fireAt(id: number): SubmitOutcome {
    const enemy = this.enemies.find((e) => e.id === id && e.state === "march");
    if (!enemy) return this.miss(TypingDefenseCommandResult.Invalid);

    const typedWord = enemy.word;
    enemy.hp -= 1;

    if (enemy.hp > 0) {
      // 아직 살아있음(보스·방패병): 새 단어 배정, 콤보만 소폭 유지
      enemy.word = this.rerollWord(enemy);
      this.combo++;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      const gained = Math.round(20 * this.comboMultiplier);
      this.score += gained;
      return { kind: "fire", result: TypingDefenseCommandResult.Hit, targetId: id, lane: enemy.lane, gainedScore: gained, word: typedWord, skill: null, killed: false };
    }

    // 격파
    this.enemies = this.enemies.filter((e) => e.id !== id);
    let gained = this.recordKill(enemy.kind === "boss" ? 300 : 100, typedWord.length);

    if (enemy.kind === "splitter") this.spawnSplit(enemy);
    if (this.pierce > 0) gained += this.applyPierce(enemy.lane, enemy.distance, this.pierce);

    return { kind: "fire", result: TypingDefenseCommandResult.Hit, targetId: id, lane: enemy.lane, gainedScore: gained, word: typedWord, skill: null, killed: true };
  }

  private rerollWord(enemy: TypingDefenseEnemy): string {
    if (enemy.kind === "boss") return this.pickUniqueWord(this.random() < 0.5 ? HARD_WORDS : IDIOMS);
    if (enemy.kind === "shield") return this.pickUniqueWord(MEDIUM_WORDS);
    return this.wordForLevelUnique();
  }

  private spawnSplit(parent: TypingDefenseEnemy) {
    for (let i = 0; i < 2; i++) {
      if (this.enemies.filter((e) => e.state === "march").length >= TYPING_DEFENSE_MAX_ENEMIES) break;
      const lane = Math.min(TYPING_DEFENSE_LANE_COUNT - 1, Math.max(0, parent.lane + (i === 0 ? -1 : 1)));
      const child = this.makeEnemy("normal", lane, Math.min(1, parent.distance + 0.06));
      child.speed = parent.speed * 1.1;
      child.word = this.wordForLevelUnique();
      this.enemies.push(child);
    }
  }

  // 같은 라인에서 기준 거리보다 먼(뒤쪽) 가장 가까운 적을 관통 타격
  private applyPierce(lane: number, fromDistance: number, hits: number): number {
    let gained = 0;
    let remaining = hits;
    while (remaining > 0) {
      const candidates = this.enemies.filter((e) => e.lane === lane && e.state === "march" && e.distance > fromDistance);
      if (candidates.length === 0) break;
      candidates.sort((a, b) => a.distance - b.distance);
      const t = candidates[0];
      t.hp -= 1;
      if (t.hp <= 0) {
        this.enemies = this.enemies.filter((e) => e.id !== t.id);
        gained += this.recordKill(60, t.word.length);
        if (t.kind === "splitter") this.spawnSplit(t);
      } else {
        t.word = this.rerollWord(t);
      }
      fromDistance = t.distance;
      remaining--;
    }
    return gained;
  }

  useSkill(name: TypingDefenseSkill): SubmitOutcome {
    if (!this.isRunning || this.isFinished) return this.miss(TypingDefenseCommandResult.Unavailable);
    if (this.skillCooldowns[name] > 0) {
      return { kind: "skill", result: TypingDefenseCommandResult.Unavailable, targetId: null, lane: null, gainedScore: 0, word: null, skill: name, killed: false };
    }
    switch (name) {
      case "방패":
        this.shieldCount = Math.min(this.shieldMax, this.shieldCount + this.shieldGain);
        this.score += 30;
        this.skillCooldowns.방패 = BASE_SKILL_COOLDOWN_MS.방패 * this.cooldownScale;
        return { kind: "skill", result: TypingDefenseCommandResult.Guarded, targetId: null, lane: null, gainedScore: 30, word: null, skill: name, killed: false };
      case "수리": {
        if (this.gateHealth >= this.maxGateHealth) {
          return { kind: "skill", result: TypingDefenseCommandResult.Unavailable, targetId: null, lane: null, gainedScore: 0, word: null, skill: name, killed: false };
        }
        this.gateHealth = Math.min(this.maxGateHealth, this.gateHealth + 2);
        this.score += 50;
        this.skillCooldowns.수리 = BASE_SKILL_COOLDOWN_MS.수리 * this.cooldownScale;
        return { kind: "skill", result: TypingDefenseCommandResult.Repaired, targetId: null, lane: null, gainedScore: 50, word: null, skill: name, killed: false };
      }
      case "번개": {
        const lane = this.busiestLane();
        this.skillCooldowns.번개 = BASE_SKILL_COOLDOWN_MS.번개 * this.cooldownScale;
        if (lane === null) return { kind: "skill", result: TypingDefenseCommandResult.AreaHit, targetId: null, lane: null, gainedScore: 0, word: null, skill: name, killed: false };
        // 번개는 보스를 즉사시키지 않고 크게 타격(3), 나머지는 제거
        let gained = 0;
        const remain: TypingDefenseEnemy[] = [];
        for (const e of this.enemies) {
          if (e.lane !== lane) {
            remain.push(e);
            continue;
          }
          if (e.kind === "boss") {
            e.hp = Math.max(1, e.hp - 3);
            e.word = this.rerollWord(e);
            remain.push(e);
          } else {
            gained += this.recordKill(60, e.word.length);
            if (e.kind === "splitter") this.spawnSplit(e);
          }
        }
        this.enemies = remain;
        return { kind: "skill", result: TypingDefenseCommandResult.AreaHit, targetId: null, lane, gainedScore: gained, word: null, skill: name, killed: false };
      }
    }
  }

  private busiestLane(): number | null {
    if (this.enemies.length === 0) return null;
    const counts = new Array(TYPING_DEFENSE_LANE_COUNT).fill(0);
    for (const enemy of this.enemies) counts[enemy.lane]++;
    let lane = 0;
    for (let i = 1; i < counts.length; i++) if (counts[i] > counts[lane]) lane = i;
    return counts[lane] > 0 ? lane : null;
  }

  private damageGate(amount: number) {
    let dmg = amount;
    while (dmg > 0 && this.shieldCount > 0) {
      this.shieldCount--;
      this.score += 20;
      dmg--;
    }
    if (dmg > 0) {
      this.gateHealth = Math.max(0, this.gateHealth - dmg);
      this.combo = 0;
    }
  }

  private recordKill(baseScore: number, wordLength: number): number {
    this.kills++;
    this.combo++;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    const gained = Math.round((baseScore + wordLength * 10 + this.combo * 15) * this.comboMultiplier);
    this.score += gained;
    return gained;
  }

  private miss(result: TypingDefenseCommandResult): SubmitOutcome {
    this.mistakes++;
    this.combo = 0;
    this.score = Math.max(0, this.score - 10);
    return { kind: "miss", result, targetId: null, lane: null, gainedScore: 0, word: null, skill: null, killed: false };
  }
}
