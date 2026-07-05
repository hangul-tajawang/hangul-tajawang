"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Trophy, RotateCcw, Play, Loader2, User, Star, Flame, Flag, ChevronRight, Timer } from "lucide-react";
import { KeyboardRecommendationBanner } from "../layout/KeyboardRecommendationBanner";
import { SupabaseService } from "@/lib/supabase";
import { getWordForLevel } from "@/lib/game-words";
import { TypingUtils } from "@/lib/typing-speed";
import { useMobileGamePlay } from "@/hooks/useMobileGamePlay";
import { GamePauseOverlay } from "./GamePauseOverlay";
import Image from "next/image";
import Link from "next/link";

// 결승선까지의 거리 (타수 단위). 평균 타이피스트 기준 약 1분 30초 분량.
const RACE_DISTANCE = 500;

interface Bot {
  name: string;
  emoji: string;
  cpm: number; // 분당 타수
  color: string;
}

const BOTS: Bot[] = [
  { name: "거북이", emoji: "🐢", cpm: 200, color: "text-emerald-400" },
  { name: "토끼", emoji: "🐰", cpm: 350, color: "text-pink-400" },
  { name: "치타", emoji: "🐆", cpm: 500, color: "text-amber-400" },
];

const pickWord = (level: number, avoid: string): string => {
  let w = getWordForLevel(level);
  let attempts = 0;
  while (w === avoid && attempts < 8) { w = getWordForLevel(level); attempts++; }
  return w;
};

export const TypingRaceGame: React.FC = () => {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [playerDist, setPlayerDist] = useState(0);
  const [botDists, setBotDists] = useState<number[]>([0, 0, 0]);
  const [word, setWord] = useState("");
  const [nextWord, setNextWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [finalRank, setFinalRank] = useState(4);
  const [finalKpm, setFinalKpm] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [rankings, setRankings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [rankingLoading, setRankingLoading] = useState(false);

  const requestRef = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const lastFrame = useRef<number>(0);
  const wasWrong = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pauseStart = useRef<number>(0);

  // 모바일 플레이 공통 로직 (뷰포트 높이 고정 / 스크롤 잠금 / 포커스 이탈 일시정지)
  const { isMobilePlaying, paused, wrapperRef, wrapperHeight, resume } =
    useMobileGamePlay({ playing: gameState === "playing", inputRef });

  // 일시정지 동안 경과시간·봇 전진을 멈추고, 재개 시 멈춘 만큼 startTime을 보정한다.
  // lastFrame을 0으로 리셋해 재개 첫 프레임의 dt 폭주(봇 순간이동)를 방지한다.
  useEffect(() => {
    if (!paused) return;
    pauseStart.current = performance.now();
    return () => {
      startTime.current += performance.now() - pauseStart.current;
      lastFrame.current = 0;
    };
  }, [paused]);

  useEffect(() => {
    setMounted(true);
    const loadUser = async () => {
      const currentUser = await SupabaseService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const p = await SupabaseService.getMyProfile();
        setProfile(p);
      }
    };
    loadUser();
  }, []);

  const fetchRankings = async () => {
    setRankingLoading(true);
    try {
      const data = await SupabaseService.getGameRankings("typing-race");
      setRankings(data);
    } catch (e) { console.error(e); }
    finally { setRankingLoading(false); }
  };

  useEffect(() => {
    if (gameState === "finished" || gameState === "ready") fetchRankings();
  }, [gameState]);

  // 진행도에 따라 단어 난이도 상승 (초반 쉬운 단어 → 후반 어려운 단어)
  const levelForProgress = (dist: number) => {
    const ratio = dist / RACE_DISTANCE;
    if (ratio < 0.35) return 1;
    if (ratio < 0.7) return 3;
    return 5;
  };

  // 봇 이동 + 경과 시간 업데이트 루프
  const updateGame = useCallback((time: number) => {
    if (paused) return;
    if (lastFrame.current === 0) lastFrame.current = time;
    const dt = (time - lastFrame.current) / 1000;
    lastFrame.current = time;

    setElapsed((time - startTime.current) / 1000);
    setBotDists((prev) => prev.map((d, i) => {
      if (d >= RACE_DISTANCE) return d;
      // 봇마다 ±8% 속도 흔들림을 줘서 기계적인 움직임 방지
      const jitter = 0.92 + Math.random() * 0.16;
      return d + (BOTS[i].cpm / 60) * dt * jitter;
    }));

    requestRef.current = requestAnimationFrame(updateGame);
  }, [paused]);

  useEffect(() => {
    if (gameState === "playing" && !paused) requestRef.current = requestAnimationFrame(updateGame);
    else if (requestRef.current) cancelAnimationFrame(requestRef.current);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [gameState, updateGame, paused]);

  const handleFinish = useCallback(async (finalDist: number) => {
    const seconds = (performance.now() - startTime.current) / 1000;
    const kpm = seconds > 0 ? Math.round((finalDist / seconds) * 60) : 0;
    const botsAhead = botDists.filter((d) => d >= RACE_DISTANCE).length;
    const rank = 1 + botsAhead;
    setFinalKpm(kpm);
    setFinalRank(rank);
    setGameState("finished");
    if (user) await SupabaseService.saveGameScore("typing-race", kpm, rank, maxCombo);
  }, [botDists, user, maxCombo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (gameState !== "playing") return;

    if (value === word) {
      // 단어 완성 → 타수만큼 전진
      const gained = TypingUtils.getStrokeCount(word);
      const newDist = playerDist + gained;
      setPlayerDist(newDist);
      setWordsTyped((n) => n + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setInputValue("");
      wasWrong.current = false;

      if (newDist >= RACE_DISTANCE) {
        handleFinish(newDist);
        return;
      }
      setWord(nextWord);
      setNextWord(pickWord(levelForProgress(newDist), nextWord));
      return;
    }

    // 오타 감지: 현재 입력이 목표 단어의 접두어가 아니면 틀린 상태
    const isWrong = value.length > 0 && !word.startsWith(value);
    if (isWrong && !wasWrong.current) {
      setMistakes((m) => m + 1);
      setCombo(0);
    }
    wasWrong.current = isWrong;
  };

  const startGame = () => {
    const first = pickWord(1, "");
    setWord(first);
    setNextWord(pickWord(1, first));
    setPlayerDist(0); setBotDists([0, 0, 0]);
    setElapsed(0); setCombo(0); setMaxCombo(0); setMistakes(0); setWordsTyped(0);
    setInputValue(""); wasWrong.current = false;
    startTime.current = performance.now(); lastFrame.current = 0;
    setGameState("playing");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const liveKpm = elapsed > 1 ? Math.round((playerDist / elapsed) * 60) : 0;
  const accuracy = TypingUtils.calculateAccuracy(wordsTyped, wordsTyped + mistakes);
  const isWrongNow = inputValue.length > 0 && !word.startsWith(inputValue);

  const rankLabel = ["🥇 1등", "🥈 2등", "🥉 3등", "4등"][finalRank - 1] || `${finalRank}등`;

  // 레인 렌더링 (플레이어 + 봇 3)
  const lanes = [
    { name: profile?.nickname || "나", emoji: "🏃", dist: playerDist, color: "text-blue-400", isPlayer: true },
    ...BOTS.map((b, i) => ({ name: b.name, emoji: b.emoji, dist: botDists[i], color: b.color, isPlayer: false })),
  ];

  const finishModal = gameState === "finished" && (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500" />
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl text-center border border-zinc-200 dark:border-zinc-800 animate-in zoom-in duration-500">
        <div className="inline-flex p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-8"><Trophy className="w-20 h-20 text-yellow-500" /></div>
        <h2 className="text-5xl font-black text-zinc-900 dark:text-zinc-100 mb-2 tracking-tighter">{rankLabel}</h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-10">
          {finalRank === 1 ? "치타까지 제쳤습니다! 완벽한 질주였어요." : finalRank === 4 ? "거북이에게 졌지만, 다음 판이 있습니다!" : "좋은 기록이에요. 한 등수만 더 올려볼까요?"}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800"><p className="text-[10px] font-black text-zinc-400 uppercase mb-1 tracking-widest">타수</p><p className="text-2xl font-black text-blue-600">{finalKpm}</p></div>
          <div className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800"><p className="text-[10px] font-black text-zinc-400 uppercase mb-1 tracking-widest">정확도</p><p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{accuracy}%</p></div>
          <div className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800"><p className="text-[10px] font-black text-zinc-400 uppercase mb-1 tracking-widest">Max Combo</p><p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{maxCombo}</p></div>
        </div>
        <p className="text-sm font-bold text-zinc-400 mb-8">{TypingUtils.getGrade(finalKpm, accuracy)}</p>
        {!user ? (
          <div className="mb-10 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30"><p className="text-sm font-bold text-blue-600 mb-6 flex items-center justify-center gap-2"><Star size={16} fill="currentColor" /> 랭킹에 이름을 남기고 싶으신가요?</p><button onClick={() => SupabaseService.signInWithKakao()} className="w-full py-5 bg-[#FEE500] text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-95"><svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 3c-5.5 0-10 3.5-10 7.8 0 2.8 1.8 5.3 4.5 6.6l-1.1 4.1c-.1.5.4.8.8.6l4.8-3.2c.3 0 .7.1 1 .1 5.5 0 10-3.5 10-7.8S17.5 3 12 3" /></svg>3초 만에 로그인하고 기록 저장</button></div>
        ) : (
          <div className="mb-10 p-6 bg-green-50 dark:bg-green-900/20 rounded-[2rem] border border-green-100 dark:border-green-900/30 flex items-center justify-center gap-3 animate-pulse"><Star size={20} className="text-green-600" fill="currentColor" /><p className="text-sm font-black text-green-600">방금 세운 기록이 랭킹에 성공적으로 반영되었습니다!</p></div>
        )}
        <div className="flex flex-col gap-4">
          <KeyboardRecommendationBanner variant="light" className="!mt-0 mb-4 !rounded-3xl" />
          <button onClick={startGame} className="w-full py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xl font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"><RotateCcw size={24} /> 다시 도전하기</button>
          <Link prefetch={false} href="/game" className="flex items-center justify-center gap-2 text-zinc-400 font-black text-sm hover:text-zinc-600 transition-colors">목록으로 돌아가기 <ChevronRight size={16} /></Link>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className={`w-full max-w-6xl mx-auto flex flex-col gap-2 md:gap-4 py-2 animate-in fade-in duration-700 ${isMobilePlaying ? "overflow-hidden" : ""}`}
      style={wrapperHeight ? { height: wrapperHeight } : undefined}
    >
      {gameState === "finished" && mounted && createPortal(finishModal, document.body)}

      {/* Compact Dashboard (모바일 <lg): 타수·시간·정확도 한 줄 */}
      <div className="flex lg:hidden items-center justify-between gap-2 h-11 px-3 bg-zinc-900 text-white rounded-2xl shadow-lg border border-zinc-800 shrink-0">
        <div className="flex items-center gap-1"><span className="text-[9px] text-zinc-500 font-black uppercase">타수</span><span className="text-base font-black text-blue-400 tabular-nums">{liveKpm}</span></div>
        <div className="flex items-center gap-1"><Timer size={14} className="text-yellow-400" /><span className="text-base font-black text-yellow-400 tabular-nums">{elapsed.toFixed(0)}s</span></div>
        <div className="flex items-center gap-1"><span className="text-[9px] text-zinc-500 font-black uppercase">정확도</span><span className="text-base font-black text-emerald-400 tabular-nums">{accuracy}%</span></div>
        {combo > 1 && <span className="text-orange-500 font-black text-sm italic flex items-center gap-0.5"><Flame size={12} fill="currentColor" />{combo}</span>}
      </div>

      {/* Game Dashboard (데스크톱 ≥lg) */}
      <div className="hidden lg:flex w-full justify-between items-center px-4 md:px-8 py-3 md:py-4 bg-zinc-900 text-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-zinc-800 shrink-0">
        <div className="flex gap-4 md:gap-8 items-center">
          <div className="flex flex-col"><span className="text-[9px] text-zinc-500 uppercase font-black mb-0.5">현재 타수</span><span className="text-lg md:text-2xl font-black text-blue-400">{liveKpm}</span></div>
          <div className="flex flex-col"><span className="text-[9px] text-zinc-500 uppercase font-black mb-0.5">Time</span><span className="text-lg md:text-2xl font-black text-yellow-400 flex items-center gap-1"><Timer size={18} />{elapsed.toFixed(0)}s</span></div>
          <div className="flex flex-col"><span className="text-[9px] text-zinc-500 uppercase font-black mb-0.5">정확도</span><span className="text-lg md:text-2xl font-black text-emerald-400">{accuracy}%</span></div>
        </div>
        <div className="flex items-center gap-4">
          {combo > 1 && <div className="animate-bounce"><span className="text-orange-500 font-black text-lg italic flex items-center gap-1"><Flame size={16} fill="currentColor" /> {combo}</span></div>}
          <div className="h-8 w-px bg-zinc-800 hidden sm:block"></div>
          <div className="text-right hidden sm:block"><div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-tight">Racing Mode</div><div className="font-black text-zinc-300 text-sm leading-tight">타자 레이스</div></div>
        </div>
      </div>

      <div className={`w-full flex flex-col lg:flex-row gap-4 ${isMobilePlaying ? "flex-1 min-h-0" : ""}`}>
        {/* Main Column */}
        <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0">
          {/* Race Track */}
          <div className={`relative bg-zinc-950 rounded-[2rem] md:rounded-[2.5rem] border-4 border-zinc-900 p-3 sm:p-8 overflow-hidden ${isMobilePlaying ? "flex-1 min-h-0" : ""}`} style={{ backgroundImage: "radial-gradient(circle, #18181b 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
            {isMobilePlaying && paused && <GamePauseOverlay onResume={resume} />}
            {gameState === "ready" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 p-4">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full border border-zinc-200 dark:border-zinc-800">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center text-blue-600"><Play size={32} fill="currentColor" className="ml-1" /></div>
                  <div className="text-center"><h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-1">타자 레이스</h3><p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">단어를 입력해 달리세요! 거북이(200타), 토끼(350타), 치타(500타)와의 500타 경주입니다.</p></div>
                  <button onClick={startGame} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-black rounded-xl transition-all shadow-xl">경주 시작</button>
                </div>
              </div>
            )}

            {/* 결승선 */}
            <div className="absolute top-0 bottom-0 right-8 sm:right-10 w-1 border-r-4 border-dashed border-zinc-700 z-0" />
            <div className="absolute top-2 right-4 sm:right-5 text-lg z-0">🏁</div>

            {/* Lanes */}
            <div className="relative z-10 flex flex-col gap-2 sm:gap-5 mt-1 sm:mt-2">
              {lanes.map((lane) => {
                const pct = Math.min(100, (lane.dist / RACE_DISTANCE) * 100);
                return (
                  <div key={lane.name + lane.emoji} className={`relative h-9 sm:h-14 rounded-xl sm:rounded-2xl border ${lane.isPlayer ? "bg-blue-500/10 border-blue-500/40" : "bg-zinc-900/80 border-zinc-800"}`}>
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-wider ${lane.color} opacity-70 pointer-events-none`}>
                      {lane.name}{lane.isPlayer ? " (YOU)" : ` · ${BOTS.find(b => b.emoji === lane.emoji)?.cpm}타`}
                    </div>
                    {/* 진행 바 */}
                    <div className={`absolute left-0 top-0 bottom-0 rounded-2xl ${lane.isPlayer ? "bg-blue-500/20" : "bg-zinc-800/60"} transition-all duration-200`} style={{ width: `${pct}%` }} />
                    {/* 러너 */}
                    <div className="absolute top-1/2 -translate-y-1/2 text-xl sm:text-3xl transition-all duration-200 drop-shadow-lg" style={{ left: `calc(${pct}% * 0.88 + 8px)` }}>
                      {lane.emoji}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Word + Input Area */}
          <div className="w-full shrink-0 flex flex-col gap-1.5 md:gap-3">
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <div className={`px-6 md:px-10 py-2 md:py-4 rounded-[1.25rem] md:rounded-[2rem] border-4 text-xl md:text-5xl font-black tracking-wider transition-colors ${isWrongNow ? "bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-600" : "bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"}`}>
                {gameState === "playing" ? word : "🏁"}
              </div>
              {gameState === "playing" && nextWord && (
                <div className="hidden sm:block px-6 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-xl font-bold">
                  다음: {nextWord}
                </div>
              )}
            </div>
            {/* 모바일: "다음:" 미리보기를 입력창 위 작은 텍스트로 표시 */}
            {gameState === "playing" && nextWord && (
              <div className="sm:hidden text-center text-[11px] font-bold text-zinc-400">다음: {nextWord}</div>
            )}
            <input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} disabled={gameState !== "playing"} className={`w-full h-14 md:h-20 px-5 md:px-8 text-xl md:text-4xl bg-white dark:bg-zinc-900 border-4 rounded-[1.25rem] md:rounded-[2rem] shadow-xl outline-hidden text-center font-black transition-all ${gameState === "playing" ? (isWrongNow ? "border-rose-500" : "border-zinc-900 dark:border-zinc-100 focus:border-blue-500") : "border-zinc-100 dark:border-zinc-800 opacity-50"}`} placeholder={gameState === "playing" ? "위 단어를 입력하세요!" : "준비가 되면 시작하세요"} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
          </div>
        </div>

        {/* Rankings Sidebar (모바일 플레이 중에는 게임 영역 확보를 위해 숨김) */}
        <div className={`${isMobilePlaying ? "hidden" : "flex"} w-full lg:w-72 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg flex-col shrink-0`}>
          <div className="flex items-center gap-2 mb-6"><Trophy className="text-yellow-500" size={20} /><h3 className="text-lg font-black">실시간 타수 랭킹</h3></div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar max-h-96 lg:max-h-none">
            {rankingLoading ? (<div className="flex flex-col items-center justify-center py-10 gap-2"><Loader2 className="animate-spin text-zinc-300" size={20} /></div>) :
              rankings.length > 0 ? rankings.map((rank, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${i === 0 ? "bg-yellow-400 text-white" : i === 1 ? "bg-zinc-300 text-zinc-600" : i === 2 ? "bg-orange-400 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}>{i + 1}</div>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {rank.profiles?.avatar_url ? <Image src={rank.profiles.avatar_url} alt="p" width={24} height={32} className="w-6 h-6 rounded-lg object-cover aspect-square" /> : <div className="w-6 h-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400"><User size={12} /></div>}
                    <div className="min-w-0"><p className="text-sm font-black truncate text-zinc-900 dark:text-zinc-100 leading-tight">{rank.profiles?.nickname || "익명"}</p><p className="text-[9px] font-bold text-zinc-400">{rank.level}등 완주</p></div>
                  </div>
                  <div className="text-right shrink-0"><p className="text-sm font-black text-blue-600">{rank.score.toLocaleString()}타</p></div>
                </div>
              )) : <div className="text-center py-10 text-zinc-400 text-xs font-medium">기록 없음</div>}
          </div>
          {!user && (
            <p className="mt-4 text-[9px] text-zinc-400 font-bold text-center leading-relaxed px-2 animate-pulse">
              로그인을 하시면 나만의 소중한 기록을 <br />실시간 랭킹에 남길 수 있습니다.
            </p>
          )}
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center"><div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl flex items-center justify-center gap-2"><Flag size={14} className="text-blue-600" /><span className="font-black text-xs">{profile?.nickname || "Guest"}</span></div></div>
        </div>
      </div>
    </div>
  );
};
