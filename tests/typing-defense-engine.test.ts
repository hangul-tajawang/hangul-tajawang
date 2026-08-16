import * as assert from "node:assert/strict";
import { test } from "node:test";
import {
  TypingDefenseCommandResult,
  TypingDefenseEngine,
  TYPING_DEFENSE_BASE_GATE_HEALTH,
} from "../lib/typing-defense-engine";

test("typing an enemy word fires and removes that enemy", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 0, distance: 0.8, word: "사과" });
  engine.addEnemyForTest({ lane: 1, distance: 0.2, word: "바람" });

  const outcome = engine.submitInput("사과");

  assert.equal(outcome.kind, "fire");
  assert.equal(outcome.killed, true);
  assert.equal(outcome.word, "사과");
  assert.equal(engine.state.kills, 1);
  assert.equal(engine.state.enemies.length, 1);
  assert.equal(engine.state.enemies[0]?.word, "바람");
});

test("matchPrefix targets the nearest enemy whose word starts with input", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 0, distance: 0.9, word: "사과나무" });
  engine.addEnemyForTest({ lane: 1, distance: 0.3, word: "사자" });
  engine.addEnemyForTest({ lane: 2, distance: 0.6, word: "바다" });

  assert.equal(engine.matchPrefix("사").word, "사자");
  assert.equal(engine.matchPrefix("사").exact, false);
  assert.equal(engine.matchPrefix("사자").exact, true);
  assert.equal(engine.matchPrefix("하늘").targetId, null);
});

test("wrong word counts as a miss and resets combo", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 0, distance: 0.5, word: "사과" });
  engine.submitInput("사과");
  assert.equal(engine.state.combo, 1);

  const outcome = engine.submitInput("없는단어");
  assert.equal(outcome.kind, "miss");
  assert.equal(engine.state.combo, 0);
  assert.equal(engine.state.mistakes, 1);
});

test("shield enemy needs two hits: first breaks shield, second kills", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 0, distance: 0.6, word: "방어막", kind: "shield" });

  const first = engine.submitInput("방어막");
  assert.equal(first.kind, "fire");
  assert.equal(first.killed, false); // 아직 살아있음
  assert.equal(engine.state.enemies.length, 1);
  const newWord = engine.state.enemies[0].word;
  assert.notEqual(newWord, "방어막"); // 새 단어 배정됨

  const second = engine.submitInput(newWord);
  assert.equal(second.killed, true);
  assert.equal(engine.state.enemies.length, 0);
  assert.equal(engine.state.kills, 1);
});

test("splitter spawns two children on death", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 1, distance: 0.6, word: "분열", kind: "splitter" });

  engine.submitInput("분열");
  // 부모 제거 + 자식 2 → 화면 적 2
  assert.equal(engine.state.enemies.length, 2);
  assert.ok(engine.state.enemies.every((e) => e.kind === "normal"));
});

test("boss takes multiple hits and gives a new word each time", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 1, distance: 0.9, word: "보스단어", kind: "boss", hp: 3 });

  let word = "보스단어";
  for (let i = 0; i < 2; i++) {
    const r = engine.submitInput(word);
    assert.equal(r.killed, false);
    assert.equal(engine.state.enemies.length, 1);
    word = engine.state.enemies[0].word;
  }
  const final = engine.submitInput(word);
  assert.equal(final.killed, true);
  assert.equal(engine.state.enemies.length, 0);
});

test("boss deals extra gate damage on reaching the gate", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 0, distance: 0.01, speed: 0.5, word: "보스", kind: "boss", hp: 3 });
  engine.tick(1000);
  assert.equal(engine.state.gateHealth, TYPING_DEFENSE_BASE_GATE_HEALTH - 3);
});

test("shield skill blocks the next gate hit", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  const guard = engine.submitInput("방패");
  assert.equal(guard.result, TypingDefenseCommandResult.Guarded);
  assert.equal(engine.state.shieldCount, 1);

  engine.addEnemyForTest({ lane: 0, distance: 0.01, speed: 0.2, word: "적1" });
  engine.tick(1000);
  assert.equal(engine.state.gateHealth, TYPING_DEFENSE_BASE_GATE_HEALTH);
  assert.equal(engine.state.shieldCount, 0);
});

test("lightning clears the busiest lane", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 0, distance: 0.6, word: "가" });
  engine.addEnemyForTest({ lane: 1, distance: 0.5, word: "나" });
  engine.addEnemyForTest({ lane: 1, distance: 0.9, word: "다" });

  const outcome = engine.submitInput("번개");
  assert.equal(outcome.result, TypingDefenseCommandResult.AreaHit);
  assert.equal(outcome.lane, 1);
  assert.equal(engine.state.kills, 2);
  assert.equal(engine.state.enemies[0]?.lane, 0);
});

test("skills go on cooldown after use", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.submitInput("방패");
  assert.ok(engine.state.skillCooldowns.방패 > 0);
  const second = engine.submitInput("방패");
  assert.equal(second.result, TypingDefenseCommandResult.Unavailable);
  assert.equal(engine.state.shieldCount, 1);
  engine.tick(9000);
  assert.equal(engine.state.skillCooldowns.방패, 0);
});

test("gate collapse finishes the game", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  for (let i = 0; i < TYPING_DEFENSE_BASE_GATE_HEALTH; i++) {
    engine.addEnemyForTest({ lane: i % 3, distance: 0.01, speed: 0.5, word: `적${i}` });
  }
  engine.tick(1000);
  assert.equal(engine.state.gateHealth, 0);
  assert.equal(engine.state.isFinished, true);
  assert.equal(engine.state.isRunning, false);
});

test("clearing a wave offers upgrades and waits for a choice", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  assert.equal(engine.state.wave, 1);

  let guard = 0;
  while (engine.state.wavePhase === "spawning" && guard++ < 300) {
    engine.tick(700);
    for (const enemy of engine.state.enemies) {
      // 방패·분열 등 hp>1 대비: 죽을 때까지 현재 단어로 반복
      let g = 0;
      while (engine.state.enemies.find((e) => e.id === enemy.id) && g++ < 6) {
        const cur = engine.state.enemies.find((e) => e.id === enemy.id);
        if (!cur) break;
        engine.fireAt(cur.id);
      }
    }
  }
  assert.equal(engine.state.wavePhase, "intermission");
  assert.equal(engine.state.upgradeChoices.length, 3);

  // 선택 전에는 다음 웨이브로 넘어가지 않음
  engine.tick(5000);
  assert.equal(engine.state.wave, 1);

  // 성문 보강 선택 → 최대 체력 증가 + 다음 웨이브
  const before = engine.state.maxGateHealth;
  const gateChoice = engine.state.upgradeChoices.find((u) => u.id === "gate");
  engine.applyUpgrade(gateChoice ? "gate" : engine.state.upgradeChoices[0].id);
  assert.equal(engine.state.wave, 2);
  assert.equal(engine.state.wavePhase, "spawning");
  if (gateChoice) assert.equal(engine.state.maxGateHealth, before + 2);
});

function clearWaveToIntermission(engine: TypingDefenseEngine) {
  let guard = 0;
  while (engine.state.wavePhase === "spawning" && guard++ < 300) {
    engine.tick(700);
    for (const enemy of engine.state.enemies) {
      let g = 0;
      while (engine.state.enemies.find((e) => e.id === enemy.id) && g++ < 8) {
        const cur = engine.state.enemies.find((e) => e.id === enemy.id);
        if (!cur) break;
        engine.fireAt(cur.id);
      }
    }
  }
}

test("pierce upgrade lets a kill also hit the next enemy in lane", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  // 웨이브1 클리어 → 인터미션 → 관통 업그레이드 적용(웨이브2 시작)
  clearWaveToIntermission(engine);
  assert.equal(engine.state.wavePhase, "intermission");
  engine.applyUpgrade("pierce");

  // 같은 라인 앞뒤 두 적
  engine.addEnemyForTest({ lane: 0, distance: 0.3, word: "앞적" });
  engine.addEnemyForTest({ lane: 0, distance: 0.7, word: "뒤적" });

  const killsBefore = engine.state.kills;
  engine.submitInput("앞적"); // 앞적 격파 + 관통으로 뒤적도 타격(hp1 → 사망)
  assert.equal(engine.state.enemies.length, 0);
  assert.equal(engine.state.kills, killsBefore + 2);
});
