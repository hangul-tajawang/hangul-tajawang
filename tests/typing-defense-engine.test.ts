import * as assert from "node:assert/strict";
import { test } from "node:test";
import {
  TypingDefenseCommandResult,
  TypingDefenseEngine,
  TYPING_DEFENSE_MAX_GATE_HEALTH,
} from "../lib/typing-defense-engine";

test("fire command removes the nearest enemy", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 0, distance: 0.8 });
  engine.addEnemyForTest({ lane: 1, distance: 0.2 });

  const result = engine.submitCommand("발사");

  assert.equal(result, TypingDefenseCommandResult.Hit);
  assert.equal(engine.state.kills, 1);
  assert.equal(engine.state.enemies.length, 1);
  assert.equal(engine.state.enemies[0]?.lane, 0);
});

test("shield command blocks the next gate hit", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.submitCommand("방패");
  engine.addEnemyForTest({ lane: 0, distance: 0.01, speed: 0.2 });

  engine.tick();

  assert.equal(engine.state.gateHealth, TYPING_DEFENSE_MAX_GATE_HEALTH);
  assert.equal(engine.state.shieldCount, 0);
});

test("lightning command clears the busiest lane", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 0, distance: 0.6 });
  engine.addEnemyForTest({ lane: 1, distance: 0.5 });
  engine.addEnemyForTest({ lane: 1, distance: 0.9 });

  const result = engine.submitCommand("번개");

  assert.equal(result, TypingDefenseCommandResult.AreaHit);
  assert.equal(engine.state.kills, 2);
  assert.equal(engine.state.enemies[0]?.lane, 0);
});

test("repair command restores gate health by one", () => {
  const engine = new TypingDefenseEngine();
  engine.start();
  engine.addEnemyForTest({ lane: 0, distance: 0.01, speed: 0.2 });
  engine.tick();

  assert.equal(engine.state.gateHealth, TYPING_DEFENSE_MAX_GATE_HEALTH - 1);

  const result = engine.submitCommand("수리");

  assert.equal(result, TypingDefenseCommandResult.Repaired);
  assert.equal(engine.state.gateHealth, TYPING_DEFENSE_MAX_GATE_HEALTH);
});

test("spawn pacing is gentle enough for first-time players", () => {
  const engine = new TypingDefenseEngine();
  engine.start();

  for (let i = 0; i < 10; i++) {
    engine.spawnEnemy();
  }

  assert.ok(engine.state.enemies.length <= 4);
  assert.ok(engine.state.enemies.every((enemy) => enemy.speed <= 0.08));
});
