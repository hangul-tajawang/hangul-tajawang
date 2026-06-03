"use client";

import React from "react";
import { KakaoAdFit } from "./KakaoAdFit";

interface LeftAdBannerProps {
  unit?: string;
}

export const LeftAdBanner: React.FC<LeftAdBannerProps> = ({ 
  unit = "DAN-PLACEHOLDER_LEFT" 
}) => {
  return (
    // max-w-7xl(1280px) + 160px 배너*2 + 여백 = 약 1620px 이상일 때만 노출
    <div 
      className="fixed top-1/2 -translate-y-1/2 z-40"
      style={{
        left: 'max(8px, calc((100vw - 80rem) / 2 - 168px))',
        display: 'none',
      }}
      ref={(el) => {
        if (!el) return;
        const checkWidth = () => {
          const leftSpace = (window.innerWidth - 1280) / 2;
          el.style.display = leftSpace >= 168 ? 'block' : 'none';
        };
        checkWidth();
        window.addEventListener('resize', checkWidth);
      }}
    >
      <KakaoAdFit unit={unit} width={160} height={600} />
    </div>
  );
};

