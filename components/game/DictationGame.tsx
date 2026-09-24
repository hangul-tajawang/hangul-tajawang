"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Ear, Eye, Heart, Loader2, Play, RotateCcw, Star, Timer, Trophy, User, Volume2, X } from "lucide-react";
import { useGameAnalytics } from "@/hooks/useGameAnalytics";
import { useMobileGamePlay } from "@/hooks/useMobileGamePlay";
import { SupabaseService } from "@/lib/supabase";
import { AdSenseUnit } from "../layout/AdSenseUnit";
import { MobileGameShell } from "./MobileGameShell";
import {
  DICTATION_LEVELS,
  DICTATION_MAX_TRIES,
  gradeDictation,
  pickDictationItems,
  scoreDictation,
  type DictationItem,
  type DictationLevel,
} from "@/lib/dictation";
import { loadKoreanVoice, speak, stopSpeaking, ttsSupported } from "@/lib/tts";


interface GameRanking {
  score: number;
  level: number;
  profiles?: { nickname?: string | null; avatar_url?: string | null } | null;
}
const MAX_LIVES = 3;
/** 보고 쓰기 모드에서 문제를 보여주는 시간(ms) */
const FLASH_MS: Record<DictationLevel, number> = { easy: 1500, medium: 1800, hard: 2600 };
const LEVEL_ORDER: DictationLevel[] = ["easy", "medium", "hard"];

interface Answer {
  item: DictationItem;
  input: string;
  correct: boolean;
  spacingMiss: boolean;
  timedOut: boolean;
}

type Feedback = { correct: boolean; spacingMiss: boolean; timedOut: boolean; gained: number } | null;

export const DictationGame: React.FC = () => {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  useGameAnalytics("dictation", gameState);
  const [level, setLevel] = useState<DictationLevel>("easy");
  const [silentMode, setSilentMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"checking" | "ko" | "none" | "unknown">("checking");

  const [items, setItems] = useState<DictationItem[]>([]);
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [replaysUsed, setReplaysUsed] = useState(0);
  /** 현재 문제에서 틀린 횟수 — DICTATION_MAX_TRIES번 모두 틀려야 오답 처리 */
  const [wrongTries, setWrongTries] = useState(0);
  const [retryNotice, setRetryNotice] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [speaking, setSpeaking] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);
  /** 문제 시간은 첫 재생(또는 보여주기)이 끝난 뒤부터 흐른다 */
  const [clockRunning, setClockRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [rankings, setRankings] = useState<GameRanking[]>([]);
  const [user, setUser] = useState<boolean>(false);
  const [rankingLoading, setRankingLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedRef = useRef(false);
  const pausedRef = useRef(false);
  /** 일시정지로 문제 제시(음성/보여주기)가 끊겼으면 재개 때 다시 제시한다 */
  const representPending = useRef(false);

  const { isMobilePlaying, paused, overlay, resume } = useMobileGamePlay({ playing: gameState === "playing", inputRef });

  const cfg = DICTATION_LEVELS[level];
  const item = items[index];
  const replaysLeft = cfg.replays === null ? Infinity : Math.max(0, cfg.replays - replaysUsed);
  const timeLeft = cfg.timeLimit ? Math.max(0, cfg.timeLimit - elapsedMs / 1000) : null;
  const useVoice = !silentMode && voiceStatus !== "none";

  useEffect(() => {
    setMounted(true);
    (async () => {
      setUser(Boolean(await SupabaseService.getCurrentUser()));
    })();
    if (!ttsSupported()) setVoiceStatus("none");
    else loadKoreanVoice().then(setVoiceStatus);
    return () => {
      stopSpeaking();
      if (flashTimer.current) clearTimeout(flashTimer.current);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const fetchRankings = useCallback(async () => {
    setRankingLoading(true);
    try {
      setRankings((await SupabaseService.getGameRankings("dictation")) as GameRanking[]);
    } catch (e) {
      console.error(e);
    } finally {
      setRankingLoading(false);
    }
  }, []);

  useEffect(() => {
    if (gameState !== "playing") fetchRankings();
  }, [gameState, fetchRankings]);

  // 문제 제시: 소리로 읽거나(기본) 잠깐 보여준다(보고 쓰기). 끝나면 시계 시작.
  const present = useCallback(
    (target: DictationItem, lvl: DictationLevel, voice: boolean) => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
      if (voice) {
        setSpeaking(true);
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          setSpeaking(false);
          // 일시정지로 음성이 끊긴 경우엔 시계를 켜지 않고, 재개 때 다시 읽어 준다
          if (pausedRef.current) representPending.current = true;
          else setClockRunning(true);
        };
        speak(target.text, DICTATION_LEVELS[lvl].rate).then(finish);
        // 일부 브라우저는 onend가 오지 않는다 — 글자 수 기준 안전장치
        flashTimer.current = setTimeout(finish, 1500 + target.text.length * 250);
      } else {
        setFlashVisible(true);
        flashTimer.current = setTimeout(() => {
          setFlashVisible(false);
          if (pausedRef.current) representPending.current = true;
          else setClockRunning(true);
        }, FLASH_MS[lvl]);
      }
    },
    []
  );

  const finishGame = useCallback(
    async (finalScore: number, finalCombo: number) => {
      // 남은 자동 진행·제시 타이머가 결과 화면 위에서 다음 문제를 읽지 않도록 정리
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      representPending.current = false;
      stopSpeaking();
      setGameState("finished");
      if (user && !savedRef.current) {
        savedRef.current = true;
        try {
          await SupabaseService.saveGameScore("dictation", finalScore, DICTATION_LEVELS[level].rank, finalCombo);
          await fetchRankings();
        } catch (e) {
          console.error("게임 점수 저장 실패:", e);
        }
      }
    },
    [user, level, fetchRankings]
  );

  const goNext = useCallback(
    (nextLives: number, nextScore: number, nextMaxCombo: number) => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      const nextIndex = index + 1;
      if (nextLives <= 0 || nextIndex >= items.length) {
        finishGame(nextScore, nextMaxCombo);
        return;
      }
      setIndex(nextIndex);
      setFeedback(null);
      setInputValue("");
      setReplaysUsed(0);
      setWrongTries(0);
      setRetryNotice(0);
      setElapsedMs(0);
      setClockRunning(false);
      present(items[nextIndex], level, useVoice);
      inputRef.current?.focus();
    },
    [index, items, level, useVoice, present, finishGame]
  );

  // 채점 → 피드백 표시. 정답은 잠시 뒤 자동 진행, 오답은 해설을 읽도록 Enter/버튼으로 진행.
  const submit = useCallback(
    (timedOut = false) => {
      if (!item || feedback) return;
      const grade = timedOut ? { correct: false, spacingMiss: false } : gradeDictation(item.text, inputValue);
      // 틀려도 기회가 남아 있으면 다시 쓰게 한다 (시간 초과는 기회와 무관하게 끝)
      if (!grade.correct && !timedOut && wrongTries + 1 < DICTATION_MAX_TRIES) {
        setWrongTries(wrongTries + 1);
        setRetryNotice((n) => n + 1);
        setCombo(0);
        inputRef.current?.select();
        return;
      }
      if (flashTimer.current) clearTimeout(flashTimer.current);
      stopSpeaking();
      setSpeaking(false);
      setFlashVisible(false);
      setClockRunning(false);
      const nextCombo = grade.correct ? combo + 1 : 0;
      const gained = grade.correct
        ? scoreDictation({ level, seconds: elapsedMs / 1000, replaysUsed, combo: nextCombo - 1, spacingMiss: grade.spacingMiss, wrongTries })
        : 0;
      const nextScore = score + gained;
      const nextLives = grade.correct ? lives : lives - 1;
      const nextMaxCombo = Math.max(maxCombo, nextCombo);
      setCombo(nextCombo);
      setMaxCombo(nextMaxCombo);
      setScore(nextScore);
      setLives(nextLives);
      setAnswers((prev) => [...prev, { item, input: inputValue, correct: grade.correct, spacingMiss: grade.spacingMiss, timedOut }]);
      setFeedback({ correct: grade.correct, spacingMiss: grade.spacingMiss, timedOut, gained });
      if (grade.correct) {
        advanceTimer.current = setTimeout(
          () => goNext(nextLives, nextScore, nextMaxCombo),
          grade.spacingMiss || item.note ? 1800 : 900
        );
      }
    },
    [item, feedback, inputValue, wrongTries, combo, level, elapsedMs, replaysUsed, score, lives, maxCombo, goNext]
  );

  // 문제 시계 (모바일 일시정지 중엔 멈춤)
  useEffect(() => {
    if (gameState !== "playing" || !clockRunning || paused || feedback) return;
    const started = performance.now() - elapsedMs;
    const timer = setInterval(() => setElapsedMs(performance.now() - started), 100);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, clockRunning, paused, feedback]);

  // 시간 초과
  useEffect(() => {
    if (timeLeft === 0 && clockRunning && !feedback && gameState === "playing") submit(true);
  }, [timeLeft, clockRunning, feedback, gameState, submit]);

  // 일시정지 → 재생 중이던 음성은 끊고, 재개하면 끊긴 문제를 다시 제시한다 (다시 듣기 횟수 차감 없음)
  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    if (representPending.current && gameState === "playing" && item && !feedback) {
      representPending.current = false;
      present(item, level, useVoice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  const replay = () => {
    if (!item || feedback || speaking || flashVisible || replaysLeft <= 0) return;
    setReplaysUsed((n) => n + 1);
    if (useVoice) {
      setSpeaking(true);
      speak(item.text, DICTATION_LEVELS[level].rate).then(() => setSpeaking(false));
    } else {
      setFlashVisible(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlashVisible(false), FLASH_MS[level]);
    }
    inputRef.current?.focus();
  };

  const startGame = (lvl: DictationLevel = level) => {
    const picked = pickDictationItems(lvl);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    savedRef.current = false;
    setLevel(lvl);
    setItems(picked);
    setIndex(0);
    setInputValue("");
    setLives(MAX_LIVES);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setReplaysUsed(0);
    setWrongTries(0);
    setRetryNotice(0);
    setAnswers([]);
    setFeedback(null);
    setElapsedMs(0);
    setClockRunning(false);
    setGameState("playing");
    // iOS: 첫 재생은 반드시 클릭 핸들러 안에서
    present(picked[0], lvl, !silentMode && voiceStatus !== "none");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    if (gameState !== "playing") return;
    if (feedback) {
      if (!feedback.correct) goNext(lives, score, maxCombo);
      return;
    }
    // 빈 칸에서 Enter = 다시 듣기
    if (!inputValue.trim()) replay();
    else submit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (feedback) return;
    setInputValue(e.target.value);
  };

  const wrongAnswers = answers.filter((a) => !a.correct || a.spacingMiss);
  const correctCount = answers.filter((a) => a.correct).length;

  // ── 공용 조각 ──
  const hearts = (size: number) => (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: MAX_LIVES }, (_, i) => (
        <Heart key={i} size={size} className={i < lives ? "text-rose-500" : "text-zinc-700"} fill="currentColor" />
      ))}
    </span>
  );

  const replayButton = (compact: boolean) => (
    <button
      type="button"
      onClick={replay}
      // 입력창 포커스 유지 — 모바일에서 blur되면 일시정지되므로
      onPointerDown={(e) => e.preventDefault()}
      disabled={!!feedback || speaking || flashVisible || replaysLeft <= 0}
      className={`shrink-0 flex items-center justify-center gap-1.5 font-bold rounded-xl transition-all active:scale-95 disabled:opacity-40 ${
        compact ? "h-12 px-3 bg-zinc-800 text-zinc-100 text-xs" : "px-4 py-2.5 bg-white/10 text-white text-sm hover:bg-white/20"
      }`}
    >
      {useVoice ? <Volume2 size={compact ? 16 : 18} /> : <Eye size={compact ? 16 : 18} />}
      {useVoice ? "다시 듣기" : "다시 보기"}
      <span className="tabular-nums opacity-70">{cfg.replays === null ? "∞" : replaysLeft}</span>
    </button>
  );

  const stageBody = (compact: boolean) => {
    if (!item) return null;
    const timerPct = timeLeft !== null && cfg.timeLimit ? (timeLeft / cfg.timeLimit) * 100 : 100;
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center text-center ${compact ? "gap-3 p-3" : "gap-5 p-6 md:p-10"}`}>
        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400">
          <span className="px-2 py-0.5 rounded-full bg-white/10">{cfg.label}</span>
          <span className="tabular-nums">
            {index + 1} / {items.length}
          </span>
        </div>

        {/* 스피커 / 보고 쓰기 카드 */}
        {flashVisible ? (
          <div data-dictation-flash className={`font-bold text-white break-keep ${compact ? "text-2xl" : "text-4xl md:text-5xl"}`}>
            {item.text}
          </div>
        ) : feedback ? (
          <div className="flex flex-col items-center gap-2 max-w-xl">
            <div
              className={`flex items-center gap-2 font-bold ${compact ? "text-lg" : "text-2xl"} ${
                feedback.correct ? (feedback.spacingMiss ? "text-amber-300" : "text-emerald-400") : "text-rose-400"
              }`}
            >
              {feedback.correct ? <Check size={compact ? 20 : 26} /> : <X size={compact ? 20 : 26} />}
              {feedback.correct
                ? feedback.spacingMiss
                  ? `정답! 띄어쓰기는 확인해요 +${feedback.gained}`
                  : `정답! +${feedback.gained}`
                : feedback.timedOut
                  ? "시간 초과"
                  : "아쉬워요"}
            </div>
            <div data-dictation-answer className={`font-bold text-white break-keep ${compact ? "text-xl" : "text-3xl"}`}>
              {item.text}
            </div>
            {!feedback.correct && answers[answers.length - 1]?.input && (
              <div className="text-sm text-zinc-400 break-keep">
                내 답: <span className="line-through decoration-rose-400">{answers[answers.length - 1].input}</span>
              </div>
            )}
            {item.note && <p className={`text-zinc-300 leading-relaxed break-keep ${compact ? "text-xs" : "text-sm"}`}>💡 {item.note}</p>}
            {!feedback.correct && (
              <button
                type="button"
                onClick={() => goNext(lives, score, maxCombo)}
                onPointerDown={(e) => e.preventDefault()}
                className="mt-1 flex items-center gap-1 px-4 py-2 rounded-xl bg-white text-zinc-900 text-sm font-bold active:scale-95"
              >
                {lives <= 0 || index + 1 >= items.length ? "결과 보기" : "다음 문제"} <ChevronRight size={16} />
                <span className="hidden lg:inline text-[10px] text-zinc-400 font-bold">Enter</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div
              className={`rounded-full flex items-center justify-center transition-all ${
                compact ? "w-20 h-20" : "w-28 h-28 md:w-32 md:h-32"
              } ${speaking ? "bg-violet-500 text-white scale-105 shadow-[0_0_40px_rgba(139,92,246,0.6)]" : "bg-white/10 text-zinc-200"}`}
            >
              {useVoice ? <Ear size={compact ? 36 : 52} className={speaking ? "animate-pulse" : ""} /> : <Eye size={compact ? 36 : 52} />}
            </div>
            {wrongTries > 0 ? (
              <p key={retryNotice} data-dictation-retry className={`cd-pop font-bold text-amber-300 ${compact ? "text-sm" : "text-base"}`}>
                틀렸어요! 다시 써 보세요 · 남은 기회 {DICTATION_MAX_TRIES - wrongTries}번
              </p>
            ) : (
              <p className={`font-bold text-zinc-300 ${compact ? "text-sm" : "text-base"}`}>
                {speaking ? "잘 들어보세요…" : useVoice ? "들은 대로 쓰고 Enter" : "본 대로 쓰고 Enter"}
              </p>
            )}
            <div className="flex items-center gap-1.5" aria-label={`도전 ${wrongTries + 1}/${DICTATION_MAX_TRIES}`}>
              {Array.from({ length: DICTATION_MAX_TRIES }, (_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i < wrongTries ? "bg-rose-500" : i === wrongTries ? "bg-violet-400" : "bg-white/20"}`} />
              ))}
            </div>
            {!compact && <p className="text-xs text-zinc-500">빈 칸에서 Enter를 누르면 {useVoice ? "다시 들을" : "다시 볼"} 수 있어요</p>}
          </div>
        )}

        {/* 제한 시간 바 */}
        {cfg.timeLimit && !feedback && (
          <div className={`w-full ${compact ? "max-w-xs" : "max-w-md"} flex items-center gap-2`}>
            <Timer size={14} className={timeLeft !== null && timeLeft < 5 ? "text-rose-400" : "text-zinc-500"} />
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-100 ${timeLeft !== null && timeLeft < 5 ? "bg-rose-500" : "bg-violet-500"}`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
            <span className="text-xs font-bold tabular-nums text-zinc-400 w-8 text-right">{Math.ceil(timeLeft ?? 0)}s</span>
          </div>
        )}

        {!compact && !feedback && replayButton(false)}
      </div>
    );
  };

  const readyCard = (
    <div className="w-full flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-5 max-w-md w-full border border-zinc-200">
        <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600">
          <Ear size={32} />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-zinc-900 mb-1">받아쓰기</h3>
          <p className="text-zinc-500 text-xs font-medium leading-relaxed">
            들려주는 말을 듣고 맞춤법에 맞게 입력하세요. 한 문제에 3번까지 도전할 수 있고, 모두 틀리면 해설과 함께 목숨이 하나 줄어요.
          </p>
        </div>
        <div className="w-full grid grid-cols-3 gap-2">
          {LEVEL_ORDER.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevel(lvl)}
              className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                level === lvl ? "border-violet-600 bg-violet-50 text-violet-700" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
              }`}
            >
              {DICTATION_LEVELS[lvl].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-500 font-medium -mt-2 text-center">{DICTATION_LEVELS[level].desc}</p>
        <label className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 cursor-pointer">
          <span className="text-left">
            <span className="block text-sm font-bold text-zinc-800">소리 없이 하기</span>
            <span className="block text-[11px] text-zinc-500">
              {voiceStatus === "none" ? "이 브라우저는 한국어 음성을 지원하지 않아 보고 쓰기로 진행돼요" : "잠깐 보여주는 글자를 기억해서 써요"}
            </span>
          </span>
          <input
            type="checkbox"
            checked={silentMode || voiceStatus === "none"}
            disabled={voiceStatus === "none"}
            onChange={(e) => setSilentMode(e.target.checked)}
            className="w-5 h-5 accent-violet-600"
          />
        </label>
        <button
          onClick={() => startGame()}
          className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white text-lg font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
        >
          <Play size={20} fill="currentColor" /> 시작하기
        </button>
        {useVoice && <p className="text-[11px] text-zinc-400 -mt-2">🔊 소리를 켜 주세요</p>}
      </div>
    </div>
  );

  const finishModal = gameState === "finished" && (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500" />
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-center border border-zinc-200 animate-in zoom-in duration-500">
        <div className="inline-flex p-5 bg-violet-50 rounded-full mb-5">
          <Trophy className="w-14 h-14 text-yellow-500" />
        </div>
        <h2 className="text-4xl font-bold text-zinc-900 mb-1 tracking-tighter tabular-nums">{score.toLocaleString()}점</h2>
        <p className="text-zinc-500 font-bold mb-6">
          {cfg.label} · {items.length}문제 중 {correctCount}개 정답
          {lives <= 0 && answers.length < items.length ? " (목숨 소진)" : ""}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1 tracking-widest">정답률</p>
            <p className="text-xl font-bold text-violet-600">{answers.length ? Math.round((correctCount / answers.length) * 100) : 0}%</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1 tracking-widest">Max Combo</p>
            <p className="text-xl font-bold text-zinc-900">{maxCombo}</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1 tracking-widest">남은 목숨</p>
            <p className="text-xl font-bold text-rose-500">{Math.max(0, lives)}</p>
          </div>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="mb-6 text-left">
            <p className="text-sm font-bold text-zinc-800 mb-2">📝 오답 노트</p>
            <ul className="space-y-2">
              {wrongAnswers.map((a, i) => (
                <li key={i} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <p className="text-sm font-bold text-zinc-900">{a.item.text}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    내 답: {a.timedOut && !a.input ? "(시간 초과)" : a.input || "(빈칸)"}
                    {a.correct && a.spacingMiss ? " — 띄어쓰기 확인" : ""}
                  </p>
                  {a.item.note && <p className="text-xs text-violet-700 mt-1 leading-relaxed">💡 {a.item.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!user ? (
          <div className="mb-6 p-5 bg-violet-50 rounded-2xl border border-violet-100">
            <p className="text-sm font-bold text-violet-700 mb-4 flex items-center justify-center gap-2">
              <Star size={16} fill="currentColor" /> 랭킹에 이름을 남기고 싶으신가요?
            </p>
            <button
              onClick={() => SupabaseService.signInWithKakao()}
              className="w-full py-4 bg-[#FEE500] text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-95"
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
          <button
            onClick={() => startGame(level)}
            className="w-full py-4 bg-zinc-900 text-white text-lg font-bold rounded-2xl active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} /> 다시 도전하기
          </button>
          <button
            onClick={() => setGameState("ready")}
            className="w-full py-3 bg-zinc-100 text-zinc-600 font-bold rounded-2xl active:scale-95 transition-all"
          >
            난이도 바꾸기
          </button>
          <Link prefetch={false} href="/game" className="flex items-center justify-center gap-1 text-zinc-400 font-bold text-sm hover:text-zinc-600">
            목록으로 돌아가기 <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );

  const dictationInput = (
    <input
      data-typing-input
      data-dictation-input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={gameState !== "playing"}
      enterKeyHint="done"
      className={`w-full text-center font-bold outline-hidden transition-all ${
        isMobilePlaying
          ? "h-12 px-3 text-lg bg-zinc-800 text-white rounded-xl border-2 border-zinc-700 focus:border-violet-500 placeholder:text-zinc-500 placeholder:text-sm"
          : `h-14 md:h-20 px-5 md:px-8 text-xl md:text-3xl bg-white border-4 rounded-2xl shadow-xl ${
              gameState === "playing" ? "border-zinc-900 focus:border-violet-500" : "border-zinc-100 opacity-50"
            }`
      }`}
      placeholder={
        gameState !== "playing" ? "난이도를 고르고 시작하세요" : feedback ? (feedback.correct ? "" : "Enter를 누르면 다음 문제") : "들은 대로 입력하고 Enter"
      }
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
    />
  );

  // ── 모바일 풀스크린 ──
  if (isMobilePlaying && overlay) {
    const exitGame = () => {
      if (confirm("받아쓰기를 그만하고 결과를 볼까요?")) finishGame(score, maxCombo);
      else resume();
    };
    const hud = (
      <>
        <span className="text-sm font-bold text-zinc-300 tabular-nums">
          {index + 1}/{items.length}
        </span>
        <span className="text-sm font-bold text-violet-400 tabular-nums">{score.toLocaleString()}점</span>
        {hearts(13)}
        {combo > 1 && <span className="text-orange-400 font-bold text-xs ml-auto">🔥{combo}</span>}
      </>
    );
    const mobileInput = (
      <div className="flex items-center gap-2">
        {dictationInput}
        {!feedback && replayButton(true)}
      </div>
    );
    return (
      <>
        <MobileGameShell overlay={overlay} hud={hud} input={mobileInput} paused={paused} onResume={resume} onExit={exitGame}>
          <div className="w-full h-full bg-zinc-950">{stageBody(true)}</div>
        </MobileGameShell>
        {mounted && finishModal && createPortal(finishModal, document.body)}
      </>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-2 md:gap-4 py-2 animate-in fade-in duration-700">
      {mounted && finishModal && createPortal(finishModal, document.body)}

      <div className="hidden lg:flex w-full justify-between items-center px-8 py-4 bg-zinc-900 text-white rounded-2xl shadow-xl border border-zinc-800">
        <div className="flex gap-8 items-center">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 uppercase font-bold mb-0.5">점수</span>
            <span className="text-2xl font-bold text-violet-400 tabular-nums">{score.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 uppercase font-bold mb-0.5">문제</span>
            <span className="text-2xl font-bold tabular-nums">
              {gameState === "playing" ? index + 1 : 0}/{items.length || cfg.count}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 uppercase font-bold mb-1">목숨</span>
            {hearts(18)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {combo > 1 && <span className="text-orange-500 font-bold text-lg italic">🔥 {combo}</span>}
          <div className="text-right">
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Dictation</div>
            <div className="font-bold text-zinc-300 text-sm">받아쓰기 · {cfg.label}</div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0">
          <div
            className="relative bg-zinc-950 rounded-2xl border-4 border-zinc-900 overflow-hidden min-h-[380px] md:min-h-[400px] flex"
            style={{ backgroundImage: "radial-gradient(circle, #18181b 1px, transparent 1px)", backgroundSize: "30px 30px" }}
          >
            {gameState === "ready" && readyCard}
            {gameState !== "ready" && stageBody(false)}
          </div>
          {dictationInput}
        </div>

        <div className="flex w-full lg:w-72 bg-white rounded-2xl border border-zinc-200 p-6 shadow-lg flex-col shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-yellow-500" size={20} />
            <h3 className="text-lg font-bold">받아쓰기 랭킹</h3>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar max-h-96 lg:max-h-none">
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
                      <p className="text-[9px] font-bold text-zinc-400">{["", "쉬움", "보통", "어려움"][rank.level] || ""}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-violet-600 shrink-0">{rank.score.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-zinc-400 text-xs font-medium">기록 없음</div>
            )}
          </div>
          {!user && (
            <p className="mt-4 text-[9px] text-zinc-400 font-bold text-center leading-relaxed px-2">
              로그인하면 기록을 실시간 랭킹에 남길 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
