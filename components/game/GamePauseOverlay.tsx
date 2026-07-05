"use client";

import React from "react";
import { Play } from "lucide-react";

/**
 * 모바일 일시정지 오버레이.
 * 입력창이 blur되어(자판 내려감) 게임이 멈췄을 때 게임 영역 위에 덮인다.
 * 탭하면 onResume이 호출되어 입력창을 재포커스하고 게임을 재개한다.
 */
export const GamePauseOverlay: React.FC<{ onResume: () => void }> = ({ onResume }) => (
  <button
    type="button"
    onClick={onResume}
    className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
  >
    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
      <Play size={30} fill="currentColor" className="ml-1" />
    </div>
    <span className="text-white font-black text-lg">탭해서 계속</span>
    <span className="text-white/50 font-bold text-xs">화면을 누르면 이어서 진행됩니다</span>
  </button>
);
