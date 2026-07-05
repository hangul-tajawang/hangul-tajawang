"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Trophy, RotateCcw, Play, Loader2, User, Star, Flame, Boxes, ChevronRight, AlertTriangle } from "lucide-react";
import { KeyboardRecommendationBanner } from "../layout/KeyboardRecommendationBanner";
import { SupabaseService } from "@/lib/supabase";
import { getWordForLevel } from "@/lib/game-words";
import { useMobileGamePlay } from "@/hooks/useMobileGamePlay";
import { GamePauseOverlay } from "./GamePauseOverlay";
import Image from "next/image";
import Link from "next/link";

// 스택이 이 행 수를 넘어서면(천장 도달) 게임 오버
const MAX_ROWS = 7;

type ItemType = "normal" | "bomb" | "gold";

interface Block {
  id: number;
  text: string; // 타이핑해야 하는 단어 (특수 블록도 '폭탄'/'황금' 처럼 타이핑)
  itemType: ItemType;
}

type Row = Block[];

const uid = () => Date.now() + Math.random();

export const BlockPopGame: React.FC = () => {
  // rows[0] = 가장 오래된 행(맨 위, 천장에 가까움), 새 행은 맨 아래(배열 끝)에 추가되어 스택을 위로 밀어 올린다.
  const [rows, setRows] = useState<Row[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
  const [mounted, setMounted] = useState(false);

  const [rankings, setRankings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [rankingLoading, setRankingLoading] = useState(false);

  const requestRef = useRef<number | null>(null);
  const lastSpawnTime = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 모바일 플레이 공통 로직 (뷰포트 높이 고정 / 스크롤 잠금 / 포커스 이탈 일시정지)
  const { isMobilePlaying, paused, wrapperRef, wrapperHeight, resume } =
    useMobileGamePlay({ playing: gameState === "playing", inputRef });

  // 일시정지 도중 행 추가 타이머가 밀리지 않게, 재개 시 타이머 기준 시각을 갱신
  useEffect(() => {
    if (!paused) return;
    return () => { lastSpawnTime.current = performance.now(); };
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
      const data = await SupabaseService.getGameRankings("block-pop");
      setRankings(data);
    } catch (e) { console.error(e); }
    finally { setRankingLoading(false); }
  };

  useEffect(() => {
    if (gameState === "gameover" || gameState === "ready") fetchRankings();
  }, [gameState]);

  // 새 행 한 줄을 생성한다 (현재 화면의 단어와 중복되지 않도록 시도)
  const makeRow = useCallback((existing: Row[]): Row => {
    const used = new Set(existing.flat().map((b) => b.text));
    const count = 2 + Math.floor(Math.random() * 3); // 2~4개
    const blocks: Block[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      if (r > 0.97) { blocks.push({ id: uid(), text: "폭탄", itemType: "bomb" }); continue; }
      if (r > 0.94) { blocks.push({ id: uid(), text: "황금", itemType: "gold" }); continue; }
      let w = getWordForLevel(level);
      let attempts = 0;
      while (used.has(w) && attempts < 8) { w = getWordForLevel(level); attempts++; }
      used.add(w);
      blocks.push({ id: uid(), text: w, itemType: "normal" });
    }
    return blocks;
  }, [level]);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, makeRow(prev)]);
  }, [makeRow]);

  const updateGame = useCallback((time: number) => {
    if (gameState !== "playing" || paused) return;
    const spawnDelay = Math.max(1000, 2800 - level * 200);
    if (time - lastSpawnTime.current > spawnDelay) {
      addRow();
      lastSpawnTime.current = time;
    }
    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState, level, addRow, paused]);

  useEffect(() => {
    if (gameState === "playing" && !paused) requestRef.current = requestAnimationFrame(updateGame);
    else if (requestRef.current) cancelAnimationFrame(requestRef.current);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [gameState, updateGame, paused]);

  // 스택이 천장을 넘으면 게임 오버
  useEffect(() => {
    if (rows.length > MAX_ROWS && gameState === "playing") handleGameOver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length, gameState]);

  const handleGameOver = async () => {
    setGameState("gameover");
    if (user) await SupabaseService.saveGameScore("block-pop", score, level, maxCombo);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (gameState !== "playing") return;

    let matched: Block | null = null;
    for (const row of rows) {
      const b = row.find((blk) => blk.text === value);
      if (b) { matched = b; break; }
    }
    if (!matched) return;

    const hit = matched;
    setInputValue("");

    setRows((prev) => {
      if (hit.itemType === "bomb") {
        // 가장 위험한 맨 윗 행 + 폭탄 블록 제거
        return prev.slice(1)
          .map((row) => row.filter((blk) => blk.id !== hit.id))
          .filter((row) => row.length > 0);
      }
      return prev
        .map((row) => row.filter((blk) => blk.id !== hit.id))
        .filter((row) => row.length > 0);
    });

    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);
    const comboBonus = Math.floor(newCombo / 5) * 30;

    let gainedScore = 0;
    switch (hit.itemType) {
      case "bomb": gainedScore = 500; break;
      case "gold": gainedScore = 1000 + comboBonus; break;
      default: gainedScore = 100 + comboBonus;
    }
    const newTotalScore = score + gainedScore;
    setScore(newTotalScore);
    if (newTotalScore >= level * 500) setLevel((prev) => prev + 1);
  };

  const startGame = () => {
    setRows([]); setScore(0); setLevel(1); setCombo(0); setMaxCombo(0);
    setInputValue(""); setGameState("playing"); lastSpawnTime.current = performance.now();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const danger = rows.length >= MAX_ROWS - 1;

  const blockStyle = (item: ItemType) => {
    if (item === "bomb") return "bg-red-500 text-white border-red-700";
    if (item === "gold") return "bg-yellow-400 text-yellow-950 border-yellow-600";
    return "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700";
  };

  // 게임 종료 팝업 (Portal)
  const gameOverModal = gameState === "gameover" && (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500" />
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl text-center border border-zinc-200 dark:border-zinc-800 animate-in zoom-in duration-500">
        <div className="inline-flex p-6 bg-rose-50 dark:bg-rose-900/20 rounded-full mb-8"><Trophy className="w-20 h-20 text-yellow-500" /></div>
        <h2 className="text-5xl font-black text-zinc-900 dark:text-zinc-100 mb-2 tracking-tighter">GAME OVER</h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-10">블록이 천장에 닿았어요! 멋진 플레이였습니다.</p>
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800"><p className="text-[10px] font-black text-zinc-400 uppercase mb-1 tracking-widest">Final Score</p><p className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{score.toLocaleString()}</p></div>
          <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800"><p className="text-[10px] font-black text-zinc-400 uppercase mb-1 tracking-widest">Max Combo</p><p className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{maxCombo}</p></div>
        </div>
        {!user ? (
          <div className="mb-10 p-8 bg-rose-50 dark:bg-rose-900/20 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30"><p className="text-sm font-bold text-rose-600 mb-6 flex items-center justify-center gap-2"><Star size={16} fill="currentColor" /> 랭킹에 이름을 남기고 싶으신가요?</p><button onClick={() => SupabaseService.signInWithKakao()} className="w-full py-5 bg-[#FEE500] text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-95"><svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 3c-5.5 0-10 3.5-10 7.8 0 2.8 1.8 5.3 4.5 6.6l-1.1 4.1c-.1.5.4.8.8.6l4.8-3.2c.3 0 .7.1 1 .1 5.5 0 10-3.5 10-7.8S17.5 3 12 3" /></svg>3초 만에 로그인하고 기록 저장</button></div>
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
      className={`w-full max-w-6xl mx-auto flex flex-col gap-2 md:gap-4 py-2 animate-in fade-in duration-700 ${isMobilePlaying ? "overflow-hidden" : "h-[calc(100dvh-140px)] md:h-[calc(100vh-100px)] max-h-[800px] min-h-[420px] md:min-h-[650px]"}`}
      style={wrapperHeight ? { height: wrapperHeight } : undefined}
    >
      {gameState === "gameover" && mounted && createPortal(gameOverModal, document.body)}

      {/* Compact Dashboard (모바일 <lg): 점수·레벨·스택게이지 한 줄 */}
      <div className="flex lg:hidden items-center justify-between gap-2 h-11 px-3 bg-zinc-900 text-white rounded-2xl shadow-lg border border-zinc-800 shrink-0">
        <div className="flex items-center gap-1"><span className="text-[9px] text-zinc-500 font-black uppercase">SC</span><span className="text-base font-black text-yellow-400 tabular-nums">{score.toLocaleString()}</span></div>
        <div className="flex items-center gap-1"><span className="text-[9px] text-zinc-500 font-black uppercase">LV</span><span className="text-base font-black text-rose-400 tabular-nums">{level}</span></div>
        {combo > 1 && <span className="text-orange-500 font-black text-sm italic flex items-center gap-0.5"><Flame size={12} fill="currentColor" />{combo}</span>}
        <div className="flex items-end gap-0.5 h-6">{Array(MAX_ROWS).fill(0).map((_, i) => (<span key={i} className={`w-1.5 rounded-sm transition-all ${i < rows.length ? (danger ? "bg-rose-500" : "bg-emerald-400") : "bg-zinc-700"}`} style={{ height: `${7 + i * 2}px` }} />))}</div>
      </div>

      {/* Game Dashboard (데스크톱 ≥lg) */}
      <div className="hidden lg:flex w-full justify-between items-center px-4 md:px-8 py-3 md:py-4 bg-zinc-900 text-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-zinc-800 shrink-0">
        <div className="flex gap-4 md:gap-8 items-center">
          <div className="flex flex-col"><span className="text-[9px] text-zinc-500 uppercase font-black mb-0.5">Score</span><span className="text-lg md:text-2xl font-black text-yellow-400">{score.toLocaleString()}</span></div>
          <div className="flex flex-col"><span className="text-[9px] text-zinc-500 uppercase font-black mb-0.5">Level</span><span className="text-lg md:text-2xl font-black text-rose-400">{level}</span></div>
          <div className="flex flex-col"><span className="text-[9px] text-zinc-500 uppercase font-black mb-0.5">Stack</span><div className="flex items-end gap-0.5 h-7">{Array(MAX_ROWS).fill(0).map((_, i) => (<span key={i} className={`w-2 rounded-sm transition-all ${i < rows.length ? (danger ? "bg-rose-500" : "bg-emerald-400") : "bg-zinc-700"}`} style={{ height: `${8 + i * 2.2}px` }} />))}</div></div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          {danger && gameState === "playing" && <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/20 text-rose-400 rounded-lg animate-pulse border border-rose-500/30"><AlertTriangle size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Danger</span></div>}
          {combo > 1 && <div className="animate-bounce"><span className="text-orange-500 font-black text-lg italic flex items-center gap-1"><Flame size={16} fill="currentColor" /> {combo}</span></div>}
          <div className="h-8 w-px bg-zinc-800"></div>
          <div className="text-right"><div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-tight">Arcade Mode</div><div className="font-black text-zinc-300 text-sm leading-tight">블록 팝핑</div></div>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4 flex-1 overflow-hidden min-h-0">
        {/* Main Column: Game Area + Input Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Game Area */}
          <div className={`relative flex-1 min-h-[200px] bg-zinc-950 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border-4 ${danger ? "border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]" : "border-zinc-900"} transition-all duration-500`} style={{ backgroundImage: "radial-gradient(circle, #18181b 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
            {isMobilePlaying && paused && <GamePauseOverlay onResume={resume} />}
            {/* 천장 경고선 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent z-10" />

            {gameState === "ready" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 p-4">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full border border-zinc-200 dark:border-zinc-800">
                  <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-[1.5rem] flex items-center justify-center text-rose-600"><Play size={32} fill="currentColor" className="ml-1" /></div>
                  <div className="text-center"><h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-1">블록 팝핑</h3><p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">아래에서 차오르는 단어 블록을 타이핑해 터뜨리세요!</p></div>
                  <button onClick={startGame} className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white text-lg font-black rounded-xl transition-all shadow-xl">게임 시작</button>
                </div>
              </div>
            )}

            {/* 블록 스택: 바닥에 정렬되어 위로 차오름 */}
            <div className="absolute inset-0 flex flex-col justify-end gap-1.5 sm:gap-2 p-2 sm:p-4">
              {rows.map((row, ri) => (
                <div key={row[0]?.id ?? ri} className="flex justify-center gap-1.5 sm:gap-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
                  {row.map((blk) => (
                    <div key={blk.id} className={`px-2 sm:px-5 py-1.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg font-black text-sm sm:text-lg whitespace-nowrap border-b-4 flex items-center gap-1 ${blockStyle(blk.itemType)}`}>
                      {blk.itemType === "bomb" && <span>💣</span>}
                      {blk.itemType === "gold" && <span>✨</span>}
                      {blk.text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="w-full shrink-0">
            <input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} disabled={gameState !== "playing"} className={`w-full h-14 md:h-20 px-5 md:px-8 text-xl md:text-4xl bg-white dark:bg-zinc-900 border-4 rounded-[1.25rem] md:rounded-[2rem] shadow-xl outline-hidden text-center font-black transition-all ${gameState === "playing" ? "border-zinc-900 dark:border-zinc-100 focus:border-rose-500" : "border-zinc-100 dark:border-zinc-800 opacity-50"}`} placeholder={gameState === "playing" ? "블록 단어를 입력하세요!" : "준비가 되면 시작하세요"} autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
          </div>
        </div>

        {/* Rankings Sidebar (모바일에서는 게임 영역 확보를 위해 숨김) */}
        <div className="hidden lg:flex w-full lg:w-72 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6 shadow-lg flex-col shrink-0">
          <div className="flex items-center gap-2 mb-6"><Trophy className="text-yellow-500" size={20} /><h3 className="text-lg font-black">실시간 랭킹</h3></div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
            {rankingLoading ? (<div className="flex flex-col items-center justify-center py-10 gap-2"><Loader2 className="animate-spin text-zinc-300" size={20} /></div>) :
              rankings.length > 0 ? rankings.map((rank, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${i === 0 ? "bg-yellow-400 text-white" : i === 1 ? "bg-zinc-300 text-zinc-600" : i === 2 ? "bg-orange-400 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}>{i + 1}</div>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {rank.profiles?.avatar_url ? <Image src={rank.profiles.avatar_url} alt="p" width={24} height={32} className="w-6 h-6 rounded-lg object-cover aspect-square" /> : <div className="w-6 h-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400"><User size={12} /></div>}
                    <div className="min-w-0"><p className="text-sm font-black truncate text-zinc-900 dark:text-zinc-100 leading-tight">{rank.profiles?.nickname || "익명"}</p><p className="text-[9px] font-bold text-zinc-400">Lv.{rank.level}</p></div>
                  </div>
                  <div className="text-right shrink-0"><p className="text-sm font-black text-rose-600">{rank.score.toLocaleString()}</p></div>
                </div>
              )) : <div className="text-center py-10 text-zinc-400 text-xs font-medium">기록 없음</div>}
          </div>
          {!user && (
            <p className="mt-4 text-[9px] text-zinc-400 font-bold text-center leading-relaxed px-2 animate-pulse">
              로그인을 하시면 나만의 소중한 기록을 <br />실시간 랭킹에 남길 수 있습니다.
            </p>
          )}
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center"><div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl flex items-center justify-center gap-2"><Boxes size={14} className="text-rose-600" /><span className="font-black text-xs">{profile?.nickname || "Guest"}</span></div></div>
        </div>
      </div>
    </div>
  );
};
