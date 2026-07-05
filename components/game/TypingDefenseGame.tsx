"use client";

import React, { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Castle,
  Crosshair,
  Heart,
  Keyboard,
  Loader2,
  RotateCcw,
  Shield,
  Sparkles,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { KeyboardRecommendationBanner } from "../layout/KeyboardRecommendationBanner";
import { SupabaseService } from "@/lib/supabase";
import { useMobileGamePlay } from "@/hooks/useMobileGamePlay";
import { MobileGameShell } from "./MobileGameShell";
import {
  TYPING_DEFENSE_MAX_GATE_HEALTH,
  TypingDefenseCommandResult,
  TypingDefenseEnemy,
  TypingDefenseEngine,
  TypingDefenseState,
} from "@/lib/typing-defense-engine";

type GameState = "ready" | "playing" | "gameover";
type BattleEffectType = "hit" | "lightning" | "shield" | "repair";

interface BattleEffect {
  id: number;
  type: BattleEffectType;
  lane: number;
  distance: number;
  label: string;
}

interface GameRanking {
  score: number;
  level: number;
  max_combo: number;
  created_at?: string;
  profiles?: {
    nickname?: string | null;
    avatar_url?: string | null;
  } | null;
}

interface ProfileSummary {
  nickname?: string | null;
}

const COMMANDS = [
  { command: "발사", description: "가장 가까운 적", icon: Crosshair },
  { command: "방패", description: "피해 1회 방어", icon: Shield },
  { command: "번개", description: "많은 라인 정리", icon: Zap },
  { command: "수리", description: "성문 체력 회복", icon: Heart },
];

const initialEngine = new TypingDefenseEngine();

function normalizeRankings(value: unknown): GameRanking[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is GameRanking => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<GameRanking>;
    return typeof candidate.score === "number";
  });
}

function normalizeProfile(value: unknown): ProfileSummary | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as ProfileSummary;
  return { nickname: candidate.nickname ?? null };
}

function feedbackText(result: TypingDefenseCommandResult | null) {
  switch (result) {
    case TypingDefenseCommandResult.Hit:
      return "타워 발사! 가장 가까운 적을 막았습니다.";
    case TypingDefenseCommandResult.Guarded:
      return "방패 준비! 다음 피해를 막습니다.";
    case TypingDefenseCommandResult.AreaHit:
      return "번개 발동! 가장 붐비는 라인을 정리했습니다.";
    case TypingDefenseCommandResult.Repaired:
      return "성문을 수리했습니다.";
    case TypingDefenseCommandResult.Invalid:
      return "없는 명령어입니다. 발사/방패/번개/수리 중 입력하세요.";
    case TypingDefenseCommandResult.Unavailable:
      return "지금은 사용할 수 없는 명령입니다.";
    case null:
      return "명령어를 입력해 60초 동안 성문을 지키세요.";
  }
}

function nearestEnemy(enemies: TypingDefenseEnemy[]) {
  if (enemies.length === 0) return null;
  return enemies.reduce((current, next) => (current.distance <= next.distance ? current : next));
}

function busiestLane(enemies: TypingDefenseEnemy[]) {
  if (enemies.length === 0) return null;
  const laneCounts = [0, 0, 0];
  for (const enemy of enemies) laneCounts[enemy.lane] = (laneCounts[enemy.lane] ?? 0) + 1;
  let targetLane = 0;
  for (let lane = 1; lane < laneCounts.length; lane++) {
    if (laneCounts[lane] > laneCounts[targetLane]) targetLane = lane;
  }
  return targetLane;
}

export const TypingDefenseGame: React.FC = () => {
  const engineRef = useRef(initialEngine);
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextEffectIdRef = useRef(0);
  const hasSavedScoreRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [snapshot, setSnapshot] = useState<TypingDefenseState>(engineRef.current.state);
  const [gameState, setGameState] = useState<GameState>("ready");
  const [inputValue, setInputValue] = useState("");
  const [lastResult, setLastResult] = useState<TypingDefenseCommandResult | null>(null);
  const [effects, setEffects] = useState<BattleEffect[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [rankings, setRankings] = useState<GameRanking[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);

  // 모바일 풀스크린 몰입 모드 (visualViewport 동기화 / 스크롤 잠금 / 포커스 이탈 일시정지)
  const { isMobilePlaying, paused, overlay, resume } =
    useMobileGamePlay({ playing: gameState === "playing", inputRef });

  // 엔진 타이머(tick/spawn)가 일시정지를 존중하도록 ref로 미러링
  const pausedRef = useRef(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const syncSnapshot = useCallback(() => {
    setSnapshot(engineRef.current.state);
  }, []);

  const clearTimers = useCallback(() => {
    if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    tickTimerRef.current = null;
    spawnTimerRef.current = null;
  }, []);

  const fetchRankings = useCallback(async () => {
    setRankingLoading(true);
    try {
      const data: unknown = await SupabaseService.getGameRankings("castle-defense");
      setRankings(normalizeRankings(data));
    } catch (error) {
      console.error(error);
    } finally {
      setRankingLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const loadUser = async () => {
      const user = await SupabaseService.getCurrentUser();
      setIsLoggedIn(Boolean(user));
      if (user) {
        const loadedProfile: unknown = await SupabaseService.getMyProfile();
        setProfile(normalizeProfile(loadedProfile));
      }
    };
    loadUser();
    fetchRankings();
    return clearTimers;
  }, [clearTimers, fetchRankings]);

  const finishGame = useCallback(async () => {
    clearTimers();
    setGameState("gameover");
    syncSnapshot();
    if (isLoggedIn && !hasSavedScoreRef.current) {
      hasSavedScoreRef.current = true;
      const state = engineRef.current.state;
      try {
        await SupabaseService.saveGameScore("castle-defense", state.score, state.gateHealth > 0 ? 1 : 0, state.bestCombo);
        await fetchRankings();
      } catch (error) {
        console.error(error);
      }
    }
  }, [clearTimers, fetchRankings, isLoggedIn, syncSnapshot]);

  const scheduleEffectRemoval = useCallback((effectId: number) => {
    window.setTimeout(() => {
      setEffects((current) => current.filter((effect) => effect.id !== effectId));
    }, 760);
  }, []);

  const addEffect = useCallback(
    (effect: Omit<BattleEffect, "id">) => {
      const nextEffect = { ...effect, id: nextEffectIdRef.current };
      nextEffectIdRef.current++;
      setEffects((current) => [...current, nextEffect]);
      scheduleEffectRemoval(nextEffect.id);
    },
    [scheduleEffectRemoval],
  );

  const ensureMinimumEnemies = useCallback(() => {
    const engine = engineRef.current;
    while (engine.state.isRunning && engine.state.enemies.length < 2) {
      engine.spawnEnemy();
    }
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    engineRef.current = new TypingDefenseEngine();
    engineRef.current.start();
    engineRef.current.spawnEnemy();
    engineRef.current.spawnEnemy();
    hasSavedScoreRef.current = false;
    setInputValue("");
    setLastResult(null);
    setEffects([]);
    setGameState("playing");
    syncSnapshot();
    tickTimerRef.current = setInterval(() => {
      if (pausedRef.current) return; // 모바일 일시정지 중에는 시간·적 이동 정지
      engineRef.current.tick();
      ensureMinimumEnemies();
      syncSnapshot();
      if (engineRef.current.state.isFinished) {
        finishGame();
      }
    }, 1000);
    spawnTimerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      engineRef.current.spawnEnemy();
      syncSnapshot();
    }, 4800);
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [clearTimers, ensureMinimumEnemies, finishGame, syncSnapshot]);

  const submitCommand = useCallback(
    (rawCommand: string) => {
      if (!engineRef.current.state.isRunning) return;
      const command = rawCommand.trim();
      const enemiesBeforeCommand = engineRef.current.state.enemies;
      const targetEnemy = command === "발사" ? nearestEnemy(enemiesBeforeCommand) : null;
      const lightningLane = command === "번개" ? busiestLane(enemiesBeforeCommand) : null;
      const result = engineRef.current.submitCommand(rawCommand);

      if (result === TypingDefenseCommandResult.Hit && targetEnemy) {
        addEffect({ type: "hit", lane: targetEnemy.lane, distance: targetEnemy.distance, label: `+${100 + engineRef.current.state.combo * 15}` });
      }
      if (result === TypingDefenseCommandResult.AreaHit && lightningLane !== null) {
        addEffect({ type: "lightning", lane: lightningLane, distance: 0, label: "번개" });
      }
      if (result === TypingDefenseCommandResult.Guarded) {
        addEffect({ type: "shield", lane: -1, distance: 0, label: "방패" });
      }
      if (result === TypingDefenseCommandResult.Repaired) {
        addEffect({ type: "repair", lane: -1, distance: 0, label: "+1" });
      }

      setLastResult(result);
      setInputValue("");
      ensureMinimumEnemies();
      syncSnapshot();
      window.setTimeout(() => inputRef.current?.focus(), 30);
      if (engineRef.current.state.isFinished) finishGame();
    },
    [addEffect, ensureMinimumEnemies, finishGame, syncSnapshot],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitCommand(inputValue);
  };

  const resultModal = gameState === "gameover" && (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500" />
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl text-center border border-zinc-200 dark:border-zinc-800 animate-in zoom-in duration-500">
        <div className="inline-flex p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-8">
          <Castle className="w-20 h-20 text-blue-600" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-100 mb-3 tracking-tighter">
          {snapshot.gateHealth > 0 ? "성문 방어 성공!" : "성문이 무너졌어요"}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-10">60초 동안의 방어 기록입니다.</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <ResultTile label="Score" value={snapshot.score.toLocaleString()} />
          <ResultTile label="Kills" value={snapshot.kills.toLocaleString()} />
          <ResultTile label="Best Combo" value={snapshot.bestCombo.toLocaleString()} />
          <ResultTile label="Mistakes" value={snapshot.mistakes.toLocaleString()} />
        </div>
        {!isLoggedIn ? (
          <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
            <p className="text-sm font-bold text-blue-600 mb-4 flex items-center justify-center gap-2">
              <Sparkles size={16} fill="currentColor" /> 랭킹에 기록을 남겨보세요.
            </p>
            <button
              onClick={() => SupabaseService.signInWithKakao()}
              className="w-full py-4 bg-[#FEE500] text-black font-black rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95"
            >
              카카오로 로그인하고 저장
            </button>
          </div>
        ) : (
          <div className="mb-6 text-sm font-black text-green-600">랭킹에 기록이 반영되었습니다.</div>
        )}
        <KeyboardRecommendationBanner variant="light" className="!mt-0 mb-6 !p-4 !rounded-3xl border border-zinc-100" />
        <div className="flex flex-col gap-4">
          <button
            onClick={startGame}
            className="w-full py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xl font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
          >
            <RotateCcw size={24} /> 다시 도전하기
          </button>
          <Link prefetch={false} href="/game" className="flex items-center justify-center gap-2 text-zinc-400 font-black text-sm hover:text-zinc-600 transition-colors">
            목록으로 돌아가기 <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );

  // 셸(모바일 풀스크린)/인라인(데스크톱) 공용 전장
  const battlefield = (
    <div className={`relative bg-slate-950 overflow-hidden ${isMobilePlaying ? "flex-1 min-h-0 rounded-xl" : "h-[520px] sm:h-[580px] rounded-[2.5rem] border-4 border-slate-900 shadow-2xl"}`}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.08) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
      {gameState === "ready" && (
        <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-7 max-w-md w-full border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-600 shadow-xl">
              <Castle size={42} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-3 leading-tight">한글 타자 게임 성문방어</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                발사, 방패, 번개, 수리 명령으로 타워를 운용하고 60초 동안 성문을 지키세요.
              </p>
            </div>
            <button onClick={startGame} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-2xl transition-all shadow-xl shadow-blue-200 dark:shadow-none">
              방어 시작
            </button>
          </div>
        </div>
      )}

      <div className={`absolute rounded-[1.5rem] border border-blue-200/40 bg-blue-200/15 flex items-center justify-center text-blue-100 font-black shadow-[0_0_30px_rgba(59,130,246,0.15)] ${isMobilePlaying ? "inset-x-2 bottom-2 h-10 text-sm" : "inset-x-5 bottom-5 h-20"}`}>
        <Castle className="mr-2" size={isMobilePlaying ? 18 : 28} /> 성문
      </div>

      {[0, 1, 2].map((lane) => (
        <div
          key={lane}
          className={`absolute rounded-[1.5rem] border border-white/10 bg-white/[0.04] ${isMobilePlaying ? "top-2 bottom-14" : "top-5 bottom-32"}`}
          style={{ left: `${lane * 33.333 + 2}%`, width: "29.333%" }}
        />
      ))}

      {effects.map((effect) => (
        <BattleEffectView key={effect.id} effect={effect} compact={isMobilePlaying} />
      ))}

      {snapshot.enemies.map((enemy) => (
        <EnemyView key={enemy.id} enemy={enemy} compact={isMobilePlaying} />
      ))}
    </div>
  );

  const commandPanel = (
    <div className={isMobilePlaying ? "shrink-0 pt-1.5" : "bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-lg"}>
      <div className={`grid grid-cols-4 ${isMobilePlaying ? "gap-1.5" : "gap-3 mb-4"}`}>
        {COMMANDS.map(({ command, description, icon: Icon }) => (
          <button
            key={command}
            type="button"
            onMouseDown={(e) => e.preventDefault()} /* 탭해도 입력창 포커스를 뺏지 않음 */
            onClick={() => submitCommand(command)}
            disabled={gameState !== "playing"}
            className={`rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all ${isMobilePlaying ? "p-1.5 rounded-lg" : "p-3"}`}
          >
            <div className={`flex items-center justify-center gap-1.5 font-black ${isMobilePlaying ? "text-xs" : "text-base gap-2"}`}>
              <Icon size={isMobilePlaying ? 13 : 16} /> {command}
            </div>
            {!isMobilePlaying && <div className="mt-1 text-[10px] font-bold opacity-70">{description}</div>}
          </button>
        ))}
      </div>
      <p className={`text-center font-bold text-zinc-500 dark:text-zinc-400 ${isMobilePlaying ? "text-[10px] mt-1 truncate" : "text-sm"}`}>{feedbackText(lastResult)}</p>
    </div>
  );

  const commandInput = (
    <form onSubmit={handleSubmit} className={isMobilePlaying ? "w-full" : "w-full max-w-2xl mx-auto shrink-0 pb-2"}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        disabled={gameState !== "playing"}
        className={`w-full text-center font-black outline-hidden transition-all ${isMobilePlaying ? "h-12 px-4 text-lg bg-zinc-800 text-white rounded-xl border-2 border-blue-500 placeholder:text-zinc-500" : "h-14 md:h-20 px-5 md:px-8 text-2xl sm:text-4xl bg-white dark:bg-zinc-900 border-4 rounded-[1.25rem] md:rounded-[2rem] shadow-xl border-blue-500 focus:shadow-blue-200/40 focus:ring-4 ring-blue-100 disabled:opacity-60"}`}
        placeholder={gameState === "playing" ? "명령어 입력 후 엔터" : "시작 후 입력 가능"}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </form>
  );

  // ── 모바일 풀스크린 몰입 모드 ──
  if (isMobilePlaying && overlay) {
    const exitGame = () => {
      if (confirm("게임을 그만하고 결과를 볼까요?")) finishGame();
      else resume();
    };
    const mobileHud = (
      <>
        <span className="flex items-center gap-1 text-sm font-black text-orange-400 tabular-nums"><Timer size={13} />{snapshot.timeLeft}s</span>
        <span className="flex items-center gap-1 text-sm font-black text-red-400 tabular-nums"><Heart size={13} />{snapshot.gateHealth}/{TYPING_DEFENSE_MAX_GATE_HEALTH}</span>
        <span className="flex items-center gap-1 text-sm font-black text-blue-400 tabular-nums"><Shield size={13} />{snapshot.shieldCount}</span>
        <span className="flex items-center gap-1 text-sm font-black text-yellow-400 tabular-nums ml-auto"><Trophy size={13} />{snapshot.score.toLocaleString()}</span>
      </>
    );
    return (
      <MobileGameShell overlay={overlay} hud={mobileHud} input={commandInput} paused={paused} onResume={resume} onExit={exitGame}>
        <div className="w-full h-full flex flex-col p-2 gap-0">
          {battlefield}
          {commandPanel}
        </div>
      </MobileGameShell>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 py-2 animate-in fade-in duration-700 min-h-[720px]">
      {gameState === "gameover" && mounted && createPortal(resultModal, document.body)}

      <div className="w-full flex flex-wrap justify-between items-center gap-4 px-6 sm:px-8 py-4 bg-zinc-950 text-white rounded-[2rem] shadow-xl border border-zinc-800 shrink-0">
        <div className="flex flex-wrap gap-5 sm:gap-8 items-center">
          <StatusItem label="Time" value={`${snapshot.timeLeft}s`} icon={<Timer size={19} />} tone="text-orange-400" />
          <StatusItem label="Gate" value={`${snapshot.gateHealth}/${TYPING_DEFENSE_MAX_GATE_HEALTH}`} icon={<Heart size={19} />} tone="text-red-400" />
          <StatusItem label="Shield" value={`${snapshot.shieldCount}`} icon={<Shield size={19} />} tone="text-blue-400" />
          <StatusItem label="Combo" value={`${snapshot.combo}`} icon={<Sparkles size={19} />} tone="text-purple-400" />
          <StatusItem label="Score" value={snapshot.score.toLocaleString()} icon={<Trophy size={19} />} tone="text-yellow-400" />
        </div>
        <div className="hidden md:block text-right">
          <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-tight">Command Defense</div>
          <div className="font-black text-zinc-300 text-sm leading-tight">한글 타자 성문방어</div>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {battlefield}
          {commandPanel}
          {commandInput}
        </div>

        <aside className="w-full lg:w-72 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-yellow-500" size={20} />
            <h3 className="text-lg font-black">성문방어 랭킹</h3>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar min-h-48">
            {rankingLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="animate-spin text-zinc-300" />
              </div>
            ) : rankings.length > 0 ? (
              rankings.map((rank, index) => (
                <div key={`${rank.created_at ?? index}-${index}`} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${index === 0 ? "bg-yellow-400 text-white" : index === 1 ? "bg-zinc-300 text-zinc-600" : index === 2 ? "bg-orange-400 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate text-zinc-900 dark:text-zinc-100 leading-tight">{rank.profiles?.nickname || "익명"}</p>
                    <p className="text-[9px] font-bold text-zinc-400">Combo {rank.max_combo}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-blue-600">{rank.score.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-zinc-400 text-xs font-medium">기록 없음</div>
            )}
          </div>
          {!isLoggedIn && <p className="mt-4 text-[9px] text-zinc-400 font-bold text-center leading-relaxed px-2">로그인하면 내 기록을 실시간 랭킹에 남길 수 있습니다.</p>}
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl flex items-center justify-center gap-2">
              <Keyboard size={14} className="text-blue-600" />
              <span className="font-black text-xs">{profile?.nickname || "Guest"}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

function StatusItem({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] text-zinc-500 uppercase font-black mb-0.5">{label}</span>
      <span className={`text-xl sm:text-2xl font-black flex items-center gap-1.5 ${tone}`}>
        {icon} {value}
      </span>
    </div>
  );
}

function ResultTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800">
      <p className="text-[10px] font-black text-zinc-400 uppercase mb-1 tracking-widest">{label}</p>
      <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  );
}

function EnemyView({ enemy, compact = false }: { enemy: TypingDefenseEnemy; compact?: boolean }) {
  const top = 6 + (1 - enemy.distance) * 68;
  const isClose = enemy.distance < 0.28;
  return (
    <div
      className={`absolute rounded-[1.35rem] border text-white shadow-2xl transition-transform duration-300 animate-[bounce_620ms_ease-in-out_infinite] ${compact ? "w-16 px-1.5 py-1" : "w-28 sm:w-32 px-2.5 py-2"} ${
        isClose
          ? "border-red-200/80 bg-linear-to-br from-red-600 via-orange-600 to-amber-500 shadow-red-500/30 scale-110"
          : "border-orange-200/40 bg-linear-to-br from-slate-800 via-red-900 to-orange-700"
      }`}
      style={{ left: `calc(${enemy.lane * 33.333 + 16.666}% - ${compact ? "2rem" : "3.5rem"})`, top: `${top}%` }}
      aria-label={`성문까지 거리 ${Math.round(enemy.distance * 100)}인 적`}
    >
      <div className={`relative mx-auto ${compact ? "h-10 w-10" : "h-20 w-20"}`}>
        <svg viewBox="0 0 96 96" className="h-full w-full drop-shadow-xl" role="img" aria-hidden="true">
          <defs>
            <linearGradient id={`armor-${enemy.id}`} x1="18" y1="8" x2="78" y2="88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" />
              <stop offset="0.48" stopColor="#dc2626" />
              <stop offset="1" stopColor="#7f1d1d" />
            </linearGradient>
            <linearGradient id={`metal-${enemy.id}`} x1="18" y1="18" x2="70" y2="74" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f8fafc" />
              <stop offset="1" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
          <path d="M48 8 68 20 62 42H34L28 20 48 8Z" fill={`url(#armor-${enemy.id})`} stroke="#fed7aa" strokeWidth="3" />
          <path d="M35 27h26v11H35z" fill="#111827" opacity=".82" />
          <circle cx="41" cy="32" r="2.4" fill="#fde68a" />
          <circle cx="55" cy="32" r="2.4" fill="#fde68a" />
          <path d="M28 42h40l8 30c-7 7-16 11-28 11S27 79 20 72l8-30Z" fill={`url(#armor-${enemy.id})`} stroke="#fed7aa" strokeWidth="3" />
          <path d="M39 45h18l4 21c-3 3-7 5-13 5s-10-2-13-5l4-21Z" fill={`url(#metal-${enemy.id})`} opacity=".9" />
          <path d="M20 48 7 35M76 48l13-13" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
          <path d="M12 31 7 18M84 31l5-13" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 76 24 91M64 76l8 15" stroke="#1f2937" strokeWidth="8" strokeLinecap="round" />
          <path d="M34 76 27 89M62 76l7 13" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <div className="absolute -right-1 top-1 h-5 w-5 rounded-full bg-amber-300/90 blur-[2px]" />
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/30">
        <div className="h-full rounded-full bg-amber-300" style={{ width: `${Math.max(8, enemy.distance * 100)}%` }} />
      </div>
      {!compact && <p className="mt-1 text-center text-[10px] font-black tracking-widest">거리 {Math.round(enemy.distance * 100)}</p>}
    </div>
  );
}

function BattleEffectView({ effect, compact = false }: { effect: BattleEffect; compact?: boolean }) {
  if (effect.type === "lightning") {
    return (
      <div
        className={`absolute rounded-[1.5rem] border-2 border-yellow-300/80 bg-linear-to-b from-white/10 via-yellow-300/60 to-blue-300/20 animate-pulse flex items-center justify-center ${compact ? "top-2 bottom-14" : "top-5 bottom-32"}`}
        style={{ left: `${effect.lane * 33.333 + 2}%`, width: "29.333%" }}
      >
        <Zap className="text-yellow-100 drop-shadow-lg" size={compact ? 28 : 46} />
      </div>
    );
  }

  if (effect.type === "shield" || effect.type === "repair") {
    const colorClass = effect.type === "shield" ? "border-blue-300 text-blue-200 shadow-blue-400/30" : "border-green-300 text-green-200 shadow-green-400/30";
    return (
      <div className={`absolute rounded-[1.5rem] border-4 ${colorClass} shadow-[0_0_30px] flex items-center justify-center font-black animate-pulse ${compact ? "inset-x-2 bottom-2 h-10 text-sm" : "inset-x-5 bottom-5 h-20 text-xl"}`}>
        {effect.type === "shield" ? <Shield className="mr-2" size={compact ? 16 : 24} /> : <Heart className="mr-2" size={compact ? 16 : 24} />} {effect.label}
      </div>
    );
  }

  const top = 6 + (1 - effect.distance) * 68;
  return (
    <div
      className={`absolute rounded-full bg-yellow-300/30 flex flex-col items-center justify-center text-yellow-200 font-black animate-ping ${compact ? "w-12 h-12" : "w-20 h-20"}`}
      style={{ left: `calc(${effect.lane * 33.333 + 16.666}% - ${compact ? "1.5rem" : "2.5rem"})`, top: `${top}%` }}
    >
      <Sparkles size={compact ? 18 : 28} />
      <span className="text-xs">{effect.label}</span>
    </div>
  );
}
