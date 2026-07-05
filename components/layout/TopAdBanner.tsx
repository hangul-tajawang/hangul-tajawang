"use client";

import React from "react";
import { KakaoAdFit } from "./KakaoAdFit";

// 모바일 전용 유닛 (320x50 띠배너)
const MOBILE_UNIT = "DAN-R4TseV9bxlUFOMxZ";

export const TopAdBanner: React.FC = () => {
  return (
    <>
      {/* PC: 728x90 — 모바일에서 이 사이즈를 요청하면 애드핏이 채우지 못해
          fill rate만 떨어뜨리므로 md 이상에서만 렌더링 */}
      <div className="hidden md:flex w-full items-center justify-center bg-surface-lowest border-b border-outline-variant py-1.5">
        <KakaoAdFit unit="DAN-h8SPjWplFDoELa1Q" width={728} height={90} />
      </div>

      {/* 모바일: 전용 유닛이 있을 때만 노출 */}
      {MOBILE_UNIT && (
        <div className="flex md:hidden w-full items-center justify-center bg-surface-lowest border-b border-outline-variant py-1.5">
          <KakaoAdFit unit={MOBILE_UNIT} width={320} height={50} />
        </div>
      )}
    </>
  );
};
