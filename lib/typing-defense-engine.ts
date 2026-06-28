export const TYPING_DEFENSE_ROUND_SECONDS = 60;
export const TYPING_DEFENSE_MAX_GATE_HEALTH = 7;
export const TYPING_DEFENSE_MAX_ENEMIES = 4;
export const TYPING_DEFENSE_LANE_COUNT = 3;

export enum TypingDefenseCommandResult {
  Hit = "hit",
  Guarded = "guarded",
  AreaHit = "areaHit",
  Repaired = "repaired",
  Invalid = "invalid",
  Unavailable = "unavailable",
}

export interface TypingDefenseEnemy {
  id: number;
  lane: number;
  distance: number;
  speed: number;
}

export interface TypingDefenseState {
  enemies: TypingDefenseEnemy[];
  timeLeft: number;
  gateHealth: number;
  shieldCount: number;
  score: number;
  kills: number;
  combo: number;
  bestCombo: number;
  mistakes: number;
  isRunning: boolean;
  isFinished: boolean;
}

interface AddEnemyOptions {
  lane: number;
  distance: number;
  speed?: number;
}

export class TypingDefenseEngine {
  private enemies: TypingDefenseEnemy[] = [];
  private nextEnemyId = 0;
  private timeLeft = TYPING_DEFENSE_ROUND_SECONDS;
  private gateHealth = TYPING_DEFENSE_MAX_GATE_HEALTH;
  private shieldCount = 0;
  private score = 0;
  private kills = 0;
  private combo = 0;
  private bestCombo = 0;
  private mistakes = 0;
  private isRunning = false;
  private isFinished = false;
  private readonly random: () => number;

  constructor(random: () => number = Math.random) {
    this.random = random;
  }

  get state(): TypingDefenseState {
    return {
      enemies: this.enemies.map((enemy) => ({ ...enemy })),
      timeLeft: this.timeLeft,
      gateHealth: this.gateHealth,
      shieldCount: this.shieldCount,
      score: this.score,
      kills: this.kills,
      combo: this.combo,
      bestCombo: this.bestCombo,
      mistakes: this.mistakes,
      isRunning: this.isRunning,
      isFinished: this.isFinished,
    };
  }

  start() {
    this.enemies = [];
    this.nextEnemyId = 0;
    this.timeLeft = TYPING_DEFENSE_ROUND_SECONDS;
    this.gateHealth = TYPING_DEFENSE_MAX_GATE_HEALTH;
    this.shieldCount = 0;
    this.score = 0;
    this.kills = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.mistakes = 0;
    this.isRunning = true;
    this.isFinished = false;
  }

  spawnEnemy() {
    if (!this.isRunning || this.isFinished || this.enemies.length >= TYPING_DEFENSE_MAX_ENEMIES) return;

    const elapsed = TYPING_DEFENSE_ROUND_SECONDS - this.timeLeft;
    const speed = 0.045 + Math.min(0.035, elapsed * 0.0009);
    this.enemies.push({
      id: this.nextEnemyId,
      lane: Math.floor(this.random() * TYPING_DEFENSE_LANE_COUNT),
      distance: 1,
      speed,
    });
    this.nextEnemyId++;
  }

  addEnemyForTest({ lane, distance, speed = 0.08 }: AddEnemyOptions) {
    this.enemies.push({
      id: this.nextEnemyId,
      lane,
      distance,
      speed,
    });
    this.nextEnemyId++;
  }

  tick() {
    if (!this.isRunning || this.isFinished) return;

    this.timeLeft--;
    const nextEnemies: TypingDefenseEnemy[] = [];

    for (const enemy of this.enemies) {
      const nextDistance = enemy.distance - enemy.speed;
      if (nextDistance <= 0) {
        this.damageGate();
      } else {
        nextEnemies.push({ ...enemy, distance: nextDistance });
      }
    }

    this.enemies = nextEnemies;
    if (this.timeLeft <= 0 || this.gateHealth <= 0) {
      this.isRunning = false;
      this.isFinished = true;
    }
  }

  submitCommand(rawCommand: string): TypingDefenseCommandResult {
    if (!this.isRunning || this.isFinished) {
      return TypingDefenseCommandResult.Unavailable;
    }

    const command = rawCommand.trim();
    switch (command) {
      case "발사":
        return this.fire();
      case "방패":
        this.shieldCount = Math.min(2, this.shieldCount + 1);
        this.score += 30;
        return TypingDefenseCommandResult.Guarded;
      case "번개":
        return this.lightning();
      case "수리":
        if (this.gateHealth >= TYPING_DEFENSE_MAX_GATE_HEALTH) {
          this.recordMistake();
          return TypingDefenseCommandResult.Unavailable;
        }
        this.gateHealth++;
        this.score += 50;
        return TypingDefenseCommandResult.Repaired;
      default:
        this.recordMistake();
        return TypingDefenseCommandResult.Invalid;
    }
  }

  private fire(): TypingDefenseCommandResult {
    if (this.enemies.length === 0) {
      this.recordMistake();
      return TypingDefenseCommandResult.Unavailable;
    }

    this.enemies.sort((a, b) => a.distance - b.distance);
    this.enemies.shift();
    this.recordKill(100);
    return TypingDefenseCommandResult.Hit;
  }

  private lightning(): TypingDefenseCommandResult {
    if (this.enemies.length === 0) {
      this.recordMistake();
      return TypingDefenseCommandResult.Unavailable;
    }

    const laneCounts = [0, 0, 0];
    for (const enemy of this.enemies) {
      laneCounts[enemy.lane] = (laneCounts[enemy.lane] ?? 0) + 1;
    }

    let targetLane = 0;
    for (let lane = 1; lane < laneCounts.length; lane++) {
      if (laneCounts[lane] > laneCounts[targetLane]) {
        targetLane = lane;
      }
    }

    const removed = this.enemies.filter((enemy) => enemy.lane === targetLane).length;
    this.enemies = this.enemies.filter((enemy) => enemy.lane !== targetLane);
    for (let i = 0; i < removed; i++) {
      this.recordKill(80);
    }

    return TypingDefenseCommandResult.AreaHit;
  }

  private damageGate() {
    if (this.shieldCount > 0) {
      this.shieldCount--;
      this.score += 20;
      return;
    }

    this.gateHealth--;
    this.combo = 0;
  }

  private recordKill(baseScore: number) {
    this.kills++;
    this.combo++;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.score += baseScore + this.combo * 15;
  }

  private recordMistake() {
    this.mistakes++;
    this.combo = 0;
    this.score = Math.max(0, this.score - 10);
  }
}
