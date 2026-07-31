"use client";

import React from "react";
import { AdSenseUnit } from "./AdSenseUnit";


export const TopAdBanner: React.FC = () => {
  return (
    <>
      {/* PC: 728x90 — 모바일과 지면을 분리해 md 이상에서만 렌더링 */}
      <div className="hidden md:flex w-full items-center justify-center bg-surface-lowest border-b border-outline-variant py-1.5">
        <AdSenseUnit label="top-banner-pc" width={728} height={90} />
      </div>

      {/* 모바일: 320x50 띠배너 */}
      <div className="flex md:hidden w-full items-center justify-center bg-surface-lowest border-b border-outline-variant py-1.5">
        <AdSenseUnit label="top-banner-mobile" width={320} height={50} />
      </div>
    </>
  );
};
