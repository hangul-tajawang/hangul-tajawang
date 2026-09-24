"use client";
import { useGameAnalytics } from '@/hooks/useGameAnalytics';

import { useGameT, raceRankLabel } from "@/lib/i18n/game-ui";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Trophy, RotateCcw, Play, Loader2, User, Star, Flame, ChevronRight, Timer, Volume2, VolumeX } from "lucide-react";
import { SupabaseService } from "@/lib/supabase";
import { TypingUtils } from "@/lib/typing-speed";
import { useMobileGamePlay } from "@/hooks/useMobileGamePlay";
import { MobileGameShell } from "./MobileGameShell";
import Image from "next/image";
import Link from "next/link";
import { AdSenseUnit } from "../layout/AdSenseUnit";
import { sound } from "@/lib/sound-manager";
import {
  PLAYER_FRAME,
  PLAYER_LANE,
  PLAYER_SPRITES,
  RACE_LANES,
  RACE_RUNNERS,
  MAX_PLAUSIBLE_CPM,
  ghostRunners,
  isBulkInsert,
  type RaceRunner,
  livePlace,
  matchedLength,
  passageDistance,
  pickPassage,
  prefixStrokes,
  splitPassage,
  stepRunner,
} from "@/lib/typing-race";
import { drawRace, type RaceSprite } from "./race/drawRace";

interface GameRanking {
  score: number;
  level: number;
  profiles?: { nickname?: string | null; avatar_url?: string | null } | null;
}

interface Hud {
  pos: number;
  place: number;
  kpm: number;
  elapsed: number;
  rels: number[];
}

export const TypingRaceGame: React.FC = () => {
  const { isEn, t } = useGameT();
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  useGameAnalytics('typing-race', gameState);
  // 경주용 글 한 편 — 입력 단위(chunk)로 나눠 차례로 친다
  const [passage, setPassage] = useState<{ id: string; title: string; chunks: string[] } | null>(null);
  const [chunkIdx, setChunkIdx] = useState(0);
  const [distance, setDistance] = useState(400);
  const sentence = passage?.chunks[chunkIdx] ?? "";
  const [inputValue, setInputValue] = useState("");
  const [stumbling, setStumbling] = useState(false);
  const [hud, setHud] = useState<Hud>({ pos: 0, place: RACE_RUNNERS.length + 1, kpm: 0, elapsed: 0, rels: RACE_RUNNERS.map(() => 0) });
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [sentencesTyped, setSentencesTyped] = useState(0);
  const [finalRank, setFinalRank] = useState(RACE_RUNNERS.length + 1);
  const [finalKpm, setFinalKpm] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  const [suspicious, setSuspicious] = useState(false);
  // 이번 경주의 상대 = 동물 4 + 시작 시점 랭킹 1~3위
  const [runners, setRunners] = useState<RaceRunner[]>(RACE_RUNNERS);
  const runnersRef = useRef<RaceRunner[]>(RACE_RUNNERS);
  const [banner, setBanner] = useState<{ id: number; text: string; good: boolean } | null>(null);
  const [muted, setMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [rankings, setRankings] = useState<GameRanking[]>([]);
  const [user, setUser] = useState(false);
  const [profile, setProfile] = useState<{ nickname?: string | null } | null>(null);
  const [rankingLoading, setRankingLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // 트랙 박스는 대기(페이지 안) ↔ 플레이(전체화면 포털)로 DOM 노드가 바뀌므로 콜백 ref로 받아 매번 다시 잰다
  const [wrapEl, setWrapEl] = useState<HTMLDivElement | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const timeRef = useRef(0);
  const startTime = useRef(0);
  const pauseStart = useRef(0);
  const committed = useRef(0);
  const partial = useRef(0);
  const posRef = useRef(0);
  const speedRef = useRef(0);
  const stumbleRef = useRef(false);
  const runnerDists = useRef<number[]>(RACE_RUNNERS.map(() => 0));
  const prevRels = useRef<number[]>(RACE_RUNNERS.map(() => 0));
  const distanceRef = useRef(400);
  const hudAt = useRef(0);
  const bannerId = useRef(0);
  const playingRef = useRef(false);
  const pausedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 모바일 풀스크린 몰입 모드 (visualViewport 동기화 / 스크롤 잠금 / 포커스 이탈 일시정지)
  const { isMobile, isMobilePlaying, paused, overlay, resume } =
    useMobileGamePlay({ playing: gameState === "playing", inputRef });

  useEffect(() => {
    playingRef.current = gameState === "playing";
  }, [gameState]);

  // 일시정지 동안 시간·상대 전진을 멈추고, 재개 시 멈춘 만큼 startTime을 보정한다.
  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) return;
    pauseStart.current = performance.now();
    return () => {
      startTime.current += performance.now() - pauseStart.current;
    };
  }, [paused]);

  // 다른 탭으로 가면 화면 갱신이 멈춰 상대도 멈추므로, 그동안의 시간은 경주 시간에서 뺀다
  useEffect(() => {
    let hiddenAt = 0;
    const onVis = () => {
      if (document.hidden) hiddenAt = performance.now();
      else if (hiddenAt) {
        // 모바일 일시정지 중이었다면 그 시간은 일시정지 복귀 때 이미 보정되므로 중복으로 빼지 않는다
        if (playingRef.current && !pausedRef.current) startTime.current += performance.now() - hiddenAt;
        lastTs.current = null;
        hiddenAt = 0;
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    setMounted(true);
    setMuted(sound.muted);
    // 스프라이트 미리 로드
    const srcs = [
      ...RACE_RUNNERS.map((r) => r.sprite),
      ...ghostRunners([{ score: 1 }, { score: 1 }, { score: 1 }]).map((r) => r.sprite),
      ...Object.values(PLAYER_SPRITES).map((p) => p.src),
    ];
    for (const src of srcs) {
      const img = new window.Image();
      img.src = src;
      imagesRef.current[src] = img;
    }
    const loadUser = async () => {
      const currentUser = await SupabaseService.getCurrentUser();
      if (currentUser) {
        setUser(true);
        const p = (await SupabaseService.getMyProfile()) as { nickname?: string | null } | null;
        setProfile(p);
      }
    };
    loadUser();
  }, []);

  const fetchRankings = useCallback(async () => {
    setRankingLoading(true);
    try {
      setRankings((await SupabaseService.getGameRankings("typing-race")) as GameRanking[]);
    } catch (e) { console.error(e); }
    finally { setRankingLoading(false); }
  }, []);

  useEffect(() => {
    if (gameState === "finished" || gameState === "ready") fetchRankings();
  }, [gameState, fetchRankings]);

  // 대기 화면에서도 지금 랭킹 1~3위가 출발선에 서 있도록 (경주는 시작 시점 순위로 고정)
  useEffect(() => {
    if (gameState !== "ready") return;
    const field = [...RACE_RUNNERS, ...ghostRunners(rankings.map((r) => ({ nickname: r.profiles?.nickname, score: r.score })))];
    runnersRef.current = field;
    setRunners(field);
    runnerDists.current = field.map(() => 0);
  }, [rankings, gameState]);

  const showBanner = useCallback((text: string, good: boolean) => {
    const id = ++bannerId.current;
    setBanner({ id, text, good });
    setTimeout(() => setBanner((b) => (b?.id === id ? null : b)), 1300);
  }, []);

  // ── 캔버스 크기: 담는 박스에 맞추고 레티나 대응 ──
  useEffect(() => {
    const wrap = wrapEl;
    if (!wrap) return;
    const fit = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [wrapEl]);

  const handleFinish = useCallback(async (finalDist: number, completed: boolean, bestCombo: number) => {
    // 일시정지 중에 끝내면 멈춰 있던 시간은 빼고 계산
    const pausedFor = pausedRef.current ? performance.now() - pauseStart.current : 0;
    const seconds = (performance.now() - startTime.current - pausedFor) / 1000;
    const kpm = seconds > 0 ? Math.round((finalDist / seconds) * 60) : 0;
    // 완주: 먼저 들어온 상대 수 + 1 / 중도 포기: 지금 순위 (랭킹에는 저장하지 않음)
    const rank = completed
      ? 1 + runnerDists.current.filter((d) => d >= distanceRef.current).length
      : livePlace(finalDist, runnerDists.current);
    setFinalKpm(kpm);
    setFinalRank(rank);
    setGameState("finished");
    playingRef.current = false;
    stumbleRef.current = false;
    setStumbling(false);
    setGaveUp(!completed);
    // 사람이 낼 수 없는 속도(매크로·자동입력 의심)는 랭킹에 저장하지 않는다
    const tooFast = kpm > MAX_PLAUSIBLE_CPM;
    setSuspicious(completed && tooFast);
    if (completed) sound.fanfare();
    if (user && completed && !tooFast) {
      try {
        await SupabaseService.saveGameScore("typing-race", kpm, rank, bestCombo);
        await fetchRankings(); // 방금 저장한 기록까지 반영해 다시 로드
      } catch (e) {
        console.error("게임 점수 저장 실패:", e);
      }
    }
  }, [user, fetchRankings]);

  // ── 렌더 루프 (대기 화면에서도 돌며 출발선 풍경을 그린다) ──
  useEffect(() => {
    const spriteOf = (src: string, frameW: number, frameH: number, frames: number, flip: boolean): RaceSprite => ({
      img: imagesRef.current[src] ?? null,
      frameW,
      frameH,
      frames,
      flip,
    });
    const frame = (ts: number) => {
      if (lastTs.current === null) lastTs.current = ts;
      const dt = Math.min(0.1, (ts - lastTs.current) / 1000);
      lastTs.current = ts;
      const live = playingRef.current && !pausedRef.current;
      if (!pausedRef.current) timeRef.current += dt;

      if (live) {
        runnerDists.current = runnerDists.current.map((d, i) => stepRunner(d, runnersRef.current[i].cpm, dt, 0.92 + Math.random() * 0.16));
        // 친 만큼 부드럽게 따라가며 달린다 (넘어진 동안은 멈춤)
        const target = committed.current + partial.current;
        const prev = posRef.current;
        posRef.current = prev + (target - prev) * Math.min(1, dt * (stumbleRef.current ? 3 : 9));
        const inst = dt > 0 ? (posRef.current - prev) / dt : 0;
        speedRef.current += ((stumbleRef.current ? 0 : inst) - speedRef.current) * Math.min(1, dt * 3);

        // 추월 판정 (실제 위치 기준)
        const me = committed.current + partial.current;
        runnerDists.current.forEach((d, i) => {
          const rel = d - me;
          const was = prevRels.current[i];
          const r = runnersRef.current[i];
          if (was > 0 && rel <= 0 && d < distanceRef.current) {
            showBanner(`${t(r.name)} ${t("추월!")}`, true);
            sound.milestone();
          } else if (was <= 0 && rel > 0 && me > 0) {
            showBanner(`${t(r.name)}${t("에게 추월당함")}`, false);
            sound.blip({ freq: 220, type: "sawtooth", dur: 0.18, vol: 0.06, slideTo: 140 });
          }
          prevRels.current[i] = rel;
        });

        if (ts - hudAt.current > 100) {
          hudAt.current = ts;
          const elapsed = (performance.now() - startTime.current) / 1000;
          setHud({
            pos: me,
            place: livePlace(me, runnerDists.current),
            kpm: elapsed > 1 ? Math.round((me / elapsed) * 60) : 0,
            elapsed,
            rels: runnerDists.current.map((d) => d - me),
          });
        }
      } else {
        speedRef.current *= 0.9;
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const { w, h } = sizeRef.current;
      if (ctx && w > 0 && h > 0) {
        const pSprite = stumbleRef.current ? PLAYER_SPRITES.hit : speedRef.current > 0.4 || !playingRef.current ? PLAYER_SPRITES.run : PLAYER_SPRITES.idle;
        drawRace(ctx, w, h, {
          pos: posRef.current,
          speed: playingRef.current ? speedRef.current : 6,
          time: timeRef.current,
          distance: distanceRef.current,
          player: {
            sprite: spriteOf(pSprite.src, PLAYER_FRAME, PLAYER_FRAME, pSprite.frames, false),
            lane: PLAYER_LANE,
            stumbling: stumbleRef.current,
            label: isEn ? "YOU" : "나",
            stumbleLabel: isEn ? "Typo!" : "앗! 오타",
          },
          lanes: RACE_LANES,
          runners: runnersRef.current.map((r, i) => ({
            sprite: spriteOf(r.sprite, r.frameW, r.frameH, r.frames, r.flip),
            label: r.id.startsWith("rank") ? `${r.emoji} ${r.name} ${r.cpm}${isEn ? "" : "타"}` : isEn ? `${t(r.name)} ${r.cpm}` : `${r.name} ${r.cpm}타`,
            lane: r.lane,
            color: r.color,
            cpm: r.cpm,
            flying: r.flying,
            // 대기 화면에서는 출발선에 나란히
            rel: playingRef.current || gameState === "finished" ? (runnerDists.current[i] ?? 0) - posRef.current : 0,
          })),
          aheadLabel: (rel) => (isEn ? `+${Math.ceil(rel)}` : `${Math.ceil(rel)}타 앞`),
          behindLabel: (rel) => (isEn ? `${Math.floor(rel)}` : `${Math.ceil(-rel)}타 뒤`),
        });
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTs.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEn, gameState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 붙여넣기·자동완성 등 한 번에 여러 글자가 들어오면 무시 (직접 친 글자만 인정)
    if (gameState === "playing" && isBulkInsert(inputValue, value)) {
      showBanner(t("붙여넣기는 안 돼요! 직접 쳐 주세요"), false);
      return;
    }
    setInputValue(value);
    if (gameState !== "playing") return;

    if (TypingUtils.normalize(value) === TypingUtils.normalize(sentence)) {
      // 문장 완성 → 타수만큼 전진
      committed.current += TypingUtils.getStrokeCount(TypingUtils.normalize(sentence));
      partial.current = 0;
      stumbleRef.current = false;
      setStumbling(false);
      setSentencesTyped((n) => n + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setInputValue("");
      sound.step();

      if (!passage || chunkIdx + 1 >= passage.chunks.length) {
        posRef.current = committed.current;
        handleFinish(committed.current, true, Math.max(maxCombo, newCombo));
        return;
      }
      setChunkIdx(chunkIdx + 1);
      return;
    }

    // 맞게 친 부분까지만 달린다. 오타가 나면 넘어지고, 고칠 때까지 앞으로 못 간다.
    const pre = prefixStrokes(sentence, value);
    if (pre !== null) {
      partial.current = pre;
      if (stumbleRef.current) {
        stumbleRef.current = false;
        setStumbling(false);
      }
      return;
    }
    partial.current = TypingUtils.getStrokeCount(TypingUtils.normalize(sentence).slice(0, matchedLength(sentence, value)));
    if (!stumbleRef.current) {
      stumbleRef.current = true;
      setStumbling(true);
      setMistakes((m) => m + 1);
      setCombo(0);
      sound.blip({ freq: 150, type: "square", dur: 0.14, vol: 0.08, slideTo: 80 });
    }
  };

  const startGame = () => {
    sound.initSynth();
    const picked = pickPassage(passage?.id);
    const chunks = splitPassage(picked.text);
    const total = passageDistance(chunks);
    setPassage({ id: picked.id, title: picked.title, chunks });
    setChunkIdx(0);
    setDistance(total);
    distanceRef.current = total;
    committed.current = 0;
    partial.current = 0;
    posRef.current = 0;
    speedRef.current = 0;
    stumbleRef.current = false;
    setStumbling(false);
    const field = [...RACE_RUNNERS, ...ghostRunners(rankings.map((r) => ({ nickname: r.profiles?.nickname, score: r.score })))];
    runnersRef.current = field;
    setRunners(field);
    runnerDists.current = field.map(() => 0);
    prevRels.current = field.map(() => 0);
    setHud({ pos: 0, place: field.length + 1, kpm: 0, elapsed: 0, rels: field.map(() => 0) });
    setCombo(0); setMaxCombo(0); setMistakes(0); setSentencesTyped(0);
    setInputValue("");
    startTime.current = performance.now();
    setGameState("playing");
    playingRef.current = true;
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const toggleMute = () => {
    setMuted(sound.toggleMuted());
    inputRef.current?.focus();
  };

  const accuracy = TypingUtils.calculateAccuracy(sentencesTyped, sentencesTyped + mistakes);
  const rankLabel = raceRankLabel(isEn, finalRank);
  const total = runners.length + 1;
  const placeLabel = (n: number) => (isEn ? ["1st", "2nd", "3rd"][n - 1] || `${n}th` : `${n}위`);

  const finishModal = gameState === "finished" && (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500" />
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar bg-white rounded-2xl p-8 shadow-2xl text-center border border-zinc-200 animate-in zoom-in duration-500">
        <div className="inline-flex p-6 bg-blue-50 rounded-full mb-8"><Trophy className="w-20 h-20 text-yellow-500" /></div>
        <h2 className="text-5xl font-bold text-zinc-900 mb-2 tracking-tighter">{gaveUp ? (isEn ? "Race stopped" : "경주 중단") : rankLabel}</h2>
        <p className="text-zinc-500 font-bold mb-10">
          {gaveUp ? t("중간에 멈춘 경주라 랭킹에는 기록되지 않아요.") : suspicious ? t("사람이 칠 수 없는 속도라 랭킹에는 기록되지 않아요.") : finalRank === 1 ? t("파랑새까지 제쳤습니다! 완벽한 질주였어요.") : finalRank === total ? t("달팽이에게 졌지만, 다음 판이 있습니다!") : t("좋은 기록이에요. 한 등수만 더 올려볼까요?")}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100"><p className="text-[10px] font-bold text-zinc-400 uppercase mb-1 tracking-widest">{t("타수")}</p><p className="text-2xl font-bold text-blue-600">{finalKpm}</p></div>
          <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100"><p className="text-[10px] font-bold text-zinc-400 uppercase mb-1 tracking-widest">{t("정확도")}</p><p className="text-2xl font-bold text-zinc-900">{accuracy}%</p></div>
          <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100"><p className="text-[10px] font-bold text-zinc-400 uppercase mb-1 tracking-widest">Max Combo</p><p className="text-2xl font-bold text-zinc-900">{maxCombo}</p></div>
        </div>
        <p className="text-sm font-bold text-zinc-400 mb-8">{TypingUtils.getGrade(finalKpm, accuracy)}</p>
        {gaveUp || suspicious ? null : !user ? (
          <div className="mb-10 p-8 bg-blue-50 rounded-2xl border border-blue-100"><p className="text-sm font-bold text-blue-600 mb-6 flex items-center justify-center gap-2"><Star size={16} fill="currentColor" /> {t("랭킹에 이름을 남기고 싶으신가요?")}</p><button onClick={() => SupabaseService.signInWithKakao()} className="w-full py-5 bg-[#FEE500] text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-95"><svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 3c-5.5 0-10 3.5-10 7.8 0 2.8 1.8 5.3 4.5 6.6l-1.1 4.1c-.1.5.4.8.8.6l4.8-3.2c.3 0 .7.1 1 .1 5.5 0 10-3.5 10-7.8S17.5 3 12 3" /></svg>{t("3초 만에 로그인하고 기록 저장")}</button></div>
        ) : (
          <div className="mb-10 p-6 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-center gap-3 animate-pulse"><Star size={20} className="text-green-600" fill="currentColor" /><p className="text-sm font-bold text-green-600">{t("방금 세운 기록이 랭킹에 성공적으로 반영되었습니다!")}</p></div>
        )}
        <div className="mb-6 flex justify-center empty:hidden">
          <AdSenseUnit label="content-banner-mobile" width={320} height={100} tight />
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={startGame} className="w-full py-5 bg-zinc-900 text-white text-xl font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"><RotateCcw size={24} /> {t("다시 도전하기")}</button>
          <Link prefetch={false} href={isEn ? "/en/game" : "/game"} className="flex items-center justify-center gap-2 text-zinc-400 font-bold text-sm hover:text-zinc-600 transition-colors">{t("목록으로 돌아가기")} <ChevronRight size={16} /></Link>
        </div>
      </div>
    </div>
  );

  // ── 트랙 + HUD ──
  const track = (compact: boolean, fill: boolean) => (
    <div
      ref={setWrapEl}
      className={`relative overflow-hidden bg-sky-300 select-none ${
        fill || compact ? "flex-1 min-h-0" : "h-[380px] md:h-[460px]"
      } ${compact ? "rounded-xl" : "rounded-2xl border-4 border-zinc-900"}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" aria-label={t("타자 레이스")} />

      {gameState === "playing" && (
        <>
          {/* 진행 미니맵 */}
          <div className={`absolute z-10 left-1/2 -translate-x-1/2 ${compact ? "top-5 w-[60%]" : "top-7 w-[52%]"}`}>
            <div className="relative h-2.5 rounded-full bg-black/45 border border-white/60">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lime-400 to-emerald-300" style={{ width: `${Math.min(100, (hud.pos / distance) * 100)}%` }} />
              <span className={`absolute -right-1 -top-1.5 ${compact ? "text-sm" : "text-base"}`}>🏁</span>
              {runners.map((r, i) => (
                <span
                  key={r.id}
                  className={`absolute -translate-x-1/2 transition-[left] duration-100 ${compact ? "-top-4 text-xs" : "-top-5 text-sm"}`}
                  style={{ left: `${Math.min(100, Math.max(0, ((hud.pos + hud.rels[i]) / distance) * 100))}%` }}
                >
                  {r.emoji}
                </span>
              ))}
              <span
                className={`absolute -translate-x-1/2 transition-[left] duration-100 ${compact ? "top-2 text-xs" : "top-2.5 text-sm"}`}
                style={{ left: `${Math.min(100, (hud.pos / distance) * 100)}%` }}
              >
                🐸
              </span>
            </div>
          </div>

          {/* 순위 */}
          <div className={`absolute z-10 left-3 font-black italic text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.55)] ${compact ? "top-11" : "top-12"}`} style={{ WebkitTextStroke: "1.5px rgba(15,23,42,0.6)" }}>
            <span className={compact ? "text-3xl" : "text-5xl md:text-6xl"}>{placeLabel(hud.place)}</span>
            <span className={`ml-1 ${compact ? "text-xs" : "text-lg"}`}>/{total}</span>
          </div>

          {/* 타수·시간 */}
          {!compact && (
            <div className="absolute z-10 right-3 top-12 flex flex-col items-end gap-1 text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
              <span className="text-3xl font-black tabular-nums">{hud.kpm}<span className="text-sm font-bold ml-1">{isEn ? "CPM" : "타"}</span></span>
              <span className="text-sm font-bold tabular-nums flex items-center gap-1"><Timer size={14} />{hud.elapsed.toFixed(0)}s</span>
              {combo > 1 && <span className="text-orange-300 font-black italic flex items-center gap-1"><Flame size={14} fill="currentColor" />{combo}</span>}
            </div>
          )}

          {/* 추월 배너 */}
          {banner && (
            <div key={banner.id} className="cd-banner absolute inset-x-0 top-[26%] z-20 flex justify-center pointer-events-none">
              <span className={`px-5 py-2 rounded-2xl font-black italic drop-shadow-lg ${compact ? "text-lg" : "text-3xl"} ${banner.good ? "bg-amber-400 text-zinc-900" : "bg-rose-600 text-white"}`}>
                {banner.text}
              </span>
            </div>
          )}
        </>
      )}

      {gameState === "ready" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-20 p-4">
          <div className="bg-white p-7 rounded-2xl shadow-2xl flex flex-col items-center gap-5 max-w-sm w-full border border-zinc-200">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Play size={32} fill="currentColor" className="ml-1" /></div>
            <div className="text-center"><h3 className="text-2xl font-bold text-zinc-900 mb-1">{t("타자 레이스")}</h3><p className="text-zinc-500 text-xs font-medium break-keep leading-relaxed">{t("짧은 글 한 편을 끝까지 쓰면 결승선! 달팽이(200타)·토끼(350타)·코뿔소(500타)·파랑새(750타), 그리고 지금 랭킹 1~3위가 자기 기록 타수로 함께 달려요. 오타가 나면 넘어지니 고쳐야 다시 달릴 수 있어요.")}</p></div>
            <button onClick={startGame} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl transition-all shadow-xl">{t("경주 시작")}</button>
          </div>
        </div>
      )}
    </div>
  );

  // ── 글 카드: 이미 쓴 부분은 초록, 지금 줄은 글자별로(오타 위치 빨강), 남은 부분은 흐리게 ──
  const passageCard = (compact: boolean) => {
    if (gameState !== "playing" || !passage) {
      return (
        <div data-race-word className="shrink-0 self-center rounded-2xl border-4 border-zinc-900 bg-white px-8 py-2 text-3xl">🏁</div>
      );
    }
    const norm = TypingUtils.normalize(sentence);
    const ok = matchedLength(sentence, inputValue);
    const typedLen = TypingUtils.normalize(inputValue).length;
    const current = (
      <span data-race-word className={compact ? "" : "rounded-md bg-amber-100/70 px-0.5"}>
        {Array.from(norm).map((ch, i) => (
          <span
            key={i}
            className={
              i < ok
                ? "text-emerald-500"
                : stumbling && i === ok && i < typedLen
                  ? "bg-rose-500 text-white rounded"
                  : compact
                    ? "text-white"
                    : "text-zinc-900"
            }
          >
            {ch}
          </span>
        ))}
      </span>
    );
    if (compact) {
      const next = passage.chunks[chunkIdx + 1];
      return (
        <div className="shrink-0 flex flex-col gap-1 px-1">
          <div className={`rounded-xl border-2 px-3 py-1.5 text-lg font-bold leading-snug break-keep text-center ${stumbling ? "bg-rose-950/60 border-rose-500" : "bg-zinc-900 border-zinc-700"}`}>
            {current}
          </div>
          <div className={`text-[11px] font-bold text-center truncate ${stumbling ? "text-rose-400" : "text-zinc-500"}`}>
            {stumbling ? t("오타! 빨간 글자부터 고쳐야 다시 달릴 수 있어요") : next ? `${t("다음: ")}${next}` : t("마지막 문장이에요!")}
          </div>
        </div>
      );
    }
    return (
      <div className={`shrink-0 rounded-2xl border-4 px-5 md:px-7 py-3 transition-colors ${stumbling ? "bg-rose-50 border-rose-500" : "bg-white border-zinc-900"}`}>
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <span className="text-xs font-bold text-zinc-400">「{passage.title}」 {chunkIdx + 1}/{passage.chunks.length}</span>
          {stumbling && <span className="text-xs font-bold text-rose-500">{t("오타! 빨간 글자부터 고쳐야 다시 달릴 수 있어요")}</span>}
        </div>
        <p className="text-lg md:text-2xl font-bold leading-relaxed break-keep">
          {passage.chunks.map((c, i) =>
            i < chunkIdx ? (
              <span key={i} className="text-emerald-600/70">{c} </span>
            ) : i === chunkIdx ? (
              <React.Fragment key={i}>{current} </React.Fragment>
            ) : (
              <span key={i} className="text-zinc-300">{c} </span>
            )
          )}
        </p>
      </div>
    );
  };

  const raceInput = (
    <input data-typing-input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} onPaste={(e) => { e.preventDefault(); showBanner(t("붙여넣기는 안 돼요! 직접 쳐 주세요"), false); }} onDrop={(e) => e.preventDefault()} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); } }} disabled={gameState !== "playing"} className={`w-full text-center font-bold outline-hidden transition-all ${isMobilePlaying ? `h-12 px-4 text-lg bg-zinc-800 text-white rounded-xl border-2 placeholder:text-zinc-500 ${stumbling ? "border-rose-500" : "border-zinc-700 focus:border-blue-500"}` : `h-14 md:h-20 px-5 md:px-8 text-xl md:text-3xl bg-white border-4 rounded-2xl shadow-xl ${gameState === "playing" ? (stumbling ? "border-rose-500" : "border-zinc-900 focus:border-blue-500") : "border-zinc-100 opacity-50"}`}`} placeholder={gameState === "playing" ? t("위 문장을 입력하세요!") : t("준비가 되면 시작하세요")} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
  );

  const quitRace = () => {
    if (confirm(t("경주를 그만하고 결과를 볼까요?"))) handleFinish(committed.current, false, maxCombo);
    else inputRef.current?.focus();
  };

  // ── 모바일 풀스크린 몰입 모드 ──
  if (isMobilePlaying && overlay) {
    const exitGame = () => {
      if (confirm(t("경주를 그만하고 결과를 볼까요?"))) handleFinish(committed.current, false, maxCombo);
      else resume();
    };
    const mobileHud = (
      <>
        <span className="flex items-center gap-1"><span className="text-[9px] text-zinc-500 font-bold uppercase">{t("타수")}</span><span className="text-sm font-bold text-blue-400 tabular-nums">{hud.kpm}</span></span>
        <span className="flex items-center gap-1"><Timer size={13} className="text-yellow-400" /><span className="text-sm font-bold text-yellow-400 tabular-nums">{hud.elapsed.toFixed(0)}s</span></span>
        <span className="flex items-center gap-1"><span className="text-[9px] text-zinc-500 font-bold uppercase">{t("정확도")}</span><span className="text-sm font-bold text-emerald-400 tabular-nums">{accuracy}%</span></span>
        {combo > 1 && <span className="text-orange-500 font-bold text-xs italic flex items-center gap-0.5 ml-auto"><Flame size={11} fill="currentColor" />{combo}</span>}
      </>
    );
    return (
      <MobileGameShell overlay={overlay} hud={mobileHud} input={raceInput} paused={paused} onResume={resume} onExit={exitGame}>
        <div className="w-full h-full flex flex-col gap-2 p-2">
          {track(true, false)}
          {passageCard(true)}
        </div>
      </MobileGameShell>
    );
  }

  // ── 데스크톱/노트북 전체화면 (성문방어와 같은 구성) ──
  if (gameState === "playing" && !isMobile && mounted) {
    return createPortal(
      <div className="fixed inset-0 z-[9985] bg-zinc-950 flex flex-col p-3 gap-3">
        <div className="shrink-0 flex items-center gap-4 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white">
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={quitRace} aria-label={t("게임 종료")} className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <span className="font-bold">{t("타자 레이스")}</span>
          <span className="text-sm text-zinc-400">{passage ? `「${passage.title}」 · ${isEn ? `${distance} strokes` : `${distance}타`}` : null}</span>
          <div className="ml-auto flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">{t("정확도")}</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">{accuracy}%</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">Max Combo</span>
              <span className="text-lg font-bold text-orange-400 tabular-nums">{maxCombo}</span>
            </div>
            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={toggleMute} aria-label={t("음소거")} className="w-10 h-10 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700">
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
            {track(false, true)}
            {passageCard(false)}
            {raceInput}
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

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-2 md:gap-4 py-2 animate-in fade-in duration-700">
      {gameState === "finished" && mounted && createPortal(finishModal, document.body)}

      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0">
          {track(false, false)}
          {raceInput}
        </div>

        {/* Rankings Sidebar */}
        <div className="flex w-full lg:w-72 bg-white rounded-2xl border border-zinc-200 p-6 shadow-lg flex-col shrink-0">
          <div className="flex items-center gap-2 mb-6"><Trophy className="text-yellow-500" size={20} /><h3 className="text-lg font-bold">{t("실시간 타수 랭킹")}</h3></div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar max-h-96 lg:max-h-none">
            {rankingLoading ? (<div className="flex flex-col items-center justify-center py-10 gap-2"><Loader2 className="animate-spin text-zinc-300" size={20} /></div>) :
              rankings.length > 0 ? rankings.map((rank, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i === 0 ? "bg-yellow-400 text-white" : i === 1 ? "bg-zinc-300 text-zinc-600" : i === 2 ? "bg-orange-400 text-white" : "bg-zinc-100 text-zinc-400"}`}>{i + 1}</div>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {rank.profiles?.avatar_url ? <Image src={rank.profiles.avatar_url} alt="p" width={24} height={32} className="w-6 h-6 rounded-lg object-cover aspect-square" /> : <div className="w-6 h-6 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400"><User size={12} /></div>}
                    <div className="min-w-0"><p className="text-sm font-bold truncate text-zinc-900 leading-tight">{rank.profiles?.nickname || t("익명")}</p><p className="text-[9px] font-bold text-zinc-400">{isEn ? `Finished #${rank.level}` : `${rank.level}등 완주`}</p></div>
                  </div>
                  <div className="text-right shrink-0"><p className="text-sm font-bold text-blue-600">{rank.score.toLocaleString()}{isEn ? " CPM" : "타"}</p></div>
                </div>
              )) : <div className="text-center py-10 text-zinc-400 text-xs font-medium">{t("기록 없음")}</div>}
          </div>
          {!user && (
            <p className="mt-4 text-[9px] text-zinc-400 font-bold text-center leading-relaxed px-2 animate-pulse">
              {t("로그인을 하시면 나만의 소중한 기록을")} <br />{t("실시간 랭킹에 남길 수 있습니다.")}
            </p>
          )}
          <div className="mt-4 pt-4 border-t border-zinc-100 text-center"><div className="bg-zinc-50 p-3 rounded-xl flex items-center justify-center gap-2"><span className="text-base">🐸</span><span className="font-bold text-xs">{profile?.nickname || "Guest"}</span></div></div>
        </div>
      </div>
    </div>
  );
};
