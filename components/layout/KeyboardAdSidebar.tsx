"use client";

import React, { useState } from "react";
import { Sparkles, X, ChevronLeft } from "lucide-react";
import { AdSenseUnit } from "./AdSenseUnit";

export const KeyboardAdSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div 
        onClick={() => setIsCollapsed(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-surface-lowest border border-outline-variant shadow-lg rounded-l-2xl p-3 cursor-pointer hover:bg-surface-high transition-all flex flex-col items-center gap-4 z-50 group"
      >
        <ChevronLeft size={16} className="text-zinc-400 group-hover:-translate-x-1 transition-transform" />
        <span className="text-primary font-black text-xs tracking-[0.3em] [writing-mode:vertical-rl] uppercase">
          스폰서 광고 보기
        </span>
      </div>
    );
  }

  return (
    <div className="w-[300px] flex flex-col gap-6 relative bg-surface-low/30 p-2 -mx-2 rounded-[2rem] transition-all duration-500">
      <button 
        onClick={() => setIsCollapsed(true)}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-surface-lowest border border-outline-variant text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-surface-high rounded-full transition-all shadow-sm z-10 group"
      >
        <span className="text-[10px] font-black tracking-widest">접어두기</span>
        <X size={12} className="group-hover:rotate-90 transition-transform" />
      </button>
      
      <div className="flex flex-col px-2 pt-2">
        <span className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary" /> Sponsor
        </span>
        <h3 className="text-lg font-black text-on-surface leading-tight">
          한글타자왕<br/>후원 광고
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center">
        {/* 애드센스 사이드 사각형 (300x250) */}
        <AdSenseUnit label="keyboard-sidebar" width={300} height={250} />
      </div>
    </div>
  );
};
