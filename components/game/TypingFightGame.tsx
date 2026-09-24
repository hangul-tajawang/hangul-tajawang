"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Loader2, Lock, RotateCcw, Shield, Star, Swords, Trophy, User, Volume2, VolumeX, Zap } from "lucide-react";
import { useGameAnalytics } from "@/hooks/useGameAnalytics";
import { useMobileGamePlay } from "@/hooks/useMobileGamePlay";
import { SupabaseService } from "@/lib/supabase";
import { sound } from "@/lib/sound-manager";
import { AdSenseUnit } from "../layout/AdSenseUnit";
import { MobileGameShell } from "./MobileGameShell";
import {
  FIGHT_BOSSES,
  PLAYER_MAX_HP,
  ROUND_SECONDS,
  TypingFightEngine,
  fightScore,
  isWrongPrefix,
  loadClearedStage,
  saveClearedStage,
  type FightCharacter,
  type FightEvent,
  type FightState,
} from "@/lib/typing-fight";
import { FIGHT_FRAME_MS, FIGHT_SPRITES, fightSpriteUrl, type FightAnim } from "@/lib/typing-fight-sprites";

interface GameRanking {
  score: number;
  level: number;
  profiles?: { nickname?: string | null; avatar_url?: string | null } | null;
}

const PLAYER_CHARACTER: FightCharacter = "samurai";
/** 화면 가로 기준 선수 위치(%) — 공격 시 상대 쪽으로 돌진 */
const PLAYER_X = 24;
const BOSS_X = 76;
const PLAYER_DASH_X = 46;
const BOSS_DASH_X = 54;
/** 바닥(발) 높이 — 아레나 아래에서부터 % */
const FLOOR = 13;

/** 스테이지별 배경 팔레트 [하늘 위, 하늘 중간, 지평선, 산, 바닥 위, 바닥 아래] */
const STAGE_THEMES: string[][] = [
  ["#0b1a2e", "#1f4e5f", "#f59e0b", "#123028", "#5b3a1e", "#2a1a0e"],
  ["#140f2d", "#3b2a6b", "#e76f51", "#241a3d", "#4a2f1d", "#20140b"],
  ["#07162b", "#1d3e6e", "#9bd4f5", "#16304f", "#4b5563", "#1f2937"],
  ["#05050f", "#1a1340", "#7c3aed", "#0f0b26", "#2d1f3d", "#120c1a"],
  ["#12020a", "#4a0a1f", "#ef4444", "#22040f", "#3b0a14", "#140307"],
];

type Anim = { anim: FightAnim; id: number };
type FloatFx = { id: number; side: "player" | "boss" | "center"; label: string; color: string };
type Spark = { id: number; side: "player" | "boss"; kind: "hit" | "guard" | "special" };
type Banner = { id: number; title: string; sub?: string; color: string };

/** 스프라이트 한 명. 바깥 div의 (0,0)이 발밑 몸통 중심(anchor)이 되도록 배치한다. */
function FighterSprite({
  character,
  anim,
  scale,
  flip,
  flashKey,
  onEnd,
}: {
  character: FightCharacter;
  anim: Anim;
  scale: number;
  flip: boolean;
  flashKey: number;
  onEnd?: (anim: FightAnim) => void;
}) {
  const m = FIGHT_SPRITES[character];
  const n = m.frames[anim.anim];
  const w = Math.round(m.w * scale);
  const h = Math.round(m.h * scale);
  // 스프라이트는 오른쪽을 본다. 반전하면 anchor도 반대편에서 잰다.
  const anchor = (flip ? m.w - m.anchorX : m.anchorX) * scale;
  const loop = anim.anim === "idle";
  return (
    <div key={flashKey} className={flashKey > 0 ? "cd-hitflash" : ""} style={{ position: "absolute", left: -anchor, bottom: 0, width: w, height: h }}>
      <div
        key={anim.id}
        className="tf-sprite"
        onAnimationEnd={() => onEnd?.(anim.anim)}
        style={
          {
            width: w,
            height: h,
            backgroundImage: `url(${fightSpriteUrl(character, anim.anim)})`,
            backgroundSize: `${w * n}px ${h}px`,
            "--tf-end": `-${w * (n - 1)}px`,
            animation: `tf-sprite ${n * FIGHT_FRAME_MS[anim.anim]}ms steps(${n}, jump-none) ${loop ? "infinite" : "1 forwards"}`,
            transform: flip ? "scaleX(-1)" : undefined,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

/** 스테이지 배경 — 순수 SVG (외부 이미지 없음) */
function FightBackground({ stage }: { stage: number }) {
  const [skyTop, skyMid, horizon, mountain, floorTop, floorBottom] = STAGE_THEMES[(stage - 1) % STAGE_THEMES.length];
  const stars = Array.from({ length: 28 }, (_, i) => ({ x: (i * 137) % 800, y: (i * 53) % 150, r: i % 3 === 0 ? 1.6 : 1 }));
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id={`tf-sky-${stage}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="0.6" stopColor={skyMid} />
          <stop offset="1" stopColor={horizon} />
        </linearGradient>
        <linearGradient id={`tf-floor-${stage}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={floorTop} />
          <stop offset="1" stopColor={floorBottom} />
        </linearGradient>
        <radialGradient id={`tf-moon-${stage}`}>
          <stop offset="0.55" stopColor="#fff7d6" />
          <stop offset="0.7" stopColor="#fde68a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill={`url(#tf-sky-${stage})`} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.6} />
      ))}
      <circle cx="610" cy="95" r="70" fill={`url(#tf-moon-${stage})`} />
      {/* 먼 산 */}
      <path d="M0 270 L70 210 L130 240 L210 170 L290 235 L360 195 L440 250 L520 185 L600 240 L680 200 L800 255 L800 330 L0 330Z" fill={mountain} opacity="0.75" />
      {/* 가까운 산 + 탑 실루엣 */}
      <path d="M0 300 L90 255 L170 285 L250 245 L340 290 L430 260 L520 295 L620 250 L720 285 L800 265 L800 330 L0 330Z" fill={mountain} />
      <g fill={mountain} opacity="0.95">
        <rect x="118" y="198" width="44" height="70" />
        <path d="M100 205 L140 180 L180 205Z" />
        <path d="M108 228 L140 210 L172 228Z" />
        <rect x="136" y="166" width="8" height="16" />
      </g>
      {/* 바닥 */}
      <rect y="322" width="800" height="78" fill={`url(#tf-floor-${stage})`} />
      <rect y="322" width="800" height="3" fill="#000" opacity="0.35" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={i * 100 + 50} y1="325" x2={i * 130 - 120} y2="400" stroke="#000" strokeOpacity="0.18" strokeWidth="2" />
      ))}
      {/* 등불 */}
      {[70, 730].map((x) => (
        <g key={x} className="tf-flicker">
          <rect x={x - 2} y="250" width="4" height="72" fill="#1c1917" />
          <rect x={x - 11} y="232" width="22" height="26" rx="4" fill="#f97316" />
          <circle cx={x} cy="245" r="26" fill="#fb923c" opacity="0.25" />
        </g>
      ))}
    </svg>
  );
}

function HpBar({ value, max, flip }: { value: number; max: number; flip: boolean }) {
  const pct = Math.max(0, (value / max) * 100);
  const low = pct < 30;
  return (
    <div className={`relative h-3.5 sm:h-5 w-full bg-black/70 border-2 border-white/80 overflow-hidden ${flip ? "-skew-x-12" : "skew-x-12"}`}>
      {/* 방금 깎인 만큼 빨갛게 남았다가 천천히 따라온다 (격투게임 데미지 잔상) */}
      <div
        className={`absolute inset-y-0 bg-red-600 transition-[width] duration-700 delay-300 ${flip ? "right-0" : "left-0"}`}
        style={{ width: `${pct}%` }}
      />
      <div
        className={`absolute inset-y-0 transition-[width] duration-100 ${flip ? "right-0" : "left-0"} ${
          low ? "bg-gradient-to-r from-orange-500 to-red-500 animate-pulse" : "bg-gradient-to-r from-yellow-300 to-amber-400"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export const TypingFightGame: React.FC = () => {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  useGameAnalytics("typing-fight", gameState);
  const [stageIdx, setStageIdx] = useState(0);
  const [cleared, setCleared] = useState(0);
  const [snap, setSnap] = useState<FightState | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [playerAnim, setPlayerAnim] = useState<Anim>({ anim: "idle", id: 0 });
  const [bossAnim, setBossAnim] = useState<Anim>({ anim: "idle", id: 0 });
  const [playerDash, setPlayerDash] = useState(false);
  const [bossDash, setBossDash] = useState(false);
  const [playerFlash, setPlayerFlash] = useState(0);
  const [bossFlash, setBossFlash] = useState(0);
  const [floats, setFloats] = useState<FloatFx[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [screenFlash, setScreenFlash] = useState(0);
  const [result, setResult] = useState<{ won: boolean; score: number; state: FightState } | null>(null);
  const [arenaH, setArenaH] = useState(340);
  const [muted, setMuted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rankings, setRankings] = useState<GameRanking[]>([]);
  const [user, setUser] = useState(false);
  const [rankingLoading, setRankingLoading] = useState(false);

  const engineRef = useRef<TypingFightEngine | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const hitStopUntil = useRef(0);
  const fxId = useRef(0);
  const animId = useRef(1);
  const attackFlip = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  // 아레나는 대기 ↔ 전체화면(포털) ↔ 모바일 셸로 DOM 노드가 바뀌므로 콜백 ref로 받아 매번 다시 잰다
  const [arenaEl, setArenaEl] = useState<HTMLDivElement | null>(null);
  const setArena = useCallback((el: HTMLDivElement | null) => {
    arenaRef.current = el;
    setArenaEl(el);
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isMobile, isMobilePlaying, paused, overlay, resume } = useMobileGamePlay({ playing: gameState === "playing", inputRef });
  const boss = FIGHT_BOSSES[stageIdx];

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    setMounted(true);
    setCleared(loadClearedStage());
    setMuted(sound.muted);
    (async () => setUser(Boolean(await SupabaseService.getCurrentUser())))();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  // 아레나 높이에 맞춰 캐릭터 크기를 정한다 (모바일 자판이 올라오면 작아짐)
  useEffect(() => {
    const el = arenaEl;
    if (!el) return;
    const ro = new ResizeObserver(() => setArenaH(el.clientHeight));
    ro.observe(el);
    setArenaH(el.clientHeight);
    return () => ro.disconnect();
  }, [arenaEl]);

  const fetchRankings = useCallback(async () => {
    setRankingLoading(true);
    try {
      setRankings((await SupabaseService.getGameRankings("typing-fight")) as GameRanking[]);
    } catch (e) {
      console.error(e);
    } finally {
      setRankingLoading(false);
    }
  }, []);

  useEffect(() => {
    if (gameState !== "playing") fetchRankings();
  }, [gameState, fetchRankings]);

  const addFloat = useCallback(
    (side: FloatFx["side"], label: string, color: string) => {
      const id = ++fxId.current;
      setFloats((cur) => [...cur, { id, side, label, color }]);
      later(() => setFloats((cur) => cur.filter((f) => f.id !== id)), 850);
    },
    [later]
  );

  const addSpark = useCallback(
    (side: Spark["side"], kind: Spark["kind"]) => {
      const id = ++fxId.current;
      setSparks((cur) => [...cur, { id, side, kind }]);
      later(() => setSparks((cur) => cur.filter((s) => s.id !== id)), 360);
    },
    [later]
  );

  const showBanner = useCallback(
    (title: string, color: string, sub?: string, ms = 2200) => {
      const id = ++fxId.current;
      setBanner({ id, title, sub, color });
      later(() => setBanner((b) => (b?.id === id ? null : b)), ms);
    },
    [later]
  );

  const shake = useCallback((strong: boolean) => {
    const el = arenaRef.current;
    if (!el) return;
    const amp = strong ? 10 : 5;
    el.animate(
      [
        { transform: "translate(0,0)" },
        { transform: `translate(${-amp}px, ${amp / 2}px)` },
        { transform: `translate(${amp}px, ${-amp / 2}px)` },
        { transform: `translate(${-amp / 2}px, 0)` },
        { transform: "translate(0,0)" },
      ],
      { duration: strong ? 380 : 220, easing: "ease-out" }
    );
  }, []);

  const play = (setter: React.Dispatch<React.SetStateAction<Anim>>, anim: FightAnim) => setter({ anim, id: ++animId.current });

  const finish = useCallback(
    async (won: boolean) => {
      const engine = engineRef.current;
      if (!engine) return;
      const state = engine.state;
      const score = fightScore(engine.boss, state);
      if (won) {
        saveClearedStage(engine.boss.stage);
        setCleared(loadClearedStage());
      }
      // 쓰러지는 모션과 K.O. 연출을 보여준 뒤 결과창
      later(() => {
        setResult({ won, score, state });
        setGameState("finished");
      }, 1700);
      if (user) {
        try {
          await SupabaseService.saveGameScore("typing-fight", score, engine.boss.stage, state.maxCombo);
        } catch (e) {
          console.error("게임 점수 저장 실패:", e);
        }
      }
    },
    [user, later]
  );

  const handleEvents = useCallback(
    (events: FightEvent[]) => {
      for (const ev of events) {
        switch (ev.type) {
          case "hit": {
            // 돌진 → 베기 → (접촉 순간) 상대 피격·스파크·히트스톱
            attackFlip.current = !attackFlip.current;
            play(setPlayerAnim, ev.special || attackFlip.current ? "attack2" : "attack1");
            setPlayerDash(true);
            later(() => setPlayerDash(false), ev.special ? 420 : 260);
            sound.play("shoot", { pitch: 1.3, volume: 0.6 });
            later(() => {
              play(setBossAnim, "hit");
              setBossFlash((n) => n + 1);
              addSpark("boss", ev.special ? "special" : "hit");
              addFloat("boss", `-${ev.damage}`, ev.special ? "text-amber-300" : "text-white");
              hitStopUntil.current = performance.now() + (ev.special ? 160 : 70);
              if (ev.special) {
                sound.play("kill", { pitch: 0.75, volume: 1 });
                shake(true);
              } else {
                sound.play("hit", { pitch: 0.9 + Math.random() * 0.25, volume: 0.85 });
                shake(false);
              }
            }, ev.special ? 180 : 110);
            if (ev.special && ev.idiom) {
              setScreenFlash((n) => n + 1);
              showBanner(`${ev.idiom.name}!`, "text-amber-300", ev.idiom.meaning, 2400);
            }
            break;
          }
          case "windup":
            setInputValue("");
            sound.blip({ freq: 180, type: "sawtooth", dur: 0.22, vol: 0.08, slideTo: 420 });
            break;
          case "block":
            // 보스가 베어 오지만 막고, 곧바로 반격
            play(setBossAnim, "attack1");
            setBossDash(true);
            later(() => setBossDash(false), 240);
            later(() => {
              addSpark("player", "guard");
              addFloat("player", "막았다!", "text-sky-300");
              sound.play("hit", { pitch: 1.6, volume: 0.7 });
              hitStopUntil.current = performance.now() + 80;
            }, 110);
            if (ev.counter > 0) {
              later(() => {
                play(setPlayerAnim, "attack1");
                play(setBossAnim, "hit");
                setBossFlash((n) => n + 1);
                addFloat("boss", `-${ev.counter}`, "text-sky-200");
              }, 300);
            }
            break;
          case "hurt":
            attackFlip.current = !attackFlip.current;
            play(setBossAnim, attackFlip.current ? "attack2" : "attack1");
            setBossDash(true);
            later(() => setBossDash(false), 300);
            setInputValue("");
            later(() => {
              play(setPlayerAnim, "hit");
              setPlayerFlash((n) => n + 1);
              addSpark("player", "hit");
              addFloat("player", `-${ev.damage}`, "text-rose-400");
              sound.play("gate_hit", { volume: 0.9 });
              hitStopUntil.current = performance.now() + 90;
              shake(true);
            }, 130);
            break;
          case "mistake":
            sound.blip({ freq: 140, type: "square", dur: 0.06, vol: 0.05 });
            break;
          case "gaugeFull":
            sound.milestone();
            addFloat("center", "⚡ 필살기 준비!", "text-amber-300");
            break;
          case "timeUp":
            showBanner("TIME UP", "text-white", "남은 체력으로 판정합니다", 1500);
            break;
          case "won":
            later(() => play(setBossAnim, "death"), 160);
            later(() => {
              sound.fanfare();
              showBanner("K.O.!", "text-amber-300", "승리!", 1700);
            }, 250);
            finish(true);
            break;
          case "lost":
            later(() => play(setPlayerAnim, "death"), 200);
            later(() => {
              sound.thud();
              showBanner("K.O.", "text-rose-400", "패배…", 1700);
            }, 250);
            finish(false);
            break;
        }
      }
    },
    [addFloat, addSpark, shake, showBanner, finish, later]
  );

  // 게임 루프 (히트스톱 동안은 시간을 멈춘다)
  const loop = useCallback(
    (ts: number) => {
      const engine = engineRef.current;
      if (!engine) return;
      if (lastTs.current === null) lastTs.current = ts;
      const dt = Math.min(0.1, (ts - lastTs.current) / 1000);
      lastTs.current = ts;
      if (performance.now() >= hitStopUntil.current) {
        const events = engine.tick(dt);
        setSnap(engine.state);
        if (events.length) handleEvents(events);
      }
      if (engine.state.status === "fighting") rafRef.current = requestAnimationFrame(loop);
    },
    [handleEvents]
  );

  useEffect(() => {
    if (gameState !== "playing" || paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTs.current = null;
      return;
    }
    if (engineRef.current?.state.status === "fighting") rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTs.current = null;
    };
  }, [gameState, paused, loop]);

  const startGame = (idx: number = stageIdx) => {
    sound.init();
    clearTimers();
    const engine = new TypingFightEngine(FIGHT_BOSSES[idx]);
    engineRef.current = engine;
    setStageIdx(idx);
    setSnap(engine.state);
    setInputValue("");
    setFloats([]);
    setSparks([]);
    setResult(null);
    setPlayerFlash(0);
    setBossFlash(0);
    setPlayerDash(false);
    setBossDash(false);
    play(setPlayerAnim, "idle");
    play(setBossAnim, "idle");
    setGameState("playing");
    showBanner(`ROUND ${idx + 1}`, "text-white", `VS ${FIGHT_BOSSES[idx].name}`, 1100);
    later(() => showBanner("FIGHT!", "text-amber-300", undefined, 800), 1100);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const engine = engineRef.current;
    if (!engine || gameState !== "playing" || engine.state.status !== "fighting") {
      setInputValue(value);
      return;
    }
    const { cleared: done, events } = engine.input(value);
    setInputValue(done ? "" : value);
    setSnap(engine.state);
    if (events.length) handleEvents(events);
  };

  // 공격·피격 모션이 끝나면 대기 자세로 (쓰러짐은 유지)
  const backToIdle = (setter: React.Dispatch<React.SetStateAction<Anim>>) => (anim: FightAnim) => {
    if (anim !== "idle" && anim !== "death") setter((cur) => (cur.anim === anim ? { anim: "idle", id: ++animId.current } : cur));
  };

  const toggleMute = () => {
    setMuted(sound.toggleMuted());
    inputRef.current?.focus();
  };

  const s = snap;
  const defense = s?.defense ?? null;
  const target = defense ? defense.word : s?.attackWord ?? "";
  const isWrongNow = !!s && isWrongPrefix(target, inputValue);
  const timeLeft = Math.max(0, Math.ceil(ROUND_SECONDS - (s?.elapsed ?? 0)));

  // ── 아레나 ──
  const arena = (compact: boolean, fill = false) => {
    // 캐릭터 키 = 아레나 높이의 약 1/3 (보스는 배율만큼 더 크게)
    const body = Math.max(60, Math.min(175, arenaH * 0.36));
    const playerScale = body / FIGHT_SPRITES[PLAYER_CHARACTER].bodyH;
    const bossScale = (body / FIGHT_SPRITES[boss.character].bodyH) * boss.scale * (boss.character === "wizard" ? 1.35 : 1);
    const sparkPos = (side: "player" | "boss") => ({
      left: `${side === "boss" ? BOSS_X - 2 : PLAYER_X + 2}%`,
      bottom: `calc(${FLOOR}% + ${body * 0.55}px)`,
    });
    const combo = s?.combo ?? 0;
    return (
      <div
        ref={setArena}
        className={`relative overflow-hidden select-none bg-zinc-950 ${compact ? "flex-1 min-h-0 rounded-xl" : fill ? "flex-1 min-h-0 rounded-2xl border-4 border-zinc-800" : "h-[320px] md:h-[360px] rounded-2xl border-4 border-zinc-900"}`}
      >
        <FightBackground stage={boss.stage} />

        {/* ── 상단 HUD: 체력바 · 타이머 ── */}
        <div className={`absolute inset-x-0 top-0 z-20 grid grid-cols-[1fr_auto_1fr] items-start ${compact ? "gap-2 p-2" : "gap-3 p-3 sm:p-4"}`}>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-black text-white drop-shadow">
              <span className="italic">P1 · 나</span>
              <span className="tabular-nums">{s?.playerHp ?? PLAYER_MAX_HP}</span>
            </div>
            <HpBar value={s?.playerHp ?? PLAYER_MAX_HP} max={PLAYER_MAX_HP} flip={false} />
            {/* 필살 게이지 */}
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[8px] sm:text-[9px] font-black italic ${s?.special ? "text-amber-300 animate-pulse" : "text-sky-300"}`}>SUPER</span>
              <div className="flex-1 h-1.5 sm:h-2 bg-black/60 border border-white/40 overflow-hidden skew-x-12">
                <div
                  className={`h-full transition-[width] duration-300 ${s?.special ? "bg-amber-300 animate-pulse" : "bg-gradient-to-r from-sky-500 to-cyan-300"}`}
                  style={{ width: `${s?.special ? 100 : s?.gauge ?? 0}%` }}
                />
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col items-center justify-center bg-black/70 border-2 border-white/80 rounded-md font-black tabular-nums ${
              compact ? "w-10 h-9 text-lg" : "w-14 h-12 text-2xl sm:text-3xl"
            } ${timeLeft <= 10 ? "text-rose-400 animate-pulse" : "text-white"}`}
          >
            {timeLeft}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-black text-white drop-shadow">
              <span className="tabular-nums">{s?.bossHp ?? boss.hp}</span>
              <span className="italic truncate">{boss.name}</span>
            </div>
            <HpBar value={s?.bossHp ?? boss.hp} max={boss.hp} flip />
            <div className="text-right text-[8px] sm:text-[10px] font-bold text-white/70 truncate">
              STAGE {boss.stage} · {boss.grade}
            </div>
          </div>
        </div>

        {/* 콤보 카운터 */}
        {combo >= 2 && (
          <div key={combo} className={`tf-combo absolute z-20 left-3 font-black italic text-amber-300 drop-shadow-[0_3px_0_rgba(0,0,0,0.6)] ${compact ? "top-[30%]" : "top-[32%]"}`}>
            <span className={compact ? "text-2xl" : "text-4xl"}>{combo}</span>
            <span className={`ml-1 text-white ${compact ? "text-xs" : "text-base"}`}>HITS</span>
          </div>
        )}

        {/* ── 선수들 ── */}
        <div
          className="absolute z-10 transition-[left] ease-out"
          style={{ left: `${playerDash ? PLAYER_DASH_X : PLAYER_X}%`, bottom: `${FLOOR}%`, transitionDuration: playerDash ? "90ms" : "220ms" }}
        >
          <div className="absolute -translate-x-1/2 bottom-[-6px] w-24 h-3 rounded-[50%] bg-black/40 blur-[2px]" style={{ width: body * 0.9 }} />
          <FighterSprite character={PLAYER_CHARACTER} anim={playerAnim} scale={playerScale} flip={false} flashKey={playerFlash} onEnd={backToIdle(setPlayerAnim)} />
        </div>
        <div
          className="absolute z-10 transition-[left] ease-out"
          style={{ left: `${bossDash ? BOSS_DASH_X : BOSS_X}%`, bottom: `${FLOOR}%`, transitionDuration: bossDash ? "90ms" : "220ms" }}
        >
          {defense && (
            <div className="tf-aura absolute left-0 rounded-full bg-rose-500/60 blur-xl" style={{ bottom: 0, width: body * 1.4, height: body * 1.3 }} />
          )}
          <div className="absolute -translate-x-1/2 bottom-[-6px] h-3 rounded-[50%] bg-black/40 blur-[2px]" style={{ width: body * 0.9 * boss.scale }} />
          <FighterSprite character={boss.character} anim={bossAnim} scale={bossScale} flip flashKey={bossFlash} onEnd={backToIdle(setBossAnim)} />
        </div>

        {/* 타격 스파크 */}
        {sparks.map((sp) => (
          <div key={sp.id} className="tf-spark absolute z-20 pointer-events-none" style={sparkPos(sp.side)}>
            <div
              className="rounded-full"
              style={{
                width: sp.kind === "special" ? body * 1.6 : body * 0.9,
                height: sp.kind === "special" ? body * 1.6 : body * 0.9,
                background:
                  sp.kind === "guard"
                    ? "radial-gradient(circle, #fff 0%, #7dd3fc 30%, rgba(56,189,248,0) 70%)"
                    : sp.kind === "special"
                      ? "radial-gradient(circle, #fff 0%, #fde047 25%, #f97316 45%, rgba(249,115,22,0) 70%)"
                      : "radial-gradient(circle, #fff 0%, #fef08a 25%, rgba(250,204,21,0) 65%)",
                boxShadow: "0 0 30px rgba(255,255,255,0.6)",
              }}
            />
          </div>
        ))}

        {/* 데미지 숫자 */}
        {floats.map((f) => (
          <span
            key={f.id}
            className={`cd-float absolute z-30 -translate-x-1/2 font-black whitespace-nowrap drop-shadow-[0_2px_0_rgba(0,0,0,0.7)] ${f.color} ${
              f.side === "center" ? (compact ? "text-base" : "text-2xl") : compact ? "text-xl" : "text-4xl"
            }`}
            style={
              f.side === "center"
                ? { left: "50%", top: "30%" }
                : { left: `${f.side === "boss" ? BOSS_X : PLAYER_X}%`, bottom: `calc(${FLOOR}% + ${body * 1.2}px)` }
            }
          >
            {f.label}
          </span>
        ))}

        {/* 방어 경고 */}
        {defense && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 rounded-xl bg-rose-600/95 border-2 border-white/70 shadow-[0_0_30px_rgba(244,63,94,0.8)] ${
              compact ? "top-[30%] px-4 py-1.5" : "top-[28%] px-6 py-2.5"
            }`}
          >
            <span className={`flex items-center gap-1 font-black text-rose-100 ${compact ? "text-[10px]" : "text-xs"}`}>
              <Shield size={compact ? 11 : 13} /> 막아라!
            </span>
            <span data-fight-defense className={`font-black text-white tracking-wider ${compact ? "text-xl" : "text-3xl"}`}>
              {defense.word}
            </span>
            <div className={`${compact ? "w-24" : "w-36"} h-1.5 rounded-full bg-black/30 overflow-hidden`}>
              <div className="h-full bg-white" style={{ width: `${(defense.remaining / defense.total) * 100}%` }} />
            </div>
          </div>
        )}

        {/* 필살기 화면 번쩍 */}
        {screenFlash > 0 && <div key={screenFlash} className="tf-screen-flash absolute inset-0 z-30 bg-white pointer-events-none" />}

        {/* 배너 (ROUND·FIGHT·필살기·K.O.) */}
        {banner && (
          <div key={banner.id} className="cd-banner absolute inset-x-0 top-[30%] z-40 flex flex-col items-center text-center px-4 pointer-events-none">
            <span
              className={`font-black italic tracking-tight drop-shadow-[0_5px_0_rgba(0,0,0,0.65)] ${compact ? "text-4xl" : "text-6xl md:text-7xl"} ${banner.color}`}
              style={{ WebkitTextStroke: "2px rgba(0,0,0,0.6)" }}
            >
              {banner.title}
            </span>
            {banner.sub && <span className={`mt-1 font-bold text-white drop-shadow ${compact ? "text-xs" : "text-base"} break-keep`}>{banner.sub}</span>}
          </div>
        )}
      </div>
    );
  };

  // ── 공격 단어 카드 ──
  const wordCard = (compact: boolean) => {
    if (!s) return null;
    return (
      <div className={`shrink-0 flex flex-col items-center ${compact ? "gap-0.5" : "gap-1.5"}`}>
        <div
          data-fight-word
          className={`px-6 rounded-2xl border-4 font-bold tracking-wider transition-colors ${compact ? "py-1.5 text-2xl" : "py-2 md:py-3 text-3xl md:text-5xl"} ${
            defense
              ? "bg-zinc-800 border-zinc-700 text-zinc-500"
              : isWrongNow
                ? "bg-rose-50 border-rose-500 text-rose-600"
                : s.special
                  ? "bg-amber-50 border-amber-400 text-amber-700 shadow-[0_0_30px_rgba(251,191,36,0.6)]"
                  : compact
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-white border-zinc-900 text-zinc-900"
          }`}
        >
          {s.special && !defense && <Zap size={compact ? 18 : 28} className="inline -mt-1 mr-1 text-amber-500" fill="currentColor" />}
          {s.attackWord}
        </div>
        <div className={`font-bold text-center break-keep ${compact ? "text-[11px]" : "text-sm"} ${defense ? "text-rose-400" : s.special ? "text-amber-500" : "text-zinc-500"}`}>
          {defense ? "방어 단어를 먼저 입력하세요!" : s.special ? `필살기 — ${s.specialMeaning}` : `다음: ${s.nextWord}`}
        </div>
      </div>
    );
  };

  const fightInput = (
    <input
      data-typing-input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
          e.preventDefault();
          setInputValue("");
        }
      }}
      disabled={gameState !== "playing"}
      className={`w-full text-center font-bold outline-hidden transition-all ${
        isMobilePlaying
          ? `h-12 px-4 text-lg bg-zinc-800 text-white rounded-xl border-2 placeholder:text-zinc-500 ${isWrongNow ? "border-rose-500" : defense ? "border-rose-400" : "border-zinc-700 focus:border-amber-500"}`
          : `h-14 md:h-20 px-5 md:px-8 text-xl md:text-4xl bg-white border-4 rounded-2xl shadow-xl ${
              gameState === "playing" ? (isWrongNow ? "border-rose-500" : defense ? "border-rose-400" : "border-zinc-900 focus:border-amber-500") : "border-zinc-100 opacity-50"
            }`
      }`}
      placeholder={gameState === "playing" ? (defense ? `방어: ${defense.word}` : "단어를 쳐서 공격!") : "보스를 고르고 대결을 시작하세요"}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
    />
  );

  // ── 보스 선택 ──
  const bossPortrait = (character: FightCharacter, size: number, extraScale = 1) => {
    const scale = ((size * 0.85) / FIGHT_SPRITES[character].bodyH) * extraScale;
    return (
      <div className="relative shrink-0 overflow-hidden" style={{ width: size, height: size }}>
        <div className="absolute" style={{ left: "50%", bottom: 2 }}>
          <FighterSprite character={character} anim={{ anim: "idle", id: 0 }} scale={scale} flip={character !== PLAYER_CHARACTER} flashKey={0} />
        </div>
      </div>
    );
  };

  const stageSelect = (
    <div className="relative overflow-hidden rounded-2xl border-4 border-zinc-900 bg-zinc-950">
      <FightBackground stage={boss.stage} />
      <div className="relative p-4 sm:p-6 bg-black/35">
        <div className="text-center mb-5">
          <p className="text-[10px] font-bold tracking-[0.3em] text-amber-300 uppercase mb-1">Typing Fight</p>
          <h3 className="text-2xl sm:text-4xl font-black italic text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.6)]">상대할 보스를 고르세요</h3>
          <p className="text-xs sm:text-sm text-white/80 mt-1">보스를 이기면 다음 단계가 열립니다</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
          {FIGHT_BOSSES.map((b, i) => {
            const locked = i > cleared;
            const selected = i === stageIdx;
            const beaten = i < cleared;
            return (
              <button
                key={b.stage}
                type="button"
                disabled={locked}
                onClick={() => setStageIdx(i)}
                className={`relative flex lg:flex-col items-center gap-3 lg:gap-1 p-2 sm:p-3 rounded-xl border-2 text-left lg:text-center transition-all backdrop-blur-sm ${
                  selected ? "border-amber-400 bg-black/55 shadow-[0_0_20px_rgba(251,191,36,0.4)]" : "border-white/15 bg-black/40 hover:bg-black/55"
                } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className={locked ? "brightness-0 opacity-70" : ""}>{bossPortrait(b.character, 76, b.character === "wizard" ? 0.8 : 1)}</div>
                {locked && (
                  <div className="absolute left-2 top-2 lg:left-1/2 lg:-translate-x-1/2 lg:top-8">
                    <Lock size={18} className="text-white" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-amber-300">
                    STAGE {b.stage} · {b.grade}
                    {beaten && " · ✅"}
                  </p>
                  <p className="text-sm font-black text-white truncate">{locked ? "???" : b.name}</p>
                  <p className="text-[10px] text-white/70">
                    체력 {b.hp} · 방어 {b.window}초
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-center gap-4">
          <div className="hidden sm:block">{bossPortrait(PLAYER_CHARACTER, 120)}</div>
          <button
            onClick={() => startGame(stageIdx)}
            className="px-8 sm:px-10 py-4 bg-amber-400 hover:bg-amber-300 text-zinc-900 text-lg font-black italic rounded-xl transition-all shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-[0_2px_0_#b45309] flex items-center justify-center gap-2"
          >
            <Swords size={22} /> {boss.name}에게 도전
          </button>
          <div className="hidden sm:block">{bossPortrait(boss.character, 120, boss.character === "wizard" ? 0.8 : 1)}</div>
        </div>
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-white/90">
          <li className="rounded-lg bg-black/40 px-3 py-2">⚔️ 단어를 정확히 치면 베기 — 길수록·콤보일수록 세게</li>
          <li className="rounded-lg bg-black/40 px-3 py-2">🛡️ 빨간 방어 단어가 뜨면 시간 안에 입력해 막고 반격</li>
          <li className="rounded-lg bg-black/40 px-3 py-2">⚡ SUPER 게이지가 차면 사자성어 필살기 · 제한 시간 99초</li>
        </ul>
      </div>
    </div>
  );

  const finishModal = gameState === "finished" && result && (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500" />
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-center border border-zinc-200 animate-in zoom-in duration-500">
        <div className="flex justify-center mb-3">{bossPortrait(result.won ? PLAYER_CHARACTER : boss.character, 110, !result.won && boss.character === "wizard" ? 0.8 : 1)}</div>
        <h2 className="text-4xl font-black italic text-zinc-900 mb-1 tracking-tighter">{result.won ? "승리!" : "패배"}</h2>
        <p className="text-zinc-500 font-bold mb-6 break-keep">
          STAGE {boss.stage} {boss.name} ·{" "}
          {result.won
            ? stageIdx + 1 < FIGHT_BOSSES.length
              ? `다음 상대 ${FIGHT_BOSSES[stageIdx + 1].name}이(가) 열렸어요`
              : "마왕까지 쓰러뜨렸습니다!"
            : `보스 체력 ${result.state.bossHp} 남음 — 한 번 더!`}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1 tracking-widest">점수</p>
            <p className="text-xl font-bold text-amber-600 tabular-nums">{result.score.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1 tracking-widest">Max Combo</p>
            <p className="text-xl font-bold text-zinc-900">{result.state.maxCombo}</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1 tracking-widest">방어 성공</p>
            <p className="text-xl font-bold text-sky-600">{result.state.blocks}</p>
          </div>
        </div>
        {!user ? (
          <div className="mb-6 p-5 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-sm font-bold text-amber-700 mb-4 flex items-center justify-center gap-2">
              <Star size={16} fill="currentColor" /> 랭킹에 이름을 남기고 싶으신가요?
            </p>
            <button
              onClick={() => SupabaseService.signInWithKakao()}
              className="w-full py-4 bg-[#FEE500] text-black font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95"
            >
              3초 만에 로그인하고 기록 저장
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-center gap-2">
            <Star size={18} className="text-green-600" fill="currentColor" />
            <p className="text-sm font-bold text-green-600">기록이 랭킹에 반영되었습니다!</p>
          </div>
        )}
        <div className="mb-5 flex justify-center empty:hidden">
          <AdSenseUnit label="content-banner-mobile" width={320} height={100} tight />
        </div>
        <div className="flex flex-col gap-3">
          {result.won && stageIdx + 1 < FIGHT_BOSSES.length ? (
            <button
              onClick={() => startGame(stageIdx + 1)}
              className="w-full py-4 bg-amber-400 text-zinc-900 text-lg font-black rounded-2xl active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Swords size={20} /> 다음 보스 도전
            </button>
          ) : (
            <button
              onClick={() => startGame(stageIdx)}
              className="w-full py-4 bg-zinc-900 text-white text-lg font-bold rounded-2xl active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> 다시 도전하기
            </button>
          )}
          <button onClick={() => setGameState("ready")} className="w-full py-3 bg-zinc-100 text-zinc-600 font-bold rounded-2xl active:scale-95">
            보스 다시 고르기
          </button>
          <Link prefetch={false} href="/game" className="flex items-center justify-center gap-1 text-zinc-400 font-bold text-sm hover:text-zinc-600">
            목록으로 돌아가기 <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );

  const rankingPanel = (wide = false) => (
    <div className={`flex w-full ${wide ? "" : "lg:w-72"} bg-white rounded-2xl border border-zinc-200 p-6 shadow-lg flex-col shrink-0`}>
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="text-yellow-500" size={20} />
        <h3 className="text-lg font-bold">타자 격투 랭킹</h3>
      </div>
      <div className={`flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-96 lg:max-h-none ${wide ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-3"}`}>
        {rankingLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-zinc-300" size={20} />
          </div>
        ) : rankings.length > 0 ? (
          rankings.map((rank, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  i === 0 ? "bg-yellow-400 text-white" : i === 1 ? "bg-zinc-300 text-zinc-600" : i === 2 ? "bg-orange-400 text-white" : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                {rank.profiles?.avatar_url ? (
                  <Image src={rank.profiles.avatar_url} alt="p" width={24} height={24} className="w-6 h-6 rounded-lg object-cover" />
                ) : (
                  <div className="w-6 h-6 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400">
                    <User size={12} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate text-zinc-900 leading-tight">{rank.profiles?.nickname || "익명"}</p>
                  <p className="text-[9px] font-bold text-zinc-400">STAGE {rank.level}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-amber-600 shrink-0">{rank.score.toLocaleString()}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-zinc-400 text-xs font-medium">기록 없음</div>
        )}
      </div>
      {!user && <p className="mt-4 text-[9px] text-zinc-400 font-bold text-center">로그인하면 기록을 랭킹에 남길 수 있습니다.</p>}
    </div>
  );

  // ── 데스크톱/노트북 전체화면 (성문방어와 같은 구성: 상단 바 · 좌우 광고 레일 · 가운데 아레나) ──
  if (gameState === "playing" && !isMobile && mounted) {
    const exitDesktop = () => {
      if (confirm("대결을 포기하고 나갈까요?")) {
        clearTimers();
        engineRef.current = null;
        setGameState("ready");
      } else inputRef.current?.focus();
    };
    return createPortal(
      <div className="fixed inset-0 z-[9985] bg-zinc-950 flex flex-col p-3 gap-3">
        <div className="shrink-0 flex items-center gap-4 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={exitDesktop}
            aria-label="대결 그만하기"
            className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700"
          >
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-black italic text-amber-400">STAGE {boss.stage}</span>
            <span className="text-sm font-bold text-zinc-300 truncate">
              VS {boss.name} <span className="text-zinc-500 font-medium">· {boss.title}</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">Max Combo</span>
              <span className="text-lg font-bold text-orange-400 tabular-nums">{s?.maxCombo ?? 0}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">방어</span>
              <span className="text-lg font-bold text-sky-400 tabular-nums">{s?.blocks ?? 0}</span>
            </div>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={toggleMute}
              aria-label={muted ? "소리 켜기" : "소리 끄기"}
              className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>
        <div className="flex-1 flex gap-3 min-h-0">
          <div className="hidden md:flex flex-col items-center shrink-0 w-[168px] overflow-hidden rounded-2xl bg-white/[0.03] p-1">
            <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-zinc-500 py-1">Sponsor</span>
            <AdSenseUnit label="sidebar-left" width={160} height={600} />
          </div>
          <div className="flex-1 flex flex-col gap-3 min-h-0 min-w-0">
            {arena(false, true)}
            {wordCard(false)}
            {fightInput}
          </div>
          <div className="hidden md:flex flex-col items-center shrink-0 w-[168px] overflow-hidden rounded-2xl bg-white/[0.03] p-1">
            <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-zinc-500 py-1">Sponsor</span>
            <AdSenseUnit label="sidebar-right" width={160} height={600} />
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // ── 모바일 풀스크린 ──
  if (isMobilePlaying && overlay) {
    const exitGame = () => {
      if (confirm("대결을 포기하고 나갈까요?")) {
        clearTimers();
        engineRef.current = null;
        setGameState("ready");
      } else resume();
    };
    const hud = (
      <>
        <span className="text-[10px] font-black italic text-amber-300">STAGE {boss.stage}</span>
        <span className="text-xs font-bold text-zinc-300 truncate">VS {boss.name}</span>
        <button
          type="button"
          onClick={toggleMute}
          onPointerDown={(e) => e.preventDefault()}
          aria-label={muted ? "소리 켜기" : "소리 끄기"}
          className="ml-auto w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center"
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </>
    );
    return (
      <>
        <MobileGameShell overlay={overlay} hud={hud} input={fightInput} paused={paused} onResume={resume} onExit={exitGame}>
          <div className="w-full h-full flex flex-col gap-2 p-2">
            {arena(true)}
            {wordCard(true)}
          </div>
        </MobileGameShell>
        {mounted && finishModal && createPortal(finishModal, document.body)}
      </>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-2 md:gap-4 py-2 animate-in fade-in duration-700">
      {mounted && finishModal && createPortal(finishModal, document.body)}

      {gameState === "ready" ? (
        <>
          {stageSelect}
          {rankingPanel(true)}
        </>
      ) : (
        <div className="w-full flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div className="relative">
              {arena(false)}
              <button
                type="button"
                onClick={toggleMute}
                onPointerDown={(e) => e.preventDefault()}
                aria-label={muted ? "소리 켜기" : "소리 끄기"}
                className="absolute right-3 bottom-3 z-30 w-9 h-9 rounded-xl bg-black/50 text-white/80 flex items-center justify-center hover:bg-black/70"
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
            {wordCard(false)}
            {fightInput}
          </div>
          {rankingPanel()}
        </div>
      )}
    </div>
  );
};
