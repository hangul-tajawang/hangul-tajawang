"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trophy, RotateCcw, ChevronRight, Share2, Check } from "lucide-react";
import { TypingUtils } from "@/lib/typing-speed";
import type { JourneyCourse } from "@/lib/journey-data";

interface JourneyCompleteProps {
  course: JourneyCourse;
  stationCount: number;
  kpm: number;
  accuracy: number;
  seconds: number;
  /** 이번 완주 포함 누적 완주 횟수 */
  completionCount: number;
  onRestart: () => void;
}

export const JourneyComplete: React.FC<JourneyCompleteProps> = ({
  course,
  stationCount,
  kpm,
  accuracy,
  seconds,
  completionCount,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const text = `⌨️ 한글타자왕 지식타자\n${course.title} ${stationCount}개 완주! ${kpm}타 · 정확도 ${accuracy}%\nhttps://www.hangul-tajawang.com/journey/${course.id}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 미지원 환경은 조용히 무시 */
    }
  };

  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-xl animate-in fade-in duration-500" />
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar glass-card !bg-surface-lowest/90 !rounded-2xl p-8 text-center animate-in zoom-in duration-500">
        <div className="inline-flex p-6 bg-secondary-container/60 rounded-full mb-6">
          <Trophy className="w-16 h-16 text-tertiary" />
        </div>
        <h2 className="editorial-heading text-3xl mb-2">
          {course.emoji} {course.title} 완주!
        </h2>
        <p className="text-secondary font-bold mb-8">
          {stationCount}개 역을 모두 지나 종착역에 도착했습니다.
          {completionCount > 1 && ` 벌써 ${completionCount}번째 완주예요.`}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-surface-low p-5 rounded-2xl">
            <p className="text-[10px] font-bold text-secondary/70 uppercase mb-1 tracking-widest">타수</p>
            <p className="text-2xl font-bold text-primary">{kpm}</p>
          </div>
          <div className="bg-surface-low p-5 rounded-2xl">
            <p className="text-[10px] font-bold text-secondary/70 uppercase mb-1 tracking-widest">정확도</p>
            <p className="text-2xl font-bold text-on-surface">{accuracy}%</p>
          </div>
          <div className="bg-surface-low p-5 rounded-2xl">
            <p className="text-[10px] font-bold text-secondary/70 uppercase mb-1 tracking-widest">시간</p>
            <p className="text-2xl font-bold text-on-surface">{mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`}</p>
          </div>
        </div>
        <p className="text-sm font-bold text-secondary mb-8">{TypingUtils.getGrade(kpm, accuracy)}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={share}
            className="w-full py-4 primary-gradient text-white font-bold rounded-2xl transition-all shadow-xl hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
          >
            {copied ? <Check size={20} /> : <Share2 size={20} />}
            {copied ? "복사 완료! 친구에게 자랑하세요" : "기록 공유하기"}
          </button>
          <button
            onClick={onRestart}
            className="w-full py-4 bg-on-surface text-surface-lowest font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} /> 처음부터 다시 외우기
          </button>
          <Link
            prefetch={false}
            href="/journey"
            className="flex items-center justify-center gap-2 text-secondary/80 font-bold text-sm hover:text-on-surface transition-colors py-2"
          >
            다른 여정 보러 가기 <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
