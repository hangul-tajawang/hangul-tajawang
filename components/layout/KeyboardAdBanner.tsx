"use client";

import React from "react";
import { KakaoAdFit } from "./KakaoAdFit";
import { Sparkles } from "lucide-react";

interface KeyboardAdBannerProps {
  className?: string;
  unit?: string;
  mobileUnit?: string;
}

export const KeyboardAdBanner: React.FC<KeyboardAdBannerProps> = ({
  className = "",
  unit,
  mobileUnit,
}) => {
  if (!unit && !mobileUnit) return null;

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-8 ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-surface-high rounded-full text-primary font-black text-xs tracking-widest uppercase mb-4">
          <Sparkles size={14} /> 스폰서 광고
        </div>
      </div>
      
      <div className="w-full bg-surface-lowest rounded-[2.5rem] p-6 shadow-sm border border-outline-variant flex flex-col items-center justify-center overflow-hidden">
        {/* PC용 (728x90) */}
        <div className="hidden md:block w-full flex justify-center">
          {unit && <KakaoAdFit unit={unit} width={728} height={90} />}
        </div>
        
        {/* 모바일용 (320x100) */}
        <div className="block md:hidden w-full flex justify-center">
          {mobileUnit && <KakaoAdFit unit={mobileUnit} width={320} height={100} />}
        </div>
      </div>
    </div>
  );
};
