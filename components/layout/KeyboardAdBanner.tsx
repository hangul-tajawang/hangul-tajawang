"use client";

import React from "react";
import { KakaoAdFit } from "./KakaoAdFit";
import { Sparkles } from "lucide-react";

interface KeyboardAdBannerProps {
  className?: string;
  unit?: string;        // PC용 (728x90)
  mobileUnit?: string;  // 모바일용 (320x100)
}

export const KeyboardAdBanner: React.FC<KeyboardAdBannerProps> = ({
  className = "",
  unit,
  mobileUnit = "DAN-g5eKNJgf7aUxr2F3", // 모바일 본문 기본 유닛 (320x100)
}) => {
  if (!unit && !mobileUnit) return null;

  return (
    // PC 유닛이 없으면 모바일에서만 노출 (PC에 빈 프레임 방지)
    <div className={`w-full max-w-5xl mx-auto px-4 py-8 ${!unit ? "md:hidden" : ""} ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-surface-high rounded-full text-primary font-black text-xs tracking-widest uppercase mb-4">
          <Sparkles size={14} /> 스폰서 광고
        </div>
      </div>

      <div className="w-full bg-surface-lowest rounded-[2.5rem] p-4 md:p-6 shadow-sm border border-outline-variant flex flex-col items-center justify-center overflow-hidden">
        {/* PC용 (728x90) */}
        {unit && (
          <div className="hidden md:flex w-full justify-center">
            <KakaoAdFit unit={unit} width={728} height={90} />
          </div>
        )}

        {/* 모바일용 (320x100) */}
        {mobileUnit && (
          <div className="flex md:hidden w-full justify-center">
            <KakaoAdFit unit={mobileUnit} width={320} height={100} />
          </div>
        )}
      </div>
    </div>
  );
};
